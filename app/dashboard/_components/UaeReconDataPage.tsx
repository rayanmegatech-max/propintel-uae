import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Database,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import UaeReconTabsClient from "./UaeReconTabsClient";
import { formatNumber } from "@/lib/recon/formatters";
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
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyExportState message={data.message} />;
  }

  const totalHotLeads =
    data.manifest.exports.hot_leads?.total_rows_available ?? 0;
  const totalPriceDrops =
    data.manifest.exports.price_drops?.total_rows_available ?? 0;
  const totalOwnerDirect =
    data.manifest.exports.owner_direct?.total_rows_available ?? 0;
  const totalStalePriceDrops =
    data.manifest.exports.stale_price_drops?.total_rows_available ?? 0;
  const totalRefreshInflated =
    data.manifest.exports.refresh_inflated?.total_rows_available ?? 0;

  const metrics: ReconMetric[] = [
    {
      label: "Hot leads",
      value: formatNumber(totalHotLeads),
      description: "Rows available in recon_dashboard_hot_leads.",
      tone: "emerald",
    },
    {
      label: "Price drops",
      value: formatNumber(totalPriceDrops),
      description: "Rows available in recon_dashboard_price_drops.",
      tone: "red",
    },
    {
      label: "Owner/direct",
      value: formatNumber(totalOwnerDirect),
      description: "Rows available in recon_dashboard_owner_direct.",
      tone: "cyan",
    },
    {
      label: "Stale + drops",
      value: formatNumber(totalStalePriceDrops),
      description: "Rows available in recon_dashboard_stale_price_drops.",
      tone: "amber",
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
                UAE · Recon Hub · Clickable tabs
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                UAE Recon Hub
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400 sm:text-base">
                Daily public-listing opportunity command center powered by exported
                UAE Recon dashboard tabs. You can now switch between product-safe
                lists without changing routes.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Currency: AED
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
                    Product-safe tab data
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                    The UAE export includes all Recon dashboard tabs from
                    product-safe recon_dashboard_* tables. Raw price-history events
                    and internal evidence tables remain hidden.
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

      <UaeReconTabsClient data={data} />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Export manifest</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Export limit: {data.manifest.limit}. Summary rows:{" "}
            {formatNumber(data.manifest.summary.total_rows_available)}.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
            <TrendingDown className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            UAE signal coverage
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Refresh-inflated: {formatNumber(totalRefreshInflated)}. Price drops:{" "}
            {formatNumber(totalPriceDrops)}.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Next step</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            After UAE tab switching validates, we will wire the same tab selector
            into KSA Recon.
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