# 2026-05-31 — Custom Next Server Booking Expiry Worker

## Task Context

The user wanted expired bookings to complete automatically while the Next.js server is running, without relying on an admin page refresh or client countdown state.

## Implementation Summary

### Custom Next Server

Created `server.mjs` as the production server entrypoint:

- Starts the Next.js request handler through Node's `http` server.
- Starts a background booking expiry worker when the server boots.
- Worker runs once immediately and then repeats every 30 seconds by default.
- Worker interval can be changed with `BOOKING_EXPIRY_WORKER_INTERVAL_MS`.
- Worker calls the database RPC `complete_expired_bookings()`.
- Worker sets Supabase client schema to `riztama_business`, matching the app client in `lib/supabase.ts`, so RPC calls do not fall back to the default `public` schema.
- Worker uses `SUPABASE_SERVICE_ROLE_KEY` if available, with fallback to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Worker has a running guard so overlapping executions are skipped.
- Worker logs visible terminal activity:
  - Startup schema and interval.
  - Per-second countdown until the next expiry check.
  - RPC check start and completion timestamps.
  - RPC errors if the DB function/schema is missing.

### Start Script

Updated `package.json`:

- `npm run dev` now runs `NODE_ENV=development node server.mjs` instead of `next dev`, so local development also uses the custom server and background expiry worker.
- `npm run start` now runs `NODE_ENV=production node server.mjs` instead of `next start`, so production also uses the custom server and background expiry worker.

Development should use `npm run dev`.
Production deployments should use `npm run build` followed by `npm run start` so the custom server and expiry worker are active.

### Database Function

Created migration:

- `supabase/migrations/20260531060000_automate_booking_completion.sql`

The function `riztama_business.complete_expired_bookings()` marks active `booked` subscriptions as `completed` when their `end_date` and `end_time` are past.

Existing booking/profile sync trigger then makes the assigned profile `available` when no active `booked` subscription remains.

## Validation

Run:

- `npx tsc --noEmit`
- `npm run lint`

Manual check:

1. Apply the migration in Supabase.
2. Start production server with `npm run start`.
3. Create or edit a booking with an end date/time within the next minute.
4. Wait for the worker interval to pass.
5. Confirm booking status becomes `completed`.
6. Confirm assigned profile becomes `available`.
