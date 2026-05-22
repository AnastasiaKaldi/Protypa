-- ──────────────────────────────────────────────────────────────────────────
-- DEMO SEED — for the account belonging to natasakaldi99@gmail.com
-- Run this in Supabase → SQL Editor (it bypasses RLS as superuser).
-- Idempotent: re-running it just updates the same rows.
-- ──────────────────────────────────────────────────────────────────────────

-- 1. Mark profile complete. is_admin stays FALSE so this looks like a real
--    customer account (no Admin Panel link in the header).
update profiles
   set onboarding_complete = true,
       is_admin            = false
 where id = (select id from auth.users where email = 'natasakaldi99@gmail.com');

-- 2. School info (so onboarding banner doesn't show)
insert into schools (id, legal_name, trade_name, address, postal_code, city, region,
                     phone, school_email, contact_person, mobile, contact_email,
                     afm, doy, subjects, terms_accepted_at)
select u.id, 'Βασιλειάδης & ΣΙΑ ΟΕ', 'Φροντιστήριο Πεδίο',
       'Παπαδοπούλου 12', '71201', 'Ηράκλειο', 'Κρήτη',
       '2801711611', 'info@pediofrontistirio.gr', 'Νατάσα Καλδή',
       '6944525252', 'natasakaldi99@gmail.com',
       '152998856', 'ΗΡΑΚΛΕΙΟΥ', array['greek','math'], now()
  from auth.users u
 where u.email = 'natasakaldi99@gmail.com'
   on conflict (id) do update set
     trade_name     = excluded.trade_name,
     legal_name     = excluded.legal_name,
     subjects       = excluded.subjects;

-- 3. Six διαγωνίσματα:
--    • 1, 2, 3 — already graded (show historical analytics)
--    • 4 — locked / future
--    • 5 — UNLOCKED but ungraded with URGENT deadline (3 days) → for live demo
--    • 6 — UNLOCKED but ungraded with comfortable deadline (4 weeks) → for live demo
insert into simulations (id, number, title, subject, exam_date,
                         unlocks_at, grading_closes_at,
                         greek_questions, math_questions, is_published)
values
  ('a1111111-0000-0000-0000-000000000001', 1, 'Διαγώνισμα 1 — Νοέμβριος 2024', 'bundle',
   '2024-11-16', '2024-11-16T09:00:00Z', '2025-06-30T23:59:00Z', 20, 20, true),
  ('a1111111-0000-0000-0000-000000000002', 2, 'Διαγώνισμα 2 — Δεκέμβριος 2024', 'bundle',
   '2024-12-14', '2024-12-14T09:00:00Z', '2026-12-30T23:59:00Z', 20, 20, true),
  ('a1111111-0000-0000-0000-000000000003', 3, 'Διαγώνισμα 3 — Φεβρουάριος 2025', 'bundle',
   '2025-02-08', '2025-02-08T09:00:00Z', '2026-06-30T23:59:00Z', 20, 20, true),
  ('a1111111-0000-0000-0000-000000000004', 4, 'Διαγώνισμα 4 — Σεπτέμβριος 2026', 'bundle',
   '2026-09-15', '2026-09-15T09:00:00Z', null, 20, 20, true),
  ('a1111111-0000-0000-0000-000000000005', 5, 'Διαγώνισμα 5 — Μάιος 2026',     'bundle',
   '2026-05-10', (now() - interval '7 days'), (now() + interval '3 days'), 20, 20, true),
  ('a1111111-0000-0000-0000-000000000006', 6, 'Διαγώνισμα 6 — Μάιος 2026',     'bundle',
   '2026-05-18', (now() - interval '2 days'), (now() + interval '28 days'), 20, 20, true)
on conflict (id) do update set
  number            = excluded.number,
  title             = excluded.title,
  exam_date         = excluded.exam_date,
  unlocks_at        = excluded.unlocks_at,
  grading_closes_at = excluded.grading_closes_at,
  is_published      = true;

-- 4. Question categories for the three gradable sims
do $$
declare
  sim uuid;
  greek_cats text[] := array['Γραμματική', 'Λεξιλόγιο', 'Κατανόηση κειμένου', 'Σύνταξη'];
  math_cats  text[] := array['Πράξεις',    'Κλάσματα',  'Γεωμετρία',          'Προβλήματα'];
  q int;
begin
  foreach sim in array array[
    'a1111111-0000-0000-0000-000000000001',
    'a1111111-0000-0000-0000-000000000002',
    'a1111111-0000-0000-0000-000000000003',
    'a1111111-0000-0000-0000-000000000005',
    'a1111111-0000-0000-0000-000000000006'
  ]::uuid[]
  loop
    for q in 1..20 loop
      insert into simulation_question_tags (simulation_id, question_number, subject, category)
      values (sim, q, 'greek', greek_cats[((q-1) % 4) + 1])
      on conflict (simulation_id, question_number) do nothing;
    end loop;
    for q in 21..40 loop
      insert into simulation_question_tags (simulation_id, question_number, subject, category)
      values (sim, q, 'math', math_cats[((q-21) % 4) + 1])
      on conflict (simulation_id, question_number) do nothing;
    end loop;
  end loop;
end $$;

-- 5. Six students under this school
insert into students (id, school_id, first_name, last_name, class_year, subjects, notes)
select s.id, u.id, s.first_name, s.last_name, s.class_year, s.subjects, s.notes
  from auth.users u
  cross join (values
    ('b2222222-0000-0000-0000-000000000001'::uuid, 'Μαρία',   'Παπαδοπούλου',  'Γυμνάσιο', array['greek','math']::text[], 'Πολύ καλή στη Γλώσσα'::text),
    ('b2222222-0000-0000-0000-000000000002'::uuid, 'Γιώργης', 'Αλεξίου',       'Γυμνάσιο', array['math']::text[],         null::text),
    ('b2222222-0000-0000-0000-000000000003'::uuid, 'Ελένη',   'Βασιλείου',     'Γυμνάσιο', array['greek','math']::text[], null::text),
    ('b2222222-0000-0000-0000-000000000004'::uuid, 'Νίκος',   'Δημητρίου',     'Λύκειο',   array['greek']::text[],        null::text),
    ('b2222222-0000-0000-0000-000000000005'::uuid, 'Σοφία',   'Κωνσταντίνου',  'Λύκειο',   array['greek','math']::text[], 'Νεοεγγραφή'::text),
    ('b2222222-0000-0000-0000-000000000006'::uuid, 'Θάνος',   'Οικονόμου',     'Λύκειο',   array['math']::text[],         null::text)
  ) as s(id, first_name, last_name, class_year, subjects, notes)
 where u.email = 'natasakaldi99@gmail.com'
   on conflict (id) do update set
     first_name  = excluded.first_name,
     last_name   = excluded.last_name,
     class_year  = excluded.class_year,
     subjects    = excluded.subjects,
     notes       = excluded.notes;

-- 6. School-simulation participation rows for sims 1, 2, 3 (already submitted)
insert into school_simulations (id, school_id, simulation_id, student_count, is_submitted, submitted_at)
select c.id, u.id, c.sim_id, c.student_count, c.is_submitted, c.submitted_at
  from auth.users u
  cross join (values
    ('c3333333-0000-0000-0000-000000000001'::uuid, 'a1111111-0000-0000-0000-000000000001'::uuid, 6, true, '2024-11-28T14:00:00Z'::timestamptz),
    ('c3333333-0000-0000-0000-000000000002'::uuid, 'a1111111-0000-0000-0000-000000000002'::uuid, 6, true, '2024-12-22T11:00:00Z'::timestamptz),
    ('c3333333-0000-0000-0000-000000000003'::uuid, 'a1111111-0000-0000-0000-000000000003'::uuid, 5, true, '2025-02-15T15:30:00Z'::timestamptz)
  ) as c(id, sim_id, student_count, is_submitted, submitted_at)
 where u.email = 'natasakaldi99@gmail.com'
   on conflict (id) do update set
     student_count = excluded.student_count,
     is_submitted  = excluded.is_submitted,
     submitted_at  = excluded.submitted_at;

-- 7. Student grades — realistic variation, trending upward over time
-- Sim 1 — class average ~80
insert into student_simulation_grades (student_id, simulation_id, school_simulation_id, wrong_questions, score) values
  ('b2222222-0000-0000-0000-000000000001', 'a1111111-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000001', array[3, 7, 12, 22, 28],                       88), -- Μαρία
  ('b2222222-0000-0000-0000-000000000002', 'a1111111-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000001', array[21,22,24,28,30,33,35,38,40],            78), -- Γιώργης (math)
  ('b2222222-0000-0000-0000-000000000003', 'a1111111-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000001', array[2, 8, 14, 20, 25, 30, 35],              82), -- Ελένη
  ('b2222222-0000-0000-0000-000000000004', 'a1111111-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000001', array[1, 5, 9, 11, 15, 18],                   85), -- Νίκος (greek only)
  ('b2222222-0000-0000-0000-000000000005', 'a1111111-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000001', array[3, 6, 9, 12, 15, 22, 28, 32, 36, 40],   75), -- Σοφία
  ('b2222222-0000-0000-0000-000000000006', 'a1111111-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000001', array[21,23,25,27,29,31,33,35,37,39,40],     73)  -- Θάνος (math)
on conflict (student_id, simulation_id) do update set
  wrong_questions = excluded.wrong_questions,
  score = excluded.score;

-- Sim 2 — everyone improved a bit
insert into student_simulation_grades (student_id, simulation_id, school_simulation_id, wrong_questions, score) values
  ('b2222222-0000-0000-0000-000000000001', 'a1111111-0000-0000-0000-000000000002', 'c3333333-0000-0000-0000-000000000002', array[5, 12, 28, 35],                          90),
  ('b2222222-0000-0000-0000-000000000002', 'a1111111-0000-0000-0000-000000000002', 'c3333333-0000-0000-0000-000000000002', array[22, 24, 26, 28, 30, 33, 38],             83),
  ('b2222222-0000-0000-0000-000000000003', 'a1111111-0000-0000-0000-000000000002', 'c3333333-0000-0000-0000-000000000002', array[3, 9, 15, 22, 30],                       88),
  ('b2222222-0000-0000-0000-000000000004', 'a1111111-0000-0000-0000-000000000002', 'c3333333-0000-0000-0000-000000000002', array[2, 4, 7, 10],                            90),
  ('b2222222-0000-0000-0000-000000000005', 'a1111111-0000-0000-0000-000000000002', 'c3333333-0000-0000-0000-000000000002', array[4, 10, 16, 22, 28, 34, 40],              83),
  ('b2222222-0000-0000-0000-000000000006', 'a1111111-0000-0000-0000-000000000002', 'c3333333-0000-0000-0000-000000000002', array[21, 23, 26, 28, 30, 33, 37, 40],         80)
on conflict (student_id, simulation_id) do update set
  wrong_questions = excluded.wrong_questions,
  score = excluded.score;

-- Sim 3 — Νίκος and Θάνος missed it (5 graded instead of 6)
insert into student_simulation_grades (student_id, simulation_id, school_simulation_id, wrong_questions, score) values
  ('b2222222-0000-0000-0000-000000000001', 'a1111111-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000003', array[8, 15, 28],                              93),
  ('b2222222-0000-0000-0000-000000000002', 'a1111111-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000003', array[22, 25, 28, 30, 33, 40],                 85),
  ('b2222222-0000-0000-0000-000000000003', 'a1111111-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000003', array[5, 12, 22, 30],                          90),
  ('b2222222-0000-0000-0000-000000000004', 'a1111111-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000003', array[3, 8, 14],                               93),
  ('b2222222-0000-0000-0000-000000000005', 'a1111111-0000-0000-0000-000000000003', 'c3333333-0000-0000-0000-000000000003', array[6, 14, 24, 32],                          90)
on conflict (student_id, simulation_id) do update set
  wrong_questions = excluded.wrong_questions,
  score = excluded.score;

-- 8. Reset sims 5 & 6 to pristine "ungraded" state for live-demo grading.
-- (Removes any leftover school_simulation / grade rows if you previously poked at them.)
delete from student_simulation_grades
 where simulation_id in (
   'a1111111-0000-0000-0000-000000000005',
   'a1111111-0000-0000-0000-000000000006'
 )
   and student_id in (select id from students
                       where school_id = (select id from auth.users where email = 'natasakaldi99@gmail.com'));

delete from school_simulations
 where school_id = (select id from auth.users where email = 'natasakaldi99@gmail.com')
   and simulation_id in (
     'a1111111-0000-0000-0000-000000000005',
     'a1111111-0000-0000-0000-000000000006'
   );

-- ──────────────────────────────────────────────────────────────────────────
-- Done. Refresh /account and you'll see:
--   • Dashboard: 6 students, μ.ο. ~85, 6 διαγωνίσματα
--   • /account/students: 6 students grouped by Γυμνάσιο / Λύκειο
--   • /account/students/<id>: real charts (line, donut, weakness bars)
--   • /account/grading: 3 submitted (Δ1-Δ3) + 1 future locked (Δ4)
--     + Δ5 URGENT (3 days, red badge)  ← live-grade this for the wow moment
--     + Δ6 OPEN     (4 weeks)          ← live-grade this for a calmer demo
--   • Both Δ5 and Δ6 take you through the full flow:
--       Step 1 select students → Step 2 grade with X marks → Step 3 done + ranks
-- ──────────────────────────────────────────────────────────────────────────
