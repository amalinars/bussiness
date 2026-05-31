# 2026-05-31 Sticky Sidebar

## Summary

Updated the desktop admin sidebar so it stays pinned to the viewport while page content scrolls.

## Changes

- Made the desktop sidebar `sticky` at the top of the viewport.
- Set desktop sidebar height to `h-screen`.
- Added sidebar internal vertical scrolling for overflowed navigation content.
- Preserved the mobile sidebar trigger and collapsible behavior.

## Verification

Run:

- `npm run lint`
- `npm run build`

Manual checks:

- On desktop, scroll page content and confirm sidebar stays visible.
- On mobile, confirm the menu trigger still opens and closes the sidebar.
