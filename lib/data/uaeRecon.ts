import { promises as fs } from "fs";
import path from "path";

// ─── Render cap ────────────────────────────────────────────────────────────────
// Vercel-safe maximum items passed to the React render tree per list.
// Increased from 150 to avoid over-truncating portal-balanced exports.
const RECON_RENDER_LIMIT = 150;

// Minimum rows to include per portal before filling the remaining budget
// in original order.  Prevents Property Finder starvation when PF rows
// appear late in the export (lower dashboard_rank than bayut / dubizzle).
// Full database totals (total_rows_available, exported_rows) are untouched.
const MIN_PER_PORTAL_RENDER = 40;

export type UaeReconOpportunity = Record<string, unknown> & {
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
  is_stale?: number | null;
  is_old_inventory?: number | null;
  is_very_old_inventory?: number | null;
  is_refresh_inflated?: number | null;
  is_severe_refresh_inflation?: number | null;

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
  community?: string | null;
  building_name?: string | null;
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

export type UaeReconListPayload = {
  country: "uae";
  currency: "AED";
  source_table: string;
  exported_at: string;
  total_rows_available: number;
  exported_rows: number;
  default_sort: string;
  columns?: string[];
  items: UaeReconOpportunity[];
};

export type UaeReconSummaryPayload = {
  country: "uae";
  currency: "AED";
  source_table: string;
  exported_at: string;
  total_rows_available: number;
  items: Record<string, unknown>[];
};

export type UaeReconManifestPayload = {
  export_name: string;
  country: "uae";
  currency: "AED";
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

export type UaeReconDataResult = {
  status: "ready" | "missing" | "error";
  message: string;
  manifest: UaeReconManifestPayload | null;
  summary: UaeReconSummaryPayload | null;
  lists: {
    hotLeads: UaeReconListPayload | null;
    priceDrops: UaeReconListPayload | null;
    ownerDirect: UaeReconListPayload | null;
    stalePriceDrops: UaeReconListPayload | null;
    refreshInflated: UaeReconListPayload | null;
    listingTruth: UaeReconListPayload | null;
    residentialRent: UaeReconListPayload | null;
    residentialBuy: UaeReconListPayload | null;
    commercial: UaeReconListPayload | null;
    shortRental: UaeReconListPayload | null;
  };
};

const EXPORT_BASE_DIR = path.join(process.cwd(), "exports", "frontend", "uae");

const FILES = {
  hotLeads: "recon_hot_leads.json",
  priceDrops: "recon_price_drops.json",
  ownerDirect: "recon_owner_direct.json",
  stalePriceDrops: "recon_stale_price_drops.json",
  refreshInflated: "recon_refresh_inflated.json",
  listingTruth: "recon_listing_truth.json",
  residentialRent: "recon_residential_rent.json",
  residentialBuy: "recon_residential_buy.json",
  commercial: "recon_commercial.json",
  shortRental: "recon_short_rental.json",
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

function emptyLists(): UaeReconDataResult["lists"] {
  return {
    hotLeads: null,
    priceDrops: null,
    ownerDirect: null,
    stalePriceDrops: null,
    refreshInflated: null,
    listingTruth: null,
    residentialRent: null,
    residentialBuy: null,
    commercial: null,
    shortRental: null,
  };
}

// ─── Portal-balanced render cap ────────────────────────────────────────────────
// Replaces the previous simple slice(0, RECON_RENDER_LIMIT) approach.
//
// Why: a plain slice removes Property Finder rows when they appear late in
// the export (lower dashboard_rank than bayut / dubizzle rows).  The filter
// dropdown then only shows "Bayut" and "Dubizzle" because filter options are
// built from rendered items.
//
// How:
//   Phase 1 – Per-portal quota: include up to MIN_PER_PORTAL_RENDER rows from
//              each portal value (bayut, dubizzle, pf, …) preserving their
//              original within-portal order.
//   Phase 2 – Global fill: add remaining budget from original list order.
//   Reconstruction: sorted by original index so global ranking is preserved
//                   as much as possible within the final selection.
//
// Metadata fields (total_rows_available, exported_rows, etc.) are untouched.

function getPortalKey(item: UaeReconOpportunity): string | null {
  const raw = item.portal;
  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw.trim().toLowerCase();
  }
  return null;
}

function capListBalanced<T extends UaeReconListPayload | null>(list: T): T {
  if (!list) return list;

  const items = list.items;

  // No cap needed when items fit within the limit.
  if (items.length <= RECON_RENDER_LIMIT) {
    return { ...list, items } as T;
  }

  // Build per-portal index buckets, preserving original item order within each bucket.
  const portalBuckets = new Map<string, number[]>();
  for (let i = 0; i < items.length; i++) {
    const key = getPortalKey(items[i]) ?? "__none__";
    if (!portalBuckets.has(key)) portalBuckets.set(key, []);
    portalBuckets.get(key)!.push(i);
  }

  const realPortals = [...portalBuckets.keys()].filter((k) => k !== "__none__");

  // Fall back to simple slice when there is no meaningful portal variety.
  if (realPortals.length <= 1) {
    return { ...list, items: items.slice(0, RECON_RENDER_LIMIT) } as T;
  }

  const included = new Set<number>();

  // Phase 1 – per-portal quota (up to MIN_PER_PORTAL_RENDER rows per portal).
  for (const key of realPortals) {
    if (included.size >= RECON_RENDER_LIMIT) break;
    const bucket = portalBuckets.get(key)!;
    const quota = Math.min(
      MIN_PER_PORTAL_RENDER,
      RECON_RENDER_LIMIT - included.size
    );
    let added = 0;
    for (const idx of bucket) {
      if (added >= quota || included.size >= RECON_RENDER_LIMIT) break;
      included.add(idx);
      added++;
    }
  }

  // Phase 2 – fill remaining budget in original list order (Set deduplicates).
  for (let i = 0; i < items.length && included.size < RECON_RENDER_LIMIT; i++) {
    included.add(i);
  }

  // Reconstruct in ascending index order to preserve ranking as much as possible.
  const result = [...included]
    .sort((a, b) => a - b)
    .map((i) => items[i]);

  return { ...list, items: result } as T;
}

// ─── Data loader ──────────────────────────────────────────────────────────────

export async function getUaeReconData(): Promise<UaeReconDataResult> {
  const requiredFiles = Object.values(FILES);
  const existence = await Promise.all(requiredFiles.map(fileExists));

  if (!existence.every(Boolean)) {
    return {
      status: "missing",
      message:
        "Local UAE Recon export JSON files were not found. Run tools/export_uae_recon_frontend_data.py locally to generate them.",
      manifest: null,
      summary: null,
      lists: emptyLists(),
    };
  }

  try {
    const [
      hotLeads,
      priceDrops,
      ownerDirect,
      stalePriceDrops,
      refreshInflated,
      listingTruth,
      residentialRent,
      residentialBuy,
      commercial,
      shortRental,
      summary,
      manifest,
    ] = await Promise.all([
      readJsonFile<UaeReconListPayload>(FILES.hotLeads),
      readJsonFile<UaeReconListPayload>(FILES.priceDrops),
      readJsonFile<UaeReconListPayload>(FILES.ownerDirect),
      readJsonFile<UaeReconListPayload>(FILES.stalePriceDrops),
      readJsonFile<UaeReconListPayload>(FILES.refreshInflated),
      readJsonFile<UaeReconListPayload>(FILES.listingTruth),
      readJsonFile<UaeReconListPayload>(FILES.residentialRent),
      readJsonFile<UaeReconListPayload>(FILES.residentialBuy),
      readJsonFile<UaeReconListPayload>(FILES.commercial),
      readJsonFile<UaeReconListPayload>(FILES.shortRental),
      readJsonFile<UaeReconSummaryPayload>(FILES.summary),
      readJsonFile<UaeReconManifestPayload>(FILES.manifest),
    ]);

    return {
      status: "ready",
      message: "UAE Recon local export loaded successfully.",
      manifest,
      summary,
      lists: {
        hotLeads: capListBalanced(hotLeads),
        priceDrops: capListBalanced(priceDrops),
        ownerDirect: capListBalanced(ownerDirect),
        stalePriceDrops: capListBalanced(stalePriceDrops),
        refreshInflated: capListBalanced(refreshInflated),
        listingTruth: capListBalanced(listingTruth),
        residentialRent: capListBalanced(residentialRent),
        residentialBuy: capListBalanced(residentialBuy),
        commercial: capListBalanced(commercial),
        shortRental: capListBalanced(shortRental),
      },
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unknown error while loading UAE Recon export files.",
      manifest: null,
      summary: null,
      lists: emptyLists(),
    };
  }
}
