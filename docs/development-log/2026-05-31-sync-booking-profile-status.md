# 2026-05-31 — Sync Booking Status to Profile Availability

## Task Context

The user noticed that a service account profile such as `dowoon` did not appear in the Add Booking profile dropdown even though its customer bookings were already completed.

Root cause:

- Booking rows use `riztama_business.subscriptions.status`.
- Service account profiles use `riztama_business.service_account_profiles.status`.
- The booking status was not automatically updating the assigned profile status.
- A completed booking could leave its profile stuck as `occupied`, so the Add Booking form correctly filtered it out as unavailable.

## Business Rule

Profile availability now follows active booking state:

- A profile with at least one `booked` subscription becomes `occupied`.
- A profile with no `booked` subscription returns from `occupied` to `available`.
- `completed`, `cancelled`, and `archived` bookings do not keep a profile occupied.
- Service account `used_slots` is recalculated from profiles with status `occupied` or `reserved`.

## Implementation Summary

Added a new append-only Supabase migration:

- `supabase/migrations/20260531040000_sync_booking_and_profile_status.sql`

The migration adds:

- `riztama_business.sync_profile_status_on_booking_change()`
- `sync_profile_status_on_booking_change_trg` on `riztama_business.subscriptions`
- `riztama_business.sync_service_account_used_slots()`
- `sync_service_account_used_slots_trg` on `riztama_business.service_account_profiles`
- One-time data sync for existing profile statuses based on current booking rows
- One-time recalculation of existing `service_accounts.used_slots`

Updated booking server actions:

- `app/admin/bookings/actions.ts`

Booking create/update/archive now revalidates:

- `/admin/bookings`
- `/admin/accounts`
- `/admin/dashboard`

Create booking still also revalidates `/admin/customers` for inline new-customer flows.

## Manual Database Step

Run the new migration SQL in the VPS Supabase SQL editor:

- `supabase/migrations/20260531040000_sync_booking_and_profile_status.sql`

After it is applied, existing stuck `occupied` profiles with no active `booked` booking should become `available`, including profiles like `dowoon`.

## Validation

Passed locally:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Next Safe Steps

- Apply the migration in Supabase.
- Refresh `/admin/bookings`.
- Confirm completed profiles appear in Add Booking again.
- Confirm creating a new `booked` booking marks the profile `occupied`.
- Confirm changing that booking to `completed` returns the profile to `available`.
