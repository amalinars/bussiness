# 2026-05-31 Bookings Mobile Responsive Improvements

## Summary

Improved the Bookings page for phone-first usage. Dense booking records now render as mobile cards on small screens while keeping the table view for larger screens.

## Changes

- Added mobile-only booking cards with customer, account/profile, package, dates, price, status, notes, and actions.
- Kept the desktop/tablet booking table hidden below the `md` breakpoint.
- Added local table minimum width for desktop/tablet scrolling behavior when needed.
- Improved booking list header spacing and title sizing for mobile.
- Made booking filter controls and buttons mobile-first and full-width.
- Shortened the booking search placeholder for narrow screens.
- Made booking actions easier to tap in mobile cards.
- Made booking dialogs scroll within the viewport on phones.
- Adjusted booking form controls, footer buttons, and error text for mobile widths.
- Updated design documentation to prefer mobile card/list alternatives for dense tables.
- Updated app module documentation to mention the responsive booking list.

## Verification

Run:

- `npm run lint`
- `npm run build`

Manual mobile checks:

- `/admin/bookings` at ~360px and ~390px widths.
- Filters stack cleanly and buttons are full-width.
- Booking rows render as cards on mobile.
- Desktop/tablet still shows the table.
- Long customer/account/package/notes text wraps without page overflow.
- Edit/archive actions are tappable.
- Booking modal scrolls and footer buttons remain reachable.
