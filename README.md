# EduLedger

School & Academy Management, organized.

A serious, production-shaped school/academy management system: role-based portals for
admins, staff, teachers, parents, and students, backed by a properly normalized MySQL
schema — not a demo dashboard with fake charts.

> **Status:** Live. All 7 phases are complete — full feature set, security review, and
> production deployment. **[eduledger-ebon.vercel.app](https://eduledger-ebon.vercel.app)**

## Overview

EduLedger models a real academic institution: students enrolled in classes (a course
taught to a section by a teacher in an academic year), attendance taken per class per day,
exams and marks tied to classes, and fees/payments tracked per student. Parents can be
linked to more than one student, and students can have more than one guardian.

## Features

**Implemented**
- Email/password authentication with an `httpOnly` JWT cookie
- Role-based route protection on the client (admin, staff, teacher, parent, student) and
  role checks enforced server-side (`requireAuth` / `requireRole` middleware)
- Base app shells: a dense sidebar layout for staff-facing tools, a warmer portal layout
  for parents/students
- Full relational MySQL schema with foreign keys, unique constraints, and check constraints
  (see [`docs/database-schema.md`](docs/database-schema.md))
- Demo seed data (clearly labeled `DEMO-` / `@eduledger.test` — see [`database/seed/seed.sql`](database/seed/seed.sql))
- Student management: register, edit, search, filter by section/status, archive/reactivate,
  a profile view with guardians and enrolled classes
- Teacher management: add, edit, search, filter by department, archive/reactivate, a profile
  view listing their assigned classes
- Course management: add, edit, search, filter by department, archive/reactivate
- Class management: schedule a course to a section/academic year/teacher with a time slot,
  edit, archive/reactivate, a roster view per class
- Enrollment: enroll a student into a class from their profile, drop an enrollment; duplicate
  active enrollment is rejected both by the database's unique constraint and the API (409)
- Admin dashboard with live counts (active students/teachers/classes)
- Attendance: mark present/absent/late/excused per class per day, one record per
  student/class/day enforced by the database; role-scoped so teachers can only mark
  attendance for classes they teach (`assertCanManageClass`)
- Exams: create per class with a name/date/max marks; marks entry validates against
  the exam's max marks and auto-computes a letter grade server-side
- Printable report card per student (per academic year): marks by subject, attendance
  summary, and an overall pass/fail result — uses the browser's native print dialog
  ("Print / Save as PDF"), no PDF library needed
- Fees: create a fee for a student (type, academic year, amount, due date); status
  (pending/partially paid/paid/overdue) is derived from payments and due date, not
  hand-maintained — "overdue" is computed at read time so it never goes stale
- Payments: record a payment against a fee (amount, date, method, reference); the API
  rejects any payment that would exceed the fee's remaining balance (`400`); all
  monetary columns use `DECIMAL(10,2)`, never floating point
- Fee summary (total billed / collected / outstanding) on the Fees page and the admin
  dashboard, plus a per-student fee snapshot on the student profile
- Parent and student portals: overview (classes, attendance summary, fee status),
  attendance history, marks/report card, and fee/payment history — all self-scoped.
  A parent with multiple children gets a child selector; every underlying endpoint
  re-verifies ownership server-side (`assertCanViewStudent`), not just the UI — a parent
  or student cannot reach another family's data by guessing an ID in the URL or API
- Responsive layouts: the admin/staff/teacher sidebar collapses into a hamburger-triggered
  drawer below `md`; the parent/student portal nav becomes a fixed bottom tab bar on mobile
  instead of overflowing; every data table scrolls horizontally instead of breaking
- Keyboard support: modals trap `Tab` focus, auto-focus their first field on open, and
  close on `Escape`; focus-visible outlines are defined globally, not just on a few elements
- `prefers-reduced-motion` is respected — all transitions/animations collapse to near-zero
  duration for users who've asked for reduced motion at the OS level
- Route-level code splitting via `React.lazy` — each page ships as its own chunk instead of
  one large bundle, resolving the "chunk larger than 500kB" build warning from earlier phases

**Planned**
- Nothing — see the Deployment section below for live-deploy status

**Demo / placeholder**
- All seed data (students, teachers, parents, fees) is fictional and prefixed `DEMO`/`[DEMO]`
- Demo login accounts all share the password `Demo@12345` — see seed file for emails

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown. In short:

```
client/    React + Vite SPA → deployed to Vercel as static assets
server/    Express API      → deployed as a Vercel Function (api/index.mjs)
database/  MySQL schema + seed → hosted on Aiven, connected over verified TLS
```

## Tech stack

- **Frontend:** React, Vite, React Router, Tailwind CSS, TanStack Query, Zustand,
  React Hook Form + Zod, Recharts
- **Backend:** Node.js, Express, mysql2, JWT (jsonwebtoken), bcrypt, helmet,
  express-rate-limit
- **Database:** MySQL 8 (hosted on Aiven)
- **Deployment:** Vercel (frontend + serverless function)

## Database architecture

See [`docs/database-schema.md`](docs/database-schema.md) for the entity list, relationships,
and notable constraints. Schema source of truth: [`database/migrations/001_init.sql`](database/migrations/001_init.sql).

## Roles & permissions

| Role | Access |
|---|---|
| Admin | Full system access |
| Staff | Student registration, attendance, fees (scoped by future permission rules) |
| Teacher | Their own classes: attendance, exams, marks |
| Parent | Their own linked children only |
| Student | Their own records only |

Authorization is enforced at the API layer, not just by hiding UI — see `server/src/middleware/auth.js`.

## Project structure

```
eduledger/
├── client/            React + Vite frontend
├── server/            Express API (also runs standalone for local dev)
├── api/index.mjs      Vercel Function entry point — exports the Express app directly
├── database/
│   ├── migrations/    Schema (001_init.sql)
│   └── seed/          Demo seed data
├── docs/              Architecture & schema documentation
├── vercel.json
└── .env.example
```

## Environment variables

Copy `.env.example` to `server/.env` for local development (see comments in the file for
what each variable is for). Never commit a real `.env` — `DB_PASSWORD` and `JWT_SECRET`
must stay out of source control and out of the frontend bundle entirely.

## Installation

```bash
git clone https://github.com/fazal305/eduledger.git
cd eduledger
npm install --prefix client
npm install --prefix server
cp .env.example server/.env   # then fill in real DB_* and JWT_SECRET values
```

## Database setup

```bash
mysql -u <user> -p -e "CREATE DATABASE eduledger CHARACTER SET utf8mb4;"
mysql -u <user> -p eduledger < database/migrations/001_init.sql
mysql -u <user> -p eduledger < database/seed/seed.sql   # optional demo data
```

Demo login accounts (after seeding): `admin@eduledger.test`, `staff@eduledger.test`,
`teacher@eduledger.test`, `parent@eduledger.test`, `student@eduledger.test` — all share the
password `Demo@12345`.

## Development

```bash
npm run dev:server   # Express API on http://localhost:4000
npm run dev:client   # Vite dev server on http://localhost:5173 (proxies /api to :4000)
```

## Production build

```bash
npm run build:client
```

## Deployment

Frontend + API deploy together to Vercel (see `vercel.json`); the database is hosted
separately on Aiven MySQL, connected over TLS with the connection verified against
Aiven's CA certificate (not just encrypted-but-unverified).

Demo login accounts are the same ones listed under Database Setup above — the live
deployment runs against the same seeded data.

**Live demo URL:** https://eduledger-ebon.vercel.app

## Screenshots

_Added once the UI has enough real screens to be worth screenshotting (Phase 2+)._

## Future roadmap

See the Planned section above and `docs/architecture.md`. Phases are tracked in the
original project brief; this README's Implemented/Planned split is the current source of truth.
