# PropIntel GCC — Product UX Rebuild Brief

## Purpose of this document

This document defines the product, UX, navigation, page structure, wording, and design direction for PropIntel GCC before moving to Supabase/auth/billing.

The current frontend has valuable backend intelligence, but the user experience feels too much like a technical dashboard. It exposes too many backend modules, watchlists, internal labels, dark cards, and disconnected pages.

The goal is to rebuild the frontend around real paid-user workflows.

PropIntel GCC must feel like a professional real estate intelligence SaaS for agents and agencies, not a collection of scripts or database outputs.

---

## Product positioning

PropIntel GCC is a GCC real estate intelligence SaaS for UAE and KSA.

It helps agents, agencies, team leaders, and market operators:

1. Find actionable property opportunities.
2. Detect seller/listing signals.
3. Understand market pressure and activity.
4. Track agency competition and visibility.
5. Make faster, better daily decisions using public listing intelligence.

Target subscription range:

- Pro: around $99/month
- Expert: around $169–199/month
- Agency tier later

The product must justify paid access by improving productivity, decision quality, and market awareness.

---

## Target users

### 1. Individual real estate agent

Main questions:

- Which listings should I check today?
- Which sellers/listings may be easier to approach?
- Where are price drops happening?
- Which listings look refreshed, old, or suspiciously recycled?
- Which areas should I focus on this week?

Needs:

- Fast daily workflow
- Clear opportunity ranking
- Simple filters
- Source links
- Contact/source confidence
- No confusing technical labels

---

### 2. Boutique agency owner

Main questions:

- Where should my team focus?
- Which communities/buildings have opportunity?
- Which competitors are active?
- Which market looks underserved or over-supplied?
- Where can we win visibility?

Needs:

- Market summaries
- Area/building pressure signals
- Competitor visibility
- Agency movement
- Team-friendly prioritization

---

### 3. Team leader / market analyst

Main questions:

- What changed in the market?
- Which agencies are dominating?
- Which communities are fragmented?
- Where is inventory pressure rising?
- Which locations/buildings need monitoring?

Needs:

- Market Radar
- Competitor Radar
- Watchlists rewritten as business insights
- Clear scores and reasons
- Exportable/monitorable intelligence later

---

## Current UX problem

The current sidebar and pages expose too many modules:

- Recon
- Owner / Direct
- Price Drops
- Listing Age
- Market Intel
- Pressure
- Dominance
- Agencies
- Activity
- Buildings
- Communities
- Data Quality

This makes the product feel crowded and hard to understand.

Many current sections use watchlists such as:

- Pressure Watchlist
- Visibility Watchlist
- Agency Watchlist
- Signal Timeline
- Building Watchlist
- Location Watchlist

These are not clear enough for agents.

The user should not have to ask:

- What is this?
- Why should I care?
- What action do I take?
- Is this a lead, a market signal, a competitor signal, or just a statistic?

---

## New product structure

The frontend should be organized around 5 primary areas.

### Sidebar V1

COMMAND

- Command Center

OPPORTUNITIES

- Deal Radar

MARKET

- Market Radar
- Competitor Radar

ADMIN

- Data Quality

Old routes can remain alive internally, but they should not dominate the sidebar.

---

## Product areas

# 1. Command Center

## Purpose

The Command Center is the homepage.

It answers:

> What should I open first today?

It should not feel like a module directory.

## User pain point

Agents and agencies do not want to understand 12 pages. They want to know where to start.

## Main sections

### 1. Start Today

Cards:

- Deal Radar
- Market Radar
- Competitor Radar

Each card must explain the business value in plain language.

Example:

**Deal Radar**  
Find owner/direct signals, price drops, listing refreshes, and high-priority property opportunities.

CTA:

- Open Deal Radar

**Market Radar**  
See communities and buildings where pressure, activity, or inventory is moving.

CTA:

- Open Market Radar

**Competitor Radar**  
Track agencies, dominance, visibility, and competitive concentration.

CTA:

- Open Competitor Radar

---

### 2. Daily Snapshot

Show a small summary of:

- Opportunity count
- Market movement count
- Competitor/agency signal count
- Last updated timestamp
- Data freshness/trust state

Do not show fake data. Use only available exports/manifest data.

---

### 3. Data Trust Strip

Small footer/status strip:

- Last synced
- UAE/KSA workspace
- Public listing intelligence
- Source verification reminder

Avoid phrases like:

- local export bridge
- dashboard-safe
- sample rows
- internal table
- raw records

---

## Remove or hide from homepage

The homepage should not show a huge “All modules” grid unless it is in an admin/developer section.

Avoid exposing:

- All UAE modules
- Raw module names
- Internal export language
- Data exposure rules
- Dashboard-safe table names
- Local export mode
- Local export bridge

These are internal operational details, not customer-facing product value.

---

# 2. Deal Radar

## Purpose

Deal Radar is the main paid agent workflow.

It combines listing-level opportunity signals:

- Recon Hub
- Owner / Direct
- Price Drops
- Listing Truth
- Refresh Inflation
- Stale/aged listing signals

## Main user question

> Which listings should I review or act on today?

## User pain points

- Agents waste time browsing portals manually.
- Good opportunities are buried.
- Price drops are hard to track.
- Owner/direct listings are hard to find.
- Refreshed or recycled listings hide true listing age.
- Agents need source links and verification.

## Main sections

### 1. Top Action Metrics

Suggested KPI cards:

- Best Opportunities Today
- Owner / Direct Signals
- Price Drop Signals
- Listing Truth Signals

Each card should be clickable or should filter the main feed.

---

### 2. Unified Opportunity Feed

One ranked list of listing opportunities.

Fields to show:

- Listing title
- Price
- Location
- Property type
- Beds/baths/size if available
- Portal/source
- Agency/agent if available
- Opportunity badges
- Reason for signal
- Source link

Badges:

- Price Drop
- Owner / Direct
- Contact Signal
- Fresh Signal
- Listing Age Signal
- Verify Source
- High Priority

Avoid backend labels:

- source-led
- stale
- old
- row
- record
- signal class
- dashboard-safe
- exported sample
- internal score unless explained

---

### 3. Filters

Useful filters:

- Location
- Portal
- Category
- Price range
- Owner/direct
- Price movement
- Listing truth/refresh
- Contact/source availability

Portal filter must include all visible sources when rows exist:

- Bayut
- Dubizzle
- Property Finder / pf
- KSA portals where applicable

---

### 4. Listing Card CTAs

Primary CTA:

- Open Listing

Secondary CTAs for later:

- Save
- Mark Reviewed
- Copy Link
- Add to Watchlist

If these features are not built yet, do not fake functionality. Design can reserve space but should not claim functionality that does not exist.

---

## Product-safe wording

Use:

- Review first
- Verify current source
- Price moved
- Owner/direct signal
- Public listing evidence
- Contact path available
- Source listing

Avoid:

- Fraud
- Fake listing
- Scam
- Stale as accusation
- Manipulation
- Dashboard-safe
- Raw event
- Suspicious unless carefully qualified

---

# 3. Market Radar

## Purpose

Market Radar is the strategic area/building/community intelligence page.

It combines:

- Market Intelligence
- Inventory Pressure
- Activity Feed
- Building Intelligence
- Community Intelligence

## Main user question

> Where should I focus my market activity this week?

## User pain points

- Agents do not know which areas are heating up.
- Agencies do not know where to farm.
- Inventory pressure is hard to see from portals.
- Buildings/communities with movement are scattered across portals.
- Agents need location-level decisions, not raw statistics.

## Main sections

### 1. Market Movement Summary

Cards:

- Active Communities
- Buildings to Monitor
- Supply Pressure Alerts
- Recent Market Movement

---

### 2. Supply Pressure Alerts

Replaces:

- Pressure Watchlist

Meaning:

Markets/buildings/communities where public listing supply, price drops, refresh activity, or aged inventory suggest pressure.

Why an agent cares:

- Possible motivated sellers
- Negotiation opportunities
- Areas to farm
- Areas where listings may need repricing
- Areas where inventory is crowded

Fields:

- Location/building/community
- Active listings
- Pressure score/level
- Price-drop count/rate if available
- Aged/refresh signal if available
- Suggested action

Suggested CTAs:

- View listings
- Check price drops
- Monitor market
- Open source group later

Avoid:

- pressure record
- row count
- stale supply without explanation
- old inventory as accusation

---

### 3. Recent Market Movement

Replaces:

- Signal Timeline

Meaning:

Plain-English feed of recent public listing movement.

Bad current wording:

- Agency public portfolio signal
- signal class: ELEVATED_SIGNAL_PORTFOLIO
- CITY_FOCUSED

Better wording:

- Agency activity detected in Riyadh · Al Yarmouk
- 32 visible listings detected for this agency in this district.
- This may indicate stronger activity or market focus.

Fields:

- Signal title
- Location
- Agency/market/building if available
- Count or movement
- Date/time
- Signal type
- Recommended action

CTAs:

- Review market
- Compare area
- Open related listings

---

### 4. Buildings to Monitor

Replaces:

- Building Watchlist

Meaning:

Buildings with visible listing activity, pressure, or concentration.

Fields:

- Building name
- Community/city
- Active listings
- Pressure signal
- Top agency/share if available
- Price movement if available

CTAs:

- View building intelligence
- Check listings
- Monitor building

---

### 5. Communities to Monitor

Replaces:

- Location Watchlist

Meaning:

Communities/districts where activity, pressure, or visibility is changing.

Fields:

- Community/district
- City
- Active listings
- Pressure score/level
- Top agency share if available
- Market type: competitive / dominated / fragmented

CTAs:

- View community
- Compare market
- Monitor location

---

# 4. Competitor Radar

## Purpose

Competitor Radar is the agency/competition intelligence page.

It combines:

- Market Dominance
- Agency Profiles
- Agency Movement
- Visibility Watchlist

## Main user question

> Who is winning visibility, and where can I compete?

## User pain points

- Agents do not know who dominates a building/community.
- Agencies do not know where competitors are expanding.
- It is hard to see fragmented markets.
- Team leaders need to decide where to compete or avoid.

## Main sections

### 1. Competitive Summary

Cards:

- Agency Leaders
- Dominated Markets
- Fragmented/Open Markets
- Agency Movement

---

### 2. Market Share Leaders

Replaces:

- Visibility Watchlist

Meaning:

Locations/buildings where one or more agencies hold strong visible listing share.

Why users care:

- Know who dominates a market
- Identify hard-to-enter areas
- Find competitor concentration
- Spot fragmented markets with opportunity

Fields:

- Market/building/community
- Top agency
- Top agency share
- Listing count
- Competition level

CTAs:

- View market dominance
- Compare agencies
- Monitor market

---

### 3. Agency Movement Monitor

Replaces:

- Agency Watchlist

Meaning:

Agencies with visible portfolio activity, pressure, or concentration.

Fields:

- Agency name
- Main location
- Visible listings
- Portfolio pressure/growth signal
- Top category
- Dominance/share if available

CTAs:

- View agency
- Compare competitor
- Monitor agency

---

### 4. Open / Fragmented Markets

Meaning:

Markets where no single agency dominates, making them easier to enter.

Fields:

- Location
- Total listings
- Top agency share
- Number of visible agencies if available
- Competition level

CTAs:

- Explore market
- Build farming list

---

## Avoid competitor wording that sounds accusatory

Avoid:

- suspicious
- manipulation
- fake dominance
- exposed agency
- bad actor

Use:

- visible listing share
- public agency footprint
- market concentration
- fragmented market
- competitive market
- agency activity

---

# 5. Data Quality

## Purpose

Data Quality is an admin/trust page.

It should be available but not emphasized to normal agents unless needed.

## Main user question

> Can I trust this data?

## Sections

- Last export/sync
- Source coverage
- Countries enabled
- Module status
- Known limitations
- Public source verification reminder

Use customer-safe wording.

Avoid exposing raw table names unless in admin mode.

---

# Navigation rules

## Primary sidebar

Visible:

COMMAND

- Command Center

OPPORTUNITIES

- Deal Radar

MARKET

- Market Radar
- Competitor Radar

ADMIN

- Data Quality

## Hidden/internal routes

These can remain accessible directly but should not clutter the main sidebar:

- owner-direct
- price-drops
- listing-age
- market-intelligence
- inventory-pressure
- market-dominance
- agency-profiles
- activity-feed
- buildings
- communities

These old pages can later become drill-down pages from the master products.

---

# Label replacements

## Current label → Better label

Recon Hub → Deal Radar / Best Opportunities  
Owner / Direct Radar → Owner / Direct Signals  
Price Drop Radar → Price Drop Signals  
Listing Age → Listing Truth  
Market Intel → Market Radar  
Pressure → Supply Pressure  
Dominance → Market Share  
Agencies → Agency Movement  
Activity → Recent Market Movement  
Buildings → Buildings to Monitor  
Communities → Communities to Monitor  
Pressure Watchlist → Supply Pressure Alerts  
Visibility Watchlist → Market Share Leaders  
Agency Watchlist → Agency Movement Monitor  
Signal Timeline → Recent Market Movement  
Building Watchlist → Buildings to Monitor  
Location Watchlist → Communities to Monitor  
Data & Product Notes → Data Trust Notes  
Dashboard-safe → Product-ready  
Records → Listings / Signals / Markets, depending on context  
Exported sample → Preview set / Current view  
Local export → Local preview  
Stale / Old → Aged listing signal / Long-running listing signal  
Source-led → Source available / Verify source  
Signal class → Signal type  
Elevated signal portfolio → Increased public activity  
Portfolio pressure → High visible portfolio concentration  

---

# Dark theme design direction

The current UI feels too black and flat.

The dark theme should feel premium, not dead.

## Rules

1. Use layered surfaces:
   - App background: near-black
   - Page panels: slightly lighter
   - Cards: lifted but subtle
   - Important cards: tinted gradient, not full black

2. Reduce border noise:
   - Use fewer borders
   - Use shadow/glow only for important active cards

3. Improve hierarchy:
   - Big page title
   - Clear subtitle
   - 3–4 meaningful KPI cards max
   - One main action area

4. Avoid too many tiny labels.

5. Use accent colors consistently:
   - Green/emerald: action / primary opportunity
   - Cyan/blue: market movement / activity
   - Amber: pressure / caution
   - Violet: listing truth / verification
   - Gray/slate: neutral/admin

6. No page should look like a terminal or database viewer.

---

# Mobile-first design rules

Mobile cannot be a squeezed desktop.

## Mobile navigation

- Sidebar should collapse.
- Bottom or drawer navigation should expose only:
  - Command
  - Deal Radar
  - Market
  - Competitor
  - Data

## Mobile cards

- One card per row.
- No wide tables.
- Important number/title first.
- CTA visible without horizontal scrolling.
- Filters should collapse into a filter drawer or compact chips.

## Minimum typography

- Page title: 24–30px mobile
- Card title: 15–17px
- Body text: 13–15px
- Tiny metadata: avoid below 12px

## Mobile watchlists

Each card should show:

- Main subject
- Why it matters
- 2–3 key metrics
- One CTA

Avoid:

- 5+ columns
- tiny score tables
- internal labels
- long metadata chains

---

# Desktop design rules

Desktop should use space well, but not show everything at once.

## Page structure

1. Hero/title area
2. KPI/action cards
3. Main list or intelligence panel
4. Secondary drill-down cards

Do not show many unrelated modules on one page.

## Cards

Every card must answer:

1. What is this?
2. Why should the user care?
3. What should they do next?

---

# Data accuracy rules

Do not invent data.

Do not show a portal/source/filter if it has no rows.

Do not claim “owner” as a fact unless the signal is verified. Use:

- Owner/direct signal
- Owner-like signal
- Direct-from-owner evidence
- Verify source

Do not accuse listings or agencies.

Use:

- public listing evidence
- visible listing activity
- source verification recommended

Avoid:

- fraud
- fake
- scam
- manipulation
- suspicious unless it is internal/admin only

---

# Implementation strategy

Do not rebuild everything at once.

## Phase 1 — Product navigation cleanup

Goal:

- Sidebar becomes simple.
- Old routes stay alive.
- New product pages exist.

## Phase 2 — Command Center rebuild

Goal:

- Replace module directory with real launchpad:
  - Deal Radar
  - Market Radar
  - Competitor Radar
  - Data freshness

## Phase 3 — Deal Radar rebuild

Goal:

- Make Recon the main paid workflow.
- Combine listing-level signals into one strong agent action page.

## Phase 4 — Market Radar rebuild

Goal:

- Combine pressure, activity, buildings, and communities into one decision page.

## Phase 5 — Competitor Radar rebuild

Goal:

- Combine dominance and agency profiles into one competitive intelligence page.

## Phase 6 — Mobile UX pass

Goal:

- Fix mobile nav, cards, filters, spacing, font sizes, and dark-theme heaviness.

## Phase 7 — QA and then Supabase

Only after the product structure feels professional.

---

# Hard rules for future AI/code sessions

- Do not write code before confirming the product purpose.
- Do not redesign many pages in one response.
- Do not delete old routes.
- Do not touch backend/data/export scripts unless the task is specifically data-related.
- Do not add Supabase/auth/billing/Stripe in this phase.
- Do not use mock data.
- Do not expose raw/internal table names to customers.
- Preserve UAE/KSA differences.
- Preserve Vercel deployability.
- Keep build/lint green after every batch.