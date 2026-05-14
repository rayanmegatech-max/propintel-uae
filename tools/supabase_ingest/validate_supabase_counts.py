from __future__ import annotations

from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import argparse
from collections import Counter
from typing import Any

from tools.supabase_ingest.config import expand_countries, get_supabase_client


PAGE_SIZE = 1000
MAX_ROWS_PER_TABLE = 100000

COUNT_TABLES = [
    "recon_opportunities",
    "module5_market_intelligence",
]

RUN_COLUMNS = (
    "run_id,country,module,status,files_count,rows_count,"
    "created_at,started_at,finished_at,error_message"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate Supabase dashboard-safe ingestion counts."
    )
    parser.add_argument("--country", choices=["uae", "ksa", "all"], default="all")
    return parser.parse_args()


def validate_counts(country_scope: str = "all") -> None:
    countries = expand_countries(country_scope)
    country_filter = None if country_scope == "all" else countries[0]

    client = get_supabase_client()

    print("=== Supabase dashboard-safe count validation ===")
    print(f"country={country_scope}")
    print("Read-only validation. No writes are performed.")

    for table_name in COUNT_TABLES:
        print(f"=== Counts for {table_name} ===")
        rows = _fetch_country_view_rows(
            client=client,
            table_name=table_name,
            country_filter=country_filter,
        )
        counts = _count_by_country_and_view(rows)

        if not counts:
            print("No rows found.")
            continue

        for (country, view_key), count in sorted(counts.items()):
            print(f"country={country} view_key={view_key} count={count}")

    print("=== Latest 10 ingestion_runs ===")
    runs = _fetch_latest_runs(client=client, country_filter=country_filter)

    if not runs:
        print("No ingestion_runs found.")
        return

    for run in runs:
        print(
            "run_id={run_id} country={country} module={module} status={status} "
            "files_count={files_count} rows_count={rows_count} created_at={created_at} "
            "started_at={started_at} finished_at={finished_at} error_message={error_message}".format(
                run_id=_safe_value(run.get("run_id")),
                country=_safe_value(run.get("country")),
                module=_safe_value(run.get("module")),
                status=_safe_value(run.get("status")),
                files_count=_safe_value(run.get("files_count")),
                rows_count=_safe_value(run.get("rows_count")),
                created_at=_safe_value(run.get("created_at")),
                started_at=_safe_value(run.get("started_at")),
                finished_at=_safe_value(run.get("finished_at")),
                error_message=_safe_value(run.get("error_message")),
            )
        )


def _fetch_country_view_rows(
    client: Any,
    table_name: str,
    country_filter: str | None,
) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    offset = 0

    while offset < MAX_ROWS_PER_TABLE:
        end = min(offset + PAGE_SIZE - 1, MAX_ROWS_PER_TABLE - 1)

        query = (
            client.table(table_name)
            .select("country,view_key")
            .order("country")
            .order("view_key")
            .range(offset, end)
        )

        if country_filter is not None:
            query = query.eq("country", country_filter)

        response = query.execute()
        page = response.data or []

        rows.extend(page)

        if len(page) < PAGE_SIZE:
            break

        offset += PAGE_SIZE

    if len(rows) >= MAX_ROWS_PER_TABLE:
        print(
            f"WARNING: Reached safe fetch cap of {MAX_ROWS_PER_TABLE} rows for {table_name}. "
            "Counts may be partial."
        )

    return rows


def _count_by_country_and_view(
    rows: list[dict[str, Any]],
) -> Counter[tuple[str, str]]:
    counts: Counter[tuple[str, str]] = Counter()

    for row in rows:
        country = _safe_value(row.get("country"))
        view_key = _safe_value(row.get("view_key"))
        counts[(country, view_key)] += 1

    return counts


def _fetch_latest_runs(
    client: Any,
    country_filter: str | None,
) -> list[dict[str, Any]]:
    query = (
        client.table("ingestion_runs")
        .select(RUN_COLUMNS)
        .order("created_at", desc=True)
        .limit(10)
    )

    if country_filter is not None:
        query = query.eq("country", country_filter)

    response = query.execute()
    return response.data or []


def _safe_value(value: Any) -> str:
    if value is None:
        return "(null)"

    text = str(value).strip()
    return text or "(empty)"


def main() -> None:
    args = parse_args()
    validate_counts(country_scope=args.country)


if __name__ == "__main__":
    main()
