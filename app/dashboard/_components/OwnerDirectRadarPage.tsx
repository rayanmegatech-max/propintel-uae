import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Database,
  Phone,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import ReconOpportunityCard from "./ReconOpportunityCard";
import { formatNumber } from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { KsaReconDataResult } from "@/lib/data/ksaRecon";
import type { UaeReconDataResult } from "@/lib/data/uaeRecon";
import type { ReconMetric } from "@/lib/recon/types";

type OwnerDirectRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

function EmptyOwnerDirectState({
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
          {country.label} Owner / Direct export not loaded
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

function getOwnerDirectTableName(country: CountryConfig): string {
  if (country.slug === "ksa") {
    return (
      country.tables.reconOwnerDirect ||
      country.tables.ownerDirect ||
      "ksa_recon_dashboard_owner_direct"
    );
  }

  return (
    country.tables.reconOwnerDirect ||
    country.tables.ownerDirect ||
    "recon_dashboard_owner_direct"
  );
}

export default function OwnerDirectRadarPage({
  country,
  data,
}: OwnerDirectRadarPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyOwnerDirectState country={country} message={data.message} />;
  }

  const ownerDirectPayload = data.lists.ownerDirect;

  if (!ownerDirectPayload || ownerDirectPayload.items.length === 0) {
    return (
      <EmptyOwnerDirectState
        country={country}
        message={`${country.label} Owner / Direct export loaded, but no owner/direct records were available in the local frontend sample.`}
      />
    );
  }

  const normalizedItems = normalizeReconList(
    ownerDirectPayload.items,
    country.slug,
    ownerDirectPayload.source_table
  );

  const visibleItems = normalizedItems.slice(0, 30);

  const totalRows = ownerDirectPayload.total_rows_available;
  const exportedRows = ownerDirectPayload.exported_rows;
  const tableName = getOwnerDirectTableName(country);

  const contactableCount = normalizedItems.filter(
    (item) => item.hasPhone || item.hasWhatsapp || item.hasEmail
  ).length;

  const urlReadyCount = normalizedItems.filter((item) => item.listingUrl).length;

  const agencyCount = new Set(
    normalizedItems
      .map((item) => item.agencyName)
      .filter((value): value is string => Boolean(value))
  ).size;

  const metrics: ReconMetric[] = [
    {
      label: "Owner/direct rows",
      value: formatNumber(totalRows),
      description: `Rows available in ${tableName}.`,
      tone: "emerald",
    },
    {
      label: "Exported sample",
      value: formatNumber(exportedRows),
      description: "Rows loaded into this local frontend preview.",
      tone: "cyan",
    },
    {
      label: "Contactable sample",
      value: formatNumber(contactableCount),
      description: "Sample rows with phone, WhatsApp, or email signals.",
      tone: "amber",
    },
    {
      label: "Agencies visible",
      value: formatNumber(agencyCount),
      description: "Distinct agencies visible inside the exported sample.",
      tone: "teal",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
                <Radar className="h-3.5 w-3.5" />
                {country.label} Owner / Direct Radar
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Real exported data
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Owner / Direct Radar
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              A product-safe lead intelligence view for owner-like, direct,
              no-commission, missing-brokerage, URL-lead, and contactable public
              listing signals. This page uses the same real local export foundation
              as Recon Hub, but focuses only on the owner/direct opportunity lane.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/recon`}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(16,185,129,0.22)] transition hover:bg-emerald-400"
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

          <aside className="rounded-[1.7rem] border border-emerald-400/20 bg-emerald-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-emerald-50">
                  Safe wording rule
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                  This page does not claim guaranteed private-owner leads. It shows
                  public listing signals and action paths using cautious product
                  wording: owner/direct-style, contactable, URL-ready, and
                  opportunity signals.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Source table: ${ownerDirectPayload.source_table}`,
                `Exported rows: ${exportedRows.toLocaleString("en-US")}`,
                `Total rows: ${totalRows.toLocaleString("en-US")}`,
                `URL-ready sample rows: ${urlReadyCount.toLocaleString("en-US")}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-emerald-50/90"
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Top owner/direct-style opportunities
            </div>

            <h2 className="text-xl font-black tracking-tight text-white">
              {country.label} owner/direct opportunity sample
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Showing the first 30 normalized cards from the exported owner/direct
              sample. Dedicated filters/search will be added after we confirm this
              standalone module pattern.
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
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Phone className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Contact action paths
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Contact signals can include phone, WhatsApp, email, or source URL
            actions depending on portal coverage and country-specific data quality.
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
            Current standalone page reads the existing owner/direct Recon export.
            Future version can get a dedicated owner/direct export adapter if we
            need module-specific filters or pagination.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            First standalone module
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This is the first non-Recon page converted from a placeholder shell
            into a real exported-data module page.
          </p>
        </div>
      </section>
    </div>
  );
}