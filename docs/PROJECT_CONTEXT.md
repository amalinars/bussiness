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

The current MVP focuses on internal record management and dashboard visibility.

Included MVP areas:

- Dashboard overview
- Customer management planning
- Platform management planning
- Service account management planning
- Subscription tracking planning
- Payment tracking planning
- Admin reminder planning
- Playful neo-brutalism dashboard design direction

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

Shows key internal metrics, upcoming expirations, payment status summaries, and reminders.

### Customers

Stores customer information and supports customer lookup for subscriptions and payments.

### Platforms

Stores supported digital subscription platforms or service categories managed by the business.

### Service Accounts

Stores internal service account records and the available slots attached to each account.

### Subscriptions

Tracks customer subscriptions, assigned platform, assigned service account slot, start date, expiration date, and status.

### Payments

Tracks customer payment records, payment status, amount, payment date, and related subscription.

### Reminders

Tracks admin-facing reminders for renewals, expirations, unpaid records, and follow-up tasks.

## Current Project Scope

The current scope is to establish the internal dashboard foundation, documentation, development rules, module planning, and consistent design direction.

The app should remain focused on internal subscription operations.

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
