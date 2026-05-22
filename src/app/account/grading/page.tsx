import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Simulation, SchoolSimulation } from "@/lib/types";

export default async function GradingListPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <GradingPreview />;

  const now = new Date().toISOString();

  const [{ data: simulations }, { data: myParticipations }] = await Promise.all([
    supabase.from("simulations").select("*").eq("is_published", true).order("number"),
    supabase.from("school_simulations").select("*").eq("school_id", user.id),
  ]);

  const sims = (simulations as Simulation[]) ?? [];
  const participationMap = new Map(((myParticipations as SchoolSimulation[]) ?? []).map((p) => [p.simulation_id, p]));

  return <GradingView sims={sims} participationMap={participationMap} now={now} />;
}

// ─── View ────────────────────────────────────────────────────────────────────

function GradingView({ sims, participationMap, now, isPreview = false }: {
  sims: Simulation[]; participationMap: Map<string, SchoolSimulation>;
  now: string; isPreview?: boolean;
}) {
  const available = sims.filter((s) => s.unlocks_at && s.unlocks_at <= now);
  const submitted = sims.filter((s) => participationMap.get(s.id)?.is_submitted);
  const pending = available.filter((s) => !participationMap.get(s.id)?.is_submitted && (!s.grading_closes_at || s.grading_closes_at > now));
  const locked = sims.length - available.length;

  const nextDeadline = pending
    .filter((s) => s.grading_closes_at)
    .sort((a, b) => (a.grading_closes_at ?? "").localeCompare(b.grading_closes_at ?? ""))[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs text-ink/45">Βαθμολόγηση</div>
        <h1 className="font-display text-2xl text-ink mt-1">Διαγωνίσματα</h1>
        <p className="text-sm text-ink/55 mt-1">Ύλη, θέματα και καταχώρηση απαντήσεων ανά διαγώνισμα.</p>
      </div>

      {/* KPI strip — dividers, no accents */}
      {sims.length > 0 && (
        <div className="border-y border-ink/10 divide-x divide-ink/10 grid grid-cols-2 md:grid-cols-4">
          <Kpi label="Σύνολο"       value={sims.length} />
          <Kpi label="Διαθέσιμα"    value={available.length} />
          <Kpi label="Υποβλήθηκαν" value={submitted.length} />
          <Kpi label="Κλειδωμένα"   value={locked} />
        </div>
      )}

      {/* Next deadline notice */}
      {nextDeadline && <DeadlineNotice sim={nextDeadline} isPreview={isPreview} />}

      {sims.length === 0 ? (
        <div className="border border-ink/10 rounded-md px-4 py-12 text-center">
          <p className="text-sm text-ink/50">Δεν υπάρχουν ακόμα δημοσιευμένα Διαγωνίσματα.</p>
          <p className="text-xs text-ink/40 mt-2">Θα ειδοποιηθείτε με email όταν ξεκλειδωθεί το πρώτο.</p>
        </div>
      ) : (
        <SimulationsTable sims={sims} participationMap={participationMap} now={now} isPreview={isPreview} />
      )}

      {isPreview && (
        <p className="text-xs text-ink/40 pt-4 border-t border-ink/8">
          Προεπισκόπηση με δείγματα δεδομένων. Συνδεθείτε για πραγματικά Διαγωνίσματα.
        </p>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-4 first:pl-0">
      <div className="text-[11px] text-ink/50">{label}</div>
      <div className="font-display text-2xl text-ink mt-1 tabular">{value}</div>
    </div>
  );
}

function DeadlineNotice({ sim, isPreview }: { sim: Simulation; isPreview: boolean }) {
  if (!sim.grading_closes_at) return null;
  const diff = new Date(sim.grading_closes_at).getTime() - Date.now();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const urgent = days < 3;
  const href = isPreview ? "/account/grading/preview" : `/account/grading/${sim.id}`;

  return (
    <div className={`flex items-center justify-between gap-4 border-l-2 ${urgent ? "border-red-500 bg-red-50/40" : "border-[#056ef5] bg-[#056ef5]/4"} px-4 py-3 rounded-r-md`}>
      <div className="min-w-0">
        <div className={`text-[11px] font-semibold uppercase tracking-wider ${urgent ? "text-red-700" : "text-[#056ef5]"}`}>
          {urgent ? "Επείγουσα προθεσμία" : "Επόμενη προθεσμία"}
        </div>
        <div className="text-sm text-ink mt-0.5 truncate">{sim.title}</div>
        <div className="text-xs text-ink/55 mt-0.5">
          {days === 0 ? "Λήγει σήμερα" : days === 1 ? "1 ημέρα απομένει" : `${days} ημέρες απομένουν`}
        </div>
      </div>
      <Link href={href} className="flex-shrink-0 text-xs font-bold text-[#056ef5] hover:text-[#0451b8] whitespace-nowrap">
        Έναρξη →
      </Link>
    </div>
  );
}

// ─── Table ───────────────────────────────────────────────────────────────────

function SimulationsTable({ sims, participationMap, now, isPreview }: {
  sims: Simulation[]; participationMap: Map<string, SchoolSimulation>;
  now: string; isPreview: boolean;
}) {
  return (
    <div className="border border-ink/10 rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-[#fafaf8]">
              <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55 w-12">#</th>
              <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55">Διαγώνισμα</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55 text-center hidden md:table-cell">Ύλη</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55 text-center hidden md:table-cell">Θέματα</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55 text-right hidden sm:table-cell">Συμμετοχή</th>
              <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55 text-right">Κατάσταση</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {sims.map((sim) => {
              const p = participationMap.get(sim.id);
              const unlocked = sim.unlocks_at && sim.unlocks_at <= now;
              const closed = sim.grading_closes_at && sim.grading_closes_at <= now;
              const submitted = p?.is_submitted;

              return (
                <tr key={sim.id} className={`row-hover ${!unlocked ? "text-ink/45" : "text-ink"}`}>
                  <td className="px-3 py-3 tabular text-xs text-ink/60">{sim.number}</td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-ink leading-tight">{sim.title}</div>
                    {sim.exam_date && (
                      <div className="text-[11px] text-ink/45 mt-0.5">
                        {new Date(sim.exam_date).toLocaleDateString("el-GR", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center hidden md:table-cell">
                    {sim.material_url
                      ? <a href={sim.material_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#056ef5] hover:underline">PDF</a>
                      : <span className="text-xs text-ink/30">—</span>}
                  </td>
                  <td className="px-3 py-3 text-center hidden md:table-cell">
                    {sim.questions_url
                      ? <a href={sim.questions_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#056ef5] hover:underline">PDF</a>
                      : <span className="text-xs text-ink/30">—</span>}
                  </td>
                  <td className="px-3 py-3 text-right hidden sm:table-cell">
                    {p?.student_count != null ? (
                      <span className="text-sm tabular">{p.student_count}</span>
                    ) : <span className="text-xs text-ink/30">—</span>}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <StatusCell
                      sim={sim}
                      unlocked={!!unlocked}
                      submitted={!!submitted}
                      closed={!!closed}
                      p={p}
                      isPreview={isPreview}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusCell({ sim, unlocked, submitted, closed, p, isPreview }: {
  sim: Simulation; unlocked: boolean; submitted: boolean; closed: boolean;
  p: SchoolSimulation | undefined; isPreview: boolean;
}) {
  if (!unlocked) return <StatusDot color="#94a3b8" label="Κλειδωμένο" />;
  if (submitted) return <StatusDot color="#10b981" label="Υποβλήθηκε" />;
  if (closed)    return <StatusDot color="#ef4444" label="Έληξε" />;
  const href = isPreview ? "/account/grading/preview" : `/account/grading/${sim.id}`;
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#056ef5] hover:text-[#0451b8]">
      {p ? "Συνέχεια" : "Έναρξη"} →
    </Link>
  );
}

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink/60">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

// ─── Preview ────────────────────────────────────────────────────────────────

const PREVIEW_SIMS: Simulation[] = [
  { id: "p1", number: 1, title: "Διαγώνισμα 1 — Νοέμβριος 2024", subject: "bundle", exam_date: "2024-11-16", unlocks_at: "2024-11-16T09:00:00Z", grading_closes_at: "2024-12-01T23:59:00Z", greek_questions: 20, math_questions: 20, is_published: true, material_url: null, questions_url: null, created_at: "" },
  { id: "p2", number: 2, title: "Διαγώνισμα 2 — Δεκέμβριος 2024", subject: "bundle", exam_date: "2024-12-14", unlocks_at: "2024-12-14T09:00:00Z", grading_closes_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), greek_questions: 20, math_questions: 20, is_published: true, material_url: null, questions_url: null, created_at: "" },
  { id: "p3", number: 3, title: "Διαγώνισμα 3 — Φεβρουάριος 2025", subject: "bundle", exam_date: "2025-02-08", unlocks_at: "2099-02-08T09:00:00Z", grading_closes_at: null, greek_questions: 20, math_questions: 20, is_published: true, material_url: null, questions_url: null, created_at: "" },
  { id: "p4", number: 4, title: "Διαγώνισμα 4 — Μάρτιος 2025", subject: "bundle", exam_date: "2025-03-15", unlocks_at: "2099-03-15T09:00:00Z", grading_closes_at: null, greek_questions: 20, math_questions: 20, is_published: true, material_url: null, questions_url: null, created_at: "" },
];

const PREVIEW_PARTICIPATIONS: SchoolSimulation[] = [
  { id: "pp1", school_id: "preview", simulation_id: "p1", student_count: 8, is_submitted: true, submitted_at: "2024-11-28T14:00:00Z" },
  { id: "pp2", school_id: "preview", simulation_id: "p2", student_count: 7, is_submitted: false, submitted_at: null },
];

function GradingPreview() {
  const now = new Date().toISOString();
  const participationMap = new Map(PREVIEW_PARTICIPATIONS.map((p) => [p.simulation_id, p]));
  return <GradingView sims={PREVIEW_SIMS} participationMap={participationMap} now={now} isPreview />;
}
