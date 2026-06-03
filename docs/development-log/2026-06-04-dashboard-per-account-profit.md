# 2026-06-04 — Dashboard Per-Account Profit Totals

## Summary

Updated `Bookings by Service Account` dashboard cards so account-level spent and gross profit use all-time totals instead of current-month totals.

## Changes

- Per-account spent now sums all non-cancelled supplier costs for that service account.
- Per-account gross profit now uses all-time booking value minus all-time spent for that account.
- The card label now says `Spent (all-time)` to match the calculation.
- Monthly booking value remains visible as supporting context.

## Why

The dashboard top-level cards now use all-time money in/out. Account-level cards needed the same spent/profit semantics so they do not conflict with the real business profit view.

## Verification

Run:

- `npm run lint`
- `npm run build`
