-- ──────────────────────────────────────────────────────────────────────────
-- Lock down exam papers so they always pass through the watermarking
-- server route (/api/account/exam-paper/[id]).
--
-- Changes:
--   • exam-papers bucket flipped from public → private.
--   • SELECT policy removed; the watermark route fetches via the service-role
--     client, so RLS is bypassed there. No public read access remains.
--   • Existing `simulations.questions_url` values stored a FULL public URL
--     (https://…/storage/v1/object/public/exam-papers/<uuid>.pdf). Strip that
--     prefix so only the storage path (`<uuid>.pdf`) remains. The frontend
--     no longer needs the URL — it just passes the simulation ID to the
--     watermark route, which looks up the path.
-- ──────────────────────────────────────────────────────────────────────────

-- 1. Make the bucket private. Existing files are NOT deleted.
update storage.buckets set public = false where id = 'exam-papers';

-- 2. Drop the public SELECT policy from 0012. The server-side service-role
--    client bypasses RLS, so customers no longer have any direct read path.
drop policy if exists "anyone read exam papers" on storage.objects;

-- 2b. Re-grant SELECT to admins only, so the admin UI can still preview
--     uploaded PDFs via createSignedUrl(). Customers still get nothing.
drop policy if exists "admin read exam papers" on storage.objects;
create policy "admin read exam papers"
  on storage.objects for select
  using (bucket_id = 'exam-papers' and public.current_user_is_admin());

-- 3. Normalize existing questions_url values to storage paths only.
--    Before:  https://abc.supabase.co/storage/v1/object/public/exam-papers/123.pdf
--    After:   123.pdf
update simulations
   set questions_url = regexp_replace(questions_url, '^.*/exam-papers/', '')
 where questions_url is not null
   and questions_url like 'http%';

-- 4. material_url uses the same bucket and same pattern — normalize it too,
--    even though it's not the watermarked path (kept for symmetry).
update simulations
   set material_url = regexp_replace(material_url, '^.*/exam-papers/', '')
 where material_url is not null
   and material_url like 'http%';
