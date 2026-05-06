import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Database,
  Gauge,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import ReconOpportunityCard from "./ReconOpportunityCard";
import { formatNumber } from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { KsaReconDataResult } from "@/lib/data/ksaRecon";
import type { UaeReconDataResult } from "@/lib/data/uaeRecon";
import type { ReconMetric, NormalizedReconOpportunity } from "@/lib/recon/types";

type ListingTruthRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

type ListingTruthLane = {
  label: string;
  description: string;
  sourceTable: string;
  totalRows: number;
  exportedRows: number;
  items: NormalizedReconOpportunity[];
};

function EmptyListingTruthState({
  country,
  message,
}: {
  country: CountryConfig;
  message: string;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6 backdrop-blur-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
          <Database className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-bold text-white">
          {country.label} Listing Truth export not loaded
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-100/80">
          {message}
        </p>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-slate-950/50 p-4">
          <p className="text-sm font-semibold text-white">Run locally:</p>
          <code className="mt-2 block rounded-lg bg-black/30 p-3 text-xs text-slate-300">
            {country.slug === "uae"
              ? "python tools\\export_uae_recon_frontend_data.py"
              : "python tools\\export_ksa_recon_frontend_data.py"}
          </code>
        </div>
      </section>
    </div>
  );
}

function buildLanes(
  country: CountryConfig,
  data: UaeReconDataResult | KsaReconDataResult
): ListingTruthLane[] {
  if (country.slug === "uae") {
    const uaeData = data as UaeReconDataResult;

    return [
      {
        label: "Listing Truth",
        description: "True age and listing-history style signals.",
        sourceTable: uaeData.lists.listingTruth?.source_table ?? "",
        totalRows: uaeData.lists.listingTruth?.total_rows_available ?? 0,
        exportedRows: uaeData.lists.listingTruth?.exported_rows ?? 0,
        items: uaeData.lists.listingTruth
          ? normalizeReconList(
              uaeData.lists.listingTruth.items,
              "uae",
              uaeData.lists.listingTruth.source_table
            )
          : [],
      },
      {
        label: "Refresh Inflated",
        description: "Listings with refresh/repost inflation signals.",
        sourceTable: uaeData.lists.refreshInflated?.source_table ?? "",
        totalRows: uaeData.lists.refreshInflated?.total_rows_available ?? 0,
        exportedRows: uaeData.lists.refreshInflated?.exported_rows ?? 0,
        items: uaeData.lists.refreshInflated
          ? normalizeReconList(
              uaeData.lists.refreshInflated.items,
              "uae",
              uaeData.lists.refreshInflated.source_table
            )
          : [],
      },
      {
        label: "Stale + Price Drops",
        description: "Older listings with price-drop opportunity context.",
        sourceTable: uaeData.lists.stalePriceDrops?.source_table ?? "",
        totalRows: uaeData.lists.stalePriceDrops?.total_rows_available ?? 0,
        exportedRows: uaeData.lists.stalePriceDrops?.exported_rows ?? 0,
        items: uaeData.lists.stalePriceDrops
          ? normalizeReconList(
              uaeData.lists.stalePriceDrops.items,
              "uae",
              uaeData.lists.stalePriceDrops.source_table
            )
          : [],
      },
    ].filter((lane) => lane.items.length > 0);
  }

  const ksaData = data as KsaReconDataResult;

  return [
    {
      label: "Refresh Inflation",
      description: "KSA refresh/repost inflation and stale listing signals.",
      sourceTable: ksaData.lists.refreshInflation?.source_table ?? "",
      totalRows: ksaData.lists.refreshInflation?.total_rows_available ?? 0,
      exportedRows: ksaData.lists.refreshInflation?.exported_rows ?? 0,
      items: ksaData.lists.refreshInflation
        ? normalizeReconList(
            ksaData.lists.refreshInflation.items,
            "ksa",
            ksaData.lists.refreshInflation.source_table
          )
        : [],
    },
  ].filter((lane) => lane.items.length > 0);
}

function LanePanel({ lane }: { lane: ListingTruthLane }) {
  const visibleItems = lane.items.slice(0, 18);

  return (
    <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
            <Clock3 className="h-3.5 w-3.5" />
            {lane.label}
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {lane.label} sample
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            {lane.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1">
            {lane.sourceTable}
          </span>
          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1">
            {formatNumber(lane.totalRows)} total
          </span>
          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1">
            {formatNumber(lane.exportedRows)} exported
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {visibleItems.map((opportunity) => (
          <ReconOpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </section>
  );
}

export default function ListingTruthRadarPage({
  country,
  data,
}: ListingTruthRadarPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyListingTruthState country={country} message={data.message} />;
  }

  const lanes = buildLanes(country, data);

  if (lanes.length === 0) {
    return (
      <EmptyListingTruthState
        country={country}
        message={`${country.label} Listing Truth / Refresh Inflation export loaded, but no usable records were available in the local frontend sample.`}
      />
    );
  }

  const combinedItems = lanes.flatMap((lane) => lane.items);
  const totalRows = lanes.reduce((sum, lane) => sum + lane.totalRows, 0);
  const exportedRows = lanes.reduce((sum, lane) => sum + lane.exportedRows, 0);

  const oldInventoryCount = combinedItems.filter((item) =>
    item.signalBadges.some((badge) =>
      ["old", "stale", "age"].some((word) =>
        badge.label.toLowerCase().includes(word)
      )
    )
  ).length;

  const refreshSignalCount = combinedItems.filter((item) =>
    item.signalBadges.some((badge) =>
      ["refresh", "inflated"].some((word) =>
        badge.label.toLowerCase().includes(word)
      )
    )
  ).length;

  const metrics: ReconMetric[] = [
    {
      label: "Truth/refresh rows",
      value: formatNumber(totalRows),
      description: "Total rows available across the mapped truth/refresh lanes.",
      tone: "amber",
    },
    {
      label: "Exported sample",
      value: formatNumber(exportedRows),
      description: "Rows loaded into this local frontend preview.",
      tone: "cyan",
    },
    {
      label: "Old/stale signals",
      value: formatNumber(oldInventoryCount),
      description: "Sample rows with old inventory, stale, or age-style badges.",
      tone: "red",
    },
    {
      label: "Refresh signals",
      value: formatNumber(refreshSignalCount),
      description: "Sample rows with refresh/repost inflation style badges.",
      tone: "teal",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">
                <Gauge className="h-3.5 w-3.5" />
                {country.label} Listing Truth
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Real exported data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Listing Truth / Refresh Inflation
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A product-safe listing history view for true age, stale inventory,
              refresh inflation, and reposting-style public listing signals. This
              module helps users understand whether an advertised listing looks
              genuinely fresh or has older public-listing context.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/recon`}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(251,191,36,0.18)] transition hover:bg-amber-400"
              >
                Compare with Recon Hub
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={country.routeBase}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Back to {country.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.7rem] border border-amber-400/20 bg-amber-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-amber-50">
                  Safe listing-truth language
                </h2>
                <p className="mt-2 text-sm leading-6 text-amber-100/75">
                  This page does not accuse listings of being fake or fraudulent.
                  It shows public listing age, refresh, stale, and reposting-style
                  signals using cautious opportunity wording.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {lanes.map((lane) => (
                <div
                  key={lane.label}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-amber-50/90"
                >
                  {lane.label}: {formatNumber(lane.totalRows)} total ·{" "}
                  {formatNumber(lane.exportedRows)} exported
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <ReconMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      {lanes.map((lane) => (
        <LanePanel key={lane.label} lane={lane} />
      ))}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <RefreshCcw className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Refresh context
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Refresh/repost inflation should be interpreted as public listing
            behavior, not proof of seller intent or listing misconduct.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Frontend table target
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This page reuses existing Recon truth/refresh exports. Future versions
            can receive dedicated listing-age adapters if deeper fields are needed.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Third standalone module
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Listing Truth becomes the third non-Recon page converted from a
            placeholder shell into a real exported-data product page.
          </p>
        </div>
      </section>
    </div>
  );
}
