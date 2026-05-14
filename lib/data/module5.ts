import { promises as fs } from "fs";
import path from "path";
import type { CountrySlug } from "@/lib/countries/countryConfig";
import {
  fetchSupabaseRows,
  isSupabaseServerConfigured,
} from "@/lib/data/supabaseServer";

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

type Module5DataKey = Exclude<Module5FileKey, "manifest">;
type Module5DataOptions = { views?: Module5DataKey[] };

type Module5FileConfig = {
  baseDir: string;
  currency: Module5Currency;
  exportCommand: string;
  files: Partial<Record<Module5FileKey, string>>;
};

type SupabaseModule5Row = {
  country?: string | null;
  view_key?: string | null;
  external_key?: string | null;
  entity_type?: string | null;
  entity_key?: string | null;
  entity_label?: string | null;
  rank?: number | null;
  metric_value?: number | null;
  metric_label?: string | null;
  metric_value_2?: number | null;
  metric_label_2?: string | null;
  change_pct?: number | null;
  trend_direction?: string | null;
  city?: string | null;
  district?: string | null;
  community?: string | null;
  building?: string | null;
  location_label?: string | null;
  agency_name?: string | null;
  agent_name?: string | null;
  source_portal?: string | null;
  source_category?: string | null;
  purpose?: string | null;
  property_type?: string | null;
  recommended_action?: string | null;
  label_1?: string | null;
  label_2?: string | null;
  raw_item?: unknown;
  generated_at?: string | null;
  exported_at?: string | null;
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

const SUPABASE_TABLE = "module5_market_intelligence";
const SUPABASE_SOURCE_TABLE = "public.module5_market_intelligence";
const SUPABASE_DEFAULT_SORT = "rank.asc.nullslast,metric_value.desc.nullslast";
const SUPABASE_QUERY_LIMIT = "150";
const SUPABASE_COLUMNS = [
  "country",
  "view_key",
  "external_key",
  "entity_type",
  "entity_key",
  "entity_label",
  "rank",
  "metric_value",
  "metric_label",
  "metric_value_2",
  "metric_label_2",
  "change_pct",
  "trend_direction",
  "city",
  "district",
  "community",
  "building",
  "location_label",
  "agency_name",
  "agent_name",
  "source_portal",
  "source_category",
  "purpose",
  "property_type",
  "recommended_action",
  "label_1",
  "label_2",
  "generated_at",
  "exported_at",
];

const SUPABASE_VIEW_MAPPING: Record<
  Module5Country,
  Partial<Record<Module5DataKey, string>>
> = {
  uae: {
    summary: "summary",
    activityFeed: "activity_feed",
    marketDominance: "market_dominance",
    inventoryPressure: "inventory_pressure",
    agencyProfiles: "agency_profiles",
    communityIntelligence: "community_intelligence",
    buildingIntelligence: "building_intelligence",
  },
  ksa: {
    summary: "summary",
    activityFeed: "activity_priority",
    cityIntelligence: "city_intelligence",
    cityIntelligenceMajor: "city_intelligence_major",
    districtIntelligence: "district_intelligence",
    marketDominanceLarge: "market_dominance_large",
    inventoryPressureLarge: "inventory_pressure_large",
    agencyProfilesMajor: "agency_profiles_major",
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

function buildReadyResult(
  country: Module5Country,
  currency: Module5Currency,
  manifest: Module5ManifestPayload | null,
  payloads: Partial<Record<Module5DataKey, Module5ListPayload>>,
  message: string
): Module5DataResult {
  return {
    status: "ready",
    message,
    country,
    currency,
    manifest,
    summary: payloads.summary ?? null,
    activityFeed: payloads.activityFeed ?? null,
    marketDominance: payloads.marketDominance ?? null,
    inventoryPressure: payloads.inventoryPressure ?? null,
    agencyProfiles: payloads.agencyProfiles ?? null,
    communityIntelligence: payloads.communityIntelligence ?? null,
    buildingIntelligence: payloads.buildingIntelligence ?? null,
    cityIntelligence: payloads.cityIntelligence ?? null,
    cityIntelligenceMajor: payloads.cityIntelligenceMajor ?? null,
    districtIntelligence: payloads.districtIntelligence ?? null,
    marketDominanceLarge: payloads.marketDominanceLarge ?? null,
    inventoryPressureLarge: payloads.inventoryPressureLarge ?? null,
    agencyProfilesMajor: payloads.agencyProfilesMajor ?? null,
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

function buildSupabaseParams(
  country: Module5Country,
  viewKey: string
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("select", SUPABASE_COLUMNS.join(","));
  params.set("country", `eq.${country}`);
  params.set("view_key", `eq.${viewKey}`);
  params.set("order", SUPABASE_DEFAULT_SORT);
  params.set("limit", SUPABASE_QUERY_LIMIT);
  return params;
}

function getSupabaseExportedAt(rows: SupabaseModule5Row[]): string {
  const firstRow = rows[0];

  return (
    firstRow?.exported_at ??
    firstRow?.generated_at ??
    new Date().toISOString()
  );
}

function buildSupabaseRecord(row: SupabaseModule5Row): Module5Record {
  return {
    external_key: row.external_key,
    entity_type: row.entity_type,
    entity_key: row.entity_key,
    entity_label: row.entity_label,
    rank: row.rank,
    dashboard_rank: row.rank,
    category_rank: row.rank,
    metric_value: row.metric_value,
    metric_label: row.metric_label,
    metric_value_2: row.metric_value_2,
    metric_label_2: row.metric_label_2,
    change_pct: row.change_pct,
    trend_direction: row.trend_direction,
    city: row.city,
    district: row.district,
    community: row.community,
    building: row.building,
    building_name: row.building,
    location_label: row.location_label,
    agency_name: row.agency_name,
    agency_display_name: row.agency_name,
    agent_name: row.agent_name,
    source_portal: row.source_portal,
    portal: row.source_portal,
    source_category: row.source_category,
    purpose: row.purpose,
    property_type: row.property_type,
    recommended_action: row.recommended_action,
    label_1: row.label_1,
    label_2: row.label_2,
    generated_at: row.generated_at,
    exported_at: row.exported_at,
  };
}

function buildSupabasePayload(
  country: Module5Country,
  currency: Module5Currency,
  exportKey: Module5DataKey,
  rows: SupabaseModule5Row[]
): Module5ListPayload {
  return {
    country,
    currency,
    export_key: exportKey,
    source_table: SUPABASE_SOURCE_TABLE,
    exported_at: getSupabaseExportedAt(rows),
    status: "ready",
    total_rows_available: rows.length,
    exported_rows: rows.length,
    default_sort: SUPABASE_DEFAULT_SORT,
    columns: SUPABASE_COLUMNS,
    items: rows.map(buildSupabaseRecord),
  };
}

async function readLocalManifestIfAvailable(
  config: Module5FileConfig
): Promise<Module5ManifestPayload | null> {
  const manifestFile = config.files.manifest;

  if (!manifestFile) {
    return null;
  }

  const manifestPath = path.join(config.baseDir, manifestFile);

  if (!(await fileExists(manifestPath))) {
    return null;
  }

  try {
    return await readJsonFile<Module5ManifestPayload>(manifestPath);
  } catch {
    return null;
  }
}

function createSupabaseManifest(
  country: Module5Country,
  currency: Module5Currency,
  payloads: Partial<Record<Module5DataKey, Module5ListPayload>>,
  viewMapping: Partial<Record<Module5DataKey, string>>
): Module5ManifestPayload {
  const exportedAt =
    Object.values(payloads).find((payload) => payload?.exported_at)
      ?.exported_at ?? new Date().toISOString();

  const exports = Object.entries(payloads).reduce<
    Module5ManifestPayload["exports"]
  >((acc, [key, payload]) => {
    if (!payload) return acc;

    acc[key] = {
      table: SUPABASE_SOURCE_TABLE,
      exists: true,
      total_rows_available: payload.total_rows_available,
      exported_rows: payload.exported_rows,
      output: `supabase:${SUPABASE_TABLE}:${viewMapping[key as Module5DataKey] ?? key}`,
      columns: SUPABASE_COLUMNS,
      sort: SUPABASE_DEFAULT_SORT,
    };

    return acc;
  }, {});

  const outputs = Object.entries(payloads).reduce<
    Module5ManifestPayload["outputs"]
  >((acc, [key, payload]) => {
    if (!payload) return acc;

    acc[key] = `supabase:${SUPABASE_TABLE}:${viewMapping[key as Module5DataKey] ?? key}`;

    return acc;
  }, {});

  return {
    export_name: `${country}_module5_supabase`,
    country,
    currency,
    database_path: `supabase:${SUPABASE_TABLE}`,
    exported_at: exportedAt,
    default_limit: Number(SUPABASE_QUERY_LIMIT),
    exports,
    outputs,
    frontend_rules: {},
    do_not_expose_directly: [],
  };
}

function getRequestedModule5Views(
  viewMapping: Partial<Record<Module5DataKey, string>>,
  options?: Module5DataOptions
): Array<[Module5DataKey, string]> {
  const entries = Object.entries(viewMapping) as Array<[Module5DataKey, string]>;

  if (options?.views === undefined) {
    return entries;
  }

  const requested = new Set(options.views);
  return entries.filter(([key]) => requested.has(key));
}

async function getModule5DataFromSupabase(
  country: Module5Country,
  config: Module5FileConfig,
  options?: Module5DataOptions
): Promise<Module5DataResult | null> {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  const viewMapping = SUPABASE_VIEW_MAPPING[country];

  try {
    const entries = await Promise.all(
      getRequestedModule5Views(viewMapping, options).map(
        async ([exportKey, viewKey]) => {
          const rows = await fetchSupabaseRows<SupabaseModule5Row>(
            SUPABASE_TABLE,
            buildSupabaseParams(country, viewKey)
          );

          return [
            exportKey,
            buildSupabasePayload(country, config.currency, exportKey, rows),
          ] as const;
        }
      )
    );

    const payloads = Object.fromEntries(entries) as Partial<
      Record<Module5DataKey, Module5ListPayload>
    >;

    const localManifest = await readLocalManifestIfAvailable(config);
    const manifest =
      localManifest ??
      createSupabaseManifest(country, config.currency, payloads, viewMapping);

    return buildReadyResult(
      country,
      config.currency,
      manifest,
      payloads,
      `${country.toUpperCase()} Module 5 Supabase data loaded successfully.`
    );
  } catch {
    return null;
  }
}

async function getModule5DataFromScopedLocal(
  country: Module5Country,
  config: Module5FileConfig,
  options: Module5DataOptions
): Promise<Module5DataResult> {
  const requestedViews = options.views ?? [];
  const requestedWithFiles = requestedViews
    .map((key) => [key, config.files[key]] as const)
    .filter((entry): entry is readonly [Module5DataKey, string] =>
      typeof entry[1] === "string"
    );

  const missingRequestedFiles = (
    await Promise.all(
      requestedWithFiles.map(async ([key, fileName]) => ({
        key,
        exists: await fileExists(path.join(config.baseDir, fileName)),
      }))
    )
  ).filter((entry) => !entry.exists);

  if (missingRequestedFiles.length > 0) {
    return emptyDataResult(
      country,
      config.currency,
      `Local ${country.toUpperCase()} Module 5 export JSON files were not found. Run ${config.exportCommand} locally to generate them.`,
      "missing"
    );
  }

  try {
    const entries = await Promise.all(
      requestedWithFiles.map(async ([key, fileName]) => [
        key,
        await readJsonFile<Module5ListPayload>(path.join(config.baseDir, fileName)),
      ] as const)
    );

    const manifest = await readLocalManifestIfAvailable(config);
    const payloads = Object.fromEntries(entries) as Partial<
      Record<Module5DataKey, Module5ListPayload>
    >;

    return buildReadyResult(
      country,
      config.currency,
      manifest,
      payloads,
      `${country.toUpperCase()} Module 5 local export loaded successfully.`
    );
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

export async function getModule5Data(
  country: CountrySlug,
  options?: Module5DataOptions
): Promise<Module5DataResult> {
  const config = FILES[country];

  const supabaseData = await getModule5DataFromSupabase(country, config, options);

  if (supabaseData) {
    return supabaseData;
  }

  if (options?.views !== undefined) {
    return getModule5DataFromScopedLocal(country, config, options);
  }

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
