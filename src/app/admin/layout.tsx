import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/layout/SignOutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/signin");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/account");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Admin top bar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f] border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/Logos/mainLogo.png" alt="Protypa" className="h-6 w-auto" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#c8ff00] ml-1">Admin</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <AdminNavLink href="/admin" label="Πίνακας" />
              <AdminNavLink href="/admin/schools" label="Φροντιστήρια" />
              <AdminNavLink href="/admin/simulations" label="Προσομοιώσεις" />
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 hidden sm:block">{profile.full_name ?? user.email}</span>
            <Link href="/account" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              → Λογαριασμός
            </Link>
            <SignOutButton className="text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all font-medium"
    >
      {label}
    </Link>
  );
}
