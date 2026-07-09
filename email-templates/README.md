# Scholium — Email Templates

Branded, email-client-safe HTML for the transactional emails Scholium sends. Shared across all
apps (one Supabase project, one sender identity).

| File | Purpose | Supabase template |
|---|---|---|
| `confirm-signup.html` | Verify a new user's email address | **Confirm signup** |
| `reset-password.html` | Password recovery ("forgot password") link | **Reset Password** |
| `password-changed.html` | Security notification after a password change | *(not built-in — see below)* |

## Installing (Supabase Dashboard)

1. Open **Authentication → Emails → Templates**.
2. Pick the template (Confirm signup / Reset Password), paste the matching file's full HTML into the
   **Message body**, and save.
3. Set a sensible **Subject**, e.g.:
   - Confirm signup → `Confirm your Scholium email`
   - Reset Password → `Reset your Scholium password`

> **Custom SMTP:** Supabase's built-in email sender is rate-limited and meant for testing. Configure
> **Project Settings → Authentication → SMTP** with a real sender (e.g. Resend, Postmark, SES) before
> launch, or the auth emails will throttle.

### `password-changed.html` is not a built-in Supabase template

Supabase does **not** send a native "password changed" email. To use this one, send it yourself from
a custom flow — e.g. a Database Webhook / Edge Function on `auth.users` update, or your own mailer —
and substitute the two placeholders (`{{ .Email }}`, `{{ .SiteURL }}`) before sending, since they
won't be filled by Supabase's template engine outside the built-in templates.

## Template variables

These use Supabase's Go templating (`{{ .Variable }}`):

| Variable | Used in | Meaning |
|---|---|---|
| `{{ .ConfirmationURL }}` | confirm-signup, reset-password | The action link (verify / reset). Filled by Supabase. |
| `{{ .Email }}` | password-changed | The account's email address. |
| `{{ .SiteURL }}` | password-changed | Your site's base URL (used for the "Secure your account" button). |

Other variables Supabase exposes if you need them: `{{ .Token }}`, `{{ .TokenHash }}`,
`{{ .RedirectTo }}`, `{{ .Data }}`.

## Design notes

- **Email-safe:** table-based layout, inline CSS, `role="presentation"`, bulletproof buttons with an
  Outlook (VML) fallback. No external CSS, images, or web fonts.
- **Brand:** Scholium indigo `#4F46E5`, amber accent `#D97706`, IBM Plex Sans with a system-font
  fallback stack (email clients won't load the custom font, so it degrades to the system sans).
  The logo renders as a typographic wordmark — inline SVG is stripped by Gmail/Outlook.
- **Responsive** to a 600px card; collapses full-width under 600px.
- **Dark mode** via `prefers-color-scheme` (honored by Apple Mail / iOS Mail; light styles are inline
  so other clients still look correct).

## Customising

- **Contact address:** all three link to `aaravagarwal.1511@gmail.com` in the footer — search/replace
  to change it (keep it consistent with the Privacy Policy's grievance/contact email).
- **Colors:** primary button `#4F46E5` (light) / `#6366f1` (dark); update both the inline `style` and
  the `<style>` dark-mode block if you rebrand.
