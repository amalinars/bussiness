# Design System

## Overall Style

The application uses a playful neo-brutalism dashboard style inspired by Saweria.

This style gives the internal admin tool a memorable identity while keeping the interface practical for daily business operations.

The UI should feel friendly, clear, and direct. It should not feel overly corporate, but it also should not become childish, visually messy, or overly colorful.

## Core Visual Principles

- Thick black borders
- Hard offset shadows
- Flat colors
- Warm restrained accent colors
- Rounded cards
- Chunky buttons
- Clear layout hierarchy
- Simple readable typography
- Comfortable spacing
- Solid page backgrounds without grid patterns

## Component Style Guidelines

### Cards

- Use thick black borders.
- Use hard offset shadows.
- Use rounded corners.
- Use flat white, pastel, or warm backgrounds.
- Prefer neutral card backgrounds for dense dashboard surfaces.
- Keep content grouped clearly.
- Avoid nested cards unless there is a strong reason.

### Buttons

- Use chunky button sizing.
- Use thick black borders.
- Use strong hover and active states.
- Use hard offset shadows where appropriate.
- Primary actions should be visually clear.
- Destructive actions should be obvious and used carefully.

### Inputs

- Use clear labels.
- Use thick borders.
- Keep field spacing comfortable.
- Use simple validation states.
- Avoid decorative styling that hurts readability.

### Tables

- Use strong row and column separation.
- Keep headers clear.
- Use status badges for scanability.
- Keep actions predictable and aligned.
- Avoid overcrowding table rows.

### Badges

- Use badges for statuses such as active, expired, paid, unpaid, overdue, available, and full.
- Keep badge colors consistent.
- Use strong contrast and readable text.
- Avoid too many status colors.
- Use softer status tones instead of highly saturated fills.

### Empty States

- Use friendly but practical empty states.
- Explain what is missing in simple language.
- Provide a clear next action when appropriate.
- Keep the same border, shadow, and color language as the rest of the app.

### Sidebar

- Keep navigation clear and scannable.
- Use consistent active states.
- Use neobrutalist borders or separators where appropriate.
- Avoid excessive decoration.
- Only show active MVP modules in the sidebar.
- Use chunky bordered navigation items with hard offset shadows.

### Header

- Keep the header focused on context, page title, and primary actions.
- Use clear hierarchy.
- Avoid large marketing-style hero treatments inside the admin dashboard.
- Use compact scope or status badges when useful.

### Metric Cards

- Use bold numbers and clear labels.
- Use warm accent colors sparingly to highlight important states.
- Keep layout stable and easy to scan.
- Use consistent card sizing where possible.

### Status Badges

- Use `StatusBadge` for compact state labels.
- Keep badges bordered, readable, and visually consistent.
- Prefer a small set of tones: neutral, active, warning, and info.
- Keep badge colors subdued so tables and dashboards remain easy to scan.

### Page Containers

- Use `PageContainer` for dashboard pages.
- Keep page headings, descriptions, and optional eyebrow labels consistent.
- Do not create large marketing-style hero sections inside the admin dashboard.

## Consistency Rules

- Reuse existing component patterns before creating new ones.
- Use shadcn/ui as the base component system.
- Apply neobrutalist styling through reusable component patterns.
- Do not mix unrelated visual styles.
- Keep borders, shadows, spacing, and color usage consistent.
- Keep typography simple and readable.
- Use playful details only when they support usability.
- Reuse `MetricCard`, `StatusBadge`, `EmptyState`, and `PageContainer` for current dashboard shell work.
- Keep most large surfaces neutral. Reserve stronger colors for active navigation, small icons, and compact status indicators.
- Do not use grid-pattern page backgrounds; they make the dashboard harder to read during daily admin work.

## Creating New Components

When creating new components, developers must follow this design system.

New components should be reusable, typed, and visually aligned with the existing neobrutalist dashboard language.

If a new pattern is introduced, document it here.

## Design Changes

If the design style changes, this document must be updated in the same change.
