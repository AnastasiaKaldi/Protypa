-- Fix "infinite recursion detected in policy for relation profiles"
--
-- The original "admin read all profiles" policy referenced `profiles` from
-- inside its own USING clause — Postgres re-evaluates the policy when reading
-- profiles, which re-runs the check, ad infinitum.
--
-- Standard Supabase fix: extract the admin check into a SECURITY DEFINER
-- function. SECURITY DEFINER runs as the function owner (postgres), which
-- bypasses RLS, breaking the recursion.

create or replace function public.current_user_is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false)
$$;

-- Allow execution from PostgREST roles
grant execute on function public.current_user_is_admin() to anon, authenticated;

-- ─── Drop and recreate every policy that referenced profiles inline ────────

-- profiles
drop policy if exists "admin read all profiles" on profiles;
create policy "profiles read self or admin"
  on profiles for select
  using (auth.uid() = id or public.current_user_is_admin());

-- schools
drop policy if exists "admin read all schools" on schools;
create policy "admin read all schools"
  on schools for select
  using (public.current_user_is_admin());

-- simulations
drop policy if exists "admin manage simulations" on simulations;
create policy "admin manage simulations"
  on simulations for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- school_simulations
drop policy if exists "admin read all school_simulations" on school_simulations;
create policy "admin read all school_simulations"
  on school_simulations for select
  using (public.current_user_is_admin());

-- simulation_grades (the older anonymous-grade table from 0002)
drop policy if exists "admin read all grades" on simulation_grades;
create policy "admin read all grades"
  on simulation_grades for select
  using (public.current_user_is_admin());

-- students (from 0003)
drop policy if exists "admin read all students" on students;
create policy "admin read all students"
  on students for select
  using (public.current_user_is_admin());

-- simulation_question_tags (from 0003)
drop policy if exists "admin manage question tags" on simulation_question_tags;
create policy "admin manage question tags"
  on simulation_question_tags for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- student_simulation_grades (from 0003)
drop policy if exists "admin read all student grades" on student_simulation_grades;
create policy "admin read all student grades"
  on student_simulation_grades for select
  using (public.current_user_is_admin());
