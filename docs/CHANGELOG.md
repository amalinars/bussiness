# Changelog

## [Unreleased]

### Added

* Initial project documentation.
* Initial project context.
* Initial development rules.
* Initial app module planning.
* Initial design system documentation.
* Neo-brutalism design direction inspired by Saweria.
* Root AI agent documentation reading rules.
* Rule requiring documentation updates after every meaningful implementation task.
* Initial admin app shell for Dashboard, Customers, and Service Accounts.
* Reusable neobrutalist shell components for metric cards and status badges.
* App shell documentation.
* Initial database planning documentation for Customers and Service Accounts.
* Initial Supabase migration for Customers and Service Accounts.
* Initial TypeScript database types and status constants.
* Development history folder with dated markdown logs for preserving implementation decisions across agents.
* Type-safe Supabase client configuration for the `riztama_business` schema.
* Read-only data layer for Customers and Service Accounts.
* Supabase-backed admin Customers and Service Accounts list pages with shared empty/error states.
* Temporary read-only Supabase RLS `SELECT` policies for the two initial MVP tables.
* Manual seed SQL for Customers and Service Accounts local/VPS Supabase testing.
* Customer create, edit, and archive-only actions using neobrutalist dialog UI.
* Temporary Customer `INSERT` and `UPDATE` RLS policies for the current unauthenticated dev setup.
* Customer search and status filtering on the admin Customers list.

### Changed

* Documented that the initial database foundation intentionally uses only the `riztama_business.customers` and `riztama_business.service_accounts` tables.
* Clarified that future module tables such as platforms, subscriptions, payments, reminders, settings, and slot assignment are not part of the initial migration scope.
* Clarified that the dedicated database schema remains `riztama_business`, not the default public schema.
* Recorded that the initial migration was reviewed and intentionally left unchanged because it already matches the two-table database scope.
* Documented that development history should be stored as files under `docs/development-log/`.
* Current active MVP module scope narrowed to Dashboard, Customers, and Service Accounts.
* Sidebar navigation now reflects only the active MVP modules.
* App shell color usage reduced to a more restrained dashboard palette.
* Removed grid-pattern page background in favor of a calmer solid background.
* Updated database typing from the default public schema to the dedicated `riztama_business` schema.
* Marked Customers and Service Accounts pages as request-time rendered so Supabase reads are not executed during static prerendering.
* Updated global typography from Geist to Nunito body text and Fredoka headings for a friendlier dashboard feel.

### Removed

* None.
