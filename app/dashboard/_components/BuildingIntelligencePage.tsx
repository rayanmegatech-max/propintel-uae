import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Database,
  Gauge,
  MapPin,
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

type BuildingIntelligencePageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type BuildingCard = {
  id: string;
  rank: number | null;
  location: string;
  buildingName: string;
  community: string | null;
  city: string | null;
  category: string | null;
  activeListings: number | null;
  agencies: number | null;
  agents: number | null;
  avgPrice: number | null;
  avgPricePerSqft: number | null;
  topAgency: string | null;
  topAgencyShare: number | null;
  topGroupShare: number | null;
  concentration: string | null;
  dominanceScore: number | null;
  pressureScore: number | null;
  pressureLabel: string | null;
  priceDropRate: number | null;
  refreshRate: number | null;
  ownerDirectRate: number | null;
  activityCount: number | null;
  intelligenceLabel: string | null;
  confidence: string | null;
  action: string | null;
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

function joinParts(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(" · ");
}

function normalizeBuildingCard(
  country: CountryConfig,
  record: Module5Record,
  index: number
): BuildingCard {
  const city = asString(record.city);
  const community = asString(record.community);
  const buildingName = asString(record.building_name) || "Unknown building";

  return {
    id:
      asString(record.market_key) ||
      asString(record.canonical_market_key) ||
      `${country.slug}-building-${index}`,
    rank: asNumber(record.dashboard_rank),
    location: joinParts([city, community, buildingName]) || "UAE building",
    buildingName,
    community,
    city,
    category: formatLabel(asString(record.source_category)),
    activeListings:
      asNumber(record.active_listings) ?? asNumber(record.total_listings),
    agencies:
      asNumber(record.agencies) ??
      asNumber(record.unique_agencies) ??
      asNumber(record.total_agencies),
    agents:
      asNumber(record.agents) ??
      asNumber(record.unique_agents) ??
      asNumber(record.total_agents),
    avgPrice: asNumber(record.avg_price),
    avgPricePerSqft: asNumber(record.avg_price_per_sqft),
    topAgency: asString(record.top_agency_name),
    topAgencyShare: asNumber(record.top_agency_share_pct),
    topGroupShare:
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
    activityCount: asNumber(record.activity_count),
    intelligenceLabel:
      asString(record.intelligence_label) ||
      formatLabel(asString(record.dashboard_card_type)) ||
      formatLabel(asString(record.dashboard_use_case)),
    confidence: formatLabel(asString(record.confidence_tier)),
    action:
      asString(record.recommended_action) ||
      asString(record.pressure_action) ||
      asString(record.recommended_use),
    note:
      asString(record.interpretation_note) ||
      asString(record.explanation) ||
      asString(record.product_note) ||
      asString(record.dashboard_use_case),
  };
}

function EmptyBuildingState({
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
          {country.label} Building Intelligence export not loaded
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-100/80">
          {message}
        </p>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-slate-950/50 p-4">
          <p className="text-sm font-semibold text-white">Run locally:</p>
          <code className="mt-2 block rounded-lg bg-black/30 p-3 text-xs text-slate-300">
            python tools\export_uae_module5_frontend_data.py
          </code>
        </div>
      </section>
    </div>
  );
}

function BuildingSignalCard({
  country,
  card,
}: {
  country: CountryConfig;
  card: BuildingCard;
}) {
  return (
    <article className="rounded-[1.45rem] border border-white/[0.08] bg-slate-950/45 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition hover:border-sky-300/25 hover:bg-white/[0.055]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-200">
          <Building2 className="h-3.5 w-3.5" />
          Building Intelligence
        </span>

        {card.category ? (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {card.category}
          </span>
        ) : null}

        {card.confidence ? (
          <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">
            {card.confidence}
          </span>
        ) : null}
      </div>

      <h3 className="text-base font-black tracking-tight text-white">
        {card.buildingName}
      </h3>

      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
        <MapPin className="h-3.5 w-3.5 text-sky-300" />
        {joinParts([card.city, card.community]) || "UAE"}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {card.intelligenceLabel ||
          "Dashboard-safe building-level intelligence from Module 5 exports."}
      </p>

      {card.note ? (
        <p className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs leading-5 text-slate-300">
          {card.note}
        </p>
      ) : null}

      {card.action ? (
        <p className="mt-3 rounded-2xl border border-sky-400/15 bg-sky-400/[0.07] px-3 py-2 text-xs leading-5 text-sky-100/85">
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

        {card.agents !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Agents</span>
            <span className="font-black text-white">
              {formatNumber(card.agents)}
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

        {card.avgPricePerSqft !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Avg / sqft</span>
            <span className="font-black text-white">
              {formatCurrency(card.avgPricePerSqft, country.currency)}
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
            <Users className="h-3.5 w-3.5 text-violet-300" />
            {card.topAgency}
          </span>
        ) : null}

        {card.concentration ? (
          <span className="rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-3 py-1 text-violet-100">
            {card.concentration}
          </span>
        ) : null}

        {card.pressureLabel ? (
          <span className="rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-3 py-1 text-amber-100">
            {card.pressureLabel}
          </span>
        ) : null}

        {card.priceDropRate !== null ? (
          <span className="rounded-full border border-red-400/15 bg-red-400/[0.06] px-3 py-1 text-red-100">
            Price-drop rate: {formatPercent(card.priceDropRate)}
          </span>
        ) : null}

        {card.refreshRate !== null ? (
          <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1 text-cyan-100">
            Refresh rate: {formatPercent(card.refreshRate)}
          </span>
        ) : null}

        {card.ownerDirectRate !== null ? (
          <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1 text-emerald-100">
            Owner/direct rate: {formatPercent(card.ownerDirectRate)}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function BuildingLane({
  country,
  payload,
  cards,
}: {
  country: CountryConfig;
  payload: Module5ListPayload;
  cards: BuildingCard[];
}) {
  return (
    <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-200">
            <Sparkles className="h-3.5 w-3.5" />
            {payload.source_table}
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            UAE building intelligence sample
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Building-level Module 5 intelligence using active listing volume,
            agency presence, visible listing-share concentration, pressure
            signals, and opportunity density.
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
          <BuildingSignalCard key={card.id} country={country} card={card} />
        ))}
      </div>
    </section>
  );
}

export default function BuildingIntelligencePage({
  country,
  data,
}: BuildingIntelligencePageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyBuildingState country={country} message={data.message} />;
  }

  const payload = data.buildingIntelligence;

  if (!payload || payload.status !== "ready" || payload.items.length === 0) {
    return (
      <EmptyBuildingState
        country={country}
        message={`${country.label} Building Intelligence export loaded, but no usable building records were available in the local frontend sample.`}
      />
    );
  }

  const cards = payload.items
    .slice(0, 24)
    .map((record, index) => normalizeBuildingCard(country, record, index));

  const totalListings = cards.reduce(
    (sum, card) => sum + (card.activeListings ?? 0),
    0
  );

  const withPressure = cards.filter(
    (card) => card.pressureScore !== null
  ).length;

  const withDominance = cards.filter(
    (card) => card.dominanceScore !== null || card.concentration !== null
  ).length;

  const withTopAgency = cards.filter((card) => card.topAgency).length;

  const metrics: ReconMetric[] = [
    {
      label: "Building rows",
      value: formatNumber(payload.total_rows_available),
      description: `Rows available in ${payload.source_table}.`,
      tone: "cyan",
    },
    {
      label: "Exported sample",
      value: formatNumber(payload.exported_rows),
      description: "Rows loaded into this local frontend preview.",
      tone: "teal",
    },
    {
      label: "Sample listings",
      value: formatNumber(totalListings),
      description: "Active listings represented across the visible building sample.",
      tone: "amber",
    },
    {
      label: "Agency signals",
      value: formatNumber(withTopAgency),
      description: "Visible records with top-agency presence.",
      tone: "slate",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.13),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-sky-200">
                <Building2 className="h-3.5 w-3.5" />
                UAE Building Intelligence
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Module 5 real data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Building Intelligence
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A dashboard-safe UAE building intelligence page using Module 5
              building-level exports. It surfaces public listing activity,
              visible agency presence, inventory pressure, dominance, and
              opportunity signals at supported building level.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/communities`}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(14,165,233,0.18)] transition hover:bg-sky-400"
              >
                Open Community Intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`${country.routeBase}/market-intelligence`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Open Market Intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.7rem] border border-sky-400/20 bg-sky-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-sky-50">
                  Safe building intelligence
                </h2>
                <p className="mt-2 text-sm leading-6 text-sky-100/75">
                  This page uses dashboard-ready Module 5 building exports only.
                  It does not expose raw engine tables, raw evidence, or unsafe
                  market-control claims.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Source table: ${payload.source_table}`,
                `Exported rows: ${payload.exported_rows.toLocaleString("en-US")}`,
                `Total rows: ${payload.total_rows_available.toLocaleString("en-US")}`,
                `Rows with pressure: ${withPressure.toLocaleString("en-US")}`,
                `Rows with dominance: ${withDominance.toLocaleString("en-US")}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-sky-50/90"
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
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Building-level context
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            UAE building intelligence is useful where the backend has enough
            public listing coverage to summarize agency presence and pressure.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <Gauge className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Pressure and opportunity
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Building records can expose pressure, refresh behavior, price-drop
            rates, owner/direct rates, and opportunity density.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Dashboard-safe source
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Current page reads {payload.source_table}. Raw Module 5 engine tables
            remain internal.
          </p>
        </div>
      </section>

      <BuildingLane country={country} payload={payload} cards={cards} />
    </div>
  );
}