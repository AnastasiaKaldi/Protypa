import { createSupabaseServerClient } from "@/lib/supabase/server";

interface Miss {
  id: string;
  query: string;
  pathname: string | null;
  user_id: string | null;
  user_agent: string | null;
  created_at: string;
}

export const dynamic = "force-dynamic";

export default async function ChatbotMissesPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("chatbot_misses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const misses = (data as Miss[]) ?? [];

  // Group by normalized query to spot patterns
  const counts = new Map<string, number>();
  for (const m of misses) {
    const k = m.query.trim().toLowerCase();
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const repeats = Array.from(counts.entries())
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/80 mb-2">Admin</div>
        <h1 className="font-display text-3xl text-white">Chatbot Misses</h1>
        <p className="mt-1 text-sm text-white/55">
          Ερωτήσεις στις οποίες ο βοηθός δεν μπόρεσε να απαντήσει. Χρησιμοποιήστε τες για να
          εμπλουτίσετε το FAQ ή τα synonym clusters.
        </p>
      </div>

      {/* Repeats summary */}
      {repeats.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-300 mb-3">
            Επαναλαμβανόμενες ερωτήσεις
          </div>
          <ul className="space-y-1.5 text-sm">
            {repeats.map(([q, c]) => (
              <li key={q} className="flex items-center justify-between gap-3">
                <span className="text-white/85 truncate">"{q}"</span>
                <span className="text-[11px] font-black text-amber-300 tabular flex-shrink-0">×{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {misses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-12 text-center">
          <p className="text-white text-sm">Καμία αποτυχημένη ερώτηση καταγεγραμμένη.</p>
          <p className="text-white/80 text-xs mt-2">Όλες οι ερωτήσεις βρίσκουν απάντηση 🎉</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white/45">Ερώτηση</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white/45 hidden md:table-cell">Σελίδα</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white/45 hidden sm:table-cell">Χρήστης</th>
                <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white/45">Πότε</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {misses.map((m) => (
                <tr key={m.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm text-white">"{m.query}"</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/45 hidden md:table-cell">
                    {m.pathname ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs hidden sm:table-cell">
                    {m.user_id ? (
                      <span className="text-white/55 tabular">{m.user_id.slice(0, 8)}…</span>
                    ) : (
                      <span className="text-white/80">ανώνυμος</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-white/45 text-right whitespace-nowrap">
                    {new Date(m.created_at).toLocaleString("el-GR", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
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
