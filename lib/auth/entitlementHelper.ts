import "server-only";

import type { UserAccess, CountryEntitlement } from "@/lib/auth/sessionHelper";
import type { CountrySlug } from "@/lib/countries/countryConfig";
import type { ProductSectionSlug } from "@/lib/countries/productNavigation";

export type AccessDecisionReason =
  | "allowed"
  | "unauthenticated"
  | "inactive_subscription"
  | "country_not_allowed"
  | "tier_not_allowed"
  | "admin_only"
  | "feature_paused";

export type AccessDecision = {
  allowed: boolean;
  reason: AccessDecisionReason;
  redirectTo: string | null;
};

const TACTICAL_SECTIONS = new Set<ProductSectionSlug>([
  "recon",
  "owner-direct",
  "price-drops",
  "listing-age",
]);

const STRATEGIC_SECTIONS = new Set<ProductSectionSlug>([
  "activity-feed",
  "inventory-pressure",
  "market-dominance",
  "agency-profiles",
  "communities",
  "buildings",
  "market-radar",
  "competitor-radar",
  "market-intelligence",
]);

const ALL_KNOWN_SECTIONS: ProductSectionSlug[] = [
  "recon",
  "ai-recon",
  "owner-direct",
  "price-drops",
  "listing-age",
  "market-intelligence",
  "inventory-pressure",
  "market-dominance",
  "agency-profiles",
  "activity-feed",
  "buildings",
  "communities",
  "data-quality",
  "market-radar",
  "competitor-radar",
];

export function isSectionPaused(section: ProductSectionSlug): boolean {
  return section === "ai-recon";
}

export function isAdminOnlySection(section: ProductSectionSlug): boolean {
  return section === "data-quality";
}

export function canAccessDashboardSection(
  access: UserAccess,
  country: CountrySlug,
  section: ProductSectionSlug
): AccessDecision {
  if (!access.isAuthenticated) {
    return {
      allowed: false,
      reason: "unauthenticated",
      redirectTo: "/login",
    };
  }

  if (isSectionPaused(section)) {
    return {
      allowed: false,
      reason: "feature_paused",
      redirectTo: "/upgrade",
    };
  }

  if (access.role === "admin" || access.subscriptionTier === "admin") {
    return {
      allowed: true,
      reason: "allowed",
      redirectTo: null,
    };
  }

  if (isAdminOnlySection(section)) {
    return {
      allowed: false,
      reason: "admin_only",
      redirectTo: "/upgrade",
    };
  }

  if (
    access.subscriptionStatus !== "active" &&
    access.subscriptionStatus !== "trialing"
  ) {
    return {
      allowed: false,
      reason: "inactive_subscription",
      redirectTo: "/upgrade",
    };
  }

  const requestedCountryEntitlement = country as unknown as CountryEntitlement;
  const hasCountryAccess =
    access.countries.includes("gcc") ||
    access.countries.includes(requestedCountryEntitlement);

  if (!hasCountryAccess) {
    return {
      allowed: false,
      reason: "country_not_allowed",
      redirectTo: "/upgrade",
    };
  }

  const tier = access.subscriptionTier;

  if (tier === "free") {
    if (section === "recon") {
      return { allowed: true, reason: "allowed", redirectTo: null };
    }
    return {
      allowed: false,
      reason: "tier_not_allowed",
      redirectTo: "/upgrade",
    };
  }

  if (tier === "opportunities") {
    if (TACTICAL_SECTIONS.has(section)) {
      return { allowed: true, reason: "allowed", redirectTo: null };
    }
    return {
      allowed: false,
      reason: "tier_not_allowed",
      redirectTo: "/upgrade",
    };
  }

  if (tier === "market_command" || tier === "gcc") {
    if (TACTICAL_SECTIONS.has(section) || STRATEGIC_SECTIONS.has(section)) {
      return { allowed: true, reason: "allowed", redirectTo: null };
    }
    return {
      allowed: false,
      reason: "tier_not_allowed",
      redirectTo: "/upgrade",
    };
  }

  return {
    allowed: false,
    reason: "tier_not_allowed",
    redirectTo: "/upgrade",
  };
}

export function getAllowedSectionsForAccess(
  access: UserAccess,
  country: CountrySlug
): ProductSectionSlug[] {
  return ALL_KNOWN_SECTIONS.filter(
    (section) => canAccessDashboardSection(access, country, section).allowed
  );
}