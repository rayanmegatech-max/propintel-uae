// app/dashboard/_components/ListingTruthRadarPage.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Clock3,
  Globe2,
  Layers,
  RefreshCcw,
  ShieldCheck,
  Timer,
  TrendingDown,
} from "lucide-react";
import { formatNumber } from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { KsaReconDataResult } from "@/lib/data/ksaRecon";
import type { UaeReconDataResult } from "@/lib/data/uaeRecon";
import type { NormalizedReconOpportunity } from "@/lib/recon/types";

// ─── Render cap to keep static/ISR payload under Vercel limits ────────────────
const LISTING_TRUTH_RENDER_LIMIT = 150;

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  t1: "#ffffff",
  t2: "#e4e4e7",
  t3: "#a1a1aa",
  t4: "#71717a",
  em: "#10b981",
  emHi: "#34d399",
  cy: "#06b6d4",
  cyHi: "#22d3ee",
  am: "#fbbf24",
  amHi: "#fcd34d",
  rd: "#fb7185",
  rdHi: "#f43f5e",
  border: "rgba(255,255,255,0.06)",
  borderSub: "rgba(255,255,255,0.04)",
  vi: "#8b5cf6",
  viHi: "#a78bfa",
} as const;

export type ListingTruthRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

// ─── Type Helpers ─────────────────────────────────────────────────────────
function getNumberField(record: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const val = record[key];
    if (typeof val === "number") {
      return val;
    }
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function getBooleanField(record: Record<string, unknown>, keys: string[]): boolean {
  for (const key of keys) {
    const val = record[key];
    if (val === true || val === 1 || val === "true" || val === "1") return true;
  }
  return false;
}

function formatCurrencyCompact(value: number, currency: string): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ${currency}`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k ${currency}`;
  return `${value} ${currency}`;
}

function formatTruthLocation(value: string | null | undefined): string {
  if (!value) return "Unknown Location";

  return value
    .replace(/\|+/g, " · ")
    .replace(/\s*-\s*/g, " · ")
    .replace(/\s*\/\s*/g, " · ")
    .replace(/\s+/g, " ")
    .replace(/\s+·\s+/g, " · ")
    .trim();
}

function formatTruthPropertyType(value: string | null | undefined): string | undefined {
  if (!value) return undefined;

  const cleaned = value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const lower = cleaned.toLowerCase();

  // KSA/portal land labels are often inconsistent.
  // Do not show "Residential Lands" as a product type in this UI.
  if (
    lower === "residential lands" ||
    lower === "residential land" ||
    lower === "lands" ||
    lower === "land"
  ) {
    return "Land";
  }

  if (lower === "commercial lands" || lower === "commercial land") {
    return "Land";
  }

  return cleaned
    .split(" ")
    .map((part) => part.length > 0 ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part)
    .join(" ");
}

function cleanTruthTitle(item: NormalizedReconOpportunity): string {
  const title = item.title || item.subtitle || "";
  const location = formatTruthLocation(item.locationLabel);

  const lower = title.toLowerCase();

  if (
    lower.includes("severe refresh inflation detected in") ||
    lower.includes("refresh inflation detected in") ||
    lower.includes("refresh signal") ||
    lower.includes("aged inventory")
  ) {
    return location;
  }

  return title || location;
}

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="truth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#truth-grid)" />
      </svg>
    </div>
  );
}

// ─── Components ─────────────────────────────────────────────────────────────

function SnapshotCard({
  title,
  description,
  value,
  icon,
  accentColor,
  href,
  ctaLabel,
  disabled,
}: {
  title: string;
  description: string;
  value?: string | number;
  icon: React.ReactNode;
  accentColor: string;
  href: string;
  ctaLabel?: string;
  disabled?: boolean;
}) {
  return (
    <Link
      href={disabled ? "#" : href}
      className={`group relative flex flex-col h-full rounded-[16px] border p-5 transition-all duration-300 ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-lg"
      }`}
      style={{
        background: "rgba(255, 255, 255, 0.015)",
        borderColor: C.borderSub,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      {!disabled && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-60 transition-all duration-300"
            style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
          />
          <div
            className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
            style={{ background: accentColor }}
          />
        </>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3.5 mb-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-inner transition-colors duration-300"
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
              borderColor: "rgba(255,255,255,0.1)",
              color: disabled ? C.t4 : accentColor,
            }}
          >
            {icon}
          </div>
          {value !== undefined && (
            <span className="text-[18px] font-black tabular-nums tracking-tight text-white mt-1">
              {value}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0 mb-3">
          <h3 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2 mb-1">
            {title}
            {disabled && (
              <span className="text-[9px] uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded shadow-inner">
                Limited
              </span>
            )}
          </h3>
          <p className="text-[13px] leading-relaxed font-medium" style={{ color: C.t3 }}>
            {description}
          </p>
        </div>

        <div 
          className="mt-auto flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-transform group-hover:translate-x-0.5" 
          style={{ color: disabled ? C.t4 : accentColor }}
        >
          {disabled ? "Unavailable" : ctaLabel ?? "Open Workspace"}
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}

function IntelligencePanel({
  title,
  purpose,
  agentUseText,
  chips,
  icon,
  accentColor,
  primaryAction,
}: {
  title: string;
  purpose: string;
  agentUseText: string;
  chips: string[];
  icon: React.ReactNode;
  accentColor: string;
  primaryAction: { label: string; onClick: () => void };
}) {
  return (
    <article
      className="relative overflow-hidden rounded-[20px] border shadow-md"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,27,0.4) 0%, rgba(9,9,11,0.6) 100%)",
        borderColor: C.border,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-1.5 h-full opacity-80"
        style={{ background: accentColor }}
      />
      <div
        className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-10"
        style={{ background: accentColor }}
      />

      <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10" style={{ color: accentColor }}>
              {icon}
            </div>
            <h2 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight text-white">
              {title}
            </h2>
          </div>

          <p className="text-[13.5px] leading-relaxed font-medium mb-3 pl-1" style={{ color: C.t2 }}>
            {purpose}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3.5 pl-1">
            {chips.map((chip) => (
              <span 
                key={chip} 
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm" 
                style={{ 
                  color: accentColor, 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.06)" 
                }}
              >
                {chip}
              </span>
            ))}
          </div>
          
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-black/20 border border-white/5 shadow-inner">
            <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
            <p className="text-[13px] leading-relaxed font-medium" style={{ color: C.t3 }}>
              <span className="text-white font-bold mr-1.5">Agent Workflow:</span>
              {agentUseText}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 md:min-w-[180px] shrink-0 mt-2 md:mt-0">
          <button
            onClick={primaryAction.onClick}
            className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-[13px] font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px shadow-sm"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {primaryAction.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function MetricPill({ 
  label, 
  value, 
  tone = "neutral", 
  truncate = false 
}: { 
  label: string; 
  value: string | number; 
  tone?: "neutral" | "rd" | "am" | "cy" | "em" | "vi";
  truncate?: boolean;
}) {
  const colors = {
    neutral: { text: C.t1, bg: "rgba(255,255,255,0.03)", border: C.borderSub },
    rd: { text: C.rdHi, bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)" },
    am: { text: C.amHi, bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
    cy: { text: C.cyHi, bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)" },
    em: { text: C.emHi, bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
    vi: { text: C.viHi, bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)" },
  };
  const c = colors[tone];

  return (
    <div className="flex flex-col gap-0.5 rounded-lg px-2.5 py-1.5 border" style={{ background: c.bg, borderColor: c.border }}>
      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>{label}</span>
      <span 
        className={`text-[12px] font-bold tabular-nums ${truncate ? "max-w-[110px] truncate" : ""}`} 
        style={{ color: c.text }} 
        title={typeof value === 'string' ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function TruthCard({ item, idx, routeBase, currency }: { item: NormalizedReconOpportunity; idx: number; routeBase: string; currency: string }) {
  const raw = item.raw;
  const rank = idx + 1;

  const trueAge = getNumberField(raw, ["effective_true_age_days"]);
  const isRefresh = getBooleanField(raw, ["is_refresh_inflated", "is_refresh_inflation"]) || item.signalBadges?.some(b => b.label.toLowerCase().includes("refresh"));
  const isSevere = getBooleanField(raw, ["is_severe_refresh_inflation"]) || item.signalBadges?.some(b => b.label.toLowerCase().includes("severe"));
  const isStale = getBooleanField(raw, ["is_stale", "is_old_inventory", "is_very_old_inventory"]) || (trueAge !== undefined && trueAge > 60) || item.signalBadges?.some(b => b.label.toLowerCase().includes("stale") || b.label.toLowerCase().includes("aged"));
  
  const priceDropRate = getNumberField(raw, ["drop_pct", "price_drop_rate_pct"]) ?? item.dropPct;
  const isPriceDrop = priceDropRate && priceDropRate > 0;

  const agentName = item.agentName;
  const agencyName = item.agencyName;

  // Truth Read
  let truthRead = "Use this record as public listing-evidence context before acting.";
  if (isSevere) {
    truthRead = "Public listing evidence suggests severe refresh inflation. Verify the current source listing before treating this as fresh inventory.";
  } else if (isRefresh) {
    truthRead = "This listing shows refresh/repost-style activity. Portal freshness may not represent true time-on-market.";
  } else if (isStale && isPriceDrop) {
    truthRead = "Aged inventory with price movement may indicate a stronger negotiation or follow-up opportunity.";
  } else if (isStale) {
    truthRead = "This listing appears aged in the public snapshot. Review price movement and agent context before outreach.";
  }

  // Why this matters
  let actionText = "Use this signal to verify whether a listing is truly fresh before outreach or pricing decisions.";
  if (isSevere) {
    actionText = "Verify source freshness before treating this as newly available inventory.";
  } else if (isRefresh) {
    actionText = "Agents can use this to avoid wasting time on listings that only appear newly refreshed.";
  } else if (isStale && isPriceDrop) {
    actionText = "Aged inventory plus price movement can point to repricing context, but source verification is required.";
  }

  // Pills
  const pillsToRender = [];
  if (trueAge !== undefined) pillsToRender.push({ label: "Observed Age", value: `${trueAge} days`, tone: "am" as const });
  if (item.portal) pillsToRender.push({ label: "Portal", value: item.portal, tone: "neutral" as const });
  
  if (item.price !== null) {
    pillsToRender.push({
      label: item.priceLabel || "Price",
      value: formatCurrencyCompact(item.price, currency),
      tone: "neutral" as const,
    });
  }
  
  if (priceDropRate && priceDropRate > 0) pillsToRender.push({ label: "Drop", value: `${priceDropRate}%`, tone: "rd" as const });
  
  const displayPropertyType = formatTruthPropertyType(item.propertyType);
  if (displayPropertyType) pillsToRender.push({ label: "Type", value: displayPropertyType, tone: "neutral" as const });

  const finalPills = pillsToRender.slice(0, 5);
  
  const toneColor = isSevere ? C.rdHi : isRefresh ? C.viHi : isStale ? C.amHi : C.cyHi;
  const badgeLabel = isSevere ? "Severe Refresh" : isRefresh ? "Refresh Inflation" : isStale ? "Aged Inventory" : "Truth Signal";

  const displayTitle = cleanTruthTitle(item);
  const formattedLocation = formatTruthLocation(item.locationLabel);

  return (
    <article
      className="group relative flex flex-col rounded-[20px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(24,24,27,0.48) 0%, rgba(9,9,11,0.72) 100%)`,
        borderColor: "rgba(255,255,255,0.065)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-50 transition-all duration-300 z-10" 
        style={{ background: toneColor, boxShadow: `0 0 10px ${toneColor}` }} 
      />

      <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-[70px] opacity-[0.08] pointer-events-none z-0" style={{ background: toneColor }} />

      <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-10">
        
        {/* Top Row: Rank & Type */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="rounded px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-widest"
            style={{ color: toneColor, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderSub}` }}
          >
            #{rank}
          </span>
          <span 
            className="inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest leading-none shadow-sm"
            style={{
              color: C.t2,
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              borderColor: "rgba(255,255,255,0.15)",
            }}
          >
            {badgeLabel}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[16px] font-extrabold text-white tracking-tight mb-1">
          {displayTitle}
        </h3>
        
        {displayTitle !== formattedLocation && formattedLocation && formattedLocation !== "Unknown Location" && (
          <p className="text-[12px] font-bold mb-4" style={{ color: C.t4 }}>
            {formattedLocation}
          </p>
        )}

        {/* Agency/Agent */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 rounded-lg border p-3 mb-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
          <span className="block text-[13px] font-bold leading-relaxed text-white line-clamp-2" title={agencyName || "Agency not listed"}>
            {agencyName || "Agency not listed"}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider shrink-0" style={{ color: C.t4 }}>
            {agentName || "Agent not listed"}
          </span>
        </div>
        
        {/* Metric Pills Row */}
        {finalPills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {finalPills.map((p, i) => (
              <MetricPill key={i} label={p.label} value={p.value} tone={p.tone} />
            ))}
          </div>
        )}
        
        {truthRead && (
          <p className="text-[13px] leading-relaxed font-medium mb-3" style={{ color: C.t3 }}>
            {truthRead}
          </p>
        )}

        {/* Action Box */}
        <div className="mt-auto mb-5 rounded-xl border p-3.5" style={{ background: "rgba(0,0,0,0.18)", borderColor: C.borderSub }}>
          <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: toneColor }}>
            Why this matters
          </span>
          <p className="text-[12.5px] leading-relaxed font-medium" style={{ color: C.t2 }}>
            {actionText}
          </p>
        </div>

        {/* Footer Row (CTA) */}
        <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: C.borderSub }}>
          {item.listingUrl ? (
            <a
              href={item.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
              style={{ color: C.t4 }}
            >
              Verify Source
            </a>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>
              Source Unavailable
            </span>
          )}
          
          <Link
            href={`${routeBase}/inventory-pressure`}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: toneColor }}
          >
            Review Supply Pressure
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function ListingTruthRadarPage({
  country,
  data,
}: ListingTruthRadarPageProps) {
  const isUae = country.slug === "uae";
  
  const [activeLane, setActiveLane] = useState<"all" | "refresh" | "aged" | "stale">("all");

  const allNormalized = useMemo(() => {
    const seenIds = new Set<string>();
    const results: NormalizedReconOpportunity[] = [];

    function addItems(items: Record<string, unknown>[] | undefined | null, sourceTable?: string | null) {
      if (!items || items.length === 0) return;
      const normalized = normalizeReconList(items, country.slug, sourceTable ?? null);
      for (const item of normalized) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          results.push(item);
        }
      }
    }

    if (isUae) {
      const uData = data as UaeReconDataResult;
      addItems(uData.lists.listingTruth?.items as Record<string, unknown>[] | undefined, uData.lists.listingTruth?.source_table);
      addItems(uData.lists.refreshInflated?.items as Record<string, unknown>[] | undefined, uData.lists.refreshInflated?.source_table);
      addItems(uData.lists.stalePriceDrops?.items as Record<string, unknown>[] | undefined, uData.lists.stalePriceDrops?.source_table);
    } else {
      const kData = data as KsaReconDataResult;
      addItems(kData.lists.refreshInflation?.items as Record<string, unknown>[] | undefined, kData.lists.refreshInflation?.source_table);
    }

    return results;
  }, [country.slug, data, isUae]);

  const filteredItems = useMemo(() => {
    return allNormalized.filter(item => {
      if (activeLane === "all") return true;
      
      const raw = item.raw;
      const trueAge = getNumberField(raw, ["effective_true_age_days"]);
      const isRefresh = getBooleanField(raw, ["is_refresh_inflated", "is_refresh_inflation"]) || item.signalBadges?.some(b => b.label.toLowerCase().includes("refresh"));
      const isStale = getBooleanField(raw, ["is_stale", "is_old_inventory", "is_very_old_inventory"]) || (trueAge !== undefined && trueAge > 60) || item.signalBadges?.some(b => b.label.toLowerCase().includes("stale") || b.label.toLowerCase().includes("aged"));
      const dropPct = getNumberField(raw, ["drop_pct", "price_drop_rate_pct"]) ?? item.dropPct ?? 0;

      if (activeLane === "refresh") return isRefresh;
      if (activeLane === "aged") return isStale;
      if (activeLane === "stale") return isStale && dropPct > 0;
      return true;
    });
  }, [allNormalized, activeLane]);

  const visibleCards = filteredItems.slice(0, LISTING_TRUTH_RENDER_LIMIT);

  // Overview Metrics
  const totalSignalsCount = allNormalized.length;
  
  const refreshSignalsCount = allNormalized.filter(item => {
    const raw = item.raw;
    return getBooleanField(raw, ["is_refresh_inflated", "is_refresh_inflation"]) || item.signalBadges?.some(b => b.label.toLowerCase().includes("refresh"));
  }).length;

  const agedListingsCount = allNormalized.filter(item => {
    const raw = item.raw;
    const trueAge = getNumberField(raw, ["effective_true_age_days"]);
    return getBooleanField(raw, ["is_stale", "is_old_inventory", "is_very_old_inventory"]) || (trueAge !== undefined && trueAge > 60) || item.signalBadges?.some(b => b.label.toLowerCase().includes("stale") || b.label.toLowerCase().includes("aged"));
  }).length;

  const severeRefreshCount = allNormalized.filter(item => {
    const raw = item.raw;
    return getBooleanField(raw, ["is_severe_refresh_inflation"]) || item.signalBadges?.some(b => b.label.toLowerCase().includes("severe"));
  }).length;

  if (allNormalized.length === 0) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        <section
          className="relative rounded-[28px] border overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.9) 100%)",
            borderColor: "rgba(255,255,255,0.06)",
            boxShadow: "0 24px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <GridPattern />
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
          
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
                style={{ color: C.viHi, background: "rgba(139,92,246,0.1)", border: `1px solid rgba(139,92,246,0.2)` }}
              >
                <Clock3 className="h-3.5 w-3.5" />
                Listing Truth
              </span>
            </div>

            <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
              No listing truth signals available
            </h1>
            
            <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
              No listing truth signals are available in this workspace snapshot.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                href={`${country.routeBase}/activity-feed`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
                style={{ 
                  background: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)", 
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(139,92,246,0.25)" 
                }}
              >
                Open Recent Market Movement
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              
              <Link
                href={`${country.routeBase}/inventory-pressure`}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
                style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                Open Supply Pressure
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section
        className="relative rounded-[28px] border overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.9) 100%)",
          borderColor: "rgba(255,255,255,0.06)",
          boxShadow: "0 24px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        <GridPattern />
        
        {/* Ambient hero glows */}
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.viHi, background: "rgba(139,92,246,0.1)", border: `1px solid rgba(139,92,246,0.2)` }}
            >
              <Clock3 className="h-3.5 w-3.5" />
              Listing Truth
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            What Is the Real Listing Age?
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Review public listing evidence for refresh inflation, aged inventory, repost-style activity, and time-on-market signals before trusting portal freshness.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                document.getElementById('truth-list')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(139,92,246,0.25)" 
              }}
            >
              Review Truth Signals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            
            <Link
              href={`${country.routeBase}/inventory-pressure`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Review Supply Pressure
            </Link>

            <Link
              href={`${country.routeBase}/activity-feed`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Recent Market Movement
            </Link>

            <Link
              href={`${country.routeBase}/price-drops`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Price Drops
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Truth Overview Cards ─────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.viHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Truth Overview
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Truth Signals"
            value={formatNumber(totalSignalsCount)}
            description="Total visible items analyzed."
            icon={<ShieldCheck className="h-5 w-5" />}
            accentColor={C.cyHi}
            href="#truth-list"
            ctaLabel="View Signals"
          />
          <SnapshotCard
            title="Refresh Signals"
            value={formatNumber(refreshSignalsCount)}
            description="Items with refresh or inflation activity."
            icon={<RefreshCcw className="h-5 w-5" />}
            accentColor={C.viHi}
            href="#truth-list"
            ctaLabel="Review Refresh"
          />
          <SnapshotCard
            title="Aged Listings"
            value={formatNumber(agedListingsCount)}
            description="Items identified as older inventory."
            icon={<Clock className="h-5 w-5" />}
            accentColor={C.amHi}
            href="#truth-list"
            ctaLabel="Find Aged Supply"
          />
          <SnapshotCard
            title="Severe Refresh"
            value={formatNumber(severeRefreshCount)}
            description="Listings with stronger refresh-inflation signals."
            icon={<TrendingDown className="h-5 w-5" />}
            accentColor={C.rdHi}
            href="#truth-list"
            ctaLabel="Check Flags"
          />
        </div>
      </section>

      {/* ── 3. Insight Panels ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Truth Intelligence
          </h2>
        </div>

        <IntelligencePanel
          title="Refresh Inflation"
          purpose="Find listings where portal freshness may not reflect true market age."
          agentUseText="Use this to avoid wasting time on listings that only appear newly refreshed."
          chips={["Refresh activity", "Repost signals", "Portal freshness"]}
          icon={<RefreshCcw className="h-5 w-5" />}
          accentColor={C.viHi}
          primaryAction={{ label: "View Refresh Signals", onClick: () => setActiveLane("refresh") }}
        />

        <IntelligencePanel
          title="True Listing Age"
          purpose="Identify older inventory, aged records, and time-on-market context."
          agentUseText="Use this to find stale inventory that might present a farming or follow-up opportunity."
          chips={["Aged inventory", "True age", "Time on market"]}
          icon={<Timer className="h-5 w-5" />}
          accentColor={C.amHi}
          primaryAction={{ label: "Find Aged Listings", onClick: () => setActiveLane("aged") }}
        />

        {isUae && (
          <IntelligencePanel
            title="Stale + Price Movement"
            purpose="Combine aging and price movement for stronger negotiation or context signals."
            agentUseText="Use this to identify motivated sellers and repricing context on older inventory."
            chips={["Aged inventory", "Price movement", "Repricing"]}
            icon={<TrendingDown className="h-5 w-5" />}
            accentColor={C.rdHi}
            primaryAction={{ label: "Review Movement", onClick: () => setActiveLane("stale") }}
          />
        )}
      </section>

      {/* ── Lane Selector ────────────────────────────────────────────────── */}
      <section className="flex flex-wrap items-center gap-2 pt-2">
        <button
          onClick={() => setActiveLane("all")}
          className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
          style={{
            background: activeLane === "all" ? C.viHi : "rgba(255,255,255,0.05)",
            color: activeLane === "all" ? "#000" : C.t2,
          }}
        >
          All Truth Signals
        </button>
        <button
          onClick={() => setActiveLane("refresh")}
          className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
          style={{
            background: activeLane === "refresh" ? C.viHi : "rgba(255,255,255,0.05)",
            color: activeLane === "refresh" ? "#000" : C.t2,
          }}
        >
          Refresh Inflation
        </button>
        <button
          onClick={() => setActiveLane("aged")}
          className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
          style={{
            background: activeLane === "aged" ? C.viHi : "rgba(255,255,255,0.05)",
            color: activeLane === "aged" ? "#000" : C.t2,
          }}
        >
          Aged Listings
        </button>
        {isUae && (
          <button
            onClick={() => setActiveLane("stale")}
            className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
            style={{
              background: activeLane === "stale" ? C.viHi : "rgba(255,255,255,0.05)",
              color: activeLane === "stale" ? "#000" : C.t2,
            }}
          >
            Stale + Price Movement
          </button>
        )}
      </section>

      {/* ── 4. Main Listing Truth List ─────────────────────────────────── */}
      <section id="truth-list" className="scroll-mt-10 pt-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5" style={{ color: C.viHi }} />
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
              Listing Truth Signals
            </h2>
          </div>
          <span 
            className="hidden sm:inline-flex rounded-full border px-3 py-1 text-[11px] font-bold"
            style={{ color: C.t3, background: "rgba(255,255,255,0.02)", borderColor: C.border }}
          >
            {formatNumber(visibleCards.length)} Signals
          </span>
        </div>

        {visibleCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((item, idx) => (
              <TruthCard 
                key={item.id} 
                idx={idx} 
                item={item} 
                routeBase={country.routeBase} 
                currency={country.currency}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">No signals found in this view</p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: C.t4 }}>
              Try selecting a different signal category.
            </p>
          </div>
        )}

        {filteredItems.length > visibleCards.length && (
          <p className="mt-6 text-center text-[13px] font-bold" style={{ color: C.t4 }}>
            Showing top {visibleCards.length} of {formatNumber(filteredItems.length)} filtered signals
          </p>
        )}
      </section>

      {/* ── 5. Trust Strip ──────────────────────────────────────────────── */}
      <section className="pt-4">
        <div
          className="flex flex-col sm:flex-row flex-wrap sm:items-center justify-between gap-4 rounded-[16px] border px-6 py-4 shadow-sm"
          style={{ 
            background: "rgba(255,255,255,0.015)", 
            borderColor: C.borderSub,
            backdropFilter: "blur(10px)"
          }}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <Globe2 className="h-3.5 w-3.5 opacity-70" style={{ color: C.t3 }} />
              Public listing evidence
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t1 }}>
              <CheckCircle2 className="h-4 w-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ color: C.emHi }} />
              Verify source before action
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <ShieldCheck className="h-3.5 w-3.5 opacity-70" style={{ color: C.t3 }} />
              Freshness signals are not misconduct claims
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 text-[12px] font-bold tracking-wide" style={{ color: C.t3 }}>
            <span className="uppercase tracking-widest text-[9px] text-zinc-300 bg-white/5 border border-white/10 px-2 py-1 rounded-md shadow-inner">
              {country.currency}
            </span>
            {country.label} Workspace
          </div>
        </div>
      </section>

    </div>
  );
}