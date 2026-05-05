export type ReconCountry = "uae" | "ksa";

export type ReconCurrency = "AED" | "SAR";

export type ReconSignalBadge = {
  label: string;
  tone?: "emerald" | "cyan" | "amber" | "red" | "slate" | "teal";
};

export type NormalizedReconOpportunity = {
  country: ReconCountry;
  currency: ReconCurrency;

  id: string;
  rank: number | null;
  score: number | null;

  title: string;
  subtitle: string;

  priorityLabel: string | null;
  confidenceLabel: string | null;

  portal: string | null;
  sourceCategory: string | null;
  sourceTable?: string | null;

  city: string | null;
  districtOrCommunity: string | null;
  locationLabel: string;

  propertyType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeValue: number | null;
  sizeLabel: string | null;

  price: number | null;
  priceLabel: string;
  oldPrice: number | null;
  newPrice: number | null;
  dropAmount: number | null;
  dropPct: number | null;

  agentName: string | null;
  agencyName: string | null;

  listingUrl: string | null;
  ctaLabel: string;

  hasPhone: boolean;
  hasWhatsapp: boolean;
  hasEmail: boolean;

  signalBadges: ReconSignalBadge[];

  raw: Record<string, unknown>;
};

export type ReconMetric = {
  label: string;
  value: string;
  description: string;
  tone?: "emerald" | "cyan" | "amber" | "red" | "slate" | "teal";
};