import Link from "next/link";
import { ArrowUpRight, Database } from "lucide-react";
import ReconPageHero from "./ReconPageHero";
import ReconStatusStrip from "./ReconStatusStrip";
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

  const totalHotLeads = data.manifest.exports.hot_leads?.total_rows_available ?? 0;
  const totalPriceDrops = data.manifest.exports.price_drops?.total_rows_available ?? 0;
  const totalOwnerDirect = data.manifest.exports.owner_direct?.total_rows_available ?? 0;
  const totalStalePriceDrops = data.manifest.exports.stale_price_drops?.total_rows_available ?? 0;

  const loadedTabs = Object.values(data.manifest.exports).filter((item) => item.exists).length;

  const metrics: ReconMetric[] = [
    {
      label: "Hot Leads",
      value: formatNumber(totalHotLeads),
      description: "Highest‑opportunity contacts today",
      tone: "emerald",
    },
    {
      label: "Price Drops",
      value: formatNumber(totalPriceDrops),
      description: "Active price movement signals",
      tone: "red",
    },
    {
      label: "Owner / Direct",
      value: formatNumber(totalOwnerDirect),
      description: "Owner‑connected or direct‑style leads",
      tone: "cyan",
    },
    {
      label: "Stale + Drops",
      value: formatNumber(totalStalePriceDrops),
      description: "Time‑on‑market with price reduction",
      tone: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <ReconPageHero
        countryLabel="United Arab Emirates"
        countryCode="UAE"
        currency="AED"
        exportedAt={data.manifest.exported_at}
        title="UAE Recon Hub"
        description="Best listing opportunities to contact today."
        primaryTableText=""
        marketScopeText=""
      />

      <ReconStatusStrip
        countryLabel="UAE"
        exportLimit={data.manifest.limit}
        summaryRows={data.manifest.summary.total_rows_available}
        tabCount={loadedTabs}
        activeDataMode="Local JSON"
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="relative rounded-2xl bg-zinc-900 border border-white/[0.08] p-4 sm:p-5 flex flex-col gap-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
            style={
              metric.tone
                ? {
                    borderTopColor:
                      metric.tone === "emerald"
                        ? "#10b981"
                        : metric.tone === "red"
                        ? "#f87171"
                        : metric.tone === "cyan"
                        ? "#22d3ee"
                        : "#fbbf24",
                    borderTopWidth: "2px",
                  }
                : undefined
            }
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              {metric.label}
            </span>
            <span className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white leading-none tabular-nums">
              {metric.value}
            </span>
            <span className="text-[11px] text-zinc-500 leading-tight">{metric.description}</span>
          </div>
        ))}
      </div>

      <UaeReconTabsClient data={data} />

      <div className="flex justify-end">
        <Link
          href="/dashboard/uae"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]"
        >
          Back to UAE overview
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}