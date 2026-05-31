# 2026-05-31 — Manual Subscription End Date and Time Adjustment

## Task Context

The user wanted to be able to set or customize the `end_date` and `end_time` manually when creating or editing bookings instead of relying entirely on calculated values based on start date and package duration.

## Implementation Summary

### Database Schema

Already updated via migration `supabase/migrations/20260531050000_add_subscription_end_time.sql`:
- Added `end_time` column to `riztama_business.subscriptions` defaulting to `'23:59'`.

### Type Definitions

- Updated `types/database.ts` and `lib/subscriptions.ts` to include `end_time: string | null` in `Subscription`, `SubscriptionInsert`, `SubscriptionListRow`, and `SubscriptionListItem`.

### Server Actions

- Modified `app/admin/bookings/actions.ts` to parse `end_time` from form data inside `bookingInputFromFormData()`.

### Booking Form UI

- Updated `app/admin/bookings/BookingFormDialog.tsx`:
  - Created interactive state variables `endDate` and `endTime`.
  - Removed `readOnly` from the End Date input field, setting its type to `date` so admins can select custom end dates.
  - Added a new `time` type input field for `end_time` defaulting to `"23:59"`.
  - Modified start date change (`handleStartDateChange`) and package change (`updatePackage`) to calculate the default `endDate` state automatically while still allowing manual override.
  - Placed inputs directly inside the form (removed hidden input for `end_date`).

### Booking List Display

- Updated `app/admin/bookings/page.tsx`:
  - Show end time alongside end date in both mobile cards and desktop table views: `to {booking.end_date} at {booking.end_time}` format (slicing the time to HH:MM).

## Verification

Run type check and linters:
- `npx tsc --noEmit`
- `npm run lint`
