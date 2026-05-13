import type { NormalizedReconOpportunity } from "./types";

export type ReconFilterState = {
  search: string;
  location: string;
  portal: string;
  sourceCategory: string;
  minScore: string;
  onlyContactable: boolean;
  onlyPriceMovement: boolean;
  onlyOwnerDirect: boolean;
  actionLens: "all" | "contact_ready" | "verify_source" | "price_moved" | "owner_direct" | "high_confidence";
};

export const DEFAULT_RECON_FILTERS: ReconFilterState = {
  search: "",
  location: "all",
  portal: "all",
  sourceCategory: "all",
  minScore: "",
  onlyContactable: false,
  onlyPriceMovement: false,
  onlyOwnerDirect: false,
  actionLens: "all",
};

export type ReconFilterOption = {
  value: string;
  label: string;
  count: number;
};

function normalizeForSearch(value: string | null | undefined): string {
  return value?.toLowerCase().trim() ?? "";
}

function matchesSearch(opportunity: NormalizedReconOpportunity, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  const searchableText = [
    opportunity.title,
    opportunity.subtitle,
    opportunity.locationLabel,
    opportunity.portal,
    opportunity.sourceCategory,
    opportunity.propertyType,
    opportunity.agentName,
    opportunity.agencyName,
    opportunity.priorityLabel,
    opportunity.confidenceLabel,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

function matchesSelect(value: string | null, selected: string): boolean {
  if (selected === "all") return true;
  return normalizeForSearch(value) === selected;
}

function hasPriceMovement(opportunity: NormalizedReconOpportunity): boolean {
  return (
    opportunity.dropPct !== null ||
    opportunity.dropAmount !== null ||
    opportunity.oldPrice !== null ||
    opportunity.newPrice !== null ||
    opportunity.signalBadges.some((badge) =>
      badge.label.toLowerCase().includes("price")
    )
  );
}

function hasOwnerDirect(opportunity: NormalizedReconOpportunity): boolean {
  return (
    opportunity.signalBadges.some((badge) =>
      badge.label.toLowerCase().includes("owner")
    ) ||
    normalizeForSearch(opportunity.title).includes("owner/direct") ||
    normalizeForSearch(opportunity.subtitle).includes("owner/direct")
  );
}

// New helpers for Action Lens
function hasContactSignal(opportunity: NormalizedReconOpportunity): boolean {
  return opportunity.hasPhone || opportunity.hasWhatsapp || opportunity.hasEmail;
}

function hasSourceVerificationNeed(opportunity: NormalizedReconOpportunity): boolean {
  const hasListingUrl = !!opportunity.listingUrl;
  const hasContact = hasContactSignal(opportunity);
  // Need to verify source if either:
  // - there is a URL but no contact info, or
  // - there is no URL and no contact info (can't act directly)
  return (!hasContact) || (hasListingUrl && !hasContact);
}

function hasHighConfidence(opportunity: NormalizedReconOpportunity): boolean {
  return opportunity.score !== null && opportunity.score >= 90;
}

function matchesLocation(opportunity: NormalizedReconOpportunity, selected: string): boolean {
  if (selected === "all") return true;
  if (selected.startsWith("city:")) {
    const cityKey = selected.slice(5);
    return normalizeForSearch(opportunity.city) === cityKey;
  }
  if (selected.startsWith("loc:")) {
    const locKey = selected.slice(4);
    return normalizeForSearch(opportunity.locationLabel) === locKey;
  }
  // Legacy fallback: compare directly with locationLabel
  return normalizeForSearch(opportunity.locationLabel) === selected;
}

export function applyReconFilters(
  opportunities: NormalizedReconOpportunity[],
  filters: ReconFilterState
): NormalizedReconOpportunity[] {
  const minScoreValue = filters.minScore.trim() ? Number(filters.minScore) : null;

  return opportunities.filter((opportunity) => {
    // Search
    if (!matchesSearch(opportunity, filters.search)) return false;

    // Location (supports city: and loc: prefixes)
    if (!matchesLocation(opportunity, filters.location)) return false;

    // Portal
    if (!matchesSelect(opportunity.portal, filters.portal)) return false;

    // Source Category
    if (!matchesSelect(opportunity.sourceCategory, filters.sourceCategory)) return false;

    // Min Score
    if (minScoreValue !== null && Number.isFinite(minScoreValue) && (opportunity.score === null || opportunity.score < minScoreValue)) {
      return false;
    }

    // Legacy boolean toggles (still work)
    if (filters.onlyContactable && !hasContactSignal(opportunity)) return false;
    if (filters.onlyPriceMovement && !hasPriceMovement(opportunity)) return false;
    if (filters.onlyOwnerDirect && !hasOwnerDirect(opportunity)) return false;

    // New Action Lens (applied after legacy toggles, but doesn't conflict)
    switch (filters.actionLens) {
      case "contact_ready":
        if (!hasContactSignal(opportunity)) return false;
        break;
      case "verify_source":
        if (!hasSourceVerificationNeed(opportunity)) return false;
        break;
      case "price_moved":
        if (!hasPriceMovement(opportunity)) return false;
        break;
      case "owner_direct":
        if (!hasOwnerDirect(opportunity)) return false;
        break;
      case "high_confidence":
        if (!hasHighConfidence(opportunity)) return false;
        break;
      default: // "all" does nothing
    }

    return true;
  });
}

export function hasActiveReconFilters(filters: ReconFilterState): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.location !== "all" ||
    filters.portal !== "all" ||
    filters.sourceCategory !== "all" ||
    filters.minScore.trim() !== "" ||
    filters.onlyContactable ||
    filters.onlyPriceMovement ||
    filters.onlyOwnerDirect ||
    filters.actionLens !== "all"
  );
}

function makeOptionsFromValues(values: Array<string | null>): ReconFilterOption[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const value of values) {
    const label = value?.trim();
    if (!label) continue;
    const key = label.toLowerCase();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { label, count: 1 });
    }
  }
  return Array.from(counts.entries())
    .map(([value, data]) => ({ value, label: data.label, count: data.count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function buildReconFilterOptions(
  opportunities: NormalizedReconOpportunity[]
): {
  locations: ReconFilterOption[];
  cities: ReconFilterOption[];
  portals: ReconFilterOption[];
  sourceCategories: ReconFilterOption[];
} {
  const cities = makeOptionsFromValues(
    opportunities.map((o) => o.city).filter((c) => c && c.toLowerCase() !== "unknown")
  );

  const locations = makeOptionsFromValues(
    opportunities.map((o) => o.locationLabel).filter((loc) => loc && loc.toLowerCase() !== "unknown location")
  );

  const portals = makeOptionsFromValues(opportunities.map((o) => o.portal));
  const sourceCategories = makeOptionsFromValues(opportunities.map((o) => o.sourceCategory));

  return { locations, cities, portals, sourceCategories };
}