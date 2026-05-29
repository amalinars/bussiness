# Database Plan

## Purpose

This document defines the initial database planning direction for the active MVP modules.

No database schema, migration, Supabase table, or CRUD implementation has been created yet. This is a planning document only.

## Current Database Scope

Initial database planning is limited to:

- Customers
- Service Accounts

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

Supabase-related application logic should live inside `/lib` or dedicated service files.

## General Rules

- Use UUID primary keys.
- Use `created_at` and `updated_at` timestamps on main tables.
- Use clear status constants instead of hardcoded strings scattered through the app.
- Keep fields simple until real business workflows require more complexity.
- Do not store service account passwords in plain text.
- Do not add authentication rules yet.
- Do not add Row Level Security policy planning yet unless authentication is introduced.

## Planned Tables

### customers

Purpose:
Store internal customer records.

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
- Customer detail summary
- Customer status badge
- Search by name, phone, or contact label

Not included yet:

- Subscription history
- Payment history
- Customer login
- Customer-facing profile

### service_accounts

Purpose:
Store internal service account records and slot capacity metadata.

Planned fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `label` | `text` | Required internal account label. |
| `service_name` | `text` | Required service/platform name as plain text for the first MVP. |
| `account_identifier` | `text` | Optional email, username, or account reference. |
| `credential_reference` | `text` | Optional reference to where credentials are stored safely. Do not store passwords here. |
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

- Password storage
- Credential encryption implementation
- Slot assignment table
- Subscription relation
- Platform relation table

## Initial Relationship Plan

There is no direct relationship required between `customers` and `service_accounts` in the first database step.

The relationship between customers and service account slots should be introduced later through a `subscriptions` or `account_slots` model after the customer and service account modules are stable.

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
- Passwords must not be stored in plain text.

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

## Open Questions

- Should `service_name` remain plain text for the MVP, or should `platforms` be introduced earlier?
- Should phone numbers follow a normalized format from the start?
- Should archived records be soft-deleted only, or hidden through status filters?
- Where will sensitive service account credentials be stored outside this database?
