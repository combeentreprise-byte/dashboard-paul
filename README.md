# Dashboard

Statistics dashboard. Current focus: pulling bill/invoice PDFs from a Google
Drive folder, extracting structured data, and storing it in Supabase Postgres
via Prisma.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` / `DIRECT_URL`
   from your Supabase project (Project Settings → Database).
3. `npx prisma migrate dev` to create/update tables in Supabase.
4. `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Structure

- `app/page.tsx` — the dashboard (Server Component, reads from the DB)
- `prisma/schema.prisma` — `Bill` and `Product` models (bills and their line items, linked by `billId`)
- `lib/db/prisma.ts` — Prisma client singleton

Google Drive sync + PDF extraction is not yet built.
