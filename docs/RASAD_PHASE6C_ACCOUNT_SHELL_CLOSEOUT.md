# RASAD Phase 6C Account Shell Closeout

## Status

Phase 6C account-shell foundation is complete and validated.

## Completed

- Dashboard shell now receives real authenticated user access from `getCurrentUserAccess()`.
- Sidebar footer shows real user email.
- Sidebar footer shows role and subscription tier.
- Logout button was added.
- Logout redirects to `/login`.
- Login redirects directly to `/dashboard/uae/recon` to avoid the `/dashboard` intermediate flicker.
- Admin-only navigation is hidden from non-admin users.
- Data Quality remains route-protected and admin-only.

## Verified Behavior

### Admin user

- `/dashboard/uae/recon` opens.
- `/dashboard/ksa/recon` opens.
- `/dashboard/uae/data-quality` opens.
- `/dashboard/ksa/data-quality` opens.
- `/dashboard/uae/ai-recon` redirects to `/upgrade`.
- `/dashboard/ksa/ai-recon` redirects to `/upgrade`.

### Market Command subscriber

- `/dashboard/uae/recon` opens.
- Sidebar shows real email and `Subscriber · Market Command`.
- Data Quality is hidden from the sidebar.
- `/dashboard/uae/data-quality` redirects to `/upgrade`.

## Commits

```text
b19efaa Add dashboard account identity and logout
a9e9120 Add account shell and direct login redirect