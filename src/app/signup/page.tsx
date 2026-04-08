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
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">
        {el.auth.signupTitle}
      </h1>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setInfo(null);
          setLoading(true);
          const supabase = createSupabaseBrowserClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName, school_name: schoolName },
            },
          });
          setLoading(false);
          if (error) {
            setError(error.message);
          } else if (data.session) {
            router.push("/account");
            router.refresh();
          } else {
            setInfo(el.auth.checkEmail);
          }
        }}
      >
        <Input
          label={el.auth.fullName}
          value={fullName}
          onChange={setFullName}
        />
        <Input
          label={el.auth.schoolName}
          value={schoolName}
          onChange={setSchoolName}
        />
        <Input
          label={el.auth.email}
          type="email"
          value={email}
          onChange={setEmail}
        />
        <Input
          label={el.auth.password}
          type="password"
          value={password}
          onChange={setPassword}
        />
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        {info && (
          <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
            {info}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-50 cursor-pointer"
        >
          {loading ? el.common.loading : el.auth.signupButton}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted text-center">
        {el.auth.haveAccount}{" "}
        <Link href="/signin" className="text-brand font-medium hover:underline">
          {el.auth.signinLink}
        </Link>
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}
