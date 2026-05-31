# 2026-05-31 Clean UI Copy and Remove Header

## Summary

Cleaned user-facing admin UI text so pages no longer expose development, MVP, database-provider, or setup status wording. Removed the global top header from the admin layout so navigation is sidebar-only.

## Changes

- Removed `AppHeader` from `app/admin/layout.tsx`.
- Left the sidebar as the only navigation shell.
- Kept the mobile sidebar trigger because it opens sidebar navigation on phones.
- Replaced MVP/foundation/provider copy on Customers, Service Accounts, Bookings, and Dashboard pages.
- Replaced Supabase/system-status wording with business-facing operational copy.
- Neutralized the unused `AppHeader` component so old development copy is not present in UI source.

## Verification

Run:

- `npm run lint`
- `npm run build`
- grep app/components for user-facing development phrases.

Manual checks:

- Admin pages render without the global top header.
- Sidebar remains available on desktop.
- Mobile menu trigger still opens the sidebar.
- Page subtitles and cards use business-facing copy only.
