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
    <div className="space-y-6">
      <section
        className="rounded-xl border p-6"
        style={{
          background: "rgba(245,158,11,0.04)",
          borderColor: "rgba(245,158,11,0.15)",
        }}
      >
        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.15)",
          }}
        >
          <Database className="h-5 w-5" style={{ color: "#fbbf24" }} />
        </div>
        <h1
          className="text-lg font-bold"
          style={{ color: "#f4f4f5" }}
        >
          UAE Recon export not loaded
        </h1>
        <p
          className="mt-2 max-w-2xl text-[13px] leading-relaxed"
          style={{ color: "rgba(251,191,36,0.7)" }}
        >
          {message}
        </p>
        <div
          className="mt-4 rounded-lg p-3"
          style={{
            background: "rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[12px] font-medium" style={{ color: "#a1a1aa" }}>
            Run locally:
          </p>
          <code
            className="mt-1.5 block rounded-md p-2.5 text-[11px]"
            style={{ background: "rgba(0,0,0,0.3)", color: "#52525b" }}
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

  const totalHotLeads =
    data.manifest.exports.hot_leads?.total_rows_available ?? 0;
  const totalPriceDrops =
    data.manifest.exports.price_drops?.total_rows_available ?? 0;
  const totalOwnerDirect =
    data.manifest.exports.owner_direct?.total_rows_available ?? 0;
  const totalStalePriceDrops =
    data.manifest.exports.stale_price_drops?.total_rows_available ?? 0;

  const loadedTabs = Object.values(data.manifest.exports).filter(
    (item) => item.exists
  ).length;

  // UAE priority metrics: Hot Leads > Price Drops > Owner/Direct > Stale+Drops
  const metrics: ReconMetric[] = [
    {
      label: "Hot Leads",
      value: formatNumber(totalHotLeads),
      description: "Top-ranked opportunities to review today",
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
      description: "Owner/direct-style contact signals",
      tone: "cyan",
    },
    {
      label: "Stale + Drops",
      value: formatNumber(totalStalePriceDrops),
      description: "Time-on-market with price movement",
      tone: "amber",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ── Header ──────────────────────────────────────────────── */}
      <ReconPageHero
        countryLabel="United Arab Emirates"
        countryCode="UAE"
        currency="AED"
        exportedAt={data.manifest.exported_at}
        title="UAE Recon Hub"
        description="Daily cockpit — review the best public listing opportunities first."
        primaryTableText=""
        marketScopeText=""
      />

      {/* ── Status strip ────────────────────────────────────────── */}
      <ReconStatusStrip
        countryLabel="UAE"
        exportLimit={data.manifest.limit}
        summaryRows={data.manifest.summary.total_rows_available}
        tabCount={loadedTabs}
        activeDataMode="Local JSON"
      />

      {/* ── KPI row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {metrics.map((metric) => (
          <ReconMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* ── Tabs + content ──────────────────────────────────────── */}
      <UaeReconTabsClient data={data} />

      {/* ── Footer nav ──────────────────────────────────────────── */}
      <div className="flex justify-end pt-2">
        <Link
          href="/dashboard/uae"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-white/[0.04]"
          style={{
            color: "#52525b",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Back to UAE overview
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
