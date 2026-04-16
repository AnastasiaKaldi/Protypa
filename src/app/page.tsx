import Link from "next/link";
import { el } from "@/lib/i18n/el";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Marquee />
      <Bento />
      <HowItWorks />
      <Manifesto />
      <FinalCta />
    </div>
  );
}

/* ─── 1. HERO ──────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative pt-20 pb-32 md:pt-28 md:pb-40">
      {/* Layered background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-paper" />
        <div className="hidden sm:block absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full bg-violet-300/30 blur-3xl" />
        <div className="hidden sm:block absolute top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-orange-300/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Copy column */}
          <div className="lg:col-span-7">
            {/* Editorial headline mixing serif + sans */}
            <h1 className="text-[clamp(1.75rem,5.5vw,5.75rem)] leading-[0.95] tracking-tight font-extrabold text-ink">
              <span className="block font-display italic font-light">
                {el.home.heroPre}
              </span>
              <span className="block">
                {el.home.heroTitle}
                <span className="relative inline-block align-baseline">
                  <span className="relative z-10">
                    {el.home.heroTitleAccent}
                  </span>
                  {/* Hand-drawn highlight stroke */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-[0.6em] -z-0"
                    viewBox="0 0 320 50"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 35 Q 80 5 160 28 T 315 22"
                      stroke="url(#hg)"
                      strokeWidth="14"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.85"
                    />
                    <defs>
                      <linearGradient id="hg" x1="0" x2="1">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="50%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                <span className="font-display italic font-light">
                  {el.home.heroTitlePost}
                </span>
              </span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
              {el.home.heroSubtitle}
            </p>

            <div className="mt-10 flex items-center gap-3 flex-wrap">
              <Link
                href="/paketa"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#f97149] text-white font-semibold hover:bg-[#ec5a30] hover:-translate-y-0.5 shadow-xl shadow-[#f97149]/40 transition-all"
              >
                {el.home.heroCtaPrimary}
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
                {el.home.heroCtaSecondary}
              </Link>
            </div>

          </div>

          {/* Visual column — tilted preview card (hidden on small mobile) */}
          <div className="hidden md:block lg:col-span-5 relative">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Rotating circular seal — top left */}
              <div className="hidden sm:grid absolute -top-10 -left-10 z-20 w-28 h-28 md:w-32 md:h-32 place-items-center drop-shadow-xl">
                <div className="absolute inset-0 rounded-full bg-amber-300" />
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-slow text-ink"
                  viewBox="0 0 100 100"
                >
                  <defs>
                    <path
                      id="seal-circle"
                      d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                    />
                  </defs>
                  <text
                    fontSize="10"
                    fontWeight="800"
                    letterSpacing="0.6"
                    fill="currentColor"
                    fontFamily="var(--font-sans-greek), system-ui, sans-serif"
                  >
                    <textPath href="#seal-circle" startOffset="0">
                      ΦΤΙΑΓΜΕΝΟ ΑΠΟ ΕΚΠΑΙΔΕΥΤΙΚΟΥΣ
                    </textPath>
                  </text>
                </svg>
                <span className="relative font-display italic font-light text-3xl md:text-4xl text-ink">
                  ✦
                </span>
              </div>

              {/* Polaroid-style grade card — bottom right */}
              <div
                className="hidden sm:block absolute -bottom-10 -right-6 z-20 bg-paper p-3 pb-6 rounded-md shadow-2xl rotate-[6deg] animate-float-slow"
                style={{ ["--rot" as string]: "6deg" }}
              >
                {/* Tape */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-200/80 rotate-[-2deg] shadow-sm" />

                {/* "Photo" area */}
                <div className="w-36 h-24 bg-gradient-to-br from-emerald-100 via-teal-100 to-emerald-50 rounded-sm flex flex-col items-center justify-center">
                  <div className="font-display text-5xl font-light text-emerald-700 leading-none tabular-nums">
                    18
                    <span className="text-2xl text-emerald-500">/20</span>
                  </div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                    Άριστα
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-2 text-center font-display italic text-xs text-slate-600">
                  Μαρία, ΣΤ&apos; Δημοτικού
                </div>
              </div>

              {/* Layered background card */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-fuchsia-400 to-orange-400 rounded-[2rem] rotate-3 blur-[2px] opacity-80" />

              {/* Main "screenshot" mock */}
              <div className="relative rounded-[1.75rem] bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden -rotate-2 hover:rotate-0 transition-transform duration-700">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div className="ml-3 text-[10px] font-mono text-slate-400">
                    protypapass.gr/grade/...
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Question mock */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Ερώτηση 3
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 ring-1 ring-violet-200">
                      Πολλαπλασιασμός
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Πόσο κάνει 12 × 8;</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["α) 86", "β) 92", "γ) 96", "δ) 108"].map((c, i) => (
                      <span
                        key={c}
                        className={
                          "px-3 py-1.5 rounded-lg text-xs font-medium border " +
                          (i === 2
                            ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent shadow"
                            : "bg-white text-slate-600 border-slate-200")
                        }
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Result mini bar */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Πολλαπλασιασμός</span>
                      <span className="font-semibold tabular-nums">4/5</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[80%] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Κλάσματα</span>
                      <span className="font-semibold tabular-nums">2/3</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[66%] bg-gradient-to-r from-orange-400 to-rose-500 rounded-full" />
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Σύνολο</span>
                    <span className="text-2xl font-black text-ink tabular-nums">
                      18<span className="text-base text-slate-400">/20</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-24 pt-10 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-3xl">
          <Stat value={el.home.statsLabel1} label={el.home.heroStat1} />
          <Stat value={el.home.statsLabel2} label={el.home.heroStat2} />
          <Stat value={el.home.statsLabel3} label={el.home.heroStat3} />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-5xl md:text-6xl font-light text-ink tabular-nums leading-none">
        {value}
      </div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

/* ─── 2. MARQUEE ───────────────────────────────────────────────────────── */

function Marquee() {
  // Duplicate items so the loop is seamless
  const items = [...el.home.marqueeItems, ...el.home.marqueeItems];
  return (
    <section className="relative py-5 bg-ink text-white border-y border-slate-800 overflow-hidden">
      <div className="flex gap-8 whitespace-nowrap animate-marquee">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-8 text-lg md:text-xl font-display italic font-light flex-shrink-0"
          >
            {item}
            <Star />
          </div>
        ))}
      </div>
    </section>
  );
}

function Star() {
  return (
    <svg
      className="w-4 h-4 text-amber-300 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2l2.4 7.2H22l-6 4.4 2.3 7.2L12 16.4 5.7 20.8 8 13.6 2 9.2h7.6L12 2z" />
    </svg>
  );
}

/* ─── 3. BENTO GRID ────────────────────────────────────────────────────── */

function Bento() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
            Τι κάνουμε
          </div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-light leading-[0.95] text-ink">
            Όλα όσα χρειάζεστε,{" "}
            <span className="italic">σε ένα μέρος.</span>
          </h2>
        </div>

        {/* Bento grid: mixed sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 md:gap-5 sm:auto-rows-[minmax(180px,auto)]">
          {/* Big featured card */}
          <div className="sm:col-span-6 md:col-span-4 md:row-span-2 relative rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 text-white p-6 sm:p-8 md:p-10 overflow-hidden noise group">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 text-[10rem] md:text-[20rem] leading-none -mb-12 -mr-6 md:-mb-24 md:-mr-12 opacity-10 select-none">
              ✓
            </div>
            <div className="relative">
              <div className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                Διόρθωση
              </div>
              <h3 className="mt-4 font-display text-2xl sm:text-4xl md:text-5xl leading-[0.95] font-light">
                Διορθώστε ένα γραπτό σε{" "}
                <span className="italic">δευτερόλεπτα.</span>
              </h3>
              <p className="mt-6 max-w-md text-white/90 leading-relaxed">
                Καταχωρήστε τις απαντήσεις του μαθητή. Εμείς υπολογίζουμε
                βαθμό, ποσοστό και αναλυτικά στατιστικά ανά κατηγορία ερώτησης.
              </p>
            </div>
          </div>

          {/* Top right small */}
          <BentoCard
            span="col-span-6 sm:col-span-3 md:col-span-2"
            tone="bg-amber-100 text-amber-950"
            label="Πραγματικά θέματα"
            title="500+ θέματα"
            body="Συλλογή από προηγούμενα έτη με αναλυτικές απαντήσεις."
            decoration={
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-20">
                📄
              </div>
            }
          />

          {/* Middle right small */}
          <BentoCard
            span="col-span-6 sm:col-span-3 md:col-span-2"
            tone="bg-emerald-100 text-emerald-950"
            label="Πρόσβαση"
            title="Παντού"
            body="Λειτουργεί σε υπολογιστή, tablet και κινητό."
            decoration={
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-20">
                📱
              </div>
            }
          />

          {/* Bottom row: 3 even cards */}
          <BentoCard
            span="col-span-6 md:col-span-2"
            tone="bg-rose-100 text-rose-950"
            label="Στατιστικά"
            title="Ανά κατηγορία ερώτησης"
            body="Δείτε πού τα πάει καλά κάθε μαθητής και πού χρειάζεται βοήθεια."
          />
          <BentoCard
            span="col-span-6 md:col-span-2"
            tone="bg-sky-100 text-sky-950"
            label="Ασφάλεια"
            title="Ασφαλείς πληρωμές"
            body="Stripe για κάθε συναλλαγή. Δεν αποθηκεύουμε στοιχεία κάρτας."
          />
          <BentoCard
            span="col-span-6 md:col-span-2"
            tone="bg-violet-100 text-violet-950"
            label="Ιστορικό"
            title="Όλοι οι μαθητές σας"
            body="Κάθε διόρθωση αποθηκεύεται για να παρακολουθείτε την πρόοδο."
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  span,
  tone,
  label,
  title,
  body,
  decoration,
}: {
  span: string;
  tone: string;
  label: string;
  title: string;
  body: string;
  decoration?: React.ReactNode;
}) {
  return (
    <div
      className={`${span} relative rounded-3xl ${tone} p-7 md:p-8 overflow-hidden hover:-translate-y-1 transition-transform duration-300`}
    >
      {decoration}
      <div className="relative">
        <div className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-70">
          {label}
        </div>
        <h3 className="mt-3 font-display text-2xl md:text-3xl leading-tight font-light">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed opacity-80 max-w-xs">
          {body}
        </p>
      </div>
    </div>
  );
}

/* ─── 4. HOW IT WORKS — big editorial numbers ──────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Επιλέξτε πακέτο",
      body:
        "Διαλέξτε Μαθηματικά, Γλώσσα, ή το Πλήρες Πακέτο. 30 ημέρες πρόσβαση από την στιγμή της αγοράς.",
    },
    {
      n: "02",
      title: "Πληρώστε με ασφάλεια",
      body:
        "Stripe Checkout, εφάπαξ πληρωμή. Λαμβάνετε άμεσα απόδειξη μέσω email.",
    },
    {
      n: "03",
      title: "Ανοίξτε ένα θέμα",
      body:
        "Το PDF του γραπτού στα αριστερά, οι ερωτήσεις πολλαπλής επιλογής στα δεξιά.",
    },
    {
      n: "04",
      title: "Δείτε αποτελέσματα",
      body:
        "Βαθμός, ποσοστό και ανάλυση ανά κατηγορία, σε λιγότερο από ένα δευτερόλεπτο.",
    },
  ];

  return (
    <section className="relative py-28 bg-ink text-white overflow-hidden">
      <div className="hidden sm:block pointer-events-none absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-violet-600/20 blur-3xl" />
      <div className="hidden sm:block pointer-events-none absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="max-w-3xl mb-16">
          <div className="font-display text-4xl md:text-6xl font-light text-amber-300">
            Πώς λειτουργεί
          </div>
          <h2 className="mt-4 text-sm md:text-base font-medium leading-relaxed text-slate-300 max-w-xl">
            Από την αγορά στο{" "}
            <span className="italic text-amber-300">πρώτο αποτέλεσμα</span>{" "}
            σε 5 λεπτά.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
          {steps.map((s) => (
            <div key={s.n} className="group flex gap-6">
              <div className="font-display text-5xl sm:text-7xl md:text-8xl font-light leading-none text-amber-300/30 group-hover:text-amber-300 transition-colors duration-500 tabular-nums">
                {s.n}
              </div>
              <div className="pt-3">
                <h3 className="font-display text-2xl md:text-3xl leading-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-slate-300 leading-relaxed max-w-md">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. MANIFESTO ─────────────────────────────────────────────────────── */

function Manifesto() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
          {el.home.manifestoEyebrow}
        </div>
        <blockquote className="mt-6 font-display text-xl sm:text-3xl md:text-5xl leading-[1.15] font-light text-ink">
          <span className="text-amber-400 text-6xl leading-none align-top mr-1">
            “
          </span>
          {el.home.manifestoQuote}
          <span className="text-amber-400 text-6xl leading-none align-top ml-1">
            ”
          </span>
        </blockquote>
        <div className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {el.home.manifestoBy}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. FINAL CTA ─────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="relative pb-28 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 px-6 py-20 md:px-16 md:py-24 text-ink noise">
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-300/40 blur-3xl" />

          <div className="relative max-w-3xl">
            <h2 className="font-display text-3xl md:text-5xl font-light leading-[0.95]">
              Έτοιμοι να κάνετε <span className="italic">την διαφορά;</span>
            </h2>
            <p className="mt-6 text-lg md:text-xl max-w-lg opacity-80">
              Δοκιμάστε δωρεάν το demo ή ξεκινήστε με ένα πακέτο σήμερα.
            </p>
            <div className="mt-10 flex gap-3 flex-wrap">
              <Link
                href="/paketa"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-ink font-semibold shadow-xl shadow-slate-900/20 hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
              >
                Δες τα πακέτα
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
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-amber-300 text-ink font-semibold shadow-lg shadow-amber-500/40 hover:bg-amber-400 hover:-translate-y-0.5 transition-all"
              >
                Παίξε με το demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
