import Link from "next/link";
import { el } from "@/lib/i18n/el";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";
import { formatEuro } from "@/lib/format";
import { PlansClient } from "./PlansClient";
import { PACKAGES } from "./packages-data";


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
    <div>
      <Hero />
      <PlansClient packages={(packages as Package[]) ?? []} signedIn={!!user} />
      <Compare packages={(packages as Package[]) ?? []} />
      <Guarantee />
      <Faqs />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative bg-brand pt-16 pb-20 md:pt-24 md:pb-28 clip-x">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/50 mb-4">
          {el.packages.eyebrow}
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-none text-ink">
          {el.packages.titleA} {el.packages.titleB}
          <br />
          <span className="text-paper">{el.packages.titleC} {el.packages.titleD}</span>
        </h1>
        <p className="mt-8 max-w-xl text-base md:text-lg text-ink/60 leading-relaxed">
          {el.packages.subtitle}
        </p>
      </div>
    </section>
  );
}


/* ─── COMPARE ──────────────────────────────────────────────────────────── */

function Compare({ packages }: { packages: Package[] }) {
  const pkgBySlug = Object.fromEntries(packages.map((p) => [p.slug, p]));

  // All unique features across all packages, in order
  const seen = new Set<string>();
  const allFeatures: string[] = [];
  for (const pkg of PACKAGES) {
    for (const f of pkg.features) {
      if (!seen.has(f)) { seen.add(f); allFeatures.push(f); }
    }
  }

  return (
    <section className="relative py-28 bg-[#111] overflow-hidden">
      <div className="hidden sm:block pointer-events-none absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-brand/10 blur-3xl" />
      <div className="hidden sm:block pointer-events-none absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-accent-purple/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand mb-3">
            Λεπτομέρειες
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-none text-paper">
            {el.packages.compareTitle}
          </h2>
          <p className="mt-4 text-muted text-base">
            {el.packages.compareSubtitle}
          </p>
        </div>

        <div className="relative overflow-x-auto rounded-3xl ring-1 ring-white/10 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-bold text-muted uppercase tracking-wider text-[10px] px-6 py-5">
                  Χαρακτηριστικό
                </th>
                {PACKAGES.map((pkg) => (
                  <th key={pkg.slug} className="text-center px-6 py-5 font-display text-base md:text-lg text-paper">
                    {pkg.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((label, i) => (
                <tr key={label} className={i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}>
                  <td className="px-6 py-4 text-paper/70">{label}</td>
                  {PACKAGES.map((pkg) => {
                    const included = (pkg.features as readonly string[]).includes(label);
                    return (
                      <td key={pkg.slug} className="text-center px-6 py-4">
                        {included ? (
                          <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-accent text-ink font-black text-xs leading-none">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-grid place-items-center w-7 h-7 rounded-full ring-1 ring-white/15 text-white/20 text-xs leading-none">
                            ·
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-white/10">
                <td className="px-6 py-5 text-muted font-bold uppercase tracking-wider text-[10px]">Τιμή</td>
                {PACKAGES.map((pkg) => {
                  const dbPkg = pkgBySlug[pkg.slug];
                  return (
                    <td key={pkg.slug} className="text-center px-6 py-5 font-display text-2xl text-accent tabular-nums">
                      {dbPkg ? formatEuro(dbPkg.price_cents) : "—"}
                    </td>
                  );
                })}
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
    <section className="relative py-28 bg-brand clip-x overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4">
            <div className="font-display text-[6rem] sm:text-[10rem] md:text-[14rem] leading-none text-ink/10 select-none">
              ✦
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/50 mb-3">
              Καμία δέσμευση
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-none text-ink">
              {el.packages.guaranteeTitle}
            </h2>
            <p className="mt-6 text-base text-ink/60 max-w-xl leading-relaxed">
              {el.packages.guaranteeBody}
            </p>
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-accent-purple text-white font-black uppercase tracking-wider text-sm hover:bg-[#6500b0] hover:-translate-y-0.5 transition-all"
            >
              <span className="w-6 h-6 rounded-full bg-accent/20 grid place-items-center group-hover:scale-110 transition-transform">
                <svg className="w-2.5 h-2.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
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
    <section className="relative py-28 bg-ink">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand mb-3">
              FAQ
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-none text-paper">
              {el.packages.faqTitle}
            </h2>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-brand hover:text-accent transition-colors uppercase tracking-wider"
            >
              {el.packages.faqMore} →
            </Link>
          </div>

          <div className="md:col-span-8 space-y-3">
            {el.packages.faqs.map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-colors [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="font-display text-lg md:text-xl text-paper">
                    {item.q}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full border border-white/20 text-paper/60 grid place-items-center text-xl group-open:bg-accent group-open:text-ink group-open:border-accent group-open:rotate-45 transition-all">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-paper/50 leading-relaxed text-sm">
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
