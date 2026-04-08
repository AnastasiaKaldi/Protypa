import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActivePackages } from "@/lib/entitlements";
import { el } from "@/lib/i18n/el";
import { formatDate } from "@/lib/format";

export default async function AccountDashboard({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Layout already redirects unauthed users; the assertion is for TS only.
  const active = await getActivePackages(user!.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, school_name")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark">
        {el.account.dashboardTitle}
      </h1>
      <p className="mt-2 text-muted">
        {el.account.welcome},{" "}
        <span className="font-medium text-foreground">
          {profile?.full_name ?? user!.email}
        </span>
        {profile?.school_name ? ` · ${profile.school_name}` : ""}
      </p>

      {sp.purchase === "success" && (
        <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-900">
          {el.account.purchaseSuccess}
        </div>
      )}

      <h2 className="mt-10 text-xl font-semibold">
        {el.account.activePackages}
      </h2>
      {active.length === 0 ? (
        <div className="mt-4 p-6 rounded-lg border border-dashed border-border text-muted">
          {el.account.noPackages}
          <div className="mt-4">
            <Link
              href="/paketa"
              className="px-4 py-2 rounded-md bg-brand text-white inline-block hover:bg-brand-dark"
            >
              {el.nav.packages}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {active.map(({ purchase, pkg }) => (
            <div
              key={purchase.id}
              className="p-5 rounded-xl border border-border bg-white"
            >
              <div className="font-semibold text-brand-dark">{pkg.name_el}</div>
              <div className="text-sm text-muted mt-1">
                {el.account.expiresOn} {formatDate(purchase.expires_at)}
              </div>
              <Link
                href="/account/papers"
                className="inline-block mt-4 text-sm text-brand font-medium hover:underline"
              >
                {el.account.viewPapers} →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
