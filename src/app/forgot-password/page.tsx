"use client";
import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { el } from "@/lib/i18n/el";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid md:grid-cols-[1fr_1.1fr]">
      {/* Left brand panel */}
      <div className="hidden md:flex flex-col justify-between bg-[#7c00d0] p-10 relative overflow-hidden">
        <img src="/Logos/mainLogo.png" alt="Protypa" className="h-8 w-auto" />
        <div className="relative z-10">
          <h2 className="font-display text-5xl text-white leading-tight">
            Επαναφορά<br />
            <span className="text-[#c8ff00]">κωδικού.</span>
          </h2>
          <p className="mt-4 text-white/70 text-sm max-w-xs leading-relaxed">
            Στείλτε μας το email σας και θα σας στείλουμε έναν σύνδεσμο επαναφοράς κωδικού.
          </p>
        </div>
        <div className="text-white/30 text-xs">© {new Date().getFullYear()} Protypa</div>
        <img src="/TransparentAssets/Asset 13.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute top-6 right-6 w-32 opacity-60 rotate-6" />
        <img src="/TransparentAssets/Asset 9.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-10 right-8 w-28 opacity-40 -rotate-6" />
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-14 bg-white">
        <div className="w-full max-w-sm">
          {sent ? (
            <div>
              <div className="font-display text-6xl text-[#056ef5]">✓</div>
              <h1 className="mt-4 font-display text-3xl text-ink">Το email στάλθηκε.</h1>
              <p className="mt-3 text-ink/50 text-sm leading-relaxed max-w-xs">
                Ελέγξτε τα εισερχόμενά σας και πατήστε τον σύνδεσμο που σας στείλαμε για να επαναφέρετε τον κωδικό σας.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-[#FDFFFC] text-[#056ef5] border-2 border-[#056ef5] font-black uppercase tracking-wider text-xs hover:bg-[#056ef5]/5 hover:-translate-y-0.5 transition-all"
              >
                ← Επιστροφή στη σύνδεση
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-2">
                  Ξεχάσατε τον κωδικό;
                </div>
                <h1 className="font-display text-3xl md:text-4xl text-ink">Επαναφορά κωδικού</h1>
              </div>
              <form className="space-y-7" onSubmit={submit}>
                <label className="block">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/40">
                    {el.auth.email}
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full bg-transparent border-0 border-b-2 border-ink/20 px-0 py-3 text-lg font-display text-ink placeholder:text-ink/30 focus:outline-none focus:border-[#056ef5] transition-colors"
                  />
                </label>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 rounded-full bg-[#FDFFFC] text-[#7c00d0] border-2 border-[#7c00d0] font-black uppercase tracking-wider text-sm hover:bg-[#7c00d0]/5 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? el.common.loading : "Αποστολή συνδέσμου"}
                </button>
              </form>
              <p className="mt-10 text-sm text-ink/50 text-center">
                Θυμηθήκατε τον κωδικό;{" "}
                <Link href="/signin" className="text-[#056ef5] font-bold hover:text-[#7c00d0] transition-colors">
                  Συνδεθείτε
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
