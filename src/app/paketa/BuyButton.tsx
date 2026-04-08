"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { el } from "@/lib/i18n/el";

export function BuyButton({
  packageId,
  signedIn,
  buttonClass = "bg-ink text-white hover:bg-slate-800",
}: {
  packageId: string;
  signedIn: boolean;
  /** Tailwind classes that set the bg + text + hover colour for the card theme. */
  buttonClass?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!signedIn) {
    return (
      <button
        onClick={() => router.push(`/signin?next=/paketa`)}
        className={`group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer ${buttonClass}`}
      >
        {el.packages.mustSignIn}
        <Arrow />
      </button>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ package_id: packageId }),
          });
          const data = await res.json();
          if (data.url) window.location.href = data.url;
          else alert(data.error ?? el.auth.error);
        } finally {
          setLoading(false);
        }
      }}
      className={`group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer ${buttonClass}`}
    >
      {loading ? el.common.loading : el.packages.buy}
      {!loading && <Arrow />}
    </button>
  );
}

function Arrow() {
  return (
    <svg
      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
