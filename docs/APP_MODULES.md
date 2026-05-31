# App Modules

Each module should visually follow the same neobrutalist dashboard style: thick borders, hard offset shadows, flat colors, chunky controls, and clear hierarchy.

Current active MVP modules are Dashboard, Customers, Service Accounts, Bookings, and Financials. Database scope now includes customers, service accounts, service account profiles, service account costs, rental packages, and subscriptions/bookings. Other modules remain planned for later and should not be implemented until explicitly requested.

## Dashboard

Purpose:
Provide a quick overview of subscription business activity.

Main data handled:
Customer counts, active subscriptions, expiring subscriptions, unpaid payments, available slots, and reminders.

Planned features:

- Summary metric cards
- Upcoming expiration list
- Payment status summary
- Reminder preview
- Quick links to major modules

Current status:
Active MVP module. Fully database-backed. Renders real-time aggregate statistics for active customer count, total active service accounts, free slot counts, and service accounts requiring attention. Also shows booking metrics from `riztama_business.subscriptions`, including active bookings, completed bookings, booking value from `price_snapshot`, rows ending soon, and per-service-account booking summaries. Includes monthly spent and monthly gross profit indicators using `riztama_business.service_account_costs` to track service account operational expenses. Includes a unified recent activity feed for newly added customers and accounts.

Future improvements:
Analytics, date filters, trends, revenue summaries, and alert prioritization.

## Customers

Purpose:
Store and manage customer records.

Main data handled:
Customer name, contact information, notes, subscription history, and payment relation.

Planned features:

- Customer list
- Customer detail view
- Search and filtering
- Customer status indicators
- Relationship to subscriptions and payments

Current status:
Active MVP module. The admin Customers page reads from `riztama_business.customers` through the typed Supabase client and `lib/customers.ts`. Customer create, edit, and archive-only actions are available through neobrutalist dialog forms. The list supports URL-backed search across name, contact label, phone, and email plus status filtering. Empty, no-match, and load-error states use the shared `EmptyState` component. Customer details, hard delete, and relationships to future tables are not implemented yet.

Future improvements:
Customer activity timeline, import/export, duplicate detection, and customer-facing history.

## Platforms

Purpose:
Manage digital subscription platforms or service categories offered by the business.

Main data handled:
Platform name, description, status, pricing notes, and related service accounts.

Planned features:

- Platform list
- Platform status badges
- Basic platform metadata
- Relationship to service accounts and subscriptions

Current status:
Planned for later. No `platforms` table is part of the initial two-table database foundation.

Future improvements:
Platform-specific rules, pricing templates, slot limits, and reporting by platform.

## Service Accounts

Purpose:
Manage internal service accounts and subscription slots.

Main data handled:
Account label, platform, account identifier, account password, slot count, used slots, available slots, account status, and internal notes.

Planned features:

- Service account list
- Slot availability tracking
- Account status badges
- Relationship to subscriptions
- Secure handling approach for sensitive account data

Current status:
Active MVP module. The admin Service Accounts page reads from `riztama_business.service_accounts` through the typed Supabase client and `lib/service-accounts.ts`. Service account create, edit, and archive-only actions are available through neobrutalist dialog forms, including account password for the current private internal workflow. The list supports URL-backed search across label, service name, account identifier, and credential reference plus status filtering. Account detail pages now manage service account profiles with visible PIN, rentable toggle, status, notes, max 5 active profiles, and max 4 rentable active profiles per account. Empty, no-match, and load-error states use the shared `EmptyState` component. Customer assignment/subscriptions and relationship to future tables are not implemented yet.

Future improvements:
Encrypted credential handling, slot history, account health tracking, and audit logs.

## Subscriptions

Purpose:
Track customer subscriptions and assigned service slots.

Main data handled:
Customer, platform, service account slot, start date, expiration date, subscription status, and notes.

Planned features:

- Subscription list
- Expiration status badges
- Assignment to customer and service account slot
- Renewal tracking
- Filtering by status and platform

Current status:
Active MVP module exposed as the Bookings sidebar page. The page reads `riztama_business.subscriptions` with related customers, service accounts, service account profiles, and rental package snapshots through `lib/subscriptions.ts`. Booking create/edit/archive actions use neobrutalist dialogs, URL-backed search/status/service-account filters, package-driven price/end-date defaults, and inline customer creation for new booking flows. The booking list uses mobile card layouts on phone screens and a table layout on larger screens. Booking status changes now sync profile availability automatically: `booked` marks the assigned profile `occupied`, while `completed`, `cancelled`, or `archived` returns the profile to `available` when no active booking remains.

Future improvements:
Recurring renewal workflows, advanced reminders, subscription history, and automated status updates.

## Financials

Purpose:
Track subscription cash flow, supplier/service account costs, net profit, and per-account unit economics.

Main data handled:
Subscription price snapshots from `riztama_business.subscriptions`, service account expense records from `riztama_business.service_account_costs`, month filters, trend summaries, and combined ledger rows.

Current status:
Active MVP module exposed as the Financials sidebar page. The page reads finance aggregates through `lib/finance.ts`, records supplier expenses through `lib/service-account-costs.ts`, supports URL-backed month filtering with a small client filter component, renders cash-flow metrics, a Recharts-powered neobrutalist trend chart, a combined income/expense ledger, and per-service-account unit economics. Expense cancellation marks rows `cancelled` instead of deleting them.

Future improvements:
Payment reconciliation, exports, custom date ranges, receivables/payables separation, and richer profit analytics.

## Payments

Purpose:
Track customer payment records and payment status.

Main data handled:
Customer, subscription, amount, payment date, due date, payment method, and payment status.

Planned features:

- Payment list
- Paid, unpaid, overdue, and pending statuses
- Payment detail relation to subscription
- Basic payment summary on the dashboard

Current status:
Planned for later. No `payments` table is part of the initial two-table database foundation.

Future improvements:
Payment gateway integration, receipts, revenue reporting, export tools, and reconciliation workflows.

## Reminders

Purpose:
Help admins follow up on expirations, unpaid payments, renewals, and internal tasks.

Main data handled:
Reminder title, related customer, related subscription or payment, due date, priority, status, and notes.

Planned features:

- Admin-facing reminder list
- Upcoming reminder preview
- Reminder status badges
- Relationship to subscriptions and payments

Current status:
Planned for later. No `reminders` table is part of the initial two-table database foundation.

Future improvements:
WhatsApp, Telegram, or email notifications when explicitly requested.

## Settings

Purpose:
Provide configuration for app preferences and future admin settings.

Main data handled:
Potential business settings, display preferences, status options, and integration settings.

Planned features:

- Basic project configuration
- Placeholder for future settings

Current status:
Planned for later. No `settings` table is part of the initial two-table database foundation.

Future improvements:
Authentication settings, role settings, notification settings, integration settings, and business rule configuration.
