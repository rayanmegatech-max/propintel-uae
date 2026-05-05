import { notFound } from "next/navigation";
import CountryModulePlaceholderPage from "../../_components/CountryModulePlaceholderPage";
import KsaReconDataPage from "../../_components/KsaReconDataPage";
import UaeReconDataPage from "../../_components/UaeReconDataPage";
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
import { getKsaReconData } from "@/lib/data/ksaRecon";
import { getUaeReconData } from "@/lib/data/uaeRecon";

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

  if (country === "uae" && section === "recon") {
    const data = await getUaeReconData();

    return <UaeReconDataPage data={data} />;
  }

  if (country === "ksa" && section === "recon") {
    const data = await getKsaReconData();

    return <KsaReconDataPage data={data} />;
  }

  return (
    <CountryModulePlaceholderPage
      country={countryConfig}
      section={productSection}
    />
  );
}