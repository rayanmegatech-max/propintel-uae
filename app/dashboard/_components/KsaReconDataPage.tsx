import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Database,
  TrendingDown,
} from "lucide-react";
import KsaReconTabsClient from "./KsaReconTabsClient";
import ReconMetricCard from "./ReconMetricCard";
import ReconPageHero from "./ReconPageHero";
import ReconStatusStrip from "./ReconStatusStrip";
import { formatNumber } from "@/lib/recon/formatters";
import type { ReconMetric } from "@/lib/recon/types";
import type { KsaReconDataResult } from "@/lib/data/ksaRecon";

type KsaReconDataPageProps = {
  data: KsaReconDataResult;
};

function EmptyExportState({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6 backdrop-blur-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
          <Database className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-bold text-white">
          KSA Recon export not loaded
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-100/80">
          {message}
        </p>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-slate-950/50 p-4">
          <p className="text-sm font-semibold text-white">Run locally:</p>
          <code className="mt-2 block rounded-lg bg-black/30 p-3 text-xs text-slate-300">
            python tools\export_ksa_recon_frontend_data.py
          </code>
        </div>
      </section>
    </div>
  );
}

export default function KsaReconDataPage({ data }: KsaReconDataPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyExportState message={data.message} />;
  }

  const totalHotLeads =
    data.manifest.exports.hot_leads?.total_rows_available ?? 0;
  const totalMultiSignal =
    data.manifest.exports.multi_signal?.total_rows_available ?? 0;
  const totalOwnerDirect =
    data.manifest.exports.owner_direct?.total_rows_available ?? 0;
  const totalUrlOnly = data.manifest.exports.url_only?.total_rows_available ?? 0;
  const totalPriceDrops =
    data.manifest.exports.price_drops?.total_rows_available ?? 0;
  const totalRefreshInflation =
    data.manifest.exports.refresh_inflation?.total_rows_available ?? 0;

  const loadedTabs = Object.values(data.manifest.exports).filter(
    (item) => item.exists
  ).length;

  const metrics: ReconMetric[] = [
    {
      label: "Hot leads",
      value: formatNumber(totalHotLeads),
      description: "Rows available in ksa_recon_dashboard_hot_leads.",
      tone: "emerald",
    },
    {
      label: "Multi-signal",
      value: formatNumber(totalMultiSignal),
      description: "Rows available in ksa_recon_dashboard_multi_signal.",
      tone: "teal",
    },
    {
      label: "Owner/direct",
      value: formatNumber(totalOwnerDirect),
      description: "Rows available in ksa_recon_dashboard_owner_direct.",
      tone: "cyan",
    },
    {
      label: "URL-only leads",
      value: formatNumber(totalUrlOnly),
      description: "Rows available in ksa_recon_dashboard_url_only.",
      tone: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <ReconPageHero
        countryLabel="Kingdom of Saudi Arabia"
        countryCode="KSA"
        currency="SAR"
        exportedAt={data.manifest.exported_at}
        title="KSA Recon Hub command center"
        description="A country-aware intelligence cockpit for surfacing KSA public-listing opportunities across multi-signal leads, owner/direct candidates, price movement, refresh inflation, contactable leads, URL-only leads, residential, and commercial inventory."
        primaryTableText="ksa_recon_dashboard_* product-safe tables"
        marketScopeText="KSA portal intelligence across major public listing categories and lead-contactability paths."
      />

      <ReconStatusStrip
        countryLabel="KSA"
        exportLimit={data.manifest.limit}
        summaryRows={data.manifest.summary.total_rows_available}
        tabCount={loadedTabs}
        activeDataMode="Local JSON"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <ReconMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <KsaReconTabsClient data={data} />

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
            KSA signal coverage
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Price drops: {formatNumber(totalPriceDrops)}. Refresh inflation:{" "}
            {formatNumber(totalRefreshInflation)}.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Next step</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Next frontend step: continue improving premium dashboard visuals and
            then replicate the Recon pattern into the other launch modules.
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <Link
          href="/dashboard/ksa"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
        >
          Back to KSA overview
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}