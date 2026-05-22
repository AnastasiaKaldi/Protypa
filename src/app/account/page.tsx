import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActivePackages } from "@/lib/entitlements";
import { formatDate } from "@/lib/format";

// ─── Types ───────────────────────────────────────────────────────────────────

type Kpi = { label: string; value: string | number; sub?: string };
type Activity = { kind: "graded" | "student" | "package" | "unlock"; title: string; subtitle: string; when: string };
type TopStudent = { name: string; class_year: string | null; score: number };
type HistoryPoint = { label: string; value: number };
type NextExam = { title: string; closes_at: string; href: string; number?: number } | null;
type PackageItem = { name: string; expires: string };

interface DashboardData {
  name: string;
  kpis: Kpi[];
  nextExam: NextExam;
  history: HistoryPoint[];
  activity: Activity[];
  topStudents: TopStudent[];
  packages: PackageItem[];
  purchaseSuccess?: boolean;
  isPreview?: boolean;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AccountDashboard({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <DashboardView {...PREVIEW_DATA} purchaseSuccess={sp.purchase === "success"} />;

  const [{ data: profile }, { data: students }, { data: grades }, { data: sims }, active] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase.from("students").select("id, first_name, last_name, class_year, created_at").eq("school_id", user.id),
    supabase.from("student_simulation_grades").select("*").order("submitted_at", { ascending: false }),
    supabase.from("simulations").select("*").eq("is_published", true).order("number"),
    getActivePackages(user.id),
  ]);

  const studentList = students ?? [];
  const gradesList = grades ?? [];
  const simsList = sims ?? [];
  const now = new Date().toISOString();

  const avgScore = gradesList.length ? Math.round(gradesList.reduce((a, g) => a + (g.score ?? 0), 0) / gradesList.length) : 0;
  const availableSims = simsList.filter((s) => s.unlocks_at && s.unlocks_at <= now);
  const upcomingSim = simsList.find((s) => s.unlocks_at && s.unlocks_at <= now && (!s.grading_closes_at || s.grading_closes_at > now));

  const kpis: Kpi[] = [
    { label: "Μαθητές",      value: studentList.length, sub: studentList.length === 1 ? "καταχωρημένος" : "καταχωρημένοι" },
    { label: "Μέσος βαθμός", value: avgScore || "—",    sub: gradesList.length ? `${gradesList.length} βαθμολογήσεις` : "καμία ακόμα" },
    { label: "Διαγωνίσματα", value: simsList.length,    sub: `${availableSims.length} διαθέσιμα` },
    { label: "Πακέτα",       value: active.length,      sub: active.length ? "ενεργά" : "κανένα" },
  ];

  const nextExam: NextExam = upcomingSim
    ? { title: upcomingSim.title, closes_at: upcomingSim.grading_closes_at ?? "", href: `/account/grading/${upcomingSim.id}`, number: upcomingSim.number }
    : null;

  const bySim = new Map<string, number[]>();
  for (const g of gradesList) {
    if (!bySim.has(g.simulation_id)) bySim.set(g.simulation_id, []);
    bySim.get(g.simulation_id)!.push(g.score ?? 0);
  }
  const history: HistoryPoint[] = simsList
    .filter((s) => bySim.has(s.id))
    .slice(-5)
    .map((s) => {
      const scores = bySim.get(s.id)!;
      return { label: `Δ${s.number}`, value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) };
    });

  const studentAvgs = new Map<string, { sum: number; n: number }>();
  for (const g of gradesList) {
    const cur = studentAvgs.get(g.student_id) ?? { sum: 0, n: 0 };
    cur.sum += g.score ?? 0; cur.n += 1;
    studentAvgs.set(g.student_id, cur);
  }
  const topStudents: TopStudent[] = Array.from(studentAvgs.entries())
    .map(([sid, { sum, n }]) => {
      const stu = studentList.find((s) => s.id === sid);
      return stu ? { name: `${stu.last_name} ${stu.first_name}`, class_year: stu.class_year, score: Math.round(sum / n) } : null;
    })
    .filter((x): x is TopStudent => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const activity: Activity[] = [];
  for (const g of gradesList.slice(0, 3)) {
    const sim = simsList.find((s) => s.id === g.simulation_id);
    const stu = studentList.find((s) => s.id === g.student_id);
    if (sim && stu) {
      activity.push({
        kind: "graded",
        title: `${sim.title}`,
        subtitle: `${stu.last_name} ${stu.first_name} · βαθμός ${g.score}`,
        when: relativeTime(g.submitted_at),
      });
    }
  }
  for (const s of studentList.slice(0, 2).sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))) {
    if (!s.created_at) continue;
    const ageDays = (Date.now() - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays < 14) {
      activity.push({
        kind: "student",
        title: `${s.last_name} ${s.first_name}`,
        subtitle: `Νέος μαθητής · ${s.class_year ?? "—"}`,
        when: relativeTime(s.created_at),
      });
    }
  }

  return (
    <DashboardView
      name={profile?.full_name ?? user.email ?? ""}
      kpis={kpis}
      nextExam={nextExam}
      history={history}
      activity={activity.slice(0, 5)}
      topStudents={topStudents}
      packages={active.map((a) => ({ name: a.pkg.name_el, expires: formatDate(a.purchase.expires_at) }))}
      purchaseSuccess={sp.purchase === "success"}
    />
  );
}

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "πρόσφατα";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return mins <= 1 ? "μόλις τώρα" : `${mins} λ.`;
  if (hours < 24) return `${hours} ώ.`;
  if (days === 1) return "χθες";
  if (days < 7) return `${days} ημ.`;
  if (days < 30) return `${Math.floor(days / 7)} εβδ.`;
  return new Date(iso).toLocaleDateString("el-GR", { day: "2-digit", month: "short" });
}

// ─── View ────────────────────────────────────────────────────────────────────

function DashboardView(d: DashboardData) {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Καλημέρα" : now.getHours() < 18 ? "Καλό μεσημέρι" : "Καλησπέρα";
  const firstName = (d.name || "").split(" ")[0] || d.name;
  const dateLabel = now.toLocaleDateString("el-GR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div>
        <div className="text-xs text-ink/45 capitalize">{dateLabel}</div>
        <h1 className="font-display text-2xl text-ink mt-1">
          {greeting}{firstName && `, ${firstName}`}
        </h1>
      </div>

      {d.purchaseSuccess && (
        <div className="border-l-2 border-green-500 bg-green-50 px-4 py-3 text-sm text-green-900">
          Η αγορά ολοκληρώθηκε με επιτυχία.
        </div>
      )}

      {/* KPI strip — dividers, no cards */}
      <div className="border-y border-ink/10 divide-x divide-ink/10 grid grid-cols-2 md:grid-cols-4">
        {d.kpis.map((k) => (
          <div key={k.label} className="px-4 py-4 first:pl-0">
            <div className="text-[11px] text-ink/50">{k.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-2xl text-ink tabular">{k.value}</span>
              {k.sub && <span className="text-[11px] text-ink/45">{k.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column: next exam + activity */}
      <div className="grid lg:grid-cols-2 gap-10">
        <NextExamSection exam={d.nextExam} />
        <ActivitySection activity={d.activity} />
      </div>

      {/* Performance + Top students */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <PerformanceSection history={d.history} />
        <TopStudentsSection students={d.topStudents} />
      </div>

      {/* Packages */}
      <PackagesSection packages={d.packages} />

      {d.isPreview && (
        <p className="text-xs text-ink/40 pt-4 border-t border-ink/8">
          Προεπισκόπηση με δείγματα δεδομένων. Συνδεθείτε για τα πραγματικά σας δεδομένα.
        </p>
      )}
    </div>
  );
}

// ─── Section: Next exam ──────────────────────────────────────────────────────

function NextExamSection({ exam }: { exam: NextExam }) {
  return (
    <section>
      <SectionHeader title="Επόμενο διαγώνισμα" href="/account/grading" hrefLabel="Όλα" />

      {!exam ? (
        <div className="border border-ink/10 rounded-md px-4 py-8 text-center">
          <p className="text-sm text-ink/45">Κανένα ενεργό διαγώνισμα αυτή τη στιγμή.</p>
        </div>
      ) : (
        <div className="border border-ink/10 rounded-md">
          <div className="px-4 py-3 border-b border-ink/8">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="text-xs text-ink/45">Διαγώνισμα {exam.number ?? ""}</div>
                <div className="font-display text-lg text-ink mt-0.5">{exam.title}</div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 grid grid-cols-2 gap-4 text-sm">
            <Field label="Καταχώρηση έως" value={exam.closes_at ? new Date(exam.closes_at).toLocaleDateString("el-GR", { day: "2-digit", month: "long", year: "numeric" }) : "—"} />
            <Field label="Απομένουν" value={daysLeft(exam.closes_at)} highlight />
          </div>
          <div className="px-4 py-3 border-t border-ink/8 flex items-center justify-between">
            <Link href={exam.href} className="text-xs font-bold text-[#056ef5] hover:text-[#0451b8]">
              Έναρξη βαθμολόγησης →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function daysLeft(iso: string): string {
  if (!iso) return "—";
  const diff = new Date(iso).getTime() - Date.now();
  const d = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  if (d === 0) return "σήμερα";
  if (d === 1) return "1 ημέρα";
  return `${d} ημέρες`;
}

// ─── Section: Activity ──────────────────────────────────────────────────────

function ActivitySection({ activity }: { activity: Activity[] }) {
  return (
    <section>
      <SectionHeader title="Δραστηριότητα" />

      {activity.length === 0 ? (
        <div className="border border-ink/10 rounded-md px-4 py-8 text-center">
          <p className="text-sm text-ink/45">Δεν υπάρχει πρόσφατη δραστηριότητα.</p>
        </div>
      ) : (
        <ul className="border border-ink/10 rounded-md divide-y divide-ink/8">
          {activity.map((a, i) => (
            <li key={i} className="row-hover px-4 py-3 flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: activityColor(a.kind) }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink truncate">{a.title}</div>
                <div className="text-xs text-ink/50 mt-0.5 truncate">{a.subtitle}</div>
              </div>
              <span className="text-xs text-ink/40 flex-shrink-0 tabular">{a.when}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function activityColor(k: Activity["kind"]) {
  switch (k) {
    case "graded":  return "#10b981";
    case "student": return "#056ef5";
    case "package": return "#7c00d0";
    case "unlock":  return "#f59e0b";
  }
}

// ─── Section: Performance ───────────────────────────────────────────────────

function PerformanceSection({ history }: { history: HistoryPoint[] }) {
  const data = history;
  const classAvg = data.length ? Math.round(data.reduce((a, d) => a + d.value, 0) / data.length) : 0;

  return (
    <section>
      <SectionHeader title="Επίδοση τμήματος" />

      <div className="border border-ink/10 rounded-md p-4">
        {data.length === 0 ? (
          <p className="text-sm text-ink/45 py-6 text-center">Δεν έχουν καταχωρηθεί ακόμα βαθμοί.</p>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-[11px] text-ink/50">Μέσος όρος</div>
                <div className="font-display text-2xl text-ink tabular">{classAvg}</div>
              </div>
              <div className="text-[11px] text-ink/45">{data.length} {data.length === 1 ? "διαγώνισμα" : "διαγωνίσματα"}</div>
            </div>
            <BarChart data={data} avg={classAvg} />
          </>
        )}
      </div>
    </section>
  );
}

function BarChart({ data, avg }: { data: HistoryPoint[]; avg: number }) {
  const max = Math.max(100, ...data.map((d) => d.value));
  return (
    <div className="relative">
      <div className="flex items-end gap-3 h-32 border-b border-ink/10">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5 group">
            <span className="text-[10px] text-ink/50 tabular">{d.value}</span>
            <div className="w-full bg-[#056ef5] rounded-t-sm transition-opacity hover:opacity-80"
                 style={{ height: `${(d.value / max) * 100}%`, minHeight: 2 }} />
          </div>
        ))}
      </div>
      {/* avg line */}
      {avg > 0 && (
        <div className="absolute left-0 right-0 border-t border-dashed border-ink/30 pointer-events-none"
             style={{ bottom: `${(avg / max) * 100}%` }}>
          <span className="absolute -top-2 right-0 bg-white text-[9px] text-ink/50 px-1 tabular">μ.ο. {avg}</span>
        </div>
      )}
      <div className="flex gap-3 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-ink/50">{d.label}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Top students ──────────────────────────────────────────────────

function TopStudentsSection({ students }: { students: TopStudent[] }) {
  return (
    <section>
      <SectionHeader title="Κορυφαίοι μαθητές" href="/account/students" hrefLabel="Όλοι" />
      {students.length === 0 ? (
        <div className="border border-ink/10 rounded-md px-4 py-8 text-center">
          <p className="text-sm text-ink/45">Καμία βαθμολόγηση ακόμα.</p>
        </div>
      ) : (
        <ul className="border border-ink/10 rounded-md divide-y divide-ink/8">
          {students.map((s, i) => (
            <li key={i} className="row-hover px-4 py-2.5 flex items-center gap-3">
              <span className="text-xs text-ink/40 tabular w-4 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink truncate">{s.name}</div>
                {s.class_year && <div className="text-[11px] text-ink/45">{s.class_year}</div>}
              </div>
              <span className="font-display text-base text-ink tabular flex-shrink-0">{s.score}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ─── Section: Packages ─────────────────────────────────────────────────────

function PackagesSection({ packages }: { packages: PackageItem[] }) {
  return (
    <section>
      <SectionHeader title="Ενεργά πακέτα" href="/paketa" hrefLabel="Προσθήκη" />
      {packages.length === 0 ? (
        <div className="border border-ink/10 rounded-md px-4 py-6 flex items-center justify-between">
          <p className="text-sm text-ink/50">Δεν έχετε ενεργά πακέτα.</p>
          <Link href="/paketa" className="text-xs font-bold text-[#056ef5] hover:text-[#0451b8]">
            Δείτε τα πακέτα →
          </Link>
        </div>
      ) : (
        <ul className="border border-ink/10 rounded-md divide-y divide-ink/8">
          {packages.map((p, i) => (
            <li key={i} className="row-hover px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-ink">{p.name}</div>
              <div className="text-xs text-ink/50">Λήγει {p.expires}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ─── Shared bits ────────────────────────────────────────────────────────────

function SectionHeader({ title, href, hrefLabel }: { title: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <h2 className="text-[11px] font-semibold tracking-wider uppercase text-ink/50">{title}</h2>
      {href && hrefLabel && (
        <Link href={href} className="text-xs text-ink/45 hover:text-ink transition-colors">
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[11px] text-ink/45">{label}</div>
      <div className={`mt-0.5 text-sm tabular ${highlight ? "text-[#056ef5] font-semibold" : "text-ink"}`}>{value}</div>
    </div>
  );
}

// ─── Preview seed ──────────────────────────────────────────────────────────

const PREVIEW_DATA: DashboardData = {
  name: "Νίκος Παπαδόπουλος",
  isPreview: true,
  kpis: [
    { label: "Μαθητές",      value: 24, sub: "καταχωρημένοι" },
    { label: "Μέσος βαθμός", value: 78, sub: "8 βαθμολογήσεις" },
    { label: "Διαγωνίσματα", value: 4,  sub: "1 διαθέσιμο" },
    { label: "Πακέτα",       value: 2,  sub: "ενεργά" },
  ],
  nextExam: {
    number: 3,
    title: "Διαγώνισμα 3 — Ιανουάριος 2025",
    closes_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    href: "/account/grading/preview",
  },
  history: [
    { label: "Δ1", value: 72 },
    { label: "Δ2", value: 76 },
    { label: "Δ3", value: 74 },
    { label: "Δ4", value: 81 },
    { label: "Δ5", value: 78 },
  ],
  activity: [
    { kind: "graded",  title: "Διαγώνισμα 2",            subtitle: "Μαρία Παπαδοπούλου · βαθμός 92", when: "2 ώ." },
    { kind: "student", title: "Σοφία Κωνσταντίνου",      subtitle: "Νέος μαθητής · Λύκειο",           when: "χθες" },
    { kind: "unlock",  title: "Διαγώνισμα 3",            subtitle: "Ξεκλειδώθηκε · έως 20 Ιαν.",      when: "2 ημ." },
    { kind: "graded",  title: "Διαγώνισμα 1",            subtitle: "Γιώργης Αλεξίου · βαθμός 88",     when: "1 εβδ." },
    { kind: "package", title: "Πακέτο Bundle",           subtitle: "Αγορά · έως 15/6/2025",           when: "2 εβδ." },
  ],
  topStudents: [
    { name: "Μαρία Παπαδοπούλου", class_year: "Γυμνάσιο", score: 92 },
    { name: "Γιώργος Αλεξίου",   class_year: "Γυμνάσιο", score: 88 },
    { name: "Ελένη Βασιλείου",   class_year: "Γυμνάσιο", score: 85 },
    { name: "Νίκος Δημητρίου",   class_year: "Λύκειο",   score: 82 },
    { name: "Σοφία Κωνσταντίνου", class_year: "Λύκειο",   score: 79 },
  ],
  packages: [
    { name: "Πακέτο Bundle",  expires: "15 Ιουνίου 2025" },
    { name: "Πακέτο Γλώσσα",  expires: "15 Ιουνίου 2025" },
  ],
};
