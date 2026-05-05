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
};

export type ReconFilterOption = {
  value: string;
  label: string;
  count: number;
};

function normalizeForSearch(value: string | null | undefined): string {
  return value?.toLowerCase().trim() ?? "";
}

function matchesSearch(
  opportunity: NormalizedReconOpportunity,
  search: string
): boolean {
  const query = search.trim().toLowerCase();

  if (!query) {
    return true;
  }

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
  if (selected === "all") {
    return true;
  }

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

export function applyReconFilters(
  opportunities: NormalizedReconOpportunity[],
  filters: ReconFilterState
): NormalizedReconOpportunity[] {
  const minScoreValue = filters.minScore.trim()
    ? Number(filters.minScore)
    : null;

  return opportunities.filter((opportunity) => {
    if (!matchesSearch(opportunity, filters.search)) {
      return false;
    }

    if (!matchesSelect(opportunity.locationLabel, filters.location)) {
      return false;
    }

    if (!matchesSelect(opportunity.portal, filters.portal)) {
      return false;
    }

    if (!matchesSelect(opportunity.sourceCategory, filters.sourceCategory)) {
      return false;
    }

    if (
      minScoreValue !== null &&
      Number.isFinite(minScoreValue) &&
      (opportunity.score === null || opportunity.score < minScoreValue)
    ) {
      return false;
    }

    if (
      filters.onlyContactable &&
      !opportunity.hasPhone &&
      !opportunity.hasWhatsapp &&
      !opportunity.hasEmail
    ) {
      return false;
    }

    if (filters.onlyPriceMovement && !hasPriceMovement(opportunity)) {
      return false;
    }

    if (filters.onlyOwnerDirect && !hasOwnerDirect(opportunity)) {
      return false;
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
    filters.onlyOwnerDirect
  );
}

function makeOptionsFromValues(values: Array<string | null>): ReconFilterOption[] {
  const counts = new Map<string, { label: string; count: number }>();

  for (const value of values) {
    const label = value?.trim();

    if (!label) {
      continue;
    }

    const key = label.toLowerCase();

    const existing = counts.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { label, count: 1 });
    }
  }

  return Array.from(counts.entries())
    .map(([value, data]) => ({
      value,
      label: data.label,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function buildReconFilterOptions(
  opportunities: NormalizedReconOpportunity[]
): {
  locations: ReconFilterOption[];
  portals: ReconFilterOption[];
  sourceCategories: ReconFilterOption[];
} {
  return {
    locations: makeOptionsFromValues(
      opportunities.map((opportunity) => opportunity.locationLabel)
    ),
    portals: makeOptionsFromValues(
      opportunities.map((opportunity) => opportunity.portal)
    ),
    sourceCategories: makeOptionsFromValues(
      opportunities.map((opportunity) => opportunity.sourceCategory)
    ),
  };
}