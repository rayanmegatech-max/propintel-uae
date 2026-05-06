import { notFound } from "next/navigation";
import ActivityFeedPage from "../../_components/ActivityFeedPage";
import CountryModulePlaceholderPage from "../../_components/CountryModulePlaceholderPage";
import KsaReconDataPage from "../../_components/KsaReconDataPage";
import ListingTruthRadarPage from "../../_components/ListingTruthRadarPage";
import OwnerDirectRadarPage from "../../_components/OwnerDirectRadarPage";
import PriceDropRadarPage from "../../_components/PriceDropRadarPage";
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
import { getModule5Data } from "@/lib/data/module5";
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

  if (country === "uae" && section === "owner-direct") {
    const data = await getUaeReconData();

    return <OwnerDirectRadarPage country={countryConfig} data={data} />;
  }

  if (country === "ksa" && section === "owner-direct") {
    const data = await getKsaReconData();

    return <OwnerDirectRadarPage country={countryConfig} data={data} />;
  }

  if (country === "uae" && section === "price-drops") {
    const data = await getUaeReconData();

    return <PriceDropRadarPage country={countryConfig} data={data} />;
  }

  if (country === "ksa" && section === "price-drops") {
    const data = await getKsaReconData();

    return <PriceDropRadarPage country={countryConfig} data={data} />;
  }

  if (country === "uae" && section === "listing-age") {
    const data = await getUaeReconData();

    return <ListingTruthRadarPage country={countryConfig} data={data} />;
  }

  if (country === "ksa" && section === "listing-age") {
    const data = await getKsaReconData();

    return <ListingTruthRadarPage country={countryConfig} data={data} />;
  }

  if (section === "activity-feed") {
    const data = await getModule5Data(country);

    return <ActivityFeedPage country={countryConfig} data={data} />;
  }

  return (
    <CountryModulePlaceholderPage
      country={countryConfig}
      section={productSection}
    />
  );
}