-- ──────────────────────────────────────────────────────────────────────────
-- Quick refresh: makes Διαγώνισμα 5 expire in ~1 day 8 hours and leaves it
-- ungraded, so the red urgent banner shows on the dashboard + grading list.
--
-- Use this just before a demo if Δ5's deadline has already passed since you
-- last ran the seed.
-- ──────────────────────────────────────────────────────────────────────────

-- 1. Refresh deadlines on the urgent sim
update simulations
   set unlocks_at        = (now() - interval '9 days'),
       grading_closes_at = (now() + interval '1 day 8 hours')
 where id = 'a1111111-0000-0000-0000-000000000005';

-- 2. Wipe any existing grading progress on Δ5 for this account so the
--    urgent reminder fires (it only shows for *unsubmitted* sims).
delete from student_simulation_grades
 where simulation_id = 'a1111111-0000-0000-0000-000000000005'
   and student_id in (
     select id from students
      where school_id = (select id from auth.users where email = 'natasakaldi99@gmail.com')
   );

delete from school_simulations
 where simulation_id = 'a1111111-0000-0000-0000-000000000005'
   and school_id = (select id from auth.users where email = 'natasakaldi99@gmail.com');

-- 3. Bonus: a second, less urgent unsubmitted sim (Δ6, 4 days out) so
--    you can also demo the calm "next deadline" state.
update simulations
   set unlocks_at        = (now() - interval '2 days'),
       grading_closes_at = (now() + interval '4 days')
 where id = 'a1111111-0000-0000-0000-000000000006';

delete from school_simulations
 where simulation_id = 'a1111111-0000-0000-0000-000000000006'
   and school_id = (select id from auth.users where email = 'natasakaldi99@gmail.com');
