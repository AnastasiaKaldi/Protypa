-- ──────────────────────────────────────────────────────────────────────────
-- Weighted scoring for student_simulation_grades.
--
-- Every exam paper now has a fixed point distribution by question position:
--   Q1-10   → 2 pts each   (sub-total 20)
--   Q11-20  → 3 pts each   (sub-total 30)
--   Q21-30  → 2 pts each   (sub-total 20)
--   Q31-40  → 3 pts each   (sub-total 30)
--   Total                  100 pts
--
-- score = round(((100 − sum_of_lost_points) / 100) × 100) = (100 − lost)
-- ──────────────────────────────────────────────────────────────────────────

create or replace function public.compute_grade_score(p_wrong int[])
returns int
language sql
immutable
set search_path = public
as $$
  with points(q, pts) as (
    select g.q,
      case
        when g.q between 1 and 10 then 2
        when g.q between 11 and 20 then 3
        when g.q between 21 and 30 then 2
        when g.q between 31 and 40 then 3
        else 0
      end
    from generate_series(1, 40) as g(q)
  ),
  totals as (select sum(pts) as max_pts from points),
  lost as (
    select coalesce(sum(p.pts), 0) as lost_pts
    from points p
    where p.q = any(coalesce(p_wrong, '{}'::int[]))
  )
  select
    case when (select max_pts from totals) > 0
      then round((((select max_pts from totals) - (select lost_pts from lost))::numeric
                  / (select max_pts from totals)) * 100)::int
      else 0
    end;
$$;

grant execute on function public.compute_grade_score(int[]) to anon, authenticated;

-- Recompute every existing stored score so old rows are consistent
-- with the new weighting.
update student_simulation_grades
   set score = public.compute_grade_score(wrong_questions);
