import { createSupabaseServerClient } from "@/lib/supabase/server";
import { el } from "@/lib/i18n/el";
import { formatDate } from "@/lib/format";
import type { GradingSession, ExamPaper } from "@/lib/types";

export default async function HistoryPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null; // layout shows the "not configured" notice
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("grading_sessions")
    .select("*, exam_papers(title_el)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const sessions =
    (data as (GradingSession & { exam_papers: Pick<ExamPaper, "title_el"> })[] | null) ??
    [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark">
        {el.account.historyTitle}
      </h1>

      {sessions.length === 0 ? (
        <div className="mt-6 p-6 rounded-lg border border-dashed border-border text-muted">
          {el.account.noHistory}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-brand-light text-left">
              <tr>
                <th className="px-4 py-3">{el.account.date}</th>
                <th className="px-4 py-3">{el.account.student}</th>
                <th className="px-4 py-3">Θέμα</th>
                <th className="px-4 py-3">{el.account.score}</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-border bg-white">
                  <td className="px-4 py-3">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3">{s.student_name ?? "·"}</td>
                  <td className="px-4 py-3">{s.exam_papers?.title_el}</td>
                  <td className="px-4 py-3 font-semibold">
                    {s.score} / {s.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
