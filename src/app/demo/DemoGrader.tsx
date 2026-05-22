"use client";
import { useState } from "react";
import { el } from "@/lib/i18n/el";
import type { Question } from "@/lib/types";
import { scoreAnswers, type GradingResult } from "@/lib/grading";

// Self-contained demo grader. Scores client-side (the answer key is hardcoded
// in the demo file anyway, so there's no security concern here — unlike the
// real grading flow which always scores server-side).
export function DemoGrader({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<GradingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function pick(num: number, choice: string) {
    setAnswers((a) => ({ ...a, [num]: choice }));
  }

  function submit() {
    setError(null);
    if (Object.keys(answers).length < questions.length) {
      setError(el.grading.pleaseAnswer);
      return;
    }
    setResult(scoreAnswers(questions, answers));
  }

  function reset() {
    setAnswers({});
    setResult(null);
    setError(null);
  }

  if (result) return <DemoResults result={result} onReset={reset} />;

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 md:p-8 shadow-xl shadow-ink/5">
      <div className="space-y-5">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-5 rounded-2xl border border-ink/10 hover:border-[#056ef5]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="font-display text-base text-ink">
                {el.grading.questionLabel} {q.number}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#056ef5]/10 text-[#056ef5] uppercase tracking-wider">
                {el.questionTypes[q.qtype] ?? q.qtype}
              </span>
            </div>
            {q.prompt_el && (
              <p className="text-sm text-ink/70 mb-4 leading-relaxed">{q.prompt_el}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {q.choices.map((c) => {
                const selected = answers[q.number] === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => pick(q.number, c)}
                    className={
                      "px-4 py-2 rounded-xl border text-sm font-bold cursor-pointer transition-all " +
                      (selected
                        ? "bg-[#056ef5] text-white border-[#056ef5] shadow-md shadow-[#056ef5]/20"
                        : "bg-white border-ink/15 text-ink hover:border-[#056ef5] hover:text-[#056ef5]")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-5 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        onClick={submit}
        className="mt-7 w-full px-6 py-4 rounded-full bg-[#FDFFFC] text-[#056ef5] border-2 border-[#056ef5] font-black uppercase tracking-wider text-sm hover:bg-[#056ef5]/5 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
      >
        {el.grading.submit}
      </button>
    </div>
  );
}

function DemoResults({
  result,
  onReset,
}: {
  result: GradingResult;
  onReset: () => void;
}) {
  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 md:p-10 shadow-xl shadow-ink/5">
      <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-2">
        Αποτελέσματα
      </div>
      <h2 className="font-display text-3xl text-ink">{el.grading.resultsTitle}</h2>

      <div className="mt-6 rounded-3xl bg-[#7c00d0] p-8 text-center">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/60 mb-3">
          {el.grading.totalScore}
        </div>
        <div className="font-display text-7xl text-white leading-none tabular-nums">
          {result.score}
          <span className="text-3xl text-white/40">/{result.total}</span>
        </div>
        <div className="mt-2 text-[#c8ff00] font-display text-2xl">{pct}%</div>
      </div>

      <div className="mt-8">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/40 mb-4">
          {el.grading.breakdown}
        </div>
        <div className="space-y-4">
          {Object.entries(result.type_breakdown).map(([type, b]) => {
            const p = b.total > 0 ? (b.correct / b.total) * 100 : 0;
            return (
              <div key={type}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-ink">{el.questionTypes[type] ?? type}</span>
                  <span className="text-ink/50 tabular-nums">
                    {b.correct} {el.grading.outOf} {b.total}
                  </span>
                </div>
                <div className="h-2.5 bg-ink/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#056ef5] rounded-full transition-all duration-700"
                    style={{ width: `${p}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-8 w-full px-6 py-4 rounded-full bg-[#FDFFFC] text-[#7c00d0] border-2 border-[#7c00d0] font-black uppercase tracking-wider text-sm hover:bg-[#7c00d0]/5 hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        {el.grading.reset}
      </button>
    </div>
  );
}
