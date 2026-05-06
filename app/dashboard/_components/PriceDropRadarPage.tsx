import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Database,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import ReconOpportunityCard from "./ReconOpportunityCard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { KsaReconDataResult } from "@/lib/data/ksaRecon";
import type { UaeReconDataResult } from "@/lib/data/uaeRecon";
import type { ReconMetric } from "@/lib/recon/types";

type PriceDropRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

function EmptyPriceDropState({
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
          {country.label} Price Drop export not loaded
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

function getPriceDropTableName(country: CountryConfig): string {
  if (country.slug === "ksa") {
    return (
      country.tables.reconPriceDrops ||
      country.tables.priceDrops ||
      "ksa_recon_dashboard_price_drops"
    );
  }

  return (
    country.tables.reconPriceDrops ||
    country.tables.priceDrops ||
    "recon_dashboard_price_drops"
  );
}

export default function PriceDropRadarPage({
  country,
  data,
}: PriceDropRadarPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyPriceDropState country={country} message={data.message} />;
  }

  const priceDropPayload = data.lists.priceDrops;

  if (!priceDropPayload || priceDropPayload.items.length === 0) {
    return (
      <EmptyPriceDropState
        country={country}
        message={`${country.label} Price Drop export loaded, but no price-drop records were available in the local frontend sample.`}
      />
    );
  }

  const normalizedItems = normalizeReconList(
    priceDropPayload.items,
    country.slug,
    priceDropPayload.source_table
  );

  const visibleItems = normalizedItems.slice(0, 30);

  const totalRows = priceDropPayload.total_rows_available;
  const exportedRows = priceDropPayload.exported_rows;
  const tableName = getPriceDropTableName(country);

  const withDropAmountCount = normalizedItems.filter(
    (item) => item.dropAmount !== null
  ).length;

  const withDropPctCount = normalizedItems.filter(
    (item) => item.dropPct !== null
  ).length;

  const totalDropAmount = normalizedItems.reduce((sum, item) => {
    return sum + (item.dropAmount ?? 0);
  }, 0);

  const averageDropPctValues = normalizedItems
    .map((item) => item.dropPct)
    .filter((value): value is number => value !== null);

  const averageDropPct =
    averageDropPctValues.length > 0
      ? averageDropPctValues.reduce((sum, value) => sum + value, 0) /
        averageDropPctValues.length
      : null;

  const metrics: ReconMetric[] = [
    {
      label: "Price-drop rows",
      value: formatNumber(totalRows),
      description: `Rows available in ${tableName}.`,
      tone: "red",
    },
    {
      label: "Exported sample",
      value: formatNumber(exportedRows),
      description: "Rows loaded into this local frontend preview.",
      tone: "cyan",
    },
    {
      label: "With drop amount",
      value: formatNumber(withDropAmountCount),
      description: "Sample rows with a detected price-drop amount.",
      tone: "amber",
    },
    {
      label: "Avg drop %",
      value: averageDropPct === null ? "—" : formatPercent(averageDropPct),
      description: "Average drop percentage inside the exported sample.",
      tone: "teal",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-red-200">
                <TrendingDown className="h-3.5 w-3.5" />
                {country.label} Price Drop Radar
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Real exported data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Price Drop Radar
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A product-safe repricing intelligence view for recently reduced
              public listings. This page focuses on price movement opportunities
              from cleaned dashboard exports, not raw price-history evidence.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/recon`}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(248,113,113,0.20)] transition hover:bg-red-400"
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

          <aside className="rounded-[1.7rem] border border-red-400/20 bg-red-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-red-50">
                  Cleaned product view
                </h2>
                <p className="mt-2 text-sm leading-6 text-red-100/75">
                  This page avoids raw price-history event tables. It shows
                  cleaned price movement opportunities using dashboard-ready
                  product exports and safe repricing language.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Source table: ${priceDropPayload.source_table}`,
                `Exported rows: ${exportedRows.toLocaleString("en-US")}`,
                `Total rows: ${totalRows.toLocaleString("en-US")}`,
                `Sample rows with drop %: ${withDropPctCount.toLocaleString("en-US")}`,
                `Sample total drop: ${formatCurrency(totalDropAmount, country.currency)}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-red-50/90"
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-200">
              <Sparkles className="h-3.5 w-3.5" />
              Top repricing opportunities
            </div>

            <h2 className="text-xl font-black tracking-tight text-white">
              {country.label} price-drop opportunity sample
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Showing the first 30 normalized cards from the exported price-drop
              sample. Dedicated price filters and sort controls can be added after
              this standalone module pattern is validated.
            </p>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Product-safe records only
          </span>
        </div>

        <div className="space-y-3">
          {visibleItems.map((opportunity) => (
            <ReconOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
            <TrendingDown className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Repricing signal
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Price-drop records should be treated as advertised price movement
            signals, not guaranteed seller distress or guaranteed negotiability.
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
            Current standalone page reads the existing price-drop Recon export.
            Future version can get dedicated price-sort controls and direct
            price-history summary fields if needed.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Second standalone module
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Price Drop Radar becomes the second non-Recon page converted from a
            placeholder shell into a real exported-data product page.
          </p>
        </div>
      </section>
    </div>
  );
}
