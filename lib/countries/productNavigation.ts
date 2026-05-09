export type ProductSectionSlug =
  | "recon"
  | "owner-direct"
  | "price-drops"
  | "listing-age"
  | "market-intelligence"
  | "inventory-pressure"
  | "market-dominance"
  | "agency-profiles"
  | "activity-feed"
  | "buildings"
  | "communities"
  | "data-quality"
  | "market-radar"
  | "competitor-radar";

export type ProductNavGroup = "COMMAND" | "OPPORTUNITIES" | "MARKET" | "ADMIN";

export type ProductSection = {
  slug: ProductSectionSlug;
  label: string;
  shortLabel: string;
  eyebrow: string;
  description: string;
  primaryUse: string;
  internalOnly?: boolean;
  ksaNote?: string;
  isHidden?: boolean; // True for old V0 routes that remain accessible but shouldn't crowd the V1 sidebar
  navGroup?: ProductNavGroup;
};

export const PRODUCT_SECTIONS: ProductSection[] = [
  {
    slug: "recon",
    label: "Daily Opportunities",
    shortLabel: "Opportunities",
    eyebrow: "Combined Opportunities",
    description:
      "A daily opportunity command center combining owner/direct signals, price movements, listing-age evidence, refresh inflation, contactability, and priority scoring.",
    primaryUse:
      "Help agents and agencies start each day with the most actionable public-listing opportunities instead of browsing portals manually.",
    navGroup: "OPPORTUNITIES",
  },
  {
    slug: "market-radar",
    label: "Market Radar",
    shortLabel: "Market Radar",
    eyebrow: "Market Command Center",
    description:
      "Combined market intelligence view covering activity, pressure, buildings, and communities.",
    primaryUse:
      "Track overall market movement and Supply Pressure across macro and micro locations.",
    navGroup: "MARKET",
  },
  {
    slug: "competitor-radar",
    label: "Competitor Radar",
    shortLabel: "Competitor Radar",
    eyebrow: "Agency Footprint",
    description:
      "Combined intelligence view for market dominance and specific agency profiles.",
    primaryUse:
      "Help users track competitor footprints and visible market share without unsafe competitive wording.",
    navGroup: "MARKET",
  },
  {
    slug: "data-quality",
    label: "Data Quality / Pipeline Status",
    shortLabel: "Data Quality",
    eyebrow: "Internal / Admin",
    description:
      "Internal pipeline readiness, publish status, frontend-safe table checks, alias audits, and backend QA summaries.",
    primaryUse:
      "Admin-only visibility into whether country data is safe to publish. This should not become a normal paid-user product page.",
    internalOnly: true,
    navGroup: "ADMIN",
  },
  // --- HIDDEN V0 ROUTES BELOW (Kept accessible via direct URL and placeholder pages) ---
  {
    slug: "owner-direct",
    label: "Owner / Direct Radar",
    shortLabel: "Owner / Direct",
    eyebrow: "Lead Intelligence",
    description:
      "Owner-like, direct, no-commission, missing-brokerage, URL-lead, and contactable opportunity signals from public listings.",
    primaryUse:
      "Help users find owner/direct style opportunities while using cautious wording and source evidence instead of claiming guaranteed private-owner leads.",
    isHidden: true,
  },
  {
    slug: "price-drops",
    label: "Price Drop Radar",
    shortLabel: "Price Drops",
    eyebrow: "Price Movement",
    description:
      "Frontend-safe price movement and price-drop opportunities from cleaned product tables, not raw price-history evidence.",
    primaryUse:
      "Help users identify recently repriced listings and verify current advertised prices through safe listing-action paths.",
    isHidden: true,
  },
  {
    slug: "listing-age",
    label: "True Listing Age / Refresh Inflation",
    shortLabel: "Listing Age",
    eyebrow: "Listing Truth",
    description:
      "True listing age, old inventory, stale signals, recently updated listings, and refresh-inflation behavior.",
    primaryUse:
      "Help users understand whether a listing is genuinely fresh or carrying older public-listing history.",
    isHidden: true,
  },
  {
    slug: "market-intelligence",
    label: "Market Intelligence",
    shortLabel: "Market Intel",
    eyebrow: "Market Command Center",
    description:
      "Country-level market intelligence using dashboard-ready activity, city/community, district, building, agency, pressure, and dominance views.",
    primaryUse:
      "Give operators a clean command center for what is moving, where pressure is building, and which public markets are most active.",
    isHidden: true,
  },
  {
    slug: "inventory-pressure",
    label: "Supply Pressure",
    shortLabel: "Pressure",
    eyebrow: "Pressure Radar",
    description:
      "Inventory pressure, price-drop pressure, refresh pressure, owner/direct pressure, old inventory pressure, and market pressure signals.",
    primaryUse:
      "Help users identify markets where public listing activity suggests rising pressure or opportunity density.",
    isHidden: true,
  },
  {
    slug: "market-dominance",
    label: "Market Dominance",
    shortLabel: "Dominance",
    eyebrow: "Visible Listing Share",
    description:
      "Public listing-share concentration, visible agency presence, concentrated markets, fragmented markets, and territory intelligence.",
    primaryUse:
      "Help agencies and operators understand visible public listing share without using unsafe competitive wording.",
    isHidden: true,
  },
  {
    slug: "agency-profiles",
    label: "Agency Inventory Profile",
    shortLabel: "Agencies",
    eyebrow: "Agency Footprint",
    description:
      "Agency public listing portfolios, portal mix, category mix, city/community or district concentration, and portfolio pressure signals.",
    primaryUse:
      "Help users analyze agency inventory footprint and public listing activity in a product-safe way.",
    isHidden: true,
  },
  {
    slug: "activity-feed",
    label: "Market Activity Feed",
    shortLabel: "Activity",
    eyebrow: "Daily Activity",
    description:
      "Balanced market activity feed built from frontend-safe activity tables, including recon opportunities, price movements, recently detected listings, pressure, dominance, and agency signals.",
    primaryUse:
      "Give users a daily feed of meaningful public-listing market movement without exposing raw internal evidence tables.",
    isHidden: true,
  },
  {
    slug: "buildings",
    label: "Building Intelligence",
    shortLabel: "Buildings",
    eyebrow: "Asset-Level Intelligence",
    description:
      "Building-level public listing intelligence, pressure, dominance, agency presence, and activity signals where backend coverage supports it.",
    primaryUse:
      "Help UAE users analyze buildings as inventory and agency battlegrounds. KSA v1 may treat this as limited because building/project coverage is weaker.",
    ksaNote:
      "KSA v1 should not depend heavily on building/project coverage. Use city, district, agency, source URL, and signal fields first.",
    isHidden: true,
  },
  {
    slug: "communities",
    label: "Community Intelligence",
    shortLabel: "Communities",
    eyebrow: "Location Intelligence",
    description:
      "UAE community intelligence and KSA city/district intelligence using canonical dashboard-ready location fields.",
    primaryUse:
      "Help users understand market activity, inventory pressure, dominance, and opportunity density by location.",
    isHidden: true,
  },
];

export function getProductSection(slug: string): ProductSection | undefined {
  return PRODUCT_SECTIONS.find((section) => section.slug === slug);
}