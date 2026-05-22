import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAccessiblePapers } from "@/lib/entitlements";
import { el } from "@/lib/i18n/el";

export default async function PapersPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const papers = await getAccessiblePapers(user!.id);

  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-2">
        {el.account.papersTitle}
      </div>
      <h2 className="font-display text-2xl text-ink mb-6">Διαθέσιμα Θέματα</h2>

      {papers.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-ink/15 p-12 flex flex-col items-center text-center gap-4">
          <div className="font-display text-5xl text-ink/10">∅</div>
          <p className="text-ink/50 text-sm max-w-xs leading-relaxed">{el.account.noPackages}</p>
          <Link
            href="/paketa"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FDFFFC] text-[#056ef5] border-2 border-[#056ef5] font-black uppercase tracking-wider text-xs hover:bg-[#056ef5]/5 hover:-translate-y-0.5 transition-all"
          >
            {el.nav.packages} →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="rounded-2xl border border-ink/10 bg-white p-5 flex items-center justify-between hover:border-[#056ef5]/30 hover:shadow-sm transition-all gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="font-display text-base text-ink leading-tight">{paper.title_el}</div>
                <div className="text-xs text-ink/40 mt-1 uppercase tracking-wider">
                  {paper.package_name}{paper.year ? ` · ${paper.year}` : ""}
                </div>
              </div>
              <Link
                href={`/grade/${paper.id}`}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FDFFFC] text-[#056ef5] border-2 border-[#056ef5] font-black uppercase tracking-wider text-xs hover:bg-[#056ef5]/5 hover:-translate-y-0.5 transition-all"
              >
                {el.account.grade}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
