-- Add parent names and gender to students
alter table students
  add column if not exists mother_name text,
  add column if not exists father_name text,
  add column if not exists gender      text check (gender in ('female','male','other'));
