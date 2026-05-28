<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Documentation Rules

Before making any project change, AI coding agents must read the relevant project documentation in `/docs`.

At minimum, read:

- `/docs/PROJECT_CONTEXT.md`
- `/docs/DEVELOPMENT_RULES.md`
- `/docs/APP_MODULES.md`
- `/docs/DESIGN_SYSTEM.md`
- `/docs/README_FOR_AI.md`

After every meaningful change, update or create the relevant documentation so future agents can understand the current context without needing special tags or extra prompting.

Do not continue feature implementation if the required documentation context is missing or outdated. Update the docs first.
