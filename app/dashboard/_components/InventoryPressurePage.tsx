// app/dashboard/_components/InventoryPressurePage.tsx
import Link from "next/link";
import type { ElementType } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  Database,
  Gauge,
  ShieldCheck,
  TrendingDown,
  Zap,
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { Module5DataResult, Module5Record } from "@/lib/data/module5";

// ─── Design tokens (graphite-first, amber/rose accents only) ──────────────────
const T = {
  cardBg:  "#0c0c0e",
  wellBg:  "#18181b",
  border:  "rgba(255,255,255,0.07)",
  borderFt:"rgba(255,255,255,0.04)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  em:    "#10b981",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.08)",
  emBdr: "rgba(16,185,129,0.2)",
  am:    "#fbbf24",
  amBg:  "rgba(245,158,11,0.06)",
  amBdr: "rgba(245,158,11,0.14)",
  rd:    "#fb7185",
  rdBg:  "rgba(244,63,94,0.05)",
  rdBdr: "rgba(244,63,94,0.12)",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type InventoryPressurePageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type PressureCard = {
  id: string;
  rank: number | null;
  location: string;
  marketType: string;
  category: string | null;
  activeListings: number | null;
  agencies: number | null;
  avgPrice: number | null;
  pressureScore: number | null;
  pressureLabel: string | null;
  pressureReason: string | null;
  priceDropRate: number | null;
  refreshRate: number | null;
  ownerDirectRate: number | null;
  staleRate: number | null;
  topAgency: string | null;
  topAgencyShare: number | null;
  confidence: string | null;
  action: string | null;
  note: string | null;
};

type MetricTone = "emerald" | "amber" | "rose" | "neutral";

// ─── Data helpers (preserved from original) ───────────────────────────────────
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
function formatLabel(value: string | null): string | null {
  if (!value) return null;
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
function joinParts(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(" · ");
}
function getLocation(country: CountryConfig, record: Module5Record): string {
  if (country.slug === "ksa") {
    return (
      joinParts([
        asString(record.city_display_name) ?? asString(record.city),
        asString(record.district_display_name) ?? asString(record.district),
      ]) || "KSA market"
    );
  }
  return (
    joinParts([
      asString(record.city),
      asString(record.community),
      asString(record.building_name),
    ]) || "UAE market"
  );
}
function normalizePressureCard(
  country: CountryConfig,
  record: Module5Record,
  index: number
): PressureCard {
  return {
    id:
      asString(record.market_key) ||
      asString(record.canonical_market_key) ||
      `${country.slug}-pressure-${index}`,
    rank: asNumber(record.dashboard_rank),
    location: getLocation(country, record),
    marketType:
      formatLabel(asString(record.dashboard_level)) ||
      formatLabel(asString(record.market_level)) ||
      "Market",
    category: formatLabel(asString(record.source_category)),
    activeListings:
      asNumber(record.active_listings) ?? asNumber(record.total_listings),
    agencies:
      asNumber(record.agencies) ??
      asNumber(record.unique_agencies) ??
      asNumber(record.total_agencies),
    avgPrice: asNumber(record.avg_price),
    pressureScore:
      asNumber(record.inventory_pressure_score) ?? asNumber(record.pressure_score),
    pressureLabel:
      formatLabel(asString(record.pressure_label)) ||
      formatLabel(asString(record.pressure_bucket)),
    pressureReason: formatLabel(asString(record.pressure_reason)),
    priceDropRate: asNumber(record.price_drop_rate_pct),
    refreshRate:
      asNumber(record.refresh_inflated_rate_pct) ??
      asNumber(record.refresh_rate_pct),
    ownerDirectRate: asNumber(record.owner_direct_rate_pct),
    staleRate: asNumber(record.stale_rate_pct),
    topAgency: asString(record.top_agency_name),
    topAgencyShare:
      asNumber(record.top_agency_share_pct) ??
      asNumber(record.top3_agency_share_pct) ??
      asNumber(record.top_5_agency_share_pct),
    confidence: formatLabel(asString(record.confidence_tier)),
    action:
      asString(record.recommended_action) ||
      asString(record.pressure_action) ||
      asString(record.recommended_use),
    note:
      asString(record.interpretation_note) ||
      asString(record.explanation) ||
      asString(record.product_note),
  };
}

// ─── Mini visual primitives ───────────────────────────────────────────────────
function MiniBarRail({ count, tone }: { count?: number; tone: MetricTone }) {
  const segments = 12;
  const filled = Math.min(segments, Math.ceil((count ?? 0) / 1000));
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t3;
  const bg = "rgba(255,255,255,0.08)";
  return (
    <div className="flex items-end gap-[2px] h-5 mt-1">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px]"
          style={{
            height: `${8 + (i + 1) * 1.2}px`,
            background: i < filled ? color : bg,
            opacity: i < filled ? 0.7 : 0.25,
          }}
        />
      ))}
    </div>
  );
}
function MiniDotRow({ count, tone }: { count?: number; tone: MetricTone }) {
  const dots = 10;
  const active = Math.min(dots, Math.ceil((count ?? 0) / 500));
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t3;
  return (
    <div className="flex items-center gap-[3px] mt-1">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className="h-[4px] w-[4px] rounded-full"
          style={{ background: i < active ? color : "rgba(255,255,255,0.08)" }}
        />
      ))}
    </div>
  );
}
function MiniSignalWave({ tone }: { tone: MetricTone }) {
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t3;
  return (
    <svg width="44" height="16" viewBox="0 0 44 16" fill="none" aria-hidden="true" className="opacity-50 mt-1">
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
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.02]"
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

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyPressureState({ country, message }: { country: CountryConfig; message: string }) {
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
        {country.label} Inventory Pressure not available
      </h1>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed" style={{ color: T.t3 }}>
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
          style={{ background: "#000", color: T.emHi, fontFamily: "'DM Mono', monospace" }}
        >
          {exportCmd}
        </code>
      </div>
    </div>
  );
}

// ─── KPI metric card ──────────────────────────────────────────────────────────
// Graphite surface with accent top-border only; numbers stay white.
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
  const accentBorder =
    tone === "emerald" ? T.emBdr : tone === "amber" ? T.amBdr : tone === "rose" ? T.rdBdr : "transparent";
  const accentColor =
    tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t4;
  const numVal = parseInt(value.replace(/,/g, ""), 10) || 0;

  return (
    <div
      className="relative rounded-2xl border p-5 transition-shadow hover:shadow-lg hover:shadow-black/20"
      style={{
        background: T.cardBg,
        borderColor: T.border,
        borderTopColor: accentBorder,
        borderTopWidth: "2px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
        {label}
      </p>
      <p
        className="mt-2 font-bold tabular-nums leading-none"
        style={{ color: T.t1, fontSize: "clamp(22px, 2.4vw, 34px)", letterSpacing: "-0.03em" }}
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

// ─── Featured Pressure Pulse ──────────────────────────────────────────────────
// Graphite background with subtle amber radial accent; bars softened.
function PressurePulse({
  totalPressureMarkets,
  priceDropCount,
  staleCount,
}: {
  totalPressureMarkets: number;
  priceDropCount: number;
  staleCount: number;
}) {
  const insights = [
    `${formatNumber(totalPressureMarkets)} markets with visible inventory pressure signals`,
    `${formatNumber(priceDropCount)} records with price‑drop activity`,
    `${formatNumber(staleCount)} records with stale or aged supply indicators`,
  ];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background: `radial-gradient(circle at 20% 70%, rgba(245,158,11,0.04) 0%, transparent 40%), ${T.cardBg}`,
        borderColor: T.border,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <AbstractGrid className="opacity-30" />
      <div className="relative p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
            style={{ background: T.amBg, borderColor: T.amBdr }}
          >
            <Zap className="h-5 w-5" style={{ color: T.am }} />
          </div>
          <div>
            <h2 className="text-[20px] font-bold tracking-tight" style={{ color: T.t1 }}>
              Pressure Pulse
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: T.t3 }}>
              Directional pressure indicators from public listing activity.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: i === 0 ? T.am : i === 1 ? T.rd : T.t3 }}
                />
                <p className="text-[13px] leading-relaxed" style={{ color: T.t2 }}>
                  {insight}
                </p>
              </div>
            ))}
          </div>
          {/* Abstract visual — soft opacity */}
          <div className="hidden sm:flex items-end gap-[3px] h-[80px] opacity-50" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => {
              const h =
                i % 3 === 0
                  ? 0.4 + (priceDropCount % 10) / 25
                  : i % 3 === 1
                    ? 0.3 + (staleCount % 10) / 35
                    : 0.35 + (totalPressureMarkets % 10) / 30;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-[2px]"
                  style={{
                    height: `${Math.min(100, h * 100)}%`,
                    background:
                      i % 3 === 0
                        ? `linear-gradient(to top, ${T.rd}30, ${T.rd}08)`
                        : i % 3 === 1
                          ? `linear-gradient(to top, ${T.am}30, ${T.am}08)`
                          : `linear-gradient(to top, ${T.t3}20, transparent)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pressure Lane Card ───────────────────────────────────────────────────────
// Graphite surfaces with subtle left accent bar instead of full colored borders.
function PressureLaneCard({
  icon: Icon,
  title,
  description,
  statLabel,
  statValue,
  ctaHref,
  ctaText,
  tone = "amber",
}: {
  icon: ElementType;
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  ctaHref?: string;
  ctaText: string;
  tone?: "amber" | "rose" | "neutral";
}) {
  const accentColor = tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t3;
  const iconBg = tone === "amber" ? T.amBg : tone === "rose" ? T.rdBg : "rgba(255,255,255,0.04)";
  const iconBdr = tone === "amber" ? T.amBdr : tone === "rose" ? T.rdBdr : T.border;
  const iconClr = tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t2;

  return (
    <div
      className="flex flex-col rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
      style={{
        background: T.cardBg,
        borderColor: T.border,
        borderLeftWidth: "2px",
        borderLeftColor: accentColor,
        boxShadow: "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
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
          <span className="text-lg font-bold tabular-nums" style={{ color: T.t1, letterSpacing: "-0.025em" }}>
            {statValue}
          </span>
        </div>

        {/* Mini preview strip */}
        <div className="flex items-end gap-[2px] h-6 opacity-35" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px]"
              style={{
                height: `${14 + (i % 4) * 6}px`,
                background: accentColor,
              }}
            />
          ))}
        </div>
      </div>

      <div className="border-t px-6 py-3.5" style={{ borderColor: T.borderFt }}>
        {ctaHref ? (
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-opacity hover:opacity-75"
            style={{ color: tone === "neutral" ? T.t2 : accentColor }}
          >
            {ctaText}
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-[13px] font-medium cursor-not-allowed" style={{ color: T.t4 }}>
            {ctaText}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Pressure Watchlist Card ──────────────────────────────────────────────────
// Kept nearly as-is; strongest section with compact row design.
function PressureWatchCard({ card }: { card: PressureCard }) {
  const pressureLevel =
    card.pressureLabel?.toLowerCase() ?? "";
  const isHigh =
    pressureLevel.includes("high") ||
    pressureLevel.includes("elevated") ||
    pressureLevel.includes("critical");
  const isMedium = pressureLevel.includes("moderate") || pressureLevel.includes("medium");

  const accentColor = isHigh ? T.rd : isMedium ? T.am : T.t3;
  const badgeBg = isHigh ? T.rdBg : isMedium ? T.amBg : "rgba(255,255,255,0.04)";
  const badgeBdr = isHigh ? T.rdBdr : isMedium ? T.amBdr : T.border;
  const badgeText = isHigh ? T.rd : isMedium ? T.am : T.t4;

  return (
    <div
      className="flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors hover:bg-white/[0.03]"
      style={{ background: T.cardBg, borderColor: T.border }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
        style={{ background: badgeBg, borderColor: badgeBdr }}
      >
        <TrendingDown className="h-4 w-4" style={{ color: accentColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate" style={{ color: T.t1 }}>
          {card.location}
        </p>
        <div className="flex flex-wrap gap-2 mt-0.5">
          {card.marketType && (
            <span className="text-[11px]" style={{ color: T.t4 }}>
              {card.marketType}
            </span>
          )}
          {card.pressureLabel && (
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
              style={{ background: badgeBg, color: badgeText, border: `1px solid ${badgeBdr}` }}
            >
              {card.pressureLabel}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-right shrink-0">
        {card.activeListings !== null && (
          <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: T.t4 }}>
              Listings
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: T.t1 }}>
              {formatNumber(card.activeListings)}
            </p>
          </div>
        )}
        {card.pressureScore !== null && (
          <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: T.t4 }}>
              Score
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: accentColor }}>
              {formatNumber(card.pressureScore)}
            </p>
          </div>
        )}
        {card.priceDropRate !== null && (
          <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: T.t4 }}>
              Drop %
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: T.rd }}>
              {formatPercent(card.priceDropRate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Data confidence footer ───────────────────────────────────────────────────
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
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border px-5 py-3 text-[11px]"
      style={{ background: "rgba(255,255,255,0.015)", borderColor: T.borderFt, color: T.t4 }}
    >
      {formattedTime && (
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: T.em }} />
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
        Dashboard‑safe pressure view
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InventoryPressurePage({
  country,
  data,
}: InventoryPressurePageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyPressureState country={country} message={data.message} />;
  }

  const isUae = country.slug === "uae";

  const payload =
    isUae ? data.inventoryPressure : data.inventoryPressureLarge;

  if (!payload || payload.status !== "ready" || payload.items.length === 0) {
    return (
      <EmptyPressureState
        country={country}
        message={`${country.label} Inventory Pressure export loaded, but no usable pressure records were available in the local frontend sample.`}
      />
    );
  }

  const cards: PressureCard[] = payload.items.map((record, index) =>
    normalizePressureCard(country, record, index)
  );
  const visibleCards = cards.slice(0, 6);

  // ── Aggregate metrics ──────────────────────────────────────────────────────
  const totalPressureMarkets = payload.total_rows_available;
  const priceDropCount = cards.filter(
    (c) => c.priceDropRate !== null && c.priceDropRate > 0
  ).length;
  const staleCount = cards.filter(
    (c) => c.staleRate !== null && c.staleRate > 0
  ).length;
  const highPressureCount = cards.filter((c) => {
    const label = `${c.pressureLabel ?? ""} ${c.pressureReason ?? ""}`.toLowerCase();
    return label.includes("high") || label.includes("elevated") || label.includes("critical");
  }).length;

  const metricPressureMarkets = formatNumber(totalPressureMarkets);
  const metricPriceMovement = formatNumber(priceDropCount);
  const metricStaleSupply = formatNumber(staleCount);
  const metricWatchlist = formatNumber(highPressureCount);

  const exportTime = data.manifest.exported_at;
  const sourceCount = Object.keys(data.manifest.exports).length;
  const locationTerm = isUae ? "communities" : "cities/districts";

  return (
    <div className="space-y-6">
      {/* ── Compact hero ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: T.am, background: T.amBg, borderColor: T.amBdr }}
          >
            <Gauge className="h-3 w-3" />
            {country.label} Inventory Pressure
          </div>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: T.t1, letterSpacing: "-0.03em" }}
          >
            Inventory Pressure
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: T.t2 }}>
            Track where public listing supply, stale activity, and price movement are building pressure.
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
            style={{ fontFamily: "'DM Mono', monospace", color: T.t3, background: T.wellBg, borderColor: T.border }}
          >
            {country.currency}
          </span>
          <span
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium"
            style={{ color: T.emHi, background: T.emBg, borderColor: T.emBdr }}
          >
            <span className="inline-block h-[5px] w-[5px] rounded-full" style={{ background: T.em }} />
            Live
          </span>
        </div>
      </div>

      {/* ── KPI row ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Pressure Markets"
          value={metricPressureMarkets}
          description={`Active ${locationTerm} with visible pressure signals.`}
          tone="amber"
          visual="bars"
        />
        <MetricCard
          label="Price Movement"
          value={metricPriceMovement}
          description="Records with recent price‑drop activity."
          tone="rose"
          visual="dots"
        />
        <MetricCard
          label="Stale Supply"
          value={metricStaleSupply}
          description="Records with aged or slow‑moving inventory."
          tone="amber"
          visual="signal"
        />
        <MetricCard
          label="Watchlist Items"
          value={metricWatchlist}
          description="Markets with high/elevated pressure designation."
          tone="rose"
          visual="bars"
        />
      </div>

      {/* ── Featured Pressure Pulse ─────────────────────────────────────── */}
      <PressurePulse
        totalPressureMarkets={totalPressureMarkets}
        priceDropCount={priceDropCount}
        staleCount={staleCount}
      />

      {/* ── Pressure Lanes ───────────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-3">
        <PressureLaneCard
          icon={Building2}
          title="Inventory Build‑up"
          description={`Active listing volume and agency concentration in visible pressure ${locationTerm}.`}
          statLabel="Pressure markets"
          statValue={metricPressureMarkets}
          ctaHref={`${country.routeBase}/market-intelligence`}
          ctaText="View market intelligence"
          tone="amber"
        />
        <PressureLaneCard
          icon={TrendingDown}
          title="Price Movement"
          description="Markets where price reductions are visible in public listing activity."
          statLabel="Records with drops"
          statValue={metricPriceMovement}
          ctaHref={`${country.routeBase}/price-drops`}
          ctaText="View price drops"
          tone="rose"
        />
        <PressureLaneCard
          icon={Activity}
          title="Stale / Refresh Pressure"
          description="Markets with elevated refresh behaviour or aged supply signals."
          statLabel="Stale indicators"
          statValue={metricStaleSupply}
          ctaHref={`${country.routeBase}/listing-age`}
          ctaText="View listing age"
          tone="amber"
        />
      </div>

      {/* ── Pressure Watchlist ────────────────────────────────────────────── */}
      {visibleCards.length > 0 && (
        <div
          className="rounded-2xl border p-6"
          style={{ background: T.cardBg, borderColor: T.border, boxShadow: "0 2px 10px rgba(0,0,0,0.22)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: T.t1 }}>
                Pressure Watchlist
              </h3>
              <p className="mt-1 text-[13px]" style={{ color: T.t3 }}>
                Top {visibleCards.length} {isUae ? "communities/buildings" : "cities/districts"} with visible pressure signals.
              </p>
            </div>
            <span
              className="rounded-full border px-3 py-1 text-[11px] font-medium"
              style={{ color: T.t4, background: T.wellBg, borderColor: T.border }}
            >
              {formatNumber(totalPressureMarkets)} total
            </span>
          </div>
          <div className="space-y-2">
            {visibleCards.map((card) => (
              <PressureWatchCard key={card.id} card={card} />
            ))}
          </div>
          {cards.length > visibleCards.length && (
            <p className="mt-3 text-center text-[12px]" style={{ color: T.t4 }}>
              First {visibleCards.length} of {formatNumber(cards.length)} exported
            </p>
          )}
        </div>
      )}

      {/* ── Data confidence footer ───────────────────────────────────────── */}
      <DataConfidenceFooter exportedAt={exportTime} sourceCount={sourceCount} />
    </div>
  );
}