# 2026-05-31 Customers Mobile Responsive Improvements

## Summary

Improved the Customers page for phone-first usage. Customer records now render as cards on small screens while keeping the table view for larger screens.

## Changes

- Added mobile customer cards with name, contact label, phone, email, status, notes, and actions.
- Kept the customer table for `md` and larger screens.
- Added wrapping for long emails and notes.
- Improved customer list header spacing and title sizing for mobile.
- Made customer filter controls and buttons mobile-first and full-width.
- Made customer action buttons easier to tap in mobile cards.
- Made customer dialogs scroll within the phone viewport.
- Adjusted customer form controls, footer buttons, and error text for mobile widths.
- Updated app module documentation to mention the responsive customer list.

## Verification

Run:

- `npm run lint`
- `npm run build`

Manual mobile checks:

- `/admin/customers` at ~360px and ~390px widths.
- Filters stack cleanly and buttons are full-width.
- Customer rows render as cards on mobile.
- Desktop/tablet still shows the table.
- Long names/emails/notes wrap without page overflow.
- Edit/archive actions are tappable.
- Customer modal scrolls and footer buttons remain reachable.
