from __future__ import annotations

from collections.abc import Callable
from pathlib import Path
import sys
import time

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import argparse
from typing import Any

from tools.supabase_ingest.config import (
    chunked,
    expand_countries,
    get_country_export_dir,
    get_supabase_client,
    make_run_id,
    read_json,
    utc_now_iso,
)
from tools.supabase_ingest.mappers import map_recon_item


TARGET_TABLE = "recon_opportunities"
MODULE_NAME = "recon"
MANIFEST_FILE = "recon_manifest.json"
SCRIPT_NAME = "ingest_recon_exports.py"
RUN_ON_CONFLICT = "run_id"
MANIFEST_ON_CONFLICT = "country,module,source_file,exported_at"
ROW_ON_CONFLICT = "country,view_key,external_key"
MAX_SUPABASE_ATTEMPTS = 3
SUPABASE_RETRY_BACKOFF_SECONDS = (1, 2)

RECON_FILE_MAP: dict[str, list[tuple[str, str]]] = {
    "uae": [
        ("recon_hot_leads.json", "hot_leads"),
        ("recon_price_drops.json", "price_drops"),
        ("recon_owner_direct.json", "owner_direct"),
        ("recon_stale_price_drops.json", "stale_price_drops"),
        ("recon_refresh_inflated.json", "refresh_inflated"),
        ("recon_listing_truth.json", "listing_truth"),
        ("recon_residential_rent.json", "residential_rent"),
        ("recon_residential_buy.json", "residential_buy"),
        ("recon_commercial.json", "commercial"),
        ("recon_short_rental.json", "short_rental"),
    ],
    "ksa": [
        ("recon_hot_leads.json", "hot_leads"),
        ("recon_multi_signal.json", "multi_signal"),
        ("recon_owner_direct.json", "owner_direct"),
        ("recon_price_drops.json", "price_drops"),
        ("recon_refresh_inflation.json", "refresh_inflation"),
        ("recon_contactable.json", "contactable"),
        ("recon_url_only.json", "url_only"),
        ("recon_residential_rent.json", "residential_rent"),
        ("recon_residential_buy.json", "residential_buy"),
        ("recon_commercial.json", "commercial"),
    ],
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Ingest dashboard-safe RASAD Recon frontend exports into Supabase."
    )
    parser.add_argument("--country", required=True, choices=["uae", "ksa", "all"])
    parser.add_argument("--limit", type=_non_negative_int, default=None)
    parser.add_argument("--batch-size", type=_positive_int, default=500)

    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--dry-run", action="store_true")
    mode.add_argument("--write", action="store_true")

    args = parser.parse_args()

    if not args.dry_run and not args.write:
        args.dry_run = True
        print("No --write flag supplied; defaulting to dry-run. Pass --write to ingest.")

    return args


def run_recon_ingestion(
    country_scope: str,
    limit: int | None = None,
    batch_size: int = 500,
    dry_run: bool = True,
) -> dict[str, Any]:
    countries = expand_countries(country_scope)
    country_dirs = _resolve_country_dirs(countries)
    source_folder = ", ".join(f"exports/frontend/{country}" for country in countries)

    print(
        f"Recon ingestion mode={'dry-run' if dry_run else 'write'} "
        f"country={country_scope} target_table={TARGET_TABLE}"
    )

    client = None
    run_id = None
    started_at = utc_now_iso()

    if not dry_run:
        client = get_supabase_client()
        run_id = make_run_id(MODULE_NAME, country_scope)

        _upsert_ingestion_run_start(
            client=client,
            run_id=run_id,
            country=country_scope,
            source_folder=source_folder,
            started_at=started_at,
        )

    files_count = 0
    rows_count = 0
    first_mapped_keys_printed = False

    try:
        for country in countries:
            export_dir = country_dirs[country]
            manifest = _load_manifest(country, export_dir)
            manifest_exported_at = _dict_text(manifest, "exported_at")

            if manifest is not None:
                files_count += 1
                if not dry_run:
                    _upsert_manifest(
                        client=client,
                        country=country,
                        manifest=manifest,
                    )
            else:
                print(f"WARNING: Optional export file missing: {country}/{MANIFEST_FILE}")

            for filename, view_key in RECON_FILE_MAP[country]:
                path = export_dir / filename

                if not path.is_file():
                    print(f"WARNING: Optional export file missing: {country}/{filename}")
                    continue

                payload = read_json(path)
                all_items = _extract_items(payload)
                items = all_items[:limit] if limit is not None else all_items
                exported_at = (
                    _dict_text(payload, "exported_at")
                    or manifest_exported_at
                    or utc_now_iso()
                )

                mapped_rows = [
                    map_recon_item(
                        country=country,
                        view_key=view_key,
                        item=item,
                        exported_at=exported_at,
                        fallback_index=index,
                    )
                    for index, item in enumerate(items, start=1)
                ]

                original_mapped_count = len(mapped_rows)
                mapped_rows, duplicate_count = _dedupe_rows_for_upsert(mapped_rows)

                if duplicate_count > 0:
                    print(
                        f"WARNING: skipped duplicate upsert keys country={country} "
                        f"view_key={view_key} source_file={filename} "
                        f"duplicate_count={duplicate_count}"
                    )

                files_count += 1
                rows_count += len(mapped_rows)

                print(
                    f"country={country} module={MODULE_NAME} target_table={TARGET_TABLE} "
                    f"view_key={view_key} source_file={filename} "
                    f"item_count={len(all_items)} mapped_count={len(mapped_rows)} "
                    f"original_mapped_count={original_mapped_count}"
                )

                if dry_run and mapped_rows and not first_mapped_keys_printed:
                    print(f"First mapped row keys: {sorted(mapped_rows[0].keys())}")
                    first_mapped_keys_printed = True

                if not dry_run and mapped_rows:
                    _upsert_rows(
                        client=client,
                        rows=mapped_rows,
                        batch_size=batch_size,
                    )

        if not dry_run:
            _update_ingestion_run_success(
                client=client,
                run_id=run_id,
                files_count=files_count,
                rows_count=rows_count,
            )

    except Exception as exc:
        if not dry_run and client is not None and run_id is not None:
            try:
                _update_ingestion_run_failed(
                    client=client,
                    run_id=run_id,
                    error_message=str(exc),
                )
            except Exception as status_exc:
                print(
                    "WARNING: Failed to mark ingestion run as failed "
                    f"run_id={run_id} error_type={type(status_exc).__name__}"
                )
        raise

    summary = {
        "country": country_scope,
        "module": MODULE_NAME,
        "target_table": TARGET_TABLE,
        "dry_run": dry_run,
        "files_count": files_count,
        "rows_count": rows_count,
    }

    print(
        f"Recon summary: country={country_scope} dry_run={dry_run} "
        f"files_count={files_count} rows_count={rows_count}"
    )

    return summary


def _resolve_country_dirs(countries: list[str]) -> dict[str, Path]:
    country_dirs: dict[str, Path] = {}

    for country in countries:
        export_dir = get_country_export_dir(country)

        if not export_dir.is_dir():
            raise FileNotFoundError(
                f"Country export directory is missing: exports/frontend/{country}"
            )

        country_dirs[country] = export_dir

    return country_dirs


def _load_manifest(country: str, export_dir: Path) -> dict[str, Any] | None:
    manifest_path = export_dir / MANIFEST_FILE

    if not manifest_path.is_file():
        return None

    payload = read_json(manifest_path)

    if not isinstance(payload, dict):
        raise ValueError(f"{country}/{MANIFEST_FILE} must contain a JSON object.")

    return payload


def _extract_items(payload: Any) -> list[Any]:
    if isinstance(payload, dict):
        items = payload.get("items")
        return items if isinstance(items, list) else []

    if isinstance(payload, list):
        return payload

    return []


def _dict_text(payload: Any, key: str) -> str | None:
    if not isinstance(payload, dict):
        return None

    value = payload.get(key)

    if value is None:
        return None

    text = str(value).strip()
    return text or None


def _dedupe_rows_for_upsert(rows: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], int]:
    deduped_rows: list[dict[str, Any]] = []
    seen_keys: set[tuple[Any, Any, Any]] = set()
    duplicate_count = 0

    for row in rows:
        key = (row["country"], row["view_key"], row["external_key"])

        if key in seen_keys:
            duplicate_count += 1
            continue

        seen_keys.add(key)
        deduped_rows.append(row)

    return deduped_rows, duplicate_count


def _execute_with_retry(operation_label: str, execute_fn: Callable[[], Any]) -> Any:
    last_exc: Exception | None = None

    for attempt in range(1, MAX_SUPABASE_ATTEMPTS + 1):
        try:
            return execute_fn()
        except Exception as exc:
            last_exc = exc

            if attempt >= MAX_SUPABASE_ATTEMPTS:
                raise

            sleep_seconds = SUPABASE_RETRY_BACKOFF_SECONDS[attempt - 1]
            print(
                "WARNING: Supabase operation failed "
                f"operation={operation_label} "
                f"attempt={attempt}/{MAX_SUPABASE_ATTEMPTS} "
                f"error_type={type(exc).__name__}; "
                f"retrying in {sleep_seconds}s"
            )
            time.sleep(sleep_seconds)

    if last_exc is not None:
        raise last_exc

    raise RuntimeError(f"Supabase operation did not execute: {operation_label}")


def _upsert_manifest(client: Any, country: str, manifest: dict[str, Any]) -> None:
    exported_at = _dict_text(manifest, "exported_at") or utc_now_iso()
    export_name = _dict_text(manifest, "export_name") or MODULE_NAME

    row = {
        "country": country,
        "module": MODULE_NAME,
        "export_name": export_name,
        "exported_at": exported_at,
        "source_file": MANIFEST_FILE,
        "payload": manifest,
        "meta": {"ingested_by": SCRIPT_NAME},
    }

    _execute_with_retry(
        f"export_manifests.upsert country={country} module={MODULE_NAME}",
        lambda: client.table("export_manifests").upsert(
            row,
            on_conflict=MANIFEST_ON_CONFLICT,
        ).execute(),
    )


def _upsert_rows(client: Any, rows: list[dict[str, Any]], batch_size: int) -> None:
    for batch_number, batch in enumerate(chunked(rows, batch_size), start=1):
        _execute_with_retry(
            f"{TARGET_TABLE}.upsert batch={batch_number} batch_size={len(batch)}",
            lambda: client.table(TARGET_TABLE).upsert(
                batch,
                on_conflict=ROW_ON_CONFLICT,
            ).execute(),
        )


def _upsert_ingestion_run_start(
    client: Any,
    run_id: str,
    country: str,
    source_folder: str,
    started_at: str,
) -> None:
    row = {
        "run_id": run_id,
        "country": country,
        "module": MODULE_NAME,
        "status": "started",
        "source_folder": source_folder,
        "files_count": 0,
        "rows_count": 0,
        "started_at": started_at,
    }

    _execute_with_retry(
        f"ingestion_runs.start run_id={run_id}",
        lambda: client.table("ingestion_runs").upsert(
            row,
            on_conflict=RUN_ON_CONFLICT,
        ).execute(),
    )


def _update_ingestion_run_success(
    client: Any,
    run_id: str | None,
    files_count: int,
    rows_count: int,
) -> None:
    if run_id is None:
        return

    _execute_with_retry(
        f"ingestion_runs.success run_id={run_id}",
        lambda: client.table("ingestion_runs").update(
            {
                "status": "success",
                "files_count": files_count,
                "rows_count": rows_count,
                "finished_at": utc_now_iso(),
            }
        ).eq("run_id", run_id).execute(),
    )


def _update_ingestion_run_failed(
    client: Any,
    run_id: str | None,
    error_message: str,
) -> None:
    if run_id is None:
        return

    _execute_with_retry(
        f"ingestion_runs.failed run_id={run_id}",
        lambda: client.table("ingestion_runs").update(
            {
                "status": "failed",
                "error_message": error_message,
                "finished_at": utc_now_iso(),
            }
        ).eq("run_id", run_id).execute(),
    )


def _positive_int(value: str) -> int:
    parsed = int(value)

    if parsed < 1:
        raise argparse.ArgumentTypeError("value must be greater than zero")

    return parsed


def _non_negative_int(value: str) -> int:
    parsed = int(value)

    if parsed < 0:
        raise argparse.ArgumentTypeError("value must be zero or greater")

    return parsed


def main() -> None:
    args = parse_args()
    run_recon_ingestion(
        country_scope=args.country,
        limit=args.limit,
        batch_size=args.batch_size,
        dry_run=args.dry_run,
    )


if __name__ == "__main__":
    main()
