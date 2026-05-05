from __future__ import annotations

import csv
import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]

OUTPUT_DIR = PROJECT_ROOT / "reports" / "phase5d_schema_inspection"

DATABASES = {
    "uae": {
        "label": "UAE",
        "currency": "AED",
        "path": Path(r"C:\Users\User\Documents\malesh\intelligence.db"),
        "tables": [
            # Module 0
            "active_listings_unified",

            # Module 1
            "owner_direct_opportunities",

            # Module 2 frontend-safe
            "price_drop_opportunities",

            # Module 3
            "true_listing_age_signals",
            "recon_dashboard_refresh_inflated",
            "recon_dashboard_listing_truth",

            # Module 4 Recon Hub
            "recon_hub_opportunities",
            "recon_dashboard_hot_leads",
            "recon_dashboard_price_drops",
            "recon_dashboard_owner_direct",
            "recon_dashboard_stale_price_drops",
            "recon_dashboard_refresh_inflated",
            "recon_dashboard_listing_truth",
            "recon_dashboard_residential_rent",
            "recon_dashboard_residential_buy",
            "recon_dashboard_commercial",
            "recon_dashboard_short_rental",
            "recon_dashboard_summary",

            # Module 5 dashboard-ready
            "module5_dashboard_summary",
            "module5_dashboard_market_dominance",
            "module5_dashboard_inventory_pressure",
            "module5_dashboard_agency_profiles",
            "module5_dashboard_activity_feed",
            "module5_dashboard_very_active_markets",
            "module5_dashboard_building_intelligence",
            "module5_dashboard_community_intelligence",
        ],
        "do_not_expose": [
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
        ],
    },
    "ksa": {
        "label": "KSA",
        "currency": "SAR",
        "path": Path(r"C:\Users\User\Documents\malesh\KSA\intelligence\ksa_intelligence.db"),
        "tables": [
            # Module 0
            "ksa_active_listings_unified",

            # Module 1
            "ksa_owner_direct_candidates",

            # Module 2 frontend-safe
            "ksa_price_drop_candidates",
            "ksa_module5_dashboard_activity_price_movements",

            # Module 3
            "ksa_listing_age_state",
            "ksa_refresh_inflation_candidates",
            "ksa_listing_age_summary",
            "ksa_refresh_inflation_summary",
            "ksa_recon_dashboard_refresh_inflation",

            # Module 4 Recon Hub
            "ksa_recon_hub_opportunities",
            "ksa_recon_dashboard_hot_leads",
            "ksa_recon_dashboard_multi_signal",
            "ksa_recon_dashboard_owner_direct",
            "ksa_recon_dashboard_price_drops",
            "ksa_recon_dashboard_refresh_inflation",
            "ksa_recon_dashboard_contactable",
            "ksa_recon_dashboard_url_only",
            "ksa_recon_dashboard_residential_rent",
            "ksa_recon_dashboard_residential_buy",
            "ksa_recon_dashboard_commercial",
            "ksa_recon_dashboard_summary",

            # Module 5 dashboard-ready
            "ksa_module5_dashboard_city_intelligence",
            "ksa_module5_dashboard_city_intelligence_major",
            "ksa_module5_dashboard_city_intelligence_small",
            "ksa_module5_dashboard_city_pressure_signals",
            "ksa_module5_dashboard_district_intelligence",
            "ksa_module5_dashboard_market_dominance_large_markets",
            "ksa_module5_dashboard_market_dominance_small_markets",
            "ksa_module5_dashboard_inventory_pressure_large_markets",
            "ksa_module5_dashboard_inventory_pressure_small_markets",
            "ksa_module5_dashboard_agency_profiles_major",
            "ksa_module5_dashboard_agency_profiles_micro",
            "ksa_module5_dashboard_agency_city_profiles",
            "ksa_module5_dashboard_agency_district_profiles",
            "ksa_module5_dashboard_activity_priority",
            "ksa_module5_dashboard_activity_recon",
            "ksa_module5_dashboard_activity_recently_detected",
            "ksa_module5_dashboard_activity_pressure",
            "ksa_module5_dashboard_activity_dominance",
            "ksa_module5_dashboard_activity_agency",
            "ksa_module5_dashboard_city_alias_audit",
            "ksa_module5_dashboard_district_alias_audit",
            "ksa_module5_dashboard_summary",
        ],
        "do_not_expose": [
            "ksa_listing_price_events",
            "ksa_listing_price_state",
            "ksa_price_history_runs",
            "ksa_suspicious_price_drop_events",
            "ksa_market_dominance_city",
            "ksa_market_dominance_district",
            "ksa_inventory_pressure_city",
            "ksa_inventory_pressure_district",
            "ksa_agency_inventory_profile",
            "ksa_market_activity_feed",
        ],
    },
}


def quote_identifier(identifier: str) -> str:
    safe = identifier.replace('"', '""')
    return f'"{safe}"'


def connect_db(db_path: Path) -> sqlite3.Connection:
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found: {db_path}")

    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def table_exists(conn: sqlite3.Connection, table_name: str) -> bool:
    row = conn.execute(
        """
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = ?
        """,
        (table_name,),
    ).fetchone()

    return row is not None


def get_row_count(conn: sqlite3.Connection, table_name: str) -> int:
    row = conn.execute(
        f"SELECT COUNT(*) AS row_count FROM {quote_identifier(table_name)}"
    ).fetchone()

    return int(row["row_count"])


def get_columns(conn: sqlite3.Connection, table_name: str) -> list[dict[str, Any]]:
    rows = conn.execute(f"PRAGMA table_info({quote_identifier(table_name)})").fetchall()

    return [
        {
            "cid": row["cid"],
            "name": row["name"],
            "type": row["type"],
            "notnull": row["notnull"],
            "default_value": row["dflt_value"],
            "primary_key": row["pk"],
        }
        for row in rows
    ]


def get_sample_rows(
    conn: sqlite3.Connection,
    table_name: str,
    limit: int = 3,
) -> list[dict[str, Any]]:
    rows = conn.execute(
        f"SELECT * FROM {quote_identifier(table_name)} LIMIT ?",
        (limit,),
    ).fetchall()

    samples: list[dict[str, Any]] = []
    for row in rows:
        samples.append({key: row[key] for key in row.keys()})

    return samples


def inspect_country(country_key: str, config: dict[str, Any]) -> dict[str, Any]:
    db_path: Path = config["path"]

    result: dict[str, Any] = {
        "country_key": country_key,
        "label": config["label"],
        "currency": config["currency"],
        "database_path": str(db_path),
        "database_exists": db_path.exists(),
        "inspected_at": datetime.now().isoformat(timespec="seconds"),
        "tables": [],
        "do_not_expose_tables": [],
    }

    if not db_path.exists():
        result["error"] = f"Database not found: {db_path}"
        return result

    with connect_db(db_path) as conn:
        for table_name in config["tables"]:
            table_result: dict[str, Any] = {
                "table_name": table_name,
                "exists": table_exists(conn, table_name),
                "frontend_safe_candidate": True,
            }

            if table_result["exists"]:
                table_result["row_count"] = get_row_count(conn, table_name)
                table_result["columns"] = get_columns(conn, table_name)
                table_result["sample_rows"] = get_sample_rows(conn, table_name)
            else:
                table_result["row_count"] = None
                table_result["columns"] = []
                table_result["sample_rows"] = []

            result["tables"].append(table_result)

        for table_name in config["do_not_expose"]:
            internal_result: dict[str, Any] = {
                "table_name": table_name,
                "exists": table_exists(conn, table_name),
                "frontend_safe_candidate": False,
                "reason": "Raw/internal/evidence table. Do not expose directly to paid users.",
            }

            if internal_result["exists"]:
                internal_result["row_count"] = get_row_count(conn, table_name)
            else:
                internal_result["row_count"] = None

            result["do_not_expose_tables"].append(internal_result)

    return result


def write_json(results: dict[str, Any]) -> Path:
    path = OUTPUT_DIR / "frontend_safe_table_schema_inspection.json"
    path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def write_table_summary_csv(results: dict[str, Any]) -> Path:
    path = OUTPUT_DIR / "frontend_safe_table_summary.csv"

    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "country",
                "currency",
                "table_name",
                "exists",
                "row_count",
                "column_count",
                "frontend_safe_candidate",
                "note",
            ],
        )
        writer.writeheader()

        for country_result in results["countries"]:
            for table in country_result["tables"]:
                writer.writerow(
                    {
                        "country": country_result["label"],
                        "currency": country_result["currency"],
                        "table_name": table["table_name"],
                        "exists": table["exists"],
                        "row_count": table["row_count"],
                        "column_count": len(table["columns"]),
                        "frontend_safe_candidate": True,
                        "note": "Product/dashboard candidate table",
                    }
                )

            for table in country_result["do_not_expose_tables"]:
                writer.writerow(
                    {
                        "country": country_result["label"],
                        "currency": country_result["currency"],
                        "table_name": table["table_name"],
                        "exists": table["exists"],
                        "row_count": table["row_count"],
                        "column_count": "",
                        "frontend_safe_candidate": False,
                        "note": table["reason"],
                    }
                )

    return path


def write_markdown_report(results: dict[str, Any]) -> Path:
    path = OUTPUT_DIR / "PHASE5D_SCHEMA_INSPECTION_REPORT.md"

    lines: list[str] = []
    lines.append("# Phase 5D Schema Inspection Report")
    lines.append("")
    lines.append(f"Generated at: `{results['generated_at']}`")
    lines.append("")
    lines.append("## Purpose")
    lines.append("")
    lines.append(
        "Inspect UAE and KSA frontend-safe dashboard/product tables before wiring real frontend data."
    )
    lines.append("")
    lines.append(
        "This report does not connect Supabase, auth, Stripe, billing, or live frontend data."
    )
    lines.append("")
    lines.append("---")
    lines.append("")

    for country in results["countries"]:
        lines.append(f"## {country['label']}")
        lines.append("")
        lines.append(f"Currency: `{country['currency']}`")
        lines.append("")
        lines.append(f"Database path: `{country['database_path']}`")
        lines.append("")
        lines.append(f"Database exists: `{country['database_exists']}`")
        lines.append("")

        if "error" in country:
            lines.append(f"Error: `{country['error']}`")
            lines.append("")
            continue

        lines.append("### Product/dashboard candidate tables")
        lines.append("")
        lines.append("| Table | Exists | Rows | Columns |")
        lines.append("|---|---:|---:|---:|")

        for table in country["tables"]:
            lines.append(
                f"| `{table['table_name']}` | {table['exists']} | "
                f"{table['row_count'] if table['row_count'] is not None else ''} | "
                f"{len(table['columns'])} |"
            )

        lines.append("")
        lines.append("### Raw/internal tables that must not be exposed directly")
        lines.append("")
        lines.append("| Table | Exists | Rows | Reason |")
        lines.append("|---|---:|---:|---|")

        for table in country["do_not_expose_tables"]:
            lines.append(
                f"| `{table['table_name']}` | {table['exists']} | "
                f"{table['row_count'] if table['row_count'] is not None else ''} | "
                f"{table['reason']} |"
            )

        lines.append("")
        lines.append("### Existing table schemas")
        lines.append("")

        for table in country["tables"]:
            if not table["exists"]:
                continue

            lines.append(f"#### `{table['table_name']}`")
            lines.append("")
            lines.append(f"Rows: `{table['row_count']}`")
            lines.append("")
            lines.append("| Column | Type | Not Null | Primary Key |")
            lines.append("|---|---|---:|---:|")

            for column in table["columns"]:
                lines.append(
                    f"| `{column['name']}` | `{column['type']}` | "
                    f"{column['notnull']} | {column['primary_key']} |"
                )

            lines.append("")

        lines.append("---")
        lines.append("")

    lines.append("## Next step")
    lines.append("")
    lines.append(
        "Use this report to create the first frontend data contract for `/dashboard/uae/recon`, then adapt the pattern to `/dashboard/ksa/recon`."
    )
    lines.append("")

    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    results: dict[str, Any] = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "countries": [],
    }

    for country_key, config in DATABASES.items():
        print(f"Inspecting {config['label']} database...")
        results["countries"].append(inspect_country(country_key, config))

    json_path = write_json(results)
    csv_path = write_table_summary_csv(results)
    md_path = write_markdown_report(results)

    print("")
    print("Schema inspection complete.")
    print(f"JSON: {json_path}")
    print(f"CSV:  {csv_path}")
    print(f"MD:   {md_path}")


if __name__ == "__main__":
    main()