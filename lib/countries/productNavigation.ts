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
  | "data-quality";

export type ProductSection = {
  slug: ProductSectionSlug;
  label: string;
  shortLabel: string;
  eyebrow: string;
  description: string;
  primaryUse: string;
  internalOnly?: boolean;
  ksaNote?: string;
};

export const PRODUCT_SECTIONS: ProductSection[] = [
  {
    slug: "recon",
    label: "Recon Hub",
    shortLabel: "Recon",
    eyebrow: "Combined Opportunities",
    description:
      "A daily opportunity command center combining owner/direct signals, price movements, listing-age evidence, refresh inflation, contactability, and priority scoring.",
    primaryUse:
      "Help agents and agencies start each day with the most actionable public-listing opportunities instead of browsing portals manually.",
  },
  {
    slug: "owner-direct",
    label: "Owner / Direct Radar",
    shortLabel: "Owner / Direct",
    eyebrow: "Lead Intelligence",
    description:
      "Owner-like, direct, no-commission, missing-brokerage, URL-lead, and contactable opportunity signals from public listings.",
    primaryUse:
      "Help users find owner/direct style opportunities while using cautious wording and source evidence instead of claiming guaranteed private-owner leads.",
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
  },
  {
    slug: "inventory-pressure",
    label: "Inventory Pressure",
    shortLabel: "Pressure",
    eyebrow: "Pressure Radar",
    description:
      "Inventory pressure, price-drop pressure, refresh pressure, owner/direct pressure, old inventory pressure, and market pressure signals.",
    primaryUse:
      "Help users identify markets where public listing activity suggests rising pressure or opportunity density.",
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
  },
];

export function getProductSection(slug: string): ProductSection | undefined {
  return PRODUCT_SECTIONS.find((section) => section.slug === slug);
}