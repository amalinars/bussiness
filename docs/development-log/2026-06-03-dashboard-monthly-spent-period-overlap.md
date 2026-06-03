# 2026-06-03 — Dashboard Monthly Spent Period Overlap

## Summary

Fixed dashboard monthly spent so service account costs remain visible when their covered period overlaps the current month, even if the payment date was in a previous month.

## Changes

- Added shared date-range helpers in `lib/date-ranges.ts`.
- Updated `lib/dashboard.ts` so current-month service account costs use `period_start` and `period_end` overlap with the current month.
- Updated dashboard current-month detection to use the `Asia/Jakarta` business calendar instead of UTC month boundaries.
- Kept cancelled costs excluded from dashboard spent calculations.
- Kept dashboard monthly booking value behavior unchanged; bookings still use subscription date overlap.
- Updated the dashboard metric helper copy to describe active cost periods rather than payment records.
- Added a Node built-in regression test for date-range overlap behavior.

## Business Rule

Dashboard monthly spent uses the full cost amount when the cost period touches the current month. It does not prorate by day and does not depend on `cost_date` for this dashboard metric.

Dashboard month boundaries follow the `Asia/Jakarta` business timezone so the app does not show the previous month during the first hours of a new local month.

## Verification

Run:

- `node --test tests/dashboard-date-ranges.test.mjs`
- `npm run lint`
- `npm run build`
