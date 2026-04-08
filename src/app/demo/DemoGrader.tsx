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

  if (result) {
    return <DemoResults result={result} onReset={reset} />;
  }

  return (
    <div className="rounded-3xl bg-white border border-border p-6 md:p-8 shadow-xl shadow-slate-200/50">
      <div className="space-y-5">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-4 md:p-5 rounded-2xl border border-border hover:border-teal-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="font-bold text-foreground">
                {el.grading.questionLabel} {q.number}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-200">
                {el.questionTypes[q.qtype] ?? q.qtype}
              </span>
            </div>
            {q.prompt_el && (
              <p className="text-sm text-foreground/80 mb-3">{q.prompt_el}</p>
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
                      "px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all " +
                      (selected
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-transparent shadow-md"
                        : "bg-white border-border hover:border-teal-300 hover:bg-teal-50")
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
        <div className="mt-5 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        onClick={submit}
        className="mt-7 w-full px-6 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white font-bold text-base shadow-lg shadow-teal-500/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
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
  const pct =
    result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <div className="rounded-3xl bg-white border border-border p-6 md:p-10 shadow-xl shadow-slate-200/50">
      <h2 className="text-3xl font-extrabold text-foreground">
        {el.grading.resultsTitle}
      </h2>

      <div className="mt-6 p-8 rounded-2xl bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 ring-1 ring-teal-200/60 text-center">
        <div className="text-sm font-medium text-teal-700 uppercase tracking-wider">
          {el.grading.totalScore}
        </div>
        <div className="text-6xl font-black text-slate-900 mt-3 tabular-nums">
          {result.score}
          <span className="text-3xl text-muted">/{result.total}</span>
        </div>
        <div className="text-2xl font-bold text-teal-600 mt-1">{pct}%</div>
      </div>

      <h3 className="mt-8 font-bold text-lg">{el.grading.breakdown}</h3>
      <div className="mt-4 space-y-4">
        {Object.entries(result.type_breakdown).map(([type, b]) => {
          const p = b.total > 0 ? (b.correct / b.total) * 100 : 0;
          return (
            <div key={type}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">
                  {el.questionTypes[type] ?? type}
                </span>
                <span className="text-muted tabular-nums">
                  {b.correct} {el.grading.outOf} {b.total}
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onReset}
        className="mt-8 w-full px-6 py-3.5 rounded-full border-2 border-teal-500 text-teal-600 font-semibold hover:bg-teal-50 transition cursor-pointer"
      >
        {el.grading.reset}
      </button>
    </div>
  );
}
