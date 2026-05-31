# 2026-05-31 — Dashboard Booking Metrics

## Summary

Expanded the dashboard with operational booking metrics using the current subscriptions data model.

## Changes

- Added dashboard aggregation for `riztama_business.subscriptions` in `lib/dashboard.ts`.
- Added active booking count from rows with `status = 'booked'`.
- Added completed booking count from rows with `status = 'completed'`.
- Added booking value total from `price_snapshot` for booked and completed rows.
- Added ending-soon booking list for active booked rows ending from today through the next 3 days.
- Added per-service-account booking summaries with total, active, completed, and booking value totals.
- Updated `/admin/dashboard` with booking metric cards and neobrutalist summary cards.

## Notes

Booking value is not payment income. It uses subscription `price_snapshot` because payment/profit tracking is intentionally deferred.

No database migration was required.
