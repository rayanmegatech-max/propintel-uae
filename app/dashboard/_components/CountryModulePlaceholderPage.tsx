import Link from "next/link";
import {
  ArrowRight,
  Database,
  Lock,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { ProductSection } from "@/lib/countries/productNavigation";

type CountryModulePlaceholderPageProps = {
  country: CountryConfig;
  section: ProductSection;
};

function getRelevantTables(country: CountryConfig, sectionSlug: string) {
  const tables = country.tables;

  switch (sectionSlug) {
    case "recon":
      return [
        tables.reconMain,
        tables.reconHotLeads,
        tables.reconSummary,
        tables.reconOwnerDirect,
        tables.reconPriceDrops,
        tables.reconRefreshInflated || tables.reconRefreshInflation,
      ].filter(Boolean);

    case "owner-direct":
      return [tables.ownerDirect, tables.reconOwnerDirect].filter(Boolean);

    case "price-drops":
      return [
        tables.priceDrops,
        tables.reconPriceDrops,
        tables.priceMovementActivity,
      ].filter(Boolean);

    case "listing-age":
      return [
        tables.listingAge,
        tables.refreshInflation,
        tables.refreshInflatedDashboard,
        tables.refreshInflationDashboard,
        tables.listingTruthDashboard,
      ].filter(Boolean);

    case "market-intelligence":
      return [
        tables.module5Summary,
        tables.module5ActivityFeed,
        tables.module5ActivityPriority,
        tables.module5CommunityIntel,
        tables.module5CityIntel,
        tables.module5DistrictIntel,
        tables.module5BuildingIntel,
      ].filter(Boolean);

    case "inventory-pressure":
      return [
        tables.module5InventoryPressure,
        tables.module5InventoryPressureLarge,
        tables.module5InventoryPressureSmall,
      ].filter(Boolean);

    case "market-dominance":
      return [
        tables.module5MarketDominance,
        tables.module5MarketDominanceLarge,
        tables.module5MarketDominanceSmall,
      ].filter(Boolean);

    case "agency-profiles":
      return [
        tables.module5AgencyProfiles,
        tables.module5AgencyProfilesMajor,
        tables.module5AgencyProfilesMicro,
      ].filter(Boolean);

    case "activity-feed":
      return [
        tables.module5ActivityFeed,
        tables.module5ActivityPriority,
        tables.module5ActivityRecon,
        tables.module5ActivityPressure,
        tables.module5ActivityDominance,
        tables.module5ActivityAgency,
      ].filter(Boolean);

    case "buildings":
      return [tables.module5BuildingIntel].filter(Boolean);

    case "communities":
      return [
        tables.module5CommunityIntel,
        tables.module5CityIntel,
        tables.module5DistrictIntel,
      ].filter(Boolean);

    case "data-quality":
      return [
        tables.module5Summary,
        tables.reconSummary,
        tables.module5CityAliasAudit,
        tables.module5DistrictAliasAudit,
      ].filter(Boolean);

    default:
      return [];
  }
}

export default function CountryModulePlaceholderPage({
  country,
  section,
}: CountryModulePlaceholderPageProps) {
  const relevantTables = getRelevantTables(country, section.slug);
  const disabledReason = country.disabledSections?.[section.slug];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <Database className="h-3.5 w-3.5" />
          {country.label} · {section.eyebrow}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {section.label}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
              {section.description}
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              {section.primaryUse}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-300">
                Country: {country.label}
              </span>
              <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-300">
                Currency: {country.currency}
              </span>
              <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-300">
                Route: {country.routeBase}/{section.slug}
              </span>
            </div>
          </div>

          <div
            className={[
              "rounded-2xl border p-4",
              disabledReason
                ? "border-amber-400/20 bg-amber-400/10"
                : "border-emerald-400/20 bg-emerald-400/10",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              {disabledReason ? (
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              ) : (
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              )}

              <div>
                <h2
                  className={[
                    "text-sm font-semibold",
                    disabledReason ? "text-amber-100" : "text-emerald-100",
                  ].join(" ")}
                >
                  {disabledReason ? "Country caveat" : "Phase 5C.1 shell"}
                </h2>
                <p
                  className={[
                    "mt-1 text-xs leading-5",
                    disabledReason ? "text-amber-100/70" : "text-emerald-100/70",
                  ].join(" ")}
                >
                  {disabledReason ||
                    "This country-aware page is intentionally not connected to live data yet. Data wiring starts after country routes and table contracts are stable."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Product-safe tables
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relevantTables.length > 0 ? (
              relevantTables.map((table) => (
                <span
                  key={table}
                  className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300"
                >
                  {table}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">
                Schema inspection required before wiring this page.
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            First filters later
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "country",
              "city",
              "district/community",
              "source_category",
              "portal",
              "property_type",
              "price range",
              "priority/confidence",
            ].map((filter) => (
              <span
                key={filter}
                className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300"
              >
                {filter}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Safe wording rule
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Use opportunity, signal, public listing activity, price movement,
            visible listing share, and inventory pressure. Avoid claims like
            fraud, fake listing, desperate seller, guaranteed owner lead, or bad
            agency.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Next implementation phase
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              After this shell passes build, we will define the data contracts and
              export/sync path before connecting real records.
            </p>
          </div>

          <Link
            href={country.routeBase}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
          >
            Back to {country.label} overview
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}