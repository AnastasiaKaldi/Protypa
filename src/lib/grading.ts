import type { Question } from "./types";

export interface GradingResult {
  score: number;
  total: number;
  type_breakdown: Record<string, { correct: number; total: number }>;
}

// Pure scoring function. The server is the only authority on grading —
// the client never computes scores, only collects answers.
export function scoreAnswers(
  questions: Question[],
  studentAnswers: Record<string, string>,
): GradingResult {
  const breakdown: Record<string, { correct: number; total: number }> = {};
  let score = 0;

  for (const q of questions) {
    const key = String(q.number);
    const given = studentAnswers[key];
    const isCorrect =
      given != null &&
      given.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

    if (!breakdown[q.qtype]) breakdown[q.qtype] = { correct: 0, total: 0 };
    breakdown[q.qtype].total += 1;
    if (isCorrect) {
      breakdown[q.qtype].correct += 1;
      score += 1;
    }
  }

  return { score, total: questions.length, type_breakdown: breakdown };
}
