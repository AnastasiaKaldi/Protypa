-- Protypa Pass — schools, simulations & grading schema
-- Run after 0001_init.sql in the Supabase SQL editor.

-- ─── Extend profiles ────────────────────────────────────────────────────────
alter table profiles
  add column if not exists is_admin boolean not null default false,
  add column if not exists onboarding_complete boolean not null default false;

-- ─── Schools (tutoring institute business details) ───────────────────────────
create table if not exists schools (
  id              uuid primary key references auth.users on delete cascade,
  -- Legal / trade
  legal_name      text,                        -- Επωνυμία
  trade_name      text,                        -- Διακριτικός τίτλος
  -- Address
  address         text,
  postal_code     text,
  city            text,
  region          text,
  -- Contact
  phone           text,                        -- Σταθερό τηλέφωνο
  mobile          text,                        -- Κινητό υπευθύνου
  school_email    text,                        -- Email φροντιστηρίου
  -- Contact person
  contact_person  text,                        -- Υπεύθυνος επικοινωνίας
  contact_email   text,                        -- Email υπευθύνου
  -- Tax / billing
  afm             text,                        -- ΑΦΜ
  doy             text,                        -- ΔΟΥ
  -- System preferences
  subjects        text[] not null default '{}', -- ['greek','math','bundle']
  -- Legal
  terms_accepted_at timestamptz,
  -- Timestamps
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── Simulations (Προσομοιώσεις — admin-managed exam events) ────────────────
create table if not exists simulations (
  id                  uuid primary key default gen_random_uuid(),
  number              int  not null,           -- 1, 2, 3 …
  title               text not null,           -- "Προσομοίωση 1 — Νοέμβριος 2025"
  subject             text not null check (subject in ('greek','math','bundle')),
  exam_date           date,                    -- Ημερομηνία διαγωνίσματος
  unlocks_at          timestamptz,             -- Θέματα ορατά από
  grading_closes_at   timestamptz,             -- Καταχώρηση βαθμών έως
  greek_questions     int  not null default 20,
  math_questions      int  not null default 20,
  is_published        boolean not null default false,
  created_at          timestamptz not null default now()
);

-- ─── School participation in a simulation ───────────────────────────────────
create table if not exists school_simulations (
  id              uuid primary key default gen_random_uuid(),
  school_id       uuid not null references auth.users on delete cascade,
  simulation_id   uuid not null references simulations(id) on delete cascade,
  student_count   int,                         -- Δηλωθέντες μαθητές
  is_submitted    boolean not null default false,
  submitted_at    timestamptz,
  unique (school_id, simulation_id)
);
create index if not exists school_simulations_school_idx on school_simulations(school_id);
create index if not exists school_simulations_sim_idx   on school_simulations(simulation_id);

-- ─── Per-student grading result ─────────────────────────────────────────────
create table if not exists simulation_grades (
  id                    uuid primary key default gen_random_uuid(),
  school_simulation_id  uuid not null references school_simulations(id) on delete cascade,
  student_label         text not null,         -- 'Μ1', 'Μ2', …
  wrong_questions       int[] not null default '{}', -- question numbers that were wrong
  score                 int  not null,         -- (correct / total) * 100 rounded
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists simulation_grades_ss_idx on simulation_grades(school_simulation_id);

-- ─── Row-Level Security ─────────────────────────────────────────────────────
alter table schools            enable row level security;
alter table simulations        enable row level security;
alter table school_simulations enable row level security;
alter table simulation_grades  enable row level security;

-- Profiles: admins can read all, users can read/update own
create policy "admin read all profiles"
  on profiles for select
  using (
    auth.uid() = id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "user update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Schools: users manage own row; admins can read all
create policy "school owner all"
  on schools for all
  using (auth.uid() = id);

create policy "admin read all schools"
  on schools for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- Simulations: published simulations visible to authenticated users; admins full access
create policy "authenticated read published simulations"
  on simulations for select
  using (auth.role() = 'authenticated' and is_published = true);

create policy "admin all simulations"
  on simulations for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- school_simulations: owner manages own; admins read all
create policy "school_simulation owner all"
  on school_simulations for all
  using (auth.uid() = school_id);

create policy "admin read all school_simulations"
  on school_simulations for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- simulation_grades: owner manages via school_simulations join; admins read all
create policy "grade owner all"
  on simulation_grades for all
  using (
    exists (
      select 1 from school_simulations ss
      where ss.id = simulation_grades.school_simulation_id
        and ss.school_id = auth.uid()
    )
  );

create policy "admin read all grades"
  on simulation_grades for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- ─── Trigger: keep schools.updated_at fresh ─────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger schools_updated_at
  before update on schools
  for each row execute function public.set_updated_at();

create trigger simulation_grades_updated_at
  before update on simulation_grades
  for each row execute function public.set_updated_at();
