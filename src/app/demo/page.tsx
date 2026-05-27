import Link from "next/link";
import { el } from "@/lib/i18n/el";
import DemoExperience from "./DemoExperience";

export default function DemoPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative pt-12 pb-14 clip-x overflow-hidden"
        style={{ backgroundImage: "url(/demo.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Brand blue tint over the photo */}
        <div className="absolute inset-0 bg-[#056ef5]/85" />
        <div className="absolute inset-0 bg-[#7c00d0]/20" />
        <img
          src="/TransparentAssets/Asset 22.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-6 right-8 w-24 md:w-36 opacity-70 rotate-12 hidden sm:block"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex px-3 py-1 rounded-full bg-[#c8ff00] text-ink text-[11px] font-black uppercase tracking-wider">
              {el.demo.badge}
            </span>
            <Link
              href="/paketa"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#056ef5] font-black uppercase tracking-wider text-xs hover:bg-[#c8ff00] hover:text-ink transition-colors"
            >
              ← {el.demo.backToPackages}
            </Link>
          </div>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-white">
            Δείτε πώς βαθμολογείτε &amp; παρακολουθείτε
          </h1>
          <p className="mt-3 text-base text-white/70 max-w-2xl leading-relaxed">
            Σημειώστε τις λάθος απαντήσεις της Μαρίας με ένα ✕ — μετά την υποβολή, θα δείτε ακριβώς πώς εμφανίζονται τα στατιστικά κάθε μαθητή στον λογαριασμό σας.
          </p>
        </div>
      </section>

      {/* Grading + Results experience */}
      <section className="bg-[#fafaf8] py-10 md:py-14 min-h-[60vh]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <DemoExperience />
        </div>
      </section>

      {/* Upsell */}
      <section className="relative bg-[#7c00d0] py-10 md:py-14 overflow-hidden">
        <img
          src="/TransparentAssets/Asset 9.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-4 right-8 w-32 md:w-48 opacity-40 rotate-6 hidden sm:block"
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl text-white leading-none">
            {el.demo.upsellTitle}
          </h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto text-sm leading-relaxed">
            {el.demo.upsellBody}
          </p>
          <Link
            href="/paketa"
            className="group inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-[#FDFFFC] text-[#7c00d0] border-2 border-[#7c00d0] font-black uppercase tracking-wider text-sm hover:bg-[#7c00d0]/5 hover:-translate-y-0.5 transition-all"
          >
            {el.demo.upsellCta}
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
      </section>
    </div>
  );
}
