# Phase 5D Schema Inspection Report

Generated at: `2026-05-05T23:16:34`

## Purpose

Inspect UAE and KSA frontend-safe dashboard/product tables before wiring real frontend data.

This report does not connect Supabase, auth, Stripe, billing, or live frontend data.

---

## UAE

Currency: `AED`

Database path: `C:\Users\User\Documents\malesh\intelligence.db`

Database exists: `True`

### Product/dashboard candidate tables

| Table | Exists | Rows | Columns |
|---|---:|---:|---:|
| `active_listings_unified` | True | 2016810 | 75 |
| `owner_direct_opportunities` | True | 36339 | 64 |
| `price_drop_opportunities` | True | 18873 | 73 |
| `true_listing_age_signals` | True | 2016810 | 87 |
| `recon_dashboard_refresh_inflated` | True | 150000 | 88 |
| `recon_dashboard_listing_truth` | True | 200000 | 88 |
| `recon_hub_opportunities` | True | 1519685 | 87 |
| `recon_dashboard_hot_leads` | True | 43368 | 88 |
| `recon_dashboard_price_drops` | True | 18822 | 88 |
| `recon_dashboard_owner_direct` | True | 36336 | 88 |
| `recon_dashboard_stale_price_drops` | True | 12794 | 88 |
| `recon_dashboard_refresh_inflated` | True | 150000 | 88 |
| `recon_dashboard_listing_truth` | True | 200000 | 88 |
| `recon_dashboard_residential_rent` | True | 150000 | 88 |
| `recon_dashboard_residential_buy` | True | 150000 | 88 |
| `recon_dashboard_commercial` | True | 117361 | 88 |
| `recon_dashboard_short_rental` | True | 38098 | 88 |
| `recon_dashboard_summary` | True | 31 | 5 |
| `module5_dashboard_summary` | True | 17 | 3 |
| `module5_dashboard_market_dominance` | True | 5000 | 31 |
| `module5_dashboard_inventory_pressure` | True | 5000 | 44 |
| `module5_dashboard_agency_profiles` | True | 4624 | 68 |
| `module5_dashboard_activity_feed` | True | 5000 | 36 |
| `module5_dashboard_very_active_markets` | True | 1226 | 21 |
| `module5_dashboard_building_intelligence` | True | 5000 | 29 |
| `module5_dashboard_community_intelligence` | True | 4542 | 35 |

### Raw/internal tables that must not be exposed directly

| Table | Exists | Rows | Reason |
|---|---:|---:|---|
| `listing_price_events` | True | 2075363 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `listing_price_state` | True | 2016810 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `price_history_runs` | True | 3 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `suspicious_price_drop_events` | True | 1302 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `market_dominance_building` | True | 19640 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `market_dominance_community` | True | 5505 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `inventory_pressure_community` | True | 5508 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `inventory_pressure_building` | True | 19650 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `agency_inventory_profiles` | True | 7060 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `agency_inventory_by_community` | True | 110490 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `agency_inventory_by_building` | True | 120345 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `market_activity_feed` | True | 76784 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `market_activity_summary` | True | 1234 | Raw/internal/evidence table. Do not expose directly to paid users. |

### Existing table schemas

#### `active_listings_unified`

Rows: `2016810`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `listing_key` | `TEXT` | 1 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 1 | 0 |
| `schema_name` | `TEXT` | 1 | 0 |
| `portal_id` | `TEXT` | 1 | 0 |
| `raw_id` | `TEXT` | 0 | 0 |
| `external_id` | `TEXT` | 0 | 0 |
| `hash_id` | `TEXT` | 0 | 0 |
| `reference_number` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 1 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_short_rental` | `INTEGER` | 1 | 0 |
| `is_commercial` | `INTEGER` | 1 | 0 |
| `is_land` | `INTEGER` | 1 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `description` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `cover_photo_url` | `TEXT` | 0 | 0 |
| `all_photo_urls` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `original_price` | `REAL` | 0 | 0 |
| `amount_paid` | `REAL` | 0 | 0 |
| `price_is_hidden` | `INTEGER` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INTEGER` | 0 | 0 |
| `bathrooms` | `INTEGER` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `plot_size_sqft` | `REAL` | 0 | 0 |
| `furnishing` | `TEXT` | 0 | 0 |
| `completion_status` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `subcommunity` | `TEXT` | 0 | 0 |
| `building_id` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `location_full_name` | `TEXT` | 0 | 0 |
| `location_slug` | `TEXT` | 0 | 0 |
| `location_path` | `TEXT` | 0 | 0 |
| `lat` | `REAL` | 0 | 0 |
| `lng` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agent_email` | `TEXT` | 0 | 0 |
| `agent_phone` | `TEXT` | 0 | 0 |
| `agent_whatsapp` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `agency_phone` | `TEXT` | 0 | 0 |
| `agency_email` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INTEGER` | 0 | 0 |
| `has_whatsapp_available` | `INTEGER` | 0 | 0 |
| `has_email_available` | `INTEGER` | 0 | 0 |
| `listed_by_value` | `TEXT` | 0 | 0 |
| `listed_by_label` | `TEXT` | 0 | 0 |
| `is_verified` | `INTEGER` | 0 | 0 |
| `is_featured` | `INTEGER` | 0 | 0 |
| `is_premium` | `INTEGER` | 0 | 0 |
| `is_direct_from_developer` | `INTEGER` | 0 | 0 |
| `has_dld_history` | `INTEGER` | 0 | 0 |
| `photo_count` | `INTEGER` | 0 | 0 |
| `video_url` | `TEXT` | 0 | 0 |
| `tour_url` | `TEXT` | 0 | 0 |
| `listing_level` | `TEXT` | 0 | 0 |
| `listing_level_label` | `TEXT` | 0 | 0 |
| `created_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `scraped_at` | `TEXT` | 0 | 0 |
| `canonical_joined` | `INTEGER` | 1 | 0 |
| `inserted_at` | `TEXT` | 1 | 0 |

#### `owner_direct_opportunities`

Rows: `36339`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `opportunity_id` | `INTEGER` | 0 | 1 |
| `listing_key` | `TEXT` | 1 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 1 | 0 |
| `schema_name` | `TEXT` | 1 | 0 |
| `portal_id` | `TEXT` | 1 | 0 |
| `opportunity_bucket` | `TEXT` | 1 | 0 |
| `opportunity_label` | `TEXT` | 1 | 0 |
| `confidence_tier` | `TEXT` | 1 | 0 |
| `confidence_score` | `INTEGER` | 1 | 0 |
| `lead_score` | `INTEGER` | 1 | 0 |
| `is_verified_owner_signal` | `INTEGER` | 1 | 0 |
| `is_possible_owner_signal` | `INTEGER` | 1 | 0 |
| `is_text_signal` | `INTEGER` | 1 | 0 |
| `is_no_commission_signal` | `INTEGER` | 1 | 0 |
| `is_owner_like_signal` | `INTEGER` | 1 | 0 |
| `is_developer_direct` | `INTEGER` | 1 | 0 |
| `detection_reasons` | `TEXT` | 1 | 0 |
| `negative_reasons` | `TEXT` | 1 | 0 |
| `display_warning` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 1 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `fsbo_type` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INTEGER` | 1 | 0 |
| `is_commercial_lead` | `INTEGER` | 1 | 0 |
| `is_short_rental_lead` | `INTEGER` | 1 | 0 |
| `is_sale_lead` | `INTEGER` | 1 | 0 |
| `is_rent_lead` | `INTEGER` | 1 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INTEGER` | 0 | 0 |
| `bathrooms` | `INTEGER` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `plot_size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `subcommunity` | `TEXT` | 0 | 0 |
| `building_id` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `lat` | `REAL` | 0 | 0 |
| `lng` | `REAL` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INTEGER` | 0 | 0 |
| `has_whatsapp_available` | `INTEGER` | 0 | 0 |
| `has_email_available` | `INTEGER` | 0 | 0 |
| `recommended_action` | `TEXT` | 1 | 0 |
| `portal_action_label` | `TEXT` | 1 | 0 |
| `whatsapp_deeplink` | `TEXT` | 0 | 0 |
| `prefilled_message` | `TEXT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `scraped_at` | `TEXT` | 0 | 0 |
| `listing_age_days` | `INTEGER` | 0 | 0 |
| `discovered_bucket` | `TEXT` | 0 | 0 |
| `detected_at` | `TEXT` | 1 | 0 |

#### `price_drop_opportunities`

Rows: `18873`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `drop_id` | `INTEGER` | 0 | 1 |
| `event_id` | `INTEGER` | 1 | 0 |
| `run_id` | `TEXT` | 1 | 0 |
| `listing_key` | `TEXT` | 1 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 1 | 0 |
| `schema_name` | `TEXT` | 1 | 0 |
| `portal_id` | `TEXT` | 1 | 0 |
| `quality_bucket` | `TEXT` | 1 | 0 |
| `quality_reasons` | `TEXT` | 1 | 0 |
| `drop_strength_label` | `TEXT` | 1 | 0 |
| `drop_score` | `INTEGER` | 1 | 0 |
| `opportunity_rank` | `INTEGER` | 0 | 0 |
| `is_major_drop` | `INTEGER` | 1 | 0 |
| `is_good_drop` | `INTEGER` | 1 | 0 |
| `is_small_drop` | `INTEGER` | 1 | 0 |
| `is_cross_portal_drop` | `INTEGER` | 1 | 0 |
| `cross_portal_drop_count` | `INTEGER` | 1 | 0 |
| `cross_portal_count` | `INTEGER` | 1 | 0 |
| `is_owner_direct_overlap` | `INTEGER` | 1 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INTEGER` | 1 | 0 |
| `is_commercial_lead` | `INTEGER` | 1 | 0 |
| `is_short_rental_lead` | `INTEGER` | 1 | 0 |
| `is_sale_lead` | `INTEGER` | 1 | 0 |
| `is_rent_lead` | `INTEGER` | 1 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INTEGER` | 0 | 0 |
| `bathrooms` | `INTEGER` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 1 | 0 |
| `new_price` | `REAL` | 1 | 0 |
| `drop_amount` | `REAL` | 1 | 0 |
| `drop_pct` | `REAL` | 1 | 0 |
| `old_price_per_sqft` | `REAL` | 0 | 0 |
| `new_price_per_sqft` | `REAL` | 0 | 0 |
| `current_price` | `REAL` | 0 | 0 |
| `first_price` | `REAL` | 0 | 0 |
| `min_price` | `REAL` | 0 | 0 |
| `max_price` | `REAL` | 0 | 0 |
| `price_change_count` | `INTEGER` | 0 | 0 |
| `price_drop_count` | `INTEGER` | 0 | 0 |
| `times_seen` | `INTEGER` | 0 | 0 |
| `first_seen_at` | `TEXT` | 0 | 0 |
| `last_seen_at` | `TEXT` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INTEGER` | 0 | 0 |
| `has_whatsapp_available` | `INTEGER` | 0 | 0 |
| `has_email_available` | `INTEGER` | 0 | 0 |
| `recommended_action` | `TEXT` | 1 | 0 |
| `portal_action_label` | `TEXT` | 1 | 0 |
| `whatsapp_deeplink` | `TEXT` | 0 | 0 |
| `prefilled_message` | `TEXT` | 0 | 0 |
| `portal_created_at` | `TEXT` | 0 | 0 |
| `scraped_at` | `TEXT` | 0 | 0 |
| `detected_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 1 | 0 |

#### `true_listing_age_signals`

Rows: `2016810`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `signal_id` | `INTEGER` | 0 | 1 |
| `listing_key` | `TEXT` | 1 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 1 | 0 |
| `schema_name` | `TEXT` | 1 | 0 |
| `portal_id` | `TEXT` | 1 | 0 |
| `age_confidence_tier` | `TEXT` | 1 | 0 |
| `age_confidence_reason` | `TEXT` | 1 | 0 |
| `age_label` | `TEXT` | 1 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `signal_score` | `INTEGER` | 1 | 0 |
| `signal_rank` | `INTEGER` | 0 | 0 |
| `has_invalid_portal_origin_date` | `INTEGER` | 1 | 0 |
| `has_invalid_canonical_origin_date` | `INTEGER` | 1 | 0 |
| `invalid_date_reason` | `TEXT` | 0 | 0 |
| `portal_origin_date` | `TEXT` | 0 | 0 |
| `portal_refresh_date` | `TEXT` | 0 | 0 |
| `scraped_at` | `TEXT` | 0 | 0 |
| `canonical_earliest_origin_date` | `TEXT` | 0 | 0 |
| `canonical_latest_refresh_date` | `TEXT` | 0 | 0 |
| `portal_age_days` | `INTEGER` | 0 | 0 |
| `displayed_age_days` | `INTEGER` | 0 | 0 |
| `canonical_true_age_days` | `INTEGER` | 0 | 0 |
| `effective_true_age_days` | `INTEGER` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `canonical_group_size` | `INTEGER` | 1 | 0 |
| `canonical_portal_count` | `INTEGER` | 1 | 0 |
| `canonical_schema_count` | `INTEGER` | 1 | 0 |
| `canonical_city_count` | `INTEGER` | 1 | 0 |
| `canonical_community_count` | `INTEGER` | 1 | 0 |
| `canonical_building_count` | `INTEGER` | 1 | 0 |
| `canonical_property_type_count` | `INTEGER` | 1 | 0 |
| `canonical_bedroom_count` | `INTEGER` | 1 | 0 |
| `canonical_size_count` | `INTEGER` | 1 | 0 |
| `is_safe_canonical_group` | `INTEGER` | 1 | 0 |
| `is_risky_canonical_group` | `INTEGER` | 1 | 0 |
| `is_fresh` | `INTEGER` | 1 | 0 |
| `is_warm` | `INTEGER` | 1 | 0 |
| `is_stale_listing` | `INTEGER` | 1 | 0 |
| `is_old_inventory` | `INTEGER` | 1 | 0 |
| `is_very_old_inventory` | `INTEGER` | 1 | 0 |
| `is_refresh_inflated` | `INTEGER` | 1 | 0 |
| `is_severe_refresh_inflation` | `INTEGER` | 1 | 0 |
| `is_cross_portal_age_confirmed` | `INTEGER` | 1 | 0 |
| `is_possible_repost_signal` | `INTEGER` | 1 | 0 |
| `is_price_drop_overlap` | `INTEGER` | 1 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INTEGER` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `is_owner_direct_overlap` | `INTEGER` | 1 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `compound_badges` | `TEXT` | 1 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INTEGER` | 1 | 0 |
| `is_commercial_lead` | `INTEGER` | 1 | 0 |
| `is_short_rental_lead` | `INTEGER` | 1 | 0 |
| `is_sale_lead` | `INTEGER` | 1 | 0 |
| `is_rent_lead` | `INTEGER` | 1 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INTEGER` | 0 | 0 |
| `bathrooms` | `INTEGER` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INTEGER` | 0 | 0 |
| `has_whatsapp_available` | `INTEGER` | 0 | 0 |
| `has_email_available` | `INTEGER` | 0 | 0 |
| `recommended_action` | `TEXT` | 1 | 0 |
| `portal_action_label` | `TEXT` | 1 | 0 |
| `built_at` | `TEXT` | 1 | 0 |

#### `recon_dashboard_refresh_inflated`

Rows: `150000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_listing_truth`

Rows: `200000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_hub_opportunities`

Rows: `1519685`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `recon_id` | `INTEGER` | 0 | 1 |
| `listing_key` | `TEXT` | 1 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 1 | 0 |
| `schema_name` | `TEXT` | 1 | 0 |
| `portal_id` | `TEXT` | 1 | 0 |
| `primary_opportunity_type` | `TEXT` | 1 | 0 |
| `opportunity_group` | `TEXT` | 1 | 0 |
| `opportunity_title` | `TEXT` | 1 | 0 |
| `recon_score` | `INTEGER` | 1 | 0 |
| `recon_rank` | `INTEGER` | 0 | 0 |
| `confidence_tier` | `TEXT` | 1 | 0 |
| `confidence_reason` | `TEXT` | 1 | 0 |
| `priority_label` | `TEXT` | 1 | 0 |
| `is_owner_direct` | `INTEGER` | 1 | 0 |
| `is_price_drop` | `INTEGER` | 1 | 0 |
| `is_stale` | `INTEGER` | 1 | 0 |
| `is_old_inventory` | `INTEGER` | 1 | 0 |
| `is_very_old_inventory` | `INTEGER` | 1 | 0 |
| `is_refresh_inflated` | `INTEGER` | 1 | 0 |
| `is_severe_refresh_inflation` | `INTEGER` | 1 | 0 |
| `is_cross_portal_age_confirmed` | `INTEGER` | 1 | 0 |
| `is_possible_repost_signal` | `INTEGER` | 1 | 0 |
| `is_owner_direct_price_drop` | `INTEGER` | 1 | 0 |
| `is_owner_direct_stale` | `INTEGER` | 1 | 0 |
| `is_stale_price_drop` | `INTEGER` | 1 | 0 |
| `is_refresh_inflated_price_drop` | `INTEGER` | 1 | 0 |
| `is_owner_direct_refresh_inflated` | `INTEGER` | 1 | 0 |
| `is_cross_portal_old_signal` | `INTEGER` | 1 | 0 |
| `badges_json` | `TEXT` | 1 | 0 |
| `recommended_action` | `TEXT` | 1 | 0 |
| `portal_action_label` | `TEXT` | 1 | 0 |
| `action_priority` | `TEXT` | 1 | 0 |
| `cta_text` | `TEXT` | 1 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INTEGER` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INTEGER` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INTEGER` | 0 | 0 |
| `portal_age_days` | `INTEGER` | 0 | 0 |
| `displayed_age_days` | `INTEGER` | 0 | 0 |
| `canonical_true_age_days` | `INTEGER` | 0 | 0 |
| `effective_true_age_days` | `INTEGER` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INTEGER` | 1 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INTEGER` | 1 | 0 |
| `is_commercial_lead` | `INTEGER` | 1 | 0 |
| `is_short_rental_lead` | `INTEGER` | 1 | 0 |
| `is_sale_lead` | `INTEGER` | 1 | 0 |
| `is_rent_lead` | `INTEGER` | 1 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INTEGER` | 0 | 0 |
| `bathrooms` | `INTEGER` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INTEGER` | 0 | 0 |
| `has_whatsapp_available` | `INTEGER` | 0 | 0 |
| `has_email_available` | `INTEGER` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 1 | 0 |

#### `recon_dashboard_hot_leads`

Rows: `43368`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_price_drops`

Rows: `18822`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_owner_direct`

Rows: `36336`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_stale_price_drops`

Rows: `12794`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_refresh_inflated`

Rows: `150000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_listing_truth`

Rows: `200000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_residential_rent`

Rows: `150000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_residential_buy`

Rows: `150000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_commercial`

Rows: `117361`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_short_rental`

Rows: `38098`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `recon_id` | `INT` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `portal` | `TEXT` | 0 | 0 |
| `schema_name` | `TEXT` | 0 | 0 |
| `portal_id` | `TEXT` | 0 | 0 |
| `primary_opportunity_type` | `TEXT` | 0 | 0 |
| `opportunity_group` | `TEXT` | 0 | 0 |
| `opportunity_title` | `TEXT` | 0 | 0 |
| `recon_score` | `INT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `confidence_tier` | `TEXT` | 0 | 0 |
| `confidence_reason` | `TEXT` | 0 | 0 |
| `priority_label` | `TEXT` | 0 | 0 |
| `is_owner_direct` | `INT` | 0 | 0 |
| `is_price_drop` | `INT` | 0 | 0 |
| `is_stale` | `INT` | 0 | 0 |
| `is_old_inventory` | `INT` | 0 | 0 |
| `is_very_old_inventory` | `INT` | 0 | 0 |
| `is_refresh_inflated` | `INT` | 0 | 0 |
| `is_severe_refresh_inflation` | `INT` | 0 | 0 |
| `is_cross_portal_age_confirmed` | `INT` | 0 | 0 |
| `is_possible_repost_signal` | `INT` | 0 | 0 |
| `is_owner_direct_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_stale` | `INT` | 0 | 0 |
| `is_stale_price_drop` | `INT` | 0 | 0 |
| `is_refresh_inflated_price_drop` | `INT` | 0 | 0 |
| `is_owner_direct_refresh_inflated` | `INT` | 0 | 0 |
| `is_cross_portal_old_signal` | `INT` | 0 | 0 |
| `badges_json` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `portal_action_label` | `TEXT` | 0 | 0 |
| `action_priority` | `TEXT` | 0 | 0 |
| `cta_text` | `TEXT` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `owner_direct_label` | `TEXT` | 0 | 0 |
| `owner_direct_confidence_tier` | `TEXT` | 0 | 0 |
| `owner_direct_score` | `INT` | 0 | 0 |
| `price_drop_strength_label` | `TEXT` | 0 | 0 |
| `price_drop_score` | `INT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `drop_amount` | `REAL` | 0 | 0 |
| `drop_pct` | `REAL` | 0 | 0 |
| `age_confidence_tier` | `TEXT` | 0 | 0 |
| `age_label` | `TEXT` | 0 | 0 |
| `refresh_inflation_label` | `TEXT` | 0 | 0 |
| `age_signal_score` | `INT` | 0 | 0 |
| `portal_age_days` | `INT` | 0 | 0 |
| `displayed_age_days` | `INT` | 0 | 0 |
| `canonical_true_age_days` | `INT` | 0 | 0 |
| `effective_true_age_days` | `INT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `has_invalid_date_evidence` | `INT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `price_frequency` | `TEXT` | 0 | 0 |
| `is_residential_lead` | `INT` | 0 | 0 |
| `is_commercial_lead` | `INT` | 0 | 0 |
| `is_short_rental_lead` | `INT` | 0 | 0 |
| `is_sale_lead` | `INT` | 0 | 0 |
| `is_rent_lead` | `INT` | 0 | 0 |
| `title` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `bedrooms` | `INT` | 0 | 0 |
| `bathrooms` | `INT` | 0 | 0 |
| `size_sqft` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `community` | `TEXT` | 0 | 0 |
| `building_name` | `TEXT` | 0 | 0 |
| `property_url` | `TEXT` | 0 | 0 |
| `price` | `REAL` | 0 | 0 |
| `price_per_sqft` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `contact_phone` | `TEXT` | 0 | 0 |
| `contact_whatsapp` | `TEXT` | 0 | 0 |
| `contact_email` | `TEXT` | 0 | 0 |
| `has_phone_available` | `INT` | 0 | 0 |
| `has_whatsapp_available` | `INT` | 0 | 0 |
| `has_email_available` | `INT` | 0 | 0 |
| `listing_created_at` | `TEXT` | 0 | 0 |
| `listing_updated_at` | `TEXT` | 0 | 0 |
| `listing_scraped_at` | `TEXT` | 0 | 0 |
| `built_at` | `TEXT` | 0 | 0 |

#### `recon_dashboard_summary`

Rows: `31`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `metric_group` | `TEXT` | 1 | 0 |
| `metric_name` | `TEXT` | 1 | 0 |
| `metric_value` | `REAL` | 0 | 0 |
| `metric_text` | `TEXT` | 0 | 0 |
| `created_at` | `TEXT` | 1 | 0 |

#### `module5_dashboard_summary`

Rows: `17`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `metric_key` | `` | 0 | 0 |
| `metric_value` | `` | 0 | 0 |
| `built_at` | `` | 0 | 0 |

#### `module5_dashboard_market_dominance`

Rows: `5000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `dashboard_level` | `` | 0 | 0 |
| `rank_value` | `` | 0 | 0 |
| `market_key` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `community` | `` | 0 | 0 |
| `building_name` | `` | 0 | 0 |
| `source_category` | `` | 0 | 0 |
| `total_listings` | `` | 0 | 0 |
| `total_agencies` | `` | 0 | 0 |
| `total_agents` | `` | 0 | 0 |
| `total_portals` | `` | 0 | 0 |
| `building_count` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `avg_price_per_sqft` | `` | 0 | 0 |
| `top_agency_name` | `` | 0 | 0 |
| `top_agency_listings` | `` | 0 | 0 |
| `top_agency_share_pct` | `` | 0 | 0 |
| `second_agency_name` | `` | 0 | 0 |
| `second_agency_share_pct` | `` | 0 | 0 |
| `third_agency_name` | `` | 0 | 0 |
| `third_agency_share_pct` | `` | 0 | 0 |
| `top3_agency_share_pct` | `` | 0 | 0 |
| `concentration_label` | `` | 0 | 0 |
| `dominance_score` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `top_agencies_summary` | `` | 0 | 0 |
| `dashboard_card_type` | `` | 0 | 0 |
| `explanation` | `` | 0 | 0 |
| `recommended_use` | `` | 0 | 0 |
| `built_at` | `` | 0 | 0 |

#### `module5_dashboard_inventory_pressure`

Rows: `5000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `dashboard_level` | `` | 0 | 0 |
| `rank_value` | `` | 0 | 0 |
| `market_key` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `community` | `` | 0 | 0 |
| `building_name` | `` | 0 | 0 |
| `source_category` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `agencies` | `` | 0 | 0 |
| `agents` | `` | 0 | 0 |
| `building_count` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `avg_price_per_sqft` | `` | 0 | 0 |
| `recon_signal_rows` | `` | 0 | 0 |
| `price_drop_count` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `stale_price_drop_count` | `` | 0 | 0 |
| `stale_price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_inflated_count` | `` | 0 | 0 |
| `refresh_inflated_rate_pct` | `` | 0 | 0 |
| `severe_refresh_count` | `` | 0 | 0 |
| `severe_refresh_rate_pct` | `` | 0 | 0 |
| `owner_direct_count` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `stale_count` | `` | 0 | 0 |
| `stale_rate_pct` | `` | 0 | 0 |
| `old_inventory_count` | `` | 0 | 0 |
| `old_inventory_rate_pct` | `` | 0 | 0 |
| `very_old_inventory_count` | `` | 0 | 0 |
| `very_old_inventory_rate_pct` | `` | 0 | 0 |
| `avg_recon_score` | `` | 0 | 0 |
| `avg_drop_amount` | `` | 0 | 0 |
| `avg_drop_pct` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_label` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `has_price_pressure` | `` | 0 | 0 |
| `has_stale_price_pressure` | `` | 0 | 0 |
| `has_refresh_pressure` | `` | 0 | 0 |
| `has_owner_direct_pressure` | `` | 0 | 0 |
| `recommended_action` | `` | 0 | 0 |
| `dashboard_card_type` | `` | 0 | 0 |
| `built_at` | `` | 0 | 0 |

#### `module5_dashboard_agency_profiles`

Rows: `4624`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `agency_rank` | `` | 0 | 0 |
| `agency_public_key` | `` | 0 | 0 |
| `agency_name` | `` | 0 | 0 |
| `agency_name_variant_count` | `` | 0 | 0 |
| `agency_id_count` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `distinct_listing_keys` | `` | 0 | 0 |
| `active_agents` | `` | 0 | 0 |
| `portals` | `` | 0 | 0 |
| `source_categories` | `` | 0 | 0 |
| `cities` | `` | 0 | 0 |
| `communities` | `` | 0 | 0 |
| `buildings` | `` | 0 | 0 |
| `property_types` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `avg_price_per_sqft` | `` | 0 | 0 |
| `residential_rent_listings` | `` | 0 | 0 |
| `residential_buy_listings` | `` | 0 | 0 |
| `commercial_rent_listings` | `` | 0 | 0 |
| `commercial_buy_listings` | `` | 0 | 0 |
| `land_buy_listings` | `` | 0 | 0 |
| `short_rental_listings` | `` | 0 | 0 |
| `residential_rent_share_pct` | `` | 0 | 0 |
| `residential_buy_share_pct` | `` | 0 | 0 |
| `commercial_rent_share_pct` | `` | 0 | 0 |
| `commercial_buy_share_pct` | `` | 0 | 0 |
| `land_buy_share_pct` | `` | 0 | 0 |
| `short_rental_share_pct` | `` | 0 | 0 |
| `bayut_listings` | `` | 0 | 0 |
| `dubizzle_listings` | `` | 0 | 0 |
| `propertyfinder_listings` | `` | 0 | 0 |
| `bayut_share_pct` | `` | 0 | 0 |
| `dubizzle_share_pct` | `` | 0 | 0 |
| `propertyfinder_share_pct` | `` | 0 | 0 |
| `top_city` | `` | 0 | 0 |
| `top_community` | `` | 0 | 0 |
| `top_community_listings` | `` | 0 | 0 |
| `top_community_share_pct` | `` | 0 | 0 |
| `top_building_city` | `` | 0 | 0 |
| `top_building_community` | `` | 0 | 0 |
| `top_building_name` | `` | 0 | 0 |
| `top_building_listings` | `` | 0 | 0 |
| `top_building_share_pct` | `` | 0 | 0 |
| `recon_signal_rows` | `` | 0 | 0 |
| `price_drop_count` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `stale_price_drop_count` | `` | 0 | 0 |
| `stale_price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_inflated_count` | `` | 0 | 0 |
| `refresh_inflated_rate_pct` | `` | 0 | 0 |
| `owner_direct_count` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `old_inventory_count` | `` | 0 | 0 |
| `old_inventory_rate_pct` | `` | 0 | 0 |
| `avg_recon_score` | `` | 0 | 0 |
| `avg_drop_amount` | `` | 0 | 0 |
| `avg_drop_pct` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `portfolio_type_label` | `` | 0 | 0 |
| `inventory_status_label` | `` | 0 | 0 |
| `footprint_score` | `` | 0 | 0 |
| `portfolio_pressure_score` | `` | 0 | 0 |
| `portfolio_pressure_label` | `` | 0 | 0 |
| `recommended_interpretation` | `` | 0 | 0 |
| `dashboard_card_type` | `` | 0 | 0 |
| `explanation` | `` | 0 | 0 |
| `built_at` | `` | 0 | 0 |

#### `module5_dashboard_activity_feed`

Rows: `5000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `activity_rank` | `` | 0 | 0 |
| `activity_type` | `` | 0 | 0 |
| `activity_label` | `` | 0 | 0 |
| `activity_date` | `` | 0 | 0 |
| `activity_at` | `` | 0 | 0 |
| `listing_key` | `` | 0 | 0 |
| `portal` | `` | 0 | 0 |
| `source_category` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `community` | `` | 0 | 0 |
| `building_name` | `` | 0 | 0 |
| `agency_name` | `` | 0 | 0 |
| `agency_id` | `` | 0 | 0 |
| `agent_name` | `` | 0 | 0 |
| `agent_id` | `` | 0 | 0 |
| `property_type` | `` | 0 | 0 |
| `bedrooms` | `` | 0 | 0 |
| `size_sqft` | `` | 0 | 0 |
| `price` | `` | 0 | 0 |
| `price_per_sqft` | `` | 0 | 0 |
| `old_price` | `` | 0 | 0 |
| `new_price` | `` | 0 | 0 |
| `drop_amount` | `` | 0 | 0 |
| `drop_pct` | `` | 0 | 0 |
| `property_url` | `` | 0 | 0 |
| `activity_score` | `` | 0 | 0 |
| `activity_priority_label` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `activity_summary` | `` | 0 | 0 |
| `recommended_action` | `` | 0 | 0 |
| `cta_label` | `` | 0 | 0 |
| `activity_bucket` | `` | 0 | 0 |
| `bucket_rank` | `` | 0 | 0 |
| `bucket_limit` | `` | 0 | 0 |
| `built_at` | `` | 0 | 0 |

#### `module5_dashboard_very_active_markets`

Rows: `1226`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `summary_rank` | `` | 0 | 0 |
| `source_category` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `community` | `` | 0 | 0 |
| `activity_count` | `` | 0 | 0 |
| `critical_count` | `` | 0 | 0 |
| `high_count` | `` | 0 | 0 |
| `recent_price_drop_count` | `` | 0 | 0 |
| `newly_detected_count` | `` | 0 | 0 |
| `recon_opportunity_count` | `` | 0 | 0 |
| `pressure_signal_count` | `` | 0 | 0 |
| `dominance_signal_count` | `` | 0 | 0 |
| `agency_signal_count` | `` | 0 | 0 |
| `avg_activity_score` | `` | 0 | 0 |
| `max_activity_score` | `` | 0 | 0 |
| `activity_summary_label` | `` | 0 | 0 |
| `recommended_action` | `` | 0 | 0 |
| `dashboard_card_type` | `` | 0 | 0 |
| `explanation` | `` | 0 | 0 |
| `built_at` | `` | 0 | 0 |

#### `module5_dashboard_building_intelligence`

Rows: `5000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `community` | `` | 0 | 0 |
| `building_name` | `` | 0 | 0 |
| `source_category` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `agencies` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `avg_price_per_sqft` | `` | 0 | 0 |
| `top_agency_name` | `` | 0 | 0 |
| `top_agency_share_pct` | `` | 0 | 0 |
| `top3_agency_share_pct` | `` | 0 | 0 |
| `concentration_label` | `` | 0 | 0 |
| `dominance_score` | `` | 0 | 0 |
| `top_agencies_summary` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_label` | `` | 0 | 0 |
| `price_drop_count` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `stale_price_drop_count` | `` | 0 | 0 |
| `stale_price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_inflated_count` | `` | 0 | 0 |
| `refresh_inflated_rate_pct` | `` | 0 | 0 |
| `owner_direct_count` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `intelligence_label` | `` | 0 | 0 |
| `recommended_action` | `` | 0 | 0 |
| `dashboard_card_type` | `` | 0 | 0 |
| `built_at` | `` | 0 | 0 |

#### `module5_dashboard_community_intelligence`

Rows: `4542`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `community` | `` | 0 | 0 |
| `source_category` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `agencies` | `` | 0 | 0 |
| `buildings` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `avg_price_per_sqft` | `` | 0 | 0 |
| `top_agency_name` | `` | 0 | 0 |
| `top_agency_share_pct` | `` | 0 | 0 |
| `top3_agency_share_pct` | `` | 0 | 0 |
| `concentration_label` | `` | 0 | 0 |
| `dominance_score` | `` | 0 | 0 |
| `top_agencies_summary` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_label` | `` | 0 | 0 |
| `price_drop_count` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `stale_price_drop_count` | `` | 0 | 0 |
| `stale_price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_inflated_count` | `` | 0 | 0 |
| `refresh_inflated_rate_pct` | `` | 0 | 0 |
| `owner_direct_count` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `activity_count` | `` | 0 | 0 |
| `critical_count` | `` | 0 | 0 |
| `high_count` | `` | 0 | 0 |
| `avg_activity_score` | `` | 0 | 0 |
| `max_activity_score` | `` | 0 | 0 |
| `activity_summary_label` | `` | 0 | 0 |
| `intelligence_label` | `` | 0 | 0 |
| `recommended_action` | `` | 0 | 0 |
| `dashboard_card_type` | `` | 0 | 0 |
| `built_at` | `` | 0 | 0 |

---

## KSA

Currency: `SAR`

Database path: `C:\Users\User\Documents\malesh\KSA\intelligence\ksa_intelligence.db`

Database exists: `True`

### Product/dashboard candidate tables

| Table | Exists | Rows | Columns |
|---|---:|---:|---:|
| `ksa_active_listings_unified` | True | 288978 | 45 |
| `ksa_owner_direct_candidates` | True | 22375 | 71 |
| `ksa_price_drop_candidates` | True | 251 | 61 |
| `ksa_module5_dashboard_activity_price_movements` | True | 251 | 60 |
| `ksa_listing_age_state` | True | 288978 | 65 |
| `ksa_refresh_inflation_candidates` | True | 19500 | 86 |
| `ksa_listing_age_summary` | True | 191 | 8 |
| `ksa_refresh_inflation_summary` | True | 174 | 8 |
| `ksa_recon_dashboard_refresh_inflation` | True | 18359 | 77 |
| `ksa_recon_hub_opportunities` | True | 39828 | 76 |
| `ksa_recon_dashboard_hot_leads` | True | 167 | 77 |
| `ksa_recon_dashboard_multi_signal` | True | 2249 | 77 |
| `ksa_recon_dashboard_owner_direct` | True | 7047 | 77 |
| `ksa_recon_dashboard_price_drops` | True | 84 | 77 |
| `ksa_recon_dashboard_refresh_inflation` | True | 18359 | 77 |
| `ksa_recon_dashboard_contactable` | True | 9151 | 77 |
| `ksa_recon_dashboard_url_only` | True | 17676 | 77 |
| `ksa_recon_dashboard_residential_rent` | True | 4864 | 77 |
| `ksa_recon_dashboard_residential_buy` | True | 20391 | 77 |
| `ksa_recon_dashboard_commercial` | True | 1572 | 77 |
| `ksa_recon_dashboard_summary` | True | 37 | 8 |
| `ksa_module5_dashboard_city_intelligence` | True | 75 | 31 |
| `ksa_module5_dashboard_city_intelligence_major` | True | 10 | 31 |
| `ksa_module5_dashboard_city_intelligence_small` | True | 65 | 31 |
| `ksa_module5_dashboard_city_pressure_signals` | True | 18 | 31 |
| `ksa_module5_dashboard_district_intelligence` | True | 1279 | 39 |
| `ksa_module5_dashboard_market_dominance_large_markets` | True | 406 | 39 |
| `ksa_module5_dashboard_market_dominance_small_markets` | True | 873 | 39 |
| `ksa_module5_dashboard_inventory_pressure_large_markets` | True | 406 | 39 |
| `ksa_module5_dashboard_inventory_pressure_small_markets` | True | 873 | 39 |
| `ksa_module5_dashboard_agency_profiles_major` | True | 1292 | 64 |
| `ksa_module5_dashboard_agency_profiles_micro` | True | 2515 | 64 |
| `ksa_module5_dashboard_agency_city_profiles` | True | 1358 | 45 |
| `ksa_module5_dashboard_agency_district_profiles` | True | 3724 | 47 |
| `ksa_module5_dashboard_activity_priority` | True | 947 | 61 |
| `ksa_module5_dashboard_activity_recon` | True | 5000 | 60 |
| `ksa_module5_dashboard_activity_recently_detected` | True | 5000 | 60 |
| `ksa_module5_dashboard_activity_pressure` | True | 243 | 60 |
| `ksa_module5_dashboard_activity_dominance` | True | 178 | 60 |
| `ksa_module5_dashboard_activity_agency` | True | 568 | 60 |
| `ksa_module5_dashboard_city_alias_audit` | True | 75 | 13 |
| `ksa_module5_dashboard_district_alias_audit` | True | 1279 | 19 |
| `ksa_module5_dashboard_summary` | True | 37 | 8 |

### Raw/internal tables that must not be exposed directly

| Table | Exists | Rows | Reason |
|---|---:|---:|---|
| `ksa_listing_price_events` | True | 289501 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_listing_price_state` | True | 288830 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_price_history_runs` | True | 2 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_suspicious_price_drop_events` | True | 46 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_market_dominance_city` | True | 79 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_market_dominance_district` | True | 1309 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_inventory_pressure_city` | True | 79 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_inventory_pressure_district` | True | 1309 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_agency_inventory_profile` | True | 3807 | Raw/internal/evidence table. Do not expose directly to paid users. |
| `ksa_market_activity_feed` | True | 11240 | Raw/internal/evidence table. Do not expose directly to paid users. |

### Existing table schemas

#### `ksa_active_listings_unified`

Rows: `288978`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 1 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `canonical_listing_count` | `INTEGER` | 0 | 0 |
| `canonical_portal_count` | `INTEGER` | 0 | 0 |
| `canonical_portals_present` | `TEXT` | 0 | 0 |
| `dedup_match_method` | `TEXT` | 0 | 0 |
| `dedup_match_confidence` | `REAL` | 0 | 0 |
| `dedup_is_singleton` | `INTEGER` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `raw_hash_id` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `min_canonical_price` | `REAL` | 0 | 0 |
| `max_canonical_price` | `REAL` | 0 | 0 |
| `canonical_price_spread` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `plot_area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `image_count` | `INTEGER` | 0 | 0 |
| `quality_flags` | `TEXT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `normalized_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 1 | 0 |

#### `ksa_owner_direct_candidates`

Rows: `22375`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `owner_direct_score` | `REAL` | 1 | 0 |
| `owner_direct_bucket` | `TEXT` | 1 | 0 |
| `direct_confidence_class` | `TEXT` | 1 | 0 |
| `lead_channel_class` | `TEXT` | 1 | 0 |
| `owner_direct_reason` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 1 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `email` | `TEXT` | 0 | 0 |
| `original_phone` | `TEXT` | 0 | 0 |
| `original_whatsapp` | `TEXT` | 0 | 0 |
| `enriched_phone` | `TEXT` | 0 | 0 |
| `enriched_whatsapp` | `TEXT` | 0 | 0 |
| `enriched_email` | `TEXT` | 0 | 0 |
| `enrichment_used` | `INTEGER` | 0 | 0 |
| `enrichment_source` | `TEXT` | 0 | 0 |
| `enrichment_approval_status` | `TEXT` | 0 | 0 |
| `enrichment_confidence` | `REAL` | 0 | 0 |
| `enrichment_evidence_type` | `TEXT` | 0 | 0 |
| `enrichment_action` | `TEXT` | 0 | 0 |
| `has_phone` | `INTEGER` | 0 | 0 |
| `has_whatsapp` | `INTEGER` | 0 | 0 |
| `has_email` | `INTEGER` | 0 | 0 |
| `has_any_contact` | `INTEGER` | 0 | 0 |
| `url_lead_only` | `INTEGER` | 0 | 0 |
| `email_lead_only` | `INTEGER` | 0 | 0 |
| `phone_frequency` | `INTEGER` | 0 | 0 |
| `whatsapp_frequency` | `INTEGER` | 0 | 0 |
| `email_frequency` | `INTEGER` | 0 | 0 |
| `agent_inventory_count` | `INTEGER` | 0 | 0 |
| `owner_inventory_count` | `INTEGER` | 0 | 0 |
| `agency_missing` | `INTEGER` | 0 | 0 |
| `agency_id_missing` | `INTEGER` | 0 | 0 |
| `agent_id_missing` | `INTEGER` | 0 | 0 |
| `owner_agent_same` | `INTEGER` | 0 | 0 |
| `name_looks_agency` | `INTEGER` | 0 | 0 |
| `name_looks_generic` | `INTEGER` | 0 | 0 |
| `phone_masked` | `INTEGER` | 0 | 0 |
| `high_inventory_contact` | `INTEGER` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `dedup_is_singleton` | `INTEGER` | 0 | 0 |
| `canonical_listing_count` | `INTEGER` | 0 | 0 |
| `canonical_portal_count` | `INTEGER` | 0 | 0 |

#### `ksa_price_drop_candidates`

Rows: `251`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `price_drop_rank` | `INTEGER` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `urgency_bucket` | `TEXT` | 0 | 0 |
| `drop_strength_bucket` | `TEXT` | 0 | 0 |
| `quality_bucket` | `TEXT` | 1 | 0 |
| `quality_reason` | `TEXT` | 0 | 0 |
| `event_id` | `INTEGER` | 1 | 0 |
| `listing_key` | `TEXT` | 1 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `old_price_per_sqm` | `REAL` | 0 | 0 |
| `new_price_per_sqm` | `REAL` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `old_to_new_label` | `TEXT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `source_updated_at` | `TEXT` | 0 | 0 |
| `detected_at` | `TEXT` | 0 | 0 |
| `days_since_listed` | `REAL` | 0 | 0 |
| `days_since_source_update` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INTEGER` | 0 | 0 |
| `has_whatsapp` | `INTEGER` | 0 | 0 |
| `has_any_direct_contact` | `INTEGER` | 0 | 0 |
| `contact_via_url` | `INTEGER` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_direct_reason` | `TEXT` | 0 | 0 |
| `source_priority` | `TEXT` | 0 | 0 |
| `product_lane` | `TEXT` | 0 | 0 |
| `raw_event_json` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_activity_price_movements`

Rows: `251`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `activity_rank` | `INT` | 0 | 0 |
| `activity_score` | `REAL` | 0 | 0 |
| `activity_bucket` | `TEXT` | 0 | 0 |
| `card_type` | `TEXT` | 0 | 0 |
| `card_subtype` | `TEXT` | 0 | 0 |
| `card_title` | `TEXT` | 0 | 0 |
| `card_summary` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `evidence_date` | `TEXT` | 0 | 0 |
| `evidence_recency_days` | `REAL` | 0 | 0 |
| `source_table` | `TEXT` | 0 | 0 |
| `source_record_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `district_key` | `TEXT` | 0 | 0 |
| `market_key` | `TEXT` | 0 | 0 |
| `raw_city` | `TEXT` | 0 | 0 |
| `city_display_name` | `TEXT` | 0 | 0 |
| `city_canonical_key` | `TEXT` | 0 | 0 |
| `raw_district` | `TEXT` | 0 | 0 |
| `district_display_name` | `TEXT` | 0 | 0 |
| `district_canonical_key` | `TEXT` | 0 | 0 |
| `canonical_market_key` | `TEXT` | 0 | 0 |
| `location_alias_note` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_change_amount` | `REAL` | 0 | 0 |
| `price_change_pct` | `REAL` | 0 | 0 |
| `price_direction` | `TEXT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `pressure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `dominance_share_pct` | `REAL` | 0 | 0 |
| `concentration_bucket` | `TEXT` | 0 | 0 |
| `contactable` | `INT` | 0 | 0 |
| `url_only` | `INT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_listing_age_state`

Rows: `288978`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `listing_key` | `TEXT` | 1 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `observed_first_seen_at` | `TEXT` | 0 | 0 |
| `observed_last_seen_at` | `TEXT` | 0 | 0 |
| `portal_declared_age_days` | `REAL` | 0 | 0 |
| `observed_system_age_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `observed_seen_span_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `true_age_basis` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `age_bucket` | `TEXT` | 0 | 0 |
| `refresh_activity_bucket` | `TEXT` | 0 | 0 |
| `observation_confidence` | `TEXT` | 0 | 0 |
| `times_seen` | `INTEGER` | 0 | 0 |
| `price_change_count` | `INTEGER` | 0 | 0 |
| `price_drop_count` | `INTEGER` | 0 | 0 |
| `price_increase_count` | `INTEGER` | 0 | 0 |
| `current_price` | `REAL` | 0 | 0 |
| `first_price` | `REAL` | 0 | 0 |
| `stale_by_portal_age` | `INTEGER` | 0 | 0 |
| `stale_by_observed_age` | `INTEGER` | 0 | 0 |
| `recently_updated` | `INTEGER` | 0 | 0 |
| `very_recently_updated` | `INTEGER` | 0 | 0 |
| `repeated_observation` | `INTEGER` | 0 | 0 |
| `price_unchanged_since_first_seen` | `INTEGER` | 0 | 0 |
| `preliminary_refresh_score` | `REAL` | 0 | 0 |
| `preliminary_refresh_bucket` | `TEXT` | 0 | 0 |
| `preliminary_refresh_reason` | `TEXT` | 0 | 0 |
| `canonical_listing_count` | `INTEGER` | 0 | 0 |
| `canonical_portal_count` | `INTEGER` | 0 | 0 |
| `canonical_portals_present` | `TEXT` | 0 | 0 |
| `dedup_is_singleton` | `INTEGER` | 0 | 0 |

#### `ksa_refresh_inflation_candidates`

Rows: `19500`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `refresh_rank` | `INTEGER` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `urgency_bucket` | `TEXT` | 0 | 0 |
| `product_lane` | `TEXT` | 0 | 0 |
| `evidence_class` | `TEXT` | 0 | 0 |
| `evidence_reason` | `TEXT` | 0 | 0 |
| `listing_key` | `TEXT` | 1 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INTEGER` | 0 | 0 |
| `has_whatsapp` | `INTEGER` | 0 | 0 |
| `has_any_direct_contact` | `INTEGER` | 0 | 0 |
| `contact_via_url` | `INTEGER` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `observed_first_seen_at` | `TEXT` | 0 | 0 |
| `observed_last_seen_at` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `true_age_basis` | `TEXT` | 0 | 0 |
| `age_bucket` | `TEXT` | 0 | 0 |
| `portal_declared_age_days` | `REAL` | 0 | 0 |
| `observed_system_age_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `observed_seen_span_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `refresh_activity_bucket` | `TEXT` | 0 | 0 |
| `observation_confidence` | `TEXT` | 0 | 0 |
| `preliminary_refresh_score` | `REAL` | 0 | 0 |
| `preliminary_refresh_bucket` | `TEXT` | 0 | 0 |
| `preliminary_refresh_reason` | `TEXT` | 0 | 0 |
| `times_seen` | `INTEGER` | 0 | 0 |
| `repeated_observation` | `INTEGER` | 0 | 0 |
| `price_change_count` | `INTEGER` | 0 | 0 |
| `price_drop_count` | `INTEGER` | 0 | 0 |
| `price_increase_count` | `INTEGER` | 0 | 0 |
| `price_unchanged_since_first_seen` | `INTEGER` | 0 | 0 |
| `first_price` | `REAL` | 0 | 0 |
| `current_price` | `REAL` | 0 | 0 |
| `stale_by_portal_age` | `INTEGER` | 0 | 0 |
| `stale_by_observed_age` | `INTEGER` | 0 | 0 |
| `recently_updated` | `INTEGER` | 0 | 0 |
| `very_recently_updated` | `INTEGER` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_strength_bucket` | `TEXT` | 0 | 0 |
| `canonical_listing_count` | `INTEGER` | 0 | 0 |
| `canonical_portal_count` | `INTEGER` | 0 | 0 |
| `canonical_portals_present` | `TEXT` | 0 | 0 |
| `dedup_is_singleton` | `INTEGER` | 0 | 0 |
| `source_priority` | `TEXT` | 0 | 0 |
| `raw_age_json` | `TEXT` | 0 | 0 |

#### `ksa_listing_age_summary`

Rows: `191`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `metric_scope` | `TEXT` | 1 | 0 |
| `metric_key` | `TEXT` | 1 | 0 |
| `rows` | `INTEGER` | 0 | 0 |
| `metric_value` | `TEXT` | 0 | 0 |
| `extra_json` | `TEXT` | 0 | 0 |

#### `ksa_refresh_inflation_summary`

Rows: `174`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `metric_scope` | `TEXT` | 1 | 0 |
| `metric_key` | `TEXT` | 1 | 0 |
| `rows` | `INTEGER` | 0 | 0 |
| `metric_value` | `TEXT` | 0 | 0 |
| `extra_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_refresh_inflation`

Rows: `18359`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_hub_opportunities`

Rows: `39828`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `recon_rank` | `INTEGER` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INTEGER` | 0 | 0 |
| `has_owner_direct_signal` | `INTEGER` | 0 | 0 |
| `has_price_drop_signal` | `INTEGER` | 0 | 0 |
| `has_refresh_signal` | `INTEGER` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 1 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INTEGER` | 0 | 0 |
| `has_whatsapp` | `INTEGER` | 0 | 0 |
| `has_any_direct_contact` | `INTEGER` | 0 | 0 |
| `contact_via_url` | `INTEGER` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INTEGER` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_hot_leads`

Rows: `167`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_multi_signal`

Rows: `2249`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_owner_direct`

Rows: `7047`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_price_drops`

Rows: `84`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_refresh_inflation`

Rows: `18359`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_contactable`

Rows: `9151`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_url_only`

Rows: `17676`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_residential_rent`

Rows: `4864`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_residential_buy`

Rows: `20391`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_commercial`

Rows: `1572`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `recon_rank` | `INT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `priority_bucket` | `TEXT` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `has_owner_direct_signal` | `INT` | 0 | 0 |
| `has_price_drop_signal` | `INT` | 0 | 0 |
| `has_refresh_signal` | `INT` | 0 | 0 |
| `owner_score_component` | `REAL` | 0 | 0 |
| `price_drop_score_component` | `REAL` | 0 | 0 |
| `refresh_score_component` | `REAL` | 0 | 0 |
| `overlap_score_component` | `REAL` | 0 | 0 |
| `contact_score_component` | `REAL` | 0 | 0 |
| `freshness_score_component` | `REAL` | 0 | 0 |
| `listing_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `country` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `latitude` | `REAL` | 0 | 0 |
| `longitude` | `REAL` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `bedrooms` | `REAL` | 0 | 0 |
| `bathrooms` | `REAL` | 0 | 0 |
| `area_sqm` | `REAL` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agency_id` | `TEXT` | 0 | 0 |
| `agency_name` | `TEXT` | 0 | 0 |
| `owner_name` | `TEXT` | 0 | 0 |
| `phone` | `TEXT` | 0 | 0 |
| `whatsapp` | `TEXT` | 0 | 0 |
| `has_phone` | `INT` | 0 | 0 |
| `has_whatsapp` | `INT` | 0 | 0 |
| `has_any_direct_contact` | `INT` | 0 | 0 |
| `contact_via_url` | `INT` | 0 | 0 |
| `owner_direct_score` | `REAL` | 0 | 0 |
| `owner_direct_bucket` | `TEXT` | 0 | 0 |
| `direct_confidence_class` | `TEXT` | 0 | 0 |
| `lead_channel_class` | `TEXT` | 0 | 0 |
| `owner_product_lane` | `TEXT` | 0 | 0 |
| `price_drop_score` | `REAL` | 0 | 0 |
| `price_drop_urgency_bucket` | `TEXT` | 0 | 0 |
| `price_drop_product_lane` | `TEXT` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_drop_amount` | `REAL` | 0 | 0 |
| `price_drop_pct` | `REAL` | 0 | 0 |
| `price_drop_detected_at` | `TEXT` | 0 | 0 |
| `refresh_inflation_score` | `REAL` | 0 | 0 |
| `refresh_urgency_bucket` | `TEXT` | 0 | 0 |
| `refresh_product_lane` | `TEXT` | 0 | 0 |
| `refresh_evidence_class` | `TEXT` | 0 | 0 |
| `true_age_days` | `REAL` | 0 | 0 |
| `updated_recency_days` | `REAL` | 0 | 0 |
| `listed_to_updated_gap_days` | `REAL` | 0 | 0 |
| `times_seen` | `INT` | 0 | 0 |
| `listed_at` | `TEXT` | 0 | 0 |
| `updated_at` | `TEXT` | 0 | 0 |
| `unified_built_at` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `opportunity_summary` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_recon_dashboard_summary`

Rows: `37`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `metric_scope` | `TEXT` | 1 | 0 |
| `metric_key` | `TEXT` | 1 | 0 |
| `rows` | `INTEGER` | 0 | 0 |
| `metric_value` | `TEXT` | 0 | 0 |
| `extra_json` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_city_intelligence`

Rows: `75`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `alias_groups` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_districts` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_city_intelligence_major`

Rows: `10`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `alias_groups` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_districts` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_city_intelligence_small`

Rows: `65`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `alias_groups` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_districts` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_city_pressure_signals`

Rows: `18`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `alias_groups` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_districts` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_district_intelligence`

Rows: `1279`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `market_level` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `district` | `` | 0 | 0 |
| `district_canonical_key` | `` | 0 | 0 |
| `market_key` | `` | 0 | 0 |
| `canonical_market_key` | `` | 0 | 0 |
| `raw_district_variants` | `` | 0 | 0 |
| `raw_district_variant_count` | `` | 0 | 0 |
| `raw_market_keys` | `` | 0 | 0 |
| `district_alias_status` | `` | 0 | 0 |
| `district_alias_confidence` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_market_dominance_large_markets`

Rows: `406`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `market_level` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `district` | `` | 0 | 0 |
| `district_canonical_key` | `` | 0 | 0 |
| `market_key` | `` | 0 | 0 |
| `canonical_market_key` | `` | 0 | 0 |
| `raw_district_variants` | `` | 0 | 0 |
| `raw_district_variant_count` | `` | 0 | 0 |
| `raw_market_keys` | `` | 0 | 0 |
| `district_alias_status` | `` | 0 | 0 |
| `district_alias_confidence` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_market_dominance_small_markets`

Rows: `873`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `market_level` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `district` | `` | 0 | 0 |
| `district_canonical_key` | `` | 0 | 0 |
| `market_key` | `` | 0 | 0 |
| `canonical_market_key` | `` | 0 | 0 |
| `raw_district_variants` | `` | 0 | 0 |
| `raw_district_variant_count` | `` | 0 | 0 |
| `raw_market_keys` | `` | 0 | 0 |
| `district_alias_status` | `` | 0 | 0 |
| `district_alias_confidence` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_inventory_pressure_large_markets`

Rows: `406`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `market_level` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `district` | `` | 0 | 0 |
| `district_canonical_key` | `` | 0 | 0 |
| `market_key` | `` | 0 | 0 |
| `canonical_market_key` | `` | 0 | 0 |
| `raw_district_variants` | `` | 0 | 0 |
| `raw_district_variant_count` | `` | 0 | 0 |
| `raw_market_keys` | `` | 0 | 0 |
| `district_alias_status` | `` | 0 | 0 |
| `district_alias_confidence` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_inventory_pressure_small_markets`

Rows: `873`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `market_level` | `` | 0 | 0 |
| `city` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `city_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `district` | `` | 0 | 0 |
| `district_canonical_key` | `` | 0 | 0 |
| `market_key` | `` | 0 | 0 |
| `canonical_market_key` | `` | 0 | 0 |
| `raw_district_variants` | `` | 0 | 0 |
| `raw_district_variant_count` | `` | 0 | 0 |
| `raw_market_keys` | `` | 0 | 0 |
| `district_alias_status` | `` | 0 | 0 |
| `district_alias_confidence` | `` | 0 | 0 |
| `market_size_bucket` | `` | 0 | 0 |
| `confidence_tier` | `` | 0 | 0 |
| `active_listings` | `` | 0 | 0 |
| `unique_agencies` | `` | 0 | 0 |
| `unique_agents` | `` | 0 | 0 |
| `avg_price` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `top_5_agency_share_pct` | `` | 0 | 0 |
| `hhi_agency` | `` | 0 | 0 |
| `concentration_bucket` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `pressure_reason` | `` | 0 | 0 |
| `recon_rate_pct` | `` | 0 | 0 |
| `owner_direct_rate_pct` | `` | 0 | 0 |
| `price_drop_rate_pct` | `` | 0 | 0 |
| `refresh_rate_pct` | `` | 0 | 0 |
| `contactable_rate_pct` | `` | 0 | 0 |
| `pressure_action` | `` | 0 | 0 |
| `interpretation_note` | `` | 0 | 0 |
| `dashboard_use_case` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_agency_profiles_major`

Rows: `1292`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agency_name_variants` | `TEXT` | 0 | 0 |
| `agency_name_variant_count` | `INT` | 0 | 0 |
| `agency_ids_sample` | `TEXT` | 0 | 0 |
| `agency_id_count` | `INT` | 0 | 0 |
| `active_listings` | `INT` | 0 | 0 |
| `portfolio_size_bucket` | `TEXT` | 0 | 0 |
| `unique_agents` | `INT` | 0 | 0 |
| `unique_cities` | `INT` | 0 | 0 |
| `unique_districts` | `INT` | 0 | 0 |
| `unique_portals` | `INT` | 0 | 0 |
| `unique_property_types` | `INT` | 0 | 0 |
| `primary_city` | `TEXT` | 0 | 0 |
| `primary_city_listings` | `INT` | 0 | 0 |
| `primary_city_share_of_agency_pct` | `REAL` | 0 | 0 |
| `primary_district` | `TEXT` | 0 | 0 |
| `primary_district_city` | `TEXT` | 0 | 0 |
| `primary_district_listings` | `INT` | 0 | 0 |
| `primary_district_share_of_agency_pct` | `REAL` | 0 | 0 |
| `buy_listings` | `INT` | 0 | 0 |
| `rent_listings` | `INT` | 0 | 0 |
| `residential_listings` | `INT` | 0 | 0 |
| `commercial_listings` | `INT` | 0 | 0 |
| `short_term_listings` | `INT` | 0 | 0 |
| `avg_price` | `REAL` | 0 | 0 |
| `median_price_proxy` | `REAL` | 0 | 0 |
| `min_price` | `REAL` | 0 | 0 |
| `max_price` | `REAL` | 0 | 0 |
| `avg_area_sqm` | `REAL` | 0 | 0 |
| `avg_true_age_days` | `REAL` | 0 | 0 |
| `recon_opportunities` | `INT` | 0 | 0 |
| `recon_rate_pct` | `REAL` | 0 | 0 |
| `multi_signal_opportunities` | `INT` | 0 | 0 |
| `multi_signal_rate_pct` | `REAL` | 0 | 0 |
| `owner_direct_signals` | `INT` | 0 | 0 |
| `owner_direct_rate_pct` | `REAL` | 0 | 0 |
| `price_drop_signals` | `INT` | 0 | 0 |
| `price_drop_rate_pct` | `REAL` | 0 | 0 |
| `avg_price_drop_pct` | `REAL` | 0 | 0 |
| `total_price_drop_amount` | `REAL` | 0 | 0 |
| `refresh_signals` | `INT` | 0 | 0 |
| `refresh_rate_pct` | `REAL` | 0 | 0 |
| `contactable_opportunities` | `INT` | 0 | 0 |
| `contactable_rate_pct` | `REAL` | 0 | 0 |
| `url_only_opportunities` | `INT` | 0 | 0 |
| `url_only_rate_pct` | `REAL` | 0 | 0 |
| `best_city_rank` | `INT` | 0 | 0 |
| `best_city_listing_share_pct` | `REAL` | 0 | 0 |
| `best_district_rank` | `INT` | 0 | 0 |
| `best_district_listing_share_pct` | `REAL` | 0 | 0 |
| `max_city_pressure_exposure_score` | `REAL` | 0 | 0 |
| `max_city_pressure_bucket` | `TEXT` | 0 | 0 |
| `max_district_pressure_exposure_score` | `REAL` | 0 | 0 |
| `max_district_pressure_bucket` | `TEXT` | 0 | 0 |
| `portfolio_focus_bucket` | `TEXT` | 0 | 0 |
| `portfolio_signal_bucket` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_agency_profiles_micro`

Rows: `2515`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agency_name_variants` | `TEXT` | 0 | 0 |
| `agency_name_variant_count` | `INT` | 0 | 0 |
| `agency_ids_sample` | `TEXT` | 0 | 0 |
| `agency_id_count` | `INT` | 0 | 0 |
| `active_listings` | `INT` | 0 | 0 |
| `portfolio_size_bucket` | `TEXT` | 0 | 0 |
| `unique_agents` | `INT` | 0 | 0 |
| `unique_cities` | `INT` | 0 | 0 |
| `unique_districts` | `INT` | 0 | 0 |
| `unique_portals` | `INT` | 0 | 0 |
| `unique_property_types` | `INT` | 0 | 0 |
| `primary_city` | `TEXT` | 0 | 0 |
| `primary_city_listings` | `INT` | 0 | 0 |
| `primary_city_share_of_agency_pct` | `REAL` | 0 | 0 |
| `primary_district` | `TEXT` | 0 | 0 |
| `primary_district_city` | `TEXT` | 0 | 0 |
| `primary_district_listings` | `INT` | 0 | 0 |
| `primary_district_share_of_agency_pct` | `REAL` | 0 | 0 |
| `buy_listings` | `INT` | 0 | 0 |
| `rent_listings` | `INT` | 0 | 0 |
| `residential_listings` | `INT` | 0 | 0 |
| `commercial_listings` | `INT` | 0 | 0 |
| `short_term_listings` | `INT` | 0 | 0 |
| `avg_price` | `REAL` | 0 | 0 |
| `median_price_proxy` | `REAL` | 0 | 0 |
| `min_price` | `REAL` | 0 | 0 |
| `max_price` | `REAL` | 0 | 0 |
| `avg_area_sqm` | `REAL` | 0 | 0 |
| `avg_true_age_days` | `REAL` | 0 | 0 |
| `recon_opportunities` | `INT` | 0 | 0 |
| `recon_rate_pct` | `REAL` | 0 | 0 |
| `multi_signal_opportunities` | `INT` | 0 | 0 |
| `multi_signal_rate_pct` | `REAL` | 0 | 0 |
| `owner_direct_signals` | `INT` | 0 | 0 |
| `owner_direct_rate_pct` | `REAL` | 0 | 0 |
| `price_drop_signals` | `INT` | 0 | 0 |
| `price_drop_rate_pct` | `REAL` | 0 | 0 |
| `avg_price_drop_pct` | `REAL` | 0 | 0 |
| `total_price_drop_amount` | `REAL` | 0 | 0 |
| `refresh_signals` | `INT` | 0 | 0 |
| `refresh_rate_pct` | `REAL` | 0 | 0 |
| `contactable_opportunities` | `INT` | 0 | 0 |
| `contactable_rate_pct` | `REAL` | 0 | 0 |
| `url_only_opportunities` | `INT` | 0 | 0 |
| `url_only_rate_pct` | `REAL` | 0 | 0 |
| `best_city_rank` | `INT` | 0 | 0 |
| `best_city_listing_share_pct` | `REAL` | 0 | 0 |
| `best_district_rank` | `INT` | 0 | 0 |
| `best_district_listing_share_pct` | `REAL` | 0 | 0 |
| `max_city_pressure_exposure_score` | `REAL` | 0 | 0 |
| `max_city_pressure_bucket` | `TEXT` | 0 | 0 |
| `max_district_pressure_exposure_score` | `REAL` | 0 | 0 |
| `max_district_pressure_bucket` | `TEXT` | 0 | 0 |
| `portfolio_focus_bucket` | `TEXT` | 0 | 0 |
| `portfolio_signal_bucket` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_agency_city_profiles`

Rows: `1358`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `active_listings` | `INT` | 0 | 0 |
| `portfolio_city_share_pct` | `REAL` | 0 | 0 |
| `city_listing_share_pct` | `REAL` | 0 | 0 |
| `city_rank` | `INT` | 0 | 0 |
| `share_bucket` | `TEXT` | 0 | 0 |
| `unique_agents` | `INT` | 0 | 0 |
| `unique_districts` | `INT` | 0 | 0 |
| `unique_portals` | `INT` | 0 | 0 |
| `unique_property_types` | `INT` | 0 | 0 |
| `buy_listings` | `INT` | 0 | 0 |
| `rent_listings` | `INT` | 0 | 0 |
| `residential_listings` | `INT` | 0 | 0 |
| `commercial_listings` | `INT` | 0 | 0 |
| `avg_price` | `REAL` | 0 | 0 |
| `avg_area_sqm` | `REAL` | 0 | 0 |
| `avg_true_age_days` | `REAL` | 0 | 0 |
| `recon_opportunities` | `INT` | 0 | 0 |
| `recon_rate_pct` | `REAL` | 0 | 0 |
| `multi_signal_opportunities` | `INT` | 0 | 0 |
| `multi_signal_rate_pct` | `REAL` | 0 | 0 |
| `owner_direct_signals` | `INT` | 0 | 0 |
| `owner_direct_rate_pct` | `REAL` | 0 | 0 |
| `price_drop_signals` | `INT` | 0 | 0 |
| `price_drop_rate_pct` | `REAL` | 0 | 0 |
| `avg_price_drop_pct` | `REAL` | 0 | 0 |
| `total_price_drop_amount` | `REAL` | 0 | 0 |
| `refresh_signals` | `INT` | 0 | 0 |
| `refresh_rate_pct` | `REAL` | 0 | 0 |
| `contactable_opportunities` | `INT` | 0 | 0 |
| `contactable_rate_pct` | `REAL` | 0 | 0 |
| `url_only_opportunities` | `INT` | 0 | 0 |
| `url_only_rate_pct` | `REAL` | 0 | 0 |
| `pressure_exposure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `pressure_reason` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_agency_district_profiles`

Rows: `3724`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `district_key` | `TEXT` | 0 | 0 |
| `market_key` | `TEXT` | 0 | 0 |
| `active_listings` | `INT` | 0 | 0 |
| `portfolio_district_share_pct` | `REAL` | 0 | 0 |
| `district_listing_share_pct` | `REAL` | 0 | 0 |
| `district_rank` | `INT` | 0 | 0 |
| `share_bucket` | `TEXT` | 0 | 0 |
| `unique_agents` | `INT` | 0 | 0 |
| `unique_portals` | `INT` | 0 | 0 |
| `unique_property_types` | `INT` | 0 | 0 |
| `buy_listings` | `INT` | 0 | 0 |
| `rent_listings` | `INT` | 0 | 0 |
| `residential_listings` | `INT` | 0 | 0 |
| `commercial_listings` | `INT` | 0 | 0 |
| `avg_price` | `REAL` | 0 | 0 |
| `avg_area_sqm` | `REAL` | 0 | 0 |
| `avg_true_age_days` | `REAL` | 0 | 0 |
| `recon_opportunities` | `INT` | 0 | 0 |
| `recon_rate_pct` | `REAL` | 0 | 0 |
| `multi_signal_opportunities` | `INT` | 0 | 0 |
| `multi_signal_rate_pct` | `REAL` | 0 | 0 |
| `owner_direct_signals` | `INT` | 0 | 0 |
| `owner_direct_rate_pct` | `REAL` | 0 | 0 |
| `price_drop_signals` | `INT` | 0 | 0 |
| `price_drop_rate_pct` | `REAL` | 0 | 0 |
| `avg_price_drop_pct` | `REAL` | 0 | 0 |
| `total_price_drop_amount` | `REAL` | 0 | 0 |
| `refresh_signals` | `INT` | 0 | 0 |
| `refresh_rate_pct` | `REAL` | 0 | 0 |
| `contactable_opportunities` | `INT` | 0 | 0 |
| `contactable_rate_pct` | `REAL` | 0 | 0 |
| `url_only_opportunities` | `INT` | 0 | 0 |
| `url_only_rate_pct` | `REAL` | 0 | 0 |
| `pressure_exposure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `pressure_reason` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_activity_priority`

Rows: `947`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `category_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `activity_rank` | `INT` | 0 | 0 |
| `activity_score` | `REAL` | 0 | 0 |
| `activity_bucket` | `TEXT` | 0 | 0 |
| `card_type` | `TEXT` | 0 | 0 |
| `card_subtype` | `TEXT` | 0 | 0 |
| `card_title` | `TEXT` | 0 | 0 |
| `card_summary` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `evidence_date` | `TEXT` | 0 | 0 |
| `evidence_recency_days` | `REAL` | 0 | 0 |
| `source_table` | `TEXT` | 0 | 0 |
| `source_record_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `district_key` | `TEXT` | 0 | 0 |
| `market_key` | `TEXT` | 0 | 0 |
| `raw_city` | `TEXT` | 0 | 0 |
| `city_display_name` | `TEXT` | 0 | 0 |
| `city_canonical_key` | `TEXT` | 0 | 0 |
| `raw_district` | `TEXT` | 0 | 0 |
| `district_display_name` | `TEXT` | 0 | 0 |
| `district_canonical_key` | `TEXT` | 0 | 0 |
| `canonical_market_key` | `TEXT` | 0 | 0 |
| `location_alias_note` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_change_amount` | `REAL` | 0 | 0 |
| `price_change_pct` | `REAL` | 0 | 0 |
| `price_direction` | `TEXT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `pressure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `dominance_share_pct` | `REAL` | 0 | 0 |
| `concentration_bucket` | `TEXT` | 0 | 0 |
| `contactable` | `INT` | 0 | 0 |
| `url_only` | `INT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_activity_recon`

Rows: `5000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `activity_rank` | `INT` | 0 | 0 |
| `activity_score` | `REAL` | 0 | 0 |
| `activity_bucket` | `TEXT` | 0 | 0 |
| `card_type` | `TEXT` | 0 | 0 |
| `card_subtype` | `TEXT` | 0 | 0 |
| `card_title` | `TEXT` | 0 | 0 |
| `card_summary` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `evidence_date` | `TEXT` | 0 | 0 |
| `evidence_recency_days` | `REAL` | 0 | 0 |
| `source_table` | `TEXT` | 0 | 0 |
| `source_record_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `district_key` | `TEXT` | 0 | 0 |
| `market_key` | `TEXT` | 0 | 0 |
| `raw_city` | `TEXT` | 0 | 0 |
| `city_display_name` | `TEXT` | 0 | 0 |
| `city_canonical_key` | `TEXT` | 0 | 0 |
| `raw_district` | `TEXT` | 0 | 0 |
| `district_display_name` | `TEXT` | 0 | 0 |
| `district_canonical_key` | `TEXT` | 0 | 0 |
| `canonical_market_key` | `TEXT` | 0 | 0 |
| `location_alias_note` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_change_amount` | `REAL` | 0 | 0 |
| `price_change_pct` | `REAL` | 0 | 0 |
| `price_direction` | `TEXT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `pressure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `dominance_share_pct` | `REAL` | 0 | 0 |
| `concentration_bucket` | `TEXT` | 0 | 0 |
| `contactable` | `INT` | 0 | 0 |
| `url_only` | `INT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_activity_recently_detected`

Rows: `5000`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `activity_rank` | `INT` | 0 | 0 |
| `activity_score` | `REAL` | 0 | 0 |
| `activity_bucket` | `TEXT` | 0 | 0 |
| `card_type` | `TEXT` | 0 | 0 |
| `card_subtype` | `TEXT` | 0 | 0 |
| `card_title` | `TEXT` | 0 | 0 |
| `card_summary` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `evidence_date` | `TEXT` | 0 | 0 |
| `evidence_recency_days` | `REAL` | 0 | 0 |
| `source_table` | `TEXT` | 0 | 0 |
| `source_record_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `district_key` | `TEXT` | 0 | 0 |
| `market_key` | `TEXT` | 0 | 0 |
| `raw_city` | `TEXT` | 0 | 0 |
| `city_display_name` | `TEXT` | 0 | 0 |
| `city_canonical_key` | `TEXT` | 0 | 0 |
| `raw_district` | `TEXT` | 0 | 0 |
| `district_display_name` | `TEXT` | 0 | 0 |
| `district_canonical_key` | `TEXT` | 0 | 0 |
| `canonical_market_key` | `TEXT` | 0 | 0 |
| `location_alias_note` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_change_amount` | `REAL` | 0 | 0 |
| `price_change_pct` | `REAL` | 0 | 0 |
| `price_direction` | `TEXT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `pressure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `dominance_share_pct` | `REAL` | 0 | 0 |
| `concentration_bucket` | `TEXT` | 0 | 0 |
| `contactable` | `INT` | 0 | 0 |
| `url_only` | `INT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_activity_pressure`

Rows: `243`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `activity_rank` | `INT` | 0 | 0 |
| `activity_score` | `REAL` | 0 | 0 |
| `activity_bucket` | `TEXT` | 0 | 0 |
| `card_type` | `TEXT` | 0 | 0 |
| `card_subtype` | `TEXT` | 0 | 0 |
| `card_title` | `TEXT` | 0 | 0 |
| `card_summary` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `evidence_date` | `TEXT` | 0 | 0 |
| `evidence_recency_days` | `REAL` | 0 | 0 |
| `source_table` | `TEXT` | 0 | 0 |
| `source_record_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `district_key` | `TEXT` | 0 | 0 |
| `market_key` | `TEXT` | 0 | 0 |
| `raw_city` | `TEXT` | 0 | 0 |
| `city_display_name` | `TEXT` | 0 | 0 |
| `city_canonical_key` | `TEXT` | 0 | 0 |
| `raw_district` | `TEXT` | 0 | 0 |
| `district_display_name` | `TEXT` | 0 | 0 |
| `district_canonical_key` | `TEXT` | 0 | 0 |
| `canonical_market_key` | `TEXT` | 0 | 0 |
| `location_alias_note` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_change_amount` | `REAL` | 0 | 0 |
| `price_change_pct` | `REAL` | 0 | 0 |
| `price_direction` | `TEXT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `pressure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `dominance_share_pct` | `REAL` | 0 | 0 |
| `concentration_bucket` | `TEXT` | 0 | 0 |
| `contactable` | `INT` | 0 | 0 |
| `url_only` | `INT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_activity_dominance`

Rows: `178`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `activity_rank` | `INT` | 0 | 0 |
| `activity_score` | `REAL` | 0 | 0 |
| `activity_bucket` | `TEXT` | 0 | 0 |
| `card_type` | `TEXT` | 0 | 0 |
| `card_subtype` | `TEXT` | 0 | 0 |
| `card_title` | `TEXT` | 0 | 0 |
| `card_summary` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `evidence_date` | `TEXT` | 0 | 0 |
| `evidence_recency_days` | `REAL` | 0 | 0 |
| `source_table` | `TEXT` | 0 | 0 |
| `source_record_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `district_key` | `TEXT` | 0 | 0 |
| `market_key` | `TEXT` | 0 | 0 |
| `raw_city` | `TEXT` | 0 | 0 |
| `city_display_name` | `TEXT` | 0 | 0 |
| `city_canonical_key` | `TEXT` | 0 | 0 |
| `raw_district` | `TEXT` | 0 | 0 |
| `district_display_name` | `TEXT` | 0 | 0 |
| `district_canonical_key` | `TEXT` | 0 | 0 |
| `canonical_market_key` | `TEXT` | 0 | 0 |
| `location_alias_note` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_change_amount` | `REAL` | 0 | 0 |
| `price_change_pct` | `REAL` | 0 | 0 |
| `price_direction` | `TEXT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `pressure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `dominance_share_pct` | `REAL` | 0 | 0 |
| `concentration_bucket` | `TEXT` | 0 | 0 |
| `contactable` | `INT` | 0 | 0 |
| `url_only` | `INT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_activity_agency`

Rows: `568`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `id` | `INT` | 0 | 0 |
| `run_id` | `TEXT` | 0 | 0 |
| `generated_at` | `TEXT` | 0 | 0 |
| `activity_rank` | `INT` | 0 | 0 |
| `activity_score` | `REAL` | 0 | 0 |
| `activity_bucket` | `TEXT` | 0 | 0 |
| `card_type` | `TEXT` | 0 | 0 |
| `card_subtype` | `TEXT` | 0 | 0 |
| `card_title` | `TEXT` | 0 | 0 |
| `card_summary` | `TEXT` | 0 | 0 |
| `recommended_action` | `TEXT` | 0 | 0 |
| `evidence_date` | `TEXT` | 0 | 0 |
| `evidence_recency_days` | `REAL` | 0 | 0 |
| `source_table` | `TEXT` | 0 | 0 |
| `source_record_key` | `TEXT` | 0 | 0 |
| `normalized_id` | `TEXT` | 0 | 0 |
| `canonical_id` | `TEXT` | 0 | 0 |
| `source_portal` | `TEXT` | 0 | 0 |
| `source_db_label` | `TEXT` | 0 | 0 |
| `source_listing_id` | `TEXT` | 0 | 0 |
| `source_url` | `TEXT` | 0 | 0 |
| `city` | `TEXT` | 0 | 0 |
| `city_key` | `TEXT` | 0 | 0 |
| `district` | `TEXT` | 0 | 0 |
| `district_key` | `TEXT` | 0 | 0 |
| `market_key` | `TEXT` | 0 | 0 |
| `raw_city` | `TEXT` | 0 | 0 |
| `city_display_name` | `TEXT` | 0 | 0 |
| `city_canonical_key` | `TEXT` | 0 | 0 |
| `raw_district` | `TEXT` | 0 | 0 |
| `district_display_name` | `TEXT` | 0 | 0 |
| `district_canonical_key` | `TEXT` | 0 | 0 |
| `canonical_market_key` | `TEXT` | 0 | 0 |
| `location_alias_note` | `TEXT` | 0 | 0 |
| `agency_display_name` | `TEXT` | 0 | 0 |
| `agency_public_key` | `TEXT` | 0 | 0 |
| `agent_name` | `TEXT` | 0 | 0 |
| `agent_id` | `TEXT` | 0 | 0 |
| `source_category` | `TEXT` | 0 | 0 |
| `purpose` | `TEXT` | 0 | 0 |
| `rental_mode` | `TEXT` | 0 | 0 |
| `property_type_norm` | `TEXT` | 0 | 0 |
| `price_amount` | `REAL` | 0 | 0 |
| `old_price` | `REAL` | 0 | 0 |
| `new_price` | `REAL` | 0 | 0 |
| `price_change_amount` | `REAL` | 0 | 0 |
| `price_change_pct` | `REAL` | 0 | 0 |
| `price_direction` | `TEXT` | 0 | 0 |
| `recon_score` | `REAL` | 0 | 0 |
| `opportunity_lane` | `TEXT` | 0 | 0 |
| `signal_count` | `INT` | 0 | 0 |
| `pressure_score` | `REAL` | 0 | 0 |
| `pressure_bucket` | `TEXT` | 0 | 0 |
| `dominance_share_pct` | `REAL` | 0 | 0 |
| `concentration_bucket` | `TEXT` | 0 | 0 |
| `contactable` | `INT` | 0 | 0 |
| `url_only` | `INT` | 0 | 0 |
| `evidence_json` | `TEXT` | 0 | 0 |
| `product_note` | `TEXT` | 0 | 0 |

#### `ksa_module5_dashboard_city_alias_audit`

Rows: `75`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `city_display_name` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `alias_groups` | `` | 0 | 0 |
| `combined_active_listings` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `audit_status` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_district_alias_audit`

Rows: `1279`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `dashboard_rank` | `` | 0 | 0 |
| `city_display_name` | `` | 0 | 0 |
| `city_canonical_key` | `` | 0 | 0 |
| `district_display_name` | `` | 0 | 0 |
| `district_canonical_key` | `` | 0 | 0 |
| `canonical_market_key` | `` | 0 | 0 |
| `raw_city_variants` | `` | 0 | 0 |
| `raw_city_variant_count` | `` | 0 | 0 |
| `raw_district_variants` | `` | 0 | 0 |
| `raw_district_variant_count` | `` | 0 | 0 |
| `raw_market_keys` | `` | 0 | 0 |
| `combined_active_listings` | `` | 0 | 0 |
| `inventory_pressure_score` | `` | 0 | 0 |
| `pressure_bucket` | `` | 0 | 0 |
| `top_agency_name` | `TEXT` | 0 | 0 |
| `top_agency_share_pct` | `REAL` | 0 | 0 |
| `district_alias_status` | `` | 0 | 0 |
| `district_alias_confidence` | `` | 0 | 0 |
| `product_note` | `` | 0 | 0 |

#### `ksa_module5_dashboard_summary`

Rows: `37`

| Column | Type | Not Null | Primary Key |
|---|---|---:|---:|
| `id` | `INTEGER` | 0 | 1 |
| `run_id` | `TEXT` | 1 | 0 |
| `generated_at` | `TEXT` | 1 | 0 |
| `metric_scope` | `TEXT` | 1 | 0 |
| `metric_key` | `TEXT` | 1 | 0 |
| `rows` | `INTEGER` | 0 | 0 |
| `metric_value` | `TEXT` | 0 | 0 |
| `extra_json` | `TEXT` | 0 | 0 |

---

## Next step

Use this report to create the first frontend data contract for `/dashboard/uae/recon`, then adapt the pattern to `/dashboard/ksa/recon`.
