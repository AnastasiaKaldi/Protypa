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

  // No unlock gate — grading (and re-grading) is always available.
  // The exam PDF download is still gated on the listing page so future
  // papers don't leak to students before exam day, but the grading sheet
  // itself opens up regardless.

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

      {closed && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          <strong className="font-bold">Σημείωση:</strong> Η προθεσμία στατιστικών για αυτό το διαγώνισμα έχει λήξει.
          Μπορείτε ακόμα να καταχωρήσετε ή να επεξεργαστείτε βαθμολογίες, αλλά οι νέες καταχωρήσεις
          <strong className="font-semibold"> δεν θα συμπεριλαμβάνονται στα στατιστικά</strong> των μαθητών σας ή του τμήματος.
        </div>
      )}

      <GradingSheet
        simulation={simulation}
        participation={participation}
        students={students}
        existingGrades={existingGrades}
        tags={tags}
        schoolSimulationId={participation?.id ?? null}
        userId={user.id}
      />
    </div>
  );
}
