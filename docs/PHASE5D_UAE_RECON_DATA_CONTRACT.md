# PHASE5D_UAE_RECON_DATA_CONTRACT.md

## Purpose

Define the first frontend data contract for:

```text
/dashboard/uae/recon
```

This page will become the first real data-connected product page in the unified PropIntel GCC dashboard.

This contract is based on the Phase 5D schema inspection report generated from:

```text
C:\Users\User\Documents\malesh\intelligence.db
```

No Supabase, auth, Stripe, billing, or live production sync is included in this contract.

---

## Product page

Route:

```text
/dashboard/uae/recon
```

Country:

```text
UAE
```

Currency:

```text
AED
```

Product:

```text
Recon Hub
```

Positioning:

```text
Daily opportunity command center for UAE public listing intelligence.
```

Primary user:

```text
Real estate agents, agencies, commercial brokers, and operators who want a prioritized action list instead of manually browsing portals.
```

---

## Data source priority

Use dashboard-ready tables first.

### Primary table for v1

```text
recon_dashboard_hot_leads
```

Reason:

```text
This is the strongest default paid-user landing tab.
It is already filtered and ranked for high-priority opportunities.
It is smaller and safer than recon_hub_opportunities.
```

Current inspected size:

```text
43,368 rows
88 columns
```

### Secondary tabs/tables

After the Hot Leads tab works, add these tabs:

```text
recon_dashboard_price_drops
recon_dashboard_owner_direct
recon_dashboard_stale_price_drops
recon_dashboard_refresh_inflated
recon_dashboard_listing_truth
recon_dashboard_residential_rent
recon_dashboard_residential_buy
recon_dashboard_commercial
recon_dashboard_short_rental
```

### Summary table

Use for top KPI cards:

```text
recon_dashboard_summary
```

Current inspected size:

```text
31 rows
5 columns
```

### Full intelligence table

Do not use as the default page query:

```text
recon_hub_opportunities
```

Reason:

```text
It has over 1.5M rows and is intentionally broad.
It may later power advanced filters or exports, but not the first landing tab.
```

---

## Tables not exposed directly

Do not expose these to normal paid users:

```text
listing_price_events
listing_price_state
price_history_runs
suspicious_price_drop_events
market_dominance_building
market_dominance_community
inventory_pressure_community
inventory_pressure_building
agency_inventory_profiles
agency_inventory_by_community
agency_inventory_by_building
market_activity_feed
market_activity_summary
```

Reason:

```text
These are raw/internal/evidence tables or engine tables.
The website must use product-safe dashboard tables first.
```

---

## Core display fields

The first opportunity card/table model should support these fields from `recon_dashboard_hot_leads`:

```text
dashboard_rank
recon_id
listing_key
canonical_id
portal
schema_name
portal_id
primary_opportunity_type
opportunity_group
opportunity_title
recon_score
recon_rank
confidence_tier
confidence_reason
priority_label
badges_json
recommended_action
portal_action_label
action_priority
cta_text
source_category
purpose
price_frequency
title
property_type
bedrooms
bathrooms
size_sqft
city
community
building_name
property_url
price
price_per_sqft
old_price
new_price
drop_amount
drop_pct
age_label
refresh_inflation_label
effective_true_age_days
owner_direct_bucket
owner_direct_label
owner_direct_confidence_tier
agent_name
agency_name
contact_phone
contact_whatsapp
contact_email
has_phone_available
has_whatsapp_available
has_email_available
listing_created_at
listing_updated_at
listing_scraped_at
built_at
```

---

## Required v1 UI model

Each row should be renderable as either:

```text
Opportunity card
Opportunity table row
```

### Card header

Use:

```text
opportunity_title
priority_label
confidence_tier
recon_score
dashboard_rank
```

### Listing identity

Use:

```text
portal
source_category
city
community
building_name
property_type
bedrooms
bathrooms
size_sqft
```

### Price block

Use:

```text
price
old_price
new_price
drop_amount
drop_pct
price_per_sqft
```

Rules:

```text
Show AED label.
If price is null, show "Price unavailable".
If old_price/new_price are null, hide price-drop comparison.
If drop_pct is null, hide percentage badge.
```

### Signal block

Use:

```text
primary_opportunity_type
badges_json
owner_direct_bucket
owner_direct_label
price_drop_strength_label
age_label
refresh_inflation_label
effective_true_age_days
```

Rules:

```text
Parse badges_json safely.
If JSON parsing fails, show no badges and do not crash.
Avoid words like fake, fraud, desperate, distressed, guaranteed owner.
```

### Contact/action block

Use:

```text
recommended_action
portal_action_label
cta_text
property_url
contact_phone
contact_whatsapp
contact_email
has_phone_available
has_whatsapp_available
has_email_available
```

Rules:

```text
If cta_text exists, use it as button label.
If property_url exists, always provide "Open Listing".
If recommended_action is whatsapp but no WhatsApp field exists, fall back to Open Listing.
Do not expose masked/dirty contact fields without validation.
```

---

## Required filters for v1

Minimum filters:

```text
city
community
source_category
portal
property_type
bedrooms
price_min
price_max
priority_label
confidence_tier
```

Recon-specific filters:

```text
primary_opportunity_type
owner_direct_bucket
age_label
refresh_inflation_label
has_whatsapp_available
has_phone_available
```

Price-drop filters:

```text
drop_pct_min
drop_amount_min
```

---

## Default query behavior

Default table:

```text
recon_dashboard_hot_leads
```

Default sorting:

```text
dashboard_rank ASC
```

Fallback sorting if `dashboard_rank` is missing:

```text
recon_score DESC
```

Default limit:

```text
50 rows
```

Pagination:

```text
page size: 25 / 50 / 100
server-side pagination required later
```

Do not load all rows in React.

---

## Recommended first-page layout

### Top area

```text
Page title: UAE Recon Hub
Subtitle: Daily public-listing opportunity command center.
KPI cards:
- Hot Leads
- Price Drops
- Owner / Direct
- Stale + Price Drops
- Refresh Inflated
```

### Tabs

```text
Hot Leads
Price Drops
Owner / Direct
Stale + Price Drops
Refresh Inflated
Listing Truth
Residential Rent
Residential Buy
Commercial
Short Rental
```

### Filters

Place filters above the table/cards:

```text
City
Community
Source Category
Portal
Property Type
Priority
Confidence
Price Range
```

### Main content

Use a hybrid layout:

```text
Left / main area:
Opportunity cards or table

Right / optional rail:
Top market/source breakdown
Data freshness
Safe wording notice
```

---

## Source category handling

UAE source categories include:

```text
residential_rent
residential_buy
commercial_rent
commercial_buy
land_buy
short_rental
```

Frontend labels:

```text
residential_rent → Residential Rent
residential_buy → Residential Buy
commercial_rent → Commercial Rent
commercial_buy → Commercial Buy
land_buy → Land Buy
short_rental → Short Rental
```

Important:

```text
Do not show only one global list forever.
Category tabs/filters are necessary because short-rental and residential categories behave differently.
```

---

## Portal handling

Known portal values may include:

```text
bayut
dubizzle
propertyfinder
```

Frontend display:

```text
bayut → Bayut
dubizzle → Dubizzle
propertyfinder → Property Finder
```

Unknown portal:

```text
Show raw value safely.
```

---

## Currency and number formatting

Currency:

```text
AED
```

Formatting examples:

```text
AED 95,000
AED 1.55M
AED 250/sqft
```

Rules:

```text
Never mix AED with SAR.
Do not infer yearly/monthly unless price_frequency or source_category supports it.
```

---

## Null handling

The UI must handle nulls safely.

Examples:

```text
city null → "Unknown city"
community null → "Unknown community"
building_name null → hide building line
bedrooms null → hide bedrooms
bathrooms null → hide bathrooms
size_sqft null → hide size
agent_name null → "Agent unavailable"
agency_name null → "Agency unavailable"
property_url null → disable Open Listing button
```

---

## TypeScript data type draft

```ts
export type UaeReconOpportunity = {
  dashboard_rank: number | null;
  recon_id: number | null;
  listing_key: string | null;
  canonical_id: string | null;
  portal: string | null;
  schema_name: string | null;
  portal_id: string | null;

  primary_opportunity_type: string | null;
  opportunity_group: string | null;
  opportunity_title: string | null;

  recon_score: number | null;
  recon_rank: number | null;
  confidence_tier: string | null;
  confidence_reason: string | null;
  priority_label: string | null;

  badges_json: string | null;
  recommended_action: string | null;
  portal_action_label: string | null;
  action_priority: string | null;
  cta_text: string | null;

  source_category: string | null;
  purpose: string | null;
  price_frequency: string | null;

  title: string | null;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqft: number | null;

  city: string | null;
  community: string | null;
  building_name: string | null;
  property_url: string | null;

  price: number | null;
  price_per_sqft: number | null;
  old_price: number | null;
  new_price: number | null;
  drop_amount: number | null;
  drop_pct: number | null;

  age_label: string | null;
  refresh_inflation_label: string | null;
  effective_true_age_days: number | null;

  owner_direct_bucket: string | null;
  owner_direct_label: string | null;
  owner_direct_confidence_tier: string | null;

  agent_name: string | null;
  agency_name: string | null;

  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_email: string | null;

  has_phone_available: number | null;
  has_whatsapp_available: number | null;
  has_email_available: number | null;

  listing_created_at: string | null;
  listing_updated_at: string | null;
  listing_scraped_at: string | null;
  built_at: string | null;
};
```

---

## Export/sync direction later

For local development, the first export target can be:

```text
exports/frontend/uae/recon_hot_leads.json
exports/frontend/uae/recon_summary.json
```

For production later:

```text
SQLite → export script → Supabase/PostgreSQL or static object storage → Next.js frontend
```

Do not make Vercel read:

```text
C:\Users\User\Documents\malesh\intelligence.db
```

---

## Acceptance criteria before frontend coding

Before writing the real data UI, confirm:

```text
1. recon_dashboard_hot_leads exists.
2. It has the required core display fields.
3. It can export top 50 or top 500 rows safely.
4. badges_json parsing is safe.
5. Null values do not crash the UI.
6. All prices are formatted as AED.
7. No raw/internal tables are used.
8. Page can later switch from JSON/local export to Supabase query.
```

---

## Next implementation step

Create the first local export script:

```text
tools/export_uae_recon_frontend_data.py
```

It should export:

```text
recon_dashboard_hot_leads
recon_dashboard_summary
```

to:

```text
exports/frontend/uae/recon_hot_leads.json
exports/frontend/uae/recon_summary.json
```

This will let the Next.js page consume realistic local JSON first, before Supabase.
