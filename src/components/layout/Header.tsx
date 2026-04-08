import Link from "next/link";
import { el } from "@/lib/i18n/el";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-paper/75 border-b border-slate-200/70">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative inline-block w-9 h-9 rounded-xl bg-ink text-white grid place-items-center font-display italic text-base shadow-md group-hover:scale-105 transition-transform">
            π
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-paper" />
          </span>
          <span className="font-display text-xl tracking-tight text-ink leading-none">
            {el.brand.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <NavLink href="/">{el.nav.home}</NavLink>
          <NavLink href="/paketa">{el.nav.packages}</NavLink>
          <NavLink href="/sxetika">{el.nav.about}</NavLink>
          <NavLink href="/faq">{el.nav.faq}</NavLink>
          <NavLink href="/epikoinonia">{el.nav.contact}</NavLink>
        </nav>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link
                href="/account"
                className="px-4 py-2 rounded-full hover:bg-slate-100 font-medium transition-colors"
              >
                {el.nav.account}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden sm:inline-flex px-4 py-2 rounded-full hover:bg-slate-100 font-medium transition-colors"
              >
                {el.nav.signin}
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-300 text-ink font-semibold shadow-md shadow-amber-500/30 hover:bg-amber-400 hover:-translate-y-0.5 transition-all"
              >
                {el.nav.signup}
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-full text-slate-600 hover:text-ink hover:bg-slate-100/80 font-medium transition-colors"
    >
      {children}
    </Link>
  );
}
