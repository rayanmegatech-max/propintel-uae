import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Database,
  Footprints,
  Gauge,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type {
  Module5DataResult,
  Module5ListPayload,
  Module5Record,
} from "@/lib/data/module5";
import type { ReconMetric } from "@/lib/recon/types";

type AgencyProfilesPageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type AgencyCard = {
  id: string;
  rank: number | null;
  agencyName: string;
  profileType: string | null;
  activeListings: number | null;
  distinctListings: number | null;
  activeAgents: number | null;
  portals: number | null;
  cities: number | null;
  communities: number | null;
  buildings: number | null;
  avgPrice: number | null;
  topCity: string | null;
  topCommunity: string | null;
  topDistrict: string | null;
  topShare: number | null;
  rentShare: number | null;
  buyShare: number | null;
  commercialShare: number | null;
  priceDropRate: number | null;
  refreshRate: number | null;
  ownerDirectRate: number | null;
  oldInventoryRate: number | null;
  pressureScore: number | null;
  pressureLabel: string | null;
  footprintScore: number | null;
  confidence: string | null;
  interpretation: string | null;
  note: string | null;
};

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatLabel(value: string | null): string | null {
  if (!value) return null;

  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeAgencyCard(
  country: CountryConfig,
  record: Module5Record,
  index: number
): AgencyCard {
  const agencyName =
    asString(record.agency_name) ||
    asString(record.agency_display_name) ||
    asString(record.agency_public_key) ||
    `Unknown ${country.label} agency`;

  return {
    id:
      asString(record.agency_public_key) ||
      asString(record.agency_id) ||
      `${country.slug}-agency-${index}`,
    rank: asNumber(record.dashboard_rank) ?? asNumber(record.agency_rank),
    agencyName,
    profileType:
      formatLabel(asString(record.portfolio_type_label)) ||
      formatLabel(asString(record.dashboard_use_case)) ||
      formatLabel(asString(record.market_size_bucket)),
    activeListings: asNumber(record.active_listings),
    distinctListings: asNumber(record.distinct_listing_keys),
    activeAgents:
      asNumber(record.active_agents) ??
      asNumber(record.unique_agents) ??
      asNumber(record.agents),
    portals: asNumber(record.portals),
    cities: asNumber(record.cities),
    communities: asNumber(record.communities),
    buildings: asNumber(record.buildings),
    avgPrice: asNumber(record.avg_price),
    topCity: asString(record.top_city) ?? asString(record.city),
    topCommunity: asString(record.top_community),
    topDistrict:
      asString(record.district_display_name) ??
      asString(record.district) ??
      asString(record.top_district),
    topShare:
      asNumber(record.top_community_share_pct) ??
      asNumber(record.top_building_share_pct) ??
      asNumber(record.top_agency_share_pct),
    rentShare:
      asNumber(record.residential_rent_share_pct) ??
      asNumber(record.rent_share_pct),
    buyShare:
      asNumber(record.residential_buy_share_pct) ??
      asNumber(record.buy_share_pct),
    commercialShare:
      asNumber(record.commercial_rent_share_pct) ??
      asNumber(record.commercial_buy_share_pct) ??
      asNumber(record.commercial_share_pct),
    priceDropRate: asNumber(record.price_drop_rate_pct),
    refreshRate:
      asNumber(record.refresh_inflated_rate_pct) ??
      asNumber(record.refresh_rate_pct),
    ownerDirectRate: asNumber(record.owner_direct_rate_pct),
    oldInventoryRate: asNumber(record.old_inventory_rate_pct),
    pressureScore:
      asNumber(record.portfolio_pressure_score) ??
      asNumber(record.inventory_pressure_score) ??
      asNumber(record.pressure_score),
    pressureLabel:
      formatLabel(asString(record.portfolio_pressure_label)) ||
      formatLabel(asString(record.pressure_bucket)) ||
      formatLabel(asString(record.inventory_status_label)),
    footprintScore:
      asNumber(record.footprint_score) ?? asNumber(record.activity_score),
    confidence: formatLabel(asString(record.confidence_tier)),
    interpretation:
      asString(record.recommended_interpretation) ||
      asString(record.interpretation_note) ||
      asString(record.pressure_action),
    note:
      asString(record.explanation) ||
      asString(record.product_note) ||
      asString(record.dashboard_use_case),
  };
}

function EmptyAgencyState({
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
          {country.label} Agency Profile export not loaded
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-100/80">
          {message}
        </p>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-slate-950/50 p-4">
          <p className="text-sm font-semibold text-white">Run locally:</p>
          <code className="mt-2 block rounded-lg bg-black/30 p-3 text-xs text-slate-300">
            {country.slug === "uae"
              ? "python tools\\export_uae_module5_frontend_data.py"
              : "python tools\\export_ksa_module5_frontend_data.py"}
          </code>
        </div>
      </section>
    </div>
  );
}

function AgencySignalCard({
  country,
  card,
}: {
  country: CountryConfig;
  card: AgencyCard;
}) {
  return (
    <article className="rounded-[1.45rem] border border-white/[0.08] bg-slate-950/45 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition hover:border-emerald-300/25 hover:bg-white/[0.055]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
          <Users className="h-3.5 w-3.5" />
          Agency Footprint
        </span>

        {card.profileType ? (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {card.profileType}
          </span>
        ) : null}

        {card.confidence ? (
          <span className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200">
            {card.confidence}
          </span>
        ) : null}
      </div>

      <h3 className="text-base font-black tracking-tight text-white">
        {card.agencyName}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        Public agency inventory profile based on visible listing activity. This
        is not an agency quality score or misconduct signal.
      </p>

      {card.interpretation ? (
        <p className="mt-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-2 text-xs leading-5 text-emerald-100/85">
          {card.interpretation}
        </p>
      ) : null}

      {card.note ? (
        <p className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs leading-5 text-slate-300">
          {card.note}
        </p>
      ) : null}

      <div className="mt-4 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
        {card.activeListings !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Active listings</span>
            <span className="font-black text-white">
              {formatNumber(card.activeListings)}
            </span>
          </div>
        ) : null}

        {card.activeAgents !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Active agents</span>
            <span className="font-black text-white">
              {formatNumber(card.activeAgents)}
            </span>
          </div>
        ) : null}

        {card.avgPrice !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Avg price</span>
            <span className="font-black text-white">
              {formatCurrency(card.avgPrice, country.currency)}
            </span>
          </div>
        ) : null}

        {card.footprintScore !== null ? (
          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-2">
            <span className="block text-emerald-100/70">Footprint score</span>
            <span className="font-black text-emerald-100">
              {formatNumber(card.footprintScore)}
            </span>
          </div>
        ) : null}

        {card.pressureScore !== null ? (
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-2">
            <span className="block text-amber-100/70">Pressure score</span>
            <span className="font-black text-amber-100">
              {formatNumber(card.pressureScore)}
            </span>
          </div>
        ) : null}

        {card.priceDropRate !== null ? (
          <div className="rounded-xl border border-red-400/15 bg-red-400/[0.06] p-2">
            <span className="block text-red-100/70">Price-drop rate</span>
            <span className="font-black text-red-100">
              {formatPercent(card.priceDropRate)}
            </span>
          </div>
        ) : null}

        {card.refreshRate !== null ? (
          <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] p-2">
            <span className="block text-cyan-100/70">Refresh rate</span>
            <span className="font-black text-cyan-100">
              {formatPercent(card.refreshRate)}
            </span>
          </div>
        ) : null}

        {card.ownerDirectRate !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Owner/direct rate</span>
            <span className="font-black text-white">
              {formatPercent(card.ownerDirectRate)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
        {card.topCity ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
            <Building2 className="h-3.5 w-3.5 text-violet-300" />
            {card.topCity}
          </span>
        ) : null}

        {card.topCommunity ? (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
            {card.topCommunity}
          </span>
        ) : null}

        {card.topDistrict ? (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
            {card.topDistrict}
          </span>
        ) : null}

        {card.topShare !== null ? (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
            Top location share: {formatPercent(card.topShare)}
          </span>
        ) : null}

        {card.pressureLabel ? (
          <span className="rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-3 py-1 text-amber-100">
            {card.pressureLabel}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function AgencyLane({
  country,
  payload,
  cards,
}: {
  country: CountryConfig;
  payload: Module5ListPayload;
  cards: AgencyCard[];
}) {
  return (
    <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            {payload.source_table}
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {country.label} agency footprint sample
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Showing dashboard-safe agency inventory profile records from Module
            5. These records describe public listing footprint, not agency
            quality or official market share.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1">
            {formatNumber(payload.total_rows_available)} total
          </span>
          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1">
            {formatNumber(payload.exported_rows)} exported
          </span>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {cards.map((card) => (
          <AgencySignalCard key={card.id} country={country} card={card} />
        ))}
      </div>
    </section>
  );
}

export default function AgencyProfilesPage({
  country,
  data,
}: AgencyProfilesPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyAgencyState country={country} message={data.message} />;
  }

  const payload =
    country.slug === "uae" ? data.agencyProfiles : data.agencyProfilesMajor;

  if (!payload || payload.status !== "ready" || payload.items.length === 0) {
    return (
      <EmptyAgencyState
        country={country}
        message={`${country.label} Agency Profile export loaded, but no usable agency profile records were available in the local frontend sample.`}
      />
    );
  }

  const cards = payload.items.map((record, index) =>
    normalizeAgencyCard(country, record, index)
  );

  const visibleCards = cards.slice(0, 24);

  const withPressureScore = cards.filter(
    (card) => card.pressureScore !== null
  ).length;

  const withFootprintScore = cards.filter(
    (card) => card.footprintScore !== null
  ).length;

  const totalListings = cards.reduce(
    (sum, card) => sum + (card.activeListings ?? 0),
    0
  );

  const averageListings =
    cards.length > 0 ? totalListings / cards.length : null;

  const highPressureCount = cards.filter((card) => {
    const label = `${card.pressureLabel ?? ""}`.toLowerCase();
    return (
      label.includes("high") ||
      label.includes("elevated") ||
      label.includes("critical")
    );
  }).length;

  const metrics: ReconMetric[] = [
    {
      label: "Agency rows",
      value: formatNumber(payload.total_rows_available),
      description: `Rows available in ${payload.source_table}.`,
      tone: "emerald",
    },
    {
      label: "Exported sample",
      value: formatNumber(payload.exported_rows),
      description: "Rows loaded into this local frontend preview.",
      tone: "cyan",
    },
    {
      label: "Avg listings",
      value: averageListings === null ? "—" : formatNumber(averageListings),
      description: "Average active listings across the exported sample.",
      tone: "teal",
    },
    {
      label: "Pressure signals",
      value: formatNumber(highPressureCount || withPressureScore),
      description: "Sample rows exposing portfolio pressure context.",
      tone: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
                <Users className="h-3.5 w-3.5" />
                {country.label} Agency Profiles
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Module 5 real data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Agency Inventory Profile
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A dashboard-safe Module 5 agency footprint view. It summarizes
              visible public inventory, portfolio concentration, listing mix,
              location presence, and pressure context without making claims about
              agency quality, misconduct, or official market share.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/market-intelligence`}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(16,185,129,0.18)] transition hover:bg-emerald-400"
              >
                Open Market Intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`${country.routeBase}/market-dominance`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Open Market Dominance
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.7rem] border border-emerald-400/20 bg-emerald-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-emerald-50">
                  Safe agency wording
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                  This page describes visible public agency footprint only. It
                  does not score agency quality, accuse misconduct, or claim
                  official market share.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Source table: ${payload.source_table}`,
                `Exported rows: ${payload.exported_rows.toLocaleString("en-US")}`,
                `Total rows: ${payload.total_rows_available.toLocaleString("en-US")}`,
                `Rows with footprint score: ${withFootprintScore.toLocaleString("en-US")}`,
                `Rows with pressure score: ${withPressureScore.toLocaleString("en-US")}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-emerald-50/90"
                >
                  {item}
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

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Footprints className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Public footprint
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Agency rows describe visible public listing inventory, portal mix,
            location spread, and listing-category exposure.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Network className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Portfolio context
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            The page helps users understand agency listing concentration and
            market presence without treating the data as official market share.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <Gauge className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Pressure exposure
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Pressure context can help prioritize portfolio review. It does not
            imply distress, bad quality, or seller motivation.
          </p>
        </div>
      </section>

      <AgencyLane country={country} payload={payload} cards={visibleCards} />
    </div>
  );
}