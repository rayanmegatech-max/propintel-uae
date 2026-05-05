from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
KSA_EXPORT_DIR = PROJECT_ROOT / "exports" / "frontend" / "ksa"
OUTPUT_DIR = PROJECT_ROOT / "reports" / "phase5e_recon_normalization"

FILES = {
    "hot_leads": "recon_hot_leads.json",
    "multi_signal": "recon_multi_signal.json",
    "owner_direct": "recon_owner_direct.json",
    "price_drops": "recon_price_drops.json",
    "refresh_inflation": "recon_refresh_inflation.json",
    "contactable": "recon_contactable.json",
    "url_only": "recon_url_only.json",
    "residential_rent": "recon_residential_rent.json",
    "residential_buy": "recon_residential_buy.json",
    "commercial": "recon_commercial.json",
}

CANDIDATE_TITLE_FIELDS = [
    "opportunity_title",
    "title",
    "listing_title",
    "property_title",
    "name",
    "description",
]

CANDIDATE_PRICE_FIELDS = [
    "price",
    "current_price",
    "new_price",
    "old_price",
    "advertised_price",
    "asking_price",
    "rent_price",
    "sale_price",
    "amount",
]

CANDIDATE_LOCATION_FIELDS = [
    "city",
    "district",
    "community",
    "location_full_name",
    "location_name",
    "address",
    "building_name",
]

CANDIDATE_URL_FIELDS = [
    "property_url",
    "source_url",
    "listing_url",
    "url",
    "detail_url",
]

CANDIDATE_AGENCY_FIELDS = [
    "agency_name",
    "brokerage_name",
    "company_name",
    "office_name",
    "agent_name",
]


def load_payload(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def is_present(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    return True


def summarize_candidate_fields(items: list[dict[str, Any]], fields: list[str]) -> dict[str, Any]:
    summary: dict[str, Any] = {}

    for field in fields:
        present_count = sum(1 for item in items if is_present(item.get(field)))
        examples = []
        for item in items:
            value = item.get(field)
            if is_present(value):
                examples.append(value)
            if len(examples) >= 5:
                break

        summary[field] = {
            "present_count": present_count,
            "present_pct": round((present_count / len(items)) * 100, 2) if items else 0,
            "examples": examples,
        }

    return summary


def summarize_all_keys(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    counter: Counter[str] = Counter()

    for item in items:
        for key, value in item.items():
            if is_present(value):
                counter[key] += 1

    return [
        {
            "field": key,
            "present_count": count,
            "present_pct": round((count / len(items)) * 100, 2) if items else 0,
        }
        for key, count in counter.most_common()
    ]


def select_sample_rows(items: list[dict[str, Any]], limit: int = 5) -> list[dict[str, Any]]:
    compact_rows = []

    interesting_fields = list(
        dict.fromkeys(
            CANDIDATE_TITLE_FIELDS
            + CANDIDATE_PRICE_FIELDS
            + CANDIDATE_LOCATION_FIELDS
            + CANDIDATE_URL_FIELDS
            + CANDIDATE_AGENCY_FIELDS
            + [
                "dashboard_rank",
                "recon_rank",
                "recon_score",
                "priority_label",
                "confidence_tier",
                "primary_opportunity_type",
                "source_category",
                "portal",
                "property_type",
                "bedrooms",
                "bathrooms",
                "size_sqft",
                "badges",
                "badges_json",
            ]
        )
    )

    for item in items[:limit]:
        compact_rows.append({field: item.get(field) for field in interesting_fields if field in item})

    return compact_rows


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    report: dict[str, Any] = {
        "source_dir": str(KSA_EXPORT_DIR),
        "files": {},
    }

    markdown: list[str] = []
    markdown.append("# Phase 5E KSA Recon Export Sample Inspection")
    markdown.append("")
    markdown.append("Purpose: inspect actual KSA exported JSON fields before normalizing KSA Recon UI.")
    markdown.append("")

    for label, file_name in FILES.items():
        path = KSA_EXPORT_DIR / file_name

        if not path.exists():
            report["files"][label] = {
                "file": file_name,
                "exists": False,
            }
            continue

        payload = load_payload(path)
        items = payload.get("items", [])

        if not isinstance(items, list):
            items = []

        file_report = {
            "file": file_name,
            "exists": True,
            "source_table": payload.get("source_table"),
            "exported_rows": payload.get("exported_rows"),
            "total_rows_available": payload.get("total_rows_available"),
            "candidate_title_fields": summarize_candidate_fields(items, CANDIDATE_TITLE_FIELDS),
            "candidate_price_fields": summarize_candidate_fields(items, CANDIDATE_PRICE_FIELDS),
            "candidate_location_fields": summarize_candidate_fields(items, CANDIDATE_LOCATION_FIELDS),
            "candidate_url_fields": summarize_candidate_fields(items, CANDIDATE_URL_FIELDS),
            "candidate_agency_fields": summarize_candidate_fields(items, CANDIDATE_AGENCY_FIELDS),
            "most_populated_fields": summarize_all_keys(items)[:40],
            "sample_rows": select_sample_rows(items),
        }

        report["files"][label] = file_report

        markdown.append(f"## {label}")
        markdown.append("")
        markdown.append(f"File: `{file_name}`")
        markdown.append("")
        markdown.append(f"Source table: `{payload.get('source_table')}`")
        markdown.append("")
        markdown.append(f"Exported rows: `{payload.get('exported_rows')}`")
        markdown.append("")
        markdown.append(f"Total rows available: `{payload.get('total_rows_available')}`")
        markdown.append("")

        markdown.append("### Candidate title fields")
        markdown.append("")
        markdown.append("| Field | Present | Present % | Examples |")
        markdown.append("|---|---:|---:|---|")
        for field, info in file_report["candidate_title_fields"].items():
            markdown.append(
                f"| `{field}` | {info['present_count']} | {info['present_pct']}% | "
                f"{json.dumps(info['examples'][:3], ensure_ascii=False)} |"
            )
        markdown.append("")

        markdown.append("### Candidate price fields")
        markdown.append("")
        markdown.append("| Field | Present | Present % | Examples |")
        markdown.append("|---|---:|---:|---|")
        for field, info in file_report["candidate_price_fields"].items():
            markdown.append(
                f"| `{field}` | {info['present_count']} | {info['present_pct']}% | "
                f"{json.dumps(info['examples'][:3], ensure_ascii=False)} |"
            )
        markdown.append("")

        markdown.append("### Candidate location fields")
        markdown.append("")
        markdown.append("| Field | Present | Present % | Examples |")
        markdown.append("|---|---:|---:|---|")
        for field, info in file_report["candidate_location_fields"].items():
            markdown.append(
                f"| `{field}` | {info['present_count']} | {info['present_pct']}% | "
                f"{json.dumps(info['examples'][:3], ensure_ascii=False)} |"
            )
        markdown.append("")

        markdown.append("### Candidate URL fields")
        markdown.append("")
        markdown.append("| Field | Present | Present % | Examples |")
        markdown.append("|---|---:|---:|---|")
        for field, info in file_report["candidate_url_fields"].items():
            markdown.append(
                f"| `{field}` | {info['present_count']} | {info['present_pct']}% | "
                f"{json.dumps(info['examples'][:3], ensure_ascii=False)} |"
            )
        markdown.append("")

        markdown.append("### Most populated fields")
        markdown.append("")
        markdown.append("| Field | Present | Present % |")
        markdown.append("|---|---:|---:|")
        for field_info in file_report["most_populated_fields"][:25]:
            markdown.append(
                f"| `{field_info['field']}` | {field_info['present_count']} | {field_info['present_pct']}% |"
            )
        markdown.append("")

        markdown.append("---")
        markdown.append("")

    json_path = OUTPUT_DIR / "ksa_recon_export_sample_inspection.json"
    md_path = OUTPUT_DIR / "KSA_RECON_EXPORT_SAMPLE_INSPECTION.md"

    json_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    md_path.write_text("\n".join(markdown), encoding="utf-8")

    print("KSA Recon export sample inspection complete.")
    print(f"JSON: {json_path}")
    print(f"MD:   {md_path}")


if __name__ == "__main__":
    main()