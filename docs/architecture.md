# EduLedger — Architecture

## Overview

EduLedger is split into three independently deployable pieces:

```
client/    React + Vite SPA (Tailwind CSS, TanStack Query, Zustand, React Hook Form + Zod)
server/    Express API (also runs standalone for local development)
database/  MySQL schema (migrations) and demo seed data
```

## Deployment shape

Vercel cannot host a persistent Node process or a database, so:

- `client/` builds to static assets, served by Vercel's CDN.
- `server/src/app.js` (a plain Express app, no `listen()` call) is exported directly from
  `api/index.mjs` as a Vercel Function — Express apps are callable as `(req, res)`, which is
  exactly the signature Vercel's Node runtime expects, so no adapter library is needed.
- `vercel.json` rewrites `/api/*` to that function and falls back to `/index.html` for every
  other path (client-side routing). The `/api/*` rewrite is declared *before* the catch-all
  SPA rewrite — Vercel evaluates rewrites in array order, so ordering here is load-bearing:
  swapping them would swallow every API call into the SPA fallback.
- The MySQL database is hosted on Aiven, reached over TLS with the connection verified
  against Aiven's project CA certificate (`server/src/certs/aiven-ca.pem`, committed — it's
  a public certificate, not a secret) rather than disabling certificate validation.

Locally, `server/src/server.js` runs the same `app.js` as a normal long-lived process on
port 4000, and Vite proxies `/api` to it — so the API code path is identical in dev and prod.

A note on `vercel.json`'s `installCommand`: Vercel's build environment sets
`NODE_ENV=production`, which makes plain `npm install` skip `devDependencies` — that
silently drops `vite` itself (a client devDependency) and breaks the build with
`vite: command not found`. The install command passes `--include=dev` for the client
install specifically to work around this.

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
