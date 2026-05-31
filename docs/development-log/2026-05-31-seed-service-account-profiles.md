# 2026-05-31 — Seed Service Account Profiles

## Task Context

The user shared spreadsheet screenshots from the current manual Netflix tracking workflow and asked to import only the account and profile data first.

Buyer, package, date, income, and profit rows are intentionally not imported in this change because customer assignment/subscriptions are not implemented yet.

## Implementation Summary

Updated `supabase/seed.sql` to seed three Netflix service accounts:

- Netflix Risma
- Netflix Jovan
- Netflix Tugeder

Each account includes five profiles:

- one non-rentable main profile marked `reserved`
- four rentable profiles marked `occupied`

The seed keeps service account passwords out of the database. Spreadsheet account emails are stored as `account_identifier`; credential values are represented only as safe references/notes.

## Files Changed

- `supabase/seed.sql`
- `docs/CHANGELOG.md`

## Notes

Use this seed only after the profile table migration exists:

- `supabase/migrations/20260530010000_add_service_account_profiles.sql`

The seed uses fixed UUIDs and `on conflict (id) do nothing`, so it is safe to rerun without duplicating rows.
