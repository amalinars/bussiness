# Riztama Business

Internal web-based subscription management dashboard for managing digital subscription customers, service accounts, subscription slots, payments, expiration dates, and admin reminders.

The goal is to replace manual Excel-based tracking with a cleaner and more structured internal admin system.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Neobrutalism Components / neobrutalist UI style
- Supabase
- PostgreSQL via Supabase

## Project Status

Initial app shell foundation phase.

The active MVP shell currently includes Dashboard, Customers, and Service Accounts. Authentication, database schema, CRUD workflows, and third-party integrations are not included yet.

## Design Style

The application should use a playful neo-brutalism dashboard style inspired by Saweria:

- Thick black borders
- Hard offset shadows
- Flat pastel backgrounds
- Warm accent colors
- Rounded cards
- Chunky buttons
- Friendly admin dashboard feel

## Documentation

- [Project Context](./docs/PROJECT_CONTEXT.md)
- [Development Rules](./docs/DEVELOPMENT_RULES.md)
- [App Modules](./docs/APP_MODULES.md)
- [App Shell](./docs/APP_SHELL.md)
- [Design System](./docs/DESIGN_SYSTEM.md)
- [Changelog](./docs/CHANGELOG.md)
- [README for AI](./docs/README_FOR_AI.md)

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.
