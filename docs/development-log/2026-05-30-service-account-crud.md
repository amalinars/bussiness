# 2026-05-30 — Service Account CRUD

## Task Context

Customers already had CRUD plus search/filter. The user approved adding Service Account CRUD next so the two active MVP data modules are both manageable before dashboard metrics.

## Implementation Summary

Implemented Service Account CRUD for the admin Service Accounts module:

- Create service account through a neobrutalist dialog.
- Edit service account through a neobrutalist dialog.
- Archive service account from table actions.
- Archive updates `riztama_business.service_accounts.status` to `archived`.
- No hard delete was implemented.
- No password field was added.
- `credential_reference` remains a reference-only text field for external safe storage.
- Optional empty strings are normalized to `null` in the data layer.
- Slot values are parsed and validated before saving:
  - `total_slots` must be a non-negative integer.
  - `used_slots` must be a non-negative integer.
  - `used_slots` must not exceed `total_slots`.
- Server actions revalidate `/admin/accounts` after successful mutations.

Files added or changed:

- `lib/service-accounts.ts`
- `app/admin/accounts/actions.ts`
- `app/admin/accounts/ServiceAccountFormDialog.tsx`
- `app/admin/accounts/ServiceAccountActions.tsx`
- `app/admin/accounts/page.tsx`
- `supabase/migrations/20260529020000_add_service_account_crud_policies.sql`

## Database and RLS Decision

Do not edit already-applied migration files for new database changes. Service Account write policies were added in a separate migration:

- `supabase/migrations/20260529020000_add_service_account_crud_policies.sql`

The migration adds guarded temporary policies:

- `service_accounts_insert_all`
- `service_accounts_update_all`

These policies are for the current unauthenticated VPS-hosted Supabase dev setup. Replace or restrict them when authentication or server-only privileged database access is introduced.

## Manual Validation Checklist

- Apply only the new migration file in the VPS Supabase SQL editor.
- Add a service account with valid slot values.
- Confirm invalid slot values are rejected.
- Edit a service account.
- Archive a service account and confirm the row remains with `archived` status.
- Confirm there is no password field.

## Next Safe Steps

- Add Service Account search and status/filter controls.
- Add dashboard metrics from Customers and Service Accounts.
- Add detail pages only if explicitly needed.
