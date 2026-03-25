# DevOps handoff — deployment stack

This document lists **what to use** to run the project in production. It does **not** include deployment procedures; your team wires these services according to your standards.

## Applications

| Part | Path | Role |
|------|------|------|
| **CMS (Payload + Next.js)** | `cms/` | Admin UI, REST API, content & reservation storage |
| **Travel site (Vite + React + Express API routes)** | `agency-travel/` | Public frontend, server routes for forms |

## Hosting

| Tool | Use |
|------|-----|
| **[Vercel](https://vercel.com)** | Host the CMS and/or the travel site (both projects can be separate Vercel projects). |

## Data & media

| Tool | Use |
|------|-----|
| **[MongoDB Atlas](https://www.mongodb.com/atlas)** | Production database. Set `MONGODB_URI` in the CMS environment to the Atlas connection string. |
| **[Cloudinary](https://cloudinary.com)** (optional but supported) | Media uploads from the CMS. Configure `CLOUDINARY_*` variables in the CMS environment — see `cms/.env.example`. |

## Email (forms)

| Tool | Use |
|------|-----|
| **[Resend](https://resend.com)** | Transactional email for contact / trip / reservation flows. Configure in the **travel site** environment — see `agency-travel/.env.example` (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `TRIP_RECIPIENT_EMAIL`). |

## Credentials & secrets (do not commit)

- **CMS admin login** is managed inside Payload (users in the `users` collection). Create the first admin user through your chosen deployment process; do not put passwords in this repo.
- **API and server secrets** belong only in your host’s environment (e.g. Vercel project settings) or a secrets manager.
- **Authoritative lists of variable names** are:
  - `cms/.env.example`
  - `agency-travel/.env.example`

Minimum expectations:

- **CMS:** `MONGODB_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` (public URL of the CMS), and any Cloudinary fields you use.
- **Travel site:** `VITE_CMS_URL` (public URL of the CMS API origin), Resend fields for email, and in production the server may use `CMS_URL` / `VITE_CMS_URL` for server-side calls to Payload (see `agency-travel/server/lib/reservation.ts`).

Cross-origin / CSRF: the CMS allows configurable frontend origins via env (see `cms/src/payload.config.ts` — e.g. `FRONTEND_URL`, `NEXT_PUBLIC_FRONTEND_URL`). Set these to your production site URL when deploying.

---

*Internal handoff only. Rotate any credentials that were ever shared in chat or tickets.*
