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
      <h1 className="text-3xl font-bold text-brand-dark">
        {el.account.papersTitle}
      </h1>

      {papers.length === 0 ? (
        <div className="mt-6 p-6 rounded-lg border border-dashed border-border text-muted">
          {el.account.noPackages}
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="p-5 rounded-xl border border-border bg-white flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{paper.title_el}</div>
                <div className="text-sm text-muted">
                  {paper.package_name}
                  {paper.year ? ` · ${paper.year}` : ""}
                </div>
              </div>
              <Link
                href={`/grade/${paper.id}`}
                className="px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark"
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
