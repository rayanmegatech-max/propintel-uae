import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Database,
  Gauge,
  Landmark,
  Map,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type {
  Module5DataResult,
  Module5ListPayload,
  Module5Record,
} from "@/lib/data/module5";
import type { ReconMetric } from "@/lib/recon/types";

type MarketIntelligencePageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type MarketCard = {
  id: string;
  rank: number | null;
  title: string;
  subtitle: string;
  location: string;
  sourceCategory: string | null;
  activeListings: number | null;
  agencies: number | null;
  agents: number | null;
  buildings: number | null;
  avgPrice: number | null;
  topAgency: string | null;
  topAgencyShare: number | null;
  concentration: string | null;
  dominanceScore: number | null;
  pressureScore: number | null;
  pressureLabel: string | null;
  priceDropRate: number | null;
  refreshRate: number | null;
  ownerDirectRate: number | null;
  confidence: string | null;
  explanation: string | null;
  action: string | null;
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

function joinParts(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(" · ");
}

function getSummaryMetric(data: Module5DataResult, metricKey: string): number | null {
  const row = data.summary?.items.find(
    (item) => asString(item.metric_key) === metricKey
  );

  return asNumber(row?.metric_value) ?? asNumber(row?.rows);
}

function getPayloadRows(payload: Module5ListPayload | null): number {
  return payload?.total_rows_available ?? 0;
}

function getMarketLocation(country: CountryConfig, record: Module5Record): string {
  if (country.slug === "ksa") {
    return (
      joinParts([
        asString(record.city_display_name) ?? asString(record.city),
        asString(record.district_display_name) ?? asString(record.district),
      ]) || "KSA market"
    );
  }

  return (
    joinParts([
      asString(record.city),
      asString(record.community),
      asString(record.building_name),
    ]) || "UAE market"
  );
}

function normalizeMarketCard(
  country: CountryConfig,
  record: Module5Record,
  index: number,
  fallbackType: string
): MarketCard {
  const location = getMarketLocation(country, record);

  const activeListings =
    asNumber(record.active_listings) ?? asNumber(record.total_listings);

  const agencies =
    asNumber(record.agencies) ??
    asNumber(record.unique_agencies) ??
    asNumber(record.total_agencies);

  const agents =
    asNumber(record.agents) ??
    asNumber(record.unique_agents) ??
    asNumber(record.total_agents);

  const buildings =
    asNumber(record.buildings) ??
    asNumber(record.building_count) ??
    asNumber(record.unique_districts);

  const title =
    asString(record.intelligence_label) ||
    asString(record.dashboard_card_type) ||
    asString(record.dashboard_use_case) ||
    `${location} intelligence`;

  const subtitle =
    formatLabel(asString(record.dashboard_level)) ||
    formatLabel(asString(record.market_level)) ||
    fallbackType;

  return {
    id:
      asString(record.market_key) ||
      asString(record.canonical_market_key) ||
      `${country.slug}-market-card-${fallbackType}-${index}`,
    rank: asNumber(record.dashboard_rank),
    title,
    subtitle,
    location,
    sourceCategory: formatLabel(asString(record.source_category)),
    activeListings,
    agencies,
    agents,
    buildings,
    avgPrice: asNumber(record.avg_price),
    topAgency: asString(record.top_agency_name),
    topAgencyShare:
      asNumber(record.top_agency_share_pct) ??
      asNumber(record.top3_agency_share_pct) ??
      asNumber(record.top_5_agency_share_pct),
    concentration:
      formatLabel(asString(record.concentration_label)) ||
      formatLabel(asString(record.concentration_bucket)),
    dominanceScore: asNumber(record.dominance_score),
    pressureScore:
      asNumber(record.inventory_pressure_score) ?? asNumber(record.pressure_score),
    pressureLabel:
      formatLabel(asString(record.pressure_label)) ||
      formatLabel(asString(record.pressure_bucket)),
    priceDropRate: asNumber(record.price_drop_rate_pct),
    refreshRate:
      asNumber(record.refresh_inflated_rate_pct) ??
      asNumber(record.refresh_rate_pct),
    ownerDirectRate: asNumber(record.owner_direct_rate_pct),
    confidence: formatLabel(asString(record.confidence_tier)),
    explanation:
      asString(record.explanation) ||
      asString(record.interpretation_note) ||
      asString(record.product_note),
    action:
      asString(record.recommended_action) ||
      asString(record.recommended_use) ||
      asString(record.pressure_action),
  };
}

function EmptyMarketState({
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
          {country.label} Market Intelligence export not loaded
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

function MarketSignalCard({
  country,
  card,
}: {
  country: CountryConfig;
  card: MarketCard;
}) {
  return (
    <article className="rounded-[1.45rem] border border-white/[0.08] bg-slate-950/45 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition hover:border-cyan-300/25 hover:bg-white/[0.055]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">
          <MapPin className="h-3.5 w-3.5" />
          {card.subtitle}
        </span>

        {card.sourceCategory ? (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {card.sourceCategory}
          </span>
        ) : null}

        {card.confidence ? (
          <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">
            {card.confidence}
          </span>
        ) : null}
      </div>

      <h3 className="text-base font-black tracking-tight text-white">
        {card.location}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-400">{card.title}</p>

      {card.explanation ? (
        <p className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs leading-5 text-slate-300">
          {card.explanation}
        </p>
      ) : null}

      {card.action ? (
        <p className="mt-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07] px-3 py-2 text-xs leading-5 text-cyan-100/85">
          {card.action}
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

        {card.agencies !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Agencies</span>
            <span className="font-black text-white">
              {formatNumber(card.agencies)}
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

        {card.pressureScore !== null ? (
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-2">
            <span className="block text-amber-100/70">Pressure score</span>
            <span className="font-black text-amber-100">
              {formatNumber(card.pressureScore)}
            </span>
          </div>
        ) : null}

        {card.dominanceScore !== null ? (
          <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.06] p-2">
            <span className="block text-violet-100/70">Dominance score</span>
            <span className="font-black text-violet-100">
              {formatNumber(card.dominanceScore)}
            </span>
          </div>
        ) : null}

        {card.topAgencyShare !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Top agency share</span>
            <span className="font-black text-white">
              {formatPercent(card.topAgencyShare)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
        {card.topAgency ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
            <Building2 className="h-3.5 w-3.5 text-violet-300" />
            {card.topAgency}
          </span>
        ) : null}

        {card.pressureLabel ? (
          <span className="rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-3 py-1 text-amber-100">
            {card.pressureLabel}
          </span>
        ) : null}

        {card.concentration ? (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
            {card.concentration}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function MarketLane({
  country,
  title,
  description,
  payload,
  fallbackType,
  limit = 6,
}: {
  country: CountryConfig;
  title: string;
  description: string;
  payload: Module5ListPayload | null;
  fallbackType: string;
  limit?: number;
}) {
  if (!payload || payload.items.length === 0) return null;

  const cards = payload.items
    .slice(0, limit)
    .map((record, index) =>
      normalizeMarketCard(country, record, index, fallbackType)
    );

  return (
    <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            {payload.source_table}
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
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
          <MarketSignalCard key={card.id} country={country} card={card} />
        ))}
      </div>
    </section>
  );
}

export default function MarketIntelligencePage({
  country,
  data,
}: MarketIntelligencePageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyMarketState country={country} message={data.message} />;
  }

  const isUae = country.slug === "uae";

  const primaryLocationPayload = isUae
    ? data.communityIntelligence
    : data.cityIntelligenceMajor ?? data.cityIntelligence;

  const pressurePayload = isUae
    ? data.inventoryPressure
    : data.inventoryPressureLarge;

  const dominancePayload = isUae
    ? data.marketDominance
    : data.marketDominanceLarge;

  const agencyPayload = isUae ? data.agencyProfiles : data.agencyProfilesMajor;

  const activityPayload = data.activityFeed;

  const activeMarkets = isUae
    ? getPayloadRows(data.communityIntelligence)
    : getPayloadRows(data.districtIntelligence);

  const activityRows = getPayloadRows(activityPayload);

  const pressureRows = getPayloadRows(pressurePayload);
  const dominanceRows = getPayloadRows(dominancePayload);
  const agencyRows = getPayloadRows(agencyPayload);

  const totalSummaryRows = data.summary?.items.length ?? 0;

  const highPressureMetric = isUae
    ? getSummaryMetric(data, "high_pressure_communities")
    : getSummaryMetric(data, "ksa_module5_dashboard_inventory_pressure_large_markets");

  const activityMetric = isUae
    ? getSummaryMetric(data, "market_activity_feed")
    : getSummaryMetric(data, "ksa_module5_dashboard_activity_priority");

  const agencyMetric = isUae
    ? getSummaryMetric(data, "agency_inventory_profiles")
    : getSummaryMetric(data, "ksa_module5_dashboard_agency_profiles_major");

  const metrics: ReconMetric[] = [
    {
      label: isUae ? "Community markets" : "City/district markets",
      value: formatNumber(activeMarkets),
      description: isUae
        ? "Dashboard-ready UAE community intelligence rows."
        : "KSA city/district intelligence rows available from Module 5 exports.",
      tone: "cyan",
    },
    {
      label: "Activity rows",
      value: formatNumber(activityMetric ?? activityRows),
      description: "Frontend-safe activity feed rows from Module 5 dashboard exports.",
      tone: "teal",
    },
    {
      label: "Pressure rows",
      value: formatNumber(highPressureMetric ?? pressureRows),
      description: "Inventory pressure rows or high-pressure summary metric.",
      tone: "amber",
    },
    {
      label: "Agency profiles",
      value: formatNumber(agencyMetric ?? agencyRows),
      description: "Public agency footprint rows available to market intelligence.",
      tone: "slate",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                <BarChart3 className="h-3.5 w-3.5" />
                {country.label} Market Intelligence
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Module 5 real data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Market Intelligence Command Center
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A country-aware Module 5 market intelligence page built from
              dashboard-ready exports. It summarizes public listing activity,
              inventory pressure, visible listing-share concentration, agency
              footprint, and location-level opportunity signals without exposing
              raw internal evidence tables.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/activity-feed`}
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(34,211,238,0.16)] transition hover:bg-cyan-400"
              >
                Open Activity Feed
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`${country.routeBase}/recon`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Compare with Recon Hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.7rem] border border-cyan-400/20 bg-cyan-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-cyan-50">
                  Dashboard-safe market view
                </h2>
                <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                  This page uses Module 5 dashboard exports only. It avoids raw
                  price history, raw engine tables, unsafe seller-intent claims,
                  and unsafe competitive wording.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Summary rows: ${totalSummaryRows.toLocaleString("en-US")}`,
                `Dominance rows: ${dominanceRows.toLocaleString("en-US")}`,
                `Pressure rows: ${pressureRows.toLocaleString("en-US")}`,
                `Agency rows: ${agencyRows.toLocaleString("en-US")}`,
                `Activity rows: ${activityRows.toLocaleString("en-US")}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-cyan-50/90"
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
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Map className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            {isUae ? "Community intelligence" : "City/district intelligence"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {isUae
              ? "UAE market intelligence prioritizes communities and buildings where backend coverage is strong."
              : "KSA market intelligence prioritizes cities and districts because building/project coverage is intentionally limited in v1."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <Gauge className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Inventory pressure
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Pressure indicators combine public-listing volume, refresh signals,
            owner/direct density, price movement context, and opportunity rates
            using cautious market-signal language.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Agency footprint
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Agency metrics describe visible public listing footprint, portfolio
            concentration, and market presence. They do not score agency quality
            or make misconduct claims.
          </p>
        </div>
      </section>

      <MarketLane
        country={country}
        title={isUae ? "UAE community intelligence" : "KSA major city intelligence"}
        description={
          isUae
            ? "Location-level intelligence combining public listing share, pressure, agency presence, activity, and opportunity density."
            : "Canonical city-level intelligence for major KSA markets using active listings, concentration, pressure, and opportunity rates."
        }
        payload={primaryLocationPayload}
        fallbackType={isUae ? "Community Intelligence" : "City Intelligence"}
        limit={isUae ? 6 : 10}
      />

      <MarketLane
        country={country}
        title="Inventory pressure radar"
        description="Markets where public listing behavior suggests pressure, refresh activity, price movement context, or opportunity density."
        payload={pressurePayload}
        fallbackType="Inventory Pressure"
        limit={6}
      />

      <MarketLane
        country={country}
        title="Visible listing-share / dominance"
        description="Public listing-share concentration and agency presence patterns by supported market level."
        payload={dominancePayload}
        fallbackType="Market Dominance"
        limit={6}
      />

      <MarketLane
        country={country}
        title="Agency footprint sample"
        description="Public agency portfolio and visible market presence signals from dashboard-safe Module 5 exports."
        payload={agencyPayload}
        fallbackType="Agency Footprint"
        limit={6}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Landmark className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Public market intelligence
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This page describes visible public listing activity, not private
            transaction volume or official registry intelligence.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Directional signals
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Pressure, dominance, and agency footprint should guide filtering and
            prioritization, not replace user verification of current listings.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Activity className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Reusable Module 5 foundation
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This page establishes the shared Module 5 market pattern. Dedicated
            Inventory Pressure, Dominance, and Agency Profile pages can reuse the
            same exports and card logic next.
          </p>
        </div>
      </section>
    </div>
  );
}