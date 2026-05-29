# 2026-05-29 — Initial Data Integration for Customers and Service Accounts

## Task Context

The user approved continuing the first Supabase integration phase for only two database tables:

- `riztama_business.customers`
- `riztama_business.service_accounts`

No future tables, CRUD operations, authentication, or RLS policies were added in this task.

## Documentation and Framework Context Read

Project documentation read before implementation:

- `docs/PROJECT_CONTEXT.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/APP_MODULES.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/README_FOR_AI.md`
- `docs/development-log/2026-05-29-initial-database-scope.md`

Next.js documentation read before changing app pages:

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/index.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/connection.md`

## Migration Review Result

The migration `supabase/migrations/20260529000000_initial_customers_service_accounts.sql` was reviewed again. It creates only:

- schema `riztama_business`
- helper trigger function `riztama_business.set_updated_at()`
- table `riztama_business.customers`
- table `riztama_business.service_accounts`
- indexes and update timestamp triggers for those two tables
- RLS enabled for both tables
- temporary read-only `SELECT` policies for both tables

There is no relationship from `service_accounts` to `customers` in the current migration, so the first Service Accounts list does not attempt to fetch related customer information.

## Implementation Summary

Implemented:

- `types/database.ts` now models the dedicated `riztama_business` schema instead of `public`.
- `lib/supabase.ts` now creates a typed Supabase client scoped to `riztama_business` using only the public URL and anon key environment variables.
- `lib/customers.ts` provides `getCustomers()` for safe read-only customer list access.
- `lib/service-accounts.ts` provides `getServiceAccounts()` for safe read-only service account list access.
- `app/admin/customers/page.tsx` is now an async server page that reads customers and renders a table, empty state, or safe error state.
- `app/admin/accounts/page.tsx` is now an async server page that reads service accounts and renders a table, empty state, or safe error state.

Important Next.js decision:

- The Customers and Service Accounts pages call `connection()` from `next/server` before Supabase reads so database access happens at request time instead of during static prerendering.

## Validation

Validation completed successfully:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

The final build marks `/admin/customers` and `/admin/accounts` as dynamic server-rendered routes.

## Known Constraints and Next Safe Steps

- RLS is enabled by the migration and temporary read-only `SELECT` policies exist for the two MVP tables so the anon-key client can load list pages before authentication exists.
- Replace or restrict the temporary read policies when authentication or server-only privileged database access is introduced.
- Do not move the schema to `public` unless explicitly instructed.
- Do not add future module tables until explicitly requested.
- Manual seed SQL now exists at `supabase/seed.sql` for safe local/VPS Supabase testing. It uses fixed UUIDs and `on conflict (id) do nothing`, so it can be rerun without duplicating sample rows.
- Safe next steps are exposing `riztama_business` in Supabase/PostgREST config if needed, applying/verifying the migration in Supabase, running the seed SQL manually in the VPS Supabase SQL editor, and refreshing the Customers and Service Accounts pages.
