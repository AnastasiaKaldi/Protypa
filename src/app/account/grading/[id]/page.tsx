import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Simulation, SchoolSimulation, StudentSimulationGrade, Student, SimulationQuestionTag } from "@/lib/types";
import GradingSheet from "./GradingSheet";

export default async function GradingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const now = new Date().toISOString();

  const [{ data: simRow }, { data: participationRow }, { data: studentsRow }, { data: tagsRow }] = await Promise.all([
    supabase.from("simulations").select("*").eq("id", id).eq("is_published", true).maybeSingle(),
    supabase.from("school_simulations").select("*").eq("school_id", user.id).eq("simulation_id", id).maybeSingle(),
    supabase.from("students").select("*").eq("school_id", user.id).order("last_name"),
    supabase.from("simulation_question_tags").select("*").eq("simulation_id", id),
  ]);

  if (!simRow) notFound();
  const simulation = simRow as Simulation;
  const participation = participationRow as SchoolSimulation | null;
  const students = (studentsRow as Student[]) ?? [];
  const tags = (tagsRow as SimulationQuestionTag[]) ?? [];

  // Enforce unlock gate
  if (!simulation.unlocks_at || simulation.unlocks_at > now) {
    return (
      <div className="space-y-4">
        <Link href="/account/grading" className="text-xs text-ink/40 hover:text-ink/60 transition-colors">← Πίσω</Link>
        <div className="rounded-3xl border-2 border-dashed border-ink/10 p-12 text-center">
          <div className="font-display text-5xl text-ink/10 mb-4">🔒</div>
          <h2 className="font-display text-2xl text-ink">{simulation.title}</h2>
          <p className="mt-3 text-sm text-ink/50">
            Το Διαγώνισμα δεν έχει ξεκλειδωθεί ακόμα.
            {simulation.unlocks_at && (
              <> Ξεκλείδωμα: <strong>{new Date(simulation.unlocks_at).toLocaleDateString("el-GR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</strong></>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Load existing named student grades
  let existingGrades: StudentSimulationGrade[] = [];
  if (participation?.id) {
    const { data } = await supabase
      .from("student_simulation_grades")
      .select("*")
      .eq("school_simulation_id", participation.id);
    existingGrades = (data as StudentSimulationGrade[]) ?? [];
  }

  const closed = simulation.grading_closes_at && simulation.grading_closes_at <= now;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Link href="/account/grading" className="text-xs text-ink/40 hover:text-ink/60 transition-colors mt-1">← Πίσω</Link>
        <div className="flex-1">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-1">Βαθμολόγηση</div>
          <h1 className="font-display text-2xl md:text-3xl text-ink">{simulation.title}</h1>
          <div className="flex flex-wrap gap-4 mt-1 text-xs text-ink/40">
            <span>{simulation.greek_questions + simulation.math_questions} ερωτήσεις ({simulation.greek_questions} Γλώσσα + {simulation.math_questions} Μαθ/κά)</span>
            {simulation.exam_date && (
              <span>Εξέταση: {new Date(simulation.exam_date).toLocaleDateString("el-GR")}</span>
            )}
            {simulation.grading_closes_at && (
              <span className={closed ? "text-red-500 font-bold" : ""}>
                {closed ? "⚠ Έληξε η προθεσμία" : `Καταχώρηση έως: ${new Date(simulation.grading_closes_at).toLocaleDateString("el-GR", { day: "2-digit", month: "short" })}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {closed && !participation?.is_submitted ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
          <p className="text-sm text-red-700 font-medium">Η προθεσμία καταχώρησης έχει λήξει για αυτή την Προσομοίωση.</p>
        </div>
      ) : (
        <GradingSheet
          simulation={simulation}
          participation={participation}
          students={students}
          existingGrades={existingGrades}
          tags={tags}
          schoolSimulationId={participation?.id ?? null}
          userId={user.id}
        />
      )}
    </div>
  );
}
