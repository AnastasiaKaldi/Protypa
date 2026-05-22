import Link from "next/link";
import { el } from "@/lib/i18n/el";
import type { Question } from "@/lib/types";
import { DemoGrader } from "./DemoGrader";

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "1",
    paper_id: "demo",
    number: 1,
    qtype: "multiplication",
    prompt_el: "Πόσο κάνει 12 × 8;",
    choices: ["α) 86", "β) 92", "γ) 96", "δ) 108"],
    correct_answer: "γ) 96",
  },
  {
    id: "2",
    paper_id: "demo",
    number: 2,
    qtype: "addition",
    prompt_el: "Πόσο κάνει 348 + 257;",
    choices: ["α) 595", "β) 605", "γ) 615", "δ) 705"],
    correct_answer: "β) 605",
  },
  {
    id: "3",
    paper_id: "demo",
    number: 3,
    qtype: "subtraction",
    prompt_el: "Πόσο κάνει 1000 − 478;",
    choices: ["α) 522", "β) 532", "γ) 622", "δ) 478"],
    correct_answer: "α) 522",
  },
  {
    id: "4",
    paper_id: "demo",
    number: 4,
    qtype: "fractions",
    prompt_el: "Πόσο είναι 3/4 + 1/4;",
    choices: ["α) 3/8", "β) 4/8", "γ) 1", "δ) 4/4 + 1"],
    correct_answer: "γ) 1",
  },
  {
    id: "5",
    paper_id: "demo",
    number: 5,
    qtype: "word_problem",
    prompt_el: "Ο Νίκος έχει 24€ και ξοδεύει το 1/4. Πόσα ξόδεψε;",
    choices: ["α) 6€", "β) 8€", "γ) 12€", "δ) 18€"],
    correct_answer: "α) 6€",
  },
];

export default function DemoPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-12 pb-14 clip-x overflow-hidden bg-[#056ef5]">
        <div className="absolute inset-0 bg-[#7c00d0]/30" />
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
              className="text-white/60 hover:text-white transition-colors font-bold uppercase tracking-wider text-xs"
            >
              ← {el.demo.backToPackages}
            </Link>
          </div>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-white">
            {el.demo.title}
          </h1>
          <p className="mt-3 text-base text-white/70 max-w-xl leading-relaxed">
            {el.demo.subtitle}
          </p>
        </div>
      </section>

      {/* Grader */}
      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <DemoGrader questions={SAMPLE_QUESTIONS} />
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
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#c8ff00] mb-4">
            Σας άρεσε;
          </div>
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
