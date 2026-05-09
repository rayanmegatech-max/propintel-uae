// app/dashboard/_components/UaeReconDataPage.tsx
import Link from "next/link";
import { ArrowUpRight, Database } from "lucide-react";
import ReconPageHero from "./ReconPageHero";
import ReconStatusStrip from "./ReconStatusStrip";
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
    <div className="space-y-6 max-w-4xl">
      <section
        className="rounded-2xl border p-8"
        style={{
          background: "rgba(245,158,11,0.04)",
          borderColor: "rgba(245,158,11,0.15)",
        }}
      >
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <Database className="h-6 w-6" style={{ color: "#fbbf24" }} />
        </div>
        <h1 className="text-xl font-bold" style={{ color: "#ffffff" }}>
          UAE Deal Radar data not loaded
        </h1>
        <p
          className="mt-3 max-w-2xl text-[14px] leading-relaxed font-medium"
          style={{ color: "rgba(251,191,36,0.8)" }}
        >
          {message}
        </p>
        <div
          className="mt-6 rounded-xl p-4 border"
          style={{
            background: "rgba(0,0,0,0.3)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-[13px] font-bold mb-2" style={{ color: "#a1a1aa" }}>
            Developer Instruction:
          </p>
          <code
            className="block rounded-lg p-3 text-[12px] font-mono font-medium"
            style={{ background: "rgba(0,0,0,0.4)", color: "#71717a" }}
          >
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
      label: "Best Deals Today",
      value: formatNumber(totalHotLeads),
      description: "Top-ranked opportunities to review today",
      tone: "emerald",
    },
    {
      label: "Price Drop Signals",
      value: formatNumber(totalPriceDrops),
      description: "Active price movement signals",
      tone: "red",
    },
    {
      label: "Owner / Direct Signals",
      value: formatNumber(totalOwnerDirect),
      description: "Owner/direct-style contact signals",
      tone: "cyan",
    },
    {
      label: "Aged + Price Moved",
      value: formatNumber(totalStalePriceDrops),
      description: "Time-on-market with price movement",
      tone: "amber",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <ReconPageHero
        countryLabel="United Arab Emirates"
        countryCode="UAE"
        currency="AED"
        exportedAt={data.manifest.exported_at}
        title="Deal Radar"
        description="Review ranked listing opportunities from public source signals."
        primaryTableText=""
        marketScopeText=""
      />

      {/* ── Status strip ────────────────────────────────────────── */}
      <ReconStatusStrip
        countryLabel="United Arab Emirates"
        exportLimit={data.manifest.limit}
        summaryRows={data.manifest.summary.total_rows_available}
        tabCount={loadedTabs}
        activeDataMode="Local JSON"
      />

      {/* ── KPI row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <ReconMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* ── Tabs + content ──────────────────────────────────────── */}
      <UaeReconTabsClient data={data} />

      {/* ── Footer nav ──────────────────────────────────────────── */}
      <div className="flex justify-end pt-4">
        <Link
          href="/dashboard/uae"
          className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all hover:bg-white/[0.04]"
          style={{
            color: "#a1a1aa",
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Back to UAE Command Center
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}