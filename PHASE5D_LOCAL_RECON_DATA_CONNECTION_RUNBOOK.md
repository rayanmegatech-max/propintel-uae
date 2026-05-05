# PHASE5D_LOCAL_RECON_DATA_CONNECTION_RUNBOOK.md

## Project

PropIntel GCC / Recon Hub SaaS Dashboard MVP

Frontend project root:

```text
C:\Users\User\Documents\malesh\re-dashboard
```

## Phase status

Phase 5D — Local Recon Data Connection is complete.

This phase connected the first real local exported data to the dashboard for both launch countries:

```text
/dashboard/uae/recon
/dashboard/ksa/recon
```

This phase did **not** connect Supabase, auth, Stripe, billing, subscriptions, middleware, or production sync.

---

## Phase 5D purpose

Phase 5D created the first safe local data bridge between the completed backend intelligence systems and the Next.js frontend.

The approach:

```text
Local SQLite intelligence databases
→ local export scripts
→ product-safe JSON files
→ Next.js local data adapters
→ country-aware Recon pages
```

This is a development bridge only.

Vercel/production must not read local Windows SQLite paths directly.

---

## Backend source databases

UAE intelligence DB:

```text
C:\Users\User\Documents\malesh\intelligence.db
```

KSA intelligence DB:

```text
C:\Users\User\Documents\malesh\KSA\intelligence\ksa_intelligence.db
```

---

## Phase 5D.1 — Schema inspection

Created script:

```text
tools/inspect_frontend_safe_tables.py
```

Purpose:

```text
Inspect UAE and KSA frontend-safe dashboard/product tables before wiring real frontend data.
```

Generated files:

```text
reports/phase5d_schema_inspection/frontend_safe_table_schema_inspection.json
reports/phase5d_schema_inspection/frontend_safe_table_summary.csv
reports/phase5d_schema_inspection/PHASE5D_SCHEMA_INSPECTION_REPORT.md
```

Command:

```bat
python tools\inspect_frontend_safe_tables.py
```

Confirmed UAE product-safe tables include:

```text
active_listings_unified
owner_direct_opportunities
price_drop_opportunities
true_listing_age_signals
recon_hub_opportunities
recon_dashboard_hot_leads
recon_dashboard_price_drops
recon_dashboard_owner_direct
recon_dashboard_stale_price_drops
recon_dashboard_refresh_inflated
recon_dashboard_listing_truth
recon_dashboard_residential_rent
recon_dashboard_residential_buy
recon_dashboard_commercial
recon_dashboard_short_rental
recon_dashboard_summary
module5_dashboard_*
```

Confirmed KSA product-safe tables include:

```text
ksa_active_listings_unified
ksa_owner_direct_candidates
ksa_price_drop_candidates
ksa_listing_age_state
ksa_refresh_inflation_candidates
ksa_recon_hub_opportunities
ksa_recon_dashboard_hot_leads
ksa_recon_dashboard_multi_signal
ksa_recon_dashboard_owner_direct
ksa_recon_dashboard_price_drops
ksa_recon_dashboard_refresh_inflation
ksa_recon_dashboard_contactable
ksa_recon_dashboard_url_only
ksa_recon_dashboard_residential_rent
ksa_recon_dashboard_residential_buy
ksa_recon_dashboard_commercial
ksa_recon_dashboard_summary
ksa_module5_dashboard_*
```

---

## Phase 5D.2 — UAE Recon data contract

Created document:

```text
docs/PHASE5D_UAE_RECON_DATA_CONTRACT.md
```

Purpose:

```text
Define the first frontend data contract for /dashboard/uae/recon.
```

Key decision:

```text
Use recon_dashboard_hot_leads as the first connected table.
Use recon_dashboard_summary for summary/KPI support.
Do not use recon_hub_opportunities as the first default page query because it has over 1.5M rows.
```

Primary UAE first-page table:

```text
recon_dashboard_hot_leads
```

UAE summary table:

```text
recon_dashboard_summary
```

Currency:

```text
AED
```

---

## Phase 5D.3 — UAE Recon export script

Created script:

```text
tools/export_uae_recon_frontend_data.py
```

Purpose:

```text
Export product-safe UAE Recon data from local SQLite to local JSON files for frontend development.
```

Command:

```bat
python tools\export_uae_recon_frontend_data.py
```

Confirmed output:

```text
UAE Recon frontend export complete.

Hot leads total rows: 43,368
Hot leads exported rows: 500
Summary rows: 31
```

Generated files:

```text
exports/frontend/uae/recon_hot_leads.json
exports/frontend/uae/recon_summary.json
exports/frontend/uae/recon_manifest.json
```

JSON validation commands used:

```bat
python -m json.tool exports\frontend\uae\recon_hot_leads.json > nul
python -m json.tool exports\frontend\uae\recon_summary.json > nul
python -m json.tool exports\frontend\uae\recon_manifest.json > nul
```

All validations passed silently.

---

## Phase 5D.4 — UAE Recon local data adapter and page

Created file:

```text
lib/data/uaeRecon.ts
```

Purpose:

```text
Read local UAE Recon JSON exports from exports/frontend/uae.
Return a safe missing/error state if files are unavailable.
```

Created file:

```text
app/dashboard/_components/UaeReconDataPage.tsx
```

Purpose:

```text
Render the first real data-connected UAE Recon page using local exported JSON.
```

Overwritten file:

```text
app/dashboard/[country]/[section]/page.tsx
```

Change:

```text
/dashboard/uae/recon now loads getUaeReconData().
Other pages still use placeholder components unless explicitly connected.
```

Validation:

```text
/dashboard/uae/recon loads real UAE opportunity cards.
```

Important behavior:

```text
If export files are missing, the page does not crash.
It shows a controlled "UAE Recon export not loaded" state with the local export command.
```

---

## Phase 5D.5 — KSA Recon export script

Created script:

```text
tools/export_ksa_recon_frontend_data.py
```

Purpose:

```text
Export product-safe KSA Recon dashboard tables from local SQLite to local JSON files for frontend development.
```

Command:

```bat
python tools\export_ksa_recon_frontend_data.py
```

Confirmed output:

```text
KSA Recon frontend export complete.

hot_leads: OK | table=ksa_recon_dashboard_hot_leads | total=167 | exported=167
multi_signal: OK | table=ksa_recon_dashboard_multi_signal | total=2,249 | exported=500
owner_direct: OK | table=ksa_recon_dashboard_owner_direct | total=7,047 | exported=500
price_drops: OK | table=ksa_recon_dashboard_price_drops | total=84 | exported=84
refresh_inflation: OK | table=ksa_recon_dashboard_refresh_inflation | total=18,359 | exported=500
contactable: OK | table=ksa_recon_dashboard_contactable | total=9,151 | exported=500
url_only: OK | table=ksa_recon_dashboard_url_only | total=17,676 | exported=500
residential_rent: OK | table=ksa_recon_dashboard_residential_rent | total=4,864 | exported=500
residential_buy: OK | table=ksa_recon_dashboard_residential_buy | total=20,391 | exported=500
commercial: OK | table=ksa_recon_dashboard_commercial | total=1,572 | exported=500
Summary rows: 37
```

Generated files:

```text
exports/frontend/ksa/recon_hot_leads.json
exports/frontend/ksa/recon_multi_signal.json
exports/frontend/ksa/recon_owner_direct.json
exports/frontend/ksa/recon_price_drops.json
exports/frontend/ksa/recon_refresh_inflation.json
exports/frontend/ksa/recon_contactable.json
exports/frontend/ksa/recon_url_only.json
exports/frontend/ksa/recon_residential_rent.json
exports/frontend/ksa/recon_residential_buy.json
exports/frontend/ksa/recon_commercial.json
exports/frontend/ksa/recon_summary.json
exports/frontend/ksa/recon_manifest.json
```

JSON validation commands used:

```bat
python -m json.tool exports\frontend\ksa\recon_hot_leads.json > nul
python -m json.tool exports\frontend\ksa\recon_multi_signal.json > nul
python -m json.tool exports\frontend\ksa\recon_owner_direct.json > nul
python -m json.tool exports\frontend\ksa\recon_price_drops.json > nul
python -m json.tool exports\frontend\ksa\recon_refresh_inflation.json > nul
python -m json.tool exports\frontend\ksa\recon_contactable.json > nul
python -m json.tool exports\frontend\ksa\recon_url_only.json > nul
python -m json.tool exports\frontend\ksa\recon_residential_rent.json > nul
python -m json.tool exports\frontend\ksa\recon_residential_buy.json > nul
python -m json.tool exports\frontend\ksa\recon_commercial.json > nul
python -m json.tool exports\frontend\ksa\recon_summary.json > nul
python -m json.tool exports\frontend\ksa\recon_manifest.json > nul
```

All validations passed silently.

---

## Phase 5D.6 — KSA Recon local data adapter and page

Created file:

```text
lib/data/ksaRecon.ts
```

Purpose:

```text
Read local KSA Recon JSON exports from exports/frontend/ksa.
Return a safe missing/error state if files are unavailable.
```

Created file:

```text
app/dashboard/_components/KsaReconDataPage.tsx
```

Purpose:

```text
Render the first real data-connected KSA Recon page using local exported JSON.
```

Overwritten file:

```text
app/dashboard/[country]/[section]/page.tsx
```

Change:

```text
/dashboard/ksa/recon now loads getKsaReconData().
/dashboard/uae/recon still loads getUaeReconData().
Other pages still use placeholder components.
```

Validation:

```text
/dashboard/ksa/recon loads real KSA exported cards.
```

Known v1 issue:

```text
Some KSA cards show "Untitled KSA opportunity" and "Price unavailable".
```

Reason:

```text
KSA exported tables use different/sparser field names than the UAE card expects.
The KSA UI currently uses a generic v1 card and needs a later normalization layer.
```

This is not a structural failure.

Future KSA normalization should add fallbacks such as:

```text
title fallback:
opportunity_title → title → listing_title → property_title → description snippet

price fallback:
price → current_price → new_price → advertised_price

location fallback:
city + district → city + community → location_full_name

URL fallback:
property_url → source_url → listing_url
```

---

## Current real connected routes

Real local data connected:

```text
/dashboard/uae/recon
/dashboard/ksa/recon
```

Still placeholders:

```text
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

## Current local export files

UAE:

```text
exports/frontend/uae/recon_hot_leads.json
exports/frontend/uae/recon_summary.json
exports/frontend/uae/recon_manifest.json
```

KSA:

```text
exports/frontend/ksa/recon_hot_leads.json
exports/frontend/ksa/recon_multi_signal.json
exports/frontend/ksa/recon_owner_direct.json
exports/frontend/ksa/recon_price_drops.json
exports/frontend/ksa/recon_refresh_inflation.json
exports/frontend/ksa/recon_contactable.json
exports/frontend/ksa/recon_url_only.json
exports/frontend/ksa/recon_residential_rent.json
exports/frontend/ksa/recon_residential_buy.json
exports/frontend/ksa/recon_commercial.json
exports/frontend/ksa/recon_summary.json
exports/frontend/ksa/recon_manifest.json
```

---

## Important Git decision

The exported JSON files are local generated data.

Before committing, decide whether to:

```text
Option A — Do not commit exported JSON files.
Option B — Commit tiny sample JSON only.
Option C — Gitignore exports/frontend/**/*.json and later use hosted data/storage.
```

Professional recommendation for now:

```text
Do not commit full exported JSON files.
Add exports/frontend/**/*.json to .gitignore.
Commit scripts, adapters, components, docs, and runbooks only.
```

Reason:

```text
Exported JSON is generated data.
It can become large and noisy.
Production should use Supabase/PostgreSQL or hosted object storage later.
```

---

## Validation commands

From project root:

```bat
cd C:\Users\User\Documents\malesh\re-dashboard
rmdir /s /q .next
npm run build
npm run lint
```

Expected:

```text
Build passes.
Lint passes.
```

Run dev:

```bat
npm run dev
```

Open:

```text
http://localhost:3000/dashboard/uae/recon
http://localhost:3000/dashboard/ksa/recon
```

Expected:

```text
UAE Recon shows real exported cards.
KSA Recon shows real exported cards.
```

---

## Current architecture rule

The local JSON data adapter is temporary.

Do not treat it as final production architecture.

Current dev architecture:

```text
SQLite → local JSON export → Next.js reads JSON from project folder
```

Future production architecture:

```text
SQLite/backend pipeline → export/sync → Supabase/PostgreSQL or object storage → Next.js/Vercel
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
production sync
advanced Market Pulse
```

until the local data contracts and first real page patterns are stable.

---

## Recommended next step

Next phase:

```text
Phase 5E — Normalize and polish Recon card/table UX for UAE + KSA
```

Recommended tasks:

```text
1. Add shared normalized Recon opportunity model.
2. Improve KSA title/price/location/url fallbacks.
3. Add real tab switcher for UAE Recon.
4. Add real tab switcher for KSA Recon.
5. Add client-side filters on the exported 500-row sample.
6. Improve visual layout from v1 cards into a more premium SaaS intelligence interface.
```

Alternative next step:

```text
Phase 5F — Export and connect Owner/Direct + Price Drops pages.
```

Professional recommendation:

```text
First polish the Recon page pattern because it will become the template for every other module.
Then replicate the pattern to Owner/Direct, Price Drops, Listing Age, and Module 5 pages.
