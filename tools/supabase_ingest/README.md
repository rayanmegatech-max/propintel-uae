# Supabase Ingest

This folder contains the local Supabase ingestion foundation for RASAD.

Its purpose is to move approved, dashboard-safe frontend exports from the local backend factory into Supabase, where they can be served to the SaaS dashboard through a hosted delivery warehouse/API layer.

The local PC remains the backend factory. It is responsible for scraping, cleaning, normalization, deduplication, feature generation, inspection, and export preparation.

Supabase is not the backend engine. Supabase is only the dashboard-safe delivery warehouse/API layer.

## Ingestion Boundary

Only ingest approved frontend exports from `exports/frontend`.

Do not ingest:

- Raw scraper vaults.
- SQLite internals.
- Raw backend working tables.
- Phase 6 AI/vector files.
- Private evidence stores.
- Secret values, service role keys, API tokens, or credentials.

The intended flow is:

```text
local backend factory -> exports/frontend -> Supabase delivery warehouse/API -> dashboard
```

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

These tables are for dashboard delivery only. They should not expose backend internals, raw scraper data, private evidence, or Phase 6 AI/vector outputs.

## Dry Run Commands

Use dry runs before writing any data.

These commands will be valid once the ingestion scripts exist:

```bash
python tools\supabase_ingest\ingest_recon_exports.py --country uae --limit 20 --dry-run
python tools\supabase_ingest\ingest_recon_exports.py --country ksa --limit 20 --dry-run
python tools\supabase_ingest\ingest_module5_exports.py --country uae --limit 20 --dry-run
python tools\supabase_ingest\ingest_module5_exports.py --country ksa --limit 20 --dry-run
python tools\supabase_ingest\ingest_all_frontend_exports.py --country all --limit 20 --dry-run
```

A dry run should confirm:

- The selected country scope.
- The source files under `exports/frontend`.
- The target Supabase table names.
- The number of rows that would be prepared.
- That no Supabase rows are inserted, updated, deleted, or modified.

## Write Commands

Only run write mode after a successful dry run.

These commands will be valid once the ingestion scripts exist:

```bash
python tools\supabase_ingest\ingest_all_frontend_exports.py --country uae --write
python tools\supabase_ingest\ingest_all_frontend_exports.py --country ksa --write
```

Write mode should only publish dashboard-safe frontend exports into the delivery tables listed above.

## Validation

After ingestion, validate counts with:

```bash
python tools\supabase_ingest\validate_supabase_counts.py --country all
```

Validation should report safe operational counts only. It must not print secrets, service role keys, raw evidence, or private backend data.

## Beginner Checklist

Before writing to Supabase, confirm:

- `SUPABASE_URL` is configured.
- `SUPABASE_SERVICE_ROLE_KEY` is configured locally and not committed.
- The source files are under `exports/frontend`.
- The selected country is `uae`, `ksa`, or `all`.
- The dry run completed successfully.
- The target tables are delivery tables:
  - `ingestion_runs`
  - `export_manifests`
  - `recon_opportunities`
  - `module5_market_intelligence`
- The data contains dashboard-safe fields only.
