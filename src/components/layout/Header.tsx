import Link from "next/link";
import { el } from "@/lib/i18n/el";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <header className="sticky top-0 z-30 bg-brand border-b border-white/10">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 h-14 md:h-16">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-0">
          <span className="font-display text-lg md:text-xl text-paper tracking-wider group-hover:text-accent transition-colors">
            PROTUPA.GR
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/paketa">ΠΑΚΕΤΑ</NavLink>
          <NavLink href="/signup">ΓΙΑ ΜΑΘΗΤΕΣ</NavLink>
          <NavLink href="/paketa">ΓΙΑ ΦΡΟΝΤΙΣΤΕΣ</NavLink>
          <NavLink href="/faq">FAQ</NavLink>
          <NavLink href="/epikoinonia">ΕΠΙΚΟΙΝΩΝΙΑ</NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/account"
                className="hidden md:inline-flex px-4 py-2 text-paper/70 hover:text-paper font-bold uppercase tracking-wider text-xs transition-colors"
              >
                {el.nav.account}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden md:inline-flex px-4 py-2 text-paper/70 hover:text-paper font-bold uppercase tracking-wider text-xs transition-colors"
              >
                {el.nav.signin}
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-4 py-2 rounded-md bg-accent text-ink font-black uppercase tracking-widest text-xs hover:bg-accent/90 hover:-translate-y-0.5 transition-all"
              >
                APPLY
              </Link>
            </>
          )}
          <MobileNav />
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
      className="px-3 py-2 text-paper/80 hover:text-paper font-bold uppercase tracking-wider text-xs transition-colors"
    >
      {children}
    </Link>
  );
}
