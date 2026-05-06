import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  Database,
  Gauge,
  ShieldCheck,
  Sparkles,
  TrendingUp,
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

type InventoryPressurePageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type PressureCard = {
  id: string;
  rank: number | null;
  location: string;
  marketType: string;
  category: string | null;
  activeListings: number | null;
  agencies: number | null;
  agents: number | null;
  avgPrice: number | null;
  pressureScore: number | null;
  pressureLabel: string | null;
  pressureReason: string | null;
  priceDropRate: number | null;
  refreshRate: number | null;
  ownerDirectRate: number | null;
  staleRate: number | null;
  oldInventoryRate: number | null;
  topAgency: string | null;
  topAgencyShare: number | null;
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

function getLocation(country: CountryConfig, record: Module5Record): string {
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

function normalizePressureCard(
  country: CountryConfig,
  record: Module5Record,
  index: number
): PressureCard {
  return {
    id:
      asString(record.market_key) ||
      asString(record.canonical_market_key) ||
      `${country.slug}-pressure-${index}`,
    rank: asNumber(record.dashboard_rank),
    location: getLocation(country, record),
    marketType:
      formatLabel(asString(record.dashboard_level)) ||
      formatLabel(asString(record.market_level)) ||
      "Market",
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
    pressureScore:
      asNumber(record.inventory_pressure_score) ?? asNumber(record.pressure_score),
    pressureLabel:
      formatLabel(asString(record.pressure_label)) ||
      formatLabel(asString(record.pressure_bucket)),
    pressureReason: formatLabel(asString(record.pressure_reason)),
    priceDropRate: asNumber(record.price_drop_rate_pct),
    refreshRate:
      asNumber(record.refresh_inflated_rate_pct) ??
      asNumber(record.refresh_rate_pct),
    ownerDirectRate: asNumber(record.owner_direct_rate_pct),
    staleRate: asNumber(record.stale_rate_pct),
    oldInventoryRate: asNumber(record.old_inventory_rate_pct),
    topAgency: asString(record.top_agency_name),
    topAgencyShare:
      asNumber(record.top_agency_share_pct) ??
      asNumber(record.top3_agency_share_pct) ??
      asNumber(record.top_5_agency_share_pct),
    confidence: formatLabel(asString(record.confidence_tier)),
    action:
      asString(record.recommended_action) ||
      asString(record.pressure_action) ||
      asString(record.recommended_use),
    note:
      asString(record.interpretation_note) ||
      asString(record.explanation) ||
      asString(record.product_note),
  };
}

function EmptyPressureState({
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
          {country.label} Inventory Pressure export not loaded
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

function PressureSignalCard({
  country,
  card,
}: {
  country: CountryConfig;
  card: PressureCard;
}) {
  return (
    <article className="rounded-[1.45rem] border border-white/[0.08] bg-slate-950/45 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition hover:border-amber-300/25 hover:bg-white/[0.055]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
          <Gauge className="h-3.5 w-3.5" />
          {card.marketType}
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
        {card.location}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {card.pressureLabel
          ? `Pressure signal: ${card.pressureLabel}.`
          : "Inventory pressure signal from dashboard-safe Module 5 exports."}
      </p>

      {card.note ? (
        <p className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs leading-5 text-slate-300">
          {card.note}
        </p>
      ) : null}

      {card.action ? (
        <p className="mt-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.07] px-3 py-2 text-xs leading-5 text-amber-100/85">
          {card.action}
        </p>
      ) : null}

      <div className="mt-4 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
        {card.pressureScore !== null ? (
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-2">
            <span className="block text-amber-100/70">Pressure score</span>
            <span className="font-black text-amber-100">
              {formatNumber(card.pressureScore)}
            </span>
          </div>
        ) : null}

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
          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-2">
            <span className="block text-emerald-100/70">Owner/direct rate</span>
            <span className="font-black text-emerald-100">
              {formatPercent(card.ownerDirectRate)}
            </span>
          </div>
        ) : null}

        {card.oldInventoryRate !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Old inventory rate</span>
            <span className="font-black text-white">
              {formatPercent(card.oldInventoryRate)}
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

        {card.topAgencyShare !== null ? (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
            Top agency share: {formatPercent(card.topAgencyShare)}
          </span>
        ) : null}

        {card.pressureReason ? (
          <span className="rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-3 py-1 text-amber-100">
            {card.pressureReason}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function PressureLane({
  country,
  payload,
  cards,
}: {
  country: CountryConfig;
  payload: Module5ListPayload;
  cards: PressureCard[];
}) {
  return (
    <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            {payload.source_table}
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {country.label} pressure signal sample
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Showing dashboard-safe pressure records from Module 5. These are
            directional market signals, not claims of seller distress or private
            intent.
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
          <PressureSignalCard key={card.id} country={country} card={card} />
        ))}
      </div>
    </section>
  );
}

export default function InventoryPressurePage({
  country,
  data,
}: InventoryPressurePageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyPressureState country={country} message={data.message} />;
  }

  const payload =
    country.slug === "uae" ? data.inventoryPressure : data.inventoryPressureLarge;

  if (!payload || payload.status !== "ready" || payload.items.length === 0) {
    return (
      <EmptyPressureState
        country={country}
        message={`${country.label} Inventory Pressure export loaded, but no usable pressure records were available in the local frontend sample.`}
      />
    );
  }

  const cards = payload.items.map((record, index) =>
    normalizePressureCard(country, record, index)
  );

  const visibleCards = cards.slice(0, 24);

  const averagePressureValues = cards
    .map((card) => card.pressureScore)
    .filter((value): value is number => value !== null);

  const averagePressure =
    averagePressureValues.length > 0
      ? averagePressureValues.reduce((sum, value) => sum + value, 0) /
        averagePressureValues.length
      : null;

  const withPriceDropRate = cards.filter(
    (card) => card.priceDropRate !== null && card.priceDropRate > 0
  ).length;

  const withRefreshRate = cards.filter(
    (card) => card.refreshRate !== null && card.refreshRate > 0
  ).length;

  const withOwnerDirectRate = cards.filter(
    (card) => card.ownerDirectRate !== null && card.ownerDirectRate > 0
  ).length;

  const highPressureCount = cards.filter((card) => {
    const label = `${card.pressureLabel ?? ""} ${card.pressureReason ?? ""}`.toLowerCase();
    return (
      label.includes("high") ||
      label.includes("elevated") ||
      label.includes("critical")
    );
  }).length;

  const metrics: ReconMetric[] = [
    {
      label: "Pressure rows",
      value: formatNumber(payload.total_rows_available),
      description: `Rows available in ${payload.source_table}.`,
      tone: "amber",
    },
    {
      label: "Exported sample",
      value: formatNumber(payload.exported_rows),
      description: "Rows loaded into this local frontend preview.",
      tone: "cyan",
    },
    {
      label: "Avg pressure score",
      value: averagePressure === null ? "—" : formatNumber(averagePressure),
      description: "Average pressure score across records with a score.",
      tone: "teal",
    },
    {
      label: "Elevated signals",
      value: formatNumber(highPressureCount),
      description: "Sample rows with high/elevated/critical pressure wording.",
      tone: "red",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">
                <Gauge className="h-3.5 w-3.5" />
                {country.label} Inventory Pressure
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Module 5 real data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Inventory Pressure Radar
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A dashboard-safe Module 5 pressure view for markets where public
              listing behavior suggests elevated activity, refresh patterns,
              price-movement context, owner/direct density, or opportunity
              concentration. This page uses cautious market-signal language only.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/market-intelligence`}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(251,191,36,0.18)] transition hover:bg-amber-400"
              >
                Open Market Intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`${country.routeBase}/activity-feed`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Open Activity Feed
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
                  Safe pressure wording
                </h2>
                <p className="mt-2 text-sm leading-6 text-amber-100/75">
                  This page does not claim desperation, distress, fraud, or
                  private seller intent. It only presents directional pressure
                  signals from public listing activity.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Source table: ${payload.source_table}`,
                `Exported rows: ${payload.exported_rows.toLocaleString("en-US")}`,
                `Total rows: ${payload.total_rows_available.toLocaleString("en-US")}`,
                `Rows with price-drop rate: ${withPriceDropRate.toLocaleString("en-US")}`,
                `Rows with refresh rate: ${withRefreshRate.toLocaleString("en-US")}`,
                `Rows with owner/direct rate: ${withOwnerDirectRate.toLocaleString("en-US")}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-amber-50/90"
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
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Pressure is directional
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Pressure scores help prioritize markets for review. They do not prove
            seller motivation or guarantee negotiability.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Activity className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Public listing behavior
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Signals come from public listing patterns such as active inventory,
            refresh behavior, price movement, owner/direct rates, and Recon
            opportunity density.
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
            Current page reads {payload.source_table}. Raw price-history events
            and raw Module 5 engine tables remain internal.
          </p>
        </div>
      </section>

      <PressureLane country={country} payload={payload} cards={visibleCards} />
    </div>
  );
}