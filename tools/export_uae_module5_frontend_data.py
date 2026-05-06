from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]

DB_PATH = Path(r"C:\Users\User\Documents\malesh\intelligence.db")
OUTPUT_DIR = PROJECT_ROOT / "exports" / "frontend" / "uae"

COUNTRY = "uae"
CURRENCY = "AED"
EXPORT_NAME = "uae_module5_frontend_export"
DEFAULT_LIMIT = 500

# Product-safe/dashboard-ready Module 5 tables only.
# Do not add raw evidence tables here.
EXPORTS: dict[str, dict[str, Any]] = {
    "summary": {
        "table": "module5_dashboard_summary",
        "output": "module5_summary.json",
        "sort": None,
        "limit": 1000,
    },
    "market_dominance": {
        "table": "module5_dashboard_market_dominance",
        "output": "module5_market_dominance.json",
        "sort": None,
        "limit": DEFAULT_LIMIT,
    },
    "inventory_pressure": {
        "table": "module5_dashboard_inventory_pressure",
        "output": "module5_inventory_pressure.json",
        "sort": None,
        "limit": DEFAULT_LIMIT,
    },
    "agency_profiles": {
        "table": "module5_dashboard_agency_profiles",
        "output": "module5_agency_profiles.json",
        "sort": None,
        "limit": DEFAULT_LIMIT,
    },
    "activity_feed": {
        "table": "module5_dashboard_activity_feed",
        "output": "module5_activity_feed.json",
        "sort": None,
        "limit": DEFAULT_LIMIT,
    },
    "very_active_markets": {
        "table": "module5_dashboard_very_active_markets",
        "output": "module5_very_active_markets.json",
        "sort": None,
        "limit": DEFAULT_LIMIT,
    },
    "building_intelligence": {
        "table": "module5_dashboard_building_intelligence",
        "output": "module5_building_intelligence.json",
        "sort": None,
        "limit": DEFAULT_LIMIT,
    },
    "community_intelligence": {
        "table": "module5_dashboard_community_intelligence",
        "output": "module5_community_intelligence.json",
        "sort": None,
        "limit": DEFAULT_LIMIT,
    },
}

DO_NOT_EXPOSE_DIRECTLY = [
    "listing_price_events",
    "listing_price_state",
    "price_history_runs",
    "suspicious_price_drop_events",
    "market_dominance_building",
    "market_dominance_community",
    "inventory_pressure_community",
    "inventory_pressure_building",
    "agency_inventory_profiles",
    "agency_inventory_by_community",
    "agency_inventory_by_building",
    "market_activity_feed",
    "market_activity_summary",
]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def connect() -> sqlite3.Connection:
    if not DB_PATH.exists():
        raise FileNotFoundError(f"UAE intelligence database not found: {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def table_exists(conn: sqlite3.Connection, table_name: str) -> bool:
    row = conn.execute(
        """
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = ?
        LIMIT 1
        """,
        (table_name,),
    ).fetchone()
    return row is not None


def get_columns(conn: sqlite3.Connection, table_name: str) -> list[str]:
    rows = conn.execute(f'PRAGMA table_info("{table_name}")').fetchall()
    return [str(row["name"]) for row in rows]


def count_rows(conn: sqlite3.Connection, table_name: str) -> int:
    row = conn.execute(f'SELECT COUNT(*) AS row_count FROM "{table_name}"').fetchone()
    return int(row["row_count"] if row else 0)


def choose_sort(columns: list[str], preferred_sort: str | None) -> str | None:
    if preferred_sort:
        return preferred_sort

    candidates = [
        "dashboard_rank",
        "priority_rank",
        "activity_rank",
        "market_rank",
        "rank",
        "score",
        "activity_score",
        "pressure_score",
        "dominance_score",
        "total_listings",
        "listing_count",
        "updated_at",
        "built_at",
    ]

    lower_to_actual = {column.lower(): column for column in columns}

    for candidate in candidates:
        if candidate in lower_to_actual:
            actual = lower_to_actual[candidate]
            if candidate in {"updated_at", "built_at"}:
                return f'"{actual}" DESC'
            return f'"{actual}" DESC'

    return None


def fetch_rows(
    conn: sqlite3.Connection,
    table_name: str,
    columns: list[str],
    limit: int,
    preferred_sort: str | None,
) -> tuple[list[dict[str, Any]], str | None]:
    sort_clause = choose_sort(columns, preferred_sort)

    sql = f'SELECT * FROM "{table_name}"'
    if sort_clause:
        sql += f" ORDER BY {sort_clause}"
    sql += " LIMIT ?"

    rows = conn.execute(sql, (limit,)).fetchall()
    return [dict(row) for row in rows], sort_clause


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2, default=str),
        encoding="utf-8",
    )


def export_table(
    conn: sqlite3.Connection,
    export_key: str,
    config: dict[str, Any],
    exported_at: str,
) -> dict[str, Any]:
    table_name = str(config["table"])
    output_name = str(config["output"])
    output_path = OUTPUT_DIR / output_name
    limit = int(config.get("limit") or DEFAULT_LIMIT)
    preferred_sort = config.get("sort")

    exists = table_exists(conn, table_name)

    if not exists:
        payload = {
            "country": COUNTRY,
            "currency": CURRENCY,
            "export_key": export_key,
            "source_table": table_name,
            "exported_at": exported_at,
            "status": "missing_table",
            "total_rows_available": 0,
            "exported_rows": 0,
            "default_sort": None,
            "columns": [],
            "items": [],
        }
        write_json(output_path, payload)

        return {
            "table": table_name,
            "exists": False,
            "total_rows_available": 0,
            "exported_rows": 0,
            "output": str(output_path.relative_to(PROJECT_ROOT)),
            "columns": [],
            "sort": None,
        }

    columns = get_columns(conn, table_name)
    total_rows = count_rows(conn, table_name)
    items, actual_sort = fetch_rows(
        conn=conn,
        table_name=table_name,
        columns=columns,
        limit=limit,
        preferred_sort=preferred_sort,
    )

    payload = {
        "country": COUNTRY,
        "currency": CURRENCY,
        "export_key": export_key,
        "source_table": table_name,
        "exported_at": exported_at,
        "status": "ready",
        "total_rows_available": total_rows,
        "exported_rows": len(items),
        "default_sort": actual_sort,
        "columns": columns,
        "items": items,
    }

    write_json(output_path, payload)

    return {
        "table": table_name,
        "exists": True,
        "total_rows_available": total_rows,
        "exported_rows": len(items),
        "output": str(output_path.relative_to(PROJECT_ROOT)),
        "columns": columns,
        "sort": actual_sort,
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    exported_at = utc_now_iso()

    with connect() as conn:
        export_results: dict[str, Any] = {}

        for export_key, config in EXPORTS.items():
            export_results[export_key] = export_table(
                conn=conn,
                export_key=export_key,
                config=config,
                exported_at=exported_at,
            )

    manifest = {
        "export_name": EXPORT_NAME,
        "country": COUNTRY,
        "currency": CURRENCY,
        "database_path": str(DB_PATH),
        "exported_at": exported_at,
        "default_limit": DEFAULT_LIMIT,
        "exports": export_results,
        "outputs": {
            key: result["output"] for key, result in export_results.items()
        },
        "frontend_rules": {
            "use_dashboard_ready_tables_only": True,
            "safe_for_user_facing_pages": True,
            "do_not_expose_raw_price_history": True,
            "do_not_expose_raw_module5_engine_tables": True,
            "intended_routes": [
                "/dashboard/uae/activity-feed",
                "/dashboard/uae/market-intelligence",
                "/dashboard/uae/inventory-pressure",
                "/dashboard/uae/market-dominance",
                "/dashboard/uae/agency-profiles",
                "/dashboard/uae/buildings",
                "/dashboard/uae/communities",
            ],
        },
        "do_not_expose_directly": DO_NOT_EXPOSE_DIRECTLY,
    }

    manifest_path = OUTPUT_DIR / "module5_manifest.json"
    write_json(manifest_path, manifest)

    print("UAE Module 5 frontend export complete.")
    print("")

    for export_key, result in export_results.items():
        status = "OK" if result["exists"] else "MISSING"
        print(
            f"{export_key}: {status} | "
            f"table={result['table']} | "
            f"total={result['total_rows_available']:,} | "
            f"exported={result['exported_rows']:,}"
        )

    print("")
    print(f"Manifest: {manifest_path.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()