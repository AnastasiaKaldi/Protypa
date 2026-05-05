"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { el } from "@/lib/i18n/el";

const CATEGORY_NUMERALS: Record<string, string> = {
  general: "01",
  packages: "02",
  grading: "03",
  account: "04",
};

export function FaqClient() {
  const [activeCat, setActiveCat] = useState<string>(
    el.faq.categories[0]?.id ?? "general",
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const cat = el.faq.categories.find((c) => c.id === activeCat);
      return cat ? [{ ...cat, items: cat.items }] : [];
    }
    return el.faq.categories
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (it) =>
            it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [query, activeCat]);

  const totalMatches = filtered.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <>
      <section className="relative bg-white pt-12 md:pt-24 pb-16 md:pb-24 overflow-hidden">
        {/* Sprite decorations */}
        <img src="/TransparentAssets/Asset 21.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-6 right-4 w-24 md:w-36 opacity-20 rotate-6 hidden sm:block" />
        <img src="/TransparentAssets/Asset 23.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-10 right-8 w-20 md:w-32 opacity-15 -rotate-6 hidden sm:block" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          {/* Search bar */}
          <div className="relative max-w-xl">
            <div className="flex items-center gap-3 border-b-2 border-ink/20 pb-3 focus-within:border-brand transition-colors">
              <SearchIcon className="w-5 h-5 text-ink/40 flex-shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={el.faq.searchPlaceholder}
                className="w-full bg-transparent text-lg md:text-xl font-display text-ink placeholder:text-ink/30 placeholder:font-display focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-ink/40 hover:text-ink text-sm font-bold cursor-pointer flex-shrink-0 transition-colors"
                  aria-label="Καθαρισμός"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Two-column layout */}
          <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left — category sidebar */}
            {!query && (
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-6">
                    Κατηγορίες
                  </div>
                  <ul className="space-y-1">
                    {el.faq.categories.map((cat) => {
                      const numeral = CATEGORY_NUMERALS[cat.id] ?? "00";
                      const isActive = cat.id === activeCat;
                      return (
                        <li key={cat.id}>
                          <button
                            onClick={() => setActiveCat(cat.id)}
                            className={`group w-full flex items-baseline gap-4 py-4 border-b text-left transition-colors cursor-pointer ${
                              isActive
                                ? "border-brand text-ink"
                                : "border-ink/10 text-ink/50 hover:text-ink hover:border-ink/25"
                            }`}
                          >
                            <span className={`font-display text-2xl tabular-nums flex-shrink-0 ${isActive ? "text-brand" : "text-ink/20"}`}>
                              {numeral}
                            </span>
                            <span className={`font-display text-xl md:text-2xl leading-tight flex-1 ${isActive ? "text-ink" : ""}`}>
                              {cat.label}
                            </span>
                            {isActive && (
                              <span className="font-display text-xl text-brand flex-shrink-0">→</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-10 text-sm text-ink/50 leading-relaxed max-w-xs">
                    Δεν βρίσκετε αυτό που ψάχνετε;{" "}
                    <Link
                      href="/epikoinonia"
                      className="text-brand hover:text-accent-purple transition-colors font-bold"
                    >
                      Στείλτε μας μήνυμα
                    </Link>
                    .
                  </p>
                </div>
              </aside>
            )}

            {/* Right — Q&A list */}
            <div className={query ? "lg:col-span-12" : "lg:col-span-8"}>
              {totalMatches === 0 ? (
                <NoResults query={query} />
              ) : (
                <div className="space-y-16">
                  {filtered.map((cat) => (
                    <div key={cat.id}>
                      {query && (
                        <div className="mb-6 flex items-baseline gap-4">
                          <span className="font-display text-2xl text-ink">{cat.label}</span>
                          <span className="text-[10px] text-ink/40 font-bold uppercase tracking-wider">
                            {cat.items.length} {cat.items.length === 1 ? "ερώτηση" : "ερωτήσεις"}
                          </span>
                        </div>
                      )}
                      <div className="divide-y divide-ink/10 border-y border-ink/10">
                        {cat.items.map((item, i) => (
                          <FaqItem
                            key={`${cat.id}-${i}`}
                            number={i + 1}
                            question={item.q}
                            answer={item.a}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <NotFoundCta />
    </>
  );
}

function FaqItem({ number, question, answer }: { number: number; question: string; answer: string }) {
  return (
    <details className="group py-7 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-start gap-4 md:gap-6 cursor-pointer list-none">
        <span className="font-display text-sm md:text-base tabular-nums text-ink/30 group-open:text-brand transition-colors flex-shrink-0 mt-1">
          {String(number).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-base sm:text-2xl md:text-3xl leading-tight text-ink">
          {question}
        </span>
        <span className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full border border-ink/15 text-ink/40 grid place-items-center text-xl group-open:bg-accent group-open:text-ink group-open:border-accent group-open:rotate-45 transition-all">
          +
        </span>
      </summary>
      <div className="mt-4 ml-9 md:ml-12 max-w-2xl text-sm md:text-base text-ink/60 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="py-16">
      <div className="font-display text-7xl text-ink/10">Hmm.</div>
      <h3 className="mt-6 font-display text-3xl text-ink">{el.faq.noResults}</h3>
      <p className="mt-3 text-ink/50 max-w-md text-sm">
        Δοκιμάστε διαφορετικούς όρους αναζήτησης
        {query && (
          <> (ψάξατε για <span className="font-bold text-ink">&ldquo;{query}&rdquo;</span>)</>
        )}
        , ή{" "}
        <Link href="/epikoinonia" className="text-brand hover:text-accent-purple font-bold transition-colors">
          ρωτήστε μας απευθείας
        </Link>.
      </p>
    </div>
  );
}

function NotFoundCta() {
  return (
    <section className="relative bg-[#111] py-16 md:py-28 overflow-hidden">
      <div className="hidden sm:block pointer-events-none absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-brand/10 blur-3xl" />
      <div className="hidden sm:block pointer-events-none absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-accent-purple/10 blur-3xl" />
      {/* Sprite decorations */}
      <img src="/TransparentAssets/Asset 24.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-10 left-8 w-28 md:w-40 opacity-20 -rotate-12 hidden sm:block" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4">
            <div className="font-display text-[6rem] sm:text-[10rem] md:text-[18rem] leading-none text-brand/20 select-none">
              ?
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand mb-3">
              Χρειάζεστε βοήθεια;
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-paper">
              {el.faq.notFoundTitle}
            </h2>
            <p className="mt-4 text-base text-paper/60 max-w-md leading-relaxed">
              {el.faq.notFoundBody}
            </p>
            <Link
              href="/epikoinonia"
              className="group inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-accent-purple font-black uppercase tracking-wider text-sm hover:bg-[#6500b0] hover:-translate-y-0.5 transition-all"
              style={{ color: "#ffffff" }}
            >
              {el.faq.notFoundCta}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
