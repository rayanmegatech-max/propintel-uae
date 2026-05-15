import { notFound, redirect } from "next/navigation";

import { getCurrentUserAccess } from "@/lib/auth/sessionHelper";
import { canAccessDashboardSection } from "@/lib/auth/entitlementHelper";
import {
  COUNTRY_LIST,
  getCountryConfig,
  type CountrySlug,
} from "@/lib/countries/countryConfig";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return COUNTRY_LIST.map((country) => ({
    country: country.slug,
  }));
}

export default async function CountryDashboardPage({
  params,
}: {
  params: Promise<{ country: CountrySlug }>;
}) {
  const { country } = await params;
  const countryConfig = getCountryConfig(country);

  if (!countryConfig) {
    notFound();
  }

  const access = await getCurrentUserAccess();
  const decision = canAccessDashboardSection(access, country, "recon");

  if (!decision.allowed) {
    redirect(decision.redirectTo ?? "/upgrade");
  }

  redirect(`/dashboard/${country}/recon`);
}