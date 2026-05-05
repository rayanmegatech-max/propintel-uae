import { notFound } from "next/navigation";
import CountryOverviewPage from "../_components/CountryOverviewPage";
import {
  COUNTRY_LIST,
  getCountryConfig,
  type CountrySlug,
} from "@/lib/countries/countryConfig";

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

  return <CountryOverviewPage country={countryConfig} />;
}