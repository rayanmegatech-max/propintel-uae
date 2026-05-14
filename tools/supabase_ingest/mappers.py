import json
import re
from typing import Any


_NULLISH_TEXT = {"", "none", "null", "nan", "n/a", "na", "undefined"}
_TRUE_TEXT = {
    "1",
    "true",
    "t",
    "yes",
    "y",
    "available",
    "present",
    "enabled",
    "active",
}
_FALSE_TEXT = {
    "0",
    "false",
    "f",
    "no",
    "n",
    "none",
    "null",
    "n/a",
    "na",
    "unavailable",
    "absent",
    "disabled",
    "inactive",
}
_MEANINGLESS_SIGNAL_TEXT = {
    "0",
    "false",
    "no",
    "none",
    "null",
    "n/a",
    "na",
    "unknown",
    "unavailable",
    "absent",
    "no_signal",
    "not_available",
    "not_owner_direct",
    "non_owner_direct",
    "not_direct",
}
_OWNER_DIRECT_NEGATIVE_TEXT = {
    "0",
    "false",
    "no",
    "none",
    "null",
    "n/a",
    "na",
    "unknown",
    "unavailable",
    "absent",
    "no_signal",
    "not_available",
    "not_owner_direct",
    "non_owner_direct",
    "not_direct",
    "low",
    "weak",
    "weak_signal",
}
_OWNER_DIRECT_POSITIVE_FRAGMENTS = (
    "owner_direct",
    "direct_owner",
    "direct_from_owner",
    "for_sale_by_owner",
    "no_commission",
    "direct_style",
    "owner",
    "direct",
    "high",
    "medium",
)
_NUMBER_RE = re.compile(r"[-+]?\d[\d,]*(?:\.\d+)?")


def as_text(value: Any) -> str | None:
    if value is None:
        return None

    if isinstance(value, str):
        text = value.strip()
    elif isinstance(value, bool):
        text = "true" if value else "false"
    else:
        text = str(value).strip()

    if text.lower() in _NULLISH_TEXT:
        return None

    return text


def as_float(value: Any) -> float | None:
    if value is None or isinstance(value, bool):
        return None

    if isinstance(value, (int, float)):
        return float(value)

    text = as_text(value)
    if text is None:
        return None

    match = _NUMBER_RE.search(text.replace("%", ""))
    if not match:
        return None

    try:
        return float(match.group(0).replace(",", ""))
    except ValueError:
        return None


def as_int(value: Any) -> int | None:
    number = as_float(value)
    if number is None:
        return None
    return int(number)


def as_bool(value: Any) -> bool | None:
    if value is None:
        return None

    if isinstance(value, bool):
        return value

    if isinstance(value, (int, float)):
        return value != 0

    text = as_text(value)
    if text is None:
        return None

    normalized = _normalize_signal_text(text)
    if normalized in _TRUE_TEXT:
        return True
    if normalized in _FALSE_TEXT:
        return False

    return None


def first_present(item: dict[str, Any], keys: list[str] | tuple[str, ...]) -> Any:
    if not isinstance(item, dict):
        return None

    for key in keys:
        value = item.get(key)
        if _is_present(value):
            return value

    return None


def parse_badges(value: Any) -> list[str]:
    if value is None:
        return []

    if isinstance(value, str):
        text = as_text(value)
        if text is None:
            return []

        parsed = _parse_json_value(text)
        if parsed is not None and parsed is not value:
            return parse_badges(parsed)

        return _unique_texts(re.split(r"[,|;]", text))

    if isinstance(value, dict):
        badges = []
        for key, badge_value in value.items():
            bool_value = as_bool(badge_value)
            if bool_value is True:
                badges.append(key)
            elif bool_value is None and _is_present(badge_value):
                badges.append(f"{key}: {badge_value}")
        return _unique_texts(badges)

    if isinstance(value, (list, tuple, set)):
        badges = []
        for entry in value:
            if isinstance(entry, dict):
                badges.extend(parse_badges(entry))
            else:
                text = as_text(entry)
                if text is not None:
                    badges.append(text)
        return _unique_texts(badges)

    text = as_text(value)
    return [text] if text else []


def make_external_key(
    country: Any,
    view_key: Any,
    item: dict[str, Any],
    fallback_index: int,
) -> str:
    country_key = normalize_country(country)
    view = as_text(view_key) or "unknown_view"

    key_value = first_present(
        item,
        [
            "external_key",
            "listing_key",
            "canonical_id",
            "recon_id",
            "portal_id",
            "property_id",
            "listing_id",
            "source_id",
            "entity_key",
            "agency_public_key",
            "agency_display_name",
            "agency_name",
            "canonical_market_key",
            "market_key",
            "city_display_name",
            "district_display_name",
            "building_name",
            "community",
            "district",
            "city",
            "id",
            "property_url",
            "source_url",
            "listing_url",
        ],
    )

    key_text = as_text(key_value)
    if key_text is None:
        key_text = str(fallback_index)

    portal = normalize_portal(first_present(item, ["source_portal", "portal"]))
    parts = [country_key, view]
    if portal:
        parts.append(portal)
    parts.append(key_text)

    return ":".join(parts)


def normalize_portal(value: Any) -> str | None:
    text = as_text(value)
    if text is None:
        return None

    normalized = re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")

    aliases = {
        "propertyfinder": "property_finder",
        "property_finder_ae": "property_finder",
        "property_finder_sa": "property_finder",
        "pf": "property_finder",
        "bayut_com": "bayut",
        "dubizzle_com": "dubizzle",
        "aqar_fm": "aqar",
    }

    return aliases.get(normalized, normalized)


def normalize_country(value: Any) -> str:
    text = as_text(value)
    if text is None:
        return ""

    normalized = re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")

    aliases = {
        "ae": "uae",
        "uae": "uae",
        "united_arab_emirates": "uae",
        "emirates": "uae",
        "sa": "ksa",
        "ksa": "ksa",
        "saudi": "ksa",
        "saudi_arabia": "ksa",
        "kingdom_of_saudi_arabia": "ksa",
    }

    return aliases.get(normalized, normalized)


def map_recon_item(
    country: Any,
    view_key: Any,
    item: dict[str, Any],
    exported_at: Any,
    fallback_index: int,
) -> dict[str, Any]:
    source_item = item if isinstance(item, dict) else {}

    city = as_text(first_present(source_item, ["city", "city_name", "emirate"]))
    district = as_text(first_present(source_item, ["district"]))
    community = as_text(first_present(source_item, ["community"]))
    building = as_text(first_present(source_item, ["building_name", "building"]))

    source_portal = normalize_portal(
        first_present(source_item, ["source_portal", "portal"])
    )

    price = as_float(first_present(source_item, ["price_amount", "price"]))
    old_price = as_float(
        first_present(
            source_item,
            ["old_price", "previous_price", "original_price", "price_before_drop"],
        )
    )
    new_price = as_float(
        first_present(source_item, ["new_price", "current_price", "price_after_drop"])
    )
    drop_amount = as_float(
        first_present(source_item, ["price_drop_amount", "drop_amount"])
    )
    drop_pct = as_float(first_present(source_item, ["price_drop_pct", "drop_pct"]))

    has_phone = _has_bool_signal(
        source_item,
        ["has_phone", "has_phone_available"],
        ["contact_phone", "phone", "phone_number"],
    )
    has_whatsapp = _has_bool_signal(
        source_item,
        ["has_whatsapp", "has_whatsapp_available"],
        ["contact_whatsapp", "whatsapp", "whatsapp_number"],
    )
    has_email = _has_bool_signal(
        source_item,
        ["has_email_available"],
        ["contact_email", "email"],
    )
    has_any_direct_contact = as_bool(
        first_present(source_item, ["has_any_direct_contact"])
    )
    has_contact = bool(has_phone or has_whatsapp or has_email or has_any_direct_contact)

    has_owner_direct_bool = _any_true(
        source_item,
        ["is_owner_direct", "has_owner_direct_signal"],
    )
    has_owner_direct_text = _has_owner_direct_text_signal(
        first_present(
            source_item,
            ["owner_direct_bucket", "direct_confidence_class", "owner_direct_label"],
        )
    )
    is_owner_direct = bool(has_owner_direct_bool or has_owner_direct_text)

    has_price_movement_bool = _any_true(
        source_item,
        ["has_price_drop_signal", "is_price_drop"],
    )
    has_price_movement = bool(
        has_price_movement_bool
        or (drop_amount is not None and drop_amount != 0)
        or (drop_pct is not None and drop_pct != 0)
        or (
            old_price is not None
            and new_price is not None
            and old_price != new_price
        )
    )

    refresh_score = as_float(first_present(source_item, ["refresh_inflation_score"]))
    has_refresh_signal = bool(
        _any_true(source_item, ["has_refresh_signal", "is_refresh_inflated"])
        or (refresh_score is not None and refresh_score > 0)
        or _has_meaningful_text(first_present(source_item, ["refresh_evidence_class"]))
    )

    badges = parse_badges(
        first_present(
            source_item,
            ["badges", "badges_json", "opportunity_badges", "tags", "labels"],
        )
    )

    generated_at = as_text(
        first_present(
            source_item,
            [
                "generated_at",
                "built_at",
                "unified_built_at",
                "listing_scraped_at",
                "updated_at",
                "price_drop_detected_at",
                "exported_at",
            ],
        )
    ) or as_text(exported_at)

    return {
        "country": normalize_country(country),
        "view_key": as_text(view_key),
        "external_key": make_external_key(
            country, view_key, source_item, fallback_index
        ),
        "rank": as_int(
            first_present(source_item, ["dashboard_rank", "recon_rank", "rank"])
        ),
        "score": as_float(first_present(source_item, ["recon_score", "score"])),
        "priority": as_text(
            first_present(
                source_item,
                ["priority_label", "priority_bucket", "action_priority"],
            )
        ),
        "city": city,
        "district": district,
        "community": community,
        "location_label": _make_location_label([city, district, community, building]),
        "source_portal": source_portal,
        "source_category": as_text(
            first_present(source_item, ["source_category", "category"])
        ),
        "purpose": as_text(first_present(source_item, ["purpose", "listing_purpose"])),
        "property_type": as_text(
            first_present(source_item, ["property_type", "asset_type"])
        ),
        "title": as_text(first_present(source_item, ["title", "listing_title"])),
        "price": price,
        "old_price": old_price,
        "new_price": new_price,
        "drop_amount": drop_amount,
        "drop_pct": drop_pct,
        "agent_name": as_text(first_present(source_item, ["agent_name", "agent"])),
        "agency_name": as_text(first_present(source_item, ["agency_name", "agency"])),
        "listing_url": as_text(
            first_present(source_item, ["property_url", "source_url"])
        ),
        "source_url": as_text(first_present(source_item, ["source_url", "property_url"])),
        "has_phone": has_phone,
        "has_whatsapp": has_whatsapp,
        "has_email": has_email,
        "has_contact": has_contact,
        "is_owner_direct": is_owner_direct,
        "has_price_movement": has_price_movement,
        "has_refresh_signal": has_refresh_signal,
        "true_age_days": as_float(
            first_present(
                source_item,
                [
                    "true_age_days",
                    "effective_true_age_days",
                    "canonical_true_age_days",
                    "portal_age_days",
                ],
            )
        ),
        "recommended_action": as_text(
            first_present(
                source_item,
                ["recommended_action", "cta_text", "portal_action_label"],
            )
        ),
        "badges": badges,
        "raw_item": item,
        "generated_at": generated_at,
        "exported_at": as_text(exported_at),
    }


def map_module5_item(
    country: Any,
    view_key: Any,
    item: dict[str, Any],
    exported_at: Any,
    fallback_index: int,
) -> dict[str, Any]:
    source_item = item if isinstance(item, dict) else {}

    city = as_text(
        first_present(
            source_item,
            [
                "city",
                "city_name",
                "city_display_name",
                "emirate",
                "top_city",
                "primary_city",
                "primary_district_city",
                "top_building_city",
            ],
        )
    )
    district = as_text(
        first_present(
            source_item,
            ["district", "district_display_name", "primary_district", "top_district"],
        )
    )
    community = as_text(
        first_present(source_item, ["community", "top_community", "top_building_community"])
    )
    building = as_text(
        first_present(source_item, ["building", "building_name", "top_building_name"])
    )

    entity_key = as_text(
        first_present(
            source_item,
            [
                "entity_key",
                "agency_public_key",
                "agency_display_name",
                "agency_name",
                "canonical_market_key",
                "market_key",
                "city_display_name",
                "district_display_name",
                "building_name",
                "top_building_name",
                "community",
                "top_community",
                "district",
                "primary_district",
                "city",
                "top_city",
                "listing_key",
                "canonical_id",
                "id",
            ],
        )
    )
    if entity_key is None:
        entity_key = str(fallback_index)

    entity_label = as_text(
        first_present(
            source_item,
            [
                "entity_label",
                "agency_display_name",
                "agency_name",
                "card_title",
                "activity_label",
                "city_display_name",
                "district_display_name",
                "building_name",
                "top_building_name",
                "community",
                "top_community",
                "district",
                "primary_district",
                "city",
                "top_city",
                "entity_key",
            ],
        )
    )

    generated_at = as_text(
        first_present(
            source_item,
            [
                "generated_at",
                "built_at",
                "activity_at",
                "activity_date",
                "evidence_date",
                "exported_at",
            ],
        )
    ) or as_text(exported_at)

    entity_type = as_text(
        first_present(
            source_item,
            ["entity_type", "segment_type", "market_entity_type", "record_type"],
        )
    ) or _infer_module5_entity_type(view_key)

    return {
        "country": normalize_country(country),
        "view_key": as_text(view_key),
        "external_key": make_external_key(
            country, view_key, source_item, fallback_index
        ),
        "entity_type": entity_type,
        "entity_key": entity_key,
        "entity_label": entity_label,
        "rank": as_int(
            first_present(
                source_item,
                [
                    "dashboard_rank",
                    "category_rank",
                    "activity_rank",
                    "agency_rank",
                    "market_rank",
                    "rank",
                ],
            )
        ),
        "metric_value": as_float(
            first_present(
                source_item,
                [
                    "metric_value",
                    "portfolio_pressure_score",
                    "inventory_pressure_score",
                    "pressure_score",
                    "dominance_score",
                    "activity_score",
                    "active_listings",
                    "total_listings",
                    "recon_rate_pct",
                    "contactable_rate_pct",
                    "owner_direct_rate_pct",
                    "price_drop_rate_pct",
                    "refresh_rate_pct",
                    "avg_recon_score",
                    "avg_price",
                ],
            )
        ),
        "metric_label": as_text(
            first_present(
                source_item,
                [
                    "metric_label",
                    "portfolio_pressure_label",
                    "pressure_bucket",
                    "pressure_label",
                    "concentration_bucket",
                    "activity_bucket",
                    "portfolio_signal_bucket",
                    "inventory_status_label",
                ],
            )
        ),
        "metric_value_2": as_float(
            first_present(
                source_item,
                [
                    "metric_value_2",
                    "avg_recon_score",
                    "price_drop_rate_pct",
                    "owner_direct_rate_pct",
                    "refresh_rate_pct",
                    "contactable_rate_pct",
                    "avg_drop_pct",
                    "active_listings",
                    "unique_agents",
                ],
            )
        ),
        "metric_label_2": as_text(
            first_present(
                source_item,
                [
                    "metric_label_2",
                    "confidence_tier",
                    "inventory_status_label",
                    "portfolio_type_label",
                    "product_note",
                    "dashboard_card_type",
                ],
            )
        ),
        "change_pct": as_float(
            first_present(
                source_item,
                [
                    "price_change_pct",
                    "drop_pct",
                    "avg_drop_pct",
                    "avg_price_drop_pct",
                    "growth_pct",
                ],
            )
        ),
        "trend_direction": as_text(
            first_present(
                source_item,
                [
                    "price_direction",
                    "activity_type",
                    "activity_priority_label",
                    "trend_direction",
                    "trend",
                ],
            )
        ),
        "city": city,
        "district": district,
        "community": community,
        "building": building,
        "location_label": _make_location_label([city, district, community, building]),
        "agency_name": as_text(
            first_present(
                source_item,
                ["agency_display_name", "agency_name", "agency", "top_agency_name"],
            )
        ),
        "agent_name": as_text(first_present(source_item, ["agent_name", "agent"])),
        "source_portal": normalize_portal(
            first_present(source_item, ["source_portal", "portal"])
        ),
        "source_category": as_text(
            first_present(source_item, ["source_category", "category"])
        ),
        "purpose": as_text(first_present(source_item, ["purpose", "listing_purpose"])),
        "property_type": as_text(
            first_present(source_item, ["property_type", "asset_type"])
        ),
        "recommended_action": as_text(
            first_present(
                source_item,
                [
                    "recommended_action",
                    "recommended_interpretation",
                    "recommended_use",
                    "pressure_action",
                    "product_note",
                ],
            )
        ),
        "label_1": as_text(
            first_present(
                source_item,
                [
                    "label_1",
                    "dashboard_card_type",
                    "activity_label",
                    "status_label",
                    "priority_label",
                    "portfolio_signal_bucket",
                    "pressure_bucket",
                ],
            )
        ),
        "label_2": as_text(
            first_present(
                source_item,
                [
                    "label_2",
                    "inventory_status_label",
                    "portfolio_type_label",
                    "confidence_tier",
                    "product_note",
                    "concentration_bucket",
                ],
            )
        ),
        "raw_item": item,
        "generated_at": generated_at,
        "exported_at": as_text(exported_at),
    }


def _is_present(value: Any) -> bool:
    if value is None:
        return False

    if isinstance(value, str):
        return value.strip().lower() not in _NULLISH_TEXT

    if isinstance(value, (list, tuple, set, dict)):
        return len(value) > 0

    return True


def _parse_json_value(value: str) -> Any:
    stripped = value.strip()
    if not stripped.startswith(("[", "{")):
        return None

    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        return None


def _unique_texts(values: list[Any]) -> list[str]:
    output = []
    seen = set()

    for value in values:
        text = as_text(value)
        if text is None:
            continue

        key = text.lower()
        if key in seen:
            continue

        seen.add(key)
        output.append(text)

    return output


def _normalize_signal_text(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")


def _has_meaningful_text(value: Any) -> bool:
    text = as_text(value)
    if text is None:
        return False

    return _normalize_signal_text(text) not in _MEANINGLESS_SIGNAL_TEXT


def _has_owner_direct_text_signal(value: Any) -> bool:
    text = as_text(value)
    if text is None:
        return False

    normalized = _normalize_signal_text(text)
    if normalized in _OWNER_DIRECT_NEGATIVE_TEXT:
        return False

    return any(fragment in normalized for fragment in _OWNER_DIRECT_POSITIVE_FRAGMENTS)


def _any_true(item: dict[str, Any], keys: list[str]) -> bool:
    for key in keys:
        value = first_present(item, [key])
        bool_value = as_bool(value)
        if bool_value is True:
            return True

    return False


def _has_bool_signal(
    item: dict[str, Any],
    bool_keys: list[str],
    presence_keys: list[str],
) -> bool:
    if _any_true(item, bool_keys):
        return True

    for key in presence_keys:
        if _is_present(item.get(key)):
            return True

    return False


def _infer_module5_entity_type(view_key: Any) -> str:
    normalized = _normalize_signal_text(as_text(view_key) or "")

    if "agency" in normalized:
        return "agency"
    if "city" in normalized:
        return "city"
    if "district" in normalized:
        return "district"
    if "building" in normalized:
        return "building"
    if "community" in normalized:
        return "community"
    if "activity" in normalized:
        return "activity"
    if "inventory_pressure" in normalized or "market_dominance" in normalized:
        return "market"

    return "market"


def _make_location_label(parts: list[str | None]) -> str | None:
    output = []
    seen = set()

    for part in parts:
        text = as_text(part)
        if text is None:
            continue

        key = text.lower()
        if key in seen:
            continue

        seen.add(key)
        output.append(text)

    if not output:
        return None

    return ", ".join(output)
