import { notFound } from "next/navigation";
import CountryModulePlaceholderPage from "../../_components/CountryModulePlaceholderPage";
import {
  COUNTRY_LIST,
  getCountryConfig,
  type CountrySlug,
} from "@/lib/countries/countryConfig";
import {
  PRODUCT_SECTIONS,
  getProductSection,
  type ProductSectionSlug,
} from "@/lib/countries/productNavigation";

export function generateStaticParams() {
  return COUNTRY_LIST.flatMap((country) =>
    PRODUCT_SECTIONS.map((section) => ({
      country: country.slug,
      section: section.slug,
    }))
  );
}

export default async function CountrySectionPage({
  params,
}: {
  params: Promise<{ country: CountrySlug; section: ProductSectionSlug }>;
}) {
  const { country, section } = await params;

  const countryConfig = getCountryConfig(country);
  const productSection = getProductSection(section);

  if (!countryConfig || !productSection) {
    notFound();
  }

  return (
    <CountryModulePlaceholderPage
      country={countryConfig}
      section={productSection}
    />
  );
}