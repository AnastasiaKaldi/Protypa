"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { el } from "@/lib/i18n/el";

// Category metadata: editorial flat tones, no rainbow gradients.
const CATEGORY_META: Record<
  string,
  { tone: string; toneActive: string; numeral: string }
> = {
  general: {
    tone: "text-slate-500 hover:text-ink",
    toneActive: "text-ink",
    numeral: "01",
  },
  packages: {
    tone: "text-slate-500 hover:text-ink",
    toneActive: "text-ink",
    numeral: "02",
  },
  grading: {
    tone: "text-slate-500 hover:text-ink",
    toneActive: "text-ink",
    numeral: "03",
  },
  account: {
    tone: "text-slate-500 hover:text-ink",
    toneActive: "text-ink",
    numeral: "04",
  },
};
const FALLBACK_META = CATEGORY_META.general;

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
      {/* Search + content section */}
      <section className="relative pt-16 md:pt-24 pb-24">
        <div className="mx-auto max-w-7xl px-4">
          {/* Search bar */}
          <div className="relative max-w-xl">
            <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
              <SearchIcon className="w-5 h-5 text-ink flex-shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={el.faq.searchPlaceholder}
                className="w-full bg-transparent text-lg md:text-xl font-display text-ink placeholder:text-slate-400 placeholder:italic focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-ink text-sm font-semibold cursor-pointer flex-shrink-0"
                  aria-label="Καθαρισμός"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Two-column: TOC on left, questions on right */}
          <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left column — magazine-style table of contents */}
            {!query && (
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
                    Κατηγορίες
                  </div>
                  <ul className="mt-6 space-y-1">
                    {el.faq.categories.map((cat) => {
                      const meta = CATEGORY_META[cat.id] ?? FALLBACK_META;
                      const isActive = cat.id === activeCat;
                      return (
                        <li key={cat.id}>
                          <button
                            onClick={() => setActiveCat(cat.id)}
                            className={
                              "group w-full flex items-baseline gap-4 py-3 border-b border-slate-200 text-left transition-colors cursor-pointer " +
                              (isActive ? meta.toneActive : meta.tone)
                            }
                          >
                            <span className="font-display text-2xl tabular-nums font-light flex-shrink-0">
                              {meta.numeral}
                            </span>
                            <span
                              className={
                                "font-display text-2xl md:text-3xl font-light leading-tight flex-1 " +
                                (isActive ? "italic" : "")
                              }
                            >
                              {cat.label}
                            </span>
                            {isActive && (
                              <span className="font-display text-2xl text-amber-400 flex-shrink-0">
                                →
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-10 text-sm text-slate-500 leading-relaxed max-w-xs">
                    Δεν βρίσκετε αυτό που ψάχνετε; Δοκιμάστε την αναζήτηση
                    πάνω, ή{" "}
                    <Link
                      href="/epikoinonia"
                      className="text-ink underline decoration-amber-400 decoration-4 underline-offset-4 hover:decoration-amber-500"
                    >
                      στείλτε μας μήνυμα
                    </Link>
                    .
                  </p>
                </div>
              </aside>
            )}

            {/* Right column — Q&A */}
            <div className={query ? "lg:col-span-12" : "lg:col-span-8"}>
              {totalMatches === 0 ? (
                <NoResults query={query} />
              ) : (
                <div className="space-y-16">
                  {filtered.map((cat) => (
                    <div key={cat.id}>
                      {/* Section header — only when searching, otherwise the TOC plays this role */}
                      {query && (
                        <div className="mb-6 flex items-baseline gap-4">
                          <span className="font-display text-3xl italic font-light text-ink">
                            {cat.label}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            {cat.items.length}{" "}
                            {cat.items.length === 1 ? "ερώτηση" : "ερωτήσεις"}
                          </span>
                        </div>
                      )}

                      <div className="divide-y divide-slate-200 border-y border-slate-200">
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

      {/* Dark contact band */}
      <NotFoundCta />
    </>
  );
}

function FaqItem({
  number,
  question,
  answer,
}: {
  number: number;
  question: string;
  answer: string;
}) {
  return (
    <details className="group py-7 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-start gap-6 cursor-pointer list-none">
        <span className="font-display text-base tabular-nums text-slate-400 group-open:text-amber-500 transition-colors flex-shrink-0 mt-1">
          {String(number).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-2xl md:text-3xl font-light leading-tight text-ink group-hover:italic transition-all">
          {question}
        </span>
        <span className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-ink text-ink grid place-items-center text-xl group-open:bg-ink group-open:text-paper group-open:rotate-45 transition-all">
          +
        </span>
      </summary>
      <div className="mt-5 ml-12 max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="py-16">
      <div className="font-display text-7xl font-light text-slate-300 italic">
        Hmm.
      </div>
      <h3 className="mt-6 font-display text-3xl text-ink">
        {el.faq.noResults}
      </h3>
      <p className="mt-3 text-slate-600 max-w-md">
        Δοκιμάστε διαφορετικούς όρους αναζήτησης
        {query && (
          <>
            {" "}
            (ψάξατε για{" "}
            <span className="font-semibold text-ink italic">
              &ldquo;{query}&rdquo;
            </span>
            )
          </>
        )}
        , ή{" "}
        <Link
          href="/epikoinonia"
          className="text-ink underline decoration-amber-400 decoration-4 underline-offset-4 hover:decoration-amber-500"
        >
          ρωτήστε μας απευθείας
        </Link>
        .
      </p>
    </div>
  );
}

function NotFoundCta() {
  return (
    <section className="relative bg-ink text-paper py-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* Big italic ? mark */}
          <div className="md:col-span-4">
            <div className="font-display text-[14rem] md:text-[18rem] leading-[0.8] italic font-light text-amber-300/90">
              ?
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="text-xs font-bold tracking-[0.22em] uppercase text-amber-300">
              {el.faq.notFoundTitle ? "Δεν βρήκατε απάντηση;" : "Επικοινωνία"}
            </div>
            <h2 className="mt-3 font-display text-5xl md:text-7xl font-light leading-[0.9]">
              {el.faq.notFoundTitle.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="italic">
                {el.faq.notFoundTitle.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">
              {el.faq.notFoundBody}
            </p>
            <Link
              href="/epikoinonia"
              className="group inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-amber-300 text-ink font-semibold shadow-xl shadow-amber-500/20 hover:-translate-y-0.5 hover:shadow-2xl transition-all"
            >
              {el.faq.notFoundCta}
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
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
