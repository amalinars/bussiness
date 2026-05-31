# 2026-05-30 — Service Account Search and Status Filter

## Task Context

Service Account CRUD was successfully implemented. For feature parity with the Customers module, the Service Accounts module needs URL-backed search and status filtering.

## Implementation Summary

Added URL-backed filtering for the admin Service Accounts list:

- `q` parameter searches across `label`, `service_name`, `account_identifier`, and `credential_reference`.
- `status` parameter filters by active, full, maintenance, inactive, or archived.
- Filters are applied server-side in `lib/service-accounts.ts` through the typed Supabase data layer.
- `app/admin/accounts/ServiceAccountFilters.tsx` provides neobrutalist filter UI.
- `/admin/accounts` maintains server-rendered data loading and receives dynamic `searchParams`.
- Empty state distinguishes between zero records overall and zero matching filtered records.

Files changed:

- `lib/service-accounts.ts`
- `app/admin/accounts/page.tsx`
- `app/admin/accounts/ServiceAccountFilters.tsx`
- `docs/APP_MODULES.md`
- `docs/CHANGELOG.md`

## Notes

No database migrations were required. Parameters are scraped directly from search query params.

## Manual Validation Checklist

- Search by service name or label.
- Search by account identifier or credential reference.
- Filter by statuses (active, full, maintenance, inactive, archived).
- Combine search and status filter.
- Clear filters.
- Confirm Service Account create/edit/archive actions still function.
