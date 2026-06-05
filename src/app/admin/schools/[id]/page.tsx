import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminSchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const [{ data: school }, { data: profile }, { data: participations }] = await Promise.all([
    supabase.from("schools").select("*").eq("id", id).maybeSingle(),
    supabase.from("profiles").select("full_name, is_admin, onboarding_complete, created_at").eq("id", id).maybeSingle(),
    supabase.from("school_simulations")
      .select(`id, student_count, is_submitted, submitted_at, simulations(title, number, exam_date, grading_closes_at)`)
      .eq("school_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!school && !profile) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/schools" className="text-xs text-white/80 hover:text-white/60 transition-colors mb-3 inline-block">
            ← Φροντιστήρια
          </Link>
          <h1 className="font-display text-3xl text-white">
            {school?.trade_name ?? school?.legal_name ?? profile?.full_name ?? "Άγνωστο φροντιστήριο"}
          </h1>
          {school?.trade_name && school?.legal_name && (
            <p className="text-white text-sm mt-1">{school.legal_name}</p>
          )}
        </div>
        <span className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
          profile?.onboarding_complete
            ? "bg-green-500/15 text-green-400"
            : "bg-yellow-500/15 text-yellow-400"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {profile?.onboarding_complete ? "Ολοκληρωμένο προφίλ" : "Ελλιπές προφίλ"}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Company info */}
        <InfoCard title="Στοιχεία Εταιρείας">
          <InfoRow label="Επωνυμία"          value={school?.legal_name} />
          <InfoRow label="Διακριτικός τίτλος" value={school?.trade_name} />
          <InfoRow label="Διεύθυνση"          value={school?.address} />
          <InfoRow label="Ταχ. κώδικας"       value={school?.postal_code} />
          <InfoRow label="Πόλη"               value={school?.city} />
          <InfoRow label="Περιοχή"            value={school?.region} />
        </InfoCard>

        {/* Tax info */}
        <InfoCard title="Φορολογικά Στοιχεία">
          <InfoRow label="ΑΦΜ"                value={school?.afm} />
          <InfoRow label="ΔΟΥ"                value={school?.doy} />
          <InfoRow label="Μαθήματα" value={(school?.subjects as string[] ?? []).map(s =>
            s === "greek" ? "Ν. Γλώσσα" : s === "math" ? "Μαθηματικά" : s
          ).join(", ") || "—"} />
          <InfoRow label="Αποδοχή όρων" value={school?.terms_accepted_at
            ? new Date(school.terms_accepted_at).toLocaleDateString("el-GR")
            : "Όχι"} />
        </InfoCard>

        {/* Contact info */}
        <InfoCard title="Επικοινωνία">
          <InfoRow label="Τηλέφωνο"          value={school?.phone} />
          <InfoRow label="Email φροντ."       value={school?.school_email} />
          <InfoRow label="Υπεύθυνος"         value={school?.contact_person} />
          <InfoRow label="Κινητό"            value={school?.mobile} />
          <InfoRow label="Email υπευθύνου"   value={school?.contact_email} />
        </InfoCard>

        {/* Account info */}
        <InfoCard title="Λογαριασμός">
          <InfoRow label="User ID"     value={id} mono />
          <InfoRow label="Εγγραφή"    value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString("el-GR") : "—"} />
          <InfoRow label="Κατάσταση"  value={profile?.onboarding_complete ? "Ολοκληρωμένο" : "Εκκρεμεί"} />
        </InfoCard>
      </div>

      {/* Participation history */}
      <div>
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/80 mb-4">Ιστορικό Προσομοιώσεων</div>
        {participations && participations.length > 0 ? (
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {["Προσομοίωση", "Ημ/νία εξέτασης", "Μαθητές", "Κατάσταση", "Υποβολή"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-white/80">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participations.map((p, i) => {
                  const sim = Array.isArray(p.simulations) ? p.simulations[0] : p.simulations as { title: string; number: number; exam_date: string | null; grading_closes_at: string | null } | null;
                  return (
                    <tr key={p.id} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                      <td className="px-5 py-4 text-white font-medium">{sim?.title ?? `Προσομοίωση ${sim?.number}`}</td>
                      <td className="px-5 py-4 text-white">{sim?.exam_date ? new Date(sim.exam_date).toLocaleDateString("el-GR") : "—"}</td>
                      <td className="px-5 py-4 text-white">{p.student_count ?? "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${p.is_submitted ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                          {p.is_submitted ? "Υποβλήθηκε" : "Εκκρεμεί"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/80 text-xs">
                        {p.submitted_at ? new Date(p.submitted_at).toLocaleDateString("el-GR") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 p-8 text-center">
            <p className="text-white/80 text-sm">Δεν έχει συμμετάσχει ακόμα σε Προσομοίωση.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80 mb-4">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-white flex-shrink-0">{label}</span>
      <span className={`text-white text-right break-all ${mono ? "font-mono text-xs" : ""}`}>
        {value || <span className="text-white/80">—</span>}
      </span>
    </div>
  );
}
