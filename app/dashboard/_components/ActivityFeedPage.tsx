import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  Database,
  ExternalLink,
  Gauge,
  MapPin,
  RadioTower,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type {
  Module5ActivityRecord,
  Module5DataResult,
} from "@/lib/data/module5";
import type { ReconMetric } from "@/lib/recon/types";

type ActivityFeedPageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type NormalizedActivityCard = {
  id: string;
  rank: number | null;
  title: string;
  summary: string;
  action: string | null;
  bucket: string;
  type: string;
  subtype: string | null;
  location: string;
  agency: string | null;
  agent: string | null;
  portal: string | null;
  category: string | null;
  propertyType: string | null;
  price: number | null;
  oldPrice: number | null;
  newPrice: number | null;
  priceChangeAmount: number | null;
  priceChangePct: number | null;
  score: number | null;
  confidence: string | null;
  pressure: string | null;
  dominanceSharePct: number | null;
  url: string | null;
  date: string | null;
  sourceTable: string | null;
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

function getRecordLocation(
  country: CountryConfig,
  record: Module5ActivityRecord
): string {
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

function getRecordTitle(
  country: CountryConfig,
  record: Module5ActivityRecord
): string {
  if (country.slug === "ksa") {
    return (
      asString(record.card_title) ||
      formatLabel(asString(record.card_type)) ||
      "KSA market activity signal"
    );
  }

  return (
    asString(record.activity_label) ||
    formatLabel(asString(record.activity_type)) ||
    "UAE market activity signal"
  );
}

function getRecordSummary(
  country: CountryConfig,
  record: Module5ActivityRecord
): string {
  if (country.slug === "ksa") {
    return (
      asString(record.card_summary) ||
      asString(record.product_note) ||
      "A dashboard-safe KSA public-listing activity signal from Module 5."
    );
  }

  return (
    asString(record.activity_summary) ||
    asString(record.product_note) ||
    "A dashboard-safe UAE public-listing activity signal from Module 5."
  );
}

function normalizeActivityRecord(
  country: CountryConfig,
  record: Module5ActivityRecord,
  index: number
): NormalizedActivityCard {
  const title = getRecordTitle(country, record);
  const type =
    formatLabel(asString(record.activity_type)) ||
    formatLabel(asString(record.card_type)) ||
    "Activity Signal";

  const bucket =
    formatLabel(asString(record.activity_bucket)) ||
    asString(record.activity_priority_label) ||
    "Market Signal";

  const price =
    asNumber(record.price) ??
    asNumber(record.price_amount) ??
    asNumber(record.new_price);

  const priceChangeAmount =
    asNumber(record.drop_amount) ?? asNumber(record.price_change_amount);

  const priceChangePct =
    asNumber(record.drop_pct) ?? asNumber(record.price_change_pct);

  const url = asString(record.property_url) ?? asString(record.source_url);

  const rank =
    asNumber(record.dashboard_rank) ??
    asNumber(record.category_rank) ??
    asNumber(record.activity_rank);

  return {
    id:
      asString(record.listing_key) ||
      asString(record.normalized_id) ||
      asString(record.canonical_id) ||
      `${country.slug}-activity-${index}`,
    rank,
    title,
    summary: getRecordSummary(country, record),
    action: asString(record.recommended_action),
    bucket,
    type,
    subtype:
      formatLabel(asString(record.card_subtype)) ||
      formatLabel(asString(record.activity_priority_label)),
    location: getRecordLocation(country, record),
    agency:
      asString(record.agency_display_name) ||
      asString(record.agency_name) ||
      asString(record.agency_public_key),
    agent: asString(record.agent_name),
    portal: asString(record.portal) || asString(record.source_portal),
    category: formatLabel(asString(record.source_category)),
    propertyType:
      formatLabel(asString(record.property_type_norm)) ||
      formatLabel(asString(record.property_type)),
    price,
    oldPrice: asNumber(record.old_price),
    newPrice: asNumber(record.new_price),
    priceChangeAmount,
    priceChangePct,
    score:
      asNumber(record.activity_score) ??
      asNumber(record.recon_score) ??
      asNumber(record.pressure_score),
    confidence: formatLabel(asString(record.confidence_tier)),
    pressure: formatLabel(asString(record.pressure_bucket)),
    dominanceSharePct: asNumber(record.dominance_share_pct),
    url,
    date:
      asString(record.activity_date) ||
      asString(record.activity_at) ||
      asString(record.evidence_date) ||
      asString(record.generated_at) ||
      asString(record.built_at),
    sourceTable: asString(record.source_table),
  };
}

function EmptyActivityState({
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
          {country.label} Module 5 Activity Feed export not loaded
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

function ActivityCard({
  country,
  card,
}: {
  country: CountryConfig;
  card: NormalizedActivityCard;
}) {
  const hasPriceMovement =
    card.priceChangeAmount !== null ||
    card.priceChangePct !== null ||
    card.oldPrice !== null ||
    card.newPrice !== null;

  return (
    <article className="group rounded-[1.45rem] border border-white/[0.08] bg-slate-950/45 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition hover:border-cyan-300/25 hover:bg-white/[0.055]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">
              <RadioTower className="h-3.5 w-3.5" />
              {card.bucket}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {card.type}
            </span>

            {card.subtype ? (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {card.subtype}
              </span>
            ) : null}
          </div>

          <h2 className="text-base font-black tracking-tight text-white sm:text-lg">
            {card.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {card.summary}
          </p>

          {card.action ? (
            <p className="mt-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-2 text-xs leading-5 text-emerald-100/85">
              {card.action}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
              <MapPin className="h-3.5 w-3.5 text-cyan-300" />
              {card.location}
            </span>

            {card.agency ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
                <Building2 className="h-3.5 w-3.5 text-violet-300" />
                {card.agency}
              </span>
            ) : null}

            {card.portal ? (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
                {card.portal}
              </span>
            ) : null}

            {card.category ? (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
                {card.category}
              </span>
            ) : null}

            {card.propertyType ? (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1">
                {card.propertyType}
              </span>
            ) : null}
          </div>
        </div>

        <aside className="grid gap-2 rounded-2xl border border-white/[0.08] bg-black/20 p-3 text-xs text-slate-400 xl:w-64">
          {card.rank !== null ? (
            <div className="flex items-center justify-between gap-3">
              <span>Dashboard rank</span>
              <span className="font-black text-white">
                {formatNumber(card.rank)}
              </span>
            </div>
          ) : null}

          {card.score !== null ? (
            <div className="flex items-center justify-between gap-3">
              <span>Signal score</span>
              <span className="font-black text-cyan-200">
                {formatNumber(card.score)}
              </span>
            </div>
          ) : null}

          {card.price !== null ? (
            <div className="flex items-center justify-between gap-3">
              <span>Advertised price</span>
              <span className="font-black text-white">
                {formatCurrency(card.price, country.currency)}
              </span>
            </div>
          ) : null}

          {hasPriceMovement ? (
            <div className="rounded-xl border border-red-400/15 bg-red-400/[0.06] p-2">
              <div className="mb-1 font-bold text-red-100">
                Price movement context
              </div>

              <div className="space-y-1">
                {card.oldPrice !== null ? (
                  <div className="flex items-center justify-between gap-3">
                    <span>Old</span>
                    <span>{formatCurrency(card.oldPrice, country.currency)}</span>
                  </div>
                ) : null}

                {card.newPrice !== null ? (
                  <div className="flex items-center justify-between gap-3">
                    <span>New</span>
                    <span>{formatCurrency(card.newPrice, country.currency)}</span>
                  </div>
                ) : null}

                {card.priceChangeAmount !== null ? (
                  <div className="flex items-center justify-between gap-3">
                    <span>Change</span>
                    <span>
                      {formatCurrency(card.priceChangeAmount, country.currency)}
                    </span>
                  </div>
                ) : null}

                {card.priceChangePct !== null ? (
                  <div className="flex items-center justify-between gap-3">
                    <span>Change %</span>
                    <span>{formatPercent(card.priceChangePct)}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {card.pressure ? (
            <div className="flex items-center justify-between gap-3">
              <span>Pressure</span>
              <span className="font-bold text-amber-200">{card.pressure}</span>
            </div>
          ) : null}

          {card.dominanceSharePct !== null ? (
            <div className="flex items-center justify-between gap-3">
              <span>Visible share</span>
              <span className="font-bold text-violet-200">
                {formatPercent(card.dominanceSharePct)}
              </span>
            </div>
          ) : null}

          {card.confidence ? (
            <div className="flex items-center justify-between gap-3">
              <span>Confidence</span>
              <span className="font-bold text-slate-200">{card.confidence}</span>
            </div>
          ) : null}

          {card.date ? (
            <div className="flex items-center justify-between gap-3">
              <span>Date</span>
              <span className="text-right font-bold text-slate-200">
                {card.date}
              </span>
            </div>
          ) : null}

          {card.url ? (
            <a
              href={card.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-400/15"
            >
              Open source
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <div className="mt-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Market-level signal
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

export default function ActivityFeedPage({
  country,
  data,
}: ActivityFeedPageProps) {
  if (data.status !== "ready" || !data.manifest || !data.activityFeed) {
    return <EmptyActivityState country={country} message={data.message} />;
  }

  if (data.activityFeed.status !== "ready" || data.activityFeed.items.length === 0) {
    return (
      <EmptyActivityState
        country={country}
        message={`${country.label} Module 5 Activity Feed export loaded, but no usable activity records were available in the local frontend sample.`}
      />
    );
  }

  const cards = data.activityFeed.items.map((record, index) =>
    normalizeActivityRecord(country, record, index)
  );

  const visibleCards = cards.slice(0, 36);

  const bucketCounts = cards.reduce<Record<string, number>>((acc, card) => {
    acc[card.bucket] = (acc[card.bucket] ?? 0) + 1;
    return acc;
  }, {});

  const withUrlCount = cards.filter((card) => card.url).length;
  const marketLevelCount = cards.length - withUrlCount;
  const withPriceMovementCount = cards.filter(
    (card) =>
      card.priceChangeAmount !== null ||
      card.priceChangePct !== null ||
      card.oldPrice !== null ||
      card.newPrice !== null
  ).length;

  const averageScoreValues = cards
    .map((card) => card.score)
    .filter((value): value is number => value !== null);

  const averageScore =
    averageScoreValues.length > 0
      ? averageScoreValues.reduce((sum, value) => sum + value, 0) /
        averageScoreValues.length
      : null;

  const metrics: ReconMetric[] = [
    {
      label: "Activity rows",
      value: formatNumber(data.activityFeed.total_rows_available),
      description: `Rows available in ${data.activityFeed.source_table}.`,
      tone: "cyan",
    },
    {
      label: "Exported sample",
      value: formatNumber(data.activityFeed.exported_rows),
      description: "Rows loaded into this local frontend preview.",
      tone: "teal",
    },
    {
      label: "Market-level signals",
      value: formatNumber(marketLevelCount),
      description: "Sample rows that are market, pressure, dominance, or agency signals.",
      tone: "amber",
    },
    {
      label: "Avg signal score",
      value: averageScore === null ? "—" : formatNumber(averageScore),
      description: "Average score across records that expose an activity score.",
      tone: "teal",
    },
  ];

  const topBuckets = Object.entries(bucketCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.13),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                <Activity className="h-3.5 w-3.5" />
                {country.label} Activity Feed
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Module 5 real data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Market Activity Feed
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A dashboard-safe daily market activity feed built from Module 5
              public-listing intelligence. This page surfaces recon activity,
              price movement context, recently detected activity, pressure
              signals, dominance signals, and agency portfolio signals without
              exposing raw internal evidence tables.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/market-intelligence`}
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(34,211,238,0.16)] transition hover:bg-cyan-400"
              >
                Open Market Intelligence
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

          <aside className="rounded-[1.7rem] border border-cyan-400/20 bg-cyan-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-cyan-50">
                  Product-safe activity
                </h2>
                <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                  This page uses Module 5 dashboard exports only. It avoids raw
                  price-history evidence, raw engine tables, seller-intent claims,
                  and unsafe competitive wording.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Source table: ${data.activityFeed.source_table}`,
                `Exported rows: ${data.activityFeed.exported_rows.toLocaleString("en-US")}`,
                `Total rows: ${data.activityFeed.total_rows_available.toLocaleString("en-US")}`,
                `Rows with source link: ${withUrlCount.toLocaleString("en-US")}`,
                `Rows with price movement: ${withPriceMovementCount.toLocaleString("en-US")}`,
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

      <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              Activity mix
            </div>

            <h2 className="text-xl font-black tracking-tight text-white">
              Signal buckets in this export
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              This shows the current composition of the local Module 5 activity
              sample. Later we can add bucket tabs and country-specific filters.
            </p>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            {cards.length.toLocaleString("en-US")} sample rows
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {topBuckets.map(([bucket, count]) => (
            <div
              key={bucket}
              className="rounded-2xl border border-white/[0.08] bg-slate-950/35 p-4"
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Gauge className="h-4 w-4" />
              </div>
              <div className="text-sm font-black text-white">{bucket}</div>
              <div className="mt-1 text-2xl font-black tracking-tight text-cyan-100">
                {formatNumber(count)}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                records in exported sample
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
              <BadgeCheck className="h-3.5 w-3.5" />
              Dashboard-safe feed
            </div>

            <h2 className="text-xl font-black tracking-tight text-white">
              {country.label} activity signal sample
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Showing the first 36 normalized activity cards from the local
              Module 5 export. Some rows are listing-level actions; others are
              market, agency, pressure, or dominance signals.
            </p>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            No raw evidence tables
          </span>
        </div>

        <div className="space-y-3">
          {visibleCards.map((card) => (
            <ActivityCard key={card.id} country={country} card={card} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <RadioTower className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Public activity signal
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Activity cards reflect public-listing market movement, not private
            intent, guaranteed demand, or seller distress.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Frontend-safe source
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Current page reads {data.activityFeed.source_table}. Raw price events
            and raw Module 5 engine tables remain internal.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Activity className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Module 5 foundation
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This Activity Feed pattern can be reused for Market Intelligence,
            Inventory Pressure, Market Dominance, and Agency Profiles after this
            page validates cleanly.
          </p>
        </div>
      </section>
    </div>
  );
}
