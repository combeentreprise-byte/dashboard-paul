# Revenue Dashboard

Statistics dashboard pulling data from Everbill (v1), with Odoo and Google Drive
planned as follow-up modules. Next.js app; a scheduled sync writes into Supabase
Postgres via Prisma, and the dashboard only ever reads from that database.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` / `DIRECT_URL` — from your Supabase project (Project Settings → Database)
   - `EVERBILL_API_URL` / `EVERBILL_API_KEY`
   - `CRON_SECRET` — any random string; also set it as a Vercel project env var so Vercel Cron authenticates
   - `DASHBOARD_PASSWORD` — the password required to view the dashboard
3. `npx prisma migrate dev --name init` to create the `Invoice` table in Supabase.
4. `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Syncing data

`GET /api/sync/everbill` (with header `Authorization: Bearer $CRON_SECRET`) pulls
every invoice from Everbill and upserts it into the database. In production,
Vercel Cron calls this automatically on the schedule in `vercel.json` and sends
that header for you once `CRON_SECRET` is set as a project env var. Trigger it
manually while developing:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/sync/everbill
```

## Structure

- `app/page.tsx` — the dashboard (Server Component, reads from the DB)
- `app/api/sync/everbill/route.ts` — the sync job
- `lib/everbill/` — Everbill API client + the sync logic that maps its
  responses into the `Invoice` table (field mapping is provisional until
  checked against real Everbill API docs/credentials)
- `lib/db/stats.ts` — query helpers the dashboard reads from
- `middleware.ts` + `app/login/` — single shared-password gate

## Deploying

Push to a Git repo, import into Vercel, set the same env vars there (plus
`CRON_SECRET`, which Vercel Cron then sends on the cron request automatically),
and Vercel Cron will pick up the schedule from `vercel.json`.
