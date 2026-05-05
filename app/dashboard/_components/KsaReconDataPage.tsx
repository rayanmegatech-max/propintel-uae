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
import type { KsaReconDataResult, KsaReconListPayload } from "@/lib/data/ksaRecon";

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

function getPrimaryPayload(data: KsaReconDataResult): KsaReconListPayload | null {
  if (data.lists.hotLeads?.items.length) return data.lists.hotLeads;
  if (data.lists.multiSignal?.items.length) return data.lists.multiSignal;
  if (data.lists.contactable?.items.length) return data.lists.contactable;
  if (data.lists.urlOnly?.items.length) return data.lists.urlOnly;

  return null;
}

export default function KsaReconDataPage({ data }: KsaReconDataPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyExportState message={data.message} />;
  }

  const mainPayload = getPrimaryPayload(data);

  if (!mainPayload) {
    return (
      <EmptyExportState message="KSA Recon export loaded, but no primary list payload was available." />
    );
  }

  const normalizedItems = normalizeReconList(
    mainPayload.items,
    "ksa",
    mainPayload.source_table
  );

  const visibleItems = normalizedItems.slice(0, 25);

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
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                KSA · Recon Hub · Shared card pattern
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                KSA Recon Hub
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400 sm:text-base">
                KSA public-listing opportunity command center powered by exported
                ksa_recon_dashboard_* tables. This page now uses the same shared
                Recon normalizer and opportunity card pattern as UAE.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Currency: SAR
                </span>
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Primary source: {mainPayload.source_table}
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
                    KSA product-safe data
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                    This page reads exported KSA dashboard JSON only. It does not
                    expose raw price-history events, internal evidence tables, or
                    local SQLite directly to the browser.
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
              Filters are visual-only in Phase 5E.4.3
            </div>

            <h2 className="text-lg font-semibold text-white">
              Top exported KSA opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Showing the first 25 rows from the selected exported KSA Recon list,
              normalized into the shared Recon card model.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "City",
              "District",
              "Portal",
              "Category",
              "Priority",
              "Contactability",
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
            UAE and KSA now share the same Recon card model. Next, we can add
            real tabs and client-side filters on the local export samples.
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