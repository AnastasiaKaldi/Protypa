-- Protypa Pass — initial schema
-- Run in Supabase SQL editor or via `supabase db reset` after adjusting connection.

-- ─── Enums ──────────────────────────────────────────────────────────────────
create type subject as enum ('math', 'greek', 'bundle');

create type question_type as enum (
  'multiplication','addition','subtraction','division','fractions',
  'geometry','word_problem','grammar','vocabulary','reading_comprehension','other'
);

-- ─── Tables ─────────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  school_name text,
  created_at timestamptz default now()
);

create table packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_el text not null,
  description_el text,
  subject subject not null,
  price_cents int not null,
  original_price_cents int,            -- if set, shown as strikethrough next to price_cents
  duration_days int not null default 30,
  features jsonb not null default '[]'::jsonb, -- [{label: text, included: bool}, ...]
  stripe_price_id text not null
);

create table exam_papers (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references packages(id) on delete restrict,
  title_el text not null,
  year int,
  pdf_path text not null,
  created_at timestamptz default now()
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references exam_papers(id) on delete cascade,
  number int not null,
  qtype question_type not null,
  prompt_el text,
  choices jsonb not null,
  correct_answer text not null,
  unique (paper_id, number)
);

create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  package_id uuid not null references packages(id),
  stripe_session_id text unique,
  purchased_at timestamptz default now(),
  expires_at timestamptz not null
);
create index purchases_user_active_idx on purchases (user_id, expires_at);

create table grading_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  paper_id uuid not null references exam_papers(id),
  student_name text,
  answers jsonb not null,
  score int not null,
  total int not null,
  type_breakdown jsonb not null,
  created_at timestamptz default now()
);
create index grading_sessions_user_idx on grading_sessions (user_id, created_at desc);

-- ─── Trigger: auto-create a profile row on signup ───────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, school_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'school_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ─── Row-Level Security ─────────────────────────────────────────────────────
alter table profiles         enable row level security;
alter table packages         enable row level security;
alter table exam_papers      enable row level security;
alter table questions        enable row level security;
alter table purchases        enable row level security;
alter table grading_sessions enable row level security;

-- profiles: owner-only
create policy "profiles self select" on profiles
  for select using (auth.uid() = id);
create policy "profiles self update" on profiles
  for update using (auth.uid() = id);

-- packages: public read
create policy "packages public read" on packages
  for select using (true);

-- exam_papers: visible only when the user has an active purchase
create policy "exam_papers entitled read" on exam_papers
  for select using (
    exists (
      select 1 from purchases p
      where p.user_id = auth.uid()
        and p.package_id = exam_papers.package_id
        and p.expires_at > now()
    )
  );

-- questions: same rule, joined through paper → package
create policy "questions entitled read" on questions
  for select using (
    exists (
      select 1
      from exam_papers ep
      join purchases p on p.package_id = ep.package_id
      where ep.id = questions.paper_id
        and p.user_id = auth.uid()
        and p.expires_at > now()
    )
  );

-- purchases: owner-only read; writes happen via service-role from webhook
create policy "purchases self read" on purchases
  for select using (auth.uid() = user_id);

-- grading_sessions: owner-only read; writes via service-role from /api/grade
create policy "grading_sessions self read" on grading_sessions
  for select using (auth.uid() = user_id);
