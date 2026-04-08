"use client";
import { useState } from "react";
import Link from "next/link";
import { el } from "@/lib/i18n/el";
import type { Question } from "@/lib/types";
import type { GradingResult } from "@/lib/grading";

export function GradingClient({
  paperId,
  paperTitle,
  pdfUrl,
  questions,
}: {
  paperId: string;
  paperTitle: string;
  pdfUrl: string | null;
  questions: Question[];
}) {
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function pick(num: number, choice: string) {
    setAnswers((a) => ({ ...a, [num]: choice }));
  }

  function reset() {
    setAnswers({});
    setStudentName("");
    setResult(null);
    setError(null);
  }

  async function submit() {
    setError(null);
    if (Object.keys(answers).length < questions.length) {
      setError(el.grading.pleaseAnswer);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper_id: paperId,
          student_name: studentName,
          answers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? el.auth.error);
      } else {
        setResult(data);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/account/papers"
            className="text-sm text-muted hover:text-brand"
          >
            ← {el.account.papersTitle}
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark mt-1">
            {paperTitle}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 min-h-[80vh]">
        {/* Left: PDF */}
        <div className="border border-border rounded-xl overflow-hidden bg-white">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-[80vh]"
              title={paperTitle}
            />
          ) : (
            <div className="p-6 text-muted">
              {el.grading.pdfFallback}
            </div>
          )}
        </div>

        {/* Right: questions / results */}
        <div className="border border-border rounded-xl bg-white p-6 overflow-y-auto max-h-[80vh]">
          {result ? (
            <ResultsView
              result={result}
              onReset={reset}
            />
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {el.grading.studentName}
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={el.grading.studentNamePlaceholder}
                  className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">
                        {el.grading.questionLabel} {q.number}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-brand-light text-brand-dark">
                        {el.questionTypes[q.qtype] ?? q.qtype}
                      </span>
                    </div>
                    {q.prompt_el && (
                      <p className="text-sm text-muted mb-2">{q.prompt_el}</p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {q.choices.map((c) => {
                        const selected = answers[q.number] === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => pick(q.number, c)}
                            className={
                              "px-4 py-2 rounded-md border text-sm font-medium cursor-pointer " +
                              (selected
                                ? "bg-brand text-white border-brand"
                                : "bg-white border-border hover:bg-brand-light")
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
                <div className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                onClick={submit}
                disabled={submitting}
                className="mt-6 w-full px-4 py-2.5 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-50 cursor-pointer"
              >
                {submitting ? el.common.loading : el.grading.submit}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsView({
  result,
  onReset,
}: {
  result: GradingResult;
  onReset: () => void;
}) {
  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-dark">
        {el.grading.resultsTitle}
      </h2>
      <div className="mt-6 p-6 rounded-xl bg-brand-light text-center">
        <div className="text-sm text-muted">{el.grading.totalScore}</div>
        <div className="text-5xl font-bold text-brand-dark mt-2">
          {result.score}
          <span className="text-2xl text-muted">/{result.total}</span>
        </div>
        <div className="text-lg text-brand mt-1">{pct}%</div>
      </div>

      <h3 className="mt-8 font-semibold">{el.grading.breakdown}</h3>
      <div className="mt-3 space-y-3">
        {Object.entries(result.type_breakdown).map(([type, b]) => {
          const p = b.total > 0 ? (b.correct / b.total) * 100 : 0;
          return (
            <div key={type}>
              <div className="flex justify-between text-sm mb-1">
                <span>{el.questionTypes[type] ?? type}</span>
                <span className="text-muted">
                  {b.correct} {el.grading.outOf} {b.total}
                </span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand"
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-green-700 bg-green-50 p-3 rounded">
        {el.grading.saved}
      </div>

      <button
        onClick={onReset}
        className="mt-6 w-full px-4 py-2.5 rounded-md border border-brand text-brand font-medium hover:bg-brand-light cursor-pointer"
      >
        {el.grading.reset}
      </button>
    </div>
  );
}
