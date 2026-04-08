import Link from "next/link";
import { el } from "@/lib/i18n/el";

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Story />
      <Mission />
      <Cta />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative pt-20 pb-12 md:pt-28 md:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-paper" />
        <div className="absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-20 -left-40 w-[36rem] h-[36rem] rounded-full bg-amber-200/30 blur-3xl" />
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
          {el.about.eyebrow}
        </div>

        <h1 className="mt-6 leading-[0.9] tracking-tight text-ink text-[clamp(1.75rem,4.5vw,4rem)] font-extrabold">
          <span className="block">{el.about.titleA}</span>
          <span className="block pl-[6vw] relative">
            <span className="font-display italic font-light">
              {el.about.titleB}
            </span>
            {/* Decorative ampersand glyph */}
            <span
              className="absolute -top-8 right-0 md:right-12 font-display text-[6rem] md:text-[9rem] leading-none italic font-light text-amber-400/80 select-none pointer-events-none"
              aria-hidden
            >
              &amp;
            </span>
          </span>
        </h1>

        <p className="mt-10 max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed">
          {el.about.intro}
        </p>
      </div>
    </section>
  );
}

/* ─── STORY ────────────────────────────────────────────────────────────── */

function Story() {
  return (
    <section className="relative pt-12 md:pt-16 pb-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left column — section label */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
                {el.about.storyEyebrow}
              </div>
              <div className="mt-8 font-display text-[10rem] leading-[0.8] italic font-light text-amber-400/90 select-none">
                01
              </div>
            </div>
          </aside>

          {/* Right column — story */}
          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[0.95] text-ink">
              {el.about.storyTitle.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="italic">
                {el.about.storyTitle.split(" ").slice(-2).join(" ")}
              </span>
            </h2>
            <p className="mt-8 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              {el.about.storyBody1}
            </p>
            <p className="mt-5 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              {el.about.storyBody2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── MISSION ──────────────────────────────────────────────────────────── */

function Mission() {
  return (
    <section className="relative bg-ink text-paper py-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-emerald-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="text-xs font-bold tracking-[0.22em] uppercase text-amber-300">
                {el.about.missionEyebrow}
              </div>
              <div className="mt-8 font-display text-[10rem] leading-[0.8] italic font-light text-amber-300/30 select-none">
                02
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[0.95]">
              {el.about.missionTitle.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="italic text-amber-300">
                {el.about.missionTitle.split(" ").slice(-2).join(" ")}
              </span>
            </h2>
            <p className="mt-8 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
              {el.about.missionBody}
            </p>

            {/* Values list — magazine style with serif numerals */}
            <ul className="mt-16 divide-y divide-white/10 border-y border-white/10">
              {el.about.values.map((v, i) => (
                <li key={i} className="group py-7">
                  <div className="flex items-baseline gap-6">
                    <span className="font-display text-3xl tabular-nums font-light text-amber-300/40 group-hover:text-amber-300 transition-colors flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl md:text-3xl font-light leading-tight group-hover:italic transition-all">
                        {v.title}
                      </h3>
                      <p className="mt-3 text-slate-400 leading-relaxed max-w-xl">
                        {v.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ──────────────────────────────────────────────────────────────── */

function Cta() {
  return (
    <section className="relative pt-28 pb-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* Left — big italic glyph */}
          <div className="md:col-span-4">
            <div className="font-display text-[14rem] md:text-[18rem] leading-[0.8] italic font-light text-ink">
              ✦
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
              Ξεκινήστε σήμερα
            </div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl font-light leading-[0.95] text-ink">
              {el.about.ctaTitle.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="italic">
                {el.about.ctaTitle.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
              {el.about.ctaBody}
            </p>

            <div className="mt-10 flex items-center gap-3 flex-wrap">
              <Link
                href="/paketa"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-white font-semibold shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
              >
                {el.about.ctaPackages}
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
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-amber-300 text-ink font-semibold shadow-xl shadow-amber-500/30 hover:bg-amber-400 hover:-translate-y-0.5 transition-all"
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
                {el.about.ctaDemo}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
