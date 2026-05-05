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
  KsaReconDataResult,
  KsaReconOpportunity,
} from "@/lib/data/ksaRecon";

type KsaReconDataPageProps = {
  data: KsaReconDataResult;
};

function asNumber(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asBooleanSignal(value: unknown): boolean {
  return value === 1 || value === true || value === "1" || value === "true";
}

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
    return `SAR ${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 2)}M`;
  }

  return `SAR ${new Intl.NumberFormat("en-US", {
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

function getBadgeList(opportunity: KsaReconOpportunity): string[] {
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

function getCity(item: KsaReconOpportunity) {
  return asString(item.city) || "Unknown city";
}

function getDistrict(item: KsaReconOpportunity) {
  return (
    asString(item.district) ||
    asString(item.community) ||
    asString(item.building_name)
  );
}

function getLocation(item: KsaReconOpportunity) {
  const city = getCity(item);
  const district = getDistrict(item);

  return district ? `${city} · ${district}` : city;
}

function getPortal(item: KsaReconOpportunity) {
  return asString(item.portal) || asString(item.source_portal) || "Unknown portal";
}

function getSourceCategory(item: KsaReconOpportunity) {
  return asString(item.source_category) || asString(item.source_db_label);
}

function getListingUrl(item: KsaReconOpportunity) {
  return asString(item.property_url) || asString(item.source_url);
}

function getPriority(item: KsaReconOpportunity) {
  return asString(item.priority_label) || asString(item.priority_bucket);
}

function getDisplayPrice(item: KsaReconOpportunity) {
  return (
    asNumber(item.price) ||
    asNumber(item.current_price) ||
    asNumber(item.price_amount) ||
    asNumber(item.new_price) ||
    asNumber(item.old_price)
  );
}

function getPriceLabel(item: KsaReconOpportunity) {
  if (
    asNumber(item.price) ||
    asNumber(item.current_price) ||
    asNumber(item.price_amount)
  ) {
    return "Advertised price";
  }

  if (asNumber(item.new_price)) {
    return "Latest known price";
  }

  if (asNumber(item.old_price)) {
    return "Previous known price";
  }

  return "Advertised price";
}

function getGeneratedTitle(item: KsaReconOpportunity) {
  const explicitTitle =
    asString(item.opportunity_title) ||
    asString(item.title) ||
    asString(item.listing_title) ||
    asString(item.property_title) ||
    asString(item.name) ||
    asString(item.description);

  if (explicitTitle) {
    return explicitTitle;
  }

  const lane = asString(item.opportunity_lane);
  const propertyType = asString(item.property_type);
  const sourceCategory = getSourceCategory(item);
  const city = getCity(item);
  const district = getDistrict(item);

  const signalParts: string[] = [];

  if (asBooleanSignal(item.has_owner_direct_signal)) {
    signalParts.push("Owner/direct signal");
  }

  if (asBooleanSignal(item.has_price_drop_signal)) {
    signalParts.push("price movement");
  }

  if (asBooleanSignal(item.has_refresh_signal)) {
    signalParts.push("refresh signal");
  }

  const signalText =
    signalParts.length > 0 ? signalParts.join(" + ") : labelize(lane);

  const assetText =
    propertyType ||
    (sourceCategory ? labelize(sourceCategory) : "public listing opportunity");

  const locationText = district ? `${district}, ${city}` : city;

  return `${signalText} · ${assetText} in ${locationText}`;
}

function getSubtitle(item: KsaReconOpportunity) {
  const portal = labelize(getPortal(item));
  const sourceCategory = labelize(getSourceCategory(item));
  const sourceId = asString(item.source_listing_id);

  const parts = [portal, sourceCategory].filter(
    (part) => part && part !== "Unknown"
  );

  if (sourceId) {
    parts.push(`ID ${sourceId}`);
  }

  return parts.length > 0
    ? parts.join(" · ")
    : "KSA public-listing opportunity";
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

function OpportunityCard({ item }: { item: KsaReconOpportunity }) {
  const badges = getBadgeList(item);
  const dropPct = formatPercent(asNumber(item.drop_pct));
  const listingUrl = getListingUrl(item);
  const displayPrice = getDisplayPrice(item);

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-emerald-400/25 hover:bg-white/[0.06]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              #{item.dashboard_rank ?? item.recon_rank ?? "—"}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              {labelize(getPriority(item))}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Score {item.recon_score ?? "—"}
            </span>

            {asBooleanSignal(item.has_owner_direct_signal) && (
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                Owner/direct
              </span>
            )}

            {asBooleanSignal(item.has_refresh_signal) && (
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Refresh signal
              </span>
            )}

            {dropPct && (
              <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                Drop {dropPct}
              </span>
            )}
          </div>

          <h2 className="line-clamp-2 text-base font-semibold text-white">
            {getGeneratedTitle(item)}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
            {getSubtitle(item)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              <MapPinned className="h-3.5 w-3.5 text-slate-500" />
              {getLocation(item)}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {labelize(getSourceCategory(item))}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {labelize(getPortal(item))}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {asString(item.property_type) || "Property type unavailable"}
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
            {getPriceLabel(item)}
          </p>
          <p className="mt-1 text-xl font-bold text-white">
            {formatCurrency(displayPrice)}
          </p>

          {(item.old_price || item.new_price || item.drop_amount) && (
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              {item.old_price ? (
                <p>Old: {formatCurrency(asNumber(item.old_price))}</p>
              ) : null}
              {item.new_price ? (
                <p>New: {formatCurrency(asNumber(item.new_price))}</p>
              ) : null}
              {item.drop_amount ? (
                <p className="text-red-300">
                  Drop: {formatCurrency(asNumber(item.drop_amount))}
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
                {item.size_sqft
                  ? `${formatNumber(asNumber(item.size_sqft))} size`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {listingUrl ? (
              <Link
                href={listingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                {asString(item.cta_text) || "Open Listing"}
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
                {item.has_phone_available ? "Phone" : "URL lead"}
              </span>
              <span>
                {asString(item.agency_name) ||
                  asString(item.agent_name) ||
                  "Agency unavailable"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function KsaReconDataPage({ data }: KsaReconDataPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyExportState message={data.message} />;
  }

  const mainPayload =
    data.lists.hotLeads?.items.length
      ? data.lists.hotLeads
      : data.lists.multiSignal?.items.length
        ? data.lists.multiSignal
        : data.lists.contactable;

  if (!mainPayload) {
    return (
      <EmptyExportState message="KSA Recon export loaded, but no primary list payload was available." />
    );
  }

  const items = mainPayload.items.slice(0, 25);

  const totalHotLeads =
    data.manifest.exports.hot_leads?.total_rows_available ?? 0;
  const totalMultiSignal =
    data.manifest.exports.multi_signal?.total_rows_available ?? 0;
  const totalOwnerDirect =
    data.manifest.exports.owner_direct?.total_rows_available ?? 0;
  const totalUrlOnly = data.manifest.exports.url_only?.total_rows_available ?? 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                KSA · Recon Hub · Local export
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                KSA Recon Hub
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400 sm:text-base">
                KSA public-listing opportunity command center powered by exported
                ksa_recon_dashboard_* tables. KSA supports URL-lead/source URL paths
                because phone and WhatsApp coverage can be weaker than UAE.
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
                    expose raw price-history events or internal evidence tables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Hot leads"
          value={formatNumber(totalHotLeads)}
          description="Rows available in ksa_recon_dashboard_hot_leads."
        />
        <MetricCard
          label="Multi-signal"
          value={formatNumber(totalMultiSignal)}
          description="Rows available in ksa_recon_dashboard_multi_signal."
        />
        <MetricCard
          label="Owner/direct"
          value={formatNumber(totalOwnerDirect)}
          description="Rows available in ksa_recon_dashboard_owner_direct."
        />
        <MetricCard
          label="URL-only leads"
          value={formatNumber(totalUrlOnly)}
          description="Rows available in ksa_recon_dashboard_url_only."
        />
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
              <Filter className="h-3.5 w-3.5" />
              Filters are visual-only in Phase 5E.2
            </div>

            <h2 className="text-lg font-semibold text-white">
              Top exported KSA opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Showing the first 25 rows from the selected exported KSA Recon list,
              sorted by the safest available priority/rank field.
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
            Price drops:{" "}
            {formatNumber(
              data.manifest.exports.price_drops?.total_rows_available ?? 0
            )}
            . Refresh inflation:{" "}
            {formatNumber(
              data.manifest.exports.refresh_inflation?.total_rows_available ?? 0
            )}
            .
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Next step</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            After UAE and KSA Recon validate, we will unify the card/table design
            and then move toward real filter state and hosted data planning.
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
