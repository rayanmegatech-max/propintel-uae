from __future__ import annotations

import json
import re
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]

KSA_DB_PATH = Path(
    r"C:\Users\User\Documents\malesh\KSA\intelligence\ksa_intelligence.db"
)

EXPORT_DIR = PROJECT_ROOT / "exports" / "frontend" / "ksa"

DEFAULT_LIMIT = 500

RECON_EXPORTS = {
    "hot_leads": {
        "table": "ksa_recon_dashboard_hot_leads",
        "output": "recon_hot_leads.json",
    },
    "multi_signal": {
        "table": "ksa_recon_dashboard_multi_signal",
        "output": "recon_multi_signal.json",
    },
    "owner_direct": {
        "table": "ksa_recon_dashboard_owner_direct",
        "output": "recon_owner_direct.json",
    },
    "price_drops": {
        "table": "ksa_recon_dashboard_price_drops",
        "output": "recon_price_drops.json",
    },
    "refresh_inflation": {
        "table": "ksa_recon_dashboard_refresh_inflation",
        "output": "recon_refresh_inflation.json",
    },
    "contactable": {
        "table": "ksa_recon_dashboard_contactable",
        "output": "recon_contactable.json",
    },
    "url_only": {
        "table": "ksa_recon_dashboard_url_only",
        "output": "recon_url_only.json",
    },
    "residential_rent": {
        "table": "ksa_recon_dashboard_residential_rent",
        "output": "recon_residential_rent.json",
    },
    "residential_buy": {
        "table": "ksa_recon_dashboard_residential_buy",
        "output": "recon_residential_buy.json",
    },
    "commercial": {
        "table": "ksa_recon_dashboard_commercial",
        "output": "recon_commercial.json",
    },
}

SUMMARY_TABLE = "ksa_recon_dashboard_summary"
SUMMARY_OUTPUT = EXPORT_DIR / "recon_summary.json"
MANIFEST_OUTPUT = EXPORT_DIR / "recon_manifest.json"

# ─── Bayut URL canonicalization ───────────────────────────────────────────────
# Bayut slug URLs  (…/some-title-8500411.html) resolve to 404.
# Canonical form:  https://www.bayut.com/property/details-{id}.html
# This fix is applied at export time so the JSON on disk is already correct.

_BAYUT_ID_RE = re.compile(r"(\d+)\.html(?:[?#].*)?$", re.IGNORECASE)

_BAYUT_ID_FIELDS = (
    "external_id",
    "listing_id",
    "property_id",
    "source_listing_id",
    "portal_id",
)

_BAYUT_URL_FIELDS = (
    "property_url",
    "source_url",
    "listing_url",
    "url",
    "detail_url",
)


def _is_bayut_row(data: dict[str, Any]) -> bool:
    portal = str(data.get("portal") or data.get("source_portal") or "").lower()
    return "bayut" in portal


def _extract_bayut_id_from_url(url: str) -> str | None:
    """Return the numeric ID embedded in a Bayut URL, or None."""
    match = _BAYUT_ID_RE.search(url)
    return match.group(1) if match else None


def _canonicalize_bayut_url(data: dict[str, Any]) -> str | None:
    """
    Return a canonical Bayut URL for this row, or None if no ID can be found.
    Non-Bayut rows must never call this function.
    """
    # 1. Try all URL-bearing fields.
    for field in _BAYUT_URL_FIELDS:
        url = data.get(field)
        if isinstance(url, str) and url.strip():
            bid = _extract_bayut_id_from_url(url.strip())
            if bid:
                return f"https://www.bayut.com/property/details-{bid}.html"

    # 2. Fallback: explicit numeric ID columns.
    for field in _BAYUT_ID_FIELDS:
        val = str(data.get(field) or "").strip()
        if val.isdigit() and val:
            return f"https://www.bayut.com/property/details-{val}.html"

    return None


# ─── Row normalization ────────────────────────────────────────────────────────

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


def get_table_columns(conn: sqlite3.Connection, table_name: str) -> list[str]:
    rows = conn.execute(f"PRAGMA table_info({quote_identifier(table_name)})").fetchall()
    return [row["name"] for row in rows]


def choose_sort_columns(columns: list[str]) -> str:
    column_set = set(columns)

    if "dashboard_rank" in column_set and "recon_score" in column_set:
        return """
            CASE WHEN dashboard_rank IS NULL THEN 1 ELSE 0 END ASC,
            dashboard_rank ASC,
            recon_score DESC
        """

    if "recon_rank" in column_set and "recon_score" in column_set:
        return """
            CASE WHEN recon_rank IS NULL THEN 1 ELSE 0 END ASC,
            recon_rank ASC,
            recon_score DESC
        """

    if "priority_score" in column_set:
        return "priority_score DESC"

    if "recon_score" in column_set:
        return "recon_score DESC"

    if "created_at" in column_set:
        return "created_at DESC"

    if "built_at" in column_set:
        return "built_at DESC"

    return "rowid ASC"


def safe_json_loads(value: Any) -> Any:
    if value is None:
        return []

    if not isinstance(value, str):
        return value

    stripped = value.strip()
    if not stripped:
        return []

    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        return []


def normalize_row(row: sqlite3.Row) -> dict[str, Any]:
    data = {key: row[key] for key in row.keys()}

    if "badges_json" in data:
        data["badges"] = safe_json_loads(data.get("badges_json"))

    # KSA often relies on source_url / URL-lead paths.
    # Normalize to property_url only when the source column exists.
    if not data.get("property_url") and data.get("source_url"):
        data["property_url"] = data.get("source_url")

    # Bayut canonicalization: rewrite slug URLs to /property/details-{id}.html
    if _is_bayut_row(data):
        canonical = _canonicalize_bayut_url(data)
        if canonical:
            data["property_url"] = canonical

    return data


def fetch_rows(
    conn: sqlite3.Connection,
    table_name: str,
    limit: int,
) -> tuple[list[dict[str, Any]], int, list[str], str]:
    columns = get_table_columns(conn, table_name)
    row_count = get_row_count(conn, table_name)
    sort_clause = choose_sort_columns(columns)

    rows = conn.execute(
        f"""
        SELECT *
        FROM {quote_identifier(table_name)}
        ORDER BY {sort_clause}
        LIMIT ?
        """,
        (limit,),
    ).fetchall()

    return [normalize_row(row) for row in rows], row_count, columns, sort_clause


def fetch_summary(conn: sqlite3.Connection) -> tuple[list[dict[str, Any]], int]:
    if not table_exists(conn, SUMMARY_TABLE):
        return [], 0

    rows = conn.execute(
        f"""
        SELECT *
        FROM {quote_identifier(SUMMARY_TABLE)}
        """
    ).fetchall()

    return [{key: row[key] for key in row.keys()} for row in rows], get_row_count(
        conn, SUMMARY_TABLE
    )


def write_json(path: Path, payload: Any) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def export_ksa_recon(limit: int = DEFAULT_LIMIT) -> None:
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)

    exported_at = datetime.now().isoformat(timespec="seconds")

    manifest: dict[str, Any] = {
        "export_name": "ksa_recon_frontend_data",
        "country": "ksa",
        "currency": "SAR",
        "database_path": str(KSA_DB_PATH),
        "exported_at": exported_at,
        "limit": limit,
        "exports": {},
        "outputs": {},
        "frontend_rules": {
            "currency": "SAR",
            "raw_internal_tables_exposed": False,
            "badges_json_parsed_to_badges": True,
            "source_url_normalized_to_property_url": True,
            "bayut_urls_canonicalized": True,
            "note": "KSA may have weaker phone/WhatsApp coverage; URL-lead/source URL paths are valid. Bayut URLs are canonicalized to /property/details-{id}.html.",
        },
        "do_not_expose_directly": [
            "ksa_listing_price_events",
            "ksa_listing_price_state",
            "ksa_price_history_runs",
            "ksa_suspicious_price_drop_events",
        ],
    }

    with connect_db(KSA_DB_PATH) as conn:
        for export_key, export_config in RECON_EXPORTS.items():
            table_name = export_config["table"]
            output_path = EXPORT_DIR / export_config["output"]

            if not table_exists(conn, table_name):
                manifest["exports"][export_key] = {
                    "table": table_name,
                    "exists": False,
                    "total_rows_available": 0,
                    "exported_rows": 0,
                    "output": str(output_path),
                    "columns": [],
                    "sort": None,
                }
                continue

            rows, total_rows, columns, sort_clause = fetch_rows(
                conn,
                table_name=table_name,
                limit=limit,
            )

            payload = {
                "country": "ksa",
                "currency": "SAR",
                "source_table": table_name,
                "exported_at": exported_at,
                "total_rows_available": total_rows,
                "exported_rows": len(rows),
                "default_sort": sort_clause.strip(),
                "columns": columns,
                "items": rows,
            }

            write_json(output_path, payload)

            manifest["exports"][export_key] = {
                "table": table_name,
                "exists": True,
                "total_rows_available": total_rows,
                "exported_rows": len(rows),
                "output": str(output_path),
                "columns": columns,
                "sort": sort_clause.strip(),
            }
            manifest["outputs"][export_key] = str(output_path)

        summary_rows, summary_total_rows = fetch_summary(conn)

    summary_payload = {
        "country": "ksa",
        "currency": "SAR",
        "source_table": SUMMARY_TABLE,
        "exported_at": exported_at,
        "total_rows_available": summary_total_rows,
        "items": summary_rows,
    }

    write_json(SUMMARY_OUTPUT, summary_payload)

    manifest["summary"] = {
        "table": SUMMARY_TABLE,
        "exists": summary_total_rows > 0,
        "total_rows_available": summary_total_rows,
        "exported_rows": len(summary_rows),
        "output": str(SUMMARY_OUTPUT),
    }
    manifest["outputs"]["summary"] = str(SUMMARY_OUTPUT)
    manifest["outputs"]["manifest"] = str(MANIFEST_OUTPUT)

    write_json(MANIFEST_OUTPUT, manifest)

    print("KSA Recon frontend export complete.")
    print(f"Database: {KSA_DB_PATH}")
    print("")

    for export_key, export_result in manifest["exports"].items():
        status = "OK" if export_result["exists"] else "MISSING"
        print(
            f"{export_key}: {status} | "
            f"table={export_result['table']} | "
            f"total={export_result['total_rows_available']:,} | "
            f"exported={export_result['exported_rows']:,}"
        )

    print("")
    print(f"Summary rows: {summary_total_rows:,}")
    print("")
    print(f"Export directory: {EXPORT_DIR}")
    print(f"Manifest JSON:    {MANIFEST_OUTPUT}")


if __name__ == "__main__":
    export_ksa_recon()
