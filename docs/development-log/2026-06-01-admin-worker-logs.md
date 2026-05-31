# 2026-06-01 — Admin Worker Logs Page

## Task Context

The user wanted a Logs page for operational monitoring, especially to see whether the custom Next server booking expiry worker is running and what it is doing without relying only on terminal output.

## Implementation Summary

### Persistent Local Logs

Added local server-side app log utilities:

- `lib/app-logs.ts` for typed server-side reads from the Next app.
- `lib/app-logs.mjs` for the custom Node server runtime.

Logs are stored as append-only JSONL entries in `.app-logs/worker.jsonl`, which is ignored by git. Each entry contains:

- `timestamp`
- `source`
- `level`
- `message`
- optional safe `meta`

The log writer stores operational metadata only and must not write Supabase keys, service role keys, or environment values.

### Booking Worker Logging

Updated `server.mjs` so the booking expiry worker still logs to terminal while also persisting key events for the UI:

- worker started
- expiry check started
- expiry check completed
- RPC failed
- Supabase env missing
- previous tick skipped because another check is still running
- worker crash

The per-second terminal countdown remains terminal-only to avoid filling the persisted log file with noisy entries.

### Admin Logs Page

Created `app/admin/logs/page.tsx`:

- Dynamic server component using `connection()`.
- Reads the latest 100 log entries from `lib/app-logs.ts`.
- Uses `app/admin/logs/LiveLogsPanel.tsx` to poll `/api/logs` every 2 seconds for a more real-time monitoring view.
- Shows summary cards for latest worker activity, latest successful check, and latest error.
- Renders mobile cards and a desktop table following the neobrutalist admin UI style.
- Uses an empty state when no logs exist yet.

### Navigation

Updated `components/AppSidebar.tsx` with a Logs navigation item pointing to `/admin/logs`.

## Validation

Run:

- `npx tsc --noEmit`
- `npm run lint`

Manual check:

1. Start the custom server with `npm run dev`.
2. Confirm terminal still shows the worker countdown.
3. Open `/admin/logs`.
4. Confirm worker startup/check/completion/error events appear.
5. Wait for the worker interval and confirm the page updates automatically within about 2 seconds after new persisted events appear.
6. Confirm no Supabase service role key or environment secret is displayed or written.
