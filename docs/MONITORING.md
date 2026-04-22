# Monitoring and Logs

This site emits structured JSON logs for every notable backend and client
event. All logs flow to Vercel's built-in log viewer for the project, with no
third-party service required.

## Where to look

1. Open the Vercel dashboard for the project.
2. Sidebar → **Logs**.
3. Set the time range at the top (e.g. "Last 24 hours").
4. Paste one of the filter strings below into the search bar.

Vercel's search is a substring match, so you can copy these verbatim.

## Contact form events

The `/api/contact` function logs a JSON line for every submission outcome.

Filter:

```
[contact]
```

Sample events you will see (all are structured JSON after the prefix):

| Event              | When it fires                                           | Action required             |
| ------------------ | ------------------------------------------------------- | --------------------------- |
| `success`          | Email was sent via Resend                               | None — normal traffic       |
| `honeypot_hit`     | Bot filled the hidden `website` field                   | None — bot was silently blocked |
| `validation_failed`| Name/email/message failed server-side validation        | None unless pattern spikes  |
| `spam_flagged`     | Server classifier detected spam keywords / URLs         | None unless pattern spikes  |
| `rate_limited`     | IP exceeded the Upstash sliding-window limit            | Investigate if same IP keeps hitting |
| `turnstile_failed` | Cloudflare Turnstile rejected the token                 | Investigate repeated failures |
| `resend_error`     | Resend API returned an error                            | **Check Resend dashboard**  |

### Useful per-outcome filters

```
[contact] "event":"success"
[contact] "event":"resend_error"
[contact] "event":"rate_limited"
```

### What to do if `resend_error` appears

1. Open the [Resend dashboard](https://resend.com/emails).
2. Confirm the sending domain (`usmechanicalllc.com`) is still verified.
3. Check the "Emails" tab for any bounced or blocked sends that match the
   timestamp in the log entry.
4. If the error is `authentication_error`, rotate `RESEND_API_KEY` in Vercel
   → Settings → Environment Variables.

## Client-side errors

The `ErrorBoundary` component reports uncaught React errors in production via
`navigator.sendBeacon` to `/api/client-errors`, which writes a structured log
line to stderr.

Filter:

```
[client-error]
```

Each entry includes:

- `name` and `message` — the JavaScript error
- `stack` — JS stack trace (truncated to 4 KB)
- `componentStack` — React component tree at the time of the crash
- `url` — page the user was on when it happened
- `userAgent` — browser/OS
- `release` — the `__APP_VERSION__` from `package.json` at build time

### What to do when a new `[client-error]` shows up

1. Grab the `url` from the log entry and reproduce it in your browser.
2. Check the `componentStack` — it usually points straight to the faulty
   component.
3. If it's a transient Sanity/network issue, it should self-recover. Only
   file a bug if you see the same `name` + `message` from multiple users.

## Contact form rate limits

Two separate Upstash rate limiters protect the backend:

- `/api/contact`: 5 submissions per IP per hour
- `/api/client-errors`: 30 reports per IP per hour

Both use Upstash Redis. The rate limit tables are visible in the
[Upstash console](https://console.upstash.com/) under the project's Redis
database → **Data Browser** → keys prefixed with `ratelimit:contact` or
`ratelimit:client-errors`.

## What is **not** logged (by design)

These are intentionally stripped or never captured:

- Full email content (only length is logged, never the message body)
- Phone numbers (presence is logged, not value)
- Passwords or tokens (none are collected)
- PII beyond what the user voluntarily submits

Anything you see in the logs is safe to share in a bug report or support
ticket.

## Performance audit (Lighthouse)

Run a full Lighthouse audit against production any time you want to check
Core Web Vitals, SEO, accessibility, and best-practices scores:

```
cd react-site
npm run audit:lighthouse
```

This downloads the Lighthouse CLI on the fly (via `npx --yes`), runs a
headless audit against `https://www.usmechanicalllc.com`, and writes the
results to `react-site/lighthouse-reports/`:

- `report.report.html` — open in any browser; this is the readable audit.
- `report.report.json` — raw data if you want to diff across runs.

The folder is gitignored so reports stay local.

### What scores to expect

After the quick-win round of fixes, targets for the home page are roughly:

| Category        | Target | Why it matters                       |
| --------------- | ------ | ------------------------------------ |
| Performance     | ≥ 90   | Google ranks faster sites higher     |
| Accessibility   | ≥ 95   | Required for some commercial clients |
| Best Practices  | ≥ 95   | Catches CSP / HTTPS / deprecated API |
| SEO             | = 100  | Indexing and rich-result eligibility |

If any score drops, open the HTML report and work top-down — Lighthouse
ranks issues by impact.

### Automated accessibility baseline

An `axe-core` suite runs as part of the Playwright tests and fails on
*serious* or *critical* WCAG 2.1 AA violations on all public pages:

```
npm run test:a11y
```

This is the protection against accidentally shipping an inaccessible
regression (e.g. a button without a label).

---

## Quick health check (once a week)

1. Sort Vercel Logs by most recent.
2. Filter `[contact] "event":"success"` — confirm there's at least one
   recent legitimate lead if traffic is expected.
3. Filter `[contact] "event":"resend_error"` — should be empty.
4. Filter `[client-error]` — should be rare; investigate any single entry
   that repeats across sessions.

That's the whole monitoring loop.
