"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { el } from "@/lib/i18n/el";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid md:grid-cols-[1fr_1.1fr]">
      {/* Left brand panel */}
      <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden">
        <img
          src="/auth-start.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#056ef5]/85 via-[#056ef5]/70 to-[#056ef5]/95 mix-blend-multiply" />
        <div />
        <div className="relative z-10">
          <h2 className="font-display text-5xl text-white leading-tight">
            Ξεκινήστε<br />
            <span className="text-[#c8ff00]">σήμερα.</span>
          </h2>
          <p className="mt-4 text-white/80 text-sm max-w-xs leading-relaxed">
            Δημιουργήστε δωρεάν λογαριασμό και αποκτήστε πρόσβαση στα εργαλεία προετοιμασίας.
          </p>
        </div>
        <div className="relative z-10 text-white/50 text-xs">© {new Date().getFullYear()} Protypa</div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-2">Εγγραφή</div>
            <h1 className="font-display text-3xl md:text-4xl text-ink">{el.auth.signupTitle}</h1>
          </div>
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setInfo(null);
              setLoading(true);
              const supabase = createSupabaseBrowserClient();
              const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName, school_name: schoolName } },
              });
              setLoading(false);
              if (error) { setError(error.message); }
              else if (data.session) { router.push("/onboarding"); router.refresh(); }
              else { setInfo(el.auth.checkEmail); }
            }}
          >
            <AuthField label={el.auth.fullName} value={fullName} onChange={setFullName} />
            <AuthField label={el.auth.schoolName} value={schoolName} onChange={setSchoolName} />
            <AuthField label={el.auth.email} type="email" value={email} onChange={setEmail} />
            <AuthField label={el.auth.password} type="password" value={password} onChange={setPassword} />
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{error}</div>
            )}
            {info && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl">{info}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-full bg-[#FDFFFC] text-[#7c00d0] border-2 border-[#7c00d0] font-black uppercase tracking-wider text-sm hover:bg-[#7c00d0]/5 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? el.common.loading : el.auth.signupButton}
            </button>
          </form>
          <p className="mt-8 text-sm text-ink/50 text-center">
            {el.auth.haveAccount}{" "}
            <Link href="/signin" className="text-[#056ef5] font-bold hover:text-[#7c00d0] transition-colors">
              {el.auth.signinLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthField({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/40">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-ink/20 px-0 py-3 text-base font-display text-ink placeholder:text-ink/30 focus:outline-none focus:border-[#7c00d0] transition-colors"
      />
    </label>
  );
}
