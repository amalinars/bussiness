# 2026-05-31 Finance Responsive Mobile Improvements

## Summary

Improved the Financials page for phone-first usage. The page is expected to be accessed from mobile devices, so dense finance content now stacks, wraps, and scrolls locally where needed.

## Changes

- Stacked Financials filter and action controls on mobile.
- Made the month filter full-width on small screens with a block select layout.
- Made the Add Expense trigger full-width on mobile.
- Added local horizontal scrolling for the cash-flow chart so the page itself does not overflow.
- Reduced chart mobile height, margins, and tick sizes.
- Made chart legends wrap with smaller mobile text.
- Stacked ledger cards on mobile and allowed long labels/descriptions to wrap.
- Made ledger amount/action rows easier to scan and tap on phones.
- Changed unit economics cards to use one column on mobile and two columns from `sm` upward.
- Added mobile-safe expense dialog height and scrolling.
- Documented mobile financial chart and ledger rules in `docs/DESIGN_SYSTEM.md`.

## Verification

Run:

- `npm run lint`
- `npm run build`

Manual mobile checks:

- `/admin/finance` at ~360px and ~390px widths.
- No page-level horizontal overflow.
- Chart scrolls inside its card.
- Ledger rows and unit economics cards remain readable.
- Expense dialog scrolls and action buttons remain reachable on short screens.
