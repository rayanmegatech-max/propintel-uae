import { promises as fs } from "fs";
import path from "path";
import type { CountrySlug } from "@/lib/countries/countryConfig";

const MODULE6_RENDER_LIMIT = 150;

export type Module6Country = "uae" | "ksa";
export type Module6Currency = "AED" | "SAR";

export type Module6AiReconItem = Record<string, unknown> & {
  dashboard_rank?: number | null;
  ai_rank?: number | null;
  rank?: number | null;

  listing_key?: string | null;
  canonical_id?: string | null;
  normalized_id?: string | null;
  recon_id?: number | string | null;

  portal?: string | null;
  schema_name?: string | null;
  portal_id?: string | null;
  source_category?: string | null;
  purpose?: string | null;
  price_frequency?: string | null;

  title?: string | null;
  property_type?: string | null;
  property_type_norm?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size_sqft?: number | null;

  price?: number | null;
  price_amount?: number | null;
  price_per_sqft?: number | null;
  old_price?: number | null;
  new_price?: number | null;
  drop_amount?: number | null;
  drop_pct?: number | null;

  location?: string | null;
  city?: string | null;
  district?: string | null;
  community?: string | null;
  building_name?: string | null;
  market_key?: string | null;
  canonical_market_key?: string | null;

  agency_name?: string | null;
  agency_display_name?: string | null;
  agent_name?: string | null;

  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  contact_email?: string | null;
  has_phone?: number | boolean | string | null;
  has_whatsapp?: number | boolean | string | null;
  has_any_direct_contact?: number | boolean | string | null;
  contact_via_url?: number | boolean | string | null;
  has_phone_available?: number | boolean | string | null;
  has_whatsapp_available?: number | boolean | string | null;
  has_email_available?: number | boolean | string | null;
  is_contactable?: number | boolean | string | null;

  recon_score?: number | null;
  ai_recon_score?: number | null;
  confidence_tier?: string | null;
  confidence_reason?: string | null;
  priority_label?: string | null;
  priority_bucket?: string | null;
  opportunity_lane?: string | null;
  direct_confidence_class?: string | null;
  owner_direct_bucket?: string | null;
  di_pressure_bucket?: string | null;

  is_owner_direct?: number | boolean | string | null;
  is_price_drop?: number | boolean | string | null;
  is_refresh_inflated?: number | boolean | string | null;
  is_url_only?: number | boolean | string | null;

  safe_to_show?: number | boolean | string | null;
  safe_for_frontend?: number | boolean | string | null;
  safe_for_outreach?: number | boolean | string | null;
  is_safe_for_outreach?: number | boolean | string | null;
  outreach_safety_label?: string | null;
  outreach_safety_text?: string | null;
  source_verification_note?: string | null;

  listing_profile_text?: string | null;
  seller_behavior_text?: string | null;
  market_context_text?: string | null;
  ai_summary_text?: string | null;
  narrative_summary?: string | null;
  recommended_action?: string | null;
  recommended_action_text?: string | null;
  recommended_use?: string | null;

  property_url?: string | null;
  source_url?: string | null;

  listing_created_at?: string | null;
  listing_updated_at?: string | null;
  listing_scraped_at?: string | null;
  evidence_date?: string | null;
  generated_at?: string | null;
  built_at?: string | null;
};

export type Module6AiReconPayload = {
  country: Module6Country | string;
  module: string;
  description?: string;
  limit: number;
  exported_count: number;
  items: Module6AiReconItem[];

  currency?: Module6Currency;
  export_key?: string;
  source_table?: string;
  exported_at?: string;
  generated_at?: string | null;
  generated_at_utc?: string | null;
  status?: "ready" | "missing_table" | string;
  total_rows_available?: number;
  exported_rows?: number;
  default_sort?: string | null;
  columns?: string[];
};

export type Module6ManifestPayload = {
  country: Module6Country | string;
  module: string;
  status: string;
  source_file: string;
  output_file: string;
  limit: number;
  exported_count: number;
  skipped_bad_lines: number;
  source_size_bytes: number;
  generated_at_utc: string;
  embeddings_stripped: boolean;
  frontend_safe: boolean;
  notes: string[] | string;

  export_name?: string;
  currency?: Module6Currency;
  database_path?: string;
  exported_at?: string;
  generated_at?: string | null;
  default_limit?: number;
  exports?: Record<
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
  outputs?: Record<string, string>;
  frontend_rules?: Record<string, unknown>;
  do_not_expose_directly?: string[];
};

export type Module6DataResult = {
  status: "ready" | "missing" | "error";
  message: string;
  country: Module6Country;
  currency: Module6Currency;
  manifest: Module6ManifestPayload | null;
  aiRecon: Module6AiReconPayload | null;
  renderLimit: number;
};

type Module6FileConfig = {
  baseDir: string;
  currency: Module6Currency;
  exportCommand: string | null;
  aiReconFile: string;
  manifestFile: string;
};

const FILES: Record<Module6Country, Module6FileConfig> = {
  uae: {
    baseDir: path.join(process.cwd(), "exports", "frontend", "uae"),
    currency: "AED",
    exportCommand: null,
    aiReconFile: "module6_ai_recon.json",
    manifestFile: "module6_manifest.json",
  },
  ksa: {
    baseDir: path.join(process.cwd(), "exports", "frontend", "ksa"),
    currency: "SAR",
    exportCommand: "python tools\\export_ksa_module6_frontend_preview.py",
    aiReconFile: "module6_ai_recon.json",
    manifestFile: "module6_manifest.json",
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

function capAiReconPayload(payload: Module6AiReconPayload): Module6AiReconPayload {
  return {
    ...payload,
    items: payload.items.slice(0, MODULE6_RENDER_LIMIT),
  };
}

function emptyDataResult(
  country: Module6Country,
  currency: Module6Currency,
  message: string,
  status: "missing" | "error"
): Module6DataResult {
  return {
    status,
    message,
    country,
    currency,
    manifest: null,
    aiRecon: null,
    renderLimit: MODULE6_RENDER_LIMIT,
  };
}

function getMissingFilesMessage(
  country: Module6Country,
  config: Module6FileConfig,
  missingFiles: string[]
): string {
  const countryLabel = country.toUpperCase();
  const missingList = missingFiles.join(", ");

  if (country === "uae") {
    return `UAE Module 6 frontend-safe export is not generated yet (${missingList} missing). Expected files are ${config.aiReconFile} and ${config.manifestFile} under exports/frontend/uae once the frontend-safe export is available.`;
  }

  return `Local ${countryLabel} Module 6 export JSON files were not found (${missingList} missing). Run ${config.exportCommand} locally to generate them. Expected files are ${config.aiReconFile} and ${config.manifestFile} under exports/frontend/${country}. Frontend exports should include pre-computed AI narratives and omit vector columns.`;
}

export async function getModule6Data(
  country: CountrySlug
): Promise<Module6DataResult> {
  const config = FILES[country];
  const aiReconPath = path.join(config.baseDir, config.aiReconFile);
  const manifestPath = path.join(config.baseDir, config.manifestFile);

  const [hasAiRecon, hasManifest] = await Promise.all([
    fileExists(aiReconPath),
    fileExists(manifestPath),
  ]);

  if (!hasAiRecon || !hasManifest) {
    const missingFiles = [
      !hasAiRecon ? config.aiReconFile : null,
      !hasManifest ? config.manifestFile : null,
    ].filter((fileName): fileName is string => Boolean(fileName));

    return emptyDataResult(
      country,
      config.currency,
      getMissingFilesMessage(country, config, missingFiles),
      "missing"
    );
  }

  try {
    const [aiRecon, manifest] = await Promise.all([
      readJsonFile<Module6AiReconPayload>(aiReconPath),
      readJsonFile<Module6ManifestPayload>(manifestPath),
    ]);

    return {
      status: "ready",
      message: `${country.toUpperCase()} Module 6 AI Recon export loaded successfully.`,
      country,
      currency: config.currency,
      manifest,
      aiRecon: capAiReconPayload(aiRecon),
      renderLimit: MODULE6_RENDER_LIMIT,
    };
  } catch (error) {
    return emptyDataResult(
      country,
      config.currency,
      error instanceof Error
        ? error.message
        : `Unknown error while loading ${country.toUpperCase()} Module 6 export files.`,
      "error"
    );
  }
}

export function getModule6ExportCommand(country: CountrySlug): string {
  return (
    FILES[country].exportCommand ??
    "UAE Module 6 frontend-safe export is not generated yet."
  );
}
