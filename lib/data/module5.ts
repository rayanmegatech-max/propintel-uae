import { promises as fs } from "fs";
import path from "path";
import type { CountrySlug } from "@/lib/countries/countryConfig";

export type Module5Country = "uae" | "ksa";
export type Module5Currency = "AED" | "SAR";

export type Module5ActivityRecord = Record<string, unknown> & {
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

  agency_name?: string | null;
  agency_display_name?: string | null;
  agency_id?: string | null;
  agency_public_key?: string | null;
  agent_name?: string | null;

  property_type?: string | null;
  property_type_norm?: string | null;
  bedrooms?: number | null;
  size_sqft?: number | null;

  price?: number | null;
  price_amount?: number | null;
  price_per_sqft?: number | null;
  old_price?: number | null;
  new_price?: number | null;
  drop_amount?: number | null;
  drop_pct?: number | null;
  price_change_amount?: number | null;
  price_change_pct?: number | null;
  price_direction?: string | null;

  pressure_score?: number | null;
  pressure_bucket?: string | null;
  dominance_share_pct?: number | null;
  concentration_bucket?: string | null;
  recon_score?: number | null;
  signal_count?: number | null;

  property_url?: string | null;
  source_url?: string | null;

  confidence_tier?: string | null;
  product_note?: string | null;
  built_at?: string | null;
  generated_at?: string | null;
  evidence_date?: string | null;
};

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
  items: Module5ActivityRecord[];
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
  activityFeed: Module5ListPayload | null;
};

const FILES: Record<
  Module5Country,
  {
    baseDir: string;
    manifest: string;
    activityFeed: string;
    currency: Module5Currency;
    exportCommand: string;
  }
> = {
  uae: {
    baseDir: path.join(process.cwd(), "exports", "frontend", "uae"),
    manifest: "module5_manifest.json",
    activityFeed: "module5_activity_feed.json",
    currency: "AED",
    exportCommand: "python tools\\export_uae_module5_frontend_data.py",
  },
  ksa: {
    baseDir: path.join(process.cwd(), "exports", "frontend", "ksa"),
    manifest: "module5_manifest.json",
    activityFeed: "module5_activity_priority.json",
    currency: "SAR",
    exportCommand: "python tools\\export_ksa_module5_frontend_data.py",
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

export async function getModule5Data(
  country: CountrySlug
): Promise<Module5DataResult> {
  const config = FILES[country];

  const manifestPath = path.join(config.baseDir, config.manifest);
  const activityPath = path.join(config.baseDir, config.activityFeed);

  const [hasManifest, hasActivityFeed] = await Promise.all([
    fileExists(manifestPath),
    fileExists(activityPath),
  ]);

  if (!hasManifest || !hasActivityFeed) {
    return {
      status: "missing",
      message: `Local ${country.toUpperCase()} Module 5 export JSON files were not found. Run ${config.exportCommand} locally to generate them.`,
      country,
      currency: config.currency,
      manifest: null,
      activityFeed: null,
    };
  }

  try {
    const [manifest, activityFeed] = await Promise.all([
      readJsonFile<Module5ManifestPayload>(manifestPath),
      readJsonFile<Module5ListPayload>(activityPath),
    ]);

    return {
      status: "ready",
      message: `${country.toUpperCase()} Module 5 local export loaded successfully.`,
      country,
      currency: config.currency,
      manifest,
      activityFeed,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : `Unknown error while loading ${country.toUpperCase()} Module 5 export files.`,
      country,
      currency: config.currency,
      manifest: null,
      activityFeed: null,
    };
  }
}

export function getModule5ExportCommand(country: CountrySlug): string {
  return FILES[country].exportCommand;
}