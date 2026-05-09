// app/dashboard/_components/MarketIntelligencePage.tsx
import Link from "next/link";
import type { ElementType } from "react";
import {
  ArrowRight,
  BarChart3,
  Database,
  Gauge,
  Map,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { formatNumber } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { Module5DataResult, Module5ListPayload } from "@/lib/data/module5";

// ─── Design tokens ───────────────────────────────────────────────────────────
const T = {
  pageBg:  "#09090b",
  cardBg:  "#0c0c0e",
  wellBg:  "#18181b",
  border:  "rgba(255,255,255,0.07)",
  borderFt:"rgba(255,255,255,0.04)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  t4: "#52525b",
  em:    "#10b981",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.08)",
  emBdr: "rgba(16,185,129,0.2)",
  am:    "#fbbf24",
  amBg:  "rgba(245,158,11,0.08)",
  amBdr: "rgba(245,158,11,0.18)",
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────
type MarketIntelligencePageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type MetricTone = "emerald" | "amber" | "neutral";

// ─── Data helpers (unchanged) ────────────────────────────────────────────────
function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
function getSummaryMetric(data: Module5DataResult, metricKey: string): number | null {
  const row = data.summary?.items.find(
    (item) => asString(item.metric_key) === metricKey
  );
  return asNumber(row?.metric_value) ?? asNumber(row?.rows);
}
function getPayloadRows(payload: Module5ListPayload | null): number {
  return payload?.total_rows_available ?? 0;
}

// ─── Mini visual components ──────────────────────────────────────────────────
function MiniBarRail({ count, tone }: { count?: number; tone: MetricTone }) {
  const segments = 12;
  const filled = Math.min(segments, Math.ceil((count ?? 0) / 1000));
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : T.t3;
  const bg   = "rgba(255,255,255,0.08)";
  return (
    <div className="flex items-end gap-[2px] h-5 mt-1">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px] transition-all"
          style={{
            height: `${8 + (i + 1) * 1.2}px`,
            background: i < filled ? color : bg,
            opacity: i < filled ? 0.9 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

function MiniDotRow({ count, tone }: { count?: number; tone: MetricTone }) {
  const dots = 10;
  const active = Math.min(dots, Math.ceil((count ?? 0) / 500));
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : T.t3;
  return (
    <div className="flex items-center gap-[3px] mt-1">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className="h-[4px] w-[4px] rounded-full"
          style={{
            background: i < active ? color : "rgba(255,255,255,0.08)",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

function MiniSignalWave({ tone }: { tone: MetricTone }) {
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : T.t3;
  return (
    <svg width="44" height="16" viewBox="0 0 44 16" fill="none" aria-hidden="true" className="opacity-60 mt-1">
      <path
        d="M0 12 L4 10 L8 12 L12 6 L16 8 L20 4 L24 6 L28 2 L32 4 L36 1 L40 3 L44 0"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function AbstractGrid({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "18px 18px",
        }}
      />
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyMarketState({
  country,
  message,
}: {
  country: CountryConfig;
  message: string;
}) {
  const exportCmd =
    country.slug === "uae"
      ? "python tools\\export_uae_module5_frontend_data.py"
      : "python tools\\export_ksa_module5_frontend_data.py";

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border"
        style={{ background: T.amBg, borderColor: T.amBdr }}
      >
        <Database className="h-6 w-6" style={{ color: T.am }} />
      </div>

      <h1 className="text-xl font-bold" style={{ color: T.t1 }}>
        {country.label} Market Intelligence not available
      </h1>

      <p
        className="mt-2 max-w-md text-[13px] leading-relaxed"
        style={{ color: T.t3 }}
      >
        {message}
      </p>

      <div
        className="mt-6 rounded-xl border px-5 py-4 text-left w-full max-w-md"
        style={{ background: T.cardBg, borderColor: T.border }}
      >
        <p className="text-xs font-medium" style={{ color: T.t2 }}>
          Generate local exports:
        </p>
        <code
          className="mt-2 block rounded-lg p-3 text-xs"
          style={{
            background: "#000",
            color: T.emHi,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {exportCmd}
        </code>
      </div>
    </div>
  );
}

// ─── KPI Metric Card ──────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  description,
  tone = "neutral",
  visual,
}: {
  label: string;
  value: string;
  description: string;
  tone?: MetricTone;
  visual?: "bars" | "dots" | "signal";
}) {
  const accentBg  = tone === "emerald" ? T.emBg : tone === "amber" ? T.amBg : "rgba(255,255,255,0.03)";
  const accentBdr = tone === "emerald" ? T.emBdr : tone === "amber" ? T.amBdr : T.border;
  const numVal = parseInt(value.replace(/,/g, ""), 10) || 0;

  return (
    <div
      className="relative rounded-2xl border p-5 transition-shadow hover:shadow-lg hover:shadow-black/20"
      style={{
        background:  accentBg,
        borderColor: accentBdr,
        boxShadow:   "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: T.t4 }}
      >
        {label}
      </p>

      <p
        className="mt-2 font-bold tabular-nums leading-none"
        style={{
          color: T.t1,
          fontSize: "clamp(22px, 2.4vw, 34px)",
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </p>

      <div className="mt-1 mb-2">
        {visual === "bars" && <MiniBarRail count={numVal} tone={tone} />}
        {visual === "dots" && <MiniDotRow count={numVal} tone={tone} />}
        {visual === "signal" && <MiniSignalWave tone={tone} />}
      </div>

      <p className="text-[12px] leading-relaxed" style={{ color: T.t3 }}>
        {description}
      </p>
    </div>
  );
}

// ─── Market Pulse featured card ───────────────────────────────────────────────
function MarketPulse({
  totalActiveMarkets,
  highPressureCount,
  activityEvents,
  activePayloadExists,
}: {
  totalActiveMarkets: number;
  highPressureCount: number;
  activityEvents: number;
  activePayloadExists: boolean;
}) {
  const insights: string[] = [];
  if (activePayloadExists) {
    insights.push(`${formatNumber(totalActiveMarkets)} locations with visible public listing signals ready for review`);
  }
  if (highPressureCount > 0) {
    insights.push(`${formatNumber(highPressureCount)} markets showing directional Supply Pressure indicators`);
  }
  if (activityEvents > 0) {
    insights.push(`${formatNumber(activityEvents)} recent activity events captured in this export`);
  }

  // If nothing to show, fallback
  if (insights.length === 0) {
    insights.push("Market activity data loaded. Use the lanes below to explore.");
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background: `radial-gradient(circle at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 40%), ${T.cardBg}`,
        borderColor: T.border,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <AbstractGrid className="opacity-40" />

      <div className="relative p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
            style={{ background: T.emBg, borderColor: T.emBdr }}
          >
            <Zap className="h-5 w-5" style={{ color: T.emHi }} />
          </div>
          <div>
            <h2 className="text-[20px] font-bold tracking-tight" style={{ color: T.t1 }}>
              Market Pulse
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: T.t3 }}>
              Directional intelligence from public listing activity, pressure, and agency visibility.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: i === 0 ? T.em : i === 1 ? T.am : T.t3 }}
                />
                <p className="text-[13px] leading-relaxed" style={{ color: T.t2 }}>
                  {insight}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden sm:block relative h-full min-h-[100px]">
            <div
              className="absolute inset-0 flex items-end gap-[3px] opacity-70"
              aria-hidden="true"
            >
              {Array.from({ length: 16 }).map((_, i) => {
                const h =
                  (i % 3 === 0
                    ? 0.5 + (activityEvents % 10) / 30
                    : i % 3 === 1
                      ? 0.3 + (highPressureCount % 10) / 40
                      : 0.35 + (totalActiveMarkets % 10) / 35) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-[2px]"
                    style={{
                      height: `${Math.min(100, h)}%`,
                      background:
                        i % 3 === 0
                          ? `linear-gradient(to top, ${T.em}40, ${T.em}10)`
                          : i % 3 === 1
                            ? `linear-gradient(to top, ${T.am}40, ${T.am}10)`
                            : `linear-gradient(to top, ${T.t3}30, transparent)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Intelligence Lane Card ──────────────────────────────────────────────────
function IntelligenceLane({
  icon: Icon,
  title,
  description,
  statLabel,
  statValue,
  ctaHref,
  ctaText,
  tone = "neutral",
}: {
  icon: ElementType;
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  ctaHref: string;
  ctaText: string;
  tone?: MetricTone;
}) {
  const iconBg  = tone === "emerald" ? T.emBg : tone === "amber" ? T.amBg : "rgba(255,255,255,0.05)";
  const iconBdr = tone === "emerald" ? T.emBdr : tone === "amber" ? T.amBdr : T.border;
  const iconClr = tone === "emerald" ? T.emHi : tone === "amber" ? T.am : T.t2;
  const bdr     = tone === "emerald" ? T.emBdr : tone === "amber" ? T.amBdr : T.border;

  return (
    <div
      className="flex flex-col rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
      style={{
        background:  T.cardBg,
        borderColor: bdr,
        boxShadow:   "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex-1 p-6">
        <div className="flex items-start gap-4 mb-5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
            style={{ background: iconBg, borderColor: iconBdr }}
          >
            <Icon className="h-5 w-5" style={{ color: iconClr }} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold" style={{ color: T.t1 }}>
              {title}
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: T.t3 }}>
              {description}
            </p>
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-xl border px-4 py-3 mb-5"
          style={{ background: T.wellBg, borderColor: T.border }}
        >
          <span className="text-[11px] font-medium" style={{ color: T.t4 }}>
            {statLabel}
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: T.t1, letterSpacing: "-0.025em" }}
          >
            {statValue}
          </span>
        </div>

        <div className="flex items-end gap-[2px] h-6 opacity-40" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px]"
              style={{
                height: `${14 + (i % 4) * 6}px`,
                background: tone === "emerald" ? T.em : tone === "amber" ? T.am : T.t3,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="border-t px-6 py-3.5"
        style={{ borderColor: T.borderFt }}
      >
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-opacity hover:opacity-75"
          style={{ color: tone === "neutral" ? T.t2 : tone === "amber" ? T.am : T.emHi }}
        >
          {ctaText}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ─── Data confidence footer ──────────────────────────────────────────────────
function DataConfidenceFooter({
  exportedAt,
  sourceCount,
}: {
  exportedAt?: string | null;
  sourceCount?: number;
}) {
  if (!exportedAt && !sourceCount) return null;

  const formattedTime = exportedAt
    ? new Date(exportedAt).toLocaleString(undefined, {
        month:  "short",
        day:    "numeric",
        hour:   "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border px-5 py-3 text-[11px]"
      style={{
        background: "rgba(255,255,255,0.015)",
        borderColor: T.borderFt,
        color: T.t4,
      }}
    >
      {formattedTime && (
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: T.em }}
          />
          Synced {formattedTime}
        </div>
      )}
      {sourceCount !== undefined && (
        <div className="flex items-center gap-1.5">
          <Database className="h-3 w-3" style={{ color: T.t4 }} />
          {sourceCount} data exports loaded
        </div>
      )}
      <div className="ml-auto flex items-center gap-1.5">
        <ShieldCheck className="h-3 w-3" style={{ color: T.t4 }} />
        Dashboard‑safe market view
      </div>
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────
export default function MarketIntelligencePage({
  country,
  data,
}: MarketIntelligencePageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyMarketState country={country} message={data.message} />;
  }

  const isUae = country.slug === "uae";

  // Payloads
  const activityPayload = data.activityFeed;
  const pressurePayload = isUae ? data.inventoryPressure : data.inventoryPressureLarge;
  const agencyPayload   = isUae ? data.agencyProfiles : data.agencyProfilesMajor;

  // Row counts
  const activeMarkets = isUae
    ? getPayloadRows(data.communityIntelligence)
    : getPayloadRows(data.districtIntelligence);
  const activityRows = getPayloadRows(activityPayload);
  const pressureRows = getPayloadRows(pressurePayload);
  const agencyRows   = getPayloadRows(agencyPayload);

  // Summary metrics (fallback to row counts)
  const highPressureMetric = isUae
    ? getSummaryMetric(data, "high_pressure_communities")
    : getSummaryMetric(data, "ksa_module5_dashboard_inventory_pressure_large_markets");
  const activityMetric = isUae
    ? getSummaryMetric(data, "market_activity_feed")
    : getSummaryMetric(data, "ksa_module5_dashboard_activity_priority");
  const agencyMetric = isUae
    ? getSummaryMetric(data, "agency_inventory_profiles")
    : getSummaryMetric(data, "ksa_module5_dashboard_agency_profiles_major");

  // Display values
  const metricMarkets  = formatNumber(activeMarkets);
  const metricActivity = formatNumber(activityMetric ?? activityRows);
  const metricPressure = formatNumber(highPressureMetric ?? pressureRows);
  const metricAgency   = formatNumber(agencyMetric ?? agencyRows);

  const highPressureCount  = highPressureMetric ?? pressureRows;
  const activityEventCount = activityMetric ?? activityRows;
  const hasActivePayload = !!activityPayload;

  // Manifest metadata
  const exportTime  = data.manifest.exported_at;
  const sourceCount = Object.keys(data.manifest.exports).length;

  const locationLabel = isUae ? "Community Markets" : "City / District Markets";
  const locationDesc  = isUae
    ? "Communities with visible public listing signals ready for review."
    : "Cities and districts with visible public listing signals ready for review.";

  return (
    <div className="space-y-6">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: T.emHi, background: T.emBg, borderColor: T.emBdr }}
          >
            <BarChart3 className="h-3 w-3" />
            {country.label} Market Intelligence
          </div>

          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: T.t1, letterSpacing: "-0.03em" }}
          >
            Market Intelligence
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: T.t2 }}>
            See where public listing activity, pressure, and agency visibility are moving.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span
            className="rounded-full border px-3 py-1.5 text-[11px] font-medium"
            style={{ color: T.t2, background: T.wellBg, borderColor: T.border }}
          >
            {country.label}
          </span>
          <span
            className="rounded-full border px-3 py-1.5 text-[11px] font-medium"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: T.t3,
              background: T.wellBg,
              borderColor: T.border,
            }}
          >
            {country.currency}
          </span>
          <span
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium"
            style={{ color: T.emHi, background: T.emBg, borderColor: T.emBdr }}
          >
            <span
              className="inline-block h-[5px] w-[5px] rounded-full"
              style={{ background: T.em }}
            />
            Live
          </span>
        </div>
      </div>

      {/* ── KPI row ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={locationLabel}
          value={metricMarkets}
          description={locationDesc}
          tone="emerald"
          visual="bars"
        />
        <MetricCard
          label="Recent Market Movement"
          value={metricActivity}
          description="Recent market activity events and public listing changes."
          tone="emerald"
          visual="dots"
        />
        <MetricCard
          label="Supply Pressure"
          value={metricPressure}
          description="Markets where listing behavior suggests rising pressure."
          tone="amber"
          visual="signal"
        />
        <MetricCard
          label="Agency Footprint"
          value={metricAgency}
          description="Agencies with visible public listing presence in this market."
          tone="neutral"
          visual="bars"
        />
      </div>

      {/* ── Market Pulse ────────────────────────────────────────────────── */}
      <MarketPulse
        totalActiveMarkets={activeMarkets}
        highPressureCount={highPressureCount}
        activityEvents={activityEventCount}
        activePayloadExists={hasActivePayload}
      />

      {/* ── Intelligence lane cards ─────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-3">
        <IntelligenceLane
          icon={Map}
          title={isUae ? "Community Intelligence" : "City / District Intelligence"}
          description={
            isUae
              ? "Public listing concentration and activity signals by community."
              : "Public listing concentration and opportunity density by city and district."
          }
          statLabel={isUae ? "Active communities" : "Active markets"}
          statValue={metricMarkets}
          ctaHref={`${country.routeBase}/communities`}
          ctaText={isUae ? "View communities" : "View cities"}
          tone="emerald"
        />
        <IntelligenceLane
          icon={Gauge}
          title="Supply Pressure"
          description="Markets with visible listing pressure, price drop activity, and opportunity density signals."
          statLabel="Pressure signals"
          statValue={metricPressure}
          ctaHref={`${country.routeBase}/inventory-pressure`}
          ctaText="View pressure signals"
          tone="amber"
        />
        <IntelligenceLane
          icon={Users}
          title="Agency Footprint"
          description="Public agency listing presence, portfolio distribution, and visible listing‑share patterns."
          statLabel="Agency profiles"
          statValue={metricAgency}
          ctaHref={`${country.routeBase}/agency-profiles`}
          ctaText="View agency profiles"
          tone="neutral"
        />
      </div>

      {/* ── Data confidence footer ───────────────────────────────────────── */}
      <DataConfidenceFooter exportedAt={exportTime} sourceCount={sourceCount} />
    </div>
  );
}