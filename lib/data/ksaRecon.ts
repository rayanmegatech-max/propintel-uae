import { promises as fs } from "fs";
import path from "path";
import {
  fetchSupabaseRows,
  isSupabaseServerConfigured,
} from "./supabaseServer";

const RECON_RENDER_LIMIT = 150;

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
  price_amount?: number | null;
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

type KsaReconListKey = keyof KsaReconDataResult["lists"];
type KsaReconDataOptions = { views?: KsaReconListKey[] };

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

const SUPABASE_TABLE = "recon_opportunities";
const SUPABASE_SOURCE_TABLE = "public.recon_opportunities";
const SUPABASE_DEFAULT_SORT = "rank.asc.nullslast,score.desc.nullslast";
const SUPABASE_QUERY_LIMIT = "150";

const SUPABASE_COLUMNS = [
  "country",
  "view_key",
  "external_key",
  "rank",
  "score",
  "priority",
  "city",
  "district",
  "community",
  "location_label",
  "source_portal",
  "source_category",
  "purpose",
  "property_type",
  "title",
  "price",
  "old_price",
  "new_price",
  "drop_amount",
  "drop_pct",
  "agent_name",
  "agency_name",
  "listing_url",
  "source_url",
  "has_phone",
  "has_whatsapp",
  "has_email",
  "has_contact",
  "is_owner_direct",
  "has_price_movement",
  "has_refresh_signal",
  "true_age_days",
  "recommended_action",
  "badges",
  "generated_at",
  "exported_at",
];

type SupabaseReconRow = {
  country?: string | null;
  view_key?: string | null;
  external_key?: string | null;
  rank?: number | null;
  score?: number | null;
  priority?: string | null;
  city?: string | null;
  district?: string | null;
  community?: string | null;
  location_label?: string | null;
  source_portal?: string | null;
  source_category?: string | null;
  purpose?: string | null;
  property_type?: string | null;
  title?: string | null;
  price?: number | null;
  old_price?: number | null;
  new_price?: number | null;
  drop_amount?: number | null;
  drop_pct?: number | null;
  agent_name?: string | null;
  agency_name?: string | null;
  listing_url?: string | null;
  source_url?: string | null;
  has_phone?: boolean | number | string | null;
  has_whatsapp?: boolean | number | string | null;
  has_email?: boolean | number | string | null;
  has_contact?: boolean | number | string | null;
  is_owner_direct?: boolean | number | string | null;
  has_price_movement?: boolean | number | string | null;
  has_refresh_signal?: boolean | number | string | null;
  true_age_days?: number | null;
  recommended_action?: string | null;
  badges?: unknown;
  raw_item?: unknown;
  generated_at?: string | null;
  exported_at?: string | null;
};

const KSA_SUPABASE_VIEWS = {
  hotLeads: "hot_leads",
  multiSignal: "multi_signal",
  ownerDirect: "owner_direct",
  priceDrops: "price_drops",
  refreshInflation: "refresh_inflation",
  contactable: "contactable",
  urlOnly: "url_only",
  residentialRent: "residential_rent",
  residentialBuy: "residential_buy",
  commercial: "commercial",
} as const satisfies Record<KsaReconListKey, string>;

async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(EXPORT_BASE_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function readOptionalJsonFile<T>(fileName: string): Promise<T | null> {
  try {
    return await readJsonFile<T>(fileName);
  } catch {
    return null;
  }
}

async function fileExists(fileName: string): Promise<boolean> {
  try {
    await fs.access(path.join(EXPORT_BASE_DIR, fileName));
    return true;
  } catch {
    return false;
  }
}

function capList<T extends KsaReconListPayload | null>(list: T): T {
  if (!list) return list;
  return {
    ...list,
    items: list.items.slice(0, RECON_RENDER_LIMIT),
  } as T;
}

function emptyLists(): KsaReconDataResult["lists"] {
  return {
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
  };
}

function getRequestedViews(options?: KsaReconDataOptions): KsaReconListKey[] {
  return options?.views ?? (Object.keys(KSA_SUPABASE_VIEWS) as KsaReconListKey[]);
}

function capLists(lists: KsaReconDataResult["lists"]): KsaReconDataResult["lists"] {
  return {
    hotLeads: capList(lists.hotLeads),
    multiSignal: capList(lists.multiSignal),
    ownerDirect: capList(lists.ownerDirect),
    priceDrops: capList(lists.priceDrops),
    refreshInflation: capList(lists.refreshInflation),
    contactable: capList(lists.contactable),
    urlOnly: capList(lists.urlOnly),
    residentialRent: capList(lists.residentialRent),
    residentialBuy: capList(lists.residentialBuy),
    commercial: capList(lists.commercial),
  };
}

function booleanFlag(value: unknown): number {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value !== 0 ? 1 : 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes"
      ? 1
      : 0;
  }
  return 0;
}

function buildSupabaseParams(viewKey: string): URLSearchParams {
  const params = new URLSearchParams();
  params.set("select", SUPABASE_COLUMNS.join(","));
  params.set("country", "eq.ksa");
  params.set("view_key", `eq.${viewKey}`);
  params.set("order", SUPABASE_DEFAULT_SORT);
  params.set("limit", SUPABASE_QUERY_LIMIT);
  return params;
}

function buildKsaSupabaseItem(row: SupabaseReconRow): KsaReconOpportunity {
  const propertyUrl = row.listing_url || row.source_url || null;

  return {
    external_key: row.external_key ?? null,
    listing_key: row.external_key ?? null,
    view_key: row.view_key ?? null,
    rank: row.rank ?? null,
    dashboard_rank: row.rank ?? null,
    recon_rank: row.rank ?? null,
    recon_score: row.score ?? null,
    score: row.score ?? null,
    priority: row.priority ?? null,
    priority_label: row.priority ?? null,
    city: row.city ?? null,
    district: row.district ?? null,
    community: row.community ?? null,
    location_label: row.location_label ?? null,
    portal: row.source_portal ?? null,
    source_portal: row.source_portal ?? null,
    source_category: row.source_category ?? null,
    purpose: row.purpose ?? null,
    property_type: row.property_type ?? null,
    title: row.title ?? null,
    price: row.price ?? null,
    old_price: row.old_price ?? null,
    new_price: row.new_price ?? null,
    drop_amount: row.drop_amount ?? null,
    drop_pct: row.drop_pct ?? null,
    agent_name: row.agent_name ?? null,
    agency_name: row.agency_name ?? null,
    property_url: propertyUrl,
    source_url: row.source_url ?? null,
    listing_url: row.listing_url ?? null,
    has_phone_available: booleanFlag(row.has_phone),
    has_whatsapp_available: booleanFlag(row.has_whatsapp),
    has_email_available: booleanFlag(row.has_email),
    has_contact: booleanFlag(row.has_contact),
    is_contactable: booleanFlag(row.has_contact),
    is_owner_direct: booleanFlag(row.is_owner_direct),
    is_price_drop: booleanFlag(row.has_price_movement),
    is_refresh_inflated: booleanFlag(row.has_refresh_signal),
    effective_true_age_days: row.true_age_days ?? null,
    recommended_action: row.recommended_action ?? null,
    badges: row.badges ?? null,
    generated_at: row.generated_at ?? null,
    exported_at: row.exported_at ?? null,
  };
}

function getRowsExportedAt(rows: SupabaseReconRow[]): string {
  const firstDatedRow = rows.find((row) => row.exported_at || row.generated_at);
  return (
    firstDatedRow?.exported_at ??
    firstDatedRow?.generated_at ??
    new Date().toISOString()
  );
}

function buildKsaSupabaseList(rows: SupabaseReconRow[]): KsaReconListPayload {
  return {
    country: "ksa",
    currency: "SAR",
    source_table: SUPABASE_SOURCE_TABLE,
    exported_at: getRowsExportedAt(rows),
    total_rows_available: rows.length,
    exported_rows: rows.length,
    default_sort: SUPABASE_DEFAULT_SORT,
    columns: SUPABASE_COLUMNS,
    items: rows.map(buildKsaSupabaseItem),
  };
}

function getLatestExportedAt(lists: KsaReconDataResult["lists"]): string {
  const dates = Object.values(lists)
    .map((list) => list?.exported_at)
    .filter((value): value is string => typeof value === "string");

  return dates[0] ?? new Date().toISOString();
}

function createSupabaseSummary(
  lists: KsaReconDataResult["lists"]
): KsaReconSummaryPayload {
  const items = Object.entries(lists).map(([key, list]) => ({
    view_key: KSA_SUPABASE_VIEWS[key as keyof typeof KSA_SUPABASE_VIEWS],
    list_key: key,
    total_rows_available: list?.total_rows_available ?? 0,
    exported_rows: list?.exported_rows ?? 0,
  }));

  return {
    country: "ksa",
    currency: "SAR",
    source_table: SUPABASE_SOURCE_TABLE,
    exported_at: getLatestExportedAt(lists),
    total_rows_available: items.reduce((sum, item) => {
      const total =
        typeof item.total_rows_available === "number"
          ? item.total_rows_available
          : 0;
      return sum + total;
    }, 0),
    items,
  };
}

function createSupabaseManifest(
  lists: KsaReconDataResult["lists"]
): KsaReconManifestPayload {
  const exportedAt = getLatestExportedAt(lists);
  const exportsEntries = Object.entries(lists).map(([key, list]) => [
    key,
    {
      table: SUPABASE_SOURCE_TABLE,
      exists: list !== null,
      total_rows_available: list?.total_rows_available ?? 0,
      exported_rows: list?.exported_rows ?? 0,
      output: `supabase:${SUPABASE_SOURCE_TABLE}:${KSA_SUPABASE_VIEWS[key as keyof typeof KSA_SUPABASE_VIEWS]}`,
      columns: SUPABASE_COLUMNS,
      sort: SUPABASE_DEFAULT_SORT,
    },
  ]);

  return {
    export_name: "ksa_recon_supabase",
    country: "ksa",
    currency: "SAR",
    database_path: "supabase",
    exported_at: exportedAt,
    limit: Number(SUPABASE_QUERY_LIMIT),
    exports: Object.fromEntries(exportsEntries),
    outputs: Object.fromEntries(
      Object.keys(lists).map((key) => [
        key,
        `supabase:${SUPABASE_SOURCE_TABLE}:${KSA_SUPABASE_VIEWS[key as keyof typeof KSA_SUPABASE_VIEWS]}`,
      ])
    ),
    summary: {
      table: SUPABASE_SOURCE_TABLE,
      exists: true,
      total_rows_available: Object.values(lists).reduce(
        (sum, list) => sum + (list?.total_rows_available ?? 0),
        0
      ),
      exported_rows: Object.values(lists).reduce(
        (sum, list) => sum + (list?.exported_rows ?? 0),
        0
      ),
      output: `supabase:${SUPABASE_SOURCE_TABLE}:summary`,
    },
    frontend_rules: {
      source: "supabase",
      render_limit: RECON_RENDER_LIMIT,
      query_limit: Number(SUPABASE_QUERY_LIMIT),
    },
    do_not_expose_directly: [],
  };
}

async function getKsaReconDataFromSupabase(
  options?: KsaReconDataOptions
): Promise<KsaReconDataResult | null> {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  try {
    const requestedViews = getRequestedViews(options);
    const entries = await Promise.all(
      requestedViews.map(async (listKey) => {
        const rows = await fetchSupabaseRows<SupabaseReconRow>(
          SUPABASE_TABLE,
          buildSupabaseParams(KSA_SUPABASE_VIEWS[listKey])
        );

        if (rows === null) {
          return null;
        }

        return [listKey, buildKsaSupabaseList(rows)] as const;
      })
    );

    if (entries.some((entry) => entry === null)) {
      return null;
    }

    const lists = {
      ...emptyLists(),
      ...(Object.fromEntries(
        entries.filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      ) as Partial<KsaReconDataResult["lists"]>),
    };

    const [localSummary, localManifest] = await Promise.all([
      readOptionalJsonFile<KsaReconSummaryPayload>(FILES.summary),
      readOptionalJsonFile<KsaReconManifestPayload>(FILES.manifest),
    ]);

    return {
      status: "ready",
      message: "KSA Recon Supabase data loaded successfully.",
      manifest: localManifest ?? createSupabaseManifest(lists),
      summary: localSummary ?? createSupabaseSummary(lists),
      lists: capLists(lists),
    };
  } catch {
    return null;
  }
}

async function getKsaReconDataFromScopedLocal(
  options: KsaReconDataOptions
): Promise<KsaReconDataResult> {
  const requestedViews = getRequestedViews(options);
  const missingRequestedFiles = (
    await Promise.all(
      requestedViews.map(async (view) => ({
        view,
        exists: await fileExists(FILES[view]),
      }))
    )
  ).filter((entry) => !entry.exists);

  if (missingRequestedFiles.length > 0) {
    return {
      status: "missing",
      message:
        "Local KSA Recon export JSON files were not found. Run tools/export_ksa_recon_frontend_data.py locally to generate them.",
      manifest: null,
      summary: null,
      lists: emptyLists(),
    };
  }

  try {
    const entries = await Promise.all(
      requestedViews.map(async (view) => [
        view,
        await readJsonFile<KsaReconListPayload>(FILES[view]),
      ] as const)
    );

    const [summary, manifest] = await Promise.all([
      readOptionalJsonFile<KsaReconSummaryPayload>(FILES.summary),
      readOptionalJsonFile<KsaReconManifestPayload>(FILES.manifest),
    ]);

    const lists = {
      ...emptyLists(),
      ...(Object.fromEntries(entries) as Partial<KsaReconDataResult["lists"]>),
    };

    return {
      status: "ready",
      message: "KSA Recon local export loaded successfully.",
      manifest,
      summary,
      lists: capLists(lists),
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
      lists: emptyLists(),
    };
  }
}

export async function getKsaReconData(
  options?: KsaReconDataOptions
): Promise<KsaReconDataResult> {
  const supabaseData = await getKsaReconDataFromSupabase(options);

  if (supabaseData) {
    return supabaseData;
  }

  if (options?.views !== undefined) {
    return getKsaReconDataFromScopedLocal(options);
  }

  const requiredFiles = Object.values(FILES);
  const existence = await Promise.all(requiredFiles.map(fileExists));

  if (!existence.every(Boolean)) {
    return {
      status: "missing",
      message:
        "Local KSA Recon export JSON files were not found. Run tools/export_ksa_recon_frontend_data.py locally to generate them.",
      manifest: null,
      summary: null,
      lists: emptyLists(),
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
        hotLeads: capList(hotLeads),
        multiSignal: capList(multiSignal),
        ownerDirect: capList(ownerDirect),
        priceDrops: capList(priceDrops),
        refreshInflation: capList(refreshInflation),
        contactable: capList(contactable),
        urlOnly: capList(urlOnly),
        residentialRent: capList(residentialRent),
        residentialBuy: capList(residentialBuy),
        commercial: capList(commercial),
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
      lists: emptyLists(),
    };
  }
}
