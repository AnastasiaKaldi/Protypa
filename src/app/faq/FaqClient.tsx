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
      <section className="relative bg-ink pt-16 md:pt-24 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          {/* Search bar */}
          <div className="relative max-w-xl">
            <div className="flex items-center gap-3 border-b-2 border-white/20 pb-3 focus-within:border-brand transition-colors">
              <SearchIcon className="w-5 h-5 text-muted flex-shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={el.faq.searchPlaceholder}
                className="w-full bg-transparent text-lg md:text-xl font-display text-paper placeholder:text-muted placeholder:font-display focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-muted hover:text-paper text-sm font-bold cursor-pointer flex-shrink-0 transition-colors"
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
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-6">
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
                                ? "border-brand text-paper"
                                : "border-white/10 text-muted hover:text-paper hover:border-white/30"
                            }`}
                          >
                            <span className={`font-display text-2xl tabular-nums flex-shrink-0 ${isActive ? "text-brand" : "text-muted/50"}`}>
                              {numeral}
                            </span>
                            <span className={`font-display text-xl md:text-2xl leading-tight flex-1 ${isActive ? "text-paper" : ""}`}>
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

                  <p className="mt-10 text-sm text-muted leading-relaxed max-w-xs">
                    Δεν βρίσκετε αυτό που ψάχνετε;{" "}
                    <Link
                      href="/epikoinonia"
                      className="text-brand hover:text-accent transition-colors font-bold"
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
                          <span className="font-display text-2xl text-paper">{cat.label}</span>
                          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                            {cat.items.length} {cat.items.length === 1 ? "ερώτηση" : "ερωτήσεις"}
                          </span>
                        </div>
                      )}
                      <div className="divide-y divide-white/10 border-y border-white/10">
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
      <summary className="flex items-start gap-6 cursor-pointer list-none">
        <span className="font-display text-base tabular-nums text-muted group-open:text-brand transition-colors flex-shrink-0 mt-1">
          {String(number).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-lg sm:text-2xl md:text-3xl leading-tight text-paper">
          {question}
        </span>
        <span className="flex-shrink-0 w-9 h-9 rounded-full border border-white/20 text-muted grid place-items-center text-xl group-open:bg-accent group-open:text-ink group-open:border-accent group-open:rotate-45 transition-all">
          +
        </span>
      </summary>
      <div className="mt-5 ml-12 max-w-2xl text-sm md:text-base text-muted leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="py-16">
      <div className="font-display text-7xl text-white/10">Hmm.</div>
      <h3 className="mt-6 font-display text-3xl text-paper">{el.faq.noResults}</h3>
      <p className="mt-3 text-muted max-w-md text-sm">
        Δοκιμάστε διαφορετικούς όρους αναζήτησης
        {query && (
          <> (ψάξατε για <span className="font-bold text-paper">&ldquo;{query}&rdquo;</span>)</>
        )}
        , ή{" "}
        <Link href="/epikoinonia" className="text-brand hover:text-accent font-bold transition-colors">
          ρωτήστε μας απευθείας
        </Link>.
      </p>
    </div>
  );
}

function NotFoundCta() {
  return (
    <section className="relative bg-[#111] py-28 overflow-hidden">
      <div className="hidden sm:block pointer-events-none absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-brand/10 blur-3xl" />
      <div className="hidden sm:block pointer-events-none absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-accent-purple/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4">
            <div className="font-display text-[6rem] sm:text-[10rem] md:text-[18rem] leading-none text-brand/20 select-none">
              ?
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand mb-3">
              {el.faq.notFoundTitle}
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-none text-paper">
              {el.faq.notFoundBody}
            </h2>
            <Link
              href="/epikoinonia"
              className="group inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-accent-purple text-white font-black uppercase tracking-wider text-sm hover:bg-[#6500b0] hover:-translate-y-0.5 transition-all"
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
