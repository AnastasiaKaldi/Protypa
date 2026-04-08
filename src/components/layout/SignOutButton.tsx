"use client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { el } from "@/lib/i18n/el";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="px-4 py-2 rounded-full hover:bg-slate-100 font-medium transition-colors cursor-pointer"
    >
      {el.nav.signout}
    </button>
  );
}
