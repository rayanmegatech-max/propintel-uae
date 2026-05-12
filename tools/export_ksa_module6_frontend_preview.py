#!/usr/bin/env python3
"""
Export a frontend-safe KSA Module 6 AI Recon preview from a JSONL vector output.

This script intentionally uses only the Python standard library and streams the
source JSONL file line by line. It does not load the full source file into memory.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_SOURCE = Path(
    r"C:\Users\User\Documents\malesh\KSA\feature_engine\06_ai_intelligence\ksa_vectors_output.jsonl"
)
DEFAULT_OUT_DIR = Path("exports/frontend/ksa")
DEFAULT_LIMIT = 500

EXPORT_FILE_NAME = "module6_ai_recon.json"
MANIFEST_FILE_NAME = "module6_manifest.json"

COUNTRY = "ksa"
MODULE = "module6_ai_recon"
DESCRIPTION = (
    "Frontend-safe preview export for KSA AI Recon Intelligence. "
    "Embeddings and raw/internal evidence are stripped."
)

SAFE_FIELDS = {
    "id",
    "record_id",
    "listing_id",
    "listing_key",
    "canonical_id",
    "recon_id",
    "property_id",
    "portal_id",
    "external_id",
    "source_id",
    "uuid",
    "slug",
    "rank",
    "dashboard_rank",
    "priority_rank",
    "score_rank",
    "sort_rank",
    "row_rank",
    "country",
    "country_code",
    "market",
    "market_code",
    "region",
    "province",
    "city",
    "city_norm",
    "district",
    "district_norm",
    "neighborhood",
    "neighborhood_norm",
    "community",
    "community_norm",
    "sub_community",
    "sub_community_norm",
    "area",
    "area_norm",
    "zone",
    "zone_norm",
    "address",
    "address_norm",
    "latitude",
    "longitude",
    "lat",
    "lng",
    "location_label",
    "location_text",
    "location_name",
    "location_name_ar",
    "location_confidence",
    "portal",
    "source",
    "source_name",
    "source_table",
    "source_category",
    "source_type",
    "schema_name",
    "listing_url",
    "property_url",
    "url",
    "canonical_url",
    "contact_via_url",
    "title",
    "title_ar",
    "description",
    "description_ar",
    "summary",
    "summary_ar",
    "narrative",
    "narrative_ar",
    "insight",
    "insight_ar",
    "ai_summary",
    "ai_summary_ar",
    "ai_narrative",
    "ai_narrative_ar",
    "ai_insight",
    "ai_insight_ar",
    "listing_profile_text",
    "seller_behavior_text",
    "market_context_text",
    "recommendation",
    "recommendation_ar",
    "recommended_action",
    "recommended_action_ar",
    "di_pressure_action",
    "di_interpretation_note",
    "reason",
    "reason_ar",
    "explanation",
    "explanation_ar",
    "notes",
    "notes_ar",
    "profile_text",
    "behavior_text",
    "context_text",
    "property_type",
    "property_type_norm",
    "property_subtype",
    "property_subtype_norm",
    "category",
    "category_norm",
    "subcategory",
    "subcategory_norm",
    "purpose",
    "purpose_norm",
    "transaction_type",
    "transaction_type_norm",
    "listing_type",
    "listing_type_norm",
    "furnishing",
    "furnishing_norm",
    "completion_status",
    "completion_status_norm",
    "ownership",
    "ownership_norm",
    "tenure",
    "tenure_norm",
    "bedrooms",
    "bedrooms_norm",
    "bathrooms",
    "bathrooms_norm",
    "rooms",
    "rooms_norm",
    "size",
    "size_sqft",
    "size_sqm",
    "plot_size",
    "plot_size_sqft",
    "plot_size_sqm",
    "built_up_area",
    "built_up_area_sqft",
    "built_up_area_sqm",
    "land_area",
    "land_area_sqft",
    "land_area_sqm",
    "gross_area",
    "gross_area_sqft",
    "gross_area_sqm",
    "net_area",
    "net_area_sqft",
    "net_area_sqm",
    "price",
    "price_amount",
    "price_sar",
    "asking_price",
    "asking_price_amount",
    "asking_price_sar",
    "rent",
    "rent_amount",
    "rent_sar",
    "annual_rent",
    "annual_rent_amount",
    "annual_rent_sar",
    "monthly_rent",
    "monthly_rent_amount",
    "monthly_rent_sar",
    "price_per_sqft",
    "price_per_sqm",
    "currency",
    "valuation",
    "valuation_sar",
    "estimated_value",
    "estimated_value_sar",
    "estimated_price",
    "estimated_price_sar",
    "fair_value",
    "fair_value_sar",
    "discount",
    "discount_amount",
    "discount_percent",
    "premium",
    "premium_amount",
    "premium_percent",
    "price_gap",
    "price_gap_percent",
    "price_delta",
    "price_delta_percent",
    "opportunity_type",
    "primary_opportunity_type",
    "secondary_opportunity_type",
    "opportunity_label",
    "opportunity_summary",
    "opportunity_score",
    "opportunity_score_label",
    "opportunity_bucket",
    "opportunity_class",
    "opportunity_lane",
    "investment_score",
    "investment_score_label",
    "recon_score",
    "recon_score_label",
    "ai_score",
    "ai_score_label",
    "confidence",
    "confidence_score",
    "confidence_label",
    "confidence_bucket",
    "confidence_class",
    "risk_score",
    "risk_label",
    "risk_level",
    "risk_bucket",
    "risk_class",
    "signal_score",
    "signal_strength",
    "signal_label",
    "signal_bucket",
    "signal_class",
    "direct_signal",
    "direct_signal_type",
    "direct_signal_label",
    "direct_signal_score",
    "direct_signal_class",
    "seller_signal",
    "seller_signal_label",
    "seller_signal_score",
    "seller_class",
    "motivation_signal",
    "motivation_label",
    "motivation_score",
    "motivation_class",
    "urgency_signal",
    "urgency_label",
    "urgency_score",
    "urgency_class",
    "deal_signal",
    "deal_signal_label",
    "deal_signal_score",
    "deal_class",
    "market_signal",
    "market_signal_label",
    "market_signal_score",
    "market_class",
    "price_signal",
    "price_signal_label",
    "price_signal_score",
    "price_class",
    "di_pressure_bucket",
    "priority_bucket",
    "priority_class",
    "pressure_bucket",
    "pressure_class",
    "pressure_score",
    "pressure_label",
    "listing_age_days",
    "days_on_market",
    "age_bucket",
    "age_class",
    "freshness_bucket",
    "freshness_class",
    "published_at",
    "created_at",
    "updated_at",
    "scraped_at",
    "exported_at",
    "last_seen_at",
    "first_seen_at",
    "observed_at",
    "event_at",
    "is_active",
    "is_verified",
    "is_featured",
    "is_direct",
    "is_direct_listing",
    "is_owner",
    "is_agent",
    "is_broker",
    "is_developer",
    "is_duplicate",
    "is_new",
    "is_refreshed",
    "is_price_drop",
    "is_price_increase",
    "has_phone",
    "has_whatsapp",
    "has_email",
    "has_any_direct_contact",
    "has_direct_contact",
    "has_contact",
    "has_url",
    "has_images",
    "has_location",
    "has_price",
    "has_description",
    "has_coordinates",
    "amenities",
    "features",
    "tags",
    "labels",
    "keywords",
    "highlights",
    "warnings",
    "flags",
    "badges",
    "segments",
    "clusters",
    "cohort",
    "persona",
    "seller_type",
    "seller_type_label",
    "seller_category",
    "seller_category_label",
    "agent_name",
    "agency_name",
    "broker_name",
    "developer_name",
    "project_name",
    "building_name",
    "unit_number",
    "floor_number",
    "completion_year",
    "handover_date",
    "payment_plan",
    "service_charge",
    "service_charge_sar",
    "roi",
    "yield",
    "gross_yield",
    "net_yield",
    "cap_rate",
    "occupancy_status",
    "rental_status",
    "vacancy_status",
    "legal_status",
    "permit_number",
    "license_number",
    "reference_number",
    "reference_id",
    "batch_id",
    "export_batch",
    "model_name",
    "model_version",
    "pipeline_version",
    "processing_status",
    "quality_score",
    "quality_label",
    "completeness_score",
    "dedupe_score",
    "match_score",
    "entity_score",
}

DISPLAY_CLEANUP_FIELDS = {
    "opportunity_summary",
    "recommended_action",
    "di_pressure_action",
    "di_interpretation_note",
    "listing_profile_text",
    "seller_behavior_text",
    "market_context_text",
}

EXCLUDED_KEY_NAMES = {
    "evidence_json",
    "raw_payload",
    "phone",
    "whatsapp",
    "email",
    "contact_phone",
    "contact_whatsapp",
    "contact_email",
}

EXCLUDED_KEY_SUBSTRINGS = (
    "embedding",
    "vector",
    "raw",
    "debug",
    "internal",
    "payload",
)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def parse_limit(value: str) -> int:
    try:
        parsed = int(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("--limit must be an integer") from exc

    if parsed < 1:
        raise argparse.ArgumentTypeError("--limit must be greater than or equal to 1")

    return parsed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Stream-export a frontend-safe KSA Module 6 AI Recon preview."
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help=f"Source JSONL file. Default: {DEFAULT_SOURCE}",
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=DEFAULT_OUT_DIR,
        help=f"Output directory. Default: {DEFAULT_OUT_DIR}",
    )
    parser.add_argument(
        "--limit",
        type=parse_limit,
        default=DEFAULT_LIMIT,
        help=f"Maximum records to export. Default: {DEFAULT_LIMIT}",
    )
    return parser.parse_args()


def normalize_key(key: str) -> str:
    return key.strip().lower().replace("-", "_").replace(" ", "_")


def is_unsafe_key(key: str) -> bool:
    normalized = normalize_key(key)

    if normalized in EXCLUDED_KEY_NAMES:
        return True

    return any(substring in normalized for substring in EXCLUDED_KEY_SUBSTRINGS)


def is_safe_field(key: str) -> bool:
    normalized = normalize_key(key)
    return normalized in SAFE_FIELDS and not is_unsafe_key(normalized)


def find_balanced_chunk_end(value: str, start_index: int) -> int:
    opening = value[start_index]
    closing = "}" if opening == "{" else "]"
    stack = [closing]
    index = start_index + 1
    in_string = False
    escape_next = False

    while index < len(value):
        character = value[index]

        if in_string:
            if escape_next:
                escape_next = False
            elif character == "\\":
                escape_next = True
            elif character == '"':
                in_string = False
            index += 1
            continue

        if character == '"':
            in_string = True
        elif character == "{":
            stack.append("}")
        elif character == "[":
            stack.append("]")
        elif character == stack[-1]:
            stack.pop()
            if not stack:
                return index + 1

        index += 1

    return len(value)


def remove_parsed_evidence_chunks(value: str) -> str:
    pattern = re.compile(
        r"parsed\s+evidence(?:\s+json)?(?:\s+chunks?)?\s*:?",
        flags=re.IGNORECASE,
    )

    cleaned_parts: list[str] = []
    cursor = 0

    while True:
        match = pattern.search(value, cursor)
        if match is None:
            cleaned_parts.append(value[cursor:])
            break

        cleaned_parts.append(value[cursor : match.start()])

        chunk_cursor = match.end()
        while chunk_cursor < len(value) and value[chunk_cursor].isspace():
            chunk_cursor += 1

        if chunk_cursor < len(value) and value[chunk_cursor] in "{[":
            cursor = find_balanced_chunk_end(value, chunk_cursor)
        else:
            cursor = chunk_cursor

    return "".join(cleaned_parts)


def clean_display_string(value: str) -> str:
    cleaned = remove_parsed_evidence_chunks(value)

    cleaned = cleaned.replace("DIRECT_LIKELY", "Direct-style signal")
    cleaned = cleaned.replace("0.0-bedroom land", "Land")
    cleaned = cleaned.replace("0.0-Bedroom land", "Land")
    cleaned = cleaned.replace("0.0-bedroom Land", "Land")
    cleaned = cleaned.replace("0.0-Bedroom Land", "Land")

    cleaned = re.sub(r"\s+", " ", cleaned, flags=re.UNICODE)
    cleaned = re.sub(r"\s*\|\s*", "  ", cleaned, flags=re.UNICODE)
    cleaned = re.sub(r"([.!?])(?:\s+\1)+", r"\1", cleaned, flags=re.UNICODE)

    return cleaned.strip()


def clean_value(value: Any, apply_display_cleanup: bool) -> Any:
    if isinstance(value, str):
        if apply_display_cleanup:
            return clean_display_string(value)

        return value

    if isinstance(value, dict):
        cleaned_dict: dict[str, Any] = {}
        for key, child_value in value.items():
            key_as_string = str(key)

            if is_unsafe_key(key_as_string):
                continue

            cleaned_child = clean_value(child_value, apply_display_cleanup)
            if cleaned_child is None:
                continue

            cleaned_dict[key_as_string] = cleaned_child

        return cleaned_dict

    if isinstance(value, list):
        cleaned_list: list[Any] = []
        for child_value in value:
            cleaned_child = clean_value(child_value, apply_display_cleanup)
            if cleaned_child is None:
                continue
            cleaned_list.append(cleaned_child)

        return cleaned_list

    if isinstance(value, (int, float, bool)) or value is None:
        return value

    if apply_display_cleanup:
        return clean_display_string(str(value))

    return str(value)


def sanitize_record(record: dict[str, Any]) -> dict[str, Any]:
    safe_record: dict[str, Any] = {}

    for key, value in record.items():
        key_as_string = str(key)
        normalized_key = normalize_key(key_as_string)

        if not is_safe_field(key_as_string):
            continue

        cleaned_value = clean_value(
            value,
            apply_display_cleanup=normalized_key in DISPLAY_CLEANUP_FIELDS,
        )
        if cleaned_value is None:
            continue

        safe_record[key_as_string] = cleaned_value

    return safe_record


def stream_preview_items(source: Path, limit: int) -> tuple[list[dict[str, Any]], int]:
    items: list[dict[str, Any]] = []
    skipped_bad_lines = 0

    with source.open("r", encoding="utf-8") as source_file:
        for line in source_file:
            if len(items) >= limit:
                break

            stripped = line.strip()
            if not stripped:
                continue

            try:
                record = json.loads(stripped)
            except json.JSONDecodeError:
                skipped_bad_lines += 1
                continue

            if not isinstance(record, dict):
                skipped_bad_lines += 1
                continue

            items.append(sanitize_record(record))

    return items, skipped_bad_lines


def write_json(path: Path, payload: dict[str, Any]) -> None:
    with path.open("w", encoding="utf-8") as output_file:
        json.dump(payload, output_file, ensure_ascii=False, indent=2)
        output_file.write("\n")


def main() -> None:
    args = parse_args()

    source: Path = args.source
    out_dir: Path = args.out_dir
    limit: int = args.limit

    if not source.exists():
        raise SystemExit(f"error: source file does not exist: {source}")

    if not source.is_file():
        raise SystemExit(f"error: source path is not a file: {source}")

    source_size_bytes = source.stat().st_size

    items, skipped_bad_lines = stream_preview_items(source, limit)
    exported_count = len(items)

    out_dir.mkdir(parents=True, exist_ok=True)

    output_file = out_dir / EXPORT_FILE_NAME
    manifest_file = out_dir / MANIFEST_FILE_NAME
    generated_at_utc = utc_now_iso()

    export_payload = {
        "country": COUNTRY,
        "module": MODULE,
        "description": DESCRIPTION,
        "limit": limit,
        "exported_count": exported_count,
        "items": items,
    }

    manifest_payload = {
        "country": COUNTRY,
        "module": MODULE,
        "status": "success",
        "source_file": str(source),
        "output_file": str(output_file),
        "limit": limit,
        "exported_count": exported_count,
        "skipped_bad_lines": skipped_bad_lines,
        "source_size_bytes": source_size_bytes,
        "generated_at_utc": generated_at_utc,
        "embeddings_stripped": True,
        "frontend_safe": True,
        "notes": [
            "Source JSONL was streamed line by line; the full source file was not loaded into memory.",
            "Only explicit SAFE_FIELDS whitelist keys were exported when present.",
            "Keys containing embedding or vector were stripped.",
            "Raw, debug, internal, payload, evidence JSON, and actual contact value fields were stripped.",
            "Safe boolean/contact flags such as has_phone, has_whatsapp, has_any_direct_contact, and contact_via_url were preserved when present.",
            "Only selected narrative/display strings were lightly cleaned while preserving Arabic text.",
            "Identifier, code, bucket/class, URL, category, numeric, and boolean fields were preserved without display cleanup.",
        ],
    }

    write_json(output_file, export_payload)
    write_json(manifest_file, manifest_payload)

    print(f"source: {source}")
    print(f"output: {output_file}")
    print(f"manifest: {manifest_file}")
    print(f"limit: {limit}")
    print(f"exported_count: {exported_count}")
    print(f"skipped_bad_lines: {skipped_bad_lines}")
    print(f"source_size_bytes: {source_size_bytes}")
    print("embeddings_stripped: true")


if __name__ == "__main__":
    main()
