import { notFound } from "next/navigation";
import ActivityFeedPage from "../../_components/ActivityFeedPage";
import AIReconIntelligencePage from "../../_components/AIReconIntelligencePage";
import AgencyProfilesPage from "../../_components/AgencyProfilesPage";
import BuildingIntelligencePage from "../../_components/BuildingIntelligencePage";
import CountryModulePlaceholderPage from "../../_components/CountryModulePlaceholderPage";
import DataQualityPage from "../../_components/DataQualityPage";
import InventoryPressurePage from "../../_components/InventoryPressurePage";
import KsaReconDataPage from "../../_components/KsaReconDataPage";
import ListingTruthRadarPage from "../../_components/ListingTruthRadarPage";
import CommunitiesPage from "../../_components/CommunitiesPage";
import MarketDominancePage from "../../_components/MarketDominancePage";
import MarketIntelligencePage from "../../_components/MarketIntelligencePage";
import OwnerDirectRadarPage from "../../_components/OwnerDirectRadarPage";
import PriceDropRadarPage from "../../_components/PriceDropRadarPage";
import UaeReconDataPage from "../../_components/UaeReconDataPage";
import MarketRadarPage from "../../_components/MarketRadarPage";
import CompetitorRadarPage from "../../_components/CompetitorRadarPage";

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
import { getExportHealthData } from "@/lib/data/exportHealth";
import { getKsaReconData } from "@/lib/data/ksaRecon";
import { getModule5Data } from "@/lib/data/module5";
import { getModule6Data } from "@/lib/data/module6";
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

  // V1 Combined Workspace Previews
  if (section === "market-radar") {
    return <MarketRadarPage country={countryConfig} />;
  }

  if (section === "competitor-radar") {
    return <CompetitorRadarPage country={countryConfig} />;
  }

  // Existing Legacy Data Routes
  if (country === "uae" && section === "recon") {
    const data = await getUaeReconData();
    return <UaeReconDataPage data={data} />;
  }

  if (country === "ksa" && section === "recon") {
    const data = await getKsaReconData();
    return <KsaReconDataPage data={data} />;
  }

  if (country === "uae" && section === "owner-direct") {
    const data = await getUaeReconData({ views: ["ownerDirect"] });
    return <OwnerDirectRadarPage country={countryConfig} data={data} />;
  }

  if (country === "ksa" && section === "owner-direct") {
    const data = await getKsaReconData({ views: ["ownerDirect"] });
    return <OwnerDirectRadarPage country={countryConfig} data={data} />;
  }

  if (country === "uae" && section === "price-drops") {
    const data = await getUaeReconData({ views: ["priceDrops"] });
    return <PriceDropRadarPage country={countryConfig} data={data} />;
  }

  if (country === "ksa" && section === "price-drops") {
    const data = await getKsaReconData({ views: ["priceDrops"] });
    return <PriceDropRadarPage country={countryConfig} data={data} />;
  }

  if (country === "uae" && section === "listing-age") {
    const data = await getUaeReconData({
      views: ["listingTruth", "refreshInflated", "stalePriceDrops"],
    });
    return <ListingTruthRadarPage country={countryConfig} data={data} />;
  }

  if (country === "ksa" && section === "listing-age") {
    const data = await getKsaReconData({ views: ["refreshInflation"] });
    return <ListingTruthRadarPage country={countryConfig} data={data} />;
  }

  if (section === "ai-recon") {
    const data = await getModule6Data(country);
    return <AIReconIntelligencePage country={countryConfig} data={data} />;
  }

  if (section === "activity-feed") {
    const data = await getModule5Data(country, { views: ["activityFeed"] });
    return <ActivityFeedPage country={countryConfig} data={data} />;
  }

  if (section === "market-intelligence") {
    const data = await getModule5Data(country);
    return <MarketIntelligencePage country={countryConfig} data={data} />;
  }

  if (section === "inventory-pressure") {
    const data = await getModule5Data(country, {
      views:
        country === "uae" ? ["inventoryPressure"] : ["inventoryPressureLarge"],
    });
    return <InventoryPressurePage country={countryConfig} data={data} />;
  }

  if (section === "market-dominance") {
    const data = await getModule5Data(country, {
      views: country === "uae" ? ["marketDominance"] : ["marketDominanceLarge"],
    });
    return <MarketDominancePage country={countryConfig} data={data} />;
  }

  if (section === "agency-profiles") {
    const data = await getModule5Data(country, {
      views: country === "uae" ? ["agencyProfiles"] : ["agencyProfilesMajor"],
    });
    return <AgencyProfilesPage country={countryConfig} data={data} />;
  }

  if (section === "communities") {
    const data = await getModule5Data(country, {
      views:
        country === "uae"
          ? ["communityIntelligence"]
          : ["cityIntelligence", "cityIntelligenceMajor", "districtIntelligence"],
    });
    return <CommunitiesPage country={countryConfig} data={data} />;
  }

  if (section === "buildings") {
    const data = await getModule5Data(country, {
      views: country === "uae" ? ["buildingIntelligence"] : [],
    });
    return <BuildingIntelligencePage country={countryConfig} data={data} />;
  }

  if (section === "data-quality") {
    const data = await getExportHealthData(country);
    return <DataQualityPage country={countryConfig} data={data} />;
  }

  return (
    <CountryModulePlaceholderPage
      country={countryConfig}
      section={productSection}
    />
  );
}
