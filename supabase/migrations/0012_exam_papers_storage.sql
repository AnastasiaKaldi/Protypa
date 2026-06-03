-- ──────────────────────────────────────────────────────────────────────────
-- Storage bucket for exam papers (PDFs uploaded by admins)
-- ──────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'exam-papers',
  'exam-papers',
  true,                                  -- public read; gating happens at the app layer
  52428800,                              -- 50 MB per file
  array['application/pdf']               -- PDFs only
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read so any authenticated visitor with the URL can download (the
-- app-layer purchase check decides whether to render the link at all).
create policy "anyone read exam papers"
  on storage.objects for select
  using (bucket_id = 'exam-papers');

-- Admin-only write
create policy "admin upload exam papers"
  on storage.objects for insert
  with check (bucket_id = 'exam-papers' and public.current_user_is_admin());

create policy "admin update exam papers"
  on storage.objects for update
  using (bucket_id = 'exam-papers' and public.current_user_is_admin());

create policy "admin delete exam papers"
  on storage.objects for delete
  using (bucket_id = 'exam-papers' and public.current_user_is_admin());
