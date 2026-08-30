# EduLedger

School & Academy Management, organized.

A serious, production-shaped school/academy management system: role-based portals for
admins, staff, teachers, parents, and students, backed by a properly normalized MySQL
schema — not a demo dashboard with fake charts.

> **Status:** Phase 1 — Foundation. Auth, routing, and the database schema are in place;
> student/teacher/course management and beyond land in later phases (see Roadmap).

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
- Demo seed data (clearly labeled `[DEMO]` — see [`database/seed/seed.sql`](database/seed/seed.sql))

**Planned**
- Student, teacher, course, and class management (Phase 2)
- Attendance, exams, marks, and printable report cards (Phase 3)
- Fees, payments, and outstanding-balance reporting (Phase 4)
- Full parent/student portals (Phase 5)
- Accessibility/responsive polish pass (Phase 6)
- Production deployment to Netlify (frontend + Functions) with a hosted MySQL database (Phase 7)

**Demo / placeholder**
- All seed data (students, teachers, parents, fees) is fictional and prefixed `DEMO`/`[DEMO]`
- Demo login accounts all share the password `Demo@12345` — see seed file for emails

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown. In short:

```
client/    React + Vite SPA → deployed to Netlify as static assets
server/    Express API      → deployed as a Netlify Function (serverless-http)
database/  MySQL schema + seed → hosted on a managed MySQL provider
```

## Tech stack

- **Frontend:** React, Vite, React Router, Tailwind CSS, TanStack Query, Zustand,
  React Hook Form + Zod, Recharts
- **Backend:** Node.js, Express, mysql2, JWT (jsonwebtoken), bcrypt
- **Database:** MySQL 8
- **Deployment:** Netlify (frontend + serverless functions), managed MySQL host

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
├── server/            Express API
├── netlify/functions/ Serverless wrapper around the Express app
├── database/
│   ├── migrations/    Schema (001_init.sql)
│   └── seed/          Demo seed data
├── docs/              Architecture & schema documentation
├── netlify.toml
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
mysql -u <user> -p <database> < database/migrations/001_init.sql
mysql -u <user> -p <database> < database/seed/seed.sql   # optional demo data
```

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

Frontend + API deploy together to Netlify (see `netlify.toml`); the database is hosted
separately on a managed MySQL provider. Full deployment steps land in Phase 7.

**Live demo URL:** _not yet deployed — added here once Phase 7 is complete._

## Screenshots

_Added once the UI has enough real screens to be worth screenshotting (Phase 2+)._

## Future roadmap

See the Planned section above and `docs/architecture.md`. Phases are tracked in the
original project brief; this README's Implemented/Planned split is the current source of truth.
