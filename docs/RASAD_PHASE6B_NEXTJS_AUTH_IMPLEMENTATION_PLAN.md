# RASAD Phase 6B Next.js Auth Implementation Plan

## 1. Current Inspected State

RASAD has completed Phase 5H and Phase 6A.

Phase 5H status:

- Supabase ingestion works.
- Supabase dashboard reads work and are fast.
- Frontend reads Supabase first through server-side adapters.
- Local JSON fallback remains.
- `lib/data/supabaseServer.ts` is server-only and currently uses `SUPABASE_SERVICE_ROLE_KEY` for dashboard-safe delivery table reads.
- The service role key must remain server-only and must never be exposed to browser/client code.

Phase 6A status:

- `supabase/sql/002_auth_entitlements_schema.sql` was committed and manually applied through Supabase SQL Editor.
- These tables exist:
  - `public.user_profiles`
  - `public.user_subscriptions`
  - `public.user_entitlements`
  - `public.subscription_events`
- RLS is enabled on all 4 tables.
- Authenticated self-read `SELECT` policies exist for:
  - `user_profiles`
  - `user_subscriptions`
  - `user_entitlements`
- `subscription_events` has no subscriber/user read policy.
- No anon/public policies were added.
- Existing dashboard delivery tables were not modified.

Current frontend state:

- `package.json` has no Supabase Auth packages yet.
- There is no root `middleware.ts`.
- There is no login page.
- There is no upgrade page.
- There is no auth/session helper.
- There is no entitlement helper.
- `app/dashboard/[country]/[section]/page.tsx` is currently the main dashboard section router and is not protected.
- `lib/countries/productNavigation.ts` contains the real section slugs, `internalOnly`, `isHidden`, and `navGroup` metadata.
- `components/DashboardLayout.tsx` controls dashboard visual navigation, but it is not yet entitlement-aware.
- Phase 6 / AI remains paused.

## 2. Recommended Packages

Install the standard Supabase packages for Next.js App Router auth:

```text
@supabase/ssr
@supabase/supabase-js
```

Why:

- `@supabase/ssr` is the official Supabase package for cookie-based auth in SSR / App Router flows.
- `@supabase/supabase-js` is the core client required for auth calls.
- This allows browser login/logout while keeping dashboard data reads server-side.

Do not install auth packages until the implementation patch is explicitly approved.

## 3. Environment Variables Needed

Use variable names only. Do not expose values.

Required public browser-safe variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Existing server-only variables:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Rules:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to expose.
- `SUPABASE_SERVICE_ROLE_KEY` is not safe to expose.
- `SUPABASE_SERVICE_ROLE_KEY` must remain only in server-side `.env.local`.
- Never paste, commit, print, or log real keys.

## 4. New Files to Create

Recommended new files for the implementation phase:

```text
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
lib/auth/sessionHelper.ts
lib/auth/entitlementHelper.ts
middleware.ts
app/(auth)/login/page.tsx
app/upgrade/page.tsx
```

### `lib/supabase/client.ts`

Purpose:

- Browser-side Supabase client for login/logout/auth UI only.
- Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Must not access dashboard delivery tables directly.
- Must never use the service role key.

### `lib/supabase/server.ts`

Purpose:

- Server-side Supabase client using cookie/session context.
- Used for reading the authenticated user's own profile, subscription, and entitlement rows.
- Uses the user session/JWT path, not the service role key.

### `lib/supabase/middleware.ts`

Purpose:

- Supabase middleware helper for cookie/session refresh.
- Keeps auth cookies current for App Router requests.

### `lib/auth/sessionHelper.ts`

Purpose:

- Server-only helper for loading the current authenticated user and access records.
- Reads:
  - `user_profiles`
  - `user_subscriptions`
  - `user_entitlements`
- Should return a normalized access object for route checks.

### `lib/auth/entitlementHelper.ts`

Purpose:

- Pure server-compatible helper for determining access to a country and section.
- Takes normalized user access, country slug, and section slug.
- Returns allow/deny plus a reason.

### `middleware.ts`

Purpose:

- Refresh Supabase session cookies.
- Optionally redirect unauthenticated `/dashboard` requests to `/login`.
- Keep fine-grained tier/country authorization in the server route/helper, not only middleware.

### `app/(auth)/login/page.tsx`

Purpose:

- Minimal login page.
- Start with email/password or magic link based on final auth decision.
- Redirect successful login to `/dashboard`.

### `app/upgrade/page.tsx`

Purpose:

- Minimal upgrade/access-denied page.
- Explain that the requested section requires a higher tier or country entitlement.
- No Stripe logic in the first auth implementation.

## 5. Existing Files to Patch Later

Expected files to patch during implementation:

```text
package.json
package-lock.json
app/dashboard/[country]/[section]/page.tsx
app/dashboard/layout.tsx
components/DashboardLayout.tsx
```

Potentially patch only after inspection:

```text
app/layout.tsx
app/dashboard/page.tsx
lib/countries/productNavigation.ts
```

Rules:

- Do not patch more files than necessary in one step.
- Keep patches small and validated.
- Do not modify data adapters unless entitlement checks require a new parameter later.
- Do not modify `lib/data/supabaseServer.ts` unless required for a verified security/performance issue.
- Do not touch Module 6 / AI.

## 6. Auth / Session Architecture

Use cookie-based Supabase Auth.

Recommended flow:

```text
browser login page
-> Supabase Auth creates session cookie
-> middleware refreshes session cookies
-> server route reads current session
-> server helper loads profile/subscription/entitlements
-> entitlement helper checks requested country + section
-> data adapter runs only if access is allowed
```

Separation of concerns:

- Browser Supabase client handles login/logout only.
- Server Supabase auth client reads user-specific auth tables.
- Existing `lib/data/supabaseServer.ts` continues to load dashboard-safe delivery data server-side.
- Page/server route enforces access before calling data adapters.

Do not use browser-side Supabase reads for paid dashboard data.

## 7. Entitlement Architecture

Access should be a three-lock system.

### Lock 1 — Authentication

Question:

```text
Is there a valid authenticated user?
```

If no:

```text
redirect to /login
```

### Lock 2 — Country entitlement

Question:

```text
Can this user access the requested country?
```

Country values:

```text
uae
ksa
gcc
```

Rules:

- `uae` grants UAE routes.
- `ksa` grants KSA routes.
- `gcc` grants both UAE and KSA routes.
- `admin` overrides country restrictions.

If not allowed:

```text
redirect to /upgrade
```

### Lock 3 — Section / tier entitlement

Question:

```text
Can this user access the requested dashboard section?
```

Tier concepts:

```text
free
opportunities
market_command
gcc
admin
```

Access rules:

- `free`: optional teaser only, final behavior TBD.
- `opportunities`: tactical modules.
- `market_command`: tactical + strategic modules.
- `gcc`: multi-country access concept, still must align with country entitlements.
- `admin`: all internal access.

The entitlement helper should centralize this logic in one place.

## 8. Route Protection Strategy

The main route to protect is:

```text
app/dashboard/[country]/[section]/page.tsx
```

Required behavior:

1. Resolve `country` and `section`.
2. Validate country/section exist.
3. Load current user access.
4. If unauthenticated, redirect to `/login`.
5. If authenticated but not entitled, redirect to `/upgrade`.
6. Only after access is allowed, call:
   - `getUaeReconData`
   - `getKsaReconData`
   - `getModule5Data`
   - `getModule6Data`
   - `getExportHealthData`

This is critical because both Supabase reads and local JSON fallback must stay behind the same entitlement check.

Middleware can provide perimeter protection, but it should not be the only protection layer.

## 9. Navigation / UI Gating Strategy

Navigation gating should be added after route protection works.

Use `lib/countries/productNavigation.ts` as the source for section metadata.

Rules:

- `data-quality` should be visible only to `admin`.
- `ai-recon` should remain hidden or disabled globally until Module 6 is formally launched.
- Paid locked sections may be shown with a lock/upgrade badge or hidden depending on UX strategy.
- Do not rely on navigation hiding as a security control.
- Route protection remains the true security layer.

Recommended MVP behavior:

- Hide `data-quality` from non-admin users.
- Hide or disable `ai-recon` for everyone.
- Show locked paid sections with an upgrade badge only after route protection is secure.
- Keep navigation changes small and testable.

## 10. Login and Upgrade Page Scope

### Login page

Create:

```text
app/(auth)/login/page.tsx
```

MVP scope:

- Simple email/password or magic-link form.
- No complex branding required initially.
- Redirect authenticated users to `/dashboard`.
- Show simple error messages.
- Do not include billing logic.

### Upgrade page

Create:

```text
app/upgrade/page.tsx
```

MVP scope:

- Explain that the requested section requires a higher tier or country access.
- Include contact/support CTA or manual upgrade instruction.
- No Stripe integration yet.
- No pricing decisions yet.

Pricing is intentionally TBD and should be handled in a separate pricing strategy chat.

## 11. Manual Provisioning Flow for Private Beta

Before Stripe, provision users manually.

Recommended flow:

1. User signs up or admin creates user in Supabase Auth.
2. Copy the Supabase Auth user UUID.
3. Insert a row into `public.user_profiles`.
4. Insert a row into `public.user_subscriptions`.
5. Insert one or more rows into `public.user_entitlements`.
6. User logs in.
7. Route protection reads the user access records.
8. Dashboard access follows the entitlement matrix.

Example provisioning concepts:

```text
role = subscriber
subscription_tier = opportunities or market_command
status = active
country = uae, ksa, or gcc
is_active = true
```

Do not automate billing until manual provisioning and route protection are verified.

## 12. Security Rules

Mandatory security rules:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Never import service-role helpers into client components.
- Do not add browser-side direct reads for dashboard delivery tables.
- Do not add public anon `SELECT` policies.
- Do not expose raw scraper vaults, SQLite internals, or backend evidence.
- Do not let local JSON fallback bypass entitlement checks.
- Do not rely on navigation hiding for security.
- Keep `subscription_events` admin/server-only.
- Keep Module 6 / AI paused.
- Avoid static caching for personalized/gated dashboard routes after auth is added.

## 13. Exact Implementation Sequence

Follow this order.

### Step 1 — Package install only

Install:

```text
@supabase/ssr
@supabase/supabase-js
```

Then run:

```text
npm run lint
npx tsc --noEmit
npm run build
```

Commit package changes only if validation passes.

### Step 2 — Supabase auth client helpers

Create:

```text
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
```

Validate build.

### Step 3 — Root middleware

Create:

```text
middleware.ts
```

Purpose:

- Refresh auth cookies.
- Optionally redirect unauthenticated dashboard requests.
- Avoid complex tier logic in middleware.

Validate build and basic route access.

### Step 4 — Session/access helper

Create:

```text
lib/auth/sessionHelper.ts
```

It should return a normalized user access object.

Validate with logged-in and logged-out states.

### Step 5 — Entitlement helper

Create:

```text
lib/auth/entitlementHelper.ts
```

It should implement:

```text
canAccessDashboardSection(userAccess, country, section)
```

Validate with unit-like manual checks or simple console-safe temporary testing.

### Step 6 — Protect dashboard route

Patch:

```text
app/dashboard/[country]/[section]/page.tsx
```

Check entitlement before calling data adapters.

Validate:

- unauthenticated redirect
- wrong country redirect
- wrong tier redirect
- admin access
- no unauthorized data fetch

### Step 7 — Login page

Create:

```text
app/(auth)/login/page.tsx
```

Validate login works.

### Step 8 — Upgrade page

Create:

```text
app/upgrade/page.tsx
```

Validate unauthorized users are redirected there.

### Step 9 — Navigation gating

Patch:

```text
components/DashboardLayout.tsx
```

Possibly patch:

```text
app/dashboard/layout.tsx
```

Only after route protection is already working.

### Step 10 — Manual provisioning test

Create test users and access rows manually in Supabase.

Test:

- inactive
- opportunities + UAE
- market_command + KSA
- GCC
- admin

### Step 11 — Commit in small batches

Each batch should pass:

```text
npm run lint
npx tsc --noEmit
npm run build
git status --short
```

## 14. Validation Checklist

Before declaring Phase 6B complete:

- User without a session is redirected to `/login`.
- Logged-in inactive user cannot access paid dashboard sections.
- UAE-only user cannot access KSA routes.
- KSA-only user cannot access UAE routes.
- Opportunities-tier user cannot access Market Command sections.
- Market Command user can access tactical and strategic sections for entitled countries.
- Admin user can access `data-quality`.
- Non-admin users cannot access `data-quality`.
- `ai-recon` remains inaccessible or feature-flagged off.
- Unauthorized routes do not call data adapters.
- Local JSON fallback is not served to unauthorized users.
- Browser JavaScript does not contain `SUPABASE_SERVICE_ROLE_KEY`.
- Network tab does not show service role credentials.
- No public anon `SELECT` policy exposes dashboard delivery tables.
- Build passes.
- Typecheck passes.
- Lint passes.

## 15. What Not To Build Yet

Do not build yet:

- Stripe Checkout.
- Stripe webhooks.
- Billing portal.
- Team/organization accounts.
- Invite links.
- Seat management.
- Customer public API.
- Customer API keys.
- Module 6 / AI access.
- pgvector production search.
- AI chat UX.
- Per-city, per-community, or per-row entitlements.
- Public read policies for dashboard delivery tables.
- Browser-side direct reads for paid dashboard tables.

Keep pricing as TBD for now.
