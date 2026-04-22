# U.S. Mechanical Website

Production marketing site for U.S. Mechanical. React 18 + Vite on the front end, Sanity for CMS content, Vercel for hosting and serverless functions (contact form, error sink), Resend for transactional email, Cloudflare Turnstile for bot protection, and Upstash Redis for IP rate limiting.

**Live:** https://www.usmechanicalllc.com

---

## Quick start

```bash
cd react-site
cp .env.example .env      # fill in the values you need (see below)
npm install
npm run dev               # http://localhost:3000
```

The Sanity Studio is a separate workspace at `../sanity/`; see `SANITY_SETUP.md` for working with content.

---

## What's in the stack

| Concern | Tech | Where |
| --- | --- | --- |
| UI | React 18, Vite, Tailwind, Framer Motion | `src/` |
| Routing | React Router v6 | `src/App.jsx` |
| CMS | Sanity (project `3vpl3hho`) | `src/hooks/useSanityLive.js`, `src/utils/sanity.js` |
| Contact form | Vercel Serverless + Resend + Turnstile + Upstash | `api/contact.js`, `src/pages/Contact.jsx` |
| Error reporting | Self-hosted sink → Vercel logs | `api/client-errors.js`, `src/components/ErrorBoundary.jsx` |
| Analytics | GA4 behind a consent banner | `src/utils/analytics.js`, `src/components/ConsentBanner.jsx` |
| SEO | Dynamic sitemap, JSON-LD, OG tags | `generate-sitemap.mjs`, `src/components/SEO.jsx`, `src/components/StructuredData.jsx` |
| Hosting config | Vercel (rootDirectory = `react-site`) | `vercel.json` (inside this folder — **single source of truth**) |

---

## Environment variables

Copy `.env.example` to `.env` locally and set the same values in Vercel → Project Settings → Environment Variables for production.

| Variable | Required | Purpose |
| --- | :-: | --- |
| `VITE_SITE_URL` | yes | Canonical site origin, used for OG/Twitter/JSON-LD/sitemap. No trailing slash. |
| `VITE_TURNSTILE_SITE_KEY` | yes | Cloudflare Turnstile public site key. |
| `TURNSTILE_SECRET_KEY` | yes | Cloudflare Turnstile server secret. Never prefix with `VITE_`. |
| `RESEND_API_KEY` | yes | Resend API key for the contact form. |
| `CONTACT_FORM_TO_EMAIL` | no | Destination inbox (default `info@usmechanicalllc.com`). |
| `RESEND_FROM_EMAIL` | no | `"Display Name <verified@domain>"`. Falls back to Resend's sandbox address. |
| `UPSTASH_REDIS_REST_URL` | recommended | Upstash REST URL for IP rate limiting (`/api/contact` and `/api/client-errors`). |
| `UPSTASH_REDIS_REST_TOKEN` | recommended | Upstash REST token. |

If Upstash isn't configured, both APIs still work but skip IP rate limiting.

---

## Available scripts

```bash
npm run dev               # Vite dev server on :3000
npm run build             # prebuild (check-routes + sitemap) → vite build
npm run preview           # serve dist/
npm run lint              # ESLint — fails on any warning
npm run lint:fix          # auto-fix
npm run format            # Prettier
npm run format:check
npm run generate-sitemap  # regenerate public/sitemap.xml from Sanity
npm run check:routes      # verify App.jsx routes are all in vercel.json
npm run test:e2e          # Playwright — all suites (chromium + firefox + webkit)
npm run test:smoke        # Playwright — smoke tests only (chromium)
npm run test:a11y         # Playwright — axe-core accessibility audit (chromium)
```

---

## Routing, 404s, and the routes guard

The SPA has 14 real routes (plus a `*` NotFound). Each one is mirrored in `vercel.json` under `rewrites` so Vercel serves `index.html` for direct navigations and reloads. The build-time **routes guard** (`scripts/check-routes.mjs`) runs as part of `prebuild` and fails the deploy if you add a `<Route path="...">` to `App.jsx` without also adding it to `vercel.json`.

For unmatched paths, Vite copies `dist/index.html` → `dist/404.html` so Vercel returns HTTP 404 (not 200) with the SPA shell, which then renders the `NotFound` page with `<meta name="robots" content="noindex">`. This keeps search engines from indexing soft 404s.

---

## Sitemap

`generate-sitemap.mjs` queries Sanity for services, portfolio categories, and projects, writes `public/sitemap.xml`, and is invoked by `prebuild`. If Sanity is temporarily unreachable but `sitemap.xml` already exists, the script warns and keeps the existing file so a transient outage doesn't break a deploy. Set `SKIP_SITEMAP=1` to bypass entirely.

---

## Contact form

`POST /api/contact` runs the following, in order:

1. Honeypot — silent `200` if the hidden `website` field is filled.
2. Input validation — name/email/phone/message length + format (400 on failure).
3. Spam heuristics — keyword list, link count, suspicious email fragments.
4. Upstash rate limit — 3 submissions per IP per hour (429 on failure, with `Retry-After`).
5. Cloudflare Turnstile verification (`remoteip` attached).
6. Resend email send to `CONTACT_FORM_TO_EMAIL`.

Every non-success branch emits a `[contact] {json}` log line (no PII) so you can triage spikes in Vercel logs.

---

## Error reporting

`src/components/ErrorBoundary.jsx` wraps the whole app. In development it prints the error to console; in production it fire-and-forgets a minimal payload (name, message, stack, component stack, URL, user agent, app version) to `/api/client-errors`, which logs `[client-error] {json}` to Vercel. Payloads are rate-limited per IP and never include user input beyond the browser-provided fields.

See [`../docs/MONITORING.md`](../docs/MONITORING.md) for Vercel log filter strings and a weekly health-check routine.

---

## Privacy & analytics consent

GA4 is **not** loaded on first visit. `src/components/ConsentBanner.jsx` shows a dismissible banner; `src/utils/analytics.js` injects `gtag.js` only after the user explicitly accepts. Declining or closing the banner blocks all analytics network calls. Users can revisit their choice from the **Manage cookie preferences** button on the Privacy page.

---

## Content management

All dynamic content lives in Sanity Studio. Fetches flow through `useSanityLive(query, params, { initialData, listenFilter })`, which:

- Uses `initialData` on mount to avoid a redundant first fetch.
- Subscribes to Sanity live mutations and re-fetches with a 300ms debounce so a burst of Studio keystrokes collapses into one request.

See `SANITY_SETUP.md` and `FALLBACK_MAINTENANCE.md` for content workflow details.

---

## Deployment

The Vercel project is linked with `rootDirectory: react-site` (see `.vercel/project.json`). That means **only** `react-site/vercel.json` is read by Vercel — any `vercel.json` outside this folder is ignored. All security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy), rewrites, and redirects are maintained in this file.

On push to `main`, Vercel runs:

```
npm install
npm run build   # → prebuild (check-routes + sitemap) → vite build → copy 404.html
```

---

## Project layout

```
react-site/
├── api/                          # Vercel serverless functions
│   ├── contact.js                # contact form (Resend + Turnstile + Upstash)
│   └── client-errors.js          # ErrorBoundary sink
├── public/                       # static assets (logo, og-image, sitemap, robots)
├── scripts/
│   └── check-routes.mjs          # prebuild guard: App.jsx ↔ vercel.json parity
├── src/
│   ├── components/               # UI components (SEO, ErrorBoundary, ConsentBanner, …)
│   ├── hooks/
│   │   └── useSanityLive.js      # debounced live Sanity hook
│   ├── pages/                    # route-level components (lazy-loaded)
│   ├── utils/                    # analytics, consent, validation, rateLimit, siteUrl, …
│   ├── App.jsx                   # router
│   └── main.jsx                  # entry
├── generate-sitemap.mjs          # prebuild: dynamic sitemap from Sanity
├── vercel.json                   # hosting config (headers, rewrites, redirects)
├── vite.config.js                # build + __APP_VERSION__ define + 404.html copy
└── eslint.config.js
```

---

## Troubleshooting

**`npm run build` fails with `[check-routes] Routes defined … but missing from vercel.json`**  
Add the missing path to the `rewrites` array in `vercel.json` with `destination: "/index.html"`.

**Sitemap step fails on Sanity outage**  
Existing `public/sitemap.xml` is kept automatically. Once Sanity is back, run `npm run generate-sitemap` and commit.

**Contact form returns 429**  
The IP hit the 3-per-hour rate limit. Check `Retry-After`. For testing, point `/api/contact` at a burner Upstash DB or clear the key prefix `ratelimit:contact` in the Upstash console.

**Error boundary isn't reporting**  
Only runs in production builds. Check `Network` in DevTools for `/api/client-errors` and confirm `UPSTASH_*` env vars are set (missing Upstash just disables rate limiting; reports still go through).

---

## Legacy docs

Older domain-specific notes kept for reference:

- `SANITY_SETUP.md`, `SANITY_CONFIG.md` — content & schema workflow
- `FALLBACK_MAINTENANCE.md` — when Sanity is down, what's used instead
- `QUICK_START.md` — condensed dev loop
- `SETUP.md` — first-time local setup
- `UPDATE_HEADER_LINKS.md` — navigation content change walkthrough

---

Built for U.S. Mechanical.
