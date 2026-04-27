"use client";
import { useState } from "react";
import { BuyButton } from "./BuyButton";
import { el } from "@/lib/i18n/el";
import type { Package } from "@/lib/types";
import { formatEuro } from "@/lib/format";
import { PACKAGES } from "./packages-data";

const SCHOOL_TYPES = [
  "Πρότυπα Γυμνάσια",
  "Πρότυπα Λύκεια",
  "Ωνάσεια Γυμνάσια",
  "Ωνάσεια Λύκεια",
] as const;


export function PlansClient({
  packages,
  signedIn,
}: {
  packages: Package[];
  signedIn: boolean;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const pkgBySlug = Object.fromEntries(packages.map((p) => [p.slug, p]));

  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* School-type tabs */}
        <div className="mb-12">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand mb-4">
            Επιλέξτε κατηγορία σχολείου
          </div>
          <div className="flex flex-wrap gap-2">
            {SCHOOL_TYPES.map((type, i) => (
              <button
                key={type}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === i
                    ? "bg-brand text-ink"
                    : "bg-white/5 text-paper/60 hover:bg-white/10 hover:text-paper"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-paper/40">
            Για φροντιστήρια προετοιμασίας εξετάσεων{" "}
            <span className="text-paper/70 font-bold">{SCHOOL_TYPES[activeTab]}</span>
          </p>
        </div>

        {/* Package cards */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {PACKAGES.map((pkg) => {
            const dbPkg = pkgBySlug[pkg.slug];
            return (
              <article
                key={pkg.slug}
                className={`group relative flex flex-col rounded-3xl ${pkg.surface} ${pkg.text} p-7 md:p-8 overflow-hidden transition-transform duration-300 hover:-translate-y-2`}
              >
                {/* Watermark */}
                <div className="pointer-events-none absolute -bottom-10 -right-6 text-[10rem] leading-none select-none opacity-[0.07]">
                  {pkg.icon}
                </div>

                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute top-7 left-7">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ink text-paper text-[11px] font-black uppercase tracking-wider">
                      ★ {el.packages.mostPopular}
                    </span>
                  </div>
                )}

                <div className="relative flex-1 flex flex-col">
                  <p className={`text-xs font-bold tracking-[0.2em] uppercase opacity-60 ${pkg.popular ? "mt-10" : "mt-0"}`}>
                    {pkg.label}
                  </p>

                  <h2 className="mt-3 font-display text-3xl md:text-4xl leading-none">
                    {pkg.name}
                  </h2>
                  <p className="mt-1 text-sm opacity-70 leading-snug">{pkg.subtitle}</p>
                  <p className="mt-0.5 text-[11px] opacity-40 italic">{pkg.note}</p>

                  {dbPkg ? (
                    <>
                      <div className="mt-7 flex items-end gap-2 flex-wrap">
                        <span className="font-display text-5xl md:text-6xl tabular-nums leading-none">
                          {formatEuro(dbPkg.price_cents)}
                        </span>
                        {dbPkg.original_price_cents && (
                          <span className="text-base opacity-40 line-through tabular-nums pb-1">
                            {formatEuro(dbPkg.original_price_cents)}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[11px] opacity-50 font-bold uppercase tracking-wider">
                        {el.packages.oneTime}
                      </p>
                    </>
                  ) : (
                    <div className="mt-7 font-display text-2xl opacity-40">—</div>
                  )}

                  <div className="mt-7 h-px bg-current opacity-15" />

                  <ul className="mt-7 space-y-3 flex-1">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span
                          className={`flex-shrink-0 mt-0.5 grid place-items-center w-5 h-5 rounded-full text-[10px] font-black leading-none ${pkg.checkBg} ${pkg.checkText}`}
                        >
                          ✓
                        </span>
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {dbPkg ? (
                      <BuyButton packageId={dbPkg.id} signedIn={signedIn} buttonClass={pkg.button} />
                    ) : (
                      <span className="inline-flex px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider opacity-30 ring-1 ring-current">
                        {el.packages.buy}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

