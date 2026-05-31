# Database Plan

## Purpose

This document defines the initial database planning direction for the active MVP modules.

An initial migration file has been created for this plan, but it has not been applied to a Supabase project from this workspace yet. CRUD implementation has not been created yet.

Migration file:

- `supabase/migrations/20260529000000_initial_customers_service_accounts.sql`

Related development history:

- `docs/development-log/2026-05-29-initial-database-scope.md`

## Current Database Scope

Initial database scope is limited to:

- Customers
- Service Accounts

The initial migration intentionally creates only two business tables inside the `riztama_business` schema:

- `riztama_business.customers`
- `riztama_business.service_accounts`

The Dashboard will read summary data from these modules later.

The following modules are not part of the first database implementation unless explicitly requested:

- Platforms
- Subscriptions
- Payments
- Reminders
- Settings

## Database Backend

Planned backend:

- Supabase
- PostgreSQL via Supabase
- Dedicated application schema: `riztama_business`

Supabase-related application logic should live inside `/lib` or dedicated service files.

## General Rules

- Use UUID primary keys.
- Use `created_at` and `updated_at` timestamps on main tables.
- Use clear status constants instead of hardcoded strings scattered through the app.
- Keep fields simple until real business workflows require more complexity.
- Do not store service account passwords in plain text.
- Do not add authentication rules yet.
- RLS is enabled on the two initial tables as a Supabase production-safety baseline.
- Temporary read-only `SELECT` policies are present so the current anon-key Supabase client can load the internal admin list pages before authentication exists.
- Temporary customer `INSERT` and `UPDATE` policies are present so Customer create, edit, and archive-only actions work before authentication exists. Revisit these policies when authentication or server-only privileged access is introduced.
- Do not create additional business tables such as `platforms`, `subscriptions`, `payments`, `reminders`, or slot assignment tables until explicitly requested.

## Planned Tables

### customers

Purpose:
Store internal customer records.

Database object:
`riztama_business.customers`

Planned fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `name` | `text` | Required customer display name. |
| `contact_label` | `text` | Optional contact label, such as WhatsApp name or nickname. |
| `phone` | `text` | Optional phone number. |
| `email` | `text` | Optional email address. |
| `status` | `text` | Uses customer status constants. |
| `notes` | `text` | Optional internal notes. |
| `created_at` | `timestamptz` | Created timestamp. |
| `updated_at` | `timestamptz` | Updated timestamp. |

Planned customer statuses:

- `active`
- `inactive`
- `archived`

Initial UI usage:

- Customer list
- Customer create and edit dialog
- Archive-only customer action through `status = 'archived'`
- Customer status badge
- Search by name, phone, or contact label

Not included yet:

- Subscription history
- Payment history
- Customer login
- Customer-facing profile

Implementation status:
Migration SQL exists.

### service_accounts

Purpose:
Store internal service account records and slot capacity metadata.

Database object:
`riztama_business.service_accounts`

Planned fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `label` | `text` | Required internal account label. |
| `service_name` | `text` | Required service/platform name as plain text for the first MVP. |
| `account_identifier` | `text` | Optional email, username, or account reference. |
| `account_password` | `text` | Optional account password. Explicitly allowed for this private internal app per user request; revisit when authentication/encryption is added. |
| `credential_reference` | `text` | Optional credential note or reference. |
| `total_slots` | `integer` | Required total slot capacity. |
| `used_slots` | `integer` | Required used slot count. |
| `status` | `text` | Uses service account status constants. |
| `renewal_date` | `date` | Optional account renewal date. |
| `notes` | `text` | Optional internal notes. |
| `created_at` | `timestamptz` | Created timestamp. |
| `updated_at` | `timestamptz` | Updated timestamp. |

Planned service account statuses:

- `active`
- `full`
- `maintenance`
- `inactive`
- `archived`

Initial UI usage:

- Service account list
- Slot availability display
- Status badge
- Renewal date display
- Internal notes

Not included yet:

- Credential encryption implementation
- Slot assignment table
- Subscription relation
- Platform relation table

Implementation status:
Migration SQL exists.

## Initial Relationship Plan

There is no direct relationship required between `customers` and `service_accounts` in the first database step.

The relationship between customers and service account slots should be introduced later through a `subscriptions` or `account_slots` model after the customer and service account modules are stable.

No foreign key between `riztama_business.customers` and `riztama_business.service_accounts` is required in the current initial migration because direct customer-to-account assignment is not part of the two-table foundation yet.

## Derived Values

The app can derive these values from `service_accounts`:

- `available_slots = total_slots - used_slots`
- `is_full = used_slots >= total_slots`

These should be calculated in application logic or database views later. Do not duplicate them as stored fields unless there is a clear reason.

## Validation Rules

Customers:

- `name` is required.
- `status` must use a known customer status.
- Contact fields are optional for the first MVP.

Service Accounts:

- `label` is required.
- `service_name` is required.
- `total_slots` must be greater than or equal to `0`.
- `used_slots` must be greater than or equal to `0`.
- `used_slots` must not exceed `total_slots`.
- `status` must use a known service account status.
- `account_password` may be stored and displayed for the current private internal workflow per explicit user request; revisit before public/authenticated production use.

## Future Database Scope

Future database planning may add:

- `platforms`
- `subscriptions`
- `payments`
- `reminders`
- `settings`
- Audit logs
- Authentication-related user tables
- Notification delivery logs

These should be planned and documented before implementation.

## TypeScript Support

Initial TypeScript database types have been added in:

- `types/database.ts`
- `types/index.ts`

Reusable status constants have been added in:

- `lib/statuses.ts`

The Supabase client in `lib/supabase.ts` is typed with the current `Database` type.

## Current Implementation Status

Created:

- Initial migration SQL for `customers`.
- Initial migration SQL for `service_accounts`.
- Dedicated `riztama_business` schema.
- Check constraints for status values.
- Slot capacity constraints for service accounts.
- `created_at` and `updated_at` fields.
- Shared `set_updated_at` trigger function.
- RLS enabled on the two initial tables.
- Temporary read-only `SELECT` policies for the two initial tables.
- Temporary customer `INSERT` and `UPDATE` policies for Customer CRUD.
- Temporary service account `INSERT` and `UPDATE` policies for Service Account CRUD.
- Service account profile table for per-account profile/PIN/rentable status tracking.
- Temporary service account profile `SELECT`, `INSERT`, and `UPDATE` policies for Profile CRUD.
- Service account `account_password` column for the current private internal spreadsheet migration workflow.
- TypeScript database row, insert, and update types.
- Status constants.
- Manual seed SQL for safe local/VPS Supabase testing in `supabase/seed.sql`.

Not created:

- Supabase project link.
- Applied remote database migration.
- Customer detail pages.
- Customer assignment/subscriptions to service account profiles.
- Authentication.
- Authenticated role-based RLS policies.
- Tables for Platforms, Subscriptions, Payments, Reminders, Settings, or slot assignment.

## Decision History

- 2026-05-29: The initial migration was reviewed after the user clarified that only `customers` and `service_accounts` should exist first. The migration was intentionally left unchanged because it already creates only the two initial tables and required helpers inside `riztama_business`.
- 2026-05-29: The schema must remain `riztama_business`. Do not move these tables or helper functions to `public` unless the user explicitly requests a schema change.
- 2026-05-29: Development history should be recorded as markdown files inside `docs/development-log/`, not as a single root-level `docs/DEVELOPMENT_LOG.md` file.
- 2026-05-29: Temporary read-only `SELECT` policies were added for `customers` and `service_accounts` so the anon-key Supabase client can read list pages before authentication exists. Replace or restrict these policies when authentication or server-only database access is introduced.
- 2026-05-29: Manual seed SQL was added in `supabase/seed.sql` for safe local/VPS Supabase testing. It uses fixed UUIDs and `on conflict (id) do nothing` so rerunning it does not duplicate rows.
- 2026-05-29: Customer CRUD was added with create/edit dialog actions and archive-only delete behavior. Temporary customer `INSERT` and `UPDATE` policies exist only for the current unauthenticated dev setup. See `docs/development-log/2026-05-29-customer-crud.md`.
- 2026-05-30: Service Account CRUD was added with create/edit dialog actions, archive-only delete behavior, and slot validation. Temporary service account `INSERT` and `UPDATE` policies exist only for the current unauthenticated dev setup. See `docs/development-log/2026-05-30-service-account-crud.md`.
- 2026-05-30: Service account profiles were added for Netflix-style profile/PIN management. A service account can have up to 5 active profiles and up to 4 rentable active profiles. See `docs/development-log/2026-05-30-service-account-profiles.md`.
- 2026-05-31: `account_password` was added to service accounts for the user's private internal spreadsheet migration workflow. See `docs/development-log/2026-05-31-service-account-password-seed.md`.

## Open Questions

- Should `service_name` remain plain text for the MVP, or should `platforms` be introduced earlier?
- Should phone numbers follow a normalized format from the start?
- Should archived records be soft-deleted only, or hidden through status filters?
- Where will sensitive service account credentials be stored outside this database?
