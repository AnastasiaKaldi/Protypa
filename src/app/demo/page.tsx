import Link from "next/link";
import { el } from "@/lib/i18n/el";
import type { Question } from "@/lib/types";
import { DemoGrader } from "./DemoGrader";

// Hard-coded sample questions so the demo works without a database.
// Mirrors the seed data for the math sample paper.
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 text-xs font-extrabold tracking-wider">
          {el.demo.badge}
        </span>
        <Link
          href="/paketa"
          className="text-sm text-muted hover:text-brand"
        >
          ← {el.demo.backToPackages}
        </Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
        {el.demo.title}
      </h1>
      <p className="mt-3 text-lg text-muted max-w-2xl">{el.demo.subtitle}</p>

      <div className="mt-10">
        <DemoGrader questions={SAMPLE_QUESTIONS} />
      </div>

      {/* Upsell */}
      <div className="mt-12 rounded-3xl bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 ring-1 ring-violet-200/60 p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          {el.demo.upsellTitle}
        </h2>
        <p className="mt-3 text-muted max-w-xl mx-auto">{el.demo.upsellBody}</p>
        <Link
          href="/paketa"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          {el.demo.upsellCta}
          <svg
            className="w-4 h-4"
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
  );
}
