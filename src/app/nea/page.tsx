import Link from "next/link";

const ANNOUNCEMENTS = [
  {
    id: 1,
    tag: "Νέα Θέματα",
    tagColor: "bg-[#056ef5]",
    date: "Μάιος 2026",
    title: "Νέα Θέματα Προσομοίωσης Ν. Γλώσσας",
    body: "Τα νέα θέματα προσομοίωσης Νεοελληνικής Γλώσσας για την εξεταστική περίοδο Μαΐου 2026 είναι πλέον διαθέσιμα. Περιλαμβάνουν πλήρη ανάλυση και διαγράμματα χαρακτηρισμού.",
    surface: "bg-white",
    text: "text-ink",
  },
  {
    id: 2,
    tag: "Νέα Θέματα",
    tagColor: "bg-[#7c00d0]",
    date: "Απρίλιος 2026",
    title: "Θέματα Μαθηματικών — Προσομοίωση Απριλίου",
    body: "Διαθέσιμα τα θέματα Μαθηματικών για τη Β' Προσομοίωση. Συνοδεύονται από πλήρη στατιστική ανάλυση λαθών και ατομικά διαγράμματα πορείας.",
    surface: "bg-white",
    text: "text-ink",
  },
  {
    id: 3,
    tag: "Ανακοίνωση",
    tagColor: "bg-[#c8ff00]",
    date: "Μάρτιος 2026",
    title: "Πανελλαδική Στατιστική Ανάλυση — Α' Τρίμηνο",
    body: "Η πανελλαδική στατιστική ανάλυση λαθών για το Α' τρίμηνο είναι έτοιμη. Συγκρίνετε την επίδοση των μαθητών σας με τον εθνικό μέσο όρο.",
    surface: "bg-white",
    text: "text-ink",
  },
];

export default function NewsPage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Announcements />
      <Cta />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      className="relative pt-16 pb-20 md:pt-24 md:pb-28 clip-x overflow-hidden"
      style={{ backgroundImage: "url(/HeroPage.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-[#056ef5]/85" />
      <img src="/TransparentAssets/Asset 21.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-6 right-8 w-28 md:w-44 opacity-70 rotate-6 hidden sm:block" />
      <img src="/TransparentAssets/Asset 23.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-4 right-[30%] w-20 md:w-32 opacity-60 -rotate-12 hidden md:block" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/70 mb-4">
          Ενημερωθείτε πρώτοι
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-none text-white">
          Νέα &amp;
          <br />
          <span className="text-[#c8ff00]">Ανακοινώσεις</span>
        </h1>
        <p className="mt-8 max-w-xl text-base md:text-lg text-white/80 leading-relaxed">
          Εδώ θα βρείτε όλες τις νέες δημοσιεύσεις θεμάτων, στατιστικές αναλύσεις και ενημερώσεις για τα πακέτα μας.
        </p>
      </div>
    </section>
  );
}

/* ─── ANNOUNCEMENTS ─────────────────────────────────────────────────────── */

function Announcements() {
  return (
    <section className="relative bg-white py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/50 mb-6">
                Φίλτρα
              </div>
              <ul className="space-y-1">
                {["Όλα", "Νέα Θέματα", "Ανακοινώσεις", "Στατιστικά"].map((label, i) => (
                  <li key={label}>
                    <button className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${i === 0 ? "bg-[#056ef5] text-white" : "text-ink/50 hover:text-ink hover:bg-ink/5"}`}>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Cards */}
          <div className="lg:col-span-9 space-y-6">
            {ANNOUNCEMENTS.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl border border-ink/10 p-8 md:p-10 hover:border-[#056ef5]/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${item.tagColor} ${item.tagColor === "bg-[#c8ff00]" ? "text-ink" : "text-white"}`}>
                    {item.tag}
                  </span>
                  <span className="text-xs text-ink/40 font-bold uppercase tracking-wider">{item.date}</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink group-hover:text-[#056ef5] transition-colors">
                  {item.title}
                </h2>
                <p className="mt-4 text-base text-ink/70 leading-relaxed max-w-2xl">
                  {item.body}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#056ef5]">
                  Διαβάστε περισσότερα
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              </article>
            ))}

            <div className="rounded-3xl border border-dashed border-ink/15 p-10 text-center">
              <p className="text-ink/40 text-sm font-bold uppercase tracking-wider">Περισσότερες ανακοινώσεις σύντομα</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ──────────────────────────────────────────────────────────────── */

function Cta() {
  return (
    <section className="relative bg-[#7c00d0] py-16 md:py-24 overflow-hidden">
      <div className="hidden sm:block pointer-events-none absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-[#056ef5]/20 blur-3xl" />
      <img src="/TransparentAssets/Asset 19.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-6 right-8 w-28 md:w-40 opacity-60 rotate-6 hidden sm:block" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#c8ff00] mb-4">
            Δείτε τι προσφέρουμε
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-none text-white">
            Έτοιμοι να ξεκινήσετε;
          </h2>
          <p className="mt-4 text-base text-white/80 max-w-lg leading-relaxed">
            Εξερευνήστε τα πακέτα μας και δείτε πώς η Protypa μπορεί να βοηθήσει τους μαθητές σας να ξεχωρίσουν.
          </p>
          <div className="mt-8 flex items-center gap-3 flex-wrap">
            <Link
              href="/paketa"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#FDFFFC] text-[#056ef5] border-2 border-[#056ef5] font-black uppercase tracking-wider text-sm hover:bg-[#056ef5]/5 hover:-translate-y-0.5 transition-all"
            >
              Δείτε τα πακέτα
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/epikoinonia"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#FDFFFC] text-[#7c00d0] border-2 border-[#7c00d0] font-black uppercase tracking-wider text-sm hover:bg-[#7c00d0]/5 hover:-translate-y-0.5 transition-all"
            >
              Επικοινωνήστε μαζί μας
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
