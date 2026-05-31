# 2026-05-30 — Service Account Profiles

## Task Context

The business uses shared service accounts such as Netflix accounts. Each account can have multiple profiles. The user requested profile management under Service Accounts, with visible profile PINs because the app is private/internal.

Business rules:

- Each service account can have up to 5 active profiles.
- Only up to 4 active profiles can be marked rentable/disewakan.
- Profile identifier uses the row `id`; no extra identifier field.
- Scope is profile CRUD only. Customer assignment/subscriptions are later.

## Implementation Summary

Added profile management for Service Accounts:

- New table: `riztama_business.service_account_profiles`.
- New route: `/admin/accounts/[id]`.
- Profile CRUD fields:
  - profile name
  - visible profile PIN
  - rentable toggle (`is_rentable`)
  - status
  - notes
- Archive-only profile action updates status to `archived`.
- App-level validations enforce max 5 active profiles and max 4 rentable active profiles.
- `/admin/accounts` actions now include a Profiles link.

Files added or changed:

- `supabase/migrations/20260530010000_add_service_account_profiles.sql`
- `types/database.ts`
- `lib/statuses.ts`
- `lib/service-account-profiles.ts`
- `app/admin/accounts/[id]/page.tsx`
- `app/admin/accounts/[id]/actions.ts`
- `app/admin/accounts/[id]/ServiceAccountProfileFormDialog.tsx`
- `app/admin/accounts/[id]/ServiceAccountProfileActions.tsx`
- `app/admin/accounts/ServiceAccountActions.tsx`

## Database and RLS Decision

Do not edit already-applied migration files. This change uses a new append-only migration:

- `supabase/migrations/20260530010000_add_service_account_profiles.sql`

Temporary RLS policies were added for current unauthenticated VPS-hosted dev usage:

- `service_account_profiles_read_all`
- `service_account_profiles_insert_all`
- `service_account_profiles_update_all`

Replace or restrict them when authentication/server-only privileged access exists.

## Manual Validation Checklist

- Apply only the new migration SQL file in VPS Supabase.
- Open `/admin/accounts`.
- Click Profiles for a service account.
- Add up to 5 profiles.
- Confirm 6th active profile is rejected.
- Mark up to 4 active profiles as rentable.
- Confirm 5th rentable active profile is rejected.
- Confirm PIN is visible.
- Archive profile and verify it no longer counts toward limits.

## Next Safe Steps

- Add customer assignment/subscription model later.
- Derive account slot metrics from profiles instead of manual `used_slots` after profile flow is stable.
