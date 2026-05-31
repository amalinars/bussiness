# Database Plan

## Purpose

This document defines the initial database planning direction for the active MVP modules.

An initial migration file has been created for this plan, but it has not been applied to a Supabase project from this workspace yet. CRUD implementation has not been created yet.

Migration file:

- `supabase/migrations/20260529000000_initial_customers_service_accounts.sql`

Related development history:

- `docs/development-log/2026-05-29-initial-database-scope.md`

## Current Database Scope

Current database scope includes:

- Customers
- Service Accounts
- Service Account Profiles
- Rental Packages
- Subscriptions/Bookings

The current business tables inside the `riztama_business` schema are:

- `riztama_business.customers`
- `riztama_business.service_accounts`
- `riztama_business.service_account_profiles`
- `riztama_business.rental_packages`
- `riztama_business.subscriptions`

The Dashboard currently reads customer and service account summaries. Booking/subscription summaries can be added later.

The following modules are not part of the current database implementation unless explicitly requested:

- Platforms
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
- Service account passwords may be stored in plain text only for the current private internal workflow per explicit user request; revisit before public/authenticated production use.
- Do not add authentication rules yet.
- RLS is enabled on current business tables as a Supabase production-safety baseline.
- Temporary read/write policies are present so the current anon-key Supabase client can load and mutate internal admin pages before authentication exists. Revisit these policies when authentication or server-only privileged access is introduced.
- Do not create additional business tables such as `platforms`, `payments`, `reminders`, or slot assignment tables until explicitly requested.

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

### rental_packages

Purpose:
Store reusable rental package options used when creating bookings.

Database object:
`riztama_business.rental_packages`

Planned fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `name` | `text` | Required package name, such as `1 Hari` or `1 Minggu`. |
| `duration_days` | `integer` | Required positive duration in days. |
| `default_price` | `integer` | Required default package price in rupiah. |
| `status` | `text` | Uses rental package status constants. |
| `notes` | `text` | Optional internal notes. |
| `created_at` | `timestamptz` | Created timestamp. |
| `updated_at` | `timestamptz` | Updated timestamp. |

Planned rental package statuses:

- `active`
- `archived`

Initial UI usage:

- Booking form package dropdown
- Default price fill
- End-date calculation from `start_date + duration_days`

Implementation status:
Migration SQL exists. Manual seed SQL includes `1 Hari`, `2 Hari`, `3 Hari`, and `1 Minggu` package rows from the spreadsheet package options.

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

### subscriptions

Purpose:
Store customer booking transactions and assigned service account profiles.

Database object:
`riztama_business.subscriptions`

Planned fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `customer_id` | `uuid` | Required FK to `customers.id`. |
| `service_account_id` | `uuid` | Required FK to `service_accounts.id`. |
| `service_account_profile_id` | `uuid` | Required FK to `service_account_profiles.id`. |
| `rental_package_id` | `uuid` | Required FK to `rental_packages.id`. |
| `package_name_snapshot` | `text` | Package name copied at booking time. |
| `duration_days_snapshot` | `integer` | Package duration copied at booking time. |
| `price_snapshot` | `integer` | Booking price copied/overridden at booking time. |
| `start_date` | `date` | Required booking start date. |
| `end_date` | `date` | Required booking end date. |
| `status` | `text` | Uses subscription/booking status constants. |
| `notes` | `text` | Optional internal notes. |
| `created_at` | `timestamptz` | Created timestamp. |
| `updated_at` | `timestamptz` | Updated timestamp. |

Planned subscription statuses:

- `booked`
- `completed`
- `cancelled`
- `archived`

Initial UI usage:

- Dedicated `/admin/bookings` page
- Existing-customer selection
- Inline new-customer creation during booking
- Package-driven price and end date defaults
- Soft archive through `status = 'archived'`

Implementation status:
Migration SQL exists.

## Relationship Plan

`subscriptions` now connects customers to rented service account profiles through FKs to `customers`, `service_accounts`, `service_account_profiles`, and `rental_packages`. Package name, duration, and price are snapshotted into the subscription row so historical bookings remain stable if package defaults change later.

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
- Rental package table and package seed rows.
- Subscription/booking table linking customers, service accounts, profiles, and packages.
- Temporary rental package and subscription `SELECT`, `INSERT`, and `UPDATE` policies for the current unauthenticated dev setup.

Not created:

- Supabase project link.
- Applied remote database migration.
- Customer detail pages.
- Payment tracking for subscription rows.
- Authentication.
- Authenticated role-based RLS policies.
- Tables for Platforms, Payments, Reminders, Settings, or separate slot assignment.

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
- 2026-05-31: Rental packages and subscriptions/bookings were added as the first transaction flow. Bookings use package snapshots and support inline customer creation. See `docs/development-log/2026-05-31-bookings-rental-packages.md`.

## Open Questions

- Should `service_name` remain plain text for the MVP, or should `platforms` be introduced earlier?
- Should phone numbers follow a normalized format from the start?
- Should archived records be soft-deleted only, or hidden through status filters?
- Where will sensitive service account credentials be stored outside this database?
