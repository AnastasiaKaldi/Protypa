import Link from "next/link";
import { el } from "@/lib/i18n/el";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";
import { formatEuro, formatDate } from "@/lib/format";
import { BuyButton } from "./BuyButton";

// Per-slug visual identity. Each plan owns ONE solid colour + a contrasting
// accent — flat editorial palette, no rainbow gradients.
const THEMES: Record<
  string,
  {
    surface: string; // card background
    ink: string; // primary text colour on the card
    accent: string; // small chip / underline accent
    sticker: string; // discount sticker bg + text colour
    button: string; // primary CTA bg + text colour
    label: string; // descriptor in serif italic
    icon: string;
    popular?: boolean;
  }
> = {
  greek: {
    surface: "bg-rose-100 text-rose-950",
    ink: "text-rose-950",
    accent: "bg-rose-950 text-rose-100",
    sticker: "bg-amber-300 text-amber-950",
    button: "bg-rose-950 text-rose-50 hover:bg-rose-900",
    label: "Για αυτούς που αγαπούν τις λέξεις",
    icon: "✎",
  },
  math: {
    surface: "bg-emerald-100 text-emerald-950",
    ink: "text-emerald-950",
    accent: "bg-emerald-950 text-emerald-100",
    sticker: "bg-amber-300 text-amber-950",
    button: "bg-emerald-950 text-emerald-50 hover:bg-emerald-900",
    label: "Για αυτούς που λατρεύουν τους αριθμούς",
    icon: "∑",
  },
  bundle: {
    surface: "bg-ink text-paper",
    ink: "text-paper",
    accent: "bg-amber-300 text-ink",
    sticker: "bg-amber-300 text-amber-950",
    button: "bg-amber-300 text-ink hover:bg-amber-200",
    label: "Για αυτούς που θέλουν τα πάντα",
    icon: "★",
    popular: true,
  },
};
const FALLBACK_THEME = THEMES.math;

export default async function PackagesPage() {
  const supabase = await createSupabaseServerClient();
  const packages = supabase
    ? (
        await supabase
          .from("packages")
          .select("*")
          .order("price_cents", { ascending: true })
      ).data
    : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <div className="overflow-hidden">
      <Hero />
      <Plans packages={(packages as Package[]) ?? []} signedIn={!!user} />
      <Compare packages={(packages as Package[]) ?? []} />
      <Guarantee />
      <Faqs />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-paper" />
        <div className="absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute top-20 -left-40 w-[36rem] h-[36rem] rounded-full bg-emerald-200/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
          {el.packages.eyebrow}
        </div>

        {/* Big asymmetric headline that mixes serif italic + sans bold */}
        <h1 className="mt-6 leading-[0.9] tracking-tight text-ink font-extrabold text-[clamp(1.75rem,4.5vw,4rem)]">
          <span className="block">{el.packages.titleA}</span>
          <span className="block pl-[10vw]">
            <span className="font-display italic font-light">
              {el.packages.titleB}
            </span>
          </span>
          <span className="block">
            {el.packages.titleC}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 font-display italic font-light">
                {el.packages.titleD}
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-[0.55em] -z-0"
                viewBox="0 0 320 60"
                preserveAspectRatio="none"
              >
                <path
                  d="M5 38 Q 80 8 160 30 T 315 24"
                  stroke="#fbbf24"
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />
              </svg>
            </span>
          </span>
        </h1>

        <p className="mt-10 max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed">
          {el.packages.subtitle}
        </p>
      </div>
    </section>
  );
}

/* ─── PLANS ────────────────────────────────────────────────────────────── */

function Plans({
  packages,
  signedIn,
}: {
  packages: Package[];
  signedIn: boolean;
}) {
  if (packages.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-20 text-center text-muted">
        Δεν υπάρχουν διαθέσιμα πακέτα προς το παρόν.
      </section>
    );
  }

  return (
    <section className="relative pb-28">
      <div className="mx-auto max-w-7xl px-4">
        {/* Equal-width 3-column grid */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {packages.map((pkg) => {
            const theme = THEMES[pkg.slug] ?? FALLBACK_THEME;
            return (
              <PlanCard
                key={pkg.id}
                pkg={pkg}
                theme={theme}
                signedIn={signedIn}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  pkg,
  theme,
  signedIn,
}: {
  pkg: Package;
  theme: (typeof THEMES)[string];
  signedIn: boolean;
}) {
  const discount =
    pkg.original_price_cents && pkg.original_price_cents > pkg.price_cents
      ? Math.round((1 - pkg.price_cents / pkg.original_price_cents) * 100)
      : null;
  const expiresOn = new Date(
    Date.now() + pkg.duration_days * 24 * 60 * 60 * 1000,
  );

  return (
    <article
      className={`group relative flex flex-col rounded-[2rem] ${theme.surface} p-7 md:p-8 overflow-hidden transition-transform duration-500 hover:-translate-y-2 ${theme.popular ? "noise" : ""}`}
    >
      {/* Big background glyph as a watermark */}
      <div className="pointer-events-none absolute -bottom-16 -right-10 text-[14rem] leading-none font-display italic select-none opacity-[0.08]">
        {theme.icon}
      </div>

      {/* Discount sticker */}
      {discount !== null && (
        <div
          className={`absolute top-7 right-7 ${theme.sticker} px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider rotate-3 shadow-md`}
        >
          −{discount}%
        </div>
      )}

      {/* Popular tag */}
      {theme.popular && (
        <div className="absolute top-7 left-7">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-300 text-amber-950 text-[11px] font-bold uppercase tracking-wider shadow">
            <span>★</span>
            {el.packages.mostPopular}
          </span>
        </div>
      )}

      <div className="relative flex-1 flex flex-col">
        {/* Italic descriptor — magazine style */}
        <p
          className={`font-display italic text-sm md:text-base ${theme.ink} opacity-70 mt-10`}
        >
          {theme.label}
        </p>

        {/* Plan name */}
        <h2
          className={`mt-3 font-display text-3xl md:text-4xl font-light leading-[0.95] ${theme.ink} break-words`}
        >
          {pkg.name_el}
        </h2>

        {/* Price block */}
        <div className="mt-7 flex items-end gap-2 flex-wrap">
          <span
            className={`text-4xl md:text-5xl font-black ${theme.ink} tabular-nums leading-none`}
          >
            {formatEuro(pkg.price_cents)}
          </span>
          {pkg.original_price_cents && (
            <span
              className={`text-base ${theme.ink} opacity-50 line-through tabular-nums pb-1`}
            >
              {formatEuro(pkg.original_price_cents)}
            </span>
          )}
        </div>
        <p
          className={`mt-2 text-[11px] ${theme.ink} opacity-60 font-semibold uppercase tracking-wider`}
        >
          {el.packages.oneTime} · {pkg.duration_days} ημέρες
        </p>

        {/* Divider */}
        <div
          className={`mt-7 h-px ${theme.popular ? "bg-paper/20" : "bg-current opacity-15"}`}
        />

        {/* Features */}
        <ul className="mt-7 space-y-3 flex-1">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span
                className={`flex-shrink-0 mt-0.5 grid place-items-center w-5 h-5 rounded-full leading-none ${f.included ? theme.accent : "bg-transparent ring-1 ring-current opacity-30"} text-[10px] font-bold`}
              >
                <span className="block translate-y-[0.5px]">
                  {f.included ? "✓" : "×"}
                </span>
              </span>
              <span
                className={
                  "leading-snug " +
                  (f.included
                    ? theme.ink
                    : `${theme.ink} opacity-40 line-through`)
                }
              >
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer line + CTA */}
        <div
          className={`mt-8 text-[11px] ${theme.ink} opacity-60 flex items-center gap-1.5`}
        >
          <span className="inline-block w-1 h-1 rounded-full bg-current" />
          {el.packages.expiresOn} {formatDate(expiresOn)}
        </div>

        <div className="mt-4">
          <BuyButton
            packageId={pkg.id}
            signedIn={signedIn}
            buttonClass={theme.button}
          />
        </div>
      </div>
    </article>
  );
}

/* ─── COMPARE ──────────────────────────────────────────────────────────── */

function Compare({ packages }: { packages: Package[] }) {
  if (packages.length === 0) return null;

  // Build the union of all feature labels in their stable seed order so the
  // table reads consistently.
  const seen = new Set<string>();
  const allFeatures: string[] = [];
  for (const p of packages) {
    for (const f of p.features) {
      if (!seen.has(f.label)) {
        seen.add(f.label);
        allFeatures.push(f.label);
      }
    }
  }

  return (
    <section className="relative py-28 bg-ink text-paper overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-violet-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold tracking-[0.22em] uppercase text-amber-300">
            Λεπτομέρειες
          </div>
          <h2 className="mt-3 font-display text-5xl md:text-6xl font-light leading-[0.95]">
            {el.packages.compareTitle.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="italic">
              {el.packages.compareTitle.split(" ").slice(-1)}
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            {el.packages.compareSubtitle}
          </p>
        </div>

        <div className="relative overflow-x-auto rounded-3xl ring-1 ring-white/10 bg-white/[0.02] backdrop-blur">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-medium text-slate-400 px-6 py-5">
                  Χαρακτηριστικό
                </th>
                {packages.map((p) => (
                  <th
                    key={p.id}
                    className="text-center px-6 py-5 font-display italic font-light text-base md:text-lg"
                  >
                    {p.name_el}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((label, i) => (
                <tr
                  key={label}
                  className={
                    i % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent"
                  }
                >
                  <td className="px-6 py-4 text-slate-200">{label}</td>
                  {packages.map((p) => {
                    const f = p.features.find((x) => x.label === label);
                    const included = f?.included ?? false;
                    return (
                      <td key={p.id} className="text-center px-6 py-4">
                        {included ? (
                          <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-amber-300 text-ink font-bold leading-none">
                            <span className="block translate-y-[0.5px]">✓</span>
                          </span>
                        ) : (
                          <span className="inline-grid place-items-center w-7 h-7 rounded-full ring-1 ring-white/15 text-white/30 text-xs leading-none">
                            <span className="block">·</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-white/10">
                <td className="px-6 py-5 text-slate-400 font-medium">Τιμή</td>
                {packages.map((p) => (
                  <td
                    key={p.id}
                    className="text-center px-6 py-5 font-display text-2xl tabular-nums"
                  >
                    {formatEuro(p.price_cents)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── GUARANTEE ───────────────────────────────────────────────────────── */

function Guarantee() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* Big number / mark */}
          <div className="md:col-span-4">
            <div className="font-display text-[12rem] md:text-[16rem] leading-[0.8] font-light text-ink">
              ✦
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
              Καμία δέσμευση
            </div>
            <h2 className="mt-3 font-display text-5xl md:text-6xl font-light leading-[0.95] text-ink">
              {el.packages.guaranteeTitle.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="italic">
                {el.packages.guaranteeTitle.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
              {el.packages.guaranteeBody}
            </p>
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-amber-300 text-ink font-semibold shadow-xl shadow-amber-500/30 hover:bg-amber-400 hover:-translate-y-0.5 transition-all"
            >
              <span className="w-7 h-7 rounded-full bg-ink/15 grid place-items-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-3 h-3 ml-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              </span>
              {el.packages.guaranteeCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQS ─────────────────────────────────────────────────────────────── */

function Faqs() {
  return (
    <section className="relative pb-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
              FAQ
            </div>
            <h2 className="mt-3 font-display text-5xl font-light leading-[0.95] text-ink">
              {el.packages.faqTitle.split(" ")[0]}{" "}
              <span className="italic">
                {el.packages.faqTitle.split(" ")[1]}
              </span>
            </h2>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-ink underline decoration-amber-400 decoration-4 underline-offset-4 hover:decoration-amber-500 transition-colors"
            >
              {el.packages.faqMore} →
            </Link>
          </div>

          <div className="md:col-span-8 space-y-3">
            {el.packages.faqs.map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 transition-colors [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="font-display text-lg md:text-xl text-ink">
                    {item.q}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 grid place-items-center text-xl group-open:bg-ink group-open:text-paper group-open:rotate-45 transition-all">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
