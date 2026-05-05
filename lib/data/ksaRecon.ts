import { promises as fs } from "fs";
import path from "path";

export type KsaReconOpportunity = Record<string, unknown> & {
  dashboard_rank?: number | null;
  recon_id?: number | null;
  listing_key?: string | null;
  canonical_id?: string | null;
  portal?: string | null;
  schema_name?: string | null;
  portal_id?: string | null;

  primary_opportunity_type?: string | null;
  opportunity_group?: string | null;
  opportunity_title?: string | null;

  recon_score?: number | null;
  recon_rank?: number | null;
  confidence_tier?: string | null;
  confidence_reason?: string | null;
  priority_label?: string | null;

  is_owner_direct?: number | null;
  is_price_drop?: number | null;
  is_refresh_inflated?: number | null;
  is_contactable?: number | null;
  is_url_only?: number | null;

  badges_json?: string | null;
  badges?: unknown;

  recommended_action?: string | null;
  portal_action_label?: string | null;
  action_priority?: string | null;
  cta_text?: string | null;

  source_category?: string | null;
  purpose?: string | null;
  price_frequency?: string | null;

  title?: string | null;
  property_type?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size_sqft?: number | null;

  city?: string | null;
  district?: string | null;
  community?: string | null;
  building_name?: string | null;
  source_url?: string | null;
  property_url?: string | null;

  price?: number | null;
  price_per_sqft?: number | null;
  old_price?: number | null;
  new_price?: number | null;
  drop_amount?: number | null;
  drop_pct?: number | null;

  age_label?: string | null;
  refresh_inflation_label?: string | null;
  effective_true_age_days?: number | null;

  owner_direct_bucket?: string | null;
  owner_direct_label?: string | null;
  owner_direct_confidence_tier?: string | null;

  agent_name?: string | null;
  agency_name?: string | null;

  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  contact_email?: string | null;

  has_phone_available?: number | null;
  has_whatsapp_available?: number | null;
  has_email_available?: number | null;

  listing_created_at?: string | null;
  listing_updated_at?: string | null;
  listing_scraped_at?: string | null;
  built_at?: string | null;
};

export type KsaReconListPayload = {
  country: "ksa";
  currency: "SAR";
  source_table: string;
  exported_at: string;
  total_rows_available: number;
  exported_rows: number;
  default_sort: string;
  columns?: string[];
  items: KsaReconOpportunity[];
};

export type KsaReconSummaryPayload = {
  country: "ksa";
  currency: "SAR";
  source_table: string;
  exported_at: string;
  total_rows_available: number;
  items: Record<string, unknown>[];
};

export type KsaReconManifestPayload = {
  export_name: string;
  country: "ksa";
  currency: "SAR";
  database_path: string;
  exported_at: string;
  limit: number;
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
  summary: {
    table: string;
    exists: boolean;
    total_rows_available: number;
    exported_rows: number;
    output: string;
  };
  frontend_rules: Record<string, unknown>;
  do_not_expose_directly: string[];
};

export type KsaReconDataResult = {
  status: "ready" | "missing" | "error";
  message: string;
  manifest: KsaReconManifestPayload | null;
  summary: KsaReconSummaryPayload | null;
  lists: {
    hotLeads: KsaReconListPayload | null;
    multiSignal: KsaReconListPayload | null;
    ownerDirect: KsaReconListPayload | null;
    priceDrops: KsaReconListPayload | null;
    refreshInflation: KsaReconListPayload | null;
    contactable: KsaReconListPayload | null;
    urlOnly: KsaReconListPayload | null;
    residentialRent: KsaReconListPayload | null;
    residentialBuy: KsaReconListPayload | null;
    commercial: KsaReconListPayload | null;
  };
};

const EXPORT_BASE_DIR = path.join(process.cwd(), "exports", "frontend", "ksa");

const FILES = {
  hotLeads: "recon_hot_leads.json",
  multiSignal: "recon_multi_signal.json",
  ownerDirect: "recon_owner_direct.json",
  priceDrops: "recon_price_drops.json",
  refreshInflation: "recon_refresh_inflation.json",
  contactable: "recon_contactable.json",
  urlOnly: "recon_url_only.json",
  residentialRent: "recon_residential_rent.json",
  residentialBuy: "recon_residential_buy.json",
  commercial: "recon_commercial.json",
  summary: "recon_summary.json",
  manifest: "recon_manifest.json",
};

async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(EXPORT_BASE_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function fileExists(fileName: string): Promise<boolean> {
  try {
    await fs.access(path.join(EXPORT_BASE_DIR, fileName));
    return true;
  } catch {
    return false;
  }
}

export async function getKsaReconData(): Promise<KsaReconDataResult> {
  const requiredFiles = Object.values(FILES);
  const existence = await Promise.all(requiredFiles.map(fileExists));

  if (!existence.every(Boolean)) {
    return {
      status: "missing",
      message:
        "Local KSA Recon export JSON files were not found. Run tools/export_ksa_recon_frontend_data.py locally to generate them.",
      manifest: null,
      summary: null,
      lists: {
        hotLeads: null,
        multiSignal: null,
        ownerDirect: null,
        priceDrops: null,
        refreshInflation: null,
        contactable: null,
        urlOnly: null,
        residentialRent: null,
        residentialBuy: null,
        commercial: null,
      },
    };
  }

  try {
    const [
      hotLeads,
      multiSignal,
      ownerDirect,
      priceDrops,
      refreshInflation,
      contactable,
      urlOnly,
      residentialRent,
      residentialBuy,
      commercial,
      summary,
      manifest,
    ] = await Promise.all([
      readJsonFile<KsaReconListPayload>(FILES.hotLeads),
      readJsonFile<KsaReconListPayload>(FILES.multiSignal),
      readJsonFile<KsaReconListPayload>(FILES.ownerDirect),
      readJsonFile<KsaReconListPayload>(FILES.priceDrops),
      readJsonFile<KsaReconListPayload>(FILES.refreshInflation),
      readJsonFile<KsaReconListPayload>(FILES.contactable),
      readJsonFile<KsaReconListPayload>(FILES.urlOnly),
      readJsonFile<KsaReconListPayload>(FILES.residentialRent),
      readJsonFile<KsaReconListPayload>(FILES.residentialBuy),
      readJsonFile<KsaReconListPayload>(FILES.commercial),
      readJsonFile<KsaReconSummaryPayload>(FILES.summary),
      readJsonFile<KsaReconManifestPayload>(FILES.manifest),
    ]);

    return {
      status: "ready",
      message: "KSA Recon local export loaded successfully.",
      manifest,
      summary,
      lists: {
        hotLeads,
        multiSignal,
        ownerDirect,
        priceDrops,
        refreshInflation,
        contactable,
        urlOnly,
        residentialRent,
        residentialBuy,
        commercial,
      },
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unknown error while loading KSA Recon export files.",
      manifest: null,
      summary: null,
      lists: {
        hotLeads: null,
        multiSignal: null,
        ownerDirect: null,
        priceDrops: null,
        refreshInflation: null,
        contactable: null,
        urlOnly: null,
        residentialRent: null,
        residentialBuy: null,
        commercial: null,
      },
    };
  }
}