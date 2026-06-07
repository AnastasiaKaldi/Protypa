-- ──────────────────────────────────────────────────────────────────────────
-- Packages v2: parent vs school account types, with school tiers by student count.
--
-- Two new concepts:
--   • profiles.account_type   — 'school' (φροντιστήριο) or 'parent' (γονέας)
--   • packages.package_type   — 'parent' | 'school' | 'legacy'
--   • packages.min_students   — lower bound of the tier (null for parent/legacy)
--   • packages.max_students   — upper bound (used for student-limit enforcement)
--   • packages.billing_interval — 'month' | 'year' | 'one_time'
--
-- Legacy subject-based packages (greek/math/bundle from 0001) are NOT deleted —
-- they're tagged package_type='legacy' so /paketa stops surfacing them while
-- existing purchases keep resolving.
--
-- Stripe is not yet activated by the boss → stripe_price_id is loosened to
-- nullable so we can seed rows without real price IDs. Checkout route refuses
-- to charge when the column is null with a friendly message.
-- ──────────────────────────────────────────────────────────────────────────

-- ─── profiles.account_type ────────────────────────────────────────────────
alter table profiles
  add column if not exists account_type text not null default 'school';

-- Use a named constraint so it can be dropped/recreated if we ever extend the
-- enum without renaming the column.
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_account_type_check'
  ) then
    alter table profiles
      add constraint profiles_account_type_check
      check (account_type in ('school', 'parent'));
  end if;
end $$;

-- ─── packages: new columns ────────────────────────────────────────────────
alter table packages
  add column if not exists package_type      text not null default 'legacy',
  add column if not exists min_students      int,
  add column if not exists max_students      int,
  add column if not exists billing_interval  text not null default 'one_time';

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'packages_package_type_check'
  ) then
    alter table packages
      add constraint packages_package_type_check
      check (package_type in ('legacy', 'parent', 'school'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'packages_billing_interval_check'
  ) then
    alter table packages
      add constraint packages_billing_interval_check
      check (billing_interval in ('month', 'year', 'one_time'));
  end if;
end $$;

-- ─── packages: loosen NOT NULL constraints we can't satisfy yet ───────────
-- subject (greek/math/bundle) doesn't apply to parent/school-tier packages.
-- stripe_price_id stays null until the boss creates Stripe products.
alter table packages alter column subject drop not null;
alter table packages alter column stripe_price_id drop not null;

-- ─── Tag the existing 3 packages as legacy ────────────────────────────────
update packages
  set package_type = 'legacy'
where slug in ('greek', 'math', 'bundle')
  and package_type = 'legacy';  -- no-op safety; default already legacy

-- ─── Seed the new v2 packages ─────────────────────────────────────────────
-- Prices are 0 placeholders. /paketa renders them as "Σύντομα" until Stripe
-- is wired and the boss sets real prices via /admin/packages (TODO).
insert into packages (
  slug, name_el, description_el, package_type,
  min_students, max_students,
  price_cents, duration_days, billing_interval,
  features
) values
  (
    'parent',
    'Πακέτο Γονέα',
    'Για γονείς με 1–2 παιδιά που προετοιμάζονται για τις πανελλήνιες.',
    'parent',
    1, 2,
    0, 365, 'year',
    $$[
      {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
      {"label":"Έως 2 μαθητές","included":true},
      {"label":"Στατιστικά για κάθε παιδί","included":true},
      {"label":"Διάγραμμα προσωπικής πορείας","included":true},
      {"label":"Συνολικά στατιστικά φροντιστηρίου","included":false},
      {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":false}
    ]$$::jsonb
  ),
  (
    'school-tier-1',
    'Φροντιστήριο · 5–10 μαθητές',
    null,
    'school',
    5, 10,
    0, 365, 'year',
    $$[
      {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
      {"label":"Έως 10 μαθητές","included":true},
      {"label":"Στατιστικά για κάθε μαθητή","included":true},
      {"label":"Συνολικά στατιστικά φροντιστηρίου","included":true},
      {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":true}
    ]$$::jsonb
  ),
  (
    'school-tier-2',
    'Φροντιστήριο · 11–15 μαθητές',
    null,
    'school',
    11, 15,
    0, 365, 'year',
    $$[
      {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
      {"label":"Έως 15 μαθητές","included":true},
      {"label":"Στατιστικά για κάθε μαθητή","included":true},
      {"label":"Συνολικά στατιστικά φροντιστηρίου","included":true},
      {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":true}
    ]$$::jsonb
  ),
  (
    'school-tier-3',
    'Φροντιστήριο · 16–20 μαθητές',
    null,
    'school',
    16, 20,
    0, 365, 'year',
    $$[
      {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
      {"label":"Έως 20 μαθητές","included":true},
      {"label":"Στατιστικά για κάθε μαθητή","included":true},
      {"label":"Συνολικά στατιστικά φροντιστηρίου","included":true},
      {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":true}
    ]$$::jsonb
  ),
  (
    'school-tier-4',
    'Φροντιστήριο · 21–25 μαθητές',
    null,
    'school',
    21, 25,
    0, 365, 'year',
    $$[
      {"label":"Πρόσβαση σε όλα τα διαγωνίσματα","included":true},
      {"label":"Έως 25 μαθητές","included":true},
      {"label":"Στατιστικά για κάθε μαθητή","included":true},
      {"label":"Συνολικά στατιστικά φροντιστηρίου","included":true},
      {"label":"Σύγκριση με όλα τα φροντιστήρια Ελλάδας","included":true}
    ]$$::jsonb
  )
on conflict (slug) do nothing;

-- ─── Helpful indexes ──────────────────────────────────────────────────────
create index if not exists packages_package_type_idx on packages(package_type);
create index if not exists profiles_account_type_idx on profiles(account_type);

-- ─── Extend the new-user trigger so signup metadata propagates ────────────
-- The signup form sends `account_type: 'school' | 'parent'` in user metadata.
-- handle_new_user() now copies it into the profiles row. Falls back to
-- 'school' for legacy signups that didn't include the field.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, school_name, account_type)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'school_name',
    coalesce(new.raw_user_meta_data->>'account_type', 'school')
  );
  return new;
end;
$$;
