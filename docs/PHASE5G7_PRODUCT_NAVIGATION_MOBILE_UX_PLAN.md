Let me inspect the files I haven't read yet to build an accurate plan.I now have a thorough understanding of the entire codebase. Here is the full product/UX plan.

---

# PropIntel GCC — Phase 5G.7 Product Navigation + Mobile UX Plan

---

## 1. Current Page/Component Architecture

**11 sidebar-visible pages per country** (plus Overview), each with its own page component:

| Current Slug | Component | Data Source | Module |
|---|---|---|---|
| `recon` | UaeReconDataPage / KsaReconDataPage + TabsClient | uaeRecon / ksaRecon | Recon |
| `owner-direct` | OwnerDirectRadarPage | recon.lists.ownerDirect | Recon |
| `price-drops` | PriceDropRadarPage | recon.lists.priceDrops | Recon |
| `listing-age` | ListingTruthRadarPage | recon.lists.listingTruth/refreshInflated/stalePriceDrops | Recon |
| `market-intelligence` | MarketIntelligencePage | module5 (summary) | Module 5 |
| `inventory-pressure` | InventoryPressurePage | module5.inventoryPressure | Module 5 |
| `market-dominance` | MarketDominancePage | module5.marketDominance | Module 5 |
| `agency-profiles` | AgencyProfilesPage | module5.agencyProfiles | Module 5 |
| `activity-feed` | ActivityFeedPage | module5.activityFeed | Module 5 |
| `buildings` | BuildingIntelligencePage | module5.buildingIntelligence | Module 5 |
| `communities` | CommunitiesPage | module5.communityIntelligence | Module 5 |

**6 watchlist types** embedded inside those pages: Pressure Watchlist, Visibility Watchlist, Agency Watchlist, Signal Timeline, Building Watchlist, Location Watchlist.

---

## 2. Navigation Consolidation Proposal

### Target V1 Sidebar

```
COMMAND
  └ Overview                    ← CountryOverviewPage (polish, not rewrite)

OPPORTUNITIES
  └ Daily Opportunities         ← Recon Hub with quick-links to sub-modules

MARKET
  └ Market Radar                ← Combined market view
  └ Competitor Radar            ← Combined competitor view

ADMIN
  └ Data Quality                ← Internal-only (existing)
```

### What goes where:

**Daily Opportunities** (primary sidebar entry → `/recon`)
- *Hero page:* UaeReconDataPage / KsaReconDataPage (already the daily cockpit)
- *Quick-access links within the page or as sub-tabs:* Owner/Direct, Price Drops, Listing Truth
- *These sub-modules remain routable* at `/owner-direct`, `/price-drops`, `/listing-age` — but are hidden from the main sidebar. They appear as "workflow lanes" accessible from the Daily Opportunities page header and from the Overview page.

**Market Radar** (new combined page → `/market-radar`)
- Combines content from: MarketIntelligencePage (summary hub), InventoryPressurePage, ActivityFeedPage, BuildingIntelligencePage, CommunitiesPage
- Structure: tab selector or accordion with lanes for "Activity Feed", "Inventory Pressure", "Buildings", "Communities"
- MarketIntelligencePage becomes the entry/landing for this combined view
- Old routes remain live but hidden from sidebar

**Competitor Radar** (new combined page → `/competitor-radar`)
- Combines content from: MarketDominancePage, AgencyProfilesPage
- Structure: two-lane tab view — "Market Visibility" and "Agency Profiles"
- Old routes remain live but hidden from sidebar

### Pages hidden from sidebar but kept as deep routes:

| Old Route | Status | Accessible From |
|---|---|---|
| `/owner-direct` | Hidden from sidebar, live route | Daily Opportunities quick-link |
| `/price-drops` | Hidden from sidebar, live route | Daily Opportunities quick-link |
| `/listing-age` | Hidden from sidebar, live route | Daily Opportunities quick-link |
| `/inventory-pressure` | Hidden from sidebar, live route | Market Radar tab |
| `/market-dominance` | Hidden from sidebar, live route | Competitor Radar tab |
| `/agency-profiles` | Hidden from sidebar, live route | Competitor Radar tab |
| `/activity-feed` | Hidden from sidebar, live route | Market Radar tab |
| `/buildings` | Hidden from sidebar, live route | Market Radar tab |
| `/communities` | Hidden from sidebar, live route | Market Radar tab |
| `/market-intelligence` | Hidden from sidebar, live route | Redirects to Market Radar |

---

## 3. User Journey Per Persona

**Individual Agent** (daily workflow, 5 min/day):
1. Open **Daily Opportunities** → see ranked leads, scan top featured card
2. Filter by location/portal → find leads in their area
3. Tap "Owner/Direct" or "Price Drops" quick-link to drill into a specific signal lane
4. Open listing → verify on source portal → contact

**Boutique Agency Owner** (strategic, 15 min/week):
1. Open **Market Radar** → scan activity feed for market movement
2. Switch to "Inventory Pressure" tab → identify areas where supply pressure is building
3. Open **Competitor Radar** → see which agencies dominate their target communities
4. Return to **Daily Opportunities** → assign specific leads to team

**Team Leader / Market Analyst** (deep analysis, 30 min/week):
1. Open **Competitor Radar** → Agency Profiles → assess competitor portfolio composition
2. Switch to Market Visibility → identify under-served communities
3. Open **Market Radar** → Buildings tab → drill into specific building intelligence
4. Export findings to brief the team

---

## 4. Watchlist Rewrites

### 4.1 Pressure Watchlist → "Supply Pressure Alerts"

- **Better title:** Supply Pressure Alerts
- **Plain-English meaning:** Locations where public listing supply is visibly building — more listings, more price drops, more aged inventory in one area.
- **Why an agent cares:** If you're listing in these areas, expect longer sell times and more price competition. If you're buying, you may have negotiation leverage.
- **Best fields to show:** location, active_listings, pressure_label, price_drop_rate_pct, pressureScore
- **Best CTA:** "Review pressure details" → opens the full pressure card or the Inventory Pressure deep page
- **Backend words to remove:** `inventory_pressure_score` (rename to "Pressure level"), `pressure_bucket`, `has_price_pressure`, `has_stale_price_pressure`
- **Belongs in:** Market Radar

### 4.2 Visibility Watchlist → "Market Share Leaders"

- **Better title:** Market Share Leaders
- **Plain-English meaning:** Locations where a small number of agencies control most of the visible listings — one or two agencies dominate the market.
- **Why an agent cares:** If a competitor owns 40%+ of listings in your area, you need a differentiation strategy. If no one dominates, there's whitespace to capture.
- **Best fields to show:** location, top_agency_name, top_agency_share_pct, top3Share, listings, concentration_label
- **Best CTA:** "See full visibility breakdown" → opens Market Dominance deep page
- **Backend words to remove:** `dominance_score` (rename to "Share concentration"), `hhi_agency`, `concentration_bucket`
- **Belongs in:** Competitor Radar

### 4.3 Agency Watchlist → "Agency Portfolio Monitor"

- **Better title:** Agency Portfolio Monitor
- **Plain-English meaning:** Top agencies ranked by listing footprint — how many listings, which areas, which portals, and what portfolio pressure signals they carry.
- **Why an agent cares:** Know your competitors' scale and weak spots. Agencies with high portfolio pressure may be losing listings; agencies with wide footprint may be hard to compete with head-on.
- **Best fields to show:** agency_name, active_listings, communities count, portfolio_type_label, portfolio_pressure_label
- **Best CTA:** "View agency profile" → opens the full agency card
- **Backend words to remove:** `elevated_signal_portfolio` (rename to "Active pressure signals"), `footprint_score` (rename to "Footprint size"), `dashboard_use_case`
- **Belongs in:** Competitor Radar

### 4.4 Signal Timeline → "Recent Market Activity"

- **Better title:** Recent Market Activity
- **Plain-English meaning:** A reverse-chronological feed of the most important public listing events — new price drops, newly detected listings, recon opportunities, agency shifts, pressure changes.
- **Why an agent cares:** See what happened today/this week without opening every module separately. Spot time-sensitive opportunities before competitors.
- **Best fields to show:** title/summary, activity_type, location, agency, score, date, price change amounts
- **Best CTA:** "Open source listing" (if URL exists) or "See full details"
- **Backend words to remove:** `activity_bucket`, `bucket_rank`, `bucket_limit`, `dashboard_card_type`, `source_table`
- **Belongs in:** Market Radar

### 4.5 Building Watchlist → "Building Intelligence Monitor"

- **Better title:** Building Intelligence Monitor
- **Plain-English meaning:** Individual buildings ranked by listing activity, agency concentration, and signal density — which buildings have the most competition, the most price drops, the most opportunity.
- **Why an agent cares:** If you specialize in specific towers/projects, this tells you where you're winning and where competitors are gaining ground.
- **Best fields to show:** building_name, community, city, active_listings, agencies, top_agency_name, top_agency_share_pct, pressure_label
- **Best CTA:** "View building details"
- **Backend words to remove:** `dashboard_card_type`, `intelligence_label` (rename to "Signal summary")
- **Belongs in:** Market Radar

### 4.6 Location Watchlist → "Community Intelligence Monitor"

- **Better title:** Community Intelligence Monitor
- **Plain-English meaning:** Communities/districts ranked by listing volume, agency competition, price activity, and market pressure — the area-level version of building intelligence.
- **Why an agent cares:** Choose which communities to farm. Communities with high activity but low agency concentration = opportunity whitespace.
- **Best fields to show:** community, city, active_listings, agencies, buildings, top_agency_name, top_agency_share_pct, pressure_label, activity_summary_label
- **Best CTA:** "Explore community"
- **Backend words to remove:** `dashboard_card_type`, `intelligence_label`
- **Belongs in:** Market Radar

---

## 5. Mobile UX Audit (Code-Inferred)

### Critical Issues Found:

**5.1 Watchlist rows use `flex items-center gap-4` with 3–4 right-aligned stat columns.**
Files: PressureWatchCard, VisibilityWatchlistRow, AgencyWatchlistRow, BuildingWatchlistRow, LocationWatchlistRow. Each has 3–4 `<div>` stat blocks side by side with fixed `w-[64px]` widths (AgencyProfiles) or auto-width numeric columns. On a 375px phone screen, these overflow or compress the location name to near-zero width. Only AgencyProfiles uses `hidden sm:block` on one column.

**5.2 KPI metric cards use `grid-cols-2 lg:grid-cols-4`.**
Consistent across all Module 5 pages. On mobile the 2-col grid works but the cards themselves have `px-5 py-5` padding and 28–32px values which makes them feel cramped at 2-up on a narrow phone.

**5.3 Hero sections use large header text (text-3xl to text-5xl in the old pages, text-[28px] to text-[36px] in the redesigned ones).**
The redesigned pages (Recon, Owner Direct, Price Drop, Listing Truth) are already better with `text-[20px] sm:text-[24px]`. But CountryOverviewPage still uses `text-[28px] sm:text-[36px]` and the Module 5 pages (MarketDominance, InventoryPressure, etc.) use `text-3xl sm:text-5xl` which is enormous on mobile.

**5.4 Module 5 pages use `#0c0c0e` card background.**
This is darker than the Recon pages' `#111113`. On mobile OLED screens, pure-black-adjacent surfaces lose all visual separation between cards and the page background. The redesigned Recon/Owner Direct/Price Drop pages already use `#111113`/`#0d0d0f` which is slightly better but still at the edge.

**5.5 "Explore" / "Deep Intel" card grids use `sm:grid-cols-2 xl:grid-cols-3`.**
These are fine for desktop but on mobile they stack to 1-col which is correct. However, the cards themselves are ~200px tall with dot patterns and decorative bar charts, meaning on a phone you get a very long scroll with low information density.

**5.6 The Recon opportunity cards use `lg:grid-cols-[1fr_250px]` for the featured card.**
Below `lg` (1024px), this collapses to single-column which is correct. But the right-side price/CTA column then stacks below the main content with `border-t` which can feel disconnected on a phone. The CTA button may be below the fold.

**5.7 ReconFiltersBar packs 5 controls on one row with `flex-wrap`.**
On mobile this wraps but the individual `<select>` elements use `max-w-[140px]` which means they show very truncated option text on a narrow screen.

**5.8 CountryOverviewPage uses `framer-motion` hover animations.**
These are wasted on mobile (no hover) and add ~40KB to the bundle for a few `whileHover: { y: -3 }` effects that phones never trigger.

**5.9 All Module 5 watchlist sections lack explicit empty states.**
When `highPressureCount === 0` (InventoryPressure) or when no items pass the filter, the watchlist renders with zero items but the section header and structure remain, creating a confusing "Watchlist" label with nothing below it.

**5.10 Sidebar navigation (inferred).**
The `productNavigation.ts` file provides 11 section slugs. On mobile, this is likely a hamburger/drawer menu. With 11+ items plus Overview, the drawer requires scrolling before a user can even find "Activity Feed" or "Communities" at the bottom.

---

## 6. Mobile-First Design Standard

### Navigation
- Sidebar collapses to bottom tab bar on mobile with 4 tabs: Overview, Opportunities, Market, Competitor
- Each tab opens its combined page; sub-routes accessible via in-page tab selectors
- No hamburger menu needed — 4 fixed bottom tabs cover the entire product

### Card Stacking Rules
- All card grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Watchlist rows on mobile: stack stat columns vertically or show only the 2 most important metrics; hide tertiary stats below `sm:`
- Remove all `w-[64px]` fixed widths; use `min-w-0 flex-1` patterns

### KPI Card Behavior
- On mobile (< 640px): `grid-cols-2` with reduced padding (`px-3 py-3`)
- Value text: `text-[24px]` on mobile, `text-[28px] sm:text-[32px]` on desktop
- Description: hidden on mobile or truncated to 1 line

### Watchlist Card Layout
- Mobile: stack to vertical card format — location name on top line, key metrics in a compact 2-up row below, pressure/status badge, and CTA button
- Desktop: keep horizontal row format with 3–4 stat columns

### CTA/Button Placement
- Always visible without scrolling on mobile featured cards
- If card uses a 2-column layout that stacks, move CTA to the top of the stacked right section, not the bottom

### Minimum Font Sizes
- Body text: 12px minimum (currently some text is 9–10px)
- Labels: 10px minimum
- Values: 14px minimum for watchlist stats
- Section headers: 14px minimum

### Spacing Rules
- Card internal padding: min 12px on mobile, 16–20px on desktop
- Gap between cards: min 8px on mobile, 12–16px on desktop
- Section gaps: 16px on mobile, 20–24px on desktop

### Surface/Background Brightness
- Page background: `#09090b` (zinc-950)
- Card surface: `#111113` (not `#0c0c0e`)
- Inset/well surface: `#18181b` (zinc-900)
- Never use `#0c0c0e` or darker for card backgrounds — insufficient contrast on mobile OLED
- Add a `1px solid rgba(255,255,255,0.07)` border to all cards — borders provide more visual separation than background shade differences on mobile

### Dark Theme Premium Feel
- Use emerald/cyan/amber accent *borders and dots*, not large colored backgrounds
- Keep surface differences subtle (3–5% brightness steps, not 1%)
- Use inset shadows on secondary surfaces instead of flat backgrounds
- Use the hairline gradient accent (already done well in Recon pages) sparingly as a premium quality marker

---

## 7. Desktop Design Standard

### Page Hierarchy
- Every page: header → optional safe-caveat → data-strip → KPIs → breakdown/pulse → watchlist/list → footer
- This pattern is already established in the Recon/Owner Direct/Price Drop/Listing Truth redesigns and should be extended to all Module 5 pages

### Card Naming
- Replace "Deep Intelligence Layers" → "Market & Competitor Intelligence"
- Replace "Trust & Operating Notes" → "Data Confidence Notes"
- Replace "Local export bridge" → "Verified source data"
- Replace "Product-safe records only" → remove entirely (it's internal jargon)

### Section Headers
- Use the `GroupLabel` pattern from Owner Direct/Price Drop pages consistently
- Each section: 9px uppercase tracking label + hairline divider

### CTAs
- Primary CTA per page: emerald button, clear verb ("Review opportunities", "Explore pressure areas", "Compare agencies")
- Secondary CTAs: ghost button with border
- No more than 2 CTAs per page header

### Accent Color System
- Emerald: Opportunities, market activity, positive signals
- Cyan: Owner/direct, contact signals
- Amber: Pressure, age, caution
- Red/rose: Price movement only, used sparingly
- Violet: Listing truth, freshness, time-on-market
- Slate: Competitor/agency (neutral, professional)

### Intelligence Tier Visual Distinction
- Listing-level pages (Recon, Owner Direct, Price Drop, Listing Truth): use `ReconOpportunityCard` with featured/list variants
- Market-level pages (Pressure, Activity, Buildings, Communities): use the watchlist/card pattern with location-first hierarchy
- Competitor-level pages (Dominance, Agency Profiles): use agency-first hierarchy with share/concentration metrics

---

## 8. Risky Backend Labels → Product-Safe Replacements

| Current Exposed Label | Where Found | Replacement |
|---|---|---|
| `dashboard-safe` | ActivityFeedPage fallback summary | Remove — don't surface this term |
| `confidence_tier` | All Module 5 pages | "Signal confidence" or hide entirely |
| `dashboard_level` | MarketDominance, InventoryPressure | "Market level" |
| `dashboard_card_type` | Building, Community pages | Remove from UI |
| `dashboard_use_case` | AgencyProfiles | Remove from UI |
| `portfolio_pressure_label` | AgencyProfiles | "Portfolio health" |
| `footprint_score` | AgencyProfiles | "Market presence" |
| `elevated_signal_portfolio` | AgencyProfiles (inferred) | "Active pressure signals" |
| `source_table` | ActivityFeedPage | Remove from user-visible UI |
| `exported_rows` | ActivityFeedPage KPI | "Sample size" |
| `exported sample` | Various | "Preview sample" or just "Sample" |
| `Local export bridge` | CountryOverviewPage | "Verified source data" |
| `Local export mode` | CountryOverviewPage chip | "Live data" |
| `source-led` | OwnerDirectRadarPage | "URL-only lead" |
| `pressure_bucket` | InventoryPressure | Never surface — use `pressure_label` only |
| `concentration_bucket` | MarketDominance | Never surface — use `concentration_label` only |
| `built_at` | Various date fallbacks | "Last updated" |
| `hhi_agency` | MarketDominance | Never surface to users |
| `Module 5` | ActivityFeedPage fallback | Remove — never show "Module 5" to users |
| `recon_dashboard_*` table names | DataStrip components | Show table name only in admin/Data Quality pages |

---

## 9. Structured Implementation Plan

### Phase A — Navigation Consolidation (3–4 days)

1. Create `productNavigation.ts` update: reduce sidebar to 4 visible items per country
2. Create `MarketRadarPage.tsx`: tab-based combined page pulling InventoryPressure, ActivityFeed, Buildings, Communities content via tab selector
3. Create `CompetitorRadarPage.tsx`: tab-based combined page pulling MarketDominance and AgencyProfiles content via tab selector
4. Update `CountryOverviewPage.tsx`: simplify "Today's Command Center" to point to Daily Opportunities, Market Radar, Competitor Radar
5. Add quick-link bar to `UaeReconDataPage.tsx` and `KsaReconDataPage.tsx`: Owner/Direct, Price Drops, Listing Truth as horizontal pill links
6. Keep all existing routes live — no deletion
7. Add `route.ts` entries for `/market-radar` and `/competitor-radar`

### Phase B — Watchlist/Card Content Rewrite (2–3 days)

1. Rename all 6 watchlist section titles and descriptions
2. Replace backend labels (confidence_tier display, dashboard_level display, etc.) with product-safe alternatives
3. Add proper empty states for zero-item watchlists
4. Rewrite fallback summary strings in ActivityFeedPage (remove "dashboard-safe" / "Module 5" references)
5. Clean up CountryOverviewPage copy: "Local export bridge" → "Verified source data", remove "Local export mode" chip

### Phase C — Mobile Responsiveness Cleanup (3–4 days)

1. Watchlist row refactor: stack stat columns vertically below `sm:`, remove `w-[64px]` fixed widths
2. KPI card padding reduction on mobile
3. Module 5 page hero text size reduction to match Recon page standard (`text-[20px] sm:text-[24px]`)
4. Featured card CTA position fix: ensure CTA is visible without scrolling on mobile
5. Filter bar mobile layout: stack selects or use a collapsible filter drawer
6. CountryOverviewPage: remove `framer-motion` hover animations, use CSS transitions

### Phase D — Visual Polish / Dark Theme Refinement (2 days)

1. Unify card background color: `#0c0c0e` → `#111113` across all Module 5 pages
2. Add consistent border treatment to all card surfaces
3. Apply `GroupLabel` section header pattern to Module 5 pages
4. Ensure accent color consistency per module type
5. Add inset shadow to secondary surfaces
6. Ensure all pages use the standardized design token object (currently each page defines its own `T` or `C` object with slightly different values)

### Phase E — QA Checklist

- [ ] All 11 old routes still resolve (no 404s)
- [ ] Sidebar shows exactly 4 items under COMMAND/OPPORTUNITIES/MARKET/ADMIN
- [ ] Daily Opportunities has visible quick-links to Owner/Direct, Price Drops, Listing Truth
- [ ] Market Radar loads with tabs for Activity, Pressure, Buildings, Communities
- [ ] Competitor Radar loads with tabs for Visibility and Agency Profiles
- [ ] No backend field names visible in any user-facing text
- [ ] All watchlists show proper empty state when zero items
- [ ] All pages render correctly on 375px width (iPhone SE)
- [ ] All card text is ≥ 10px
- [ ] All KPI values are ≥ 14px
- [ ] No horizontal overflow on any page at 375px
- [ ] CTA buttons are visible without scrolling on featured cards at 375px
- [ ] Filter bar wraps cleanly on mobile
- [ ] UAE and KSA differences preserved (KSA buildings disabled, KSA URL-only leads valid)
- [ ] Build passes (`next build`) with zero TypeScript errors
- [ ] No `framer-motion` on mobile-critical paths
- [ ] Portal filter shows Bayut + Dubizzle + PF on UAE Recon pages

---

## 10. Files Likely Needing Changes, By Phase

### Phase A — Navigation
- `lib/countries/productNavigation.ts` (sidebar config)
- `app/dashboard/_components/CountryOverviewPage.tsx` (simplify hero)
- `app/dashboard/_components/UaeReconDataPage.tsx` (add quick-links)
- `app/dashboard/_components/KsaReconDataPage.tsx` (add quick-links)
- NEW: `app/dashboard/_components/MarketRadarPage.tsx`
- NEW: `app/dashboard/_components/CompetitorRadarPage.tsx`
- NEW: `app/dashboard/[country]/market-radar/page.tsx` (route)
- NEW: `app/dashboard/[country]/competitor-radar/page.tsx` (route)

### Phase B — Watchlist Content
- `app/dashboard/_components/InventoryPressurePage.tsx` (rename, empty state, labels)
- `app/dashboard/_components/MarketDominancePage.tsx` (rename, labels)
- `app/dashboard/_components/AgencyProfilesPage.tsx` (rename, labels)
- `app/dashboard/_components/BuildingIntelligencePage.tsx` (rename, labels)
- `app/dashboard/_components/CommunitiesPage.tsx` (rename, labels)
- `app/dashboard/_components/ActivityFeedPage.tsx` (remove backend wording, empty state)
- `app/dashboard/_components/CountryOverviewPage.tsx` (copy cleanup)

### Phase C — Mobile
- `app/dashboard/_components/InventoryPressurePage.tsx` (watchlist row layout)
- `app/dashboard/_components/MarketDominancePage.tsx` (watchlist row layout)
- `app/dashboard/_components/AgencyProfilesPage.tsx` (remove w-[64px], stack stats)
- `app/dashboard/_components/BuildingIntelligencePage.tsx` (watchlist row layout)
- `app/dashboard/_components/CommunitiesPage.tsx` (watchlist row layout)
- `app/dashboard/_components/ActivityFeedPage.tsx` (card layout)
- `app/dashboard/_components/CountryOverviewPage.tsx` (hero sizing, remove motion)
- `app/dashboard/_components/MarketIntelligencePage.tsx` (hero sizing)
- `app/dashboard/_components/ReconFiltersBar.tsx` (mobile filter layout)
- `app/dashboard/_components/ReconOpportunityCard.tsx` (CTA position on mobile)

### Phase D — Visual Polish
- All 11 page components (unify `T`/`C` token values, card bg, borders)
- Consider extracting shared `designTokens.ts` to avoid per-file token objects

### Not Touched
- `lib/data/uaeRecon.ts` — no changes needed
- `lib/data/ksaRecon.ts` — no changes needed
- `lib/data/module5.ts` — no changes needed
- `lib/recon/normalize.ts` — no changes needed
- `lib/recon/filter.ts` — no changes needed
- `lib/recon/types.ts` — no changes needed
- `lib/recon/formatters.ts` — no changes needed
- `lib/countries/countryConfig.ts` — no changes needed
- `tools/*` — no changes needed
- `exports/*` — no changes needed