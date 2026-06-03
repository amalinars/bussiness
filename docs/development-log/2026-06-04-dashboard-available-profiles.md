# 2026-06-04 — Dashboard Available Profiles

## Summary

Added a dashboard section for currently available rentable service account profiles with quick edit access.

## Changes

- Dashboard data now loads up to 12 `available` and rentable service account profiles with their parent account label and service name.
- Dashboard renders an `Available Profiles` card using the existing neobrutalist card style.
- Each available profile row shows profile name, account, service, PIN, status, and notes when present.
- The dashboard quick edit button reuses the existing `ServiceAccountProfileFormDialog` from the account detail profile workflow.
- Profile create, update, and archive actions now also revalidate `/admin/dashboard` so profile availability changes are reflected on the dashboard.

## Notes

The dashboard quick edit intentionally does not include archive/destructive actions. Full profile management remains on the service account detail page.

## Verification

Run:

- `npm run lint`
- `npm run build`
