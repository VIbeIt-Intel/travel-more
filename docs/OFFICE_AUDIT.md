# TravelMORE back office audit (Phase 3a, Step 0)

Audited on 21 November 2026 against the local working copy at commit `9f8dd32` (`main`), then this branch `feature/office-phase-3a`. The dev server was already running with `BACK_OFFICE_ENABLED=true` on port 3000. `GET http://localhost:3000/office` returned **200**.

Nothing in this step changes behaviour. No deploy, no DNS, no `gh-pages` change, no Cloudflare config change.

## What was confirmed

| Brief | Local finding |
| --- | --- |
| Next.js 15 App Router, React 19, TypeScript, Tailwind 4, framer-motion, nodemailer | Confirmed. `package.json`: `next` 15.5.x, `react` 19.2, `nodemailer` 7. `dev` uses Turbopack. |
| Tokens in `src/app/globals.css` | Confirmed. Cream is `sand-100` `#f7f3ed`. Sand 200 `#ebe4d8`, sand 300 `#d9cdb8`. Navy 950 `#0a1628`, 900 `#0f2137`, 800 `#152a45`. Teal 700 `#0d4f4f`, 600 `#126969`, 500 `#1a8585`. Gold 400 `#c9a962`, 500 `#b8924a`, 600 `#9a7838`. `font-display` is Cormorant Garamond. Body is DM Sans. Page background is sand-100. |
| `BACK_OFFICE_ENABLED` in `src/lib/backOffice.ts` and `src/middleware.ts` | Confirmed. `true` forces on, `false` forces off, unset follows `NODE_ENV === "development"`. |
| Password-only login, scrypt, HMAC cookie `tm_office` | Confirmed in `src/lib/officeAuth.ts`. Cookie is httpOnly, sameSite lax, secure only when `NODE_ENV === "production"`, 14 day max age. The token is `HMAC-SHA256(secret, "travelmore-office")`, not a random session id. |
| Forgot password, 30 minute link | Confirmed. `startReset` stores a SHA-256 of the token and a 30 minute expiry, with a 2 minute resend cooldown. Email goes to `SITE.emails` via nodemailer. |
| One scrolling `/office` page, Sign out top right | Confirmed. `OfficeDesk` has no nav. Blocks are Specials, Planner estimates, then trip requests. |
| JSON under `/data`, pictures on disk | `/data` is gitignored. See shapes below. Special pictures are written to `public/specials/` and served as public URLs. |
| GitHub Pages stash | `scripts/github-pages.mjs` stashes `src/app/api`, `src/app/office`, `src/middleware.ts`, copies `data/specials.json` to `public/site-data/specials.json`, then `next build` with `output: "export"`. |
| No quotes, invoices, itinerary builder, insurance form, or Beachcomber | Confirmed. No Prisma, Drizzle, Docker, tests, or `.env.example`. No README. |

## Corrections (do not treat the brief as the code)

1. **The office routes are not in git HEAD.** Commit `f801d8e` deleted `src/app/office`, `src/app/api`, and `src/middleware.ts` so the static export could build ("remove API routes, office admin, middleware"). They are back on disk as **untracked** files, byte-for-byte the same as `f801d8e^` (the last commit that contained them, which is also after `d5c5aab`). `d5c5aab` does contain them. **They were not missing, so nothing was restored.** The React components (`OfficeDesk`, `OfficeAuthShell`, `OfficePassword`, `OfficeRates`, `OfficeSpecials`) stayed in git. On current `main` they only differ from the pre-delete versions by the brand spelling TravelMORE.
2. **There is no `data/office.json` and no `data/rates.json`.** Sign-in uses `OFFICE_PASSWORD` from `.env.local` (plaintext env compare, not a stored scrypt hash). Planner rates fall through to the hardcoded rands in `src/lib/tripPlanner.ts` (`defaultRateTable()`).
3. **Trip requests are not emailed.** `POST /api/enquiries` only appends JSON. The office inbox is the only copy. On the static public site (`NEXT_PUBLIC_GITHUB_PAGES=true`) the form does not call the API at all: it opens a `mailto:` to `fransmari@travelmorebl.com`. Acceptance item 6 ("still emails the office") is new behaviour, not current behaviour.
4. **The public specials list does not read the office file in the browser.** `Packages` always fetches `/site-data/specials.json`. The office reads and writes `data/specials.json`. `deploy:domain` copies one onto the other at build time. Today those two files are **not** the same: same three ids, different order (data starts with Zanzibar, the public snapshot starts with Mauritius), and the byte sizes differ (1872 vs 1928). Local homepage specials follow the public snapshot. The trip planner on the static site uses `defaultRateTable()` and never calls `/api/rates`.
5. **Login chrome is a bit richer than the brief.** Left panel photo is `/images/leisure-pool.jpg`, headline "Your desk for trips, specials, and quotes.", teal pill button "Open the desk", "Forgot password?". Splash copy is "One moment / Loading your desk…". There is also a small logo loop video and an "Agent desk" eyebrow. The signed-in page heading is "Trip requests", not a separate desk title above the three blocks.
6. **Enquiry dates are shown with `toLocaleString("en-ZA")`**, which follows the browser, not a fixed `Africa/Johannesburg` zone.
7. **Rates are whole rands (0 to 500000), not cents.** Special prices are display strings such as `From R 28,000`, not money fields.
8. **Reset emails still say "Travel More"** in the subject and body (`src/app/api/office/forgot/route.ts`). The visible UI and the mailer From-name already say TravelMORE.
9. **Docker is not installed** on this machine (`docker` is not on PATH). There is no Postgres.
10. **Uncommitted local edits that this audit does not adopt:** `next.config.ts` adds `outputFileTracingIncludes` for the office data files; `.vercelignore` was rewritten. Left as they are. `tmp-cf-empty.yml` and an untracked `.github/` folder are also left alone.

## Routes and API handlers

Public pages (tracked): `/`, `/about`, `/destinations/[slug]`.

Office pages (untracked, present): 

| Route | File | Behaviour |
| --- | --- | --- |
| `/office` | `src/app/office/page.tsx` | Renders `OfficeDesk`. Title "Trip requests". `robots: noindex`. |
| `/office/reset` | `src/app/office/reset/page.tsx` | New-password form. Token in the query string. |

API (untracked, present). Session check is the HMAC cookie unless noted.

| Method | Path | Auth | What it does |
| --- | --- | --- | --- |
| POST | `/api/office/login` | Public, rate limit 5 / 15 min / IP | Checks password. Sets `tm_office`. |
| DELETE | `/api/office/login` | None | Clears the cookie. |
| POST | `/api/office/forgot` | Public, 3 / 15 min | Starts reset, emails `SITE.emails`, or logs the link in dev if SMTP is unset. |
| POST | `/api/office/reset` | Public, 10 / 15 min | New password, minimum 10 characters. Replaces `data/office.json` with scrypt hash + salt and drops the reset fields. |
| GET | `/api/enquiries` | Cookie | Lists `data/enquiries.json`. |
| POST | `/api/enquiries` | Public, 5 / 10 min | Validates and prepends an enquiry. No email. Caps the file at 2000 rows. |
| PATCH | `/api/enquiries/[id]` | Cookie | Status `new` or `contacted` only. |
| GET | `/api/specials` | **Public** | Lists `data/specials.json`. `Cache-Control: no-store`. |
| POST | `/api/specials` | Cookie | Add a special, or reorder when the body is `{ ids: string[] }`. |
| PATCH | `/api/specials/[id]` | Cookie | Replace a special. Deletes the previous uploaded image if the path changed. |
| DELETE | `/api/specials/[id]` | Cookie | Remove the special and its uploaded image. |
| POST | `/api/specials/upload` | Cookie | JPG, PNG, or WebP, max 8 MB, saved as `public/specials/<uuid>.<ext>`. Returns `{ image: "/specials/<file>" }`. |
| GET | `/api/rates` | **Public** | Reads `data/rates.json` or the hardcoded defaults. |
| PUT | `/api/rates` | Cookie | Replaces the whole rate table. |

Middleware matcher is only those office and API paths. When the back office is off, `/office` redirects to `/`, and the mutating API routes return 404 JSON. GET `/api/specials` and GET `/api/rates` still pass through when the flag is off, because the matcher runs but the handler returns `next()` for GET. On the static export the routes do not exist at all.

`src/lib/rateLimit.ts` is an in-memory map. It is per process, not shared, and it resets on restart.

## Components

| Component | Role |
| --- | --- |
| `OfficeDesk` | Splash, login, recovery, then the one-page desk. |
| `OfficeAuthShell` | Split layout, photo panel, shared input and primary button classes (`officeInputClass`). |
| `OfficePassword` | `PasswordRecovery`. Shows the TravelMORE inboxes from `SITE.emails`. No address field. |
| `OfficeSpecials` | List with Up, Down, Edit, Remove. Form fields: Destination, Name, Price, Price detail (`priceNote`), Flights, Small label (`badge`), Picture upload, Included (textarea, one line each, max 8). Optional video path, not shown as a main label in the brief but present on the draft. |
| `OfficeRates` | Mauritius, Zanzibar, Seychelles, Maldives, Europe. Comfort, Premium, Ultra luxury per person per night, plus Flights or transfers per person. "Save estimates". |
| `TripEnquiry` | Destination-page form. Fields match `Enquiry`. |
| `Packages` | Public specials from `/site-data/specials.json`. |
| `TripPlanner` | Public planner. Fetches `/api/rates` unless it is the static site, then uses defaults. |

## Auth flow

1. Desk loads and `GET /api/enquiries`. 401 means signed out.
2. User types a password. No email, no username.
3. `passwordMatches`: if `data/office.json` has `hash` and `salt`, scrypt the attempt (timing-safe). Otherwise compare to `OFFICE_PASSWORD` with a length check and `timingSafeEqual`.
4. Cookie value is derived from the secret, so every successful login gets the **same** token until the password changes. There is no session row, no user id, no role, no inactivity timeout, and logout is only "delete the cookie". Knowing the HMAC (or the password) is enough. `officeToken()` uses the hash string, or the raw env password, as the HMAC key.
5. Forgot password always emails the agency inboxes in `src/lib/constants.ts` (`fransmari@travelmorebl.com`). It does not ask for an address. If SMTP is missing in development it still returns success and prints the link on the server. A finished reset **writes** `data/office.json` and from then on ignores `OFFICE_PASSWORD`.

## Data files and shapes

`/data` is gitignored. Do not commit it.

### `data/enquiries.json`

Exists. Currently `[]` (zero trip requests).

```ts
{
  id: string;            // uuid
  createdAt: string;     // ISO UTC
  destination: string;
  month: string;         // January–December or "Not sure yet"
  year: string;          // this year through +3, except the form only offers +2
  flexible: boolean;
  adults: number;        // 1–20
  children: number;      // 0–12
  nights: string;        // "5 nights" | "7 nights" | "10 nights" | "14 nights" | "Not sure yet"
  trip: string;          // Holiday | Honeymoon | Family | Business | "Not sure yet"
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: "new" | "contacted";
}
```

### `data/specials.json`

Exists. **3** specials, in this order: Zanzibar week on the north coast; Mauritius 7 night resort; Maldives lagoon stay. Prices are display strings (`From R 28,000`, `From R 33,500`, `From R 56,500`). Images currently point at `/images/destinations/...`, not `/specials/...`.

```ts
{
  id: string;
  destination: string;
  name: string;
  badge: string;       // "Small label" in the form
  price: string;
  priceNote: string;   // "Price detail"
  flights: string;
  included: string[];  // max 8
  image: string;       // must start with "/" and must not contain ".."
  alt: string;
  video: string;       // empty or a "/...mp4" path
}
```

### `data/rates.json`

**Missing.** Effective table is `defaultRateTable()` in `src/lib/tripPlanner.ts`: per destination, `nightlyRate.comfort | premium | luxury` and `transportCost`, whole rands. Defaults include Mauritius comfort 3400 / premium 5400 / luxury 9800 and transport 9500. The other four destinations have their own defaults in the same file.

### `data/office.json`

**Missing.** Expected shape when a reset has been completed:

```ts
{
  hash?: string;          // scrypt hex
  salt?: string;          // hex
  resetHash?: string;
  resetExpires?: number;  // epoch ms
  resetIssuedAt?: number;
}
```

### Pictures

`public/specials/` is the upload folder (created on first upload). `removeUploadedImage` only deletes paths that start with `/specials/`. Destination images under `/images/` are left alone.

### Public snapshot

`public/site-data/specials.json` is the file the homepage reads. It is not the office source of truth.

## Styling to reuse

There is no shared component library. Copy these patterns:

- Page: `bg-sand-100` (already on `body`), content `mx-auto max-w-5xl px-5 py-12`.
- Cards: `border border-sand-300 bg-white px-6 py-6`.
- Eyebrow: `text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#1a7d76]`. The office often uses the raw teal `#1a7d76` / `#1a9aab` rather than `teal-500`.
- Headings: `font-display text-4xl font-semibold text-navy-900`.
- Field labels: `text-xs uppercase tracking-[0.14em] text-navy-800/50` on the desk; form labels are `text-sm font-medium text-navy-900`.
- Inputs: `officeInputClass` in `OfficeAuthShell` (rounded-xl, sand border, white, teal focus ring). Rate inputs are plainer beige/white rectangles.
- Primary button: pill, gradient `#1a7d76` to `#1a9aab`, white text.
- Secondary: white or transparent, `border border-navy-900/15`, navy text.
- Errors: `bg-red-50 text-red-800`. Notices: pale teal wash.
- Status text is tiny uppercase tracking, teal, not a pill yet.

Login is the exception: rounded-3xl glass card, photo panel, not the narrow desk column. Keep that screen. The new app shell is only for the signed-in desk.

## What is broken or thin

- Office route files are untracked. A clean checkout of `main` has no `/office` and no API. The first implementation commit must add these files unchanged, or the branch cannot build the desk.
- Empty enquiry file, no rates file, no scrypt hash on disk. Seed must accept `OFFICE_PASSWORD` plus `OFFICE_OWNER_EMAIL`.
- Public specials and office specials can drift, as they have.
- No server-side role checks. Any valid cookie can mutate specials, rates, and enquiry status.
- GET specials and GET rates are public. That is fine for the planner and a future public read, and it must stay available to the public site.
- CSP (`next.config.ts`) is `connect-src 'self'`, `form-action 'self'`, and `Permissions-Policy: payment=()`. Paystack's server-side initialise can stay same-origin. A PayFast browser form post will need `form-action` updated. Redirect checkout does not need `payment=()` (that is the Payment Request API).
- In-memory rate limit will not hold across restarts or more than one Node process.
- No tests.

## Assumptions for the build (after go-ahead)

1. **Database.** Prisma, not Drizzle. Docker is not installed, so local dev uses **SQLite** (`DATABASE_URL=file:./data/office.db`, gitignored) as the brief allows. The schema stays Postgres-compatible: no SQLite-only types, money as integers, booleans as booleans. `docs/DEPLOY_DROPLET.md` will say the Droplet uses PostgreSQL and that the Prisma provider is switched to `postgresql` there, with a fresh migration. If you install Docker before saying go, Step 1 will use Postgres only and skip SQLite.
2. **First commit of code** adds the current untracked office, API, and middleware with no behaviour change, then builds on that.
3. **JSON migration** imports enquiries (0 today), specials (3, keep ids and order), and rates. Missing `rates.json` imports `defaultRateTable()` so the planner does not change. JSON files stay on disk untouched.
4. **Public reads after migration.** Homepage specials and the planner keep today's content. The app will write the same `public/site-data/specials.json` shape when specials are saved, and the planner will keep receiving the same rand numbers (stored as cents, divided by 100 at the edge). Static `deploy:domain` keeps copying `data/specials.json` if we still mirror a JSON file for the export; the export has no database. **Assumption:** the GitHub Pages build continues to publish a JSON snapshot, generated from the database by `migrate`/`export` during `github-pages.mjs`, falling back to the existing `data/specials.json` when no database is present, so `deploy:domain` still builds on a machine without Postgres or SQLite data.
5. **Owner seed.** If `data/office.json` has `hash` and `salt`, copy them. It does not, so the seed scrypts `OFFICE_PASSWORD` (minimum 10 characters) and sets the email from `OFFICE_OWNER_EMAIL`. Suggested value: `fransmari@travelmorebl.com`. Name: Fransmari, overridable with `OFFICE_OWNER_NAME`.
6. **Enquiry email.** Adding an office email on new leads is in scope for Step 4, using the existing mailer and `SITE.emails`. The static site keeps the mailto fallback. SMTP failure must not lose the lead.
7. **Existing specials picture URLs** (`/images/destinations/...` and `/specials/...`) keep working. New client documents go to `STORAGE_DIR` (default `data/uploads`) and are not under `public/`.
8. **Company settings** replace `SITE` only on generated documents (quotes, invoices, PDFs). The public website keeps `src/lib/constants.ts` until you say otherwise. Seed settings from those constants.
9. **Numbers.** Prefixes default to `TMQ`, `TMB`, `TMI` plus the year plus a 3-digit sequence, from company settings.
10. **VAT** defaults off. Commission is TTV minus supplier cost, in cents, on the server.
11. **Accept-twice** is a unique constraint on the quote's booking, inside one transaction.
12. **Payments** stay behind `PAYMENTS_ENABLED=false`. No live keys. Test adapters only.
13. **Staff invite** emails a set-password link in the same style as the reset email.
14. **Dirty `next.config.ts` / `.vercelignore`** are not part of this branch unless a later step must touch CSP for PayFast. I will not revert or commit them blindly.
15. **Beachcomber and the travel insurance form** are listed as later tasks only.

## Plan once you say go

Work stays on `feature/office-phase-3a`. Small commits. No push, no deploy.

1. **Foundations.** Commit the current office source as-is. Add Prisma (SQLite locally, Postgres-compatible schema), `docker-compose.yml` documented for when Docker exists, migrations, seed, `src/lib/storage.ts` (disk driver), `npm run migrate:json`, users, sessions, password reset, audit log, company settings. Move specials upload through storage while old URLs still resolve. Office and public reads switch to the database behind the same API shapes.
2. **Shell.** Sidebar (navy-950, cream text, teal active, logo), mobile slide-in, routes listed in the brief. Specials and planner estimates move under `/office/website` with the same forms. Middleware matcher grows to every new office, API, and public token route, still gated by `BACK_OFFICE_ENABLED`.
3. **Models** as specified, plus the business rules (VAT, commission, numbering, quote lock and revision, expiry route with `CRON_SECRET`).
4. **Features.** Leads pipeline, clients, suppliers, quote builder, `/q/[token]`, accept transaction, invoices, `/i/[token]`, itineraries, `/t/[token]`, bookings, expenses, monthly report, dashboard.
5. **Payments.** `PaymentGateway` with Paystack and PayFast test adapters, webhooks, idempotency.
6. **PDFs and email.** `@react-pdf/renderer` and the existing mailer.
7. **POPIA.** Consent on the destination form and quote page, privacy page, export and anonymise, audit views, role checks, rate limits, inactivity timeout.
8. **Fit and tests.** 360px layout, Vitest for money, VAT, commission, numbering, accept, signatures, roles, and JSON migration. Playwright only if the rest is green.
9. **Docs.** README, `.env.example`, `docs/DEPLOY_DROPLET.md`. Update `scripts/github-pages.mjs` so the static build also stashes new server-only folders and the public `/q`, `/i`, and `/t` pages. Run `npm run deploy:domain` as a build only.

## Env vars to expect (no real values)

Already used: `BACK_OFFICE_ENABLED`, `OFFICE_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `SITE_URL`, `GITHUB_PAGES`, `GITHUB_PAGES_ROOT`, `NEXT_PUBLIC_GITHUB_PAGES`, `NEXT_PUBLIC_BASE_PATH`.

New: `DATABASE_URL`, `OFFICE_OWNER_EMAIL`, `OFFICE_OWNER_NAME`, `STORAGE_DIR`, `CRON_SECRET`, `PAYMENTS_ENABLED`, `PAYMENT_GATEWAY`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`, `PAYFAST_SANDBOX`, `PUBLIC_BASE_URL`.

## Waiting

No Step 1 work until you reply. Say go (and whether to install Docker for Postgres, or accept the SQLite fallback).
