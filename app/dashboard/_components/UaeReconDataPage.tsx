import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Database,
  ExternalLink,
  Filter,
  MapPinned,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import type {
  UaeReconDataResult,
  UaeReconOpportunity,
} from "@/lib/data/uaeRecon";

type UaeReconDataPageProps = {
  data: UaeReconDataResult;
};

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Price unavailable";
  }

  if (value >= 1_000_000) {
    return `AED ${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 2)}M`;
  }

  return `AED ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  return `${value.toFixed(1)}%`;
}

function labelize(value: string | null | undefined) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getBadgeList(opportunity: UaeReconOpportunity): string[] {
  const raw = opportunity.badges;

  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "label" in item) {
          const label = (item as { label?: unknown }).label;
          return typeof label === "string" ? label : null;
        }
        return null;
      })
      .filter((item): item is string => Boolean(item))
      .slice(0, 4);
  }

  if (raw && typeof raw === "object") {
    return Object.values(raw)
      .map((item) => (typeof item === "string" ? item : null))
      .filter((item): item is string => Boolean(item))
      .slice(0, 4);
  }

  return [];
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

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

function OpportunityCard({ item }: { item: UaeReconOpportunity }) {
  const badges = getBadgeList(item);
  const dropPct = formatPercent(item.drop_pct);

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-emerald-400/25 hover:bg-white/[0.06]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              #{item.dashboard_rank ?? "—"}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              {labelize(item.priority_label)}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Score {item.recon_score ?? "—"}
            </span>

            {dropPct && (
              <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                Drop {dropPct}
              </span>
            )}
          </div>

          <h2 className="line-clamp-2 text-base font-semibold text-white">
            {item.opportunity_title || item.title || "Untitled opportunity"}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
            {item.title || "Listing title unavailable"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              <MapPinned className="h-3.5 w-3.5 text-slate-500" />
              {item.city || "Unknown city"}
              {item.community ? ` · ${item.community}` : ""}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {labelize(item.source_category)}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {labelize(item.portal)}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {item.property_type || "Property type unavailable"}
            </span>
          </div>

          {badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-xs font-medium text-teal-200"
                >
                  {labelize(badge)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-full rounded-2xl border border-white/[0.08] bg-slate-950/60 p-4 xl:w-72">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Advertised price
          </p>
          <p className="mt-1 text-xl font-bold text-white">
            {formatCurrency(item.price)}
          </p>

          {(item.old_price || item.new_price || item.drop_amount) && (
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              {item.old_price ? <p>Old: {formatCurrency(item.old_price)}</p> : null}
              {item.new_price ? <p>New: {formatCurrency(item.new_price)}</p> : null}
              {item.drop_amount ? (
                <p className="text-red-300">
                  Drop: {formatCurrency(item.drop_amount)}
                </p>
              ) : null}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2">
              <p className="text-slate-500">Beds</p>
              <p className="mt-1 font-semibold text-slate-200">
                {item.bedrooms ?? "—"}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2">
              <p className="text-slate-500">Size</p>
              <p className="mt-1 font-semibold text-slate-200">
                {item.size_sqft ? `${formatNumber(item.size_sqft)} sqft` : "—"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {item.property_url ? (
              <Link
                href={item.property_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                {item.cta_text || "Open Listing"}
                <ExternalLink className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-slate-500"
              >
                Listing unavailable
              </button>
            )}

            <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {item.has_phone_available ? "Phone" : "No phone"}
              </span>
              <span>{item.agency_name || "Agency unavailable"}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function UaeReconDataPage({ data }: UaeReconDataPageProps) {
  if (data.status !== "ready" || !data.hotLeads || !data.manifest) {
    return <EmptyExportState message={data.message} />;
  }

  const items = data.hotLeads.items.slice(0, 25);
  const allItems = data.hotLeads.items;

  const priceDropCount = allItems.filter((item) => item.is_price_drop).length;
  const ownerDirectCount = allItems.filter((item) => item.is_owner_direct).length;
  const refreshInflatedCount = allItems.filter(
    (item) => item.is_refresh_inflated
  ).length;

  const exportedAt = data.manifest.exported_at;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                UAE · Recon Hub · Local export
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                UAE Recon Hub
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400 sm:text-base">
                Daily public-listing opportunity command center powered by the
                product-safe <code>recon_dashboard_hot_leads</code> export. This
                is the first local data-connected page before Supabase.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Currency: AED
                </span>
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Source: {data.hotLeads.source_table}
                </span>
                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                  Exported: {exportedAt}
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
        <MetricCard
          label="Total hot leads"
          value={formatNumber(data.hotLeads.total_rows_available)}
          description="Rows available in recon_dashboard_hot_leads."
        />
        <MetricCard
          label="Exported sample"
          value={formatNumber(data.hotLeads.exported_rows)}
          description="Local JSON rows available for the first UI build."
        />
        <MetricCard
          label="Price-drop overlap"
          value={formatNumber(priceDropCount)}
          description="Rows in the local sample carrying a price-drop signal."
        />
        <MetricCard
          label="Owner/direct overlap"
          value={formatNumber(ownerDirectCount)}
          description="Rows in the local sample carrying owner/direct signal."
        />
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
              <Filter className="h-3.5 w-3.5" />
              Filters are visual-only in Phase 5D.4
            </div>

            <h2 className="text-lg font-semibold text-white">
              Top exported opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Showing the first 25 opportunities from the top 500 local JSON export,
              sorted by dashboard rank.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["City", "Community", "Portal", "Category", "Priority", "Confidence"].map(
              (filter) => (
                <span
                  key={filter}
                  className="rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-400"
                >
                  {filter}
                </span>
              )
            )}
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <OpportunityCard
              key={`${item.listing_key || item.recon_id || index}-${index}`}
              item={item}
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
            After this page validates visually, we will refine cards/tables, add
            real filter state, then adapt the same pattern to KSA Recon.
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