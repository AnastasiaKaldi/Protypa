-- Add a marketing email preference per school.
-- Default: false (no marketing emails until they explicitly opt in).
alter table schools
  add column if not exists marketing_opt_in boolean not null default false;
