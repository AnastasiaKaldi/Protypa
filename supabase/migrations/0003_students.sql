-- Protupa Pass — named students, question categories & per-student grades
-- Run after 0002_schools_grading.sql

-- ─── Students (school's own roster) ─────────────────────────────────────────
create table if not exists students (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references auth.users on delete cascade,
  first_name  text not null,
  last_name   text not null,
  class_year  text,                      -- π.χ. "Α Γυμνασίου", "Β Γυμνασίου"
  subjects    text[] not null default '{}', -- ['greek','math']
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists students_school_idx on students(school_id);

-- ─── Per-question category tags (admin sets these per simulation) ────────────
-- Allows "what type of question did the student get wrong" analysis
create table if not exists simulation_question_tags (
  id               uuid primary key default gen_random_uuid(),
  simulation_id    uuid not null references simulations(id) on delete cascade,
  question_number  int  not null,
  subject          text not null check (subject in ('greek','math')),
  category         text not null,   -- π.χ. "Γραμματική", "Λεξιλόγιο", "Γεωμετρία"
  unique (simulation_id, question_number)
);

-- ─── Named per-student grades (replaces anonymous simulation_grades) ─────────
create table if not exists student_simulation_grades (
  id                    uuid primary key default gen_random_uuid(),
  student_id            uuid not null references students(id) on delete cascade,
  simulation_id         uuid not null references simulations(id) on delete cascade,
  school_simulation_id  uuid not null references school_simulations(id) on delete cascade,
  wrong_questions       int[] not null default '{}',  -- question numbers that were wrong
  score                 int  not null,                -- (correct / total) * 100
  submitted_at          timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (student_id, simulation_id)
);
create index if not exists ssg_student_idx    on student_simulation_grades(student_id);
create index if not exists ssg_simulation_idx on student_simulation_grades(simulation_id);
create index if not exists ssg_school_sim_idx on student_simulation_grades(school_simulation_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table students                  enable row level security;
alter table simulation_question_tags  enable row level security;
alter table student_simulation_grades enable row level security;

-- Students: school manages its own; admins can read all
create policy "school manages own students"
  on students for all
  using (auth.uid() = school_id);

create policy "admin read all students"
  on students for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- Question tags: authenticated users can read; only admins can write
create policy "authenticated read question tags"
  on simulation_question_tags for select
  using (auth.role() = 'authenticated');

create policy "admin manage question tags"
  on simulation_question_tags for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- Student grades: school manages its own via students join; admins read all
create policy "school manages own student grades"
  on student_simulation_grades for all
  using (
    exists (
      select 1 from students s
      where s.id = student_simulation_grades.student_id
        and s.school_id = auth.uid()
    )
  );

create policy "admin read all student grades"
  on student_simulation_grades for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- ─── Triggers ────────────────────────────────────────────────────────────────
create trigger students_updated_at
  before update on students
  for each row execute function public.set_updated_at();

create trigger student_simulation_grades_updated_at
  before update on student_simulation_grades
  for each row execute function public.set_updated_at();

-- ─── Default question categories ────────────────────────────────────────────
-- Helper function: seeds default tags for a simulation (call from admin)
-- Greek: E1-E20, Math: E21-E40 with sensible category defaults
create or replace function public.seed_default_question_tags(sim_id uuid, greek_q int, math_q int)
returns void language plpgsql as $$
declare
  i int;
  greek_cats text[] := array[
    'Ανάγνωση','Ανάγνωση','Ανάγνωση','Ανάγνωση',
    'Γραμματική','Γραμματική','Γραμματική','Γραμματική',
    'Λεξιλόγιο','Λεξιλόγιο','Λεξιλόγιο','Λεξιλόγιο',
    'Έκφραση','Έκφραση','Έκφραση','Έκφραση',
    'Σύνθεση','Σύνθεση','Σύνθεση','Σύνθεση'
  ];
  math_cats text[] := array[
    'Αριθμητική','Αριθμητική','Αριθμητική','Αριθμητική',
    'Κλάσματα','Κλάσματα','Κλάσματα','Κλάσματα',
    'Γεωμετρία','Γεωμετρία','Γεωμετρία','Γεωμετρία',
    'Άλγεβρα','Άλγεβρα','Άλγεβρα','Άλγεβρα',
    'Προβλήματα','Προβλήματα','Προβλήματα','Προβλήματα'
  ];
begin
  for i in 1..greek_q loop
    insert into simulation_question_tags(simulation_id, question_number, subject, category)
    values (sim_id, i, 'greek', greek_cats[i])
    on conflict do nothing;
  end loop;
  for i in 1..math_q loop
    insert into simulation_question_tags(simulation_id, question_number, subject, category)
    values (sim_id, greek_q + i, 'math', math_cats[i])
    on conflict do nothing;
  end loop;
end;
$$;
