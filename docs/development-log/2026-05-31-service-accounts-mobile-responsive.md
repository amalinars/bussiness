# 2026-05-31 Service Accounts Mobile Responsive Improvements

## Summary

Improved Service Accounts list and detail pages for phone-first usage. Dense tables now use mobile card layouts on small screens while keeping table views for larger screens.

## Changes

- Added mobile service account cards on `/admin/accounts`.
- Kept service account table for `md` and larger screens.
- Improved service account filters, header spacing, and mobile action buttons.
- Made service account create/edit dialog scroll within the phone viewport.
- Added mobile profile cards on service account detail pages.
- Added mobile cost history cards on service account detail pages.
- Kept profile and cost history tables for larger screens.
- Improved profile/cost action button layout for mobile cards.
- Made profile/cost dialogs mobile-scrollable with full-width mobile footer buttons.
- Added wrapping to long identifiers, passwords, credential references, and notes.
- Updated app module documentation to mention mobile card layouts.

## Verification

Run:

- `npm run lint`
- `npm run build`

Manual mobile checks:

- `/admin/accounts` at ~360px and ~390px widths.
- `/admin/accounts/[id]` at ~360px and ~390px widths.
- Filters stack cleanly and buttons are full-width.
- Account, profile, and cost records render as cards on mobile.
- Desktop/tablet views still show tables.
- Long identifiers/passwords/notes wrap without page overflow.
- Dialogs scroll and footer buttons remain reachable on short screens.
