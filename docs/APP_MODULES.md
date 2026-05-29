# App Modules

Each module should visually follow the same neobrutalist dashboard style: thick borders, hard offset shadows, flat colors, chunky controls, and clear hierarchy.

Current active MVP modules are Dashboard, Customers, and Service Accounts. Other modules remain planned for later and should not be implemented until explicitly requested.

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
Active MVP module. App shell page implemented with placeholder metrics only.

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
Active MVP module. App shell page implemented with placeholder planning content only.

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
Planned for later.

Future improvements:
Platform-specific rules, pricing templates, slot limits, and reporting by platform.

## Service Accounts

Purpose:
Manage internal service accounts and subscription slots.

Main data handled:
Account label, platform, slot count, used slots, available slots, account status, and internal notes.

Planned features:

- Service account list
- Slot availability tracking
- Account status badges
- Relationship to subscriptions
- Secure handling approach for sensitive account data

Current status:
Active MVP module. App shell page implemented with placeholder planning content only.

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
Planned for later.

Future improvements:
Recurring renewal workflows, advanced reminders, subscription history, and automated status updates.

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
Planned for later.

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
Planned for later.

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
Planned for later.

Future improvements:
Authentication settings, role settings, notification settings, integration settings, and business rule configuration.
