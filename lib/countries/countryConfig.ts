import { PRODUCT_SECTIONS, type ProductSectionSlug } from "./productNavigation";

export type CountrySlug = "uae" | "ksa";

export type CountryConfig = {
  slug: CountrySlug;
  label: string;
  fullName: string;
  currency: "AED" | "SAR";
  databasePath: string;
  publishStatus: string;
  launchStatus: string;
  routeBase: string;
  productPositioning: string;
  caveats: string[];
  tables: Record<string, string>;
  disabledSections?: Partial<Record<ProductSectionSlug, string>>;
};

export const COUNTRY_CONFIG: Record<CountrySlug, CountryConfig> = {
  uae: {
    slug: "uae",
    label: "UAE",
    fullName: "United Arab Emirates",
    currency: "AED",
    databasePath: "C:\\Users\\User\\Documents\\malesh\\intelligence.db",
    publishStatus: "READY_TO_PUBLISH_UPDATED_UAE_DATA",
    launchStatus: "Backend PASS — no frontend blockers",
    routeBase: "/dashboard/uae",
    productPositioning:
      "UAE public-listing intelligence for agents, agencies, and operators covering opportunities, listing truth, price movement, market pressure, dominance, agency footprint, building intelligence, and community intelligence.",
    caveats: [
      "Use AED for all UAE pricing.",
      "Use dashboard-ready recon_dashboard_* and module5_dashboard_* tables first.",
      "Do not expose listing_price_events, listing_price_state, price_history_runs, or suspicious_price_drop_events directly to paid users.",
      "Short-rental activity can dominate some market views, so source-category filters are important.",
      "Commercial and land dedup can be weaker than residential, but product/dashboard tables remain usable.",
    ],
    tables: {
      activeUnified: "active_listings_unified",

      ownerDirect: "owner_direct_opportunities",

      priceDrops: "price_drop_opportunities",

      listingAge: "true_listing_age_signals",
      refreshInflatedDashboard: "recon_dashboard_refresh_inflated",
      listingTruthDashboard: "recon_dashboard_listing_truth",

      reconMain: "recon_hub_opportunities",
      reconHotLeads: "recon_dashboard_hot_leads",
      reconPriceDrops: "recon_dashboard_price_drops",
      reconOwnerDirect: "recon_dashboard_owner_direct",
      reconStalePriceDrops: "recon_dashboard_stale_price_drops",
      reconRefreshInflated: "recon_dashboard_refresh_inflated",
      reconListingTruth: "recon_dashboard_listing_truth",
      reconResidentialRent: "recon_dashboard_residential_rent",
      reconResidentialBuy: "recon_dashboard_residential_buy",
      reconCommercial: "recon_dashboard_commercial",
      reconShortRental: "recon_dashboard_short_rental",
      reconSummary: "recon_dashboard_summary",

      module5Summary: "module5_dashboard_summary",
      module5MarketDominance: "module5_dashboard_market_dominance",
      module5InventoryPressure: "module5_dashboard_inventory_pressure",
      module5AgencyProfiles: "module5_dashboard_agency_profiles",
      module5ActivityFeed: "module5_dashboard_activity_feed",
      module5VeryActiveMarkets: "module5_dashboard_very_active_markets",
      module5BuildingIntel: "module5_dashboard_building_intelligence",
      module5CommunityIntel: "module5_dashboard_community_intelligence",
    },
  },

  ksa: {
    slug: "ksa",
    label: "KSA",
    fullName: "Kingdom of Saudi Arabia",
    currency: "SAR",
    databasePath:
      "C:\\Users\\User\\Documents\\malesh\\KSA\\intelligence\\ksa_intelligence.db",
    publishStatus: "READY_TO_PUBLISH_UPDATED_KSA_DATA",
    launchStatus: "Backend PASS_WITH_WARNINGS — no blockers",
    routeBase: "/dashboard/ksa",
    productPositioning:
      "KSA public-listing intelligence for agents, agencies, investors, and market operators covering owner/direct signals, price movement, listing truth, market pressure, dominance, agency profiles, city/district intelligence, and activity feeds.",
    caveats: [
      "Use SAR for all KSA pricing.",
      "Use ksa_module5_dashboard_* tables for normal Module 5 frontend pages.",
      "Do not expose ksa_listing_price_events, ksa_listing_price_state, ksa_price_history_runs, or ksa_suspicious_price_drop_events directly to paid users.",
      "Phone and WhatsApp coverage can be weaker than UAE; source_url and URL-lead paths are valid actions.",
      "KSA v1 should not depend heavily on building/project coverage; prioritize city, district, agency, source URL, price, and signal fields.",
      "Use canonical city/district fields from dashboard tables where available. Do not create frontend alias logic blindly.",
    ],
    tables: {
      activeUnified: "ksa_active_listings_unified",

      ownerDirect: "ksa_owner_direct_candidates",

      priceDrops: "ksa_price_drop_candidates",
      priceMovementActivity: "ksa_module5_dashboard_activity_price_movements",

      listingAge: "ksa_listing_age_state",
      refreshInflation: "ksa_refresh_inflation_candidates",
      refreshInflationDashboard: "ksa_recon_dashboard_refresh_inflation",

      reconMain: "ksa_recon_hub_opportunities",
      reconHotLeads: "ksa_recon_dashboard_hot_leads",
      reconMultiSignal: "ksa_recon_dashboard_multi_signal",
      reconOwnerDirect: "ksa_recon_dashboard_owner_direct",
      reconPriceDrops: "ksa_recon_dashboard_price_drops",
      reconRefreshInflation: "ksa_recon_dashboard_refresh_inflation",
      reconContactable: "ksa_recon_dashboard_contactable",
      reconUrlOnly: "ksa_recon_dashboard_url_only",
      reconResidentialRent: "ksa_recon_dashboard_residential_rent",
      reconResidentialBuy: "ksa_recon_dashboard_residential_buy",
      reconCommercial: "ksa_recon_dashboard_commercial",
      reconSummary: "ksa_recon_dashboard_summary",

      module5Summary: "ksa_module5_dashboard_summary",
      module5CityIntel: "ksa_module5_dashboard_city_intelligence",
      module5CityIntelMajor: "ksa_module5_dashboard_city_intelligence_major",
      module5DistrictIntel: "ksa_module5_dashboard_district_intelligence",
      module5MarketDominanceLarge:
        "ksa_module5_dashboard_market_dominance_large_markets",
      module5MarketDominanceSmall:
        "ksa_module5_dashboard_market_dominance_small_markets",
      module5InventoryPressureLarge:
        "ksa_module5_dashboard_inventory_pressure_large_markets",
      module5InventoryPressureSmall:
        "ksa_module5_dashboard_inventory_pressure_small_markets",
      module5AgencyProfilesMajor: "ksa_module5_dashboard_agency_profiles_major",
      module5AgencyProfilesMicro: "ksa_module5_dashboard_agency_profiles_micro",
      module5ActivityPriority: "ksa_module5_dashboard_activity_priority",
      module5ActivityRecon: "ksa_module5_dashboard_activity_recon",
      module5ActivityPressure: "ksa_module5_dashboard_activity_pressure",
      module5ActivityDominance: "ksa_module5_dashboard_activity_dominance",
      module5ActivityAgency: "ksa_module5_dashboard_activity_agency",
      module5CityAliasAudit: "ksa_module5_dashboard_city_alias_audit",
      module5DistrictAliasAudit: "ksa_module5_dashboard_district_alias_audit",
    },
    disabledSections: {
      buildings:
        "KSA building/project coverage is weaker in v1. Use city, district, agency, source URL, and signal fields first.",
    },
  },
};

export const COUNTRY_LIST = Object.values(COUNTRY_CONFIG);

export function isCountrySlug(value: string): value is CountrySlug {
  return value === "uae" || value === "ksa";
}

export function getCountryConfig(slug: string): CountryConfig | undefined {
  if (!isCountrySlug(slug)) return undefined;
  return COUNTRY_CONFIG[slug];
}

export function getCountrySections(country: CountryConfig) {
  return PRODUCT_SECTIONS.map((section) => ({
    ...section,
    disabledReason: country.disabledSections?.[section.slug],
  }));
}