# Πρότυπα Pass

Πλατφόρμα προετοιμασίας για τις εξετάσεις των Πρότυπων / Πειραματικών Γυμνασίων στην Ελλάδα. Φροντιστήρια αγοράζουν πακέτα θεμάτων (Μαθηματικά / Γλώσσα / Συνδυασμός) και αποκτούν πρόσβαση 30 ημερών στο εργαλείο διόρθωσης γραπτών.

Built with **Next.js (App Router) + Supabase + Stripe + Tailwind**.

---

## Quick start

```bash
npm install
cp .env.example .env.local        # fill in Supabase + Stripe keys
npm run dev                       # http://localhost:3000
```

### 1. Supabase setup

1. Create a project at https://supabase.com.
2. Copy the Project URL, anon key, and service-role key into `.env.local`.
3. In the SQL editor, run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and then [`supabase/seed.sql`](supabase/seed.sql).
4. In **Storage**, create a private bucket named `exam-pdfs` and upload your sample PDF as `samples/math-2024.pdf` (matching the seed).

### 2. Stripe setup

1. Create three Products in the Stripe dashboard (Math / Greek / Bundle) with one-time prices.
2. Replace the `price_REPLACE_ME_*` values in `supabase/seed.sql` with the real Price IDs (or update the rows directly in Supabase).
3. Locally, forward webhook events:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` in `.env.local`.
4. Use Stripe test card `4242 4242 4242 4242` to verify the full purchase → entitlement → grading flow.

---

## Architecture

```
app/
├── (marketing)            Αρχική, Πακέτα, Σχετικά, FAQ, Επικοινωνία
├── signin / signup        Supabase email+password auth
├── account/               Dashboard, papers, history (auth-gated)
├── grade/[id]/            Side-by-side PDF + multiple-choice grading UI (entitlement-gated)
└── api/
    ├── checkout           Stripe Checkout session
    ├── webhook            Stripe webhook → provisions purchases
    ├── papers/[id]/pdf    Signed URL for PDF (entitlement check)
    └── grade              Server-side scoring + history insert
```

**Entitlements** are enforced in three places:
- `lib/entitlements.ts` — checked by every server component / API route
- Postgres RLS — protects raw rows even with a leaked anon key
- Storage — `exam-pdfs` is private; only short-lived signed URLs are minted after an entitlement check

**Grading** is always done server-side (`lib/grading.ts` → `/api/grade`). The client only collects answers; it never sees the answer key and never computes the score.

---

## Out of scope for the MVP

- Real exam content / PDFs (seed contains placeholder data — upload real papers via Supabase Storage + insert rows in `exam_papers` and `questions`)
- Stripe tax/VAT configuration (set up in Stripe dashboard)
- Custom transactional emails (using Supabase + Stripe defaults)
- GDPR cookie banner & legal copy (placeholder Terms/Privacy pages)
- Admin UI for uploading new papers (use Supabase Studio for now)

---

## Notes

- All UI strings live in [`src/lib/i18n/el.ts`](src/lib/i18n/el.ts).
- Greek-locale formatting via [`src/lib/format.ts`](src/lib/format.ts).
- The font is **Noto Sans** (with Greek + Greek-Extended subsets) — full glyph coverage for Greek typography.
