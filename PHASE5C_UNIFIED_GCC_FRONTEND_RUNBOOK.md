# PHASE5C_UNIFIED_GCC_FRONTEND_RUNBOOK.md

## Project

PropIntel GCC / Recon Hub SaaS Dashboard MVP

Frontend project root:

```text
C:\Users\User\Documents\malesh\re-dashboard
```

## Phase status

Phase 5C — Unified GCC Frontend Shell is complete.

The frontend has been upgraded from a UAE-only Recon Hub dashboard shell into a unified UAE + KSA country-aware SaaS dashboard structure.

This phase did **not** connect Supabase, auth, Stripe, subscriptions, billing, or live data.

---

## Current product direction

This is one unified GCC real estate intelligence SaaS platform.

Launch countries:

```text
UAE
KSA
```

Both countries share the same backend/product family:

```text
Module 0 — Active Listings Unified Foundation
Module 1 — Owner / Direct Radar
Module 2 — Price Drop Radar
Module 3 — True Listing Age / Refresh Inflation
Module 4 — Recon Hub Combined Opportunities
Module 5 — Market Dominance & Inventory Velocity Radar
```

The frontend must treat UAE and KSA as two countries inside one platform, not as two separate apps.

---

## Backend source of truth

UAE frontend-ready database:

```text
C:\Users\User\Documents\malesh\intelligence.db
```

KSA frontend-ready database:

```text
C:\Users\User\Documents\malesh\KSA\intelligence\ksa_intelligence.db
```

The frontend must **not** read directly from local SQLite in production.

Correct production direction:

```text
Local Windows backend pipelines
→ product-safe export/sync step
→ hosted database/storage
→ Next.js/Vercel frontend
```

---

## Phase 5C.1 — Country-aware shell

Created country-aware route structure:

```text
/dashboard
/dashboard/uae
/dashboard/ksa
/dashboard/uae/[section]
/dashboard/ksa/[section]
```

Created files:

```text
lib/countries/productNavigation.ts
lib/countries/countryConfig.ts

app/dashboard/_components/CountryOverviewPage.tsx
app/dashboard/_components/CountryModulePlaceholderPage.tsx

app/dashboard/[country]/page.tsx
app/dashboard/[country]/[section]/page.tsx
```

Overwritten files:

```text
components/DashboardLayout.tsx
app/dashboard/page.tsx
```

Result:

```text
/dashboard now shows a GCC country selector.
/dashboard/uae opens the UAE country dashboard.
/dashboard/ksa opens the KSA country dashboard.
Sidebar now has a UAE/KSA country switcher.
Navigation is country-aware.
```

---

## Phase 5C.2 — Old flat route deletion

Deleted old flat Phase 5B dashboard routes:

```text
app/dashboard/commercial
app/dashboard/hot-leads
app/dashboard/listing-truth
app/dashboard/owner-direct
app/dashboard/price-drops
app/dashboard/refresh-inflated
app/dashboard/residential-buy
app/dashboard/residential-rent
app/dashboard/short-rental
app/dashboard/stale-price-drops
```

Reason:

```text
These were UAE-only temporary placeholder routes.
They were replaced by /dashboard/[country]/[section].
```

Current clean route family:

```text
/dashboard
/dashboard/[country]
/dashboard/[country]/[section]
```

---

## Phase 5C.3 — Old component cleanup and lint cleanup

Deleted old unused component folders/files:

```text
components/arbitrage
components/ghost-score
components/reestimate
components/dashboard/MorningCoffeeGrid.tsx
app/dashboard/_components/ReconPlaceholderPage.tsx
```

Reason:

```text
These belonged to old fantasy/unused modules and were not part of the unified UAE + KSA launch product.
```

Updated:

```text
eslint.config.mjs
components/DashboardLayout.tsx
```

Changes:

```text
Disabled react/no-unescaped-entities because the public landing page contains marketing copy with apostrophes/quotes.
Removed unused DashboardLayout icon imports.
```

Validation:

```text
npm run lint passes.
npm run build passes.
```

---

## Phase 5C.4 — App metadata update

Overwritten file:

```text
app/layout.tsx
```

Changed app metadata from:

```text
PropIntel UAE
```

to:

```text
PropIntel GCC — Real Estate Intelligence for UAE & KSA
```

Current metadata direction:

```text
AI-powered GCC real estate intelligence for UAE and KSA.
Tracks public listing activity, owner/direct signals, price movements, listing truth, market pressure, dominance, agency profiles, and activity feeds.
```

---

## Phase 5C.5 — Landing page rewrite

Overwritten file:

```text
app/page.tsx
```

The old UAE-only landing page was replaced.

Removed old/fantasy positioning such as:

```text
Smart Pricing Engine
FSBO Lead Magnet
Investor Yield Engine
Agent Trust Score
Agent Poaching Dossier
Rival Radar
```

New landing page positioning:

```text
PropIntel GCC
AI-powered GCC real estate intelligence SaaS
Built for UAE + KSA
Not a portal clone
Not generic property search
Focused on opportunities, listing truth, price movement, market pressure, dominance, agency footprint, and activity feed intelligence
```

Main homepage routes:

```text
/ → PropIntel GCC landing page
/dashboard → GCC country selector
/dashboard/uae → UAE dashboard
/dashboard/ksa → KSA dashboard
```

---

## Current active dashboard routes

Final production build currently shows:

```text
/
 /_not-found
 /dashboard
 /dashboard/[country]
   /dashboard/uae
   /dashboard/ksa
 /dashboard/[country]/[section]
   /dashboard/uae/recon
   /dashboard/uae/owner-direct
   /dashboard/uae/price-drops
   /dashboard/uae/listing-age
   /dashboard/uae/market-intelligence
   /dashboard/uae/inventory-pressure
   /dashboard/uae/market-dominance
   /dashboard/uae/agency-profiles
   /dashboard/uae/activity-feed
   /dashboard/uae/buildings
   /dashboard/uae/communities
   /dashboard/uae/data-quality
   /dashboard/ksa/recon
   /dashboard/ksa/owner-direct
   /dashboard/ksa/price-drops
   /dashboard/ksa/listing-age
   /dashboard/ksa/market-intelligence
   /dashboard/ksa/inventory-pressure
   /dashboard/ksa/market-dominance
   /dashboard/ksa/agency-profiles
   /dashboard/ksa/activity-feed
   /dashboard/ksa/buildings
   /dashboard/ksa/communities
   /dashboard/ksa/data-quality
```

---

## Country-aware product sections

Defined in:

```text
lib/countries/productNavigation.ts
```

Current sections:

```text
recon
owner-direct
price-drops
listing-age
market-intelligence
inventory-pressure
market-dominance
agency-profiles
activity-feed
buildings
communities
data-quality
```

---

## Country config

Defined in:

```text
lib/countries/countryConfig.ts
```

Country configs:

```text
uae
ksa
```

Each country includes:

```text
slug
label
fullName
currency
databasePath
publishStatus
launchStatus
routeBase
productPositioning
caveats
tables
disabledSections
```

---

## UAE config summary

UAE currency:

```text
AED
```

UAE local database:

```text
C:\Users\User\Documents\malesh\intelligence.db
```

UAE publish status:

```text
READY_TO_PUBLISH_UPDATED_UAE_DATA
```

UAE table families in config include:

```text
active_listings_unified
owner_direct_opportunities
price_drop_opportunities
true_listing_age_signals
recon_hub_opportunities
recon_dashboard_*
module5_dashboard_*
```

Important UAE frontend rules:

```text
Use AED.
Use recon_dashboard_* and module5_dashboard_* tables first.
Do not expose listing_price_events, listing_price_state, price_history_runs, or suspicious_price_drop_events directly to paid users.
Use source-category filters because short-rental activity can dominate some views.
```

---

## KSA config summary

KSA currency:

```text
SAR
```

KSA local database:

```text
C:\Users\User\Documents\malesh\KSA\intelligence\ksa_intelligence.db
```

KSA publish status:

```text
READY_TO_PUBLISH_UPDATED_KSA_DATA
```

KSA table families in config include:

```text
ksa_active_listings_unified
ksa_owner_direct_candidates
ksa_price_drop_candidates
ksa_listing_age_state
ksa_refresh_inflation_candidates
ksa_recon_hub_opportunities
ksa_recon_dashboard_*
ksa_module5_dashboard_*
```

Important KSA frontend rules:

```text
Use SAR.
Use ksa_module5_dashboard_* tables for normal Module 5 frontend pages.
Do not expose ksa_listing_price_events, ksa_listing_price_state, ksa_price_history_runs, or ksa_suspicious_price_drop_events directly to paid users.
KSA phone/WhatsApp coverage may be weaker; source_url and URL-lead paths are valid.
KSA v1 should not depend heavily on building/project coverage.
Use city/district/agency/source URL/price/signal fields first.
Do not create frontend alias logic blindly.
```

---

## Safe wording policy

Use:

```text
Public listing activity
Recently detected listing
Recent price movement
Price drop opportunity
Owner/direct signal
Contactable lead
URL lead
True listing age
Refresh signal
Refresh inflation
Recon opportunity
Market pressure
Inventory pressure
Market dominance
Visible listing share
Agency inventory profile
Building intelligence
Community intelligence
City intelligence
District intelligence
```

Avoid:

```text
fake listing
fraud
scam
desperate seller
distressed seller
forced sale
bad agency
agency quality score
guaranteed owner lead
competitor spying
market manipulation
```

---

## Current frontend reality

The frontend is still a shell.

Current state:

```text
No Supabase client
No auth
No middleware
No Stripe
No subscription gating
No live API/data layer
No production data sync yet
```

This is intentional.

The frontend currently validates:

```text
route architecture
country switcher
product navigation
country config
table mapping references
safe product language
GCC landing page positioning
```

---

## Validation commands

From frontend project root:

```bat
cd C:\Users\User\Documents\malesh\re-dashboard
rmdir /s /q .next
npm run build
npm run lint
```

Expected build result:

```text
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

Expected lint result:

```text
No errors
No warnings
```

Run dev:

```bat
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/dashboard
http://localhost:3000/dashboard/uae
http://localhost:3000/dashboard/ksa
http://localhost:3000/dashboard/uae/recon
http://localhost:3000/dashboard/ksa/recon
```

Expected:

```text
All routes return 200.
Country switcher works.
Landing page loads.
Dashboard shell loads.
```

---

## Current acceptable warning

The app still shows:

```text
Next.js inferred your workspace root, but it may not be correct.
Detected multiple lockfiles:
C:\Users\User\Documents\malesh\package-lock.json
C:\Users\User\Documents\malesh\re-dashboard\package-lock.json
```

This is acceptable for now.

Do not delete package-lock files until Vercel/GitHub project root is checked.

---

## Current official files

Created:

```text
lib/countries/productNavigation.ts
lib/countries/countryConfig.ts

app/dashboard/_components/CountryOverviewPage.tsx
app/dashboard/_components/CountryModulePlaceholderPage.tsx

app/dashboard/[country]/page.tsx
app/dashboard/[country]/[section]/page.tsx
```

Overwritten:

```text
components/DashboardLayout.tsx
app/dashboard/page.tsx
app/layout.tsx
app/page.tsx
eslint.config.mjs
```

Deleted:

```text
app/dashboard/commercial
app/dashboard/hot-leads
app/dashboard/listing-truth
app/dashboard/owner-direct
app/dashboard/price-drops
app/dashboard/refresh-inflated
app/dashboard/residential-buy
app/dashboard/residential-rent
app/dashboard/short-rental
app/dashboard/stale-price-drops

components/arbitrage
components/ghost-score
components/reestimate
components/dashboard/MorningCoffeeGrid.tsx
app/dashboard/_components/ReconPlaceholderPage.tsx
```

---

## Next phase

Next major phase:

```text
Phase 5D — Data contracts and local export planning
```

Recommended next tasks:

```text
1. Inspect UAE and KSA dashboard-ready table schemas.
2. Generate a unified frontend data contract for each page.
3. Decide the first real data page to connect.
4. Create local export scripts for product-safe UAE/KSA dashboard tables.
5. Decide hosted serving layer later: Supabase/PostgreSQL or storage-backed JSON/CSV.
```

Do not jump directly into Supabase until the table schemas and data contracts are validated.

---

## Recommended first real data target

Recommended first connected product page:

```text
/dashboard/uae/recon
```

Reason:

```text
UAE Recon Hub dashboard tables are already well-defined.
It is the strongest sales-facing page.
It can establish the opportunity card/table design pattern.
```

Alternative first target:

```text
/dashboard/ksa/recon
```

Reason:

```text
KSA backend is also frontend-ready and has clear ksa_recon_dashboard_* tables.
```

Professional recommendation:

```text
Start with UAE Recon Hub real data contract first.
Then clone/adapt the pattern to KSA Recon Hub.
Then expand to Module 5 pages.
```

---

## Do not do yet

Do not start:

```text
Supabase
auth
Stripe
billing
subscriptions
admin roles
Market Pulse
advanced visual redesign
production data sync
```

until the frontend data contracts are complete.
