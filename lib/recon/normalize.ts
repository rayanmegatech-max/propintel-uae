// lib/recon/normalize.ts
import {
  asBooleanSignal,
  asNumber,
  asString,
  labelize,
  safeStringFromAny,
} from "./formatters";
import type {
  NormalizedReconOpportunity,
  ReconCountry,
  ReconCurrency,
  ReconSignalBadge,
} from "./types";

type RawReconRow = Record<string, unknown>;

function firstString(row: RawReconRow, fields: string[]): string | null {
  for (const field of fields) {
    const value = asString(row[field]);
    if (value) return value;
  }

  return null;
}

function firstNumber(row: RawReconRow, fields: string[]): number | null {
  for (const field of fields) {
    const value = asNumber(row[field]);
    if (value !== null) return value;
  }

  return null;
}

function fallbackId(row: RawReconRow, index: number): string {
  const value = firstString(row, [
    "recon_id",
    "listing_key",
    "canonical_id",
    "normalized_id",
    "source_listing_id",
    "portal_id",
    "id",
  ]);

  return value || `recon-row-${index}`;
}

function simpleSubtitle(row: RawReconRow, fallbackText: string): string {
  const portal = firstString(row, ["portal", "source_portal"]);
  const sourceCategory = firstString(row, ["source_category", "source_db_label"]);
  const sourceId = firstString(row, ["source_listing_id", "portal_id"]);

  const parts = [
    portal ? labelize(portal) : null,
    sourceCategory ? labelize(sourceCategory) : null,
  ].filter((part): part is string => Boolean(part));

  if (sourceId) {
    parts.push(`ID ${sourceId}`);
  }

  return parts.length > 0 ? parts.join(" · ") : fallbackText;
}

function uaeTitle(row: RawReconRow): string {
  return (
    firstString(row, [
      "opportunity_title",
      "title",
      "listing_title",
      "property_title",
      "name",
      "description",
    ]) || "UAE public-listing opportunity"
  );
}

function ksaTitle(row: RawReconRow): string {
  const explicitTitle = firstString(row, [
    "opportunity_title",
    "title",
    "listing_title",
    "property_title",
    "name",
    "description",
  ]);

  if (explicitTitle) return explicitTitle;

  const lane = firstString(row, ["opportunity_lane", "primary_opportunity_type"]);
  const propertyType = firstString(row, ["property_type"]);
  const sourceCategory = firstString(row, ["source_category", "source_db_label"]);
  const city = firstString(row, ["city"]) || "Unknown city";
  const district = firstString(row, ["district", "community", "building_name"]);

  const signalParts: string[] = [];

  if (
    asBooleanSignal(row.has_owner_direct_signal) ||
    asBooleanSignal(row.is_owner_direct)
  ) {
    signalParts.push("Owner/direct signal");
  }

  if (
    asBooleanSignal(row.has_price_drop_signal) ||
    asBooleanSignal(row.is_price_drop)
  ) {
    signalParts.push("price movement");
  }

  if (
    asBooleanSignal(row.has_refresh_signal) ||
    asBooleanSignal(row.is_refresh_inflated)
  ) {
    signalParts.push("refresh signal");
  }

  const signalText =
    signalParts.length > 0 ? signalParts.join(" + ") : labelize(lane);

  const assetText =
    propertyType ||
    (sourceCategory ? labelize(sourceCategory) : "public listing opportunity");

  const locationText = district ? `${district}, ${city}` : city;

  return `${signalText} · ${assetText} in ${locationText}`;
}

function signalBadges(row: RawReconRow): ReconSignalBadge[] {
  const badges: ReconSignalBadge[] = [];
  const rawBadges = row.badges;

  if (Array.isArray(rawBadges)) {
    for (const badge of rawBadges) {
      if (typeof badge === "string" && badge.trim()) {
        badges.push({ label: labelize(badge), tone: "teal" });
      }

      if (badge && typeof badge === "object" && "label" in badge) {
        const label = safeStringFromAny((badge as { label?: unknown }).label);
        if (label) {
          badges.push({ label: labelize(label), tone: "teal" });
        }
      }
    }
  }

  if (
    asBooleanSignal(row.has_owner_direct_signal) ||
    asBooleanSignal(row.is_owner_direct)
  ) {
    badges.push({ label: "Owner/direct", tone: "cyan" });
  }

  if (
    asBooleanSignal(row.has_price_drop_signal) ||
    asBooleanSignal(row.is_price_drop)
  ) {
    badges.push({ label: "Price movement", tone: "red" });
  }

  if (
    asBooleanSignal(row.has_refresh_signal) ||
    asBooleanSignal(row.is_refresh_inflated)
  ) {
    badges.push({ label: "Refresh signal", tone: "amber" });
  }

  const unique = new Map<string, ReconSignalBadge>();

  for (const badge of badges) {
    unique.set(badge.label.toLowerCase(), badge);
  }

  return Array.from(unique.values()).slice(0, 5);
}

function sizeLabel(row: RawReconRow, sizeValue: number | null): string | null {
  if (sizeValue === null) return null;

  const unit = firstString(row, ["size_unit", "area_unit"]);
  return unit
    ? `${sizeValue.toLocaleString("en-US")} ${unit}`
    : `${sizeValue.toLocaleString("en-US")} size`;
}

// ─── Bayut URL canonicalization ──────────────────────────────────────────────
//
// Bayut slug URLs are broken: /property/some-long-title-{id}.html resolves to
// a 404. The canonical pattern depends on the country:
//   UAE: https://www.bayut.com/property/details-{id}.html
//   KSA: https://www.bayut.sa/en/property/details-{id}.html
//
// This helper:
//   1. Returns the input URL unchanged for any non-Bayut portal.
//   2. For Bayut, extracts the numeric listing ID from:
//      a) the trailing segment of any URL  (…-8500411.html → 8500411)
//      b) explicit ID fields in the row     (external_id, listing_id, …)
//   3. Reconstructs the country‑correct canonical URL when an ID is found.
//   4. Returns the original URL if no numeric ID can be found, so nothing is lost.

const BAYUT_ID_FIELDS = [
  "external_id",
  "listing_id",
  "property_id",
  "source_listing_id",
  "portal_id",
] as const;

function isBayutPortal(row: RawReconRow): boolean {
  const portal =
    firstString(row, ["portal", "source_portal"]) ?? "";
  return portal.toLowerCase().includes("bayut");
}

/** Extract the last unbroken run of digits before `.html` in a URL string. */
function extractBayutNumericId(url: string): string | null {
  // Matches the last sequence of digits immediately before ".html"
  // Works for both slug URLs and already-canonical URLs.
  const match = url.match(/(\d+)\.html(?:[?#].*)?$/i);
  return match ? match[1] : null;
}

/**
 * If the row belongs to Bayut, return the canonical URL for the given country.
 * Otherwise return the rawUrl as-is (including null).
 */
function canonicalizeBayutUrl(
  rawUrl: string | null,
  row: RawReconRow,
  country: ReconCountry
): string | null {
  if (!isBayutPortal(row)) {
    return rawUrl;
  }

  // 1. Try to extract ID from the URL itself (handles slug and canonical forms).
  if (rawUrl) {
    const id = extractBayutNumericId(rawUrl);
    if (id) {
      const base = country === "ksa"
        ? "https://www.bayut.sa/en"
        : "https://www.bayut.com";
      return `${base}/property/details-${id}.html`;
    }
  }

  // 2. Fallback: check all URL-bearing fields for an embedded ID.
  for (const field of ["property_url", "source_url", "listing_url", "url", "detail_url"]) {
    const candidate = asString(row[field]);
    if (candidate) {
      const id = extractBayutNumericId(candidate);
      if (id) {
        const base = country === "ksa"
          ? "https://www.bayut.sa/en"
          : "https://www.bayut.com";
        return `${base}/property/details-${id}.html`;
      }
    }
  }

  // 3. Fallback: check explicit numeric ID fields.
  for (const field of BAYUT_ID_FIELDS) {
    const val = String(row[field] ?? "").trim();
    if (/^\d+$/.test(val) && val.length > 0) {
      const base = country === "ksa"
        ? "https://www.bayut.sa/en"
        : "https://www.bayut.com";
      return `${base}/property/details-${val}.html`;
    }
  }

  // No ID found — preserve whatever we had rather than returning null.
  return rawUrl;
}

// ─── Main normalizer ─────────────────────────────────────────────────────────

export function normalizeReconOpportunity(
  row: RawReconRow,
  selectedCountry: ReconCountry,
  index: number,
  sourceTable?: string | null
): NormalizedReconOpportunity {
  const isKsa = selectedCountry === "ksa";
  const currency: ReconCurrency = isKsa ? "SAR" : "AED";

  const city = firstString(row, ["city"]);
  const districtOrCommunity =
    firstString(row, ["district", "community", "building_name"]) || null;

  const locationLabel =
    city && districtOrCommunity
      ? `${city} · ${districtOrCommunity}`
      : city || districtOrCommunity || "Unknown location";

  // area_sqm placed before generic area to prioritize explicit sqm field
  const sizeValue = firstNumber(row, [
    "size_sqft",
    "size_sqm",
    "area_sqm",
    "area",
    "plot_size",
  ]);

  const price = firstNumber(row, [
    "price",
    "current_price",
    "price_amount",
    "new_price",
    "old_price",
    "advertised_price",
    "asking_price",
    "rent_price",
    "sale_price",
  ]);

  const oldPrice = firstNumber(row, ["old_price"]);
  const newPrice = firstNumber(row, ["new_price"]);

  const priceLabel =
    firstNumber(row, ["price", "current_price", "price_amount"]) !== null
      ? "Advertised price"
      : newPrice !== null
        ? "Latest known price"
        : oldPrice !== null
          ? "Previous known price"
          : "Advertised price";

  const title = isKsa ? ksaTitle(row) : uaeTitle(row);
  const subtitle = simpleSubtitle(
    row,
    isKsa ? "KSA public-listing opportunity" : "UAE public-listing opportunity"
  );

  // Market-context fields
  const purpose = firstString(row, ["purpose", "listing_purpose", "transaction_type"]);
  const rentalMode = firstString(row, ["rental_mode", "rentalMode"]);
  const priceFrequency = firstString(row, ["price_frequency", "priceFrequency", "rent_frequency"]);

  // Raw URL before Bayut canonicalization
  const rawListingUrl = firstString(row, [
    "property_url",
    "source_url",
    "listing_url",
    "url",
    "detail_url",
  ]);

  // Apply Bayut canonicalization; all other portals pass through unchanged.
  const listingUrl = canonicalizeBayutUrl(rawListingUrl, row, selectedCountry);

  const normalized: NormalizedReconOpportunity = {
    country: selectedCountry,
    currency,

    id: fallbackId(row, index),
    rank: firstNumber(row, ["dashboard_rank", "recon_rank"]),
    score: firstNumber(row, ["recon_score", "priority_score"]),

    title,
    subtitle,

    priorityLabel: firstString(row, ["priority_label", "priority_bucket"]),
    confidenceLabel: firstString(row, ["confidence_tier", "confidence_label"]),

    portal: firstString(row, ["portal", "source_portal"]),
    sourceCategory: firstString(row, ["source_category", "source_db_label"]),
    sourceTable: sourceTable || null,

    city,
    districtOrCommunity,
    locationLabel,

    propertyType: firstString(row, ["property_type"]),
    bedrooms: firstNumber(row, ["bedrooms", "beds"]),
    bathrooms: firstNumber(row, ["bathrooms", "baths"]),
    sizeValue,
    sizeLabel: sizeLabel(row, sizeValue),

    price,
    priceLabel,
    oldPrice,
    newPrice,
    dropAmount: firstNumber(row, ["drop_amount", "price_drop_amount"]),
    dropPct: firstNumber(row, ["drop_pct", "price_drop_pct"]),

    agentName: firstString(row, ["agent_name"]),
    agencyName: firstString(row, [
      "agency_name",
      "brokerage_name",
      "company_name",
    ]),

    listingUrl,
    ctaLabel:
      firstString(row, ["cta_text", "portal_action_label"]) || "Open Listing",

    hasPhone:
      asBooleanSignal(row.has_phone_available) ||
      Boolean(firstString(row, ["contact_phone"])),
    hasWhatsapp:
      asBooleanSignal(row.has_whatsapp_available) ||
      Boolean(firstString(row, ["contact_whatsapp"])),
    hasEmail:
      asBooleanSignal(row.has_email_available) ||
      Boolean(firstString(row, ["contact_email"])),

    signalBadges: signalBadges(row),

    purpose,
    rentalMode,
    priceFrequency,

    raw: row,
  };

  return normalized;
}

export function normalizeReconList(
  rows: RawReconRow[],
  selectedCountry: ReconCountry,
  sourceTable?: string | null
): NormalizedReconOpportunity[] {
  return rows.map((row, index) =>
    normalizeReconOpportunity(row, selectedCountry, index, sourceTable)
  );
}