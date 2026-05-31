# 2026-05-31 Finance Page Fixes

## Summary

Fixed the admin Financials page so it follows the Next.js Server/Client Component boundary and the existing neobrutalist dashboard patterns.

## Changes

- Moved month filter interactivity into `app/admin/finance/FinanceMonthFilter.tsx` as a small Client Component.
- Kept the Financials page itself server-rendered for Supabase aggregate loading through `lib/finance.ts`.
- Reused existing `StatusBadge` tones instead of passing unsupported finance-specific tones.
- Changed the expense dialog to keep validation/server errors visible and only close after successful `useActionState` completion.
- Cleaned finance chart and finance data helpers for stricter TypeScript/lint compatibility.
- Documented Financials as an active MVP module in `docs/APP_MODULES.md`.

## Verification

Run after implementation:

- `npm run lint`
- `npm run build`

Manual checks recommended:

- `/admin/finance` loads without Server Component event-handler errors.
- Month filter updates the URL and filtered metrics/ledger.
- Expense form stays open on validation errors and closes after a successful save.
- Expense cancel action revalidates finance/dashboard/account data.
- Finance chart renders when monthly data exists.
