# Project Context

## What This Application Is

This application is an internal web-based subscription management dashboard for a small business.

It helps admins manage digital subscription customers, service accounts, subscription slots, payments, expiration dates, and internal reminders in one structured system.

## Why This Application Exists

The business currently relies on manual Excel-based tracking. That approach can become hard to maintain as customer records, account slots, payment status, and expiration dates grow.

This app exists to make daily subscription administration cleaner, easier to search, and less error-prone.

## Who Will Use It

The app is intended for internal admins and business operators who manage subscription customers and service account availability.

Authentication is not included yet, so the current assumption is trusted internal usage only.

## Problem It Solves

The app helps replace scattered spreadsheet tracking with a dedicated admin dashboard for:

- Customer records
- Platform and service account records
- Subscription slot tracking
- Payment status tracking
- Expiration date tracking
- Admin-facing reminders

## Current MVP

The current MVP focuses on the smallest useful internal dashboard foundation.

Current active MVP modules:

- Dashboard overview
- Customer management
- Service account management
- Playful neo-brutalism dashboard design direction

Modules such as Platforms, Subscriptions, Payments, and Reminders are still part of the broader product plan, but should be treated as later scope until explicitly requested.

## Explicitly Not Included Yet

The following are not part of the current scope unless specifically requested:

- Authentication
- Netflix or streaming platform integration
- Automated access to third-party services
- WhatsApp API integration
- Telegram bot integration
- Payment gateway integration
- Automated customer notifications
- Full production-grade CRUD before setup and documentation are complete

## High-Level Modules

### Dashboard

Shows key internal metrics and quick operational context for the active MVP modules.

### Customers

Stores customer information and supports customer lookup.

### Platforms

Stores supported digital subscription platforms or service categories managed by the business. Planned for later.

### Service Accounts

Stores internal service account records and the available slots attached to each account.

### Subscriptions

Tracks customer subscriptions, assigned platform, assigned service account slot, start date, expiration date, and status. Planned for later.

### Payments

Tracks customer payment records, payment status, amount, payment date, and related subscription. Planned for later.

### Reminders

Tracks admin-facing reminders for renewals, expirations, unpaid records, and follow-up tasks. Planned for later.

## Current Project Scope

The current scope is to establish the internal dashboard foundation, documentation, development rules, and consistent design direction for Dashboard, Customers, and Service Accounts.

The app should remain focused on internal subscription operations.

The current app shell exposes only Dashboard, Customers, and Service Accounts. Future modules should remain hidden from primary navigation until explicitly requested.

## Future Possible Scope

Future scope may include:

- Authentication and role-based access
- Notification integrations such as WhatsApp or Telegram
- Payment gateway integrations
- More detailed analytics
- Export and import tools
- Audit logs
- Customer-facing views

These should only be added when explicitly requested.

## Design Direction

The UI should use a playful neo-brutalism dashboard style inspired by Saweria.

The design should feel memorable and friendly while remaining practical for daily admin usage.

Core direction:

- Thick black borders
- Hard offset shadows
- Flat pastel backgrounds
- Warm accent colors
- Rounded cards
- Chunky buttons
- Simple playful typography
- Clear layout hierarchy
- Clean internal business usability

## UI Foundation

The UI foundation is shadcn/ui with neobrutalist styling and reusable neobrutalist component patterns.

New UI work should reuse existing shadcn/ui components where possible and apply the project visual language consistently.
