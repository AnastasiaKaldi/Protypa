import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const [
    { count: totalSchools },
    { count: completedOnboarding },
    { count: totalSimulations },
    { count: publishedSimulations },
    { data: recentSchools },
  ] = await Promise.all([
    supabase.from("schools").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("onboarding_complete", true).eq("is_admin", false),
    supabase.from("simulations").select("*", { count: "exact", head: true }),
    supabase.from("simulations").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("schools").select("id, trade_name, legal_name, city, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Εγγεγραμμένα φροντιστήρια", value: totalSchools ?? 0, color: "#056ef5", icon: "🏫" },
    { label: "Ολοκληρωμένη εγγραφή",       value: completedOnboarding ?? 0, color: "#7c00d0", icon: "✓" },
    { label: "Δημοσιευμένες Προσομοιώσεις", value: publishedSimulations ?? 0, color: "#c8ff00", textColor: "#0a0a0f", icon: "📋" },
    { label: "Σύνολο Προσομοιώσεων",         value: totalSimulations ?? 0, color: "white", textColor: "#0a0a0f", icon: "#" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/80 mb-2">Πίνακας Ελέγχου</div>
        <h1 className="font-display text-3xl text-white">Καλώς ήρθατε, Admin</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="font-display text-4xl mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-white leading-snug">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <QuickCard
          href="/admin/schools"
          title="Φροντιστήρια"
          desc="Διαχείριση εγγεγραμμένων σχολών, προβολή στοιχείων και ιστορικό βαθμολόγησης."
          color="#056ef5"
          cta="Προβολή φροντιστηρίων"
        />
        <QuickCard
          href="/admin/simulations"
          title="Προσομοιώσεις"
          desc="Δημιουργία και διαχείριση διαγωνισμάτων, ρύθμιση ημερομηνιών ανακλείδωσης."
          color="#7c00d0"
          cta="Διαχείριση προσομοιώσεων"
        />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80 mb-3">Σύντομα</div>
          <h3 className="font-display text-xl text-white mb-2">Στατιστικά</h3>
          <p className="text-sm text-white leading-relaxed">
            Πανελλαδική εικόνα αποτελεσμάτων και συγκριτικές αναλύσεις ανά Προσομοίωση.
          </p>
          <span className="inline-block mt-4 text-xs text-white/80 border border-white/20 px-3 py-1 rounded-full">Σύντομα διαθέσιμο</span>
        </div>
      </div>

      {/* Recent sign-ups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/80">Τελευταίες εγγραφές</div>
          <Link href="/admin/schools" className="text-xs text-[#056ef5] hover:text-[#c8ff00] transition-colors font-bold">
            Όλα →
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {recentSchools && recentSchools.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-white/80">Φροντιστήριο</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-white/80 hidden sm:table-cell">Πόλη</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-white/80">Εγγραφή</th>
                </tr>
              </thead>
              <tbody>
                {recentSchools.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                    <td className="px-5 py-4">
                      <Link href={`/admin/schools/${s.id}`} className="!text-white hover:!text-[#056ef5] transition-colors font-medium">
                        {s.trade_name ?? s.legal_name ?? "—"}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-white hidden sm:table-cell">{s.city ?? "—"}</td>
                    <td className="px-5 py-4 text-white text-xs">
                      {new Date(s.created_at).toLocaleDateString("el-GR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-8 text-sm text-white/70 text-center">Δεν υπάρχουν εγγεγραμμένα φροντιστήρια ακόμα.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickCard({ href, title, desc, color, cta }: {
  href: string; title: string; desc: string; color: string; cta: string;
}) {
  return (
    <Link href={href} className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] p-6 transition-all hover:-translate-y-0.5">
      <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color }}>
        Διαχείριση
      </div>
      <h3 className="font-display text-xl text-white mb-2">{title}</h3>
      <p className="text-sm text-white leading-relaxed mb-5">{desc}</p>
      <span className="text-xs font-black uppercase tracking-wider transition-colors" style={{ color }}>
        {cta} →
      </span>
    </Link>
  );
}
