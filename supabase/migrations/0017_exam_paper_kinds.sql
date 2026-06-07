-- ──────────────────────────────────────────────────────────────────────────
-- Expand each Προσομοίωση from one PDF (questions_url) to four:
--   • greek_questions_url   — Θέματα Γλώσσας
--   • math_questions_url    — Θέματα Μαθηματικών
--   • greek_answers_url     — Απαντήσεις Γλώσσας
--   • math_answers_url      — Απαντήσεις Μαθηματικών
--
-- Each is a storage PATH inside the private `exam-papers` bucket (same model
-- as `questions_url` after 0016). Downloads always go through the watermark
-- route /api/account/exam-paper/[id]?kind=…, which fetches via service role,
-- stamps the school's trade_name, and streams the PDF back.
--
-- The legacy `questions_url` column is preserved for backward compat but
-- new upload flow + new download UI use the four columns above.
-- ──────────────────────────────────────────────────────────────────────────

alter table simulations
  add column if not exists greek_questions_url text,
  add column if not exists math_questions_url  text,
  add column if not exists greek_answers_url   text,
  add column if not exists math_answers_url    text;
