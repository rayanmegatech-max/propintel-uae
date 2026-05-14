# Supabase Ingest

This folder contains the local Supabase ingestion foundation for RASAD.

Its purpose is to move approved, dashboard-safe frontend exports from the local backend factory into Supabase delivery tables, where they can be served to the SaaS dashboard through a hosted delivery warehouse/API layer.

The local PC remains the backend factory. It is responsible for scraping, cleaning, normalization, deduplication, feature generation, inspection, and export preparation.

Supabase is not the backend engine. Supabase is only the dashboard-safe delivery warehouse/API layer.

## Current Phase 5H Status

Phase 5H is complete for UAE and KSA Modules 1–5 dashboard delivery.

- Ingestion scripts exist and are active.
- Retry handling is implemented around Supabase write operations.
- Recon and Module 5 frontend adapters read Supabase first, with local JSON fallback.
- Dashboard reads are optimised: 150 rows per view limit, no `raw_item`/`jsonb` selection for page reads.
- Short-lived in-memory server cache with deduplication exists in `lib/data/supabaseServer.ts`.

## Production Flow

```text
local backend factory -> exports/frontend -> Supabase delivery tables -> server-side frontend adapters -> dashboard pages
```

## Ingestion Boundary

Only ingest approved frontend exports from `exports/frontend`.

Do not ingest:

- Raw scraper vaults.
- SQLite internals.
- Raw backend working tables.
- Phase 6 AI/vector files.
- Private evidence stores.
- Secret values, service role keys, API tokens, or credentials.

## Required Environment Variables

The ingestion utilities require:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

`SUPABASE_URL` is the Supabase project URL.  
`SUPABASE_SERVICE_ROLE_KEY` is the Supabase service role key used by trusted local ingestion utilities to write approved dashboard-safe exports into Supabase.

Never commit `.env.local`.  
Never commit Supabase keys, service role keys, API tokens, database credentials, or any other secret value.  
Never print or log the service role key.

## Target Tables

The ingestion foundation is designed for these Supabase delivery tables:

```text
ingestion_runs
export_manifests
recon_opportunities
module5_market_intelligence
```

These tables are for dashboard delivery only. They do not expose backend internals, raw scraper data, private evidence, or Phase 6 AI/vector outputs.

## UAE Production Pipeline

### 1. Run UAE local backend engines

From the UAE backend root:

```bat
cd /d C:\Users\User\Documents\malesh
```

Then execute in order:

```bat
python run_factory.py
python feature_engine/build_active_listings.py
python feature_engine/01_owner_direct_engine/owner_direct_engine.py
python feature_engine/02_price_drop_radar/price_history_engine.py
python feature_engine/02_price_drop_radar/price_drop_engine.py
python feature_engine/03_true_listing_age/true_listing_age_engine.py
python feature_engine/04_recon_hub/recon_hub_engine.py
python feature_engine/04_recon_hub/recon_hub_views.py
python feature_engine/05_market_dominance/build_market_dominance.py
python feature_engine/05_market_dominance/build_inventory_pressure.py
python feature_engine/05_market_dominance/build_agency_inventory_profile.py
python feature_engine/05_market_dominance/build_market_activity_feed.py
python feature_engine/05_market_dominance/build_module5_dashboard_views.py
```

### 2. Export UAE frontend-safe JSON files

From the dashboard repo:

```bat
cd /d C:\Users\User\Documents\malesh\re-dashboard
python tools\export_uae_recon_frontend_data.py
python tools\export_uae_module5_frontend_data.py
```

### 3. Dry-run UAE Supabase ingestion (optional)

```bat
python tools\supabase_ingest\ingest_all_frontend_exports.py --country uae --limit 20 --dry-run
```

### 4. Write UAE frontend-safe exports into Supabase

```bat
python tools\supabase_ingest\ingest_all_frontend_exports.py --country uae --batch-size 100 --write
```

### 5. Validate UAE Supabase counts

```bat
python tools\supabase_ingest\validate_supabase_counts.py --country uae
```

## KSA Production Pipeline

### 1. Run KSA local backend engines

Run exactly in this order:

```bat
cd /d C:\Users\User\Documents\malesh\KSA\normalizer
python ksa_normalizer.py

cd /d C:\Users\User\Documents\malesh\KSA\dedup
python run_ksa_dedup_factory.py --full

cd /d C:\Users\User\Documents\malesh\KSA\intelligence
python build_ksa_active_listings_unified.py

cd /d C:\Users\User\Documents\malesh\KSA\feature_engine\01_owner_direct_radar
python owner_direct_engine.py

cd /d C:\Users\User\Documents\malesh\KSA\feature_engine\02_price_history_price_drop
python price_history_engine.py
python price_drop_engine.py

cd /d C:\Users\User\Documents\malesh\KSA\feature_engine\03_true_listing_age
python true_listing_age_engine.py
python refresh_inflation_engine.py

cd /d C:\Users\User\Documents\malesh\KSA\feature_engine\04_recon_hub_combined_opportunities
python recon_hub_combined_engine.py
python recon_hub_views.py

cd /d C:\Users\User\Documents\malesh\KSA\feature_engine\05_market_dominance_inventory_velocity
python audit_ksa_module5_readiness.py
python build_ksa_market_dominance.py
python build_ksa_inventory_pressure.py
python build_ksa_agency_inventory_profile.py
python build_ksa_market_activity_feed.py
python build_ksa_module5_dashboard_views.py

cd /d C:\Users\User\Documents\malesh\KSA
python audit_ksa_backend_final_readiness.py
```

### 2. Export KSA frontend-safe JSON files

From the dashboard repo:

```bat
cd /d C:\Users\User\Documents\malesh\re-dashboard
python tools\export_ksa_recon_frontend_data.py
python tools\export_ksa_module5_frontend_data.py
```

### 3. Dry-run KSA Supabase ingestion (optional)

```bat
python tools\supabase_ingest\ingest_all_frontend_exports.py --country ksa --limit 20 --dry-run
```

### 4. Write KSA frontend-safe exports into Supabase

```bat
python tools\supabase_ingest\ingest_all_frontend_exports.py --country ksa --batch-size 100 --write
```

### 5. Validate KSA Supabase counts

```bat
python tools\supabase_ingest\validate_supabase_counts.py --country ksa
```

## Fast Daily Update (After Backend Completion)

Use this block when the backend pipelines have already generated fresh data:

```bat
cd /d C:\Users\User\Documents\malesh\re-dashboard

python tools\export_uae_recon_frontend_data.py
python tools\export_uae_module5_frontend_data.py
python tools\supabase_ingest\ingest_all_frontend_exports.py --country uae --batch-size 100 --write
python tools\supabase_ingest\validate_supabase_counts.py --country uae

python tools\export_ksa_recon_frontend_data.py
python tools\export_ksa_module5_frontend_data.py
python tools\supabase_ingest\ingest_all_frontend_exports.py --country ksa --batch-size 100 --write
python tools\supabase_ingest\validate_supabase_counts.py --country ksa

python tools\supabase_ingest\validate_supabase_counts.py --country all
```

## Combined Validation

After both countries have been ingested:

```bat
python tools\supabase_ingest\validate_supabase_counts.py --country all
```

## Frontend Read Path

The dashboard reads data from Supabase first, then falls back to local JSON if Supabase is unavailable or a Supabase read fails.

- **Supabase-first adapters**:
  - `lib/data/uaeRecon.ts`
  - `lib/data/ksaRecon.ts`
  - `lib/data/module5.ts`
- **Shared server-side Supabase read helper**: `lib/data/supabaseServer.ts`
- All Supabase reads are server-side only. The service role key is never exposed to the client.
- Local JSON fallback remains in place to ensure the dashboard still functions when Supabase is unreachable.

## Performance Notes

- Supabase dashboard reads query only the needed views.
- Query limit is **150 rows per view**.
- The `raw_item` / `jsonb` payload is **not selected** for frontend page reads.
- A short-lived in-memory server cache with deduplication reduces repeated requests.

## Optional / Later Phase 6

Phase 6 (AI vectors, pgvector, AI chat ingestion) is **not** part of normal production updates.

Phase 6 stays paused until:

- Supabase-read adapters are stable.
- Auth/RLS/subscription strategy exists.
- AI query cost/storage is understood.
- Frontend AI chat UX is designed.
- Data exposure and anti-scraping controls are planned.

Do not run Phase 6 commands in production until those conditions are met.

## Git Safety

After code changes only:

```bat
git status --short
git add path\to\changed_file
git diff --cached --name-only
git commit -m "Clear message"
git status --short
```

Do not commit generated JSON outputs unless explicitly intended. Never commit `.env.local` or any secrets.

## Beginner Checklist

Before writing to Supabase, confirm:

- `SUPABASE_URL` is configured.
- `SUPABASE_SERVICE_ROLE_KEY` is configured locally and not committed.
- The source files are under `exports/frontend`.
- The selected country is `uae`, `ksa`, or `all`.
- A successful dry run has been completed.
- The target tables are delivery tables:
  - `ingestion_runs`
  - `export_manifests`
  - `recon_opportunities`
  - `module5_market_intelligence`
- The data contains dashboard-safe fields only.
