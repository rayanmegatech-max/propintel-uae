import { promises as fs } from "fs";
import path from "path";
import type { CountrySlug } from "@/lib/countries/countryConfig";

export type Module5Country = "uae" | "ksa";
export type Module5Currency = "AED" | "SAR";

export type Module5Record = Record<string, unknown> & {
  dashboard_rank?: number | null;
  category_rank?: number | null;
  activity_rank?: number | null;
  activity_score?: number | null;
  activity_bucket?: string | null;

  activity_type?: string | null;
  activity_label?: string | null;
  activity_date?: string | null;
  activity_at?: string | null;
  activity_summary?: string | null;
  activity_priority_label?: string | null;

  card_type?: string | null;
  card_subtype?: string | null;
  card_title?: string | null;
  card_summary?: string | null;

  recommended_action?: string | null;
  recommended_use?: string | null;
  recommended_interpretation?: string | null;
  cta_label?: string | null;

  listing_key?: string | null;
  normalized_id?: string | null;
  canonical_id?: string | null;

  portal?: string | null;
  source_portal?: string | null;
  source_category?: string | null;
  purpose?: string | null;
  rental_mode?: string | null;

  city?: string | null;
  community?: string | null;
  building_name?: string | null;
  district?: string | null;
  city_display_name?: string | null;
  district_display_name?: string | null;
  market_key?: string | null;
  canonical_market_key?: string | null;

  agency_name?: string | null;
  agency_display_name?: string | null;
  agency_id?: string | null;
  agency_public_key?: string | null;
  agent_name?: string | null;

  top_agency_name?: string | null;
  top_agency_share_pct?: number | null;
  top3_agency_share_pct?: number | null;
  top_5_agency_share_pct?: number | null;
  top_agencies_summary?: string | null;

  dashboard_level?: string | null;
  market_level?: string | null;
  dashboard_card_type?: string | null;
  dashboard_use_case?: string | null;
  intelligence_label?: string | null;
  activity_summary_label?: string | null;

  property_type?: string | null;
  property_type_norm?: string | null;
  bedrooms?: number | null;
  size_sqft?: number | null;

  active_listings?: number | null;
  total_listings?: number | null;
  agencies?: number | null;
  total_agencies?: number | null;
  unique_agencies?: number | null;
  agents?: number | null;
  total_agents?: number | null;
  unique_agents?: number | null;
  buildings?: number | null;
  building_count?: number | null;
  unique_districts?: number | null;

  price?: number | null;
  price_amount?: number | null;
  avg_price?: number | null;
  price_per_sqft?: number | null;
  avg_price_per_sqft?: number | null;
  old_price?: number | null;
  new_price?: number | null;
  drop_amount?: number | null;
  drop_pct?: number | null;
  avg_drop_amount?: number | null;
  avg_drop_pct?: number | null;
  price_change_amount?: number | null;
  price_change_pct?: number | null;
  price_direction?: string | null;

  price_drop_count?: number | null;
  price_drop_rate_pct?: number | null;
  stale_price_drop_count?: number | null;
  stale_price_drop_rate_pct?: number | null;
  refresh_inflated_count?: number | null;
  refresh_inflated_rate_pct?: number | null;
  owner_direct_count?: number | null;
  owner_direct_rate_pct?: number | null;
  old_inventory_count?: number | null;
  old_inventory_rate_pct?: number | null;
  recon_signal_rows?: number | null;
  recon_rate_pct?: number | null;
  contactable_rate_pct?: number | null;
  refresh_rate_pct?: number | null;

  pressure_score?: number | null;
  inventory_pressure_score?: number | null;
  pressure_bucket?: string | null;
  pressure_label?: string | null;
  pressure_reason?: string | null;
  pressure_action?: string | null;

  dominance_score?: number | null;
  dominance_share_pct?: number | null;
  concentration_bucket?: string | null;
  concentration_label?: string | null;
  hhi_agency?: number | null;

  recon_score?: number | null;
  avg_recon_score?: number | null;
  signal_count?: number | null;

  explanation?: string | null;
  interpretation_note?: string | null;
  product_note?: string | null;

  property_url?: string | null;
  source_url?: string | null;

  confidence_tier?: string | null;
  built_at?: string | null;
  generated_at?: string | null;
  evidence_date?: string | null;
};

export type Module5ActivityRecord = Module5Record;

export type Module5ListPayload = {
  country: Module5Country;
  currency: Module5Currency;
  export_key: string;
  source_table: string;
  exported_at: string;
  status: "ready" | "missing_table" | string;
  total_rows_available: number;
  exported_rows: number;
  default_sort: string | null;
  columns?: string[];
  items: Module5Record[];
};

export type Module5ManifestPayload = {
  export_name: string;
  country: Module5Country;
  currency: Module5Currency;
  database_path: string;
  exported_at: string;
  default_limit: number;
  exports: Record<
    string,
    {
      table: string;
      exists: boolean;
      total_rows_available: number;
      exported_rows: number;
      output: string;
      columns: string[];
      sort: string | null;
    }
  >;
  outputs: Record<string, string>;
  frontend_rules: Record<string, unknown>;
  do_not_expose_directly: string[];
};

export type Module5DataResult = {
  status: "ready" | "missing" | "error";
  message: string;
  country: Module5Country;
  currency: Module5Currency;
  manifest: Module5ManifestPayload | null;

  summary: Module5ListPayload | null;
  activityFeed: Module5ListPayload | null;

  marketDominance: Module5ListPayload | null;
  inventoryPressure: Module5ListPayload | null;
  agencyProfiles: Module5ListPayload | null;

  communityIntelligence: Module5ListPayload | null;
  buildingIntelligence: Module5ListPayload | null;

  cityIntelligence: Module5ListPayload | null;
  cityIntelligenceMajor: Module5ListPayload | null;
  districtIntelligence: Module5ListPayload | null;
  marketDominanceLarge: Module5ListPayload | null;
  inventoryPressureLarge: Module5ListPayload | null;
  agencyProfilesMajor: Module5ListPayload | null;
};

type Module5FileKey =
  | "manifest"
  | "summary"
  | "activityFeed"
  | "marketDominance"
  | "inventoryPressure"
  | "agencyProfiles"
  | "communityIntelligence"
  | "buildingIntelligence"
  | "cityIntelligence"
  | "cityIntelligenceMajor"
  | "districtIntelligence"
  | "marketDominanceLarge"
  | "inventoryPressureLarge"
  | "agencyProfilesMajor";

type Module5FileConfig = {
  baseDir: string;
  currency: Module5Currency;
  exportCommand: string;
  files: Partial<Record<Module5FileKey, string>>;
};

const FILES: Record<Module5Country, Module5FileConfig> = {
  uae: {
    baseDir: path.join(process.cwd(), "exports", "frontend", "uae"),
    currency: "AED",
    exportCommand: "python tools\\export_uae_module5_frontend_data.py",
    files: {
      manifest: "module5_manifest.json",
      summary: "module5_summary.json",
      activityFeed: "module5_activity_feed.json",
      marketDominance: "module5_market_dominance.json",
      inventoryPressure: "module5_inventory_pressure.json",
      agencyProfiles: "module5_agency_profiles.json",
      communityIntelligence: "module5_community_intelligence.json",
      buildingIntelligence: "module5_building_intelligence.json",
    },
  },
  ksa: {
    baseDir: path.join(process.cwd(), "exports", "frontend", "ksa"),
    currency: "SAR",
    exportCommand: "python tools\\export_ksa_module5_frontend_data.py",
    files: {
      manifest: "module5_manifest.json",
      summary: "module5_summary.json",
      activityFeed: "module5_activity_priority.json",
      cityIntelligence: "module5_city_intelligence.json",
      cityIntelligenceMajor: "module5_city_intelligence_major.json",
      districtIntelligence: "module5_district_intelligence.json",
      marketDominanceLarge: "module5_market_dominance_large.json",
      inventoryPressureLarge: "module5_inventory_pressure_large.json",
      agencyProfilesMajor: "module5_agency_profiles_major.json",
    },
  },
};

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function emptyDataResult(
  country: Module5Country,
  currency: Module5Currency,
  message: string,
  status: "missing" | "error"
): Module5DataResult {
  return {
    status,
    message,
    country,
    currency,
    manifest: null,
    summary: null,
    activityFeed: null,
    marketDominance: null,
    inventoryPressure: null,
    agencyProfiles: null,
    communityIntelligence: null,
    buildingIntelligence: null,
    cityIntelligence: null,
    cityIntelligenceMajor: null,
    districtIntelligence: null,
    marketDominanceLarge: null,
    inventoryPressureLarge: null,
    agencyProfilesMajor: null,
  };
}

async function readOptionalPayload(
  baseDir: string,
  fileName: string | undefined
): Promise<Module5ListPayload | null> {
  if (!fileName) return null;

  const filePath = path.join(baseDir, fileName);

  if (!(await fileExists(filePath))) {
    return null;
  }

  return readJsonFile<Module5ListPayload>(filePath);
}

export async function getModule5Data(
  country: CountrySlug
): Promise<Module5DataResult> {
  const config = FILES[country];
  const manifestFile = config.files.manifest;
  const activityFile = config.files.activityFeed;

  if (!manifestFile || !activityFile) {
    return emptyDataResult(
      country,
      config.currency,
      `Module 5 file configuration is incomplete for ${country.toUpperCase()}.`,
      "error"
    );
  }

  const manifestPath = path.join(config.baseDir, manifestFile);
  const activityPath = path.join(config.baseDir, activityFile);

  const [hasManifest, hasActivityFeed] = await Promise.all([
    fileExists(manifestPath),
    fileExists(activityPath),
  ]);

  if (!hasManifest || !hasActivityFeed) {
    return emptyDataResult(
      country,
      config.currency,
      `Local ${country.toUpperCase()} Module 5 export JSON files were not found. Run ${config.exportCommand} locally to generate them.`,
      "missing"
    );
  }

  try {
    const [
      manifest,
      summary,
      activityFeed,
      marketDominance,
      inventoryPressure,
      agencyProfiles,
      communityIntelligence,
      buildingIntelligence,
      cityIntelligence,
      cityIntelligenceMajor,
      districtIntelligence,
      marketDominanceLarge,
      inventoryPressureLarge,
      agencyProfilesMajor,
    ] = await Promise.all([
      readJsonFile<Module5ManifestPayload>(manifestPath),
      readOptionalPayload(config.baseDir, config.files.summary),
      readJsonFile<Module5ListPayload>(activityPath),
      readOptionalPayload(config.baseDir, config.files.marketDominance),
      readOptionalPayload(config.baseDir, config.files.inventoryPressure),
      readOptionalPayload(config.baseDir, config.files.agencyProfiles),
      readOptionalPayload(config.baseDir, config.files.communityIntelligence),
      readOptionalPayload(config.baseDir, config.files.buildingIntelligence),
      readOptionalPayload(config.baseDir, config.files.cityIntelligence),
      readOptionalPayload(config.baseDir, config.files.cityIntelligenceMajor),
      readOptionalPayload(config.baseDir, config.files.districtIntelligence),
      readOptionalPayload(config.baseDir, config.files.marketDominanceLarge),
      readOptionalPayload(config.baseDir, config.files.inventoryPressureLarge),
      readOptionalPayload(config.baseDir, config.files.agencyProfilesMajor),
    ]);

    return {
      status: "ready",
      message: `${country.toUpperCase()} Module 5 local export loaded successfully.`,
      country,
      currency: config.currency,
      manifest,
      summary,
      activityFeed,
      marketDominance,
      inventoryPressure,
      agencyProfiles,
      communityIntelligence,
      buildingIntelligence,
      cityIntelligence,
      cityIntelligenceMajor,
      districtIntelligence,
      marketDominanceLarge,
      inventoryPressureLarge,
      agencyProfilesMajor,
    };
  } catch (error) {
    return emptyDataResult(
      country,
      config.currency,
      error instanceof Error
        ? error.message
        : `Unknown error while loading ${country.toUpperCase()} Module 5 export files.`,
      "error"
    );
  }
}

export function getModule5ExportCommand(country: CountrySlug): string {
  return FILES[country].exportCommand;
}