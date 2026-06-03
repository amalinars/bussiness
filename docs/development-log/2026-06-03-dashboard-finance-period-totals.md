# 2026-06-03 — Dashboard and Finance Period Totals

## Summary

Fixed dashboard and finance summary calculations so booking value, spent, and gross profit better match the subscription rental business reality across month boundaries and all-time reporting.

## Problem

The dashboard mixed all-time and monthly meanings: booking value was all-time, but gross profit was monthly booking value minus monthly spent. With current data, all-time booking value is `Rp 318.000` and all-time supplier costs are `Rp 558.000`, so all-time gross profit should be `Rp -240.000`.

The Financials month filter also used transaction dates only: `subscriptions.start_date` for revenue and `service_account_costs.cost_date` for expenses. That missed rows whose active business period overlaps the selected month but started or was paid in the previous month.

## Changes

- Added month-key helpers to `lib/date-ranges.ts`.
- Updated dashboard top-level totals:
  - all-time booking value = counted `booked`/`completed` `subscriptions.price_snapshot`.
  - all-time spent = non-cancelled `service_account_costs.amount`.
  - gross profit = all-time booking value minus all-time spent.
- Kept dashboard per-service-account monthly summaries overlap-based.
- Updated finance selected-month summaries to use active period overlap:
  - booking revenue uses `subscriptions.start_date` through `end_date`.
  - supplier expense uses `service_account_costs.period_start` through `period_end`.
- Kept ledger rows date-based for audit/payment chronology.
- Added Node regression tests for month helpers and finance totals.

## Business Rules

- All-time reporting includes all counted rows from the beginning until now.
- Selected-month reporting includes rows whose active business period overlaps the selected month.
- Period amounts are not prorated by day.
- Cancelled expenses and cancelled/archived bookings do not count in financial totals.
- `cost_date` remains the payment/ledger date, not the summary-period inclusion field.

## Verification

Run:

- `node --test tests/dashboard-date-ranges.test.mjs`
- `node --test tests/dashboard-finance-totals.test.mjs`
- `npm run lint`
- `npm run build`
