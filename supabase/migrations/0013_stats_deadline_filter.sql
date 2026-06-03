-- ──────────────────────────────────────────────────────────────────────────
-- Stats deadline filter: exclude grades submitted after `grading_closes_at`
--
-- Behaviour change: grading is now ALWAYS available, but a grade only counts
-- toward analytics if `submitted_at <= simulations.grading_closes_at` (or if
-- the simulation has no deadline configured at all).
--
-- We re-declare all five aggregate RPCs from 0009_school_stats.sql, this time
-- joining `student_simulation_grades` against `simulations` to check the
-- deadline. The function signatures are unchanged so the frontend keeps
-- working without modification.
-- ──────────────────────────────────────────────────────────────────────────

-- ─── Per-question stats, nationally ───────────────────────────────────────
create or replace function public.get_national_question_stats(p_simulation_id uuid)
returns table (
  question_number  int,
  total_students   bigint,
  wrong_count      bigint,
  wrong_percentage numeric
)
language sql
security definer
stable
set search_path = public
as $$
  with eligible as (
    select sg.wrong_questions
    from student_simulation_grades sg
    join simulations sim on sim.id = sg.simulation_id
    where sg.simulation_id = p_simulation_id
      and (sim.grading_closes_at is null or sg.submitted_at <= sim.grading_closes_at)
  ),
  total as (
    select count(*) as n from eligible
  ),
  unnested as (
    select unnest(wrong_questions) as q from eligible
  )
  select
    q::int,
    (select n from total),
    count(*)::bigint,
    case when (select n from total) > 0
      then round(count(*)::numeric / (select n from total) * 100, 1)
      else 0
    end
  from unnested
  group by q
  order by q;
$$;

-- ─── Per-question stats, for one school only ──────────────────────────────
create or replace function public.get_school_question_stats(p_simulation_id uuid, p_school_id uuid)
returns table (
  question_number  int,
  total_students   bigint,
  wrong_count      bigint,
  wrong_percentage numeric
)
language sql
security definer
stable
set search_path = public
as $$
  with school_grades as (
    select sg.wrong_questions
    from student_simulation_grades sg
    join students s    on s.id = sg.student_id
    join simulations sim on sim.id = sg.simulation_id
    where sg.simulation_id = p_simulation_id
      and s.school_id = p_school_id
      and (sim.grading_closes_at is null or sg.submitted_at <= sim.grading_closes_at)
  ),
  total as (select count(*) as n from school_grades),
  unnested as (select unnest(wrong_questions) as q from school_grades)
  select
    q::int,
    (select n from total),
    count(*)::bigint,
    case when (select n from total) > 0
      then round(count(*)::numeric / (select n from total) * 100, 1)
      else 0
    end
  from unnested
  group by q
  order by q;
$$;

-- ─── Per-category stats, nationally ───────────────────────────────────────
create or replace function public.get_national_category_stats(p_simulation_id uuid)
returns table (
  category         text,
  questions_count  int,
  students_count   bigint,
  wrong_count      bigint,
  wrong_percentage numeric
)
language sql
security definer
stable
set search_path = public
as $$
  with cats as (
    select category, count(*)::int as q_count
    from simulation_question_tags
    where simulation_id = p_simulation_id
    group by category
  ),
  eligible as (
    select sg.wrong_questions
    from student_simulation_grades sg
    join simulations sim on sim.id = sg.simulation_id
    where sg.simulation_id = p_simulation_id
      and (sim.grading_closes_at is null or sg.submitted_at <= sim.grading_closes_at)
  ),
  students as (
    select count(*) as n from eligible
  ),
  unnested as (
    select unnest(wrong_questions) as q from eligible
  ),
  wrong_per_cat as (
    select t.category, count(*)::bigint as wrongs
    from unnested u
    join simulation_question_tags t
      on t.simulation_id = p_simulation_id and t.question_number = u.q
    group by t.category
  )
  select
    c.category,
    c.q_count,
    (select n from students),
    coalesce(w.wrongs, 0)::bigint,
    case when (select n from students) > 0 and c.q_count > 0
      then round(coalesce(w.wrongs, 0)::numeric / ((select n from students) * c.q_count) * 100, 1)
      else 0
    end
  from cats c
  left join wrong_per_cat w on w.category = c.category
  order by c.category;
$$;

-- ─── Per-category stats, for one school only ──────────────────────────────
create or replace function public.get_school_category_stats(p_simulation_id uuid, p_school_id uuid)
returns table (
  category         text,
  questions_count  int,
  students_count   bigint,
  wrong_count      bigint,
  wrong_percentage numeric
)
language sql
security definer
stable
set search_path = public
as $$
  with cats as (
    select category, count(*)::int as q_count
    from simulation_question_tags
    where simulation_id = p_simulation_id
    group by category
  ),
  school_grades as (
    select sg.wrong_questions
    from student_simulation_grades sg
    join students s    on s.id = sg.student_id
    join simulations sim on sim.id = sg.simulation_id
    where sg.simulation_id = p_simulation_id
      and s.school_id = p_school_id
      and (sim.grading_closes_at is null or sg.submitted_at <= sim.grading_closes_at)
  ),
  students as (select count(*) as n from school_grades),
  unnested as (select unnest(wrong_questions) as q from school_grades),
  wrong_per_cat as (
    select t.category, count(*)::bigint as wrongs
    from unnested u
    join simulation_question_tags t
      on t.simulation_id = p_simulation_id and t.question_number = u.q
    group by t.category
  )
  select
    c.category,
    c.q_count,
    (select n from students),
    coalesce(w.wrongs, 0)::bigint,
    case when (select n from students) > 0 and c.q_count > 0
      then round(coalesce(w.wrongs, 0)::numeric / ((select n from students) * c.q_count) * 100, 1)
      else 0
    end
  from cats c
  left join wrong_per_cat w on w.category = c.category
  order by c.category;
$$;

-- ─── Score averages: national & school ────────────────────────────────────
create or replace function public.get_score_averages(p_simulation_id uuid, p_school_id uuid)
returns table (
  scope          text,
  total_students bigint,
  avg_score      numeric
)
language sql
security definer
stable
set search_path = public
as $$
  select 'national'::text, count(*), coalesce(round(avg(sg.score)::numeric, 1), 0)
    from student_simulation_grades sg
    join simulations sim on sim.id = sg.simulation_id
   where sg.simulation_id = p_simulation_id
     and (sim.grading_closes_at is null or sg.submitted_at <= sim.grading_closes_at)
  union all
  select 'school'::text, count(*), coalesce(round(avg(sg.score)::numeric, 1), 0)
    from student_simulation_grades sg
    join students s    on s.id = sg.student_id
    join simulations sim on sim.id = sg.simulation_id
   where sg.simulation_id = p_simulation_id
     and s.school_id = p_school_id
     and (sim.grading_closes_at is null or sg.submitted_at <= sim.grading_closes_at);
$$;

-- Grants are unchanged from 0009_school_stats.sql; reassert for safety.
grant execute on function public.get_national_question_stats(uuid)              to anon, authenticated;
grant execute on function public.get_school_question_stats(uuid, uuid)          to anon, authenticated;
grant execute on function public.get_national_category_stats(uuid)              to anon, authenticated;
grant execute on function public.get_school_category_stats(uuid, uuid)          to anon, authenticated;
grant execute on function public.get_score_averages(uuid, uuid)                 to anon, authenticated;
