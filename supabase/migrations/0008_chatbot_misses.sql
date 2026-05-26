-- Log queries the chatbot couldn't answer, so we can improve the FAQ / clusters.
create table if not exists chatbot_misses (
  id          uuid primary key default gen_random_uuid(),
  query       text not null,
  user_id     uuid references auth.users on delete set null,
  pathname    text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists chatbot_misses_created_at_idx on chatbot_misses (created_at desc);

alter table chatbot_misses enable row level security;

-- Anyone (including anonymous visitors) can log a miss.
create policy "anyone log miss"
  on chatbot_misses for insert
  with check (true);

-- Only admins can read the log.
create policy "admin read misses"
  on chatbot_misses for select
  using (public.current_user_is_admin());

create policy "admin delete misses"
  on chatbot_misses for delete
  using (public.current_user_is_admin());
