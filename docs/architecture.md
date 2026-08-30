# EduLedger — Architecture

## Overview

EduLedger is split into three independently deployable pieces:

```
client/    React + Vite SPA (Tailwind CSS, TanStack Query, Zustand, React Hook Form + Zod)
server/    Express API (also runs standalone for local development)
database/  MySQL schema (migrations) and demo seed data
```

## Deployment shape

Netlify cannot host a persistent Node process or a database, so:

- `client/` builds to static assets served by Netlify.
- `server/src/app.js` (a plain Express app, no `listen()` call) is wrapped by
  `netlify/functions/api.js` via `serverless-http` and deployed as a Netlify Function.
- The MySQL database is hosted on a managed provider (Aiven MySQL free tier, or
  Railway — decided during Phase 7) reachable from Netlify's serverless runtime over TLS.
- `netlify.toml` redirects `/api/*` to the function and serves the SPA for all other routes.

Locally, `server/src/server.js` runs the same `app.js` as a normal long-lived process on
port 4000, and Vite proxies `/api` to it — so the API code path is identical in dev and prod.

## Auth

JWT stored in an `httpOnly`, `sameSite=lax` cookie (`eduledger_token`), verified on every
protected request by `requireAuth` middleware. Role checks (`requireRole`) run at the API
layer, not just in the UI router — the client's route guards are a UX convenience, not the
authorization boundary.

## Layout system

Two shells share the same design tokens (`client/src/index.css`):

- `AppShell` — dense sidebar layout for admin/staff/teacher workspaces.
- `PortalShell` — a warmer, rounded, top-nav layout for the parent/student portal and the
  login screen, using the `portal-*` accent tokens as a mood reference (not a cloned template).
