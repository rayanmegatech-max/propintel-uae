-- =============================================================================
-- RASAD — GCC Real Estate Intelligence
-- Phase 5H: Supabase MVP Schema
-- File: supabase/sql/001_dashboard_safe_schema.sql
--
-- Supabase is the dashboard-safe delivery warehouse/API layer only.
-- The local PC factory (scrapers, normaliser, product engines) writes via
-- service-role. Frontend reads via RLS policies added in later migrations.
--
-- Excluded from this schema:
--   - Raw scraper vaults / SQLite internals
--   - Phase 6 AI / vector / pgvector tables
--   - Public read policies (separate migration)
--   - Ingestion scripts (separate tooling)
--
-- Idempotent: safe to re-run.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";


-- =============================================================================
-- TABLE 1: public.ingestion_runs
-- Audit log of every factory export batch pushed to Supabase.
-- One row per country/module push. Service-role writes only.
-- =============================================================================

create table if not exists public.ingestion_runs (
  id               uuid        primary key default gen_random_uuid(),

  -- Factory-stamped stable identifier (e.g. "uae-recon-20260514-001").
  -- Unique so idempotent re-pushes do not create duplicates.
  run_id           text        not null,

  -- 'uae' | 'ksa' | 'all'
  country          text        not null
    constraint ingestion_runs_country_check
    check (country in ('uae', 'ksa', 'all')),

  -- Dashboard product slug: 'recon', 'price-drops', 'owner-direct',
  -- 'listing-age', 'market-intel'
  module           text        not null,

  -- When the local factory completed this export batch
  exported_at      timestamptz not null,

  -- When this row landed in Supabase
  ingested_at      timestamptz not null default now(),

  row_count        integer     not null default 0,
  rows_upserted    integer     not null default 0,

  -- 'pending' | 'complete' | 'partial' | 'failed'
  status           text        not null default 'pending',

  -- Optional structured metadata: factory version, source hash, etc.
  meta             jsonb,

  constraint ingestion_runs_run_id_unique unique (run_id)
);

create index if not exists ingestion_runs_country_module_idx
  on public.ingestion_runs (country, module);

create index if not exists ingestion_runs_exported_at_idx
  on public.ingestion_runs (exported_at desc);

-- Partial index: track non-terminal runs only
create index if not exists ingestion_runs_status_idx
  on public.ingestion_runs (status)
  where status <> 'complete';

alter table public.ingestion_runs enable row level security;
-- No public policies. Service-role bypasses RLS. Policies added in 002.


-- =============================================================================
-- TABLE 2: public.export_manifests
-- One row per exported view/tab file within a run.
-- The dashboard reads this as a lightweight data catalogue: which views are
-- live, how fresh, and how many rows are available.
-- =============================================================================

create table if not exists public.export_manifests (
  id               uuid        primary key default gen_random_uuid(),

  ingestion_run_id uuid        references public.ingestion_runs (id)
                               on delete cascade,

  -- 'uae' | 'ksa'
  country          text        not null
    constraint export_manifests_country_check
    check (country in ('uae', 'ksa')),

  -- Module slug: 'recon', 'price-drops', 'owner-direct', 'listing-age',
  -- 'market-intel'
  module           text        not null,

  -- View/tab key within the module: 'hot_leads', 'price_drops',
  -- 'owner_direct', 'stale_price_drops', 'refresh_inflation', etc.
  view_key         text        not null,

  -- Original source filename on the local factory (traceability)
  source_file      text        not null,

  -- When the local factory produced this file
  exported_at      timestamptz not null,

  total_rows       integer     not null default 0,
  rows_pushed      integer     not null default 0,

  -- Set true by the factory only after all rows for this view are confirmed
  is_live          boolean     not null default false,

  -- Full source manifest/export metadata from the factory
  payload          jsonb       not null,

  -- Additional runtime context: filter defaults, column hints, etc.
  meta             jsonb,

  created_at       timestamptz not null default now(),

  constraint export_manifests_unique
    unique (country, module, source_file, exported_at)
);

create index if not exists export_manifests_country_module_idx
  on public.export_manifests (country, module);

create index if not exists export_manifests_country_view_idx
  on public.export_manifests (country, view_key);

create index if not exists export_manifests_exported_at_idx
  on public.export_manifests (exported_at desc);

-- Partial index: dashboard only queries live views
create index if not exists export_manifests_is_live_idx
  on public.export_manifests (country, module, view_key)
  where is_live = true;

alter table public.export_manifests enable row level security;
-- No public policies. Service-role bypasses RLS. Policies added in 002.


-- =============================================================================
-- TABLE 3: public.recon_opportunities
-- Modules 1–4 product output.
-- One row per ranked opportunity per view per country.
--
-- view_key examples:
--   'hot_leads'         Module 1 — Deal Radar
--   'owner_direct'      Module 2 — Owner/Direct Signals
--   'price_drops'       Module 3 — Price Drop Radar
--   'stale_price_drops' Module 4 — Listing Age / Truth
--   'refresh_inflation' Module 4 — Refresh/Repost Detection
--   'listing_truth'     Module 4 — True Age Signals
--   'residential_rent' | 'residential_buy' | 'commercial' | 'short_rental'
--
-- Factory upserts on (country, view_key, external_key).
-- Re-running the factory for the same period overwrites scores and ranks.
-- =============================================================================

create table if not exists public.recon_opportunities (
  id               uuid        primary key default gen_random_uuid(),

  ingestion_run_id uuid        references public.ingestion_runs (id)
                               on delete set null,

  -- 'uae' | 'ksa'
  country          text        not null
    constraint recon_opportunities_country_check
    check (country in ('uae', 'ksa')),

  -- Tab/view identifier. Must match export_manifests.view_key.
  view_key         text        not null,

  -- Stable key from source data (portal listing ID or factory compound key).
  -- With (country, view_key) this forms the natural upsert identity.
  external_key     text        not null,

  -- ── Ranking & scoring ─────────────────────────────────────────────────────

  score            numeric(5,2),
  rank             integer,
  priority_label   text,        -- e.g. 'hot', 'warm', 'cold'
  recommended_action text,      -- e.g. 'Verify source before outreach'

  -- ── Location ──────────────────────────────────────────────────────────────

  city             text,
  district         text,
  community        text,
  location_label   text,        -- pre-formatted display string

  -- ── Property classification ───────────────────────────────────────────────

  property_type    text,        -- 'apartment', 'villa', 'office', etc.
  source_category  text,        -- 'residential', 'commercial', 'short_rental'
  purpose          text,        -- 'rent' | 'sale'
  bedrooms         integer,
  bathrooms        integer,
  size_value       numeric(12,2),
  size_label       text,        -- e.g. '1,250 sqft' — pre-formatted

  -- ── Pricing ───────────────────────────────────────────────────────────────

  price            numeric(16,2),
  price_label      text,        -- display override e.g. 'Current Price'
  currency         text,        -- 'AED' | 'SAR'
  price_frequency  text,        -- 'yearly' | 'monthly' | 'weekly' | 'daily'
  old_price        numeric(16,2),
  new_price        numeric(16,2),
  drop_amount      numeric(16,2),
  drop_pct         numeric(6,3), -- e.g. 12.500 = 12.5 %

  -- ── Source & portal ───────────────────────────────────────────────────────

  source_portal    text,        -- 'bayut', 'propertyfinder', 'dubizzle', etc.
  listing_url      text,
  source_url       text,        -- canonical source URL (may differ from listing_url)
  source_table     text,        -- factory internal table name (traceability)

  -- ── Contact signals ───────────────────────────────────────────────────────

  has_phone        boolean      not null default false,
  has_whatsapp     boolean      not null default false,
  has_email        boolean      not null default false,

  -- True when any contact signal is present (phone OR whatsapp OR email).
  -- Maintained by factory; avoids OR expressions in hot query paths.
  has_contact      boolean      not null default false,

  is_owner_direct  boolean      not null default false,
  agent_name       text,
  agency_name      text,

  -- ── Product signal flags ──────────────────────────────────────────────────

  has_price_movement  boolean   not null default false,
  has_refresh_signal  boolean   not null default false,

  -- Listing age in days as determined by the factory truth engine.
  -- May differ from portal-advertised age when refresh inflation is detected.
  true_age_days    numeric(8,1),

  -- ── Signal badges & raw payload ───────────────────────────────────────────

  -- [{"label":"Price Drop"}, {"label":"Owner / Direct"}]
  signal_badges    jsonb        not null default '[]'::jsonb,

  -- Full normalised opportunity object from the factory normaliser.
  -- Dashboard components use projected columns for queries and fall back
  -- to raw_item for fields not yet promoted to projected columns.
  raw_item         jsonb        not null,

  -- ── Timestamps ────────────────────────────────────────────────────────────

  first_seen_at    timestamptz,
  last_seen_at     timestamptz,
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now(),

  -- ── Constraints ───────────────────────────────────────────────────────────

  constraint recon_opportunities_natural_key
    unique (country, view_key, external_key)
);

-- Primary list-view queries
create index if not exists recon_opp_country_view_score_idx
  on public.recon_opportunities (country, view_key, score desc nulls last);

create index if not exists recon_opp_country_view_rank_idx
  on public.recon_opportunities (country, view_key, rank asc nulls last);

-- Filter: location
create index if not exists recon_opp_country_city_idx
  on public.recon_opportunities (country, city);

-- Filter: source portal
create index if not exists recon_opp_country_portal_idx
  on public.recon_opportunities (country, source_portal);

-- Partial indexes: boolean signal filters (only index the true subset)
create index if not exists recon_opp_contactable_idx
  on public.recon_opportunities (country, view_key)
  where has_contact = true;

create index if not exists recon_opp_price_movement_idx
  on public.recon_opportunities (country, view_key)
  where has_price_movement = true;

create index if not exists recon_opp_owner_direct_idx
  on public.recon_opportunities (country, view_key)
  where is_owner_direct = true;

-- Freshness
create index if not exists recon_opp_updated_at_idx
  on public.recon_opportunities (country, updated_at desc);

-- Ad-hoc JSONB queries and future AI/copilot field access
create index if not exists recon_opp_raw_item_gin_idx
  on public.recon_opportunities using gin (raw_item);

alter table public.recon_opportunities enable row level security;
-- No public policies. Service-role bypasses RLS. Policies added in 002.

-- Factory upsert pattern:
--   insert into public.recon_opportunities (...) values (...)
--   on conflict (country, view_key, external_key)
--   do update set score = excluded.score, rank = excluded.rank,
--                 raw_item = excluded.raw_item, updated_at = now(), ...;


-- =============================================================================
-- TABLE 4: public.module5_market_intelligence
-- Module 5 product output.
-- One row per ranked entity per view per country.
--
-- view_key examples:
--   'market_radar'       Market-level signals and trends
--   'competitor_radar'   Portal/agency competitive activity
--   'agency_activity'    Agency listing behaviour and market share
--   'inventory_pressure' Area-level supply/demand pressure
--   'market_dominance'   Top agency/portal dominance rankings
--   'activity_feed'      Recent market activity signals
--
-- entity_type + entity_key classify what a row describes:
--   entity_type = 'agency'  | entity_key = '<agency_slug>'
--   entity_type = 'area'    | entity_key = '<area_slug>'
--   entity_type = 'portal'  | entity_key = '<portal_slug>'
--   entity_type = 'signal'  | entity_key = '<signal_id>'
-- =============================================================================

create table if not exists public.module5_market_intelligence (
  id               uuid        primary key default gen_random_uuid(),

  ingestion_run_id uuid        references public.ingestion_runs (id)
                               on delete set null,

  -- 'uae' | 'ksa'
  country          text        not null
    constraint module5_country_check
    check (country in ('uae', 'ksa')),

  view_key         text        not null,

  -- Deterministic factory-generated slug scoped to (country, view_key).
  external_key     text        not null,

  -- ── Entity classification ─────────────────────────────────────────────────

  entity_type      text,        -- 'agency' | 'area' | 'portal' | 'agent' | 'signal'
  entity_key       text,        -- slug/identifier for the entity
  entity_label     text,        -- human-readable display name

  -- ── Ranking & metrics ─────────────────────────────────────────────────────

  rank             integer,
  metric_value     numeric(16,4),
  metric_label     text,
  metric_value_2   numeric(16,4),
  metric_label_2   text,
  change_pct       numeric(8,3),
  trend_direction  text,        -- 'up' | 'down' | 'flat'

  -- Flexible display labels for view-specific UI elements
  label_1          text,
  label_2          text,

  recommended_action text,

  -- ── Location ──────────────────────────────────────────────────────────────

  city             text,
  district         text,
  community        text,
  building         text,
  location_label   text,

  -- ── Entity detail (projected for agency/agent/portal views) ───────────────

  agency_name      text,
  agent_name       text,
  source_portal    text,
  source_category  text,
  purpose          text,
  property_type    text,

  -- ── Observation period ────────────────────────────────────────────────────

  period_label     text,        -- e.g. '2026-05' for monthly views
  period_start     timestamptz,
  period_end       timestamptz,

  -- ── Raw payload ───────────────────────────────────────────────────────────

  -- Full market intelligence payload from the factory.
  -- Dashboard components fall back here for fields not yet projected.
  raw_item         jsonb        not null,

  -- ── Timestamps ────────────────────────────────────────────────────────────

  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now(),

  -- ── Constraints ───────────────────────────────────────────────────────────

  constraint module5_natural_key
    unique (country, view_key, external_key)
);

-- Primary list-view queries
create index if not exists module5_country_view_rank_idx
  on public.module5_market_intelligence (country, view_key, rank asc nulls last);

create index if not exists module5_country_view_metric_idx
  on public.module5_market_intelligence (country, view_key, metric_value desc nulls last);

-- Entity drill-down
create index if not exists module5_country_entity_idx
  on public.module5_market_intelligence (country, entity_type, entity_key);

-- Filter: location
create index if not exists module5_country_city_idx
  on public.module5_market_intelligence (country, city);

-- Filter: agency (agency activity and dominance views)
create index if not exists module5_country_agency_idx
  on public.module5_market_intelligence (country, agency_name)
  where agency_name is not null;

-- Freshness
create index if not exists module5_updated_at_idx
  on public.module5_market_intelligence (country, updated_at desc);

-- Ad-hoc JSONB queries and future AI/copilot field access
create index if not exists module5_raw_item_gin_idx
  on public.module5_market_intelligence using gin (raw_item);

alter table public.module5_market_intelligence enable row level security;
-- No public policies. Service-role bypasses RLS. Policies added in 002.

-- Factory upsert pattern:
--   insert into public.module5_market_intelligence (...) values (...)
--   on conflict (country, view_key, external_key)
--   do update set rank = excluded.rank, metric_value = excluded.metric_value,
--                 raw_item = excluded.raw_item, updated_at = now(), ...;


-- =============================================================================
-- Planned follow-on migrations:
--
--   002_rls_read_policies.sql
--       Authenticated SELECT policies, optionally scoped by country.
--
--   003_updated_at_triggers.sql
--       Before-update triggers to auto-set updated_at on recon_opportunities
--       and module5_market_intelligence.
--
--   004_views_and_functions.sql
--       Convenience views: live_recon_opportunities, live_market_intelligence.
--       Helper: get_latest_manifest(country text, module text).
-- =============================================================================
