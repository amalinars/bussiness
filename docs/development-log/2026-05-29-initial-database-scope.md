# 2026-05-29 — Initial Database Scope Confirmation

## Task Context

The user clarified that the first database implementation should focus on only two core tables:

- `customers`
- `service_accounts`

The relevant migration reviewed was:

- `supabase/migrations/20260529000000_initial_customers_service_accounts.sql`

## Documentation Read Before Work

The required project documentation was read before making changes:

- `docs/PROJECT_CONTEXT.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/APP_MODULES.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/README_FOR_AI.md`

## Migration Review Result

The migration was reviewed and confirmed to already match the requested two-table scope.

The migration creates:

- schema `riztama_business`
- helper function `riztama_business.set_updated_at()`
- table `riztama_business.customers`
- table `riztama_business.service_accounts`
- indexes for the two initial tables
- update timestamp triggers for the two initial tables
- RLS enabled for the two initial tables

The migration does not create these future-scope business tables:

- `platforms`
- `subscriptions`
- `payments`
- `reminders`
- `settings`
- slot assignment tables

## Important Decision

The database schema must remain `riztama_business`.

An earlier proposed direction would have moved objects to the default `public` schema, but the user rejected that direction and explicitly clarified that the schema should stay `riztama_business`. Future agents must not change the initial database schema to `public` unless the user explicitly asks for that migration strategy.

## Final Action Taken

No SQL migration change was applied.

Documentation was updated to preserve context for future agents:

- `docs/DATABASE_PLAN.md`
- `docs/APP_MODULES.md`
- `docs/CHANGELOG.md`
- `docs/README_FOR_AI.md`
- `docs/development-log/2026-05-29-initial-database-scope.md`

## Current Development State After This Work

- Initial database migration exists but has not been applied to a Supabase project from this workspace.
- CRUD pages and forms are not implemented.
- Page data fetching is not implemented.
- Authentication is not implemented.
- RLS policies are not implemented.
- Initial database scope remains limited to `riztama_business.customers` and `riztama_business.service_accounts`.

## Next Safe Steps

Future agents may continue with one of these only when explicitly requested:

- align TypeScript database types with the dedicated `riztama_business` schema if Supabase client typing requires it
- apply the migration to a Supabase project after project linking is configured
- implement minimal data access services for the two initial tables
- implement CRUD UI only for Customers and Service Accounts

Future agents must not add future module tables or integrations without explicit user approval.
