# 2026-05-31 — Service Account Password Seed

## Task Context

The user requested that Service Accounts store the account password and that seed data match the spreadsheet screenshots. This is explicitly for the user's private internal workflow.

## Implementation Summary

Added service account password support:

- New append-only migration adds `riztama_business.service_accounts.account_password`.
- TypeScript database types include `account_password`.
- Service Account create/edit actions accept `account_password`.
- Service Account list and detail pages display the password.
- Service Account form includes an Account password field.

Updated `supabase/seed.sql` to include spreadsheet account passwords:

- Netflix Risma: `hidupsehat15`
- Netflix Jovan: `mainyuk1224`
- Netflix Tugeder: `yukjajan1224`

The service account seed now uses `on conflict (id) do update` so rerunning the seed populates password values for existing seeded accounts.

## Files Changed

- `supabase/migrations/20260531010000_add_service_account_password.sql`
- `supabase/seed.sql`
- `types/database.ts`
- `lib/service-accounts.ts`
- `lib/service-account-profiles.ts`
- `app/admin/accounts/actions.ts`
- `app/admin/accounts/ServiceAccountFormDialog.tsx`
- `app/admin/accounts/page.tsx`
- `app/admin/accounts/[id]/page.tsx`
- `docs/APP_MODULES.md`
- `docs/DATABASE_PLAN.md`
- `docs/CHANGELOG.md`

## Security Note

This stores account passwords as plain text because the user explicitly requested spreadsheet-equivalent visibility for a private internal system. Revisit this before adding public access, authentication, or multi-user production use.

## Manual Validation Checklist

- Apply `supabase/migrations/20260531010000_add_service_account_password.sql`.
- Rerun `supabase/seed.sql`.
- Open `/admin/accounts`.
- Confirm account emails and passwords match the spreadsheet screenshots.
- Edit a Service Account password and confirm it persists.
- Open profile detail pages and confirm profiles still load.
