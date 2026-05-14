# RASAD_AUTH_RLS_SUBSCRIPTION_PLAN.md

## 1. Current State

RASAD has completed Phase 5H for UAE and KSA Modules 1–5 dashboard delivery.

Current verified architecture:

- The local PC remains the backend data factory.
- Supabase is the dashboard-safe delivery warehouse/API layer.
- Supabase currently stores these dashboard-safe delivery tables:
  - `ingestion_runs`
  - `export_manifests`
  - `recon_opportunities`
  - `module5_market_intelligence`
- Approved frontend-safe JSON exports are generated under `exports/frontend`.
- Supabase ingestion scripts write approved frontend-safe data into Supabase.
- Frontend dashboard reads are server-side.
- Current frontend adapters read Supabase first and fall back to local JSON:
  - `lib/data/uaeRecon.ts`
  - `lib/data/ksaRecon.ts`
  - `lib/data/module5.ts`
- Shared server-side Supabase read helper:
  - `lib/data/supabaseServer.ts`
- Current dashboard route:
  - `app/dashboard/[country]/[section]/page.tsx`
- Product navigation:
  - `lib/countries/productNavigation.ts`
- Phase 6 / AI vectors / pgvector / AI chat are paused.
- Auth, subscription roles, RLS policies, billing, and user entitlement checks are not implemented yet.

Important current security state:

- The dashboard must not be considered public-production-ready until auth and entitlement checks are implemented.
- The Supabase service role key must never be exposed to browser/client code.
- Raw scraper vaults, SQLite internals, private evidence stores, and backend working tables must never be exposed to customers.

## 2. MVP Auth Decision

Use **Supabase Auth** first.

Reasons:

- RASAD already uses Supabase as the delivery warehouse.
- Supabase Auth integrates cleanly with Supabase user IDs and future RLS policies.
- It avoids adding another identity provider too early.
- It is beginner-safe for a solo builder compared with custom auth.
- It supports email/password and magic-link flows.

Recommended MVP auth method:

- Start with email/password or magic link.
- Keep OAuth optional for later.
- Do not build a custom auth server.
- Do not add team/organization seat management in the first implementation pass.

The first auth goal is simple:

```text
Only authenticated and entitled users can access dashboard sections.
```

## 3. MVP User Roles

Keep the role model minimal.

| Role | Purpose |
| --- | --- |
| `admin` | Internal operator role. Full access to all countries, all sections, data-quality pages, and operational views. |
| `subscriber` | Paid or manually provisioned customer. Access is controlled by subscription tier and country entitlement. |
| `trial` | Temporary access role. Can be treated like a limited or full paid tier until `trial_expires_at`. |
| `inactive` | Logged-in user without active access. Can access account/login/upgrade pages only. |

Avoid these for MVP:

- Multi-seat teams.
- Organization roles.
- Viewer/editor/admin roles inside customer accounts.
- Per-city or per-community permissions.
- Per-row paid limits.

One user should equal one subscription during MVP.

## 4. MVP Subscription Tiers

Pricing is intentionally **TBD**. Final pricing should be handled in a separate pricing strategy chat.

For now, define tiers by access level, not by fixed price.

| Tier | Price | Access Concept |
| --- | --- | --- |
| `free` | TBD | Limited teaser access. Recommended: UAE Recon only, or no dashboard access depending on launch strategy. |
| `opportunities` | TBD | Tactical lead-generation modules. |
| `market_command` | TBD | Strategic market, inventory, dominance, agency, community, and building intelligence. |
| `gcc` | TBD | Multi-country access across UAE and KSA. |
| `admin` | Internal | Internal operator access only. Not sold. |

Recommended product grouping:

### Opportunities Tier

Tactical, daily-action modules:

- `recon`
- `owner-direct`
- `price-drops`
- `listing-age`

### Market Command Tier

Strategic intelligence modules:

- Everything in Opportunities
- `activity-feed`
- `inventory-pressure`
- `market-dominance`
- `agency-profiles`
- `communities`
- `buildings`
- `market-radar`
- `competitor-radar`

### Paused / Not Sold Yet

- `ai-recon`
- Module 6 / AI vector features
- Public API access
- Enterprise team features

## 5. Country Entitlement Model

RASAD should use a country entitlement model separate from feature tier.

Supported country entitlements at MVP:

| Entitlement | Meaning |
| --- | --- |
| `uae` | User can access UAE dashboard sections allowed by their tier. |
| `ksa` | User can access KSA dashboard sections allowed by their tier. |
| `gcc` | User can access both UAE and KSA sections allowed by their tier. |

Examples:

```text
opportunities + uae = UAE tactical modules only
market_command + ksa = KSA tactical + strategic modules only
market_command + gcc = UAE + KSA tactical + strategic modules
```

The page/server route must check both:

```text
1. Is the user authenticated?
2. Is the user entitled to this country?
3. Is the user entitled to this dashboard section?
```

If not allowed:

- Redirect unauthenticated users to `/login`.
- Redirect authenticated but unauthorized users to `/upgrade`, or show a clean “Upgrade required” page.

## 6. Dashboard Section Entitlement Matrix

This matrix should be implemented in a server-side helper later, not hardcoded randomly inside UI components.

| Section Slug | Free | Opportunities | Market Command | GCC | Admin | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `recon` | Optional UAE teaser | Yes | Yes | Yes | Yes | Core tactical feed. |
| `owner-direct` | No | Yes | Yes | Yes | Yes | Tactical lead module. |
| `price-drops` | No | Yes | Yes | Yes | Yes | Tactical lead module. |
| `listing-age` | No | Yes | Yes | Yes | Yes | Truth/refresh signal module. |
| `activity-feed` | No | No | Yes | Yes | Yes | Module 5 strategic feed. |
| `inventory-pressure` | No | No | Yes | Yes | Yes | Module 5 strategic signal. |
| `market-dominance` | No | No | Yes | Yes | Yes | Module 5 strategic signal. |
| `agency-profiles` | No | No | Yes | Yes | Yes | Module 5 strategic signal. |
| `communities` | No | No | Yes | Yes | Yes | Strategic location intelligence. |
| `buildings` | No | No | UAE only / as available | UAE only / as available | Yes | KSA building coverage may be unavailable/hidden. |
| `market-radar` | No | No | Yes | Yes | Yes | Combined strategic workspace. |
| `competitor-radar` | No | No | Yes | Yes | Yes | Combined strategic workspace. |
| `data-quality` | No | No | No | No | Yes | Internal operational route only. |
| `ai-recon` | No | No | No | No | Feature-flagged later | Keep paused until Phase 6 guardrails. |

Country entitlement still applies. A user with UAE access cannot access KSA routes unless they also have KSA/GCC entitlement.

## 7. Supabase RLS Strategy

Current delivery tables already have RLS enabled in the Phase 5H schema.

Correct MVP strategy:

- Keep RLS enabled on dashboard-safe delivery tables.
- Do **not** add public `anon` SELECT policies.
- Do **not** expose dashboard-safe tables to browser-side Supabase reads.
- Do **not** use the service role key in client components.
- Do **not** rely on RLS as the only entitlement layer while using server-side service-role reads.

The primary MVP access-control layer should be:

```text
Next.js server-side entitlement check before data loading.
```

Meaning:

1. The dashboard page/server route verifies the session.
2. It reads the user’s role, tier, country entitlements, and trial status.
3. It checks whether the requested `country` and `section` are allowed.
4. Only then does it call the existing data adapters.

RLS remains defense-in-depth:

- It blocks accidental anonymous/browser access.
- It protects user/account/subscription tables.
- It becomes more important later if RASAD moves to user-JWT Supabase reads or public API access.

For MVP, avoid complex RLS policies on large delivery tables until the product, tiers, and entitlements are stable.

## 8. Server-Side Read Strategy

Keep dashboard data fetching server-side.

Current `lib/data/supabaseServer.ts` can continue to use the service role key **only on the server** while the page route enforces entitlement first.

Important rules:

- The service role key must remain server-only.
- The service role key must not be available to browser/client bundles.
- Do not import `supabaseServer.ts` into client components.
- Do not add `"use client"` to files that read from Supabase with service role credentials.
- Do not expose raw Supabase URLs containing credentials, headers, or keys.

Recommended MVP flow:

```text
request -> auth/session check -> entitlement check -> server-side data adapter -> dashboard component
```

Adapters should stay mostly as data loaders. They should not become the main business-policy engine unless needed later.

The route/layout layer should enforce:

```text
user -> tier -> country -> section
```

Local JSON fallback must remain available, but it must never bypass entitlement checks. If fallback data is used, it should only be served after the same server-side access check has passed.

## 9. Proposed Future Tables

Add minimal auth/subscription tables later. Do not patch SQL yet until the implementation phase.

Recommended future tables:

### `user_profiles`

Purpose:

- Links Supabase Auth user ID to RASAD app profile.
- Stores app role and minimal account metadata.

Possible fields later:

```text
id uuid primary key references auth.users(id)
email text
display_name text
role text
created_at timestamptz
updated_at timestamptz
```

RLS principle:

- User can read their own profile.
- User must not be able to update sensitive fields such as `role`.

### `user_subscriptions`

Purpose:

- Stores subscription state and tier.

Possible fields later:

```text
id uuid primary key
user_id uuid references auth.users(id)
subscription_tier text
status text
trial_expires_at timestamptz
stripe_customer_id text
stripe_subscription_id text
created_at timestamptz
updated_at timestamptz
```

RLS principle:

- User can read their own subscription.
- User must not be able to update `subscription_tier`, `status`, `trial_expires_at`, Stripe IDs, or entitlement fields.
- Only server-side admin/webhook/service role updates subscription fields.

### `user_entitlements`

Purpose:

- Stores country access separately from tier.

Possible fields later:

```text
id uuid primary key
user_id uuid references auth.users(id)
country text
is_active boolean
starts_at timestamptz
ends_at timestamptz
created_at timestamptz
updated_at timestamptz
```

RLS principle:

- User can read their own entitlements.
- User cannot modify entitlements.
- Only server-side admin/webhook/service role can modify entitlements.

### `subscription_events`

Purpose:

- Audit trail for provisioning, upgrades, downgrades, cancellations, trial starts, manual overrides, and webhook processing.

RLS principle:

- Admin/service role only.
- Not visible to standard subscribers.

Do not store:

- Supabase keys.
- Stripe secrets.
- backend secrets.
- raw scraper evidence.
- raw portal data.
- private backend paths that are not needed by the app.

## 10. What Not To Build Yet

Do not build these in the first auth phase:

- Team/organization accounts.
- Seat management.
- Invite flows.
- Complex RBAC inside customer organizations.
- Per-city, per-community, or per-row entitlements.
- Public API access.
- API keys for customers.
- Module 6 / AI production access.
- pgvector production search.
- AI chat billing.
- Automated email campaigns.
- Complex admin dashboards.
- Browser-side direct Supabase reads for paid dashboard tables.
- Public read policies for dashboard delivery tables.

Billing should also be kept simple at first:

- Start with manual provisioning or a minimal Stripe Checkout/webhook flow.
- Do not build a full billing portal until the gated dashboard works.
- Pricing values should be finalized in a separate pricing strategy session.

## 11. Exact Implementation Order

Follow this order. Do not skip ahead to billing or Module 6.

### Step 1 — Auth planning freeze

Finalize:

- user roles
- tier names
- country entitlement names
- section entitlement matrix
- login/upgrade redirect behavior

### Step 2 — Minimal auth package decision

Choose the exact Supabase Auth integration approach for Next.js.

Likely options:

- Supabase SSR helpers for Next.js.
- Manual cookie/session helper using Supabase-supported server tools.

Do not install packages until the exact implementation plan is reviewed.

### Step 3 — Create auth/subscription SQL migration

Create a new migration file later for:

- `user_profiles`
- `user_subscriptions`
- `user_entitlements`
- optional `subscription_events`

Do not modify the existing Phase 5H dashboard delivery schema unless needed.

### Step 4 — Add server-side auth/session helper

Create a server-only helper that can answer:

```text
Who is the current user?
Are they authenticated?
What role do they have?
What subscription tier do they have?
Which countries can they access?
Is trial access active?
```

### Step 5 — Add entitlement helper

Create a central helper such as:

```text
canAccessDashboardSection(userAccess, country, section)
```

This helper should implement the entitlement matrix.

### Step 6 — Protect dashboard route

Update:

```text
app/dashboard/[country]/[section]/page.tsx
```

The route should check entitlement before calling:

```text
getUaeReconData
getKsaReconData
getModule5Data
getModule6Data
getExportHealthData
```

### Step 7 — Add login and upgrade pages

Add simple pages only:

- `/login`
- `/upgrade`

Do not build complex account management yet.

### Step 8 — Manual provisioning first

For the first private beta, manually provision test users in Supabase tables.

Only after this works, add Stripe Checkout/webhooks.

### Step 9 — Validate security

Test:

- unauthenticated access
- wrong country access
- wrong tier access
- admin-only access
- fallback path access
- no client exposure of service role key

### Step 10 — Billing integration later

Only after route protection and entitlement checks are stable:

- add Stripe Checkout
- add webhook handling
- add subscription event logs
- add upgrade/downgrade handling

## 12. Validation Checklist

Before declaring the auth/RLS/subscription phase complete:

- Unauthenticated users cannot access dashboard routes.
- Login works.
- Logged-in inactive users cannot access paid sections.
- A free/teaser user cannot access paid modules.
- UAE-only users cannot access KSA routes.
- KSA-only users cannot access UAE routes.
- GCC users can access both UAE and KSA routes according to their tier.
- Opportunities-tier users cannot access Market Command sections.
- Market Command users can access tactical and strategic sections.
- Admin users can access `data-quality`.
- `ai-recon` remains blocked or feature-flagged off.
- Local JSON fallback still respects entitlement checks.
- Service role key is not visible in browser JavaScript.
- Network tab does not show service role credentials.
- Raw scraper vaults and SQLite internals are not reachable.
- No public `anon` SELECT policy exposes dashboard delivery tables.
- Build, lint, and typecheck pass.

## 13. Risks and Safeguards

| Risk | Safeguard |
| --- | --- |
| Service role key exposed to browser | Keep Supabase reads in server-only helpers. Never import service-role helpers into client components. |
| Entitlement bypass through fallback JSON | Always check entitlement before calling data adapters, regardless of Supabase or local JSON source. |
| Overcomplicated RLS slows launch | Use server-side route entitlement checks for MVP and keep RLS as defense-in-depth. |
| Users edit their own subscription tier | Users must not have update permission on entitlement or billing fields. Only admin/webhook/service role can update them. |
| Wrong country data shown | Centralize country entitlement checks and test UAE-only/KSA-only/GCC users. |
| Next.js caching leaks user-specific gated data | Avoid static caching for personalized/gated routes after auth is added. Use dynamic server-side checks. |
| Module 6 accidentally exposed | Keep `ai-recon` blocked behind entitlement plus feature flag until Phase 6 is formally launched. |
| Stripe/webhook complexity delays launch | Start with manual provisioning for private beta, then add Stripe after access control works. |
| Public API requested too early | Do not launch API access until auth, RLS, rate limiting, and abuse controls exist. |

## 14. Save Location

Save this plan as:

```text
docs/RASAD_AUTH_RLS_SUBSCRIPTION_PLAN.md
```

This is a planning document only. It should not modify code, SQL, packages, or environment variables.
