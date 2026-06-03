# 2026-05-31 — Service Account Costs

## Summary

Added service account cost history so supplier/platform expenses can be tracked against service accounts and used by dashboard and finance summaries.

## Changes

- Added `riztama_business.service_account_costs` with `cost_date`, `period_start`, `period_end`, `amount`, `status`, and notes.
- Added indexes for service account lookup, payment date lookup, and period range lookup.
- Added temporary unauthenticated development RLS policies for select, insert, and update.
- Added service account cost create/edit/cancel flows through the admin UI.
- Introduced dashboard monthly spent and gross-profit indicators using cost rows.

## Notes

The table stores both payment date and covered service period. Payment-date reporting and period-coverage reporting are separate business concepts.
