# 2026-05-31 — Bookings and Rental Packages

## Summary

Added the first booking/subscription transaction flow as a dedicated admin page.

## Changes

- Added append-only migration `20260531020000_add_rental_packages_subscriptions.sql`.
- Added `riztama_business.rental_packages` for reusable package options.
- Added `riztama_business.subscriptions` for booking rows linking customers, service accounts, profiles, and packages.
- Added package snapshots on subscriptions:
  - `package_name_snapshot`
  - `duration_days_snapshot`
  - `price_snapshot`
- Added booking statuses:
  - `booked`
  - `completed`
  - `cancelled`
  - `archived`
- Added rental package statuses:
  - `active`
  - `archived`
- Added TypeScript database types and status constants.
- Added `lib/subscriptions.ts` data/mutation layer.
- Added `lib/rental-packages.ts` package loader.
- Added `/admin/bookings` page with neobrutalist table, filters, and dialog actions.
- Added inline new-customer creation inside the booking dialog.
- Added package-driven default price and end-date calculation.
- Added Bookings nav item in the sidebar.
- Seeded spreadsheet package options in `supabase/seed.sql`:
  - `1 Hari` — 1 day — Rp 5.000
  - `2 Hari` — 2 days — Rp 7.000
  - `3 Hari` — 3 days — Rp 10.000
  - `1 Minggu` — 7 days — Rp 20.000
- Seeded spreadsheet buyers as active customers.
- Seeded 24 visible spreadsheet booking rows from the Risma, Jovan, and Tugeder tabs.
- Preserved income/laba/log-out values in booking notes because payment/profit tables do not exist yet.
- Added service account dropdown filtering to the Bookings list so users can view rows by Netflix account.
- Updated booking seed statuses so rows with finished dates are seeded as `completed`; still-running rows remain `booked`.

## Notes

Bookings intentionally do not include payment tracking, reminders, WhatsApp automation, or revenue reporting yet. Those remain future modules.

Inline customer creation creates an active customer first, then creates the booking with the created customer id.

Package name, duration, and price are stored as snapshots on the subscription row so old bookings stay stable when package defaults change later.

## Manual follow-up

Apply migrations before rerunning `supabase/seed.sql`, because the seed now depends on `rental_packages`, `service_account_profiles`, and `account_password` existing.
