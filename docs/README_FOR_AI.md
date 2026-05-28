# README for AI Coding Assistants

This file defines rules for AI coding assistants working on this project.

## Required Behavior

- Always read the project docs before making changes.
- Treat root agent instruction files such as `AGENTS.md` and `CLAUDE.md` as automatic entry points for this rule.
- Do not require special user tags or prompts before reading the docs.
- Always update docs after meaningful changes.
- After every implementation task, update or create documentation for the changed context.
- Do not expand project scope without instruction.
- Do not implement integrations unless asked.
- Do not add authentication unless asked.
- Ask for the next step if the task is unclear.
- Keep implementation aligned with the current MVP.
- Prefer small incremental changes over large uncontrolled changes.
- Keep the UI aligned with the neobrutalist design system.
- Reuse existing component patterns before creating new ones.
- If changing UI patterns, update `/docs/DESIGN_SYSTEM.md`.

## Project Scope Reminders

- This is an internal subscription management dashboard.
- The app is not intended to integrate with Netflix or any streaming platform yet.
- The app does not automate access to any third-party service.
- Reminder features are initially admin-facing only.
- WhatsApp, Telegram, payment gateway, and other integrations may be added later, but not now.
- Authentication may be added later, but not now.

## Development Approach

- Make small, clear changes.
- Keep business logic simple and explicit.
- Keep UI components separated from data access logic.
- Keep Supabase-related logic inside `/lib` or dedicated service files.
- Use TypeScript types properly.
- Use shadcn/ui as the base component system.
- Apply the playful neo-brutalist style consistently.

## Documentation Updates

Update or create documentation when changing:

- Project scope
- App modules
- Database structure
- Business logic
- UI patterns
- Design system rules
- Integrations
- Architecture or project structure

If a change introduces new context that does not fit an existing document, create a new clear document inside `/docs`.
