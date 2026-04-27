import Link from "next/link";
import { el } from "@/lib/i18n/el";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Manifesto />
      <FinalCta />
    </div>
  );
}

/* ─── 1. HERO ──────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative bg-brand pt-10 pb-20 md:pt-14 md:pb-28 clip-x">
      {/* White decorative loop — right side */}
      <div className="pointer-events-none absolute right-[-8%] top-[-5%] bottom-[-5%] w-[55%] flex items-center justify-center">
        <svg
          viewBox="0 0 420 580"
          fill="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M 380 60
               C 440 120, 460 240, 380 310
               C 300 380, 160 380, 110 300
               C 60 220, 100 110, 200 80
               C 300 50, 400 120, 420 220
               C 440 320, 380 440, 260 490
               C 140 540, 40 510, 20 440"
            stroke="white"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main headline */}
        <h1 className="font-display text-[clamp(3.5rem,12vw,9rem)] leading-[0.88] text-ink">
          {el.home.heroApplyTitle}
        </h1>

        <div className="mt-10 md:mt-14">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-7">
            <span className="w-5 h-5 rounded-sm bg-accent-purple flex-shrink-0" />
            <span className="font-display text-xl md:text-2xl text-paper tracking-wide">
              ΠΑΚΕΤΑ ΔΙΑΓΩΝΙΣΜΑΤΩΝ
            </span>
          </div>

          {/* Three subject cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-xl md:max-w-2xl">
            {/* Math card — black */}
            <Link
              href="/paketa"
              className="group aspect-square rounded-2xl md:rounded-3xl bg-ink p-5 md:p-7 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-200"
            >
              <span className="font-display text-[11px] md:text-sm text-paper tracking-wider">
                ΜΑΘΗΜΑΤΙΚΑ
              </span>
              <span className="text-paper text-3xl md:text-5xl font-black leading-none">
                %
                <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-paper ml-0.5 mb-1 align-middle" />
              </span>
            </Link>

            {/* Language card — purple */}
            <Link
              href="/paketa"
              className="group aspect-square rounded-2xl md:rounded-3xl bg-accent-purple p-5 md:p-7 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-200"
            >
              <span className="font-display text-[11px] md:text-sm text-paper tracking-wider">
                ΓΛΩΣΣΑ
              </span>
              <div className="flex gap-1 items-end">
                <span className="text-paper text-3xl md:text-5xl font-black leading-none">𝕀𝕀</span>
              </div>
            </Link>

            {/* Past exams card — lime */}
            <Link
              href="/paketa"
              className="group aspect-square rounded-2xl md:rounded-3xl bg-accent p-5 md:p-7 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-200"
            >
              <span className="font-display text-[11px] md:text-sm text-ink tracking-wider">
                ΠΑΛΙΑ ΘΕΜΑΤΑ
              </span>
              <span className="text-ink text-3xl md:text-5xl font-black leading-none">
                ✳
              </span>
            </Link>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-14 pt-8 border-t border-white/20 grid grid-cols-3 gap-6 max-w-xl">
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
      <div className="font-display text-4xl md:text-5xl text-ink leading-none tabular-nums">
        {value}
      </div>
      <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
        {label}
      </div>
    </div>
  );
}

/* ─── 2. FEATURES ──────────────────────────────────────────────────────── */

function Features() {
  return (
    <section className="bg-ink py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-14">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand mb-3">
            Τι προσφέρουμε
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-paper leading-none">
            Το απόλυτο εργαλείο{" "}
            <span className="text-brand">στοχευμένης διδασκαλίας.</span>
          </h2>
          <p className="mt-6 text-sm md:text-base text-paper/60 max-w-2xl leading-relaxed">
            Το καλύτερο εκπαιδευτικό εργαλείο για το φροντιστήριο που προετοιμάζει μαθητές για τα Πρότυπα, Ωνάσεια και Εκκλησιαστικά Σχολεία.
          </p>
        </div>

        {/* You / We intro */}
        <div className="flex flex-col sm:flex-row gap-0 mb-8 rounded-3xl overflow-hidden">
          <div className="flex-1 bg-[#2a2a2a] px-8 py-7 flex items-center gap-4">
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
          <div className="sm:col-span-6 md:col-span-4 md:row-span-2 relative rounded-3xl bg-brand p-8 md:p-10 overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 font-display text-[10rem] md:text-[16rem] leading-none -mb-8 -mr-4 md:-mb-16 md:-mr-8 opacity-10 select-none text-ink">
              ⚠
            </div>
            <div className="relative">
              <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/50">
                Συστηματική αδυναμία
              </div>
              <h3 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl leading-none text-ink">
                Εντοπίζουμε ποια λάθη{" "}
                <span className="text-paper">επαναλαμβάνονται.</span>
              </h3>
              <p className="mt-6 max-w-md text-ink/70 leading-relaxed text-sm md:text-base">
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
    <section className="relative py-28 bg-brand overflow-hidden">
      <div className="hidden sm:block pointer-events-none absolute -top-40 right-0 w-[30rem] h-[30rem] rounded-full bg-white/10 blur-3xl" />

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
            <div key={s.n} className={`group flex gap-6${i === steps.length - 1 && steps.length % 2 !== 0 ? " md:col-span-2" : ""}`}>
              <div className="font-display text-6xl sm:text-8xl md:text-9xl leading-none text-ink group-hover:text-accent transition-colors duration-500 tabular-nums flex-shrink-0">
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
    <section className="relative py-28 bg-ink">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand mb-6">
          {el.home.manifestoEyebrow}
        </div>
        <blockquote className="font-display text-xl sm:text-2xl md:text-3xl leading-tight text-paper">
          <span className="text-accent text-7xl leading-none align-top mr-2">&ldquo;</span>
          {el.home.manifestoQuote}
          <span className="text-accent text-7xl leading-none align-top ml-2">&rdquo;</span>
        </blockquote>
        <div className="mt-8 text-xs font-bold text-paper/40 uppercase tracking-wider">
          {el.home.manifestoBy}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. FINAL CTA ─────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="relative py-28 px-4 bg-ink">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand px-6 py-20 md:px-16 md:py-24 noise">
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <h2 className="font-display text-4xl md:text-7xl leading-none text-ink">
              Έτοιμοι να κάνετε{" "}
              <span className="text-paper">την διαφορά;</span>
            </h2>
            <p className="mt-6 text-base md:text-xl max-w-lg text-ink/60">
              Δοκιμάστε δωρεάν το demo ή ξεκινήστε με ένα πακέτο σήμερα.
            </p>
            <div className="mt-10 flex gap-3 flex-wrap">
              <Link
                href="/paketa"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent-purple text-white font-bold uppercase tracking-wider hover:bg-[#6500b0] hover:-translate-y-0.5 transition-all text-sm"
              >
                Δες τα πακέτα
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-ink font-bold uppercase tracking-wider hover:bg-accent/90 hover:-translate-y-0.5 transition-all text-sm"
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
