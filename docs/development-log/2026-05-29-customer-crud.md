# 2026-05-29 — Customer CRUD

## Task Context

The user wanted Customer CRUD before dashboard metrics. The user selected dialog/modal UI and archive-only delete behavior.

## Implementation Summary

Implemented Customer CRUD for the admin Customers module:

- Create customer through a neobrutalist dialog.
- Edit customer through a neobrutalist dialog.
- Archive customer from the table actions.
- Archive updates `riztama_business.customers.status` to `archived`.
- No hard delete was implemented.
- Form optional empty strings are normalized to `null` in the data layer.
- Server actions revalidate `/admin/customers` after successful mutations.

Files added or changed:

- `lib/customers.ts`
- `app/admin/customers/actions.ts`
- `app/admin/customers/CustomerFormDialog.tsx`
- `app/admin/customers/CustomerActions.tsx`
- `app/admin/customers/page.tsx`
- `components/ui/dialog.tsx`
- `supabase/migrations/20260529010000_add_customer_crud_policies.sql`

## Database and RLS Decision

Do not edit already-applied migration files for new database changes. Customer write policies were added in a separate migration:

- `supabase/migrations/20260529010000_add_customer_crud_policies.sql`

The migration adds guarded temporary policies:

- `customers_insert_all`
- `customers_update_all`

These policies are for the current unauthenticated VPS-hosted Supabase dev setup. Replace or restrict them when authentication or server-only privileged database access is introduced.

## Manual Validation

The user confirmed manual Customer CRUD testing was completed successfully against the VPS-hosted Supabase dev instance.

Expected behavior:

- Add customer creates a new row.
- Edit customer persists changes after refresh.
- Archive customer sets status to `archived` and does not delete the row.

## Next Safe Steps

- Add Customer search and status filtering.
- Add Service Account CRUD later, with slot validation and no plain-text password storage.
- Add dashboard metrics after CRUD basics are stable.
