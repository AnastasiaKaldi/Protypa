import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";

// ─── Constants ───────────────────────────────────────────────────────────────
// Every Προσομοίωση has 20 Γλώσσα questions (1-20) followed by 20 Μαθηματικά (21-40).
const GREEK_QUESTIONS = 20;
const MATH_QUESTIONS = 20;
const TOTAL_QUESTIONS = GREEK_QUESTIONS + MATH_QUESTIONS;

// Expected header names in each sheet (row 1).
const HEADER_QUESTION = "Ερώτηση";
const HEADER_CATEGORY = "Κατηγορία";

type Subject = "greek" | "math";
type TagRow = {
  simulation_id: string;
  question_number: number;
  subject: Subject;
  category: string;
};
type SheetReport = {
  sheet: string;
  status: "ok" | "warning" | "skipped";
  message: string;
  count: number;
};

// ─── Handler ─────────────────────────────────────────────────────────────────
// POST /api/admin/question-tags
//   multipart/form-data with `file=<xlsx>`
// Parses each sheet, validates, and bulk-upserts into simulation_question_tags.
// Sheets are matched to simulations by sheet-name === simulations.number.
export async function POST(req: Request) {
  // 1. Auth gate — must be an admin profile.
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 2. Read the uploaded file.
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Δεν ήταν δυνατή η ανάγνωση του αρχείου." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Δεν επιλέχθηκε αρχείο." }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return NextResponse.json({ error: "Παρακαλούμε ανεβάστε αρχείο .xlsx." }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    return NextResponse.json({ error: "Το αρχείο δεν αναγνωρίστηκε ως έγκυρο Excel." }, { status: 400 });
  }

  // 3. Build a number → simulation lookup so we can match sheets.
  const admin = createSupabaseServiceClient();
  const { data: sims, error: simsErr } = await admin
    .from("simulations")
    .select("id, number, title");
  if (simsErr) {
    return NextResponse.json({ error: simsErr.message }, { status: 500 });
  }
  const simByNumber = new Map<number, { id: string; title: string }>();
  for (const s of sims ?? []) {
    simByNumber.set(s.number, { id: s.id, title: s.title });
  }

  // 4. Walk every sheet, parse, collect tag rows.
  const tagsToUpsert: TagRow[] = [];
  const sheetReports: SheetReport[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheetNumber = Number(sheetName.trim());
    if (!Number.isInteger(sheetNumber)) {
      sheetReports.push({
        sheet: sheetName,
        status: "skipped",
        message: "Το όνομα του φύλλου δεν είναι αριθμός — παραλείπεται.",
        count: 0,
      });
      continue;
    }
    const sim = simByNumber.get(sheetNumber);
    if (!sim) {
      sheetReports.push({
        sheet: sheetName,
        status: "skipped",
        message: `Δεν υπάρχει διαγώνισμα με αριθμό ${sheetNumber}.`,
        count: 0,
      });
      continue;
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });

    const seen = new Set<number>();
    let validCount = 0;
    for (const row of rows) {
      const qRaw = row[HEADER_QUESTION];
      const catRaw = row[HEADER_CATEGORY];
      const q = Number(qRaw);
      const category = String(catRaw ?? "").trim();
      if (
        !Number.isInteger(q) ||
        q < 1 ||
        q > TOTAL_QUESTIONS ||
        seen.has(q) ||
        !category
      ) {
        continue;
      }
      seen.add(q);
      const subject: Subject = q <= GREEK_QUESTIONS ? "greek" : "math";
      tagsToUpsert.push({
        simulation_id: sim.id,
        question_number: q,
        subject,
        category,
      });
      validCount++;
    }

    sheetReports.push({
      sheet: sheetName,
      status: validCount === TOTAL_QUESTIONS ? "ok" : "warning",
      message:
        validCount === TOTAL_QUESTIONS
          ? `${sim.title} — ${validCount} ερωτήσεις κατηγοριοποιήθηκαν.`
          : `${sim.title} — βρέθηκαν ${validCount} έγκυρες ερωτήσεις (αναμένονταν ${TOTAL_QUESTIONS}). Έλεγχος μορφής.`,
      count: validCount,
    });
  }

  if (tagsToUpsert.length === 0) {
    return NextResponse.json(
      {
        error:
          "Δεν βρέθηκαν έγκυρες κατηγοριοποιήσεις. Βεβαιωθείτε ότι οι στήλες είναι 'Ερώτηση' και 'Κατηγορία' και ότι τα ονόματα φύλλων είναι αριθμοί.",
        sheets: sheetReports,
      },
      { status: 400 },
    );
  }

  // 5. Bulk upsert. The unique (simulation_id, question_number) constraint
  // means re-uploads update the same row instead of duplicating it.
  const { error: upsertErr } = await admin
    .from("simulation_question_tags")
    .upsert(tagsToUpsert, { onConflict: "simulation_id,question_number" });
  if (upsertErr) {
    return NextResponse.json(
      { error: upsertErr.message, sheets: sheetReports },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    updated: tagsToUpsert.length,
    sheets: sheetReports,
  });
}
