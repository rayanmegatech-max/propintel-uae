import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Database,
  PieChart,
  ShieldCheck,
  Sparkles,
  Target,
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

type MarketDominancePageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type DominanceCard = {
  id: string;
  rank: number | null;
  location: string;
  marketType: string;
  category: string | null;
  listings: number | null;
  agencies: number | null;
  agents: number | null;
  avgPrice: number | null;
  dominanceScore: number | null;
  concentration: string | null;
  topAgency: string | null;
  topAgencyListings: number | null;
  topAgencyShare: number | null;
  secondAgency: string | null;
  secondAgencyShare: number | null;
  thirdAgency: string | null;
  thirdAgencyShare: number | null;
  top3Share: number | null;
  top5Share: number | null;
  hhiAgency: number | null;
  pressureScore: number | null;
  pressureLabel: string | null;
  confidence: string | null;
  summary: string | null;
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

function normalizeDominanceCard(
  country: CountryConfig,
  record: Module5Record,
  index: number
): DominanceCard {
  return {
    id:
      asString(record.market_key) ||
      asString(record.canonical_market_key) ||
      `${country.slug}-dominance-${index}`,
    rank: asNumber(record.dashboard_rank),
    location: getLocation(country, record),
    marketType:
      formatLabel(asString(record.dashboard_level)) ||
      formatLabel(asString(record.market_level)) ||
      "Market",
    category: formatLabel(asString(record.source_category)),
    listings:
      asNumber(record.total_listings) ?? asNumber(record.active_listings),
    agencies:
      asNumber(record.total_agencies) ??
      asNumber(record.unique_agencies) ??
      asNumber(record.agencies),
    agents:
      asNumber(record.total_agents) ??
      asNumber(record.unique_agents) ??
      asNumber(record.agents),
    avgPrice: asNumber(record.avg_price),
    dominanceScore: asNumber(record.dominance_score),
    concentration:
      formatLabel(asString(record.concentration_label)) ||
      formatLabel(asString(record.concentration_bucket)),
    topAgency: asString(record.top_agency_name),
    topAgencyListings: asNumber(record.top_agency_listings),
    topAgencyShare: asNumber(record.top_agency_share_pct),
    secondAgency: asString(record.second_agency_name),
    secondAgencyShare: asNumber(record.second_agency_share_pct),
    thirdAgency: asString(record.third_agency_name),
    thirdAgencyShare: asNumber(record.third_agency_share_pct),
    top3Share: asNumber(record.top3_agency_share_pct),
    top5Share: asNumber(record.top_5_agency_share_pct),
    hhiAgency: asNumber(record.hhi_agency),
    pressureScore:
      asNumber(record.inventory_pressure_score) ?? asNumber(record.pressure_score),
    pressureLabel: formatLabel(asString(record.pressure_bucket)),
    confidence: formatLabel(asString(record.confidence_tier)),
    summary: asString(record.top_agencies_summary),
    explanation:
      asString(record.explanation) ||
      asString(record.interpretation_note) ||
      asString(record.product_note),
    action:
      asString(record.recommended_use) ||
      asString(record.pressure_action) ||
      asString(record.recommended_action),
  };
}

function EmptyDominanceState({
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
          {country.label} Market Dominance export not loaded
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

function DominanceSignalCard({
  country,
  card,
}: {
  country: CountryConfig;
  card: DominanceCard;
}) {
  const topShare =
    card.topAgencyShare ?? card.top3Share ?? card.top5Share ?? null;

  return (
    <article className="rounded-[1.45rem] border border-white/[0.08] bg-slate-950/45 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition hover:border-violet-300/25 hover:bg-white/[0.055]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-violet-200">
          <PieChart className="h-3.5 w-3.5" />
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
        {card.explanation ||
          "Visible public listing-share concentration from dashboard-safe Module 5 exports."}
      </p>

      {card.action ? (
        <p className="mt-3 rounded-2xl border border-violet-400/15 bg-violet-400/[0.07] px-3 py-2 text-xs leading-5 text-violet-100/85">
          {card.action}
        </p>
      ) : null}

      <div className="mt-4 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
        {card.dominanceScore !== null ? (
          <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.06] p-2">
            <span className="block text-violet-100/70">Dominance score</span>
            <span className="font-black text-violet-100">
              {formatNumber(card.dominanceScore)}
            </span>
          </div>
        ) : null}

        {topShare !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Top share metric</span>
            <span className="font-black text-white">
              {formatPercent(topShare)}
            </span>
          </div>
        ) : null}

        {card.listings !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Listings</span>
            <span className="font-black text-white">
              {formatNumber(card.listings)}
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

        {card.hhiAgency !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">HHI agency</span>
            <span className="font-black text-white">
              {formatNumber(card.hhiAgency)}
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

        {card.topAgencyListings !== null ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2">
            <span className="block text-slate-500">Top agency listings</span>
            <span className="font-black text-white">
              {formatNumber(card.topAgencyListings)}
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
      </div>

      {card.summary ? (
        <p className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs leading-5 text-slate-300">
          {card.summary}
        </p>
      ) : null}
    </article>
  );
}

function DominanceLane({
  country,
  payload,
  cards,
}: {
  country: CountryConfig;
  payload: Module5ListPayload;
  cards: DominanceCard[];
}) {
  return (
    <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            {payload.source_table}
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {country.label} visible listing-share sample
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Showing dashboard-safe dominance records from Module 5. These are
            visible public listing-share signals, not claims of market control.
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
          <DominanceSignalCard key={card.id} country={country} card={card} />
        ))}
      </div>
    </section>
  );
}

export default function MarketDominancePage({
  country,
  data,
}: MarketDominancePageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyDominanceState country={country} message={data.message} />;
  }

  const payload =
    country.slug === "uae" ? data.marketDominance : data.marketDominanceLarge;

  if (!payload || payload.status !== "ready" || payload.items.length === 0) {
    return (
      <EmptyDominanceState
        country={country}
        message={`${country.label} Market Dominance export loaded, but no usable dominance records were available in the local frontend sample.`}
      />
    );
  }

  const cards = payload.items.map((record, index) =>
    normalizeDominanceCard(country, record, index)
  );

  const visibleCards = cards.slice(0, 24);

  const averageDominanceValues = cards
    .map((card) => card.dominanceScore)
    .filter((value): value is number => value !== null);

  const averageDominance =
    averageDominanceValues.length > 0
      ? averageDominanceValues.reduce((sum, value) => sum + value, 0) /
        averageDominanceValues.length
      : null;

  const dominatedCount = cards.filter((card) =>
    `${card.concentration ?? ""}`.toLowerCase().includes("dominated")
  ).length;

  const competitiveCount = cards.filter((card) =>
    `${card.concentration ?? ""}`.toLowerCase().includes("competitive")
  ).length;

  const withTopAgencyCount = cards.filter((card) => card.topAgency).length;

  const metrics: ReconMetric[] = [
    {
      label: "Dominance rows",
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
      label: "Avg dominance score",
      value: averageDominance === null ? "—" : formatNumber(averageDominance),
      description: "Average visible listing-share concentration score.",
      tone: "amber",
    },
    {
      label: "With top agency",
      value: formatNumber(withTopAgencyCount),
      description: "Sample rows that expose a top visible agency.",
      tone: "slate",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-violet-200">
                <PieChart className="h-3.5 w-3.5" />
                {country.label} Market Dominance
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Module 5 real data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Visible Listing-Share Radar
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A dashboard-safe Module 5 dominance view for public listing-share
              concentration, visible agency presence, competitive markets, and
              territory intelligence. This page avoids unsafe language such as
              market control, spying, or manipulation.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/market-intelligence`}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(168,85,247,0.18)] transition hover:bg-violet-400"
              >
                Open Market Intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`${country.routeBase}/inventory-pressure`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Open Pressure Radar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.7rem] border border-violet-400/20 bg-violet-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-violet-50">
                  Safe dominance wording
                </h2>
                <p className="mt-2 text-sm leading-6 text-violet-100/75">
                  This page describes visible public listing share and agency
                  presence. It does not claim market control, agency quality,
                  wrongdoing, manipulation, or private market share.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Source table: ${payload.source_table}`,
                `Exported rows: ${payload.exported_rows.toLocaleString("en-US")}`,
                `Total rows: ${payload.total_rows_available.toLocaleString("en-US")}`,
                `Rows with top agency: ${withTopAgencyCount.toLocaleString("en-US")}`,
                `Dominated labels: ${dominatedCount.toLocaleString("en-US")}`,
                `Competitive labels: ${competitiveCount.toLocaleString("en-US")}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-violet-50/90"
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
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Territory intelligence
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Use listing-share concentration to understand which markets may be
            fragmented, competitive, or dominated by visible public inventory.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Agency presence
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Top-agency metrics describe visible public listing presence, not
            official market share or agency quality.
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
            remain internal and are not exposed to users.
          </p>
        </div>
      </section>

      <DominanceLane country={country} payload={payload} cards={visibleCards} />
    </div>
  );
}