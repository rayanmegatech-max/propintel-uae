-- =============================================================================
-- RASAD — GCC Real Estate Intelligence
-- Phase 5H: Dashboard-Safe Supabase Schema
--
-- Supabase is the dashboard-safe delivery warehouse/API layer only.
-- Service-role ingestion is server-side only.
-- Frontend read policies are added in a later migration.
--
-- Included:
--   - Modules 1-5 frontend-safe exports
--
-- Excluded:
--   - Raw scraper vault tables
--   - SQLite internal tables
--   - Module 6 / AI vector tables
--   - Public read policies
--
-- Safe to run after dropping the four dashboard-safe tables.
-- =============================================================================

create extension if not exists "pgcrypto";


-- =============================================================================
-- TABLE 1: public.ingestion_runs
-- Server-side audit log for ingestion script executions.
-- =============================================================================

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  run_id text not null unique,
  country text not null check (country in ('uae','ksa','all')),
  module text not null,
  status text not null check (status in ('started','success','failed')),
  source_folder text,
  files_count integer not null default 0,
  rows_count integer not null default 0,
  error_message text,
  started_at timestamptz default now(),
  finished_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists ingestion_runs_country_module_idx
  on public.ingestion_runs (country, module);

create index if not exists ingestion_runs_created_at_idx
  on public.ingestion_runs (created_at desc);

create index if not exists ingestion_runs_status_idx
  on public.ingestion_runs (status);

alter table public.ingestion_runs enable row level security;


-- =============================================================================
-- TABLE 2: public.export_manifests
-- Module-level and file-level manifest payloads from frontend-safe exports.
-- =============================================================================

create table if not exists public.export_manifests (
  id uuid primary key default gen_random_uuid(),
  run_id text,
  country text not null check (country in ('uae','ksa')),
  module text not null,
  export_name text not null default 'unknown',
  exported_at timestamptz not null default now(),
  source_file text not null default 'unknown',
  payload jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),

  unique (country, module, source_file, exported_at)
);

create index if not exists export_manifests_country_module_idx
  on public.export_manifests (country, module);

create index if not exists export_manifests_exported_at_idx
  on public.export_manifests (exported_at desc);

create index if not exists export_manifests_payload_gin_idx
  on public.export_manifests using gin (payload);

alter table public.export_manifests enable row level security;


-- =============================================================================
-- TABLE 3: public.recon_opportunities
-- Modules 1-4 frontend-safe opportunity rows.
-- =============================================================================

create table if not exists public.recon_opportunities (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('uae','ksa')),
  view_key text not null,
  external_key text not null,
  rank integer,
  score numeric,
  priority text,
  city text,
  district text,
  community text,
  location_label text,
  source_portal text,
  source_category text,
  purpose text,
  property_type text,
  title text,
  price numeric,
  old_price numeric,
  new_price numeric,
  drop_amount numeric,
  drop_pct numeric,
  agent_name text,
  agency_name text,
  listing_url text,
  source_url text,
  has_phone boolean not null default false,
  has_whatsapp boolean not null default false,
  has_email boolean not null default false,
  has_contact boolean not null default false,
  is_owner_direct boolean not null default false,
  has_price_movement boolean not null default false,
  has_refresh_signal boolean not null default false,
  true_age_days numeric,
  recommended_action text,
  badges jsonb,
  raw_item jsonb not null,
  generated_at timestamptz,
  exported_at timestamptz,
  ingested_at timestamptz default now(),

  unique (country, view_key, external_key)
);

create index if not exists recon_country_view_score_idx
  on public.recon_opportunities (country, view_key, score desc);

create index if not exists recon_country_view_rank_idx
  on public.recon_opportunities (country, view_key, rank asc);

create index if not exists recon_country_city_idx
  on public.recon_opportunities (country, city);

create index if not exists recon_country_source_portal_idx
  on public.recon_opportunities (country, source_portal);

create index if not exists recon_has_contact_idx
  on public.recon_opportunities (country, view_key)
  where has_contact = true;

create index if not exists recon_price_movement_idx
  on public.recon_opportunities (country, view_key)
  where has_price_movement = true;

create index if not exists recon_owner_direct_idx
  on public.recon_opportunities (country, view_key)
  where is_owner_direct = true;

create index if not exists recon_raw_item_gin_idx
  on public.recon_opportunities using gin (raw_item);

alter table public.recon_opportunities enable row level security;


-- =============================================================================
-- TABLE 4: public.module5_market_intelligence
-- Module 5 frontend-safe market intelligence rows.
-- =============================================================================

create table if not exists public.module5_market_intelligence (
  id uuid primary key default gen_random_uuid(),
  country text not null check (country in ('uae','ksa')),
  view_key text not null,
  external_key text not null,
  entity_type text,
  entity_key text,
  entity_label text,
  rank integer,
  metric_value numeric,
  metric_label text,
  metric_value_2 numeric,
  metric_label_2 text,
  change_pct numeric,
  trend_direction text,
  city text,
  district text,
  community text,
  building text,
  location_label text,
  agency_name text,
  agent_name text,
  source_portal text,
  source_category text,
  purpose text,
  property_type text,
  recommended_action text,
  label_1 text,
  label_2 text,
  raw_item jsonb not null,
  generated_at timestamptz,
  exported_at timestamptz,
  ingested_at timestamptz default now(),

  unique (country, view_key, external_key)
);

create index if not exists module5_country_view_rank_idx
  on public.module5_market_intelligence (country, view_key, rank asc);

create index if not exists module5_country_view_metric_idx
  on public.module5_market_intelligence (country, view_key, metric_value desc);

create index if not exists module5_country_entity_idx
  on public.module5_market_intelligence (country, entity_type, entity_key);

create index if not exists module5_country_city_idx
  on public.module5_market_intelligence (country, city);

create index if not exists module5_country_agency_idx
  on public.module5_market_intelligence (country, agency_name)
  where agency_name is not null;

create index if not exists module5_raw_item_gin_idx
  on public.module5_market_intelligence using gin (raw_item);

alter table public.module5_market_intelligence enable row level security;


-- =============================================================================
-- RLS is enabled on all dashboard-safe tables.
-- No public read policies are defined here.
-- Service-role ingestion bypasses RLS server-side.
-- Frontend read policies come later.
-- =============================================================================
