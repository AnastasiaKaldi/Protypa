-- ──────────────────────────────────────────────────────────────────────────
-- Pick which account is the admin (separate from the test/customer account)
-- ──────────────────────────────────────────────────────────────────────────

-- 1. List all your accounts so you can pick one to be the admin:
select u.email, p.is_admin, p.full_name, u.created_at
  from auth.users u
  left join profiles p on p.id = u.id
 order by u.created_at;

-- 2. Make natasakaldi99 a CUSTOMER (no admin link in their header)
update profiles set is_admin = false
 where id = (select id from auth.users where email = 'natasakaldi99@gmail.com');

-- 3. Pick the email below and replace it, then run this block to grant admin:
--    (Leave natasakaldi99 alone — it stays customer-only for the demo)
update profiles set is_admin = true, onboarding_complete = true
 where id = (select id from auth.users where email = 'REPLACE_WITH_YOUR_OTHER_EMAIL@example.com');
