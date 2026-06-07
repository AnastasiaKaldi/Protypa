-- ──────────────────────────────────────────────────────────────────────────
-- Extra per-question metadata uploaded by admins alongside categories:
--   • correct_answer — the boss's spreadsheet ships A / B / Γ / Δ / Ε,
--     useful both for showing the answer key in the UI and for any future
--     auto-grading flow.
--   • difficulty — 1 (easy) / 2 (medium) / 3 (hard). Stats panels can later
--     weight wrong-answer counts by difficulty.
-- Both are nullable so older uploads stay valid.
-- ──────────────────────────────────────────────────────────────────────────

alter table simulation_question_tags
  add column if not exists correct_answer text,
  add column if not exists difficulty     int;

-- Sanity check on difficulty when present.
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'simulation_question_tags_difficulty_check'
  ) then
    alter table simulation_question_tags
      add constraint simulation_question_tags_difficulty_check
      check (difficulty is null or difficulty between 1 and 3);
  end if;
end $$;
