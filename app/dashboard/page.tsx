import { redirect } from "next/navigation";

import { getCurrentUserAccess } from "@/lib/auth/sessionHelper";
import { canAccessDashboardSection } from "@/lib/auth/entitlementHelper";
import type { CountrySlug } from "@/lib/countries/countryConfig";

export const dynamic = "force-dynamic";

function getPreferredCountry(countries: string[]): CountrySlug {
  if (countries.includes("uae") || countries.includes("gcc")) {
    return "uae";
  }

  if (countries.includes("ksa")) {
    return "ksa";
  }

  return "uae";
}

export default async function DashboardPage() {
  const access = await getCurrentUserAccess();

  if (!access.isAuthenticated) {
    redirect("/login");
  }

  const preferredCountry =
    access.role === "admin" || access.subscriptionTier === "admin"
      ? "uae"
      : getPreferredCountry(access.countries);

  const decision = canAccessDashboardSection(
    access,
    preferredCountry,
    "recon"
  );

  if (!decision.allowed) {
    redirect(decision.redirectTo ?? "/upgrade");
  }

  redirect(`/dashboard/${preferredCountry}/recon`);
}