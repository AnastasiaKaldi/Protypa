// Decide if a submitted grade should be included in any statistic aggregate.
//
// New rule (May 2026): grading is always open once a sim has unlocked, but
// the admin sets a `grading_closes_at` deadline that bounds the *statistics
// window*. Grades submitted on or before the deadline count toward dashboard,
// student-profile, and school-wide stats. Grades submitted after are still
// stored (and visible as historical data) but are EXCLUDED from aggregates.
//
// If the admin never set a deadline (grading_closes_at IS NULL), every grade
// counts forever.
export function gradeCountsForStats(
  submittedAt: string | null | undefined,
  gradingClosesAt: string | null | undefined,
): boolean {
  if (!gradingClosesAt) return true;
  if (!submittedAt) return false;
  return new Date(submittedAt).getTime() <= new Date(gradingClosesAt).getTime();
}

// ──────────────────────────────────────────────────────────────────────────
// Question point weighting — fixed for every διαγώνισμα.
//
//   Q1-10   → 2 pts each  (sub-total 20)
//   Q11-20  → 3 pts each  (sub-total 30)
//   Q21-30  → 2 pts each  (sub-total 20)
//   Q31-40  → 3 pts each  (sub-total 30)
//                          ─────────────
//                          total 100 pts
//
// Score = ((max − lost) / max) × 100, rounded.
// ──────────────────────────────────────────────────────────────────────────

export function pointsForQuestion(qNumber: number): number {
  if (qNumber < 1 || qNumber > 40) return 0;
  if (qNumber <= 10) return 2;
  if (qNumber <= 20) return 3;
  if (qNumber <= 30) return 2;
  return 3;
}

/** Sum of points for the closed range [from..to] (both 1-based, inclusive). */
export function totalPointsInRange(from: number, to: number): number {
  let sum = 0;
  for (let q = from; q <= to; q++) sum += pointsForQuestion(q);
  return sum;
}

/**
 * Compute the final score (0-100) given the wrong questions and an optional
 * range. Defaults to the full 40-question paper.
 *
 * Examples:
 *   computeScore([])                       // 100  (perfect)
 *   computeScore([1])                      // 98   (lost a 2-pt question)
 *   computeScore([11])                     // 97   (lost a 3-pt question)
 *   computeScore([1, 11], 1, 20)           // 90   (Greek only: 50-5=45 of 50)
 */
export function computeScore(
  wrongQuestions: readonly number[],
  from = 1,
  to = 40,
): number {
  const max = totalPointsInRange(from, to);
  if (max === 0) return 0;
  const lost = wrongQuestions
    .filter((q) => q >= from && q <= to)
    .reduce((sum, q) => sum + pointsForQuestion(q), 0);
  return Math.round(((max - lost) / max) * 100);
}
