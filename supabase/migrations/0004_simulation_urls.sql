-- Add downloadable PDF URL columns to simulations
alter table simulations
  add column if not exists material_url  text,
  add column if not exists questions_url text;
