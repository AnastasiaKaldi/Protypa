import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { el } from "@/lib/i18n/el";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-dark">
          Η εφαρμογή δεν έχει ρυθμιστεί ακόμη
        </h1>
        <p className="mt-3 text-muted">
          Συμπληρώστε τα κλειδιά Supabase και Stripe στο αρχείο{" "}
          <code>.env.local</code> και επανεκκινήστε τον server.
        </p>
      </div>
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/account");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="flex gap-2 text-sm border-b border-border mb-8 overflow-x-auto">
        <TabLink href="/account">{el.account.dashboardTitle}</TabLink>
        <TabLink href="/account/papers">{el.account.papersTitle}</TabLink>
        <TabLink href="/account/history">{el.account.historyTitle}</TabLink>
      </nav>
      {children}
    </div>
  );
}

function TabLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-4 py-2 hover:text-brand border-b-2 border-transparent hover:border-brand -mb-px whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
