# Auth email templates

These HTML files are designed to be pasted into the **Supabase Dashboard** under
**Authentication → Email Templates**. They use Supabase's Go-template variables
(`{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .NewEmail }}`, `{{ .SiteURL }}`)
so Supabase substitutes the real values at send-time.

The actual delivery happens via Brevo SMTP (configured under
**Project Settings → Authentication → SMTP Settings** — see the deployment notes
on Brevo setup).

## Files & where they go

| File | Supabase template slot | Suggested subject |
|---|---|---|
| `confirm-signup.html` | "Confirm signup" | `Επιβεβαιώστε το email σας · Protupa` |
| `reset-password.html` | "Reset password" | `Επαναφορά κωδικού · Protupa` |
| `change-email.html` | "Change Email Address" | `Επιβεβαιώστε τη νέα διεύθυνση email · Protupa` |

## Updating templates

1. Edit the relevant `.html` file in this folder.
2. Open Supabase Dashboard → Authentication → Email Templates → pick the template.
3. Paste the new HTML, save, and trigger a test by signing up / requesting a reset
   from a staging account.

## Design notes

- Inline styles only — most email clients strip `<style>` blocks.
- 560px content column, centered, on a warm-paper background (`#f5f3ee`).
- Brand colors: purple `#7c00d0`, blue `#056ef5`, lime `#c8ff00`, ink `#1a1a1a`.
- Greek copy throughout. Sender display name should be `Protupa`.
- Each template includes a fallback plain-text link in case the CTA button is blocked.
