# Development Rules

## Documentation Rules

- AI coding agents must read the relevant `/docs` files before making changes.
- Root agent instruction files must point agents to the project documentation automatically.
- The project should not depend on special tags or manual reminders for agents to read documentation.
- Every meaningful change must update the relevant documentation.
- After every implementation task, update or create documentation for the changed context.
- If a new module is added, create or update the related documentation.
- If database structure changes, update database-related docs.
- If business logic changes, update business rules docs.
- If project structure changes, update architecture docs.
- If UI or design system changes, update design-related docs.
- If neobrutalist component patterns change, update the design documentation.
- If a new integration is added, create an integration-specific doc.
- If a change creates new context that does not fit an existing doc, create a new doc inside `/docs`.
- Do not leave outdated documentation.
- Documentation should be written clearly and simply.

## Coding Rules

- Keep code modular.
- Do not put everything in one file.
- Prefer reusable components.
- Use TypeScript types properly.
- Avoid unnecessary complexity.
- Use clear naming.
- Keep UI components separated from data access logic.
- Keep Supabase-related logic inside `/lib` or dedicated service files.
- Avoid hardcoded business rules when possible.
- Use constants for repeated values like statuses.
- Reuse existing UI components before creating new ones.
- Keep neobrutalist styling consistent across pages.
- Do not mix too many visual styles.
- Use shadcn/ui as the base component system.
- Apply neobrutalist styling through reusable component patterns.

## Design Rules

- Use thick black borders consistently.
- Use hard offset shadows consistently.
- Use flat pastel or warm background colors.
- Use chunky button styles.
- Use clear status badges.
- Use simple, readable typography.
- Keep spacing clean and comfortable.
- Do not make the UI too childish or messy.
- The UI should be playful but still usable as a business dashboard.
- Dashboard cards, empty states, tables, buttons, and sidebar items should follow the same neobrutalist visual language.

## Project Scope Rules

- Do not add authentication unless specifically requested.
- Do not add Netflix integration unless specifically requested.
- Do not add WhatsApp API integration unless specifically requested.
- Do not add Telegram bot integration unless specifically requested.
- Do not add payment gateway integration unless specifically requested.
- Do not store service account passwords in plain text.
- Do not build full CRUD before the setup and documentation are completed.
