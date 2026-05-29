# App Shell

## Purpose

The app shell provides the shared internal dashboard layout for the active MVP modules.

It should stay focused on navigation, page structure, and reusable visual patterns. It must not introduce database logic, CRUD workflows, authentication, or integrations.

## Current Active Routes

- `/admin/dashboard`
- `/admin/customers`
- `/admin/accounts`

The `/admin` route redirects to `/admin/dashboard`.

## Current Navigation

The sidebar only exposes active MVP modules:

- Dashboard
- Customers
- Service Accounts

Future modules such as Platforms, Subscriptions, Payments, Reminders, and Settings should not be added to the navigation until explicitly requested.

## Layout Structure

The admin shell uses:

- `app/admin/layout.tsx` for the shared admin layout
- `components/AppSidebar.tsx` for navigation
- `components/AppHeader.tsx` for top-level context
- `components/PageContainer.tsx` for page spacing and heading structure

## Reusable Shell Components

Current reusable neobrutalist components:

- `components/MetricCard.tsx`
- `components/StatusBadge.tsx`
- `components/EmptyState.tsx`
- shadcn/ui `Card`
- shadcn/ui `Button`

These components should be reused before creating new page-specific UI.

## Scope Guardrails

The app shell currently uses placeholder UI only.

Do not add the following inside the shell unless specifically requested:

- Supabase queries
- Database schema
- CRUD actions
- Authentication checks
- External integrations
- Streaming platform automation

## Design Notes

The shell follows the playful neo-brutalism direction:

- Thick black borders
- Hard offset shadows
- Flat pastel backgrounds
- Restrained warm highlights
- Chunky navigation items
- Clear page hierarchy

Large layout surfaces should stay mostly neutral. Use color as accent only, so the dashboard remains comfortable for daily admin work.

Use a solid page background. Do not use grid-pattern backgrounds for the admin shell.

If the shell layout or component patterns change, update this document and `/docs/DESIGN_SYSTEM.md`.
