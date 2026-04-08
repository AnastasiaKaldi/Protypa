"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { el } from "@/lib/i18n/el";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        setLoading(false);
        if (error) setError(error.message);
        else {
          router.push(next);
          router.refresh();
        }
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">{el.auth.email}</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          {el.auth.password}
        </label>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-50 cursor-pointer"
      >
        {loading ? el.common.loading : el.auth.signinButton}
      </button>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">
        {el.auth.signinTitle}
      </h1>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
      <p className="mt-6 text-sm text-muted text-center">
        {el.auth.noAccount}{" "}
        <Link href="/signup" className="text-brand font-medium hover:underline">
          {el.auth.signupLink}
        </Link>
      </p>
    </div>
  );
}
