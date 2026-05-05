# Phase 5E KSA Recon Export Sample Inspection

Purpose: inspect actual KSA exported JSON fields before normalizing KSA Recon UI.

## hot_leads

File: `recon_hot_leads.json`

Source table: `ksa_recon_dashboard_hot_leads`

Exported rows: `167`

Total rows available: `167`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 12 | 7.19% | [700000.0, 1350000.0, 35000.0] |
| `old_price` | 12 | 7.19% | [950000.0, 1500000.0, 40000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 167 | 100.0% | ["Riyadh", "Riyadh", "Jeddah"] |
| `district` | 167 | 100.0% | ["As Suwaidi Al Gharabi", "Irqah", "Al Frosyah"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 167 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `source_url` | 167 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 167 | 100.0% |
| `id` | 167 | 100.0% |
| `run_id` | 167 | 100.0% |
| `generated_at` | 167 | 100.0% |
| `recon_rank` | 167 | 100.0% |
| `recon_score` | 167 | 100.0% |
| `priority_bucket` | 167 | 100.0% |
| `opportunity_lane` | 167 | 100.0% |
| `signal_count` | 167 | 100.0% |
| `has_owner_direct_signal` | 167 | 100.0% |
| `has_price_drop_signal` | 167 | 100.0% |
| `has_refresh_signal` | 167 | 100.0% |
| `owner_score_component` | 167 | 100.0% |
| `price_drop_score_component` | 167 | 100.0% |
| `refresh_score_component` | 167 | 100.0% |
| `overlap_score_component` | 167 | 100.0% |
| `contact_score_component` | 167 | 100.0% |
| `freshness_score_component` | 167 | 100.0% |
| `listing_key` | 167 | 100.0% |
| `normalized_id` | 167 | 100.0% |
| `canonical_id` | 167 | 100.0% |
| `country` | 167 | 100.0% |
| `source_portal` | 167 | 100.0% |
| `source_db_label` | 167 | 100.0% |
| `source_listing_id` | 167 | 100.0% |

---

## multi_signal

File: `recon_multi_signal.json`

Source table: `ksa_recon_dashboard_multi_signal`

Exported rows: `500`

Total rows available: `2249`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 15 | 3.0% | [700000.0, 1350000.0, 35000.0] |
| `old_price` | 15 | 3.0% | [950000.0, 1500000.0, 40000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 500 | 100.0% | ["Riyadh", "Riyadh", "Jeddah"] |
| `district` | 500 | 100.0% | ["As Suwaidi Al Gharabi", "Irqah", "Al Frosyah"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `source_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 500 | 100.0% |
| `id` | 500 | 100.0% |
| `run_id` | 500 | 100.0% |
| `generated_at` | 500 | 100.0% |
| `recon_rank` | 500 | 100.0% |
| `recon_score` | 500 | 100.0% |
| `priority_bucket` | 500 | 100.0% |
| `opportunity_lane` | 500 | 100.0% |
| `signal_count` | 500 | 100.0% |
| `has_owner_direct_signal` | 500 | 100.0% |
| `has_price_drop_signal` | 500 | 100.0% |
| `has_refresh_signal` | 500 | 100.0% |
| `owner_score_component` | 500 | 100.0% |
| `price_drop_score_component` | 500 | 100.0% |
| `refresh_score_component` | 500 | 100.0% |
| `overlap_score_component` | 500 | 100.0% |
| `contact_score_component` | 500 | 100.0% |
| `freshness_score_component` | 500 | 100.0% |
| `listing_key` | 500 | 100.0% |
| `normalized_id` | 500 | 100.0% |
| `canonical_id` | 500 | 100.0% |
| `country` | 500 | 100.0% |
| `source_portal` | 500 | 100.0% |
| `source_db_label` | 500 | 100.0% |
| `source_listing_id` | 500 | 100.0% |

---

## owner_direct

File: `recon_owner_direct.json`

Source table: `ksa_recon_dashboard_owner_direct`

Exported rows: `500`

Total rows available: `7047`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 7 | 1.4% | [700000.0, 1350000.0, 35000.0] |
| `old_price` | 7 | 1.4% | [950000.0, 1500000.0, 40000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 500 | 100.0% | ["Riyadh", "Riyadh", "Jeddah"] |
| `district` | 500 | 100.0% | ["As Suwaidi Al Gharabi", "Irqah", "Al Frosyah"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `source_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 500 | 100.0% |
| `id` | 500 | 100.0% |
| `run_id` | 500 | 100.0% |
| `generated_at` | 500 | 100.0% |
| `recon_rank` | 500 | 100.0% |
| `recon_score` | 500 | 100.0% |
| `priority_bucket` | 500 | 100.0% |
| `opportunity_lane` | 500 | 100.0% |
| `signal_count` | 500 | 100.0% |
| `has_owner_direct_signal` | 500 | 100.0% |
| `has_price_drop_signal` | 500 | 100.0% |
| `has_refresh_signal` | 500 | 100.0% |
| `owner_score_component` | 500 | 100.0% |
| `price_drop_score_component` | 500 | 100.0% |
| `refresh_score_component` | 500 | 100.0% |
| `overlap_score_component` | 500 | 100.0% |
| `contact_score_component` | 500 | 100.0% |
| `freshness_score_component` | 500 | 100.0% |
| `listing_key` | 500 | 100.0% |
| `normalized_id` | 500 | 100.0% |
| `canonical_id` | 500 | 100.0% |
| `country` | 500 | 100.0% |
| `source_portal` | 500 | 100.0% |
| `source_db_label` | 500 | 100.0% |
| `source_listing_id` | 500 | 100.0% |

---

## price_drops

File: `recon_price_drops.json`

Source table: `ksa_recon_dashboard_price_drops`

Exported rows: `84`

Total rows available: `84`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 84 | 100.0% | [700000.0, 1350000.0, 35000.0] |
| `old_price` | 84 | 100.0% | [950000.0, 1500000.0, 40000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 84 | 100.0% | ["Riyadh", "Riyadh", "Riyadh"] |
| `district` | 84 | 100.0% | ["As Suwaidi Al Gharabi", "Irqah", "Al Aqiq"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 84 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/apartment-for-rent/riyadh/north-of-riyadh/al-aqiq/apartment-for-rent-6651226"] |
| `source_url` | 84 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/apartment-for-rent/riyadh/north-of-riyadh/al-aqiq/apartment-for-rent-6651226"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 84 | 100.0% |
| `id` | 84 | 100.0% |
| `run_id` | 84 | 100.0% |
| `generated_at` | 84 | 100.0% |
| `recon_rank` | 84 | 100.0% |
| `recon_score` | 84 | 100.0% |
| `priority_bucket` | 84 | 100.0% |
| `opportunity_lane` | 84 | 100.0% |
| `signal_count` | 84 | 100.0% |
| `has_owner_direct_signal` | 84 | 100.0% |
| `has_price_drop_signal` | 84 | 100.0% |
| `has_refresh_signal` | 84 | 100.0% |
| `owner_score_component` | 84 | 100.0% |
| `price_drop_score_component` | 84 | 100.0% |
| `refresh_score_component` | 84 | 100.0% |
| `overlap_score_component` | 84 | 100.0% |
| `contact_score_component` | 84 | 100.0% |
| `freshness_score_component` | 84 | 100.0% |
| `listing_key` | 84 | 100.0% |
| `normalized_id` | 84 | 100.0% |
| `canonical_id` | 84 | 100.0% |
| `country` | 84 | 100.0% |
| `source_portal` | 84 | 100.0% |
| `source_db_label` | 84 | 100.0% |
| `source_listing_id` | 84 | 100.0% |

---

## refresh_inflation

File: `recon_refresh_inflation.json`

Source table: `ksa_recon_dashboard_refresh_inflation`

Exported rows: `500`

Total rows available: `18359`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 10 | 2.0% | [700000.0, 1350000.0, 4200000.0] |
| `old_price` | 10 | 2.0% | [950000.0, 1500000.0, 4650000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 500 | 100.0% | ["Riyadh", "Riyadh", "Jeddah"] |
| `district` | 500 | 100.0% | ["As Suwaidi Al Gharabi", "Irqah", "Al Frosyah"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `source_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 500 | 100.0% |
| `id` | 500 | 100.0% |
| `run_id` | 500 | 100.0% |
| `generated_at` | 500 | 100.0% |
| `recon_rank` | 500 | 100.0% |
| `recon_score` | 500 | 100.0% |
| `priority_bucket` | 500 | 100.0% |
| `opportunity_lane` | 500 | 100.0% |
| `signal_count` | 500 | 100.0% |
| `has_owner_direct_signal` | 500 | 100.0% |
| `has_price_drop_signal` | 500 | 100.0% |
| `has_refresh_signal` | 500 | 100.0% |
| `owner_score_component` | 500 | 100.0% |
| `price_drop_score_component` | 500 | 100.0% |
| `refresh_score_component` | 500 | 100.0% |
| `overlap_score_component` | 500 | 100.0% |
| `contact_score_component` | 500 | 100.0% |
| `freshness_score_component` | 500 | 100.0% |
| `listing_key` | 500 | 100.0% |
| `normalized_id` | 500 | 100.0% |
| `canonical_id` | 500 | 100.0% |
| `country` | 500 | 100.0% |
| `source_portal` | 500 | 100.0% |
| `source_db_label` | 500 | 100.0% |
| `source_listing_id` | 500 | 100.0% |

---

## contactable

File: `recon_contactable.json`

Source table: `ksa_recon_dashboard_contactable`

Exported rows: `500`

Total rows available: `9151`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 8 | 1.6% | [700000.0, 35000.0, 4200000.0] |
| `old_price` | 8 | 1.6% | [950000.0, 40000.0, 4650000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 500 | 100.0% | ["Riyadh", "Jeddah", "Jeddah"] |
| `district` | 493 | 98.6% | ["As Suwaidi Al Gharabi", "Al Frosyah", "Al Sawari"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376", "https://sa.aqar.fm/apartment-for-rent/jeddah/north-of-jeddah/al-sawari/apartment-for-rent-6147242"] |
| `source_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376", "https://sa.aqar.fm/apartment-for-rent/jeddah/north-of-jeddah/al-sawari/apartment-for-rent-6147242"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 500 | 100.0% |
| `id` | 500 | 100.0% |
| `run_id` | 500 | 100.0% |
| `generated_at` | 500 | 100.0% |
| `recon_rank` | 500 | 100.0% |
| `recon_score` | 500 | 100.0% |
| `priority_bucket` | 500 | 100.0% |
| `opportunity_lane` | 500 | 100.0% |
| `signal_count` | 500 | 100.0% |
| `has_owner_direct_signal` | 500 | 100.0% |
| `has_price_drop_signal` | 500 | 100.0% |
| `has_refresh_signal` | 500 | 100.0% |
| `owner_score_component` | 500 | 100.0% |
| `price_drop_score_component` | 500 | 100.0% |
| `refresh_score_component` | 500 | 100.0% |
| `overlap_score_component` | 500 | 100.0% |
| `contact_score_component` | 500 | 100.0% |
| `freshness_score_component` | 500 | 100.0% |
| `listing_key` | 500 | 100.0% |
| `normalized_id` | 500 | 100.0% |
| `canonical_id` | 500 | 100.0% |
| `country` | 500 | 100.0% |
| `source_portal` | 500 | 100.0% |
| `source_db_label` | 500 | 100.0% |
| `source_listing_id` | 500 | 100.0% |

---

## url_only

File: `recon_url_only.json`

Source table: `ksa_recon_dashboard_url_only`

Exported rows: `500`

Total rows available: `17676`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 10 | 2.0% | [1350000.0, 1200000.0, 1400000.0] |
| `old_price` | 10 | 2.0% | [1500000.0, 1500000.0, 1650000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 500 | 100.0% | ["Riyadh", "Jeddah", "Riyadh"] |
| `district` | 500 | 100.0% | ["Irqah", "Mishrifah", "Ar Rimal"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 500 | 100.0% | ["https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/building-for-sale/jeddah/north-of-jeddah/mishrifah/building-for-sale-6220713", "https://sa.aqar.fm/flat-for-sale/riyadh/east-of-riyadh/ar-rimal/flat-for-sale-6365988"] |
| `source_url` | 500 | 100.0% | ["https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/building-for-sale/jeddah/north-of-jeddah/mishrifah/building-for-sale-6220713", "https://sa.aqar.fm/flat-for-sale/riyadh/east-of-riyadh/ar-rimal/flat-for-sale-6365988"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 500 | 100.0% |
| `id` | 500 | 100.0% |
| `run_id` | 500 | 100.0% |
| `generated_at` | 500 | 100.0% |
| `recon_rank` | 500 | 100.0% |
| `recon_score` | 500 | 100.0% |
| `priority_bucket` | 500 | 100.0% |
| `opportunity_lane` | 500 | 100.0% |
| `signal_count` | 500 | 100.0% |
| `has_owner_direct_signal` | 500 | 100.0% |
| `has_price_drop_signal` | 500 | 100.0% |
| `has_refresh_signal` | 500 | 100.0% |
| `owner_score_component` | 500 | 100.0% |
| `price_drop_score_component` | 500 | 100.0% |
| `refresh_score_component` | 500 | 100.0% |
| `overlap_score_component` | 500 | 100.0% |
| `contact_score_component` | 500 | 100.0% |
| `freshness_score_component` | 500 | 100.0% |
| `listing_key` | 500 | 100.0% |
| `normalized_id` | 500 | 100.0% |
| `canonical_id` | 500 | 100.0% |
| `country` | 500 | 100.0% |
| `source_portal` | 500 | 100.0% |
| `source_db_label` | 500 | 100.0% |
| `source_listing_id` | 500 | 100.0% |

---

## residential_rent

File: `recon_residential_rent.json`

Source table: `ksa_recon_dashboard_residential_rent`

Exported rows: `500`

Total rows available: `4864`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 7 | 1.4% | [35000.0, 70000.0, 70000.0] |
| `old_price` | 7 | 1.4% | [40000.0, 75000.0, 75000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 500 | 100.0% | ["Jeddah", "Jeddah", "Jeddah"] |
| `district` | 500 | 100.0% | ["Al Sawari", "Al Yaqout", "Al Aziziyah"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 500 | 100.0% | ["https://sa.aqar.fm/apartment-for-rent/jeddah/north-of-jeddah/al-sawari/apartment-for-rent-6147242", "https://sa.aqar.fm/villa-for-rent/jeddah/north-of-jeddah/al-yaqout/villa-for-rent-6509549", "https://sa.aqar.fm/apartment-for-rent/jeddah/north-of-jeddah/al-aziziyah/apartment-for-rent-6220174"] |
| `source_url` | 500 | 100.0% | ["https://sa.aqar.fm/apartment-for-rent/jeddah/north-of-jeddah/al-sawari/apartment-for-rent-6147242", "https://sa.aqar.fm/villa-for-rent/jeddah/north-of-jeddah/al-yaqout/villa-for-rent-6509549", "https://sa.aqar.fm/apartment-for-rent/jeddah/north-of-jeddah/al-aziziyah/apartment-for-rent-6220174"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 500 | 100.0% |
| `id` | 500 | 100.0% |
| `run_id` | 500 | 100.0% |
| `generated_at` | 500 | 100.0% |
| `recon_rank` | 500 | 100.0% |
| `recon_score` | 500 | 100.0% |
| `priority_bucket` | 500 | 100.0% |
| `opportunity_lane` | 500 | 100.0% |
| `signal_count` | 500 | 100.0% |
| `has_owner_direct_signal` | 500 | 100.0% |
| `has_price_drop_signal` | 500 | 100.0% |
| `has_refresh_signal` | 500 | 100.0% |
| `owner_score_component` | 500 | 100.0% |
| `price_drop_score_component` | 500 | 100.0% |
| `refresh_score_component` | 500 | 100.0% |
| `overlap_score_component` | 500 | 100.0% |
| `contact_score_component` | 500 | 100.0% |
| `freshness_score_component` | 500 | 100.0% |
| `listing_key` | 500 | 100.0% |
| `normalized_id` | 500 | 100.0% |
| `canonical_id` | 500 | 100.0% |
| `country` | 500 | 100.0% |
| `source_portal` | 500 | 100.0% |
| `source_db_label` | 500 | 100.0% |
| `source_listing_id` | 500 | 100.0% |

---

## residential_buy

File: `recon_residential_buy.json`

Source table: `ksa_recon_dashboard_residential_buy`

Exported rows: `500`

Total rows available: `20391`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 14 | 2.8% | [700000.0, 1350000.0, 4200000.0] |
| `old_price` | 14 | 2.8% | [950000.0, 1500000.0, 4650000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 500 | 100.0% | ["Riyadh", "Riyadh", "Jeddah"] |
| `district` | 500 | 100.0% | ["As Suwaidi Al Gharabi", "Irqah", "Al Frosyah"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `source_url` | 500 | 100.0% | ["https://sa.aqar.fm/flat-for-sale/riyadh/west-of-riyadh/as-suwaidi-al-gharabi/flat-for-sale-6355887", "https://sa.aqar.fm/apartment-for-sale/riyadh/west-of-riyadh/irqah/apartment-for-sale-6428694", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-frosyah/land-for-sale-6602376"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 500 | 100.0% |
| `id` | 500 | 100.0% |
| `run_id` | 500 | 100.0% |
| `generated_at` | 500 | 100.0% |
| `recon_rank` | 500 | 100.0% |
| `recon_score` | 500 | 100.0% |
| `priority_bucket` | 500 | 100.0% |
| `opportunity_lane` | 500 | 100.0% |
| `signal_count` | 500 | 100.0% |
| `has_owner_direct_signal` | 500 | 100.0% |
| `has_price_drop_signal` | 500 | 100.0% |
| `has_refresh_signal` | 500 | 100.0% |
| `owner_score_component` | 500 | 100.0% |
| `price_drop_score_component` | 500 | 100.0% |
| `refresh_score_component` | 500 | 100.0% |
| `overlap_score_component` | 500 | 100.0% |
| `contact_score_component` | 500 | 100.0% |
| `freshness_score_component` | 500 | 100.0% |
| `listing_key` | 500 | 100.0% |
| `normalized_id` | 500 | 100.0% |
| `canonical_id` | 500 | 100.0% |
| `country` | 500 | 100.0% |
| `source_portal` | 500 | 100.0% |
| `source_db_label` | 500 | 100.0% |
| `source_listing_id` | 500 | 100.0% |

---

## commercial

File: `recon_commercial.json`

Source table: `ksa_recon_dashboard_commercial`

Exported rows: `500`

Total rows available: `1572`

### Candidate title fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `opportunity_title` | 0 | 0.0% | [] |
| `title` | 0 | 0.0% | [] |
| `listing_title` | 0 | 0.0% | [] |
| `property_title` | 0 | 0.0% | [] |
| `name` | 0 | 0.0% | [] |
| `description` | 0 | 0.0% | [] |

### Candidate price fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `price` | 0 | 0.0% | [] |
| `current_price` | 0 | 0.0% | [] |
| `new_price` | 5 | 1.0% | [1003440.0, 100000.0, 1100000.0] |
| `old_price` | 5 | 1.0% | [1254300.0, 177000.0, 1150000.0] |
| `advertised_price` | 0 | 0.0% | [] |
| `asking_price` | 0 | 0.0% | [] |
| `rent_price` | 0 | 0.0% | [] |
| `sale_price` | 0 | 0.0% | [] |
| `amount` | 0 | 0.0% | [] |

### Candidate location fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `city` | 500 | 100.0% | ["Jeddah", "Jeddah", "Jeddah"] |
| `district` | 497 | 99.4% | ["Al Marwah", "Al Riyadh", "As Sarawat"] |
| `community` | 0 | 0.0% | [] |
| `location_full_name` | 0 | 0.0% | [] |
| `location_name` | 0 | 0.0% | [] |
| `address` | 0 | 0.0% | [] |
| `building_name` | 0 | 0.0% | [] |

### Candidate URL fields

| Field | Present | Present % | Examples |
|---|---:|---:|---|
| `property_url` | 500 | 100.0% | ["https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-marwah/land-for-sale-6548177", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-riyadh/land-for-sale-6369883", "https://sa.aqar.fm/land-for-sale/jeddah/south-of-jeddah/as-sarawat/land-for-sale-6299873"] |
| `source_url` | 500 | 100.0% | ["https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-marwah/land-for-sale-6548177", "https://sa.aqar.fm/land-for-sale/jeddah/north-of-jeddah/al-riyadh/land-for-sale-6369883", "https://sa.aqar.fm/land-for-sale/jeddah/south-of-jeddah/as-sarawat/land-for-sale-6299873"] |
| `listing_url` | 0 | 0.0% | [] |
| `url` | 0 | 0.0% | [] |
| `detail_url` | 0 | 0.0% | [] |

### Most populated fields

| Field | Present | Present % |
|---|---:|---:|
| `dashboard_rank` | 500 | 100.0% |
| `id` | 500 | 100.0% |
| `run_id` | 500 | 100.0% |
| `generated_at` | 500 | 100.0% |
| `recon_rank` | 500 | 100.0% |
| `recon_score` | 500 | 100.0% |
| `priority_bucket` | 500 | 100.0% |
| `opportunity_lane` | 500 | 100.0% |
| `signal_count` | 500 | 100.0% |
| `has_owner_direct_signal` | 500 | 100.0% |
| `has_price_drop_signal` | 500 | 100.0% |
| `has_refresh_signal` | 500 | 100.0% |
| `owner_score_component` | 500 | 100.0% |
| `price_drop_score_component` | 500 | 100.0% |
| `refresh_score_component` | 500 | 100.0% |
| `overlap_score_component` | 500 | 100.0% |
| `contact_score_component` | 500 | 100.0% |
| `freshness_score_component` | 500 | 100.0% |
| `listing_key` | 500 | 100.0% |
| `normalized_id` | 500 | 100.0% |
| `canonical_id` | 500 | 100.0% |
| `country` | 500 | 100.0% |
| `source_portal` | 500 | 100.0% |
| `source_db_label` | 500 | 100.0% |
| `source_listing_id` | 500 | 100.0% |

---
