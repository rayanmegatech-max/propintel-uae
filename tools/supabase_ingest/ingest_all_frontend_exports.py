from __future__ import annotations

from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import argparse
from typing import Any

from tools.supabase_ingest.ingest_module5_exports import run_module5_ingestion
from tools.supabase_ingest.ingest_recon_exports import run_recon_ingestion


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Ingest dashboard-safe RASAD frontend exports into Supabase. "
            "Runs Recon first, then Module 5. Module 6 / AI vector exports are skipped."
        )
    )
    parser.add_argument("--country", choices=["uae", "ksa", "all"], default="all")
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


def run_all_frontend_ingestion(
    country_scope: str = "all",
    limit: int | None = None,
    batch_size: int = 500,
    dry_run: bool = True,
) -> dict[str, Any]:
    print("=== RASAD frontend export ingestion start ===")
    print(f"country={country_scope} mode={'dry-run' if dry_run else 'write'}")
    print("Recon and Module 5 exports only. Module 6 / AI vector files are skipped.")

    print("=== Recon ingestion start ===")
    recon_summary = run_recon_ingestion(
        country_scope=country_scope,
        limit=limit,
        batch_size=batch_size,
        dry_run=dry_run,
    )
    print("=== Recon ingestion end ===")

    print("=== Module 5 ingestion start ===")
    module5_summary = run_module5_ingestion(
        country_scope=country_scope,
        limit=limit,
        batch_size=batch_size,
        dry_run=dry_run,
    )
    print("=== Module 5 ingestion end ===")

    summary = {
        "country": country_scope,
        "dry_run": dry_run,
        "modules": {
            "recon": recon_summary,
            "module5": module5_summary,
        },
        "total_files_count": recon_summary["files_count"] + module5_summary["files_count"],
        "total_rows_count": recon_summary["rows_count"] + module5_summary["rows_count"],
    }

    print(
        "=== RASAD frontend export ingestion complete === "
        f"country={country_scope} dry_run={dry_run} "
        f"total_files_count={summary['total_files_count']} "
        f"total_rows_count={summary['total_rows_count']}"
    )

    return summary


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
    run_all_frontend_ingestion(
        country_scope=args.country,
        limit=args.limit,
        batch_size=args.batch_size,
        dry_run=args.dry_run,
    )


if __name__ == "__main__":
    main()
