# 2026-06-01 — Admin Loading States

## Task Context

The user wanted clearer loading/progress feedback across all admin pages, including page data loads, filters, add/edit dialogs, archive/cancel actions, and other mutations.

## Implementation Summary

### Reusable Loading Components

Added shared loading UI primitives:

- `components/LoadingState.tsx`
  - `LoadingDots`
  - `LoadingStrip`
  - `SkeletonBlock`
  - `LoadingCard`
  - `PageLoadingState`
- `components/PendingSubmitButton.tsx`
  - Uses `useFormStatus()` to show pending labels inside server-action forms.
  - Disables duplicate submit while pending.

### Route Loading Shells

Added route-level `loading.tsx` files for active admin pages:

- Dashboard
- Customers
- Service Accounts
- Account Detail
- Bookings
- Financials
- Logs

These show neobrutalist skeleton cards/rows during route loading and transitions.

### Mutation Feedback

Added pending feedback for archive/cancel action forms using `PendingSubmitButton` so actions show states such as:

- `Archiving...`
- `Cancelling...`

Dialog forms now show in-dialog saving feedback with `LoadingDots`, disable cancel while pending, and disable fieldsets while saving where practical.

### Filter Feedback

URL-backed filters now use React transitions around route changes and show compact loading labels while navigating:

- Customers filter
- Service Accounts filter
- Bookings filter
- Finance month filter

## Validation

Run:

- `npx tsc --noEmit`
- `npm run lint`

Manual check:

1. Navigate each admin route and confirm loading skeletons appear during route loading.
2. Submit add/edit dialogs and confirm `Saving...` appears.
3. Archive/cancel records and confirm action buttons show pending labels.
4. Change filters/month selectors and confirm `Filtering...` or `Loading...` appears.
5. Confirm pending controls prevent accidental duplicate submits.
