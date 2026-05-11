import Link from "next/link";
import { el } from "@/lib/i18n/el";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Features />
      <MidCta />
      <HowItWorks />
      <Manifesto />
    </div>
  );
}

/* ─── 1. HERO ──────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center clip-x overflow-hidden"
      style={{ backgroundImage: "url(/HeroPage.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Blue brand overlay — preserves brand colour while letting image show through */}
      <div className="absolute inset-0 bg-brand/80" />

      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left — content */}
          <div>
            <h1 className="font-display text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.9] text-paper">
              {el.home.heroApplyTitle}
            </h1>

            <div className="mt-10 md:mt-14 flex flex-col items-start gap-4 max-w-sm">
              <Link
                href="/paketa"
                className="group w-full inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-[#FDFFFC] text-[#7c00d0] border-2 border-[#7c00d0] font-black uppercase tracking-wider hover:bg-[#7c00d0]/5 hover:-translate-y-0.5 transition-all text-base md:text-lg"
              >
                Εξερευνιστε τα πακετα
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#FDFFFC] text-[#056ef5] border-2 border-[#056ef5] font-bold uppercase tracking-wider hover:bg-[#056ef5]/5 hover:-translate-y-0.5 transition-all text-sm"
              >
                Δοκιμαστε το demo
              </Link>
            </div>
          </div>

          {/* Right — sprite cluster */}
          <div className="relative hidden md:block h-[480px]">
            <img src="/TransparentAssets/Asset 23.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 opacity-100" />
            <img src="/TransparentAssets/Asset 19.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-4 right-4 w-36 opacity-100 rotate-12" />
            <img src="/TransparentAssets/Asset 21.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-12 left-0 w-32 opacity-100 -rotate-6" />
            <img src="/TransparentAssets/Asset 18.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-8 left-8 w-24 opacity-100 -rotate-12" />
            <img src="/TransparentAssets/Asset 7.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-4 right-8 w-28 opacity-100 rotate-6" />
          </div>

        </div>
      </div>
    </section>
  );
}


/* ─── 2. FEATURES ──────────────────────────────────────────────────────── */

function Features() {
  return (
    <section className="relative bg-white py-16 md:py-28 overflow-hidden">
      {/* Sprite decorations */}
      <img src="/TransparentAssets/Asset 8.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-8 right-4 w-24 md:w-36 opacity-70 rotate-12" />
      <img src="/TransparentAssets/Asset 9.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-10 left-6 w-20 md:w-32 opacity-70 -rotate-6" />
<div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-14">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand mb-3">
            Τι προσφέρουμε
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-ink leading-none">
            Το απόλυτο εργαλείο{" "}
            <span className="text-brand">στοχευμένης διδασκαλίας.</span>
          </h2>
          <p className="mt-6 text-sm md:text-base text-ink/60 max-w-2xl leading-relaxed">
            Το καλύτερο εκπαιδευτικό εργαλείο για το φροντιστήριο που προετοιμάζει μαθητές για τα Πρότυπα, Ωνάσεια και Εκκλησιαστικά Σχολεία.
          </p>
        </div>

        {/* You / We intro */}
        <div className="flex flex-col sm:flex-row gap-0 mb-8 rounded-3xl overflow-hidden">
          <div className="flex-1 bg-[#056ef5] px-8 py-7 flex items-center gap-4">
            <span className="font-display text-4xl text-paper/20 flex-shrink-0">→</span>
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-paper/40 mb-1">Εσείς</div>
              <p className="font-display text-xl md:text-2xl text-paper leading-tight">Καταχωρείτε τις απαντήσεις</p>
            </div>
          </div>
          <div className="flex-1 bg-brand px-8 py-7 flex items-center gap-4">
            <span className="font-display text-4xl text-ink/20 flex-shrink-0">→</span>
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-ink/50 mb-1">Εμείς</div>
              <p className="font-display text-xl md:text-2xl text-ink leading-tight">Αναλύουμε τα πάντα</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 md:gap-5 sm:auto-rows-[minmax(180px,auto)]">
          {/* Big featured card */}
          <div className="sm:col-span-6 md:col-span-4 md:row-span-2 relative rounded-3xl bg-accent-purple p-8 md:p-10 overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 font-display text-[10rem] md:text-[16rem] leading-none -mb-8 -mr-4 md:-mb-16 md:-mr-8 opacity-10 select-none text-ink">
              ⚠
            </div>
            <div className="relative">
              <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-paper/50">
                Συστηματική αδυναμία
              </div>
              <h3 className="mt-4 font-display text-2xl sm:text-4xl md:text-5xl leading-none text-paper">
                Εντοπίζουμε ποια λάθη{" "}
                <span className="text-brand">επαναλαμβάνονται.</span>
              </h3>
              <p className="mt-6 max-w-md text-paper/70 leading-relaxed text-sm md:text-base">
                Δεν αρκεί να ξέρεις τι έκανε λάθος ένας μαθητής μια φορά. Εντοπίζουμε τα λάθη που επιστρέφουν ξανά και ξανά — αυτά είναι που πρέπει να αντιμετωπιστούν πρώτα.
              </p>
            </div>
          </div>

          <FeatureCard
            span="col-span-6 sm:col-span-3 md:col-span-2"
            bg="bg-[#2a2a2a]"
            accent="text-accent"
            label="Ομαδοποίηση"
            title="Παρόμοια λάθη, ίδια ομάδα"
            body="Ομαδοποιούμε τους μαθητές που εμφανίζουν παρόμοια λάθη — ώστε να διδάξετε τους σωστούς στόχους στη σωστή ομάδα."
          />
          <FeatureCard
            span="col-span-6 sm:col-span-3 md:col-span-2"
            bg="bg-accent-purple"
            accent="text-accent"
            label="Δυσκολία ερωτήσεων"
            title="Ποιες ερωτήσεις «καίνε»"
            body="Αναλύουμε τη δυσκολία κάθε ερώτησης. Ποιες έχουν υψηλό ποσοστό λάθους από πολλούς μαθητές."
          />
          <FeatureCard
            span="col-span-6 md:col-span-2"
            bg="bg-[#2a2a2a]"
            accent="text-brand"
            label="Τύπος λάθους"
            title="Εννοιολογικό, απροσεξίας ή στρατηγικής"
            body="Στοχεύουμε στο «γιατί» έγινε το λάθος — γιατί η θεραπεία είναι διαφορετική για κάθε τύπο."
          />
          <FeatureCard
            span="col-span-6 md:col-span-4"
            bg="bg-accent"
            accent="text-ink"
            bodyColor="text-ink"
            label="Μαθησιακό profile"
            title="Το πιο αντικειμενικό προφίλ κάθε μαθητή"
            body="Συντάσσουμε το πιο αντικειμενικό μαθησιακό profile κάθε μαθητή σας — με δεδομένα, όχι εντυπώσεις."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  span,
  bg,
  accent,
  label,
  title,
  body,
  bodyColor = "text-paper",
}: {
  span: string;
  bg: string;
  accent: string;
  label: string;
  title: string;
  body: string;
  bodyColor?: string;
}) {
  return (
    <div
      className={`${span} relative rounded-3xl ${bg} p-7 md:p-8 overflow-hidden hover:-translate-y-1 transition-transform duration-300`}
    >
      <div className={`text-[10px] font-bold tracking-[0.2em] uppercase ${accent} opacity-70`}>
        {label}
      </div>
      <h3 className={`mt-3 font-display text-2xl md:text-3xl leading-tight ${accent}`}>
        {title}
      </h3>
      <p className={`mt-3 text-sm leading-relaxed opacity-70 ${bodyColor}`}>
        {body}
      </p>
    </div>
  );
}

/* ─── 3. HOW IT WORKS ──────────────────────────────────────────────────── */

/* ─── 2.5 MID CTA ──────────────────────────────────────────────────────── */

function MidCta() {
  return (
    <section className="relative bg-[#7c00d0] clip-x overflow-hidden">
      {/* Sprite decorations */}
      <img src="/TransparentAssets/Asset 7.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-0 right-8 w-40 md:w-64 opacity-80 rotate-6 hidden sm:block" />
      <img src="/TransparentAssets/Asset 18.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-6 right-[30%] w-20 md:w-28 opacity-60 -rotate-12 hidden lg:block" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — title */}
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-paper/60 mb-4">
              Ξεκινήστε σήμερα
            </div>
            <h2 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.9] text-paper">
              Ξεκινηστε και καντε τη Διαφορα
            </h2>
          </div>

          {/* Right — buttons */}
          <div className="flex flex-col items-start gap-4 md:pl-8">
            <Link
              href="/demo"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-[#FDFFFC] text-[#056ef5] border-2 border-[#056ef5] font-black uppercase tracking-wider hover:bg-[#056ef5]/5 hover:-translate-y-0.5 transition-all text-base md:text-lg"
            >
              Δοκιμαστε το Demo
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/paketa"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#FDFFFC] text-[#7c00d0] border-2 border-[#7c00d0] font-bold uppercase tracking-wider hover:bg-[#7c00d0]/5 hover:-translate-y-0.5 transition-all text-sm"
            >
              Δειτε τα Πακετα
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}


/* ─── 3. HOW IT WORKS ──────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Επιλέξτε την Demo λειτουργεία",
      body: "Επιλέξτε Γλώσσα, Μαθηματικά ή το Πλήρες Πακέτο. Κατεβάστε το κριτήριο και δώστε το σε κάποιο μαθητή σας. Καταχωρίστε τη βαθμολογία του και δείτε τη μαθησιακή του πορεία.",
    },
    {
      n: "02",
      title: "Πληρώστε με Ασφάλεια",
      body: "Εφάπαξ πληρωμή μέσω e-pay και λάβετε άμεσα το παραστατικό-τιμολόγιο μέσω email.",
    },
    {
      n: "03",
      title: "Διαδικασία Προσομοίωσης",
      body: "Ενημερωθείτε για το πρόγραμμα των Προσομοιώσεων και την ύλη στην οποία αντιστοιχεί κάθε Προσομοίωση. Αφού οι μαθητές σας γράψουν, καταχωρίστε τις απαντήσεις τους στην πλατφόρμα.",
    },
    {
      n: "04",
      title: "Δείτε τα αποτελέσματα",
      body: "Μετά την ολοκλήρωση όλων των καταχωρήσεων θα έχετε στη διάθεσή σας το πλήρες εκπαιδευτικό προφίλ των μαθητών σας και την ανάλυση εστιασμένη στα λάθη τους.",
    },
    {
      n: "05",
      title: "Ενημέρωση Γονέων",
      body: "Ακολουθεί η ενημέρωση για την στοχευμένη στρατηγική βελτίωσης της επίδοσης του μαθητή καλύπτοντας τα κενά που εμφανίστηκαν.",
    },
  ];

  return (
    <section className="relative py-16 md:py-28 bg-brand overflow-hidden">
      <div className="hidden sm:block pointer-events-none absolute -top-40 right-0 w-[30rem] h-[30rem] rounded-full bg-white/10 blur-3xl" />
      {/* Sprite decorations */}
      <img src="/TransparentAssets/Asset 10.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-10 right-8 w-28 md:w-44 opacity-75 -rotate-6 hidden sm:block" />
      <img src="/TransparentAssets/Asset 11.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-8 right-4 w-24 md:w-36 opacity-70 rotate-12 hidden sm:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-16">
          <h2 className="font-display text-5xl md:text-7xl text-ink leading-none">
            Πώς λειτουργεί
          </h2>
          <p className="mt-4 text-sm md:text-base text-paper/70 max-w-xl">
            Με 5 βήματα… το φροντιστήριό σου ξεχωρίζει.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
          {steps.map((s, i) => (
            <div key={s.n} className={`group flex gap-6${i === steps.length - 1 && steps.length % 2 !== 0 ? " md:col-span-2 md:justify-center" : ""}`}>
              <div className="font-display text-5xl sm:text-8xl md:text-9xl leading-none text-ink group-hover:text-accent transition-colors duration-500 tabular-nums flex-shrink-0">
                {s.n}
              </div>
              <div className="pt-3">
                <h3 className="font-display text-2xl md:text-3xl leading-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 text-paper/70 leading-relaxed max-w-md text-sm">
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

/* ─── 4. MANIFESTO ─────────────────────────────────────────────────────── */

function Manifesto() {
  return (
    <section className="relative py-16 md:py-28 bg-accent-purple overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand/20 blur-3xl" />
      {/* Sprite decorations */}
      <img src="/TransparentAssets/Asset 13.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-6 right-6 w-28 md:w-40 opacity-70 rotate-6 hidden sm:block" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent mb-6">
          {el.home.manifestoEyebrow}
        </div>
        <blockquote className="font-display text-xl sm:text-2xl md:text-3xl leading-tight text-paper">
          <span className="text-accent text-7xl leading-none align-top mr-2">&ldquo;</span>
          {el.home.manifestoQuote}
          <span className="text-accent text-7xl leading-none align-top ml-2">&rdquo;</span>
        </blockquote>
        <div className="mt-8 text-xs font-bold text-paper/50 uppercase tracking-wider">
          {el.home.manifestoBy}
        </div>
      </div>
    </section>
  );
}

