-- ──────────────────────────────────────────────────────────────────────────
-- News / posts system
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  excerpt         text,
  body            text not null,
  tag             text,                             -- e.g. 'Νέα Θέματα'
  cover_image_url text,
  publish_at      timestamptz,                      -- null = draft, future = scheduled, past = live
  email_sent_at   timestamptz,                      -- stamped by the email job (Phase 3)
  created_by      uuid references auth.users on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists posts_publish_at_idx on posts (publish_at desc);
create index if not exists posts_slug_idx       on posts (slug);

alter table posts enable row level security;

-- Public read: only published posts (publish_at set and in the past)
create policy "anyone read live posts"
  on posts for select
  using (publish_at is not null and publish_at <= now());

-- Admin read all (draft + scheduled + live)
create policy "admin read all posts"
  on posts for select
  using (public.current_user_is_admin());

-- Admin manage (insert/update/delete)
create policy "admin manage posts"
  on posts for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Trigger: updated_at
create trigger posts_updated_at
  before update on posts
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- Storage bucket for news cover images
-- ──────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

-- Public read on the bucket
create policy "anyone read news images"
  on storage.objects for select
  using (bucket_id = 'news-images');

-- Admin-only write
create policy "admin upload news images"
  on storage.objects for insert
  with check (bucket_id = 'news-images' and public.current_user_is_admin());

create policy "admin update news images"
  on storage.objects for update
  using (bucket_id = 'news-images' and public.current_user_is_admin());

create policy "admin delete news images"
  on storage.objects for delete
  using (bucket_id = 'news-images' and public.current_user_is_admin());
