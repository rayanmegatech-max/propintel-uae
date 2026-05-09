// app/dashboard/_components/MarketDominancePage.tsx
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Globe2,
  Layers,
  MapPinned,
  PieChart,
  ShieldCheck,
  TrendingDown,
  Users,
} from "lucide-react";
import { formatNumber } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { Module5DataResult, Module5Record } from "@/lib/data/module5";

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
} as const;

// ─── Type Helpers ─────────────────────────────────────────────────────────
function getStringField(record: Module5Record, keys: string[]): string | undefined {
  for (const key of keys) {
    const val = record[key];
    if (typeof val === "string" && val.trim() !== "") {
      return val.trim();
    }
  }
  return undefined;
}

function getNumberField(record: Module5Record, keys: string[]): number | undefined {
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

// ─── Formatters ───────────────────────────────────────────────────────────
function formatDisplayLabel(value: string | undefined): string {
  if (!value) return "";
  return value
    .trim()
    .replace(/\|+/g, " · ")
    .replace(/\s+/g, " ")
    .replace(/\s·\s·\s/g, " · ")
    .trim();
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function humanizeToken(value: string | undefined): string {
  if (!value) return "";
  const cleaned = value.replace(/[_|\-]/g, " ").replace(/\s+/g, " ").trim();
  const words = cleaned.toLowerCase().split(" ");
  const special = ["aed", "sar", "uae", "ksa", "hhi"];
  return words
    .map((w) => (special.includes(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function formatMarketCategoryLabel(value: string | undefined): string {
  if (!value) return "Market Context";
  if (value.toLowerCase() === "all") return "All Categories";
  return humanizeToken(value);
}

function buildMarketDedupeKey(record: Module5Record, isUae: boolean): string {
  const marketKey = getStringField(record, ["market_key"]);
  if (marketKey) return marketKey.toLowerCase();

  const city = formatDisplayLabel(getStringField(record, ["city"]));
  const loc = formatDisplayLabel(getStringField(record, ["community", "district"]));
  const bldg = formatDisplayLabel(getStringField(record, ["building_name"]));
  const cat = formatDisplayLabel(getStringField(record, ["source_category", "market_level"]));
  
  if (isUae) {
    return [city, loc, bldg, cat].filter(Boolean).join("-").toLowerCase();
  }
  return [city, loc, cat].filter(Boolean).join("-").toLowerCase();
}

function buildMarketReactKey(record: Module5Record, idx: number, isUae: boolean): string {
  const baseKey = buildMarketDedupeKey(record, isUae);
  return `${baseKey || "market"}-${idx}`;
}

function buildMarketDisplayKey(record: Module5Record, isUae: boolean): string {
  const city = getStringField(record, ["city"]) || "";
  const loc = getStringField(record, ["community", "district"]) || "";
  const bldg = getStringField(record, ["building_name"]) || "";

  const parts = isUae ? [city, loc, bldg] : [city, loc];
  
  const rawKey = parts.filter(Boolean).join(" ");
  
  return rawKey
    .toLowerCase()
    .trim()
    .replace(/\|+/g, " ")
    .replace(/\s+/g, " ");
}

function getMarketSpecificityScore(record: Module5Record): number {
  const category = getStringField(record, ["source_category", "market_level", "dashboard_level", "market_size_bucket"])?.toLowerCase() ?? "";
  if (!category || category === "all") return 0;
  if (category.includes("residential") || category.includes("commercial") || category.includes("rent") || category.includes("buy") || category.includes("short")) return 2;
  return 1;
}

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="market-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#market-grid)" />
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
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
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
  primaryCta,
}: {
  title: string;
  purpose: string;
  agentUseText: string;
  chips: string[];
  icon: React.ReactNode;
  accentColor: string;
  primaryCta: { label: string; href: string };
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
          <Link
            href={primaryCta.href}
            className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-[13px] font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px shadow-sm"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {primaryCta.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
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
  tone?: "neutral" | "rd" | "am" | "cy" | "em";
  truncate?: boolean;
}) {
  const colors = {
    neutral: { text: C.t1, bg: "rgba(255,255,255,0.03)", border: C.borderSub },
    rd: { text: C.rdHi, bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)" },
    am: { text: C.amHi, bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
    cy: { text: C.cyHi, bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)" },
    em: { text: C.emHi, bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
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

function MarketDominanceCard({ card, idx, routeBase, isUae }: { card: Module5Record; idx: number; routeBase: string; isUae: boolean }) {
  const city = formatDisplayLabel(getStringField(card, ["city"]));
  const community = formatDisplayLabel(getStringField(card, ["community", "district"]));
  const buildingName = formatDisplayLabel(getStringField(card, ["building_name"]));
  
  let title = "";
  if (isUae) {
    title = [city, community, buildingName].filter(Boolean).join(" · ") || "Market Area";
  } else {
    title = [city, community].filter(Boolean).join(" · ") || "Market Area";
  }

  const sourceCategoryRaw = getStringField(card, ["source_category", "market_level", "dashboard_level", "market_size_bucket"]);
  const typeLabel = formatMarketCategoryLabel(sourceCategoryRaw);

  const rank = idx + 1;

  // Key fields
  const topAgency = getStringField(card, ["top_agency_name"]);
  const topAgencyShare = getNumberField(card, ["top_agency_share_pct"]);
  const topXShare = getNumberField(card, ["top3_agency_share_pct", "top_5_agency_share_pct"]);
  
  const supplyCount = getNumberField(card, ["total_listings", "active_listings"]);
  const agencyCount = getNumberField(card, ["total_agencies", "unique_agencies"]);
  
  const concentration = humanizeToken(getStringField(card, ["concentration_label", "concentration_bucket"]));
  const dominanceScore = getNumberField(card, ["dominance_score", "inventory_pressure_score", "hhi_agency"]);
  const pressureBucket = humanizeToken(getStringField(card, ["pressure_bucket"]));

  // Metric Pills Logic (Max 5)
  const availableMetrics: Record<string, { label: string; value: string | number; tone?: "neutral"|"rd"|"am"|"cy"|"em" }> = {};
  
  if (topAgencyShare !== undefined) availableMetrics["topShare"] = { label: "Top Share", value: formatPercent(topAgencyShare), tone: "am" };
  if (topXShare !== undefined) availableMetrics["topXShare"] = { label: "Top Group Share", value: formatPercent(topXShare), tone: "cy" };
  if (supplyCount !== undefined) availableMetrics["supply"] = { label: "Listings", value: formatNumber(supplyCount), tone: "neutral" };
  if (agencyCount !== undefined) availableMetrics["agencies"] = { label: "Presences", value: formatNumber(agencyCount), tone: "neutral" };
  if (concentration) availableMetrics["concentration"] = { label: "Concentration", value: concentration, tone: concentration.toLowerCase().includes("fragmented") ? "em" : "am" };
  if (pressureBucket) availableMetrics["pressure"] = { label: "Pressure", value: pressureBucket, tone: "rd" };
  else if (dominanceScore !== undefined) availableMetrics["pressure"] = { label: "Score", value: dominanceScore.toFixed(1), tone: "cy" };

  const preferredKeys = ["topShare", "topXShare", "concentration", "supply", "agencies", "pressure"];
  const pillsToRender = [];
  
  for (const k of preferredKeys) {
    if (availableMetrics[k]) {
      pillsToRender.push(availableMetrics[k]);
      if (pillsToRender.length >= 5) break;
    }
  }

  // Market Read Line
  let marketReadLine = "";
  if (supplyCount && agencyCount) {
    marketReadLine = `${title} has ${supplyCount} visible listings across ${agencyCount} agency presences.`;
  } else if (supplyCount) {
    marketReadLine = `${title} has ${supplyCount} visible listings.`;
  } else if (topAgency) {
    marketReadLine = "Use this market as visible listing-share context before comparing agency presence.";
  }

  // Action Box
  let actionText = getStringField(card, ["recommended_use", "explanation", "pressure_action", "interpretation_note", "product_note"]);
  
  // Safe Fallback
  if (!actionText || actionText.toLowerCase().includes("canonical") || actionText.toLowerCase().includes("dashboard intelligence")) {
    const isFragmented = concentration?.toLowerCase().includes("fragmented");
    if (isFragmented) {
      actionText = "Fragmented visible supply suggests there may be room to enter or farm this area, but verify source listings before action.";
    } else if (topAgencyShare && topAgencyShare >= 30) {
      actionText = "One visible agency has a meaningful share of supply here. Review competitor footprint before positioning in this market.";
    } else {
      actionText = "Use this market as public listing-share context before comparing agency presence or outreach strategy.";
    }
  }

  return (
    <article
      className="group relative flex flex-col rounded-[20px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.015)",
        borderColor: C.borderSub,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-50 transition-all duration-300" 
        style={{ background: C.amHi, boxShadow: `0 0 10px ${C.amHi}` }} 
      />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        
        {/* Top Row: Rank & Type */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="rounded px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-widest"
            style={{ color: C.amHi, background: "rgba(251,191,36,0.1)", border: `1px solid rgba(251,191,36,0.2)` }}
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
            {typeLabel}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[18px] font-extrabold text-white tracking-tight mb-4">
          {title}
        </h3>
        
        {/* Metric Pills Row */}
        {pillsToRender.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {pillsToRender.map((p, i) => (
              <MetricPill key={i} label={p.label} value={p.value} tone={p.tone} />
            ))}
          </div>
        )}

        {/* Top Visible Agency Row */}
{topAgency && (
  <div
    className="rounded-lg border p-3 mb-4"
    style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}
  >
    <span
      className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
      style={{ color: C.amHi }}
    >
      Top visible agency
    </span>
    <span
      className="block text-[12.5px] font-bold leading-relaxed text-white line-clamp-2"
      title={topAgencyShare !== undefined ? `${topAgency} · ${formatPercent(topAgencyShare)} visible share` : topAgency}
    >
      {topAgencyShare !== undefined ? `${topAgency} · ${formatPercent(topAgencyShare)} visible share` : topAgency}
    </span>
  </div>
)}
        
        {marketReadLine && (
          <p className="text-[13px] leading-relaxed font-medium mb-3" style={{ color: C.t3 }}>
            {marketReadLine}
          </p>
        )}

        {/* Action Box */}
        <div className="mt-auto mb-5 rounded-xl border p-3.5" style={{ background: "rgba(0,0,0,0.18)", borderColor: C.borderSub }}>
          <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.amHi }}>
            Why this matters
          </span>
          <p className="text-[12.5px] leading-relaxed font-medium" style={{ color: C.t2 }}>
            {actionText}
          </p>
        </div>

        {/* Footer Row (CTA) */}
        <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: C.borderSub }}>
          <Link
            href={`${routeBase}/competitor-radar`}
            className="text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: C.t4 }}
          >
            Competitor Radar
          </Link>
          <Link
            href={`${routeBase}/agency-profiles`}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: C.amHi }}
          >
            Review Agency Profiles
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function MarketDominancePage({
  country,
  data,
}: {
  country: CountryConfig;
  data: Module5DataResult;
}) {
  const isUae = country.slug === "uae";
  
  // Source Selection
  const rawMarkets = (data.marketDominance?.items?.length
    ? data.marketDominance.items
    : data.marketDominanceLarge?.items ?? []) as Module5Record[];

  // Deduplicate by internal market_key and filter
  const validCards: Module5Record[] = [];
  const seenKeys = new Set<string>();

  for (const card of rawMarkets) {
    const city = getStringField(card, ["city"]);
    const loc = getStringField(card, ["community", "district"]);
    const bldg = getStringField(card, ["building_name"]);

    const hasLocation = isUae ? !!(city && (loc || bldg)) : !!(city && loc);
    
    // Require location fields for a valid card
    if (!hasLocation) continue;

    let dedupeKey = buildMarketDedupeKey(card, isUae);
    if (!dedupeKey) {
      dedupeKey = `market-${validCards.length}`;
    }

    if (!seenKeys.has(dedupeKey)) {
      seenKeys.add(dedupeKey);
      validCards.push(card);
    }
  }

  // Sort logic
  const sortedCards = [...validCards].sort((a, b) => {
    const shareA = getNumberField(a, ["top_agency_share_pct"]) ?? 0;
    const shareB = getNumberField(b, ["top_agency_share_pct"]) ?? 0;
    if (shareB !== shareA) return shareB - shareA;

    const scoreA = getNumberField(a, ["dominance_score", "inventory_pressure_score"]) ?? 0;
    const scoreB = getNumberField(b, ["dominance_score", "inventory_pressure_score"]) ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    
    const supplyA = getNumberField(a, ["total_listings", "active_listings"]) ?? 0;
    const supplyB = getNumberField(b, ["total_listings", "active_listings"]) ?? 0;
    if (supplyB !== supplyA) return supplyB - supplyA;

    const rankA = getNumberField(a, ["dashboard_rank"]) ?? 0;
    const rankB = getNumberField(b, ["dashboard_rank"]) ?? 0;
    return rankB - rankA; // Tie-breaker
  });

  // Visual Display Dedupe (Prevents seeing identical locations with different categories/keys)
  const displayCandidateCards = [...sortedCards].sort((a, b) => {
    const keyA = buildMarketDisplayKey(a, isUae);
    const keyB = buildMarketDisplayKey(b, isUae);

    if (keyA === keyB) {
      const specificityA = getMarketSpecificityScore(a);
      const specificityB = getMarketSpecificityScore(b);
      if (specificityB !== specificityA) return specificityB - specificityA;

      const shareA = getNumberField(a, ["top_agency_share_pct"]) ?? 0;
      const shareB = getNumberField(b, ["top_agency_share_pct"]) ?? 0;
      if (shareB !== shareA) return shareB - shareA;

      const supplyA = getNumberField(a, ["total_listings", "active_listings"]) ?? 0;
      const supplyB = getNumberField(b, ["total_listings", "active_listings"]) ?? 0;
      if (supplyB !== supplyA) return supplyB - supplyA;
    }

    return 0;
  });

  const displayDedupedCards: Module5Record[] = [];
  const seenDisplayKeys = new Set<string>();

  for (const card of displayCandidateCards) {
    const displayKey = buildMarketDisplayKey(card, isUae);
    
    if (!displayKey) {
      displayDedupedCards.push(card);
    } else if (!seenDisplayKeys.has(displayKey)) {
      seenDisplayKeys.add(displayKey);
      displayDedupedCards.push(card);
    }
  }

  // Overview Metrics (calculated from all valid cards before visual dedupe)
  const trackedMarketsCount = validCards.length;
  
  const visibleSupplyCount = validCards.reduce((acc, card) => {
    return acc + (getNumberField(card, ["total_listings", "active_listings"]) ?? 0);
  }, 0);

  const agencyPresencesCount = validCards.reduce((acc, card) => {
    return acc + (getNumberField(card, ["total_agencies", "unique_agencies"]) ?? 0);
  }, 0);

  const fragmentedMarketsCount = validCards.filter(card => {
    const conc = getStringField(card, ["concentration_label", "concentration_bucket"]) || "";
    return conc.toLowerCase().includes("fragmented");
  }).length;
  
  // Display limit applied to visually deduped cards
  const visibleCards = displayDedupedCards.slice(0, 15);

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
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.amHi, background: "rgba(251,191,36,0.1)", border: `1px solid rgba(251,191,36,0.2)` }}
            >
              <PieChart className="h-3.5 w-3.5" />
              Market Dominance
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            Who Leads Visible Supply?
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Review market-by-market agency concentration, top visible players, fragmented areas, and competitive pressure from public listing intelligence.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href="#dominance-markets"
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #fcd34d 0%, #fbbf24 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(245,158,11,0.25)" 
              }}
            >
              Review Market Share
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            
            <Link
              href={`${country.routeBase}/agency-profiles`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Agency Profiles
            </Link>

            <Link
              href={`${country.routeBase}/competitor-radar`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Competitor Radar
            </Link>

            <Link
              href={`${country.routeBase}/market-radar`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Market Radar
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Market Overview Cards ─────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.amHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Dominance Overview
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Markets Tracked"
            value={formatNumber(trackedMarketsCount)}
            description="Unique markets evaluated."
            icon={<MapPinned className="h-5 w-5" />}
            accentColor={C.cyHi}
            href="#dominance-markets"
            ctaLabel="View Markets"
          />
          <SnapshotCard
            title="Visible Supply"
            value={formatNumber(visibleSupplyCount)}
            description="Combined active listings analyzed."
            icon={<Building2 className="h-5 w-5" />}
            accentColor={C.emHi}
            href="#dominance-markets"
            ctaLabel="Review Supply"
          />
          <SnapshotCard
            title="Agencies Seen"
            value={formatNumber(agencyPresencesCount)}
            description="Agency presences across all markets."
            icon={<Users className="h-5 w-5" />}
            accentColor={C.rdHi}
            href="#dominance-markets"
            ctaLabel="Check Competition"
          />
          <SnapshotCard
            title="Fragmented Markets"
            value={formatNumber(fragmentedMarketsCount)}
            description="Markets with distributed competition."
            icon={<Layers className="h-5 w-5" />}
            accentColor={C.amHi}
            href="#dominance-markets"
            ctaLabel="Find Opportunities"
          />
        </div>
      </section>

      {/* ── 3. Insight Panels ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <BarChart3 className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Dominance Intelligence
          </h2>
        </div>

        <IntelligencePanel
          title="Market Share Leaders"
          purpose="Identify markets where one agency has a high visible listing share."
          agentUseText="Use this to understand where competitors are strongest and where entering might be challenging."
          chips={["Leading agencies", "High concentration", "Market leaders"]}
          icon={<PieChart className="h-5 w-5" />}
          accentColor={C.rdHi}
          primaryCta={{ label: "View Leaders", href: "#dominance-markets" }}
        />

        <IntelligencePanel
          title="Fragmented Markets"
          purpose="Identify areas where visible competition is distributed and potentially easier to enter."
          agentUseText="Use this to find farming opportunities where no single agency dominates the public supply."
          chips={["Fragmented supply", "Farming opportunities", "Low concentration"]}
          icon={<Layers className="h-5 w-5" />}
          accentColor={C.emHi}
          primaryCta={{ label: "Find Fragmented Markets", href: "#dominance-markets" }}
        />

        <IntelligencePanel
          title="Competitive Pressure"
          purpose="Combine concentration, active supply, and signal data to prioritize competitive review."
          agentUseText="Use this to spot markets that are both concentrated and experiencing high pricing or refresh pressure."
          chips={["Competitive pressure", "Dominance score", "Market heat"]}
          icon={<TrendingDown className="h-5 w-5" />}
          accentColor={C.amHi}
          primaryCta={{ label: "Review Pressure", href: "#dominance-markets" }}
        />
      </section>

      {/* ── 4. Main Market Dominance List ─────────────────────────────────── */}
      <section id="dominance-markets" className="scroll-mt-10 pt-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5" style={{ color: C.amHi }} />
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
              Ranked Market Dominance
            </h2>
          </div>
          <span 
            className="hidden sm:inline-flex rounded-full border px-3 py-1 text-[11px] font-bold"
            style={{ color: C.t3, background: "rgba(255,255,255,0.02)", borderColor: C.border }}
          >
            {formatNumber(displayDedupedCards.length)} Markets
          </span>
        </div>

        {visibleCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((card, idx) => (
              <MarketDominanceCard 
                key={buildMarketReactKey(card, idx, isUae)} 
                idx={idx} 
                card={card} 
                routeBase={country.routeBase} 
                isUae={isUae}
              />
            ))}
          </div>
        ) : rawMarkets.length > 0 ? (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">Market signals available — locations incomplete</p>
            <p className="mt-2 max-w-lg mx-auto text-[13px] font-medium" style={{ color: C.t4 }}>
              This workspace snapshot contains market dominance signals, but the location labels are not complete enough to display reliable market cards.
            </p>
          </div>
        ) : (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">No market dominance signals available</p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: C.t4 }}>
              No market dominance signals are available in this workspace snapshot.
            </p>
          </div>
        )}

        {displayDedupedCards.length > visibleCards.length && (
          <p className="mt-6 text-center text-[13px] font-bold" style={{ color: C.t4 }}>
            Showing top {visibleCards.length} of {formatNumber(displayDedupedCards.length)} analyzed markets
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
              Public listing intelligence
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t1 }}>
              <CheckCircle2 className="h-4 w-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ color: C.emHi }} />
              Verify source before action
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <ShieldCheck className="h-3.5 w-3.5 opacity-70" style={{ color: C.t3 }} />
              Dominance is based on visible public listing activity
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