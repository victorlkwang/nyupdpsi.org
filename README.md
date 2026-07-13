# NYU Pi Delta Psi — Zeta Chapter

The website for the Zeta Chapter of Pi Delta Psi Fraternity, Inc. at New York
University. Public chapter pages plus a members' area and an admin console for
managing the roster, rush, and messaging.

Built with **Next.js 16** (App Router, React 19), **Prisma 7** on **PostgreSQL**,
**Tailwind CSS 4**, and **Resend** for email.

---

## Features

### Public
- **Home / About** — chapter intro and story.
- **Active House** and **Alumni** — brother rosters rendered from the database,
  grouped by pledge class. The Alumni page tucks the 40+ oldest classes into a
  single **"Bones & Fossils"** dropdown so the tab bar stays readable.
- **Rush** — the interest form, or, when an admin flips the switch, an
  **attendance sign-in sheet** for one of six rush events. The hero and rush
  archive stay the same; only the form swaps.

### Accounts & members
- Email/password auth with email verification and password reset (Resend).
- **Directory** (any signed-in user) — searchable list of every brother, with a
  clickable **lineage** view (ancestry of bigs + a tree of littles) and CSV export.

### Admin console (`/admin`)
- **Roster** — add/edit brothers and pledge classes, upload photos, set
  big/little links (littles derive automatically), and **graduate** a brother or
  a whole class from Active → Alumni.
- **Rush messages** — customize the automatic thank-you email and the follow-up
  email, with `{{firstName}}` / `{{name}}` placeholders.
- **Rush attendance** — switch what the public `/rush` form shows (interest form
  or an event sheet) and view a rushee × event attendance matrix with CSV export.
- **Applications** (bros + admins) — one unified list of rushees (interest-form
  submissions **and** event attendees), with per-row **archive** / **delete**,
  bulk **follow-up email** to selected rushees, and CSV export.
- **Members & roles** — promote users to `BRO` / `ADMIN`.

### How rush data ties together
A rushee is identified by **(NYU email, term)**. Interest-form submissions and
event check-ins both live on one `RushApplication` row: checking in at an event
before ever filling the interest form still creates a row (application fields
left blank), and filling the interest form later fills that same row in. NYU
emails are normalized to `netid@nyu.edu` (a bare netid is accepted) and phone
numbers to canonical digits, so the same person is always matched.

---

## Tech stack

| Area      | Choice                                             |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript      |
| Styling   | Tailwind CSS 4                                      |
| Database  | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`)      |
| Images    | `sharp` — uploads are resized and re-encoded to WebP |
| Email     | Resend                                             |
| Auth      | Custom sessions (bcrypt passwords, hashed tokens)  |

---

## Local development

**Prerequisites:** Node.js 22+ and Docker (for local Postgres).

```bash
# 1. Install dependencies
npm install

# 2. Start a local Postgres
docker compose up -d

# 3. Configure the environment
cp .env.example .env
#    The default DATABASE_URL already matches docker-compose.
#    Set ADMIN_EMAILS to your email to bootstrap the first admin.

# 4. Apply migrations and seed the roster
npm run db:migrate
npm run db:seed

# 5. Run the dev server
npm run dev        # http://localhost:3000
```

Create your account at `/signup` with the email you listed in `ADMIN_EMAILS`;
it becomes an admin automatically. Verify it via the link printed to the server
log (emails are logged, not sent, when `RESEND_API_KEY` is unset).

### Useful scripts

| Script                  | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Dev server                                     |
| `npm run build`         | Production build                               |
| `npm run start`         | `prisma migrate deploy` then start the server  |
| `npm run lint`          | ESLint                                         |
| `npm run db:migrate`    | Create + apply a dev migration                 |
| `npm run db:deploy`     | Apply pending migrations (production)          |
| `npm run db:seed`       | Seed pledge classes + brothers from the roster |
| `npm run db:studio`     | Prisma Studio                                  |

---

## Database

Schema and migrations live in `prisma/`. The roster seed data
(`prisma/seed-data/roster.json`) was generated from the historical chapter
spreadsheet by `scripts/build-roster-json.py`; `prisma/seed.ts` loads it and is
idempotent (safe to re-run).

Pending migrations are applied automatically on boot (the `start` script runs
`prisma migrate deploy`), so schema changes ship without a manual step. The
one-time roster seed (`npm run db:seed`) is still run by hand.

Uploaded brother photos are stored **in the database** (as WebP bytes) and
served from `/api/brothers/[id]/photo`, because the app container's filesystem is
ephemeral. A new upload replaces the previous photo.

---

## Deployment (DigitalOcean)

The app runs as a standard Node service against DigitalOcean Managed Postgres.

1. Set the environment variables below in the app settings.
2. Deploy — migrations apply on start automatically.
3. Run the roster seed **once**: `npm run db:seed` (in the app console, or from
   your machine with the production `DATABASE_URL`).

TLS to Managed Postgres is handled in `lib/prisma.ts`; provide
`DATABASE_CA_CERT` to verify the server certificate.

### Environment variables

| Variable            | Required | Notes                                                        |
| ------------------- | -------- | ------------------------------------------------------------ |
| `DATABASE_URL`      | yes      | Postgres connection string.                                  |
| `DATABASE_CA_CERT`  | prod     | DigitalOcean CA cert; verifies the DB TLS certificate.       |
| `APP_URL`           | yes      | Base URL for links in emails (e.g. `https://nyupdpsi.org`).  |
| `ADMIN_EMAILS`      | yes      | Comma-separated emails auto-granted `ADMIN` on signup.       |
| `RESEND_API_KEY`    | prod     | Enables email. Unset = emails are logged to the console.     |
| `EMAIL_FROM`        | prod     | Sender address on a Resend-verified domain.                  |

> **Email note:** the rush thank-you and follow-up are sent to a rushee's
> personal **and** NYU email, so each submission is two sends — mind your Resend
> plan's daily/rate limits during a busy rush.

---

## Security

Authentication and data handling follow standard practices:

- **Passwords** are hashed with **bcrypt** (cost 12); plaintext is never stored.
- **Sessions** use a 256-bit random token. Only its **SHA-256 hash** is stored in
  the database — the raw token lives solely in the user's cookie — so a database
  dump can't be used to impersonate anyone. Session cookies are `httpOnly`,
  `secure` in production, and `sameSite=lax`, with server-side expiry.
- **Email-verification and password-reset tokens** are single-use, stored only as
  hashes, and time-limited (resets expire after 1 hour).
- **No account enumeration**: login and password-reset return the same response
  whether or not the email exists.
- **Authorization** is enforced server-side on every protected route and API
  handler via role checks (`RANDO` / `BRO` / `ADMIN`) — not just hidden UI.
- **Input validation** with Zod on every endpoint; **Prisma** parameterizes all
  queries (no string-built SQL). React escapes rendered output, and email bodies
  are HTML-escaped.
- **Secrets** stay in environment variables (never committed); public forms carry
  a honeypot; database connections use TLS with optional CA verification.

## Testing & CI

Unit tests (Vitest) cover the pure logic — email/phone normalization, message
template substitution, and event mappings:

```bash
npm run test
```

GitHub Actions runs **lint → typecheck → test → build** on every pull request.

## Project layout

```
app/                Next.js routes (pages + API handlers)
components/          React components (public + admin)
lib/                 auth, prisma, email, roster, messaging, normalization
data/                static content (rush copy, term archive)
prisma/              schema, migrations, seed + seed data
public/images/       brother/alumni/rush imagery
scripts/             roster-json generator, image optimizer
```
