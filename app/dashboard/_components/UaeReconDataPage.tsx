import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Database,
  Filter,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import ReconOpportunityCard from "./ReconOpportunityCard";
import { formatNumber } from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { ReconMetric } from "@/lib/recon/types";
import type { UaeReconDataResult } from "@/lib/data/uaeRecon";

type UaeReconDataPageProps = {
  data: UaeReconDataResult;
};

function EmptyExportState({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6 backdrop-blur-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
          <Database className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-bold text-white">
          UAE Recon export not loaded
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-100/80">
          {message}
        </p>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-slate-950/50 p-4">
          <p className="text-sm font-semibold text-white">Run locally:</p>
          <code className="mt-2 block rounded-lg bg-black/30 p-3 text-xs text-slate-300">
            python tools\export_uae_recon_frontend_data.py
          </code>
        </div>
      </section>
    </div>
  );
}

export default function UaeReconDataPage({ data }: UaeReconDataPageProps) {
  if (data.status !== "ready" || !data.hotLeads || !data.manifest) {
    return <EmptyExportState message={data.message} />;
  }

  const normalizedItems = normalizeReconList(
    data.hotLeads.items,
    "uae",
    data.hotLeads.source_table
  );

  const visibleItems = normalizedItems.slice(0, 25);
  const allItems = data.hotLeads.items;

  const priceDropCount = allItems.filter((item) => item.is_price_drop).length;
  const ownerDirectCount = allItems.filter((item) => item.is_owner_direct).length;
  const refreshInflatedCount = allItems.filter(
    (item) => item.is_refresh_inflated
  ).length;

  const metrics: ReconMetric[] = [
    {
      label: "Total hot leads",
      value: formatNumber(data.hotLeads.total_rows_available),
      description: "Rows available in recon_dashboard_hot_leads.",
      tone: "emerald",
    },
    {
      label: "Exported sample",
      value: formatNumber(data.hotLeads.exported_rows),
      description: "Local JSON rows available for the first UI build.",
      tone: "teal",
    },
    {
      label: "Price-drop overlap",
      value: formatNumber(priceDropCount),
      description: "Rows in the local sample carrying a price-drop signal.",
      tone: "red",
    },
    {
      label: "Owner/direct overlap",
      value: formatNumber(ownerDirectCount),
      description: "Rows in the local sample carrying owner/direct signal.",
      tone: "cyan",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                UAE · Recon Hub · Shared card pattern
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                UAE Recon Hub
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400 sm:text-base">
                Daily public-listing opportunity command center powered by the
                product-safe <code>recon_dashboard_hot_leads</code> export. This
                page now uses the shared Recon normalizer and opportunity card
                pattern.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Currency: AED
                </span>
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Source: {data.hotLeads.source_table}
                </span>
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Exported: {data.manifest.exported_at}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <div>
                  <h2 className="text-sm font-semibold text-emerald-100">
                    Product-safe data
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                    This page reads exported dashboard JSON only. It does not expose
                    raw price-history events, raw evidence tables, or local SQLite
                    directly to the browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <ReconMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
              <Filter className="h-3.5 w-3.5" />
              Filters are visual-only in Phase 5E.4.2
            </div>

            <h2 className="text-lg font-semibold text-white">
              Top exported opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Showing the first 25 opportunities from the top 500 local JSON export,
              normalized into a shared Recon card model.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "City",
              "Community",
              "Portal",
              "Category",
              "Priority",
              "Confidence",
            ].map((filter) => (
              <span
                key={filter}
                className="rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-400"
              >
                {filter}
              </span>
            ))}
          </div>
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
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Export manifest</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Limit: {data.manifest.limit}. Hot leads total:{" "}
            {formatNumber(data.manifest.row_counts.hot_leads_total_rows)}.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
            <TrendingDown className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Refresh / price signals
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Refresh-inflated rows in sample: {formatNumber(refreshInflatedCount)}.
            Price-drop overlaps in sample: {formatNumber(priceDropCount)}.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Next step</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            After UAE validates with the shared card, we will refactor KSA Recon to
            use the same shared card and then add real tab/filter behavior.
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <Link
          href="/dashboard/uae"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
        >
          Back to UAE overview
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}