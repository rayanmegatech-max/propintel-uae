from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]

UAE_DB_PATH = Path(r"C:\Users\User\Documents\malesh\intelligence.db")

EXPORT_DIR = PROJECT_ROOT / "exports" / "frontend" / "uae"

HOT_LEADS_TABLE = "recon_dashboard_hot_leads"
SUMMARY_TABLE = "recon_dashboard_summary"

HOT_LEADS_OUTPUT = EXPORT_DIR / "recon_hot_leads.json"
SUMMARY_OUTPUT = EXPORT_DIR / "recon_summary.json"
MANIFEST_OUTPUT = EXPORT_DIR / "recon_manifest.json"

DEFAULT_LIMIT = 500


HOT_LEAD_COLUMNS = [
    "dashboard_rank",
    "recon_id",
    "listing_key",
    "canonical_id",
    "portal",
    "schema_name",
    "portal_id",
    "primary_opportunity_type",
    "opportunity_group",
    "opportunity_title",
    "recon_score",
    "recon_rank",
    "confidence_tier",
    "confidence_reason",
    "priority_label",
    "badges_json",
    "recommended_action",
    "portal_action_label",
    "action_priority",
    "cta_text",
    "source_category",
    "purpose",
    "price_frequency",
    "title",
    "property_type",
    "bedrooms",
    "bathrooms",
    "size_sqft",
    "city",
    "community",
    "building_name",
    "property_url",
    "price",
    "price_per_sqft",
    "old_price",
    "new_price",
    "drop_amount",
    "drop_pct",
    "age_label",
    "refresh_inflation_label",
    "effective_true_age_days",
    "owner_direct_bucket",
    "owner_direct_label",
    "owner_direct_confidence_tier",
    "agent_name",
    "agency_name",
    "contact_phone",
    "contact_whatsapp",
    "contact_email",
    "has_phone_available",
    "has_whatsapp_available",
    "has_email_available",
    "listing_created_at",
    "listing_updated_at",
    "listing_scraped_at",
    "built_at",
]


def connect_db(db_path: Path) -> sqlite3.Connection:
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found: {db_path}")

    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def quote_identifier(identifier: str) -> str:
    safe = identifier.replace('"', '""')
    return f'"{safe}"'


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


def get_table_columns(conn: sqlite3.Connection, table_name: str) -> set[str]:
    rows = conn.execute(f"PRAGMA table_info({quote_identifier(table_name)})").fetchall()
    return {row["name"] for row in rows}


def get_row_count(conn: sqlite3.Connection, table_name: str) -> int:
    row = conn.execute(
        f"SELECT COUNT(*) AS row_count FROM {quote_identifier(table_name)}"
    ).fetchone()

    return int(row["row_count"])


def safe_json_loads(value: Any) -> Any:
    if value is None:
        return []

    if not isinstance(value, str):
        return value

    stripped = value.strip()
    if not stripped:
        return []

    try:
        parsed = json.loads(stripped)
    except json.JSONDecodeError:
        return []

    return parsed


def normalize_row(row: sqlite3.Row) -> dict[str, Any]:
    data = {key: row[key] for key in row.keys()}

    # Parse badges_json into a frontend-safe list/object while preserving the raw source.
    raw_badges = data.get("badges_json")
    data["badges"] = safe_json_loads(raw_badges)

    # Keep raw badges_json for debugging/export transparency.
    data["badges_json"] = raw_badges

    return data


def fetch_hot_leads(conn: sqlite3.Connection, limit: int) -> list[dict[str, Any]]:
    existing_columns = get_table_columns(conn, HOT_LEADS_TABLE)
    missing_columns = [column for column in HOT_LEAD_COLUMNS if column not in existing_columns]

    if missing_columns:
        raise RuntimeError(
            f"{HOT_LEADS_TABLE} is missing required export columns: {missing_columns}"
        )

    selected_columns = ", ".join(quote_identifier(column) for column in HOT_LEAD_COLUMNS)

    sql = f"""
        SELECT {selected_columns}
        FROM {quote_identifier(HOT_LEADS_TABLE)}
        ORDER BY
            CASE WHEN dashboard_rank IS NULL THEN 1 ELSE 0 END ASC,
            dashboard_rank ASC,
            recon_score DESC
        LIMIT ?
    """

    rows = conn.execute(sql, (limit,)).fetchall()
    return [normalize_row(row) for row in rows]


def fetch_summary(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = conn.execute(
        f"""
        SELECT *
        FROM {quote_identifier(SUMMARY_TABLE)}
        """
    ).fetchall()

    return [{key: row[key] for key in row.keys()} for row in rows]


def write_json(path: Path, payload: Any) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def build_manifest(
    *,
    exported_at: str,
    hot_leads_total_rows: int,
    hot_leads_exported_rows: int,
    summary_total_rows: int,
    limit: int,
) -> dict[str, Any]:
    return {
        "export_name": "uae_recon_frontend_data",
        "country": "uae",
        "currency": "AED",
        "database_path": str(UAE_DB_PATH),
        "exported_at": exported_at,
        "source_tables": {
            "hot_leads": HOT_LEADS_TABLE,
            "summary": SUMMARY_TABLE,
        },
        "outputs": {
            "hot_leads": str(HOT_LEADS_OUTPUT),
            "summary": str(SUMMARY_OUTPUT),
            "manifest": str(MANIFEST_OUTPUT),
        },
        "row_counts": {
            "hot_leads_total_rows": hot_leads_total_rows,
            "hot_leads_exported_rows": hot_leads_exported_rows,
            "summary_total_rows": summary_total_rows,
        },
        "limit": limit,
        "frontend_rules": {
            "default_sort": "dashboard_rank ASC, recon_score DESC",
            "currency": "AED",
            "raw_internal_tables_exposed": False,
            "badges_json_parsed_to_badges": True,
        },
        "do_not_expose_directly": [
            "listing_price_events",
            "listing_price_state",
            "price_history_runs",
            "suspicious_price_drop_events",
        ],
    }


def export_uae_recon(limit: int = DEFAULT_LIMIT) -> None:
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)

    exported_at = datetime.now().isoformat(timespec="seconds")

    with connect_db(UAE_DB_PATH) as conn:
        for table_name in [HOT_LEADS_TABLE, SUMMARY_TABLE]:
            if not table_exists(conn, table_name):
                raise RuntimeError(f"Required table missing: {table_name}")

        hot_leads_total_rows = get_row_count(conn, HOT_LEADS_TABLE)
        summary_total_rows = get_row_count(conn, SUMMARY_TABLE)

        hot_leads = fetch_hot_leads(conn, limit=limit)
        summary = fetch_summary(conn)

    hot_leads_payload = {
        "country": "uae",
        "currency": "AED",
        "source_table": HOT_LEADS_TABLE,
        "exported_at": exported_at,
        "total_rows_available": hot_leads_total_rows,
        "exported_rows": len(hot_leads),
        "default_sort": "dashboard_rank ASC, recon_score DESC",
        "items": hot_leads,
    }

    summary_payload = {
        "country": "uae",
        "currency": "AED",
        "source_table": SUMMARY_TABLE,
        "exported_at": exported_at,
        "total_rows_available": summary_total_rows,
        "items": summary,
    }

    manifest_payload = build_manifest(
        exported_at=exported_at,
        hot_leads_total_rows=hot_leads_total_rows,
        hot_leads_exported_rows=len(hot_leads),
        summary_total_rows=summary_total_rows,
        limit=limit,
    )

    write_json(HOT_LEADS_OUTPUT, hot_leads_payload)
    write_json(SUMMARY_OUTPUT, summary_payload)
    write_json(MANIFEST_OUTPUT, manifest_payload)

    print("UAE Recon frontend export complete.")
    print(f"Database: {UAE_DB_PATH}")
    print(f"Hot leads table: {HOT_LEADS_TABLE}")
    print(f"Summary table: {SUMMARY_TABLE}")
    print("")
    print(f"Hot leads total rows: {hot_leads_total_rows:,}")
    print(f"Hot leads exported rows: {len(hot_leads):,}")
    print(f"Summary rows: {summary_total_rows:,}")
    print("")
    print(f"Hot leads JSON: {HOT_LEADS_OUTPUT}")
    print(f"Summary JSON:   {SUMMARY_OUTPUT}")
    print(f"Manifest JSON:  {MANIFEST_OUTPUT}")


if __name__ == "__main__":
    export_uae_recon()