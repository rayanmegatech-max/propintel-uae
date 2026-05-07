// app/dashboard/_components/AgencyProfilesPage.tsx
import Link from "next/link";
import type { ElementType } from "react";
import {
  ArrowRight,
  Building2,
  Database,
  Eye,
  Map,
  PieChart,
  ShieldCheck,
  Users,
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { Module5DataResult, Module5Record } from "@/lib/data/module5";

// ─── Design tokens (elevated graphite, consistent with other Module 5 pages) ──
const T = {
  cardBg:  "#111318",
  wellBg:  "#181c24",
  border:  "rgba(255,255,255,0.09)",
  borderFt:"rgba(255,255,255,0.05)",
  t1: "#f4f4f5",
  t2: "#b0b1b8",
  t3: "#6b6d75",
  t4: "#5a5c63",
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
type AgencyProfilesPageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type AgencyCard = {
  id: string;
  rank: number | null;
  agencyName: string;
  profileType: string | null;
  activeListings: number | null;
  distinctListings: number | null;
  activeAgents: number | null;
  portals: number | null;
  cities: number | null;
  communities: number | null;
  buildings: number | null;
  avgPrice: number | null;
  topCity: string | null;
  topCommunity: string | null;
  topDistrict: string | null;
  topShare: number | null;
  rentShare: number | null;
  buyShare: number | null;
  commercialShare: number | null;
  priceDropRate: number | null;
  refreshRate: number | null;
  ownerDirectRate: number | null;
  oldInventoryRate: number | null;
  pressureScore: number | null;
  pressureLabel: string | null;
  footprintScore: number | null;
  confidence: string | null;
  interpretation: string | null;
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
function normalizeAgencyCard(
  country: CountryConfig,
  record: Module5Record,
  index: number
): AgencyCard {
  const agencyName =
    asString(record.agency_name) ||
    asString(record.agency_display_name) ||
    asString(record.agency_public_key) ||
    `Unknown ${country.label} agency`;

  return {
    id:
      asString(record.agency_public_key) ||
      asString(record.agency_id) ||
      `${country.slug}-agency-${index}`,
    rank: asNumber(record.dashboard_rank) ?? asNumber(record.agency_rank),
    agencyName,
    profileType:
      formatLabel(asString(record.portfolio_type_label)) ||
      formatLabel(asString(record.dashboard_use_case)) ||
      formatLabel(asString(record.market_size_bucket)),
    activeListings: asNumber(record.active_listings),
    distinctListings: asNumber(record.distinct_listing_keys),
    activeAgents:
      asNumber(record.active_agents) ??
      asNumber(record.unique_agents) ??
      asNumber(record.agents),
    portals: asNumber(record.portals),
    cities: asNumber(record.cities),
    communities: asNumber(record.communities),
    buildings: asNumber(record.buildings),
    avgPrice: asNumber(record.avg_price),
    topCity: asString(record.top_city) ?? asString(record.city),
    topCommunity: asString(record.top_community),
    topDistrict:
      asString(record.district_display_name) ??
      asString(record.district) ??
      asString(record.top_district),
    topShare:
      asNumber(record.top_community_share_pct) ??
      asNumber(record.top_building_share_pct) ??
      asNumber(record.top_agency_share_pct),
    rentShare:
      asNumber(record.residential_rent_share_pct) ??
      asNumber(record.rent_share_pct),
    buyShare:
      asNumber(record.residential_buy_share_pct) ??
      asNumber(record.buy_share_pct),
    commercialShare:
      asNumber(record.commercial_rent_share_pct) ??
      asNumber(record.commercial_buy_share_pct) ??
      asNumber(record.commercial_share_pct),
    priceDropRate: asNumber(record.price_drop_rate_pct),
    refreshRate:
      asNumber(record.refresh_inflated_rate_pct) ??
      asNumber(record.refresh_rate_pct),
    ownerDirectRate: asNumber(record.owner_direct_rate_pct),
    oldInventoryRate: asNumber(record.old_inventory_rate_pct),
    pressureScore:
      asNumber(record.portfolio_pressure_score) ??
      asNumber(record.inventory_pressure_score) ??
      asNumber(record.pressure_score),
    pressureLabel:
      formatLabel(asString(record.portfolio_pressure_label)) ||
      formatLabel(asString(record.pressure_bucket)) ||
      formatLabel(asString(record.inventory_status_label)),
    footprintScore:
      asNumber(record.footprint_score) ?? asNumber(record.activity_score),
    confidence: formatLabel(asString(record.confidence_tier)),
    interpretation:
      asString(record.recommended_interpretation) ||
      asString(record.interpretation_note) ||
      asString(record.pressure_action),
    note:
      asString(record.explanation) ||
      asString(record.product_note) ||
      asString(record.dashboard_use_case),
  };
}

// ─── Mini visual primitives (consistent with other pages) ─────────────────────
function MiniBarRail({ count, tone }: { count?: number; tone: MetricTone }) {
  const segments = 12;
  const filled = Math.min(segments, Math.ceil((count ?? 0) / 1000));
  const color =
    tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t3;
  const bg = "rgba(255,255,255,0.1)";
  return (
    <div className="flex items-end gap-[2px] h-5 mt-1">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px]"
          style={{
            height: `${8 + (i + 1) * 1.2}px`,
            background: i < filled ? color : bg,
            opacity: i < filled ? 0.85 : 0.35,
          }}
        />
      ))}
    </div>
  );
}
function MiniDotRow({ count, tone }: { count?: number; tone: MetricTone }) {
  const dots = 10;
  const active = Math.min(dots, Math.ceil((count ?? 0) / 500));
  const color =
    tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t3;
  return (
    <div className="flex items-center gap-[3px] mt-1">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className="h-[4px] w-[4px] rounded-full"
          style={{ background: i < active ? color : "rgba(255,255,255,0.1)" }}
        />
      ))}
    </div>
  );
}
function MiniSignalWave({ tone }: { tone: MetricTone }) {
  const color =
    tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t3;
  return (
    <svg width="44" height="16" viewBox="0 0 44 16" fill="none" aria-hidden="true" className="opacity-60 mt-1">
      <path
        d="M0 12 L4 10 L8 12 L12 6 L16 8 L20 4 L24 6 L28 2 L32 4 L36 1 L40 3 L44 0"
        stroke={color}
        strokeWidth="1.3"
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
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "18px 18px",
        }}
      />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyAgencyState({
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
        {country.label} Agency Profiles not available
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

// ─── KPI metric card (elevated surface, absolute top accent bar) ──────────────
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
  const accentColor =
    tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t4;
  const numVal = parseInt(value.replace(/,/g, ""), 10) || 0;

  return (
    <div
      className="relative rounded-2xl border p-5 transition-shadow hover:shadow-lg hover:shadow-black/20"
      style={{
        background: T.cardBg,
        borderColor: T.border,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
        style={{ background: accentColor }}
      />
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>
        {label}
      </p>
      <p
        className="mt-2 font-bold tabular-nums leading-none"
        style={{ color: T.t1, fontSize: "clamp(24px, 2.6vw, 36px)", letterSpacing: "-0.03em" }}
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

// ─── Agency Footprint Pulse featured card ──────────────────────────────────────
function AgencyFootprintPulse({
  totalRows,
  footprintSignals,
  pressureSignals,
  averageListings,
}: {
  totalRows: number;
  footprintSignals: number;
  pressureSignals: number;
  averageListings: number | null;
}) {
  const insights = [
    `${formatNumber(totalRows)} agency profiles in this export`,
    `${formatNumber(footprintSignals)} agencies with footprint scoring`,
    `${formatNumber(pressureSignals)} agencies with pressure context`,
    averageListings !== null
      ? `Average active listings per agency: ${formatNumber(averageListings)}`
      : null,
  ].filter(Boolean);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background: `radial-gradient(circle at 30% 60%, rgba(245,158,11,0.06) 0%, transparent 45%), ${T.cardBg}`,
        borderColor: T.border,
        boxShadow: "0 6px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <AbstractGrid className="opacity-30" />
      <div className="relative p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
            style={{ background: T.amBg, borderColor: T.amBdr }}
          >
            <Eye className="h-5 w-5" style={{ color: T.am }} />
          </div>
          <div>
            <h2 className="text-[22px] font-bold tracking-tight" style={{ color: T.t1 }}>
              Agency Footprint Pulse
            </h2>
            <p className="mt-1.5 text-[14px]" style={{ color: T.t3 }}>
              Public agency listing footprint and portfolio context.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                  style={{
                    background:
                      i === 0 ? T.am : i === 1 ? T.em : i === 2 ? T.rd : T.t3,
                  }}
                />
                <p className="text-[13px] leading-relaxed" style={{ color: T.t2 }}>
                  {insight}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden sm:flex items-end gap-[4px] h-[80px] opacity-60" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => {
              const h =
                i % 3 === 0
                  ? 0.5 + (footprintSignals % 10) / 20
                  : i % 3 === 1
                    ? 0.3 + (pressureSignals % 10) / 30
                    : 0.35 + (totalRows % 10) / 35;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-[2px]"
                  style={{
                    height: `${Math.min(100, h * 100)}%`,
                    background:
                      i % 3 === 0
                        ? `linear-gradient(to top, ${T.em}40, ${T.em}10)`
                        : i % 3 === 1
                          ? `linear-gradient(to top, ${T.rd}40, ${T.rd}10)`
                          : `linear-gradient(to top, ${T.am}40, ${T.am}10)`,
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

// ─── Agency Lane Card (absolute left bar, no border conflicts) ─────────────────
function AgencyLaneCard({
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
  ctaHref?: string;
  ctaText: string;
  tone?: "emerald" | "amber" | "rose" | "neutral";
}) {
  const accentColor = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t3;
  const iconBg = tone === "emerald" ? T.emBg : tone === "amber" ? T.amBg : tone === "rose" ? T.rdBg : "rgba(255,255,255,0.04)";
  const iconBdr = tone === "emerald" ? T.emBdr : tone === "amber" ? T.amBdr : tone === "rose" ? T.rdBdr : T.border;
  const iconClr = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : T.t2;

  return (
    <div
      className="relative flex flex-col rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
      style={{
        background: T.cardBg,
        borderColor: T.border,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <span
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl"
        style={{ background: accentColor }}
      />
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

        <div className="flex items-end gap-[2px] h-6 opacity-40" aria-hidden="true">
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

      <div className="border-t px-6 py-3.5" style={{ borderColor: T.border }}>
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

// ─── Agency Watchlist Row (refined spacing, clearer metrics) ──────────────────
function AgencyWatchCard({ card }: { card: AgencyCard }) {
  const pressureLevel = (card.pressureLabel ?? "").toLowerCase();
  const isHigh = pressureLevel.includes("high") || pressureLevel.includes("elevated") || pressureLevel.includes("critical");
  const isModerate = pressureLevel.includes("moderate") || pressureLevel.includes("medium");

  const accentColor = isHigh ? T.rd : isModerate ? T.am : T.t3;
  const badgeBg = isHigh ? T.rdBg : isModerate ? T.amBg : "rgba(255,255,255,0.06)";
  const badgeBdr = isHigh ? T.rdBdr : isModerate ? T.amBdr : T.border;
  const badgeText = isHigh ? T.rd : isModerate ? T.am : T.t4;

  return (
    <div
      className="flex items-center gap-5 rounded-xl border px-4 py-3 transition-colors hover:bg-white/[0.03]"
      style={{ background: T.cardBg, borderColor: T.border }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
        style={{ background: badgeBg, borderColor: badgeBdr }}
      >
        <Building2 className="h-4 w-4" style={{ color: accentColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold truncate" style={{ color: T.t1 }}>
          {card.agencyName}
        </p>
        <div className="flex flex-wrap gap-2 mt-0.5">
          {card.profileType && (
            <span className="text-[11px]" style={{ color: T.t4 }}>
              {card.profileType}
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
          {card.topCity && (
            <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: T.t3 }}>
              <Map className="h-3 w-3" />
              {card.topCity}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6 text-right shrink-0">
        {card.activeListings !== null && (
          <div className="w-[64px]">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: T.t4 }}>
              Listings
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: T.t1 }}>
              {formatNumber(card.activeListings)}
            </p>
          </div>
        )}
        {card.footprintScore !== null && (
          <div className="w-[64px]">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: T.t4 }}>
              Footprint
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: T.em }}>
              {formatNumber(card.footprintScore)}
            </p>
          </div>
        )}
        {card.pressureScore !== null && (
          <div className="w-[64px]">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: T.t4 }}>
              Pressure
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: accentColor }}>
              {formatNumber(card.pressureScore)}
            </p>
          </div>
        )}
        {card.topShare !== null && (
          <div className="w-[64px] hidden sm:block">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: T.t4 }}>
              Top Share
            </p>
            <p className="text-sm font-bold tabular-nums" style={{ color: T.t1 }}>
              {formatPercent(card.topShare)}
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
      style={{ background: "rgba(255,255,255,0.02)", borderColor: T.border, color: T.t4 }}
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
        Dashboard‑safe agency view
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AgencyProfilesPage({
  country,
  data,
}: AgencyProfilesPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyAgencyState country={country} message={data.message} />;
  }

  const isUae = country.slug === "uae";
  const payload = isUae ? data.agencyProfiles : data.agencyProfilesMajor;

  if (!payload || payload.status !== "ready" || payload.items.length === 0) {
    return (
      <EmptyAgencyState
        country={country}
        message={`${country.label} Agency Profile export loaded, but no usable agency records were available.`}
      />
    );
  }

  const cards: AgencyCard[] = payload.items.map((record, index) =>
    normalizeAgencyCard(country, record, index)
  );
  const visibleCards = cards.slice(0, 6);

  // ── Aggregate metrics ──────────────────────────────────────────────────────
  const totalAgencyRows = payload.total_rows_available;
  const withFootprintScore = cards.filter((c) => c.footprintScore !== null).length;
  const withPressureScore = cards.filter((c) => c.pressureScore !== null).length;

  const totalListings = cards.reduce((sum, c) => sum + (c.activeListings ?? 0), 0);
  const averageListings = cards.length > 0 ? totalListings / cards.length : null;

  const highPressureCount = cards.filter((c) => {
    const label = (c.pressureLabel ?? "").toLowerCase();
    return label.includes("high") || label.includes("elevated") || label.includes("critical");
  }).length;

  const metricAgencyProfiles = formatNumber(totalAgencyRows);
  const metricActivePortfolio = formatNumber(totalListings);
  const metricFootprintSignals = formatNumber(withFootprintScore);
  const metricPressureWatch = formatNumber(highPressureCount || withPressureScore);

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
            <Users className="h-3 w-3" />
            {country.label} Agency Profiles
          </div>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: T.t1, letterSpacing: "-0.03em" }}
          >
            Agency Profiles
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: T.t2 }}>
            Review visible agency footprint, portfolio distribution, and market coverage from public listings.
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
          label="Agency Profiles"
          value={metricAgencyProfiles}
          description={`Agency records available in ${locationTerm}.`}
          tone="neutral"
          visual="bars"
        />
        <MetricCard
          label="Active Portfolio"
          value={metricActivePortfolio}
          description="Total active listings across all profiled agencies."
          tone="emerald"
          visual="bars"
        />
        <MetricCard
          label="Footprint Signals"
          value={metricFootprintSignals}
          description="Agencies with footprint scoring in this export."
          tone="emerald"
          visual="dots"
        />
        <MetricCard
          label="Pressure Watch"
          value={metricPressureWatch}
          description="Agencies flagged with elevated portfolio pressure."
          tone="amber"
          visual="signal"
        />
      </div>

      {/* ── Agency Footprint Pulse featured section ─────────────────────── */}
      <AgencyFootprintPulse
        totalRows={totalAgencyRows}
        footprintSignals={withFootprintScore}
        pressureSignals={highPressureCount || withPressureScore}
        averageListings={averageListings}
      />

      {/* ── Agency intelligence lanes ───────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-3">
        <AgencyLaneCard
          icon={Users}
          title="Portfolio Visibility"
          description="Agency-level public listing footprint, listing volume, and category presence."
          statLabel="Active listings"
          statValue={metricActivePortfolio}
          ctaHref={`${country.routeBase}/agency-profiles`}
          ctaText="View profiles"
          tone="emerald"
        />
        <AgencyLaneCard
          icon={Map}
          title="Market Coverage"
          description="Geographic spread and market presence across cities and communities."
          statLabel="Footprint agencies"
          statValue={metricFootprintSignals}
          ctaHref={`${country.routeBase}/market-dominance`}
          ctaText="View market presence"
          tone="neutral"
        />
        <AgencyLaneCard
          icon={PieChart}
          title="Category Mix"
          description="Rental, purchase, and commercial listing composition across agency portfolios."
          statLabel="Pressure watch"
          statValue={metricPressureWatch}
          ctaHref={`${country.routeBase}/market-intelligence`}
          ctaText="View market intelligence"
          tone="amber"
        />
      </div>

      {/* ── Agency Watchlist ─────────────────────────────────────────────── */}
      {visibleCards.length > 0 && (
        <div
          className="rounded-2xl border p-6"
          style={{ background: T.cardBg, borderColor: T.border, boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: T.t1 }}>
                Agency Watchlist
              </h3>
              <p className="mt-1 text-[13px]" style={{ color: T.t3 }}>
                Top {visibleCards.length} agencies with visible public footprint signals.
              </p>
            </div>
            <span
              className="rounded-full border px-3 py-1 text-[11px] font-medium"
              style={{ color: T.t4, background: T.wellBg, borderColor: T.border }}
            >
              {formatNumber(totalAgencyRows)} total
            </span>
          </div>
          <div className="space-y-2">
            {visibleCards.map((card) => (
              <AgencyWatchCard key={card.id} card={card} />
            ))}
          </div>
          {cards.length > visibleCards.length && (
            <p className="mt-4 text-center text-[12px]" style={{ color: T.t4 }}>
              First {visibleCards.length} of {formatNumber(cards.length)} exported
            </p>
          )}
        </div>
      )}

      {/* ── Data confidence footer ──────────────────────────────────────── */}
      <DataConfidenceFooter exportedAt={exportTime} sourceCount={sourceCount} />
    </div>
  );
}