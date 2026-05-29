# 2026-05-29 — Customer Search and Status Filter

## Task Context

Customer CRUD was manually tested successfully. The next step was to make the Customers list easier to use before dashboard metrics.

## Implementation Summary

Added URL-backed filtering for the admin Customers list:

- `q` query parameter searches across name, contact label, phone, and email.
- `status` query parameter filters by active, inactive, or archived.
- Filters are applied server-side in `lib/customers.ts` through the typed Supabase data layer.
- `app/admin/customers/CustomerFilters.tsx` provides neobrutalist filter controls.
- `/admin/customers` keeps server-rendered data loading and receives `searchParams`.
- Empty state now distinguishes between no customer records and no matching filtered results.

Files changed:

- `lib/customers.ts`
- `app/admin/customers/page.tsx`
- `app/admin/customers/CustomerFilters.tsx`
- `docs/APP_MODULES.md`
- `docs/CHANGELOG.md`

## Notes

Filtering uses URL query params so results can be refreshed, shared, and bookmarked. No new database migration was needed.

## Manual Validation Checklist

- Search by customer name.
- Search by contact label, phone, or email.
- Filter by active, inactive, and archived status.
- Combine search and status filter.
- Clear filters.
- Confirm Customer add/edit/archive still works while filters are present.
