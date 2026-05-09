// app/dashboard/_components/BuildingIntelligencePage.tsx
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe2,
  Layers,
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

function formatCurrencyCompact(value: number, currency: string): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ${currency}`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k ${currency}`;
  return `${value} ${currency}`;
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

function formatCategoryLabel(value: string | undefined): string {
  if (!value) return "All Categories";
  if (value.toLowerCase() === "all") return "All Categories";
  return humanizeToken(value);
}

function buildBuildingDedupeKey(record: Module5Record): string {
  const marketKey = getStringField(record, ["market_key"]);
  if (marketKey) return marketKey.toLowerCase();

  const city = formatDisplayLabel(getStringField(record, ["city"]));
  const loc = formatDisplayLabel(getStringField(record, ["community", "district"]));
  const bldg = formatDisplayLabel(getStringField(record, ["building_name", "building"]));
  const cat = formatDisplayLabel(getStringField(record, ["source_category", "market_level", "market_size_bucket"]));

  return [city, loc, bldg, cat].filter(Boolean).join("-").toLowerCase();
}

function buildBuildingDisplayKey(record: Module5Record): string {
  const city = getStringField(record, ["city"]) || "";
  const loc = getStringField(record, ["community", "district"]) || "";
  const bldg = getStringField(record, ["building_name", "building"]) || "";
  
  return [city, loc, bldg].filter(Boolean).join(" ").toLowerCase().trim().replace(/\|+/g, " ").replace(/\s+/g, " ");
}

function getBuildingSpecificityScore(record: Module5Record): number {
  const category = getStringField(record, ["source_category", "market_level", "dashboard_level", "market_size_bucket"])?.toLowerCase() ?? "";
  if (!category || category === "all") return 0;
  if (category.includes("residential") || category.includes("commercial") || category.includes("rent") || category.includes("buy") || category.includes("short")) return 2;
  return 1;
}

function isWeakActionText(value: string | undefined): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  const weakPhrases = [
    "monitor building for future activity",
    "monitor tower for future activity",
    "use as market context",
    "not a priority action list",
    "canonical",
    "dashboard intelligence",
    "raw variants",
    "v1.3"
  ];
  return weakPhrases.some(phrase => lower.includes(phrase));
}

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bldg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bldg-grid)" />
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
}: { 
  label: string; 
  value: string | number; 
  tone?: "neutral" | "rd" | "am" | "cy" | "em";
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
      <span className="text-[12px] font-bold tabular-nums" style={{ color: c.text }}>{value}</span>
    </div>
  );
}

function BuildingCard({ card, idx, routeBase, currency }: { card: Module5Record; idx: number; routeBase: string; currency: string }) {
  const city = formatDisplayLabel(getStringField(card, ["city"]));
  const community = formatDisplayLabel(getStringField(card, ["community", "district"]));
  const buildingName = formatDisplayLabel(getStringField(card, ["building_name"]));
  
  const title = buildingName || "Building";
  const subtitle = [city, community].filter(Boolean).join(" · ");

  const sourceCategoryRaw = getStringField(card, ["source_category", "market_level", "market_size_bucket"]);
  const categoryLabel = formatCategoryLabel(sourceCategoryRaw);

  const rank = idx + 1;

  // Key fields
  const activeSupply = getNumberField(card, ["active_listings"]);
  const agencies = getNumberField(card, ["agencies", "unique_agencies", "total_agencies"]);
  
  const topAgency = getStringField(card, ["top_agency_name"]);
  const topAgencyShare = getNumberField(card, ["top_agency_share_pct"]);
  const top3Share = getNumberField(card, ["top3_agency_share_pct", "top_5_agency_share_pct"]);
  
  const pressureScore = getNumberField(card, ["inventory_pressure_score", "dominance_score"]);
  const pressureLabel = humanizeToken(getStringField(card, ["pressure_label", "pressure_bucket"]));
  const concentrationLabel = humanizeToken(getStringField(card, ["concentration_label", "concentration_bucket"]));
  
  const priceDropRate = getNumberField(card, ["price_drop_rate_pct"]);
  const refreshRate = getNumberField(card, ["refresh_inflated_rate_pct", "refresh_rate_pct"]);
  const ownerDirectRate = getNumberField(card, ["owner_direct_rate_pct"]);
  const avgPrice = getNumberField(card, ["avg_price"]);
  const avgPriceSqft = getNumberField(card, ["avg_price_per_sqft"]);

  // Metric Pills Logic (Max 5)
  const availableMetrics: Record<string, { label: string; value: string | number; tone?: "neutral"|"rd"|"am"|"cy"|"em" }> = {};
  
  if (activeSupply !== undefined) availableMetrics["supply"] = { label: "Active Supply", value: formatNumber(activeSupply), tone: "neutral" };
  if (agencies !== undefined) availableMetrics["presences"] = { label: "Presences", value: formatNumber(agencies), tone: "neutral" };
  if (pressureScore !== undefined) availableMetrics["pressure"] = { label: "Pressure", value: pressureScore.toFixed(1), tone: "am" };
  else if (pressureLabel) availableMetrics["pressure"] = { label: "Pressure", value: pressureLabel, tone: "am" };
  if (refreshRate !== undefined) availableMetrics["refresh"] = { label: "Refresh", value: formatPercent(refreshRate), tone: "cy" };
  if (priceDropRate !== undefined) availableMetrics["drop"] = { label: "Price Drop", value: formatPercent(priceDropRate), tone: "rd" };
  if (topAgencyShare !== undefined) availableMetrics["topShare"] = { label: "Top Share", value: formatPercent(topAgencyShare), tone: "cy" };
  if (top3Share !== undefined) availableMetrics["top3Share"] = { label: "Top 3 Share", value: formatPercent(top3Share), tone: "cy" };
  if (concentrationLabel) availableMetrics["concentration"] = { label: "Concentration", value: concentrationLabel, tone: "cy" };
  if (ownerDirectRate !== undefined) availableMetrics["ownerDirect"] = { label: "Owner/Direct", value: formatPercent(ownerDirectRate), tone: "em" };

  const preferredKeys = ["supply", "presences", "pressure", "refresh", "drop", "topShare", "top3Share", "concentration"];
  const pillsToRender = [];
  
  for (const k of preferredKeys) {
    if (availableMetrics[k]) {
      pillsToRender.push(availableMetrics[k]);
      if (pillsToRender.length >= 5) break;
    }
  }

  // Building Read Line
  let buildingReadLine = "";
  if (activeSupply !== undefined && agencies !== undefined) {
    buildingReadLine = `${title} has ${formatNumber(activeSupply)} active listings across ${formatNumber(agencies)} agency presences.`;
  } else if (activeSupply !== undefined) {
    buildingReadLine = `${title} has ${formatNumber(activeSupply)} active listings.`;
  } else if (agencies !== undefined) {
    buildingReadLine = `${title} shows ${formatNumber(agencies)} agency presences in the current public listing snapshot.`;
  } else {
    buildingReadLine = "Use this building as public listing context before comparing supply or competition.";
  }

  // Action Box
  let actionText = getStringField(card, ["recommended_action", "pressure_action", "interpretation_note", "product_note"]);
  
  // Safe Fallback
  if (isWeakActionText(actionText)) {
    if (refreshRate !== undefined && refreshRate > 50) {
      actionText = "High refresh activity means portal freshness may be inflated in this building. Use listing-truth context before acting.";
    } else if (pressureScore !== undefined && pressureScore >= 40) {
      actionText = "This building shows elevated visible supply pressure. Review movement and competition before outreach or pricing decisions.";
    } else if (activeSupply !== undefined && activeSupply >= 100) {
      actionText = "This building has heavy visible supply. Use it as a building-level farming watchlist.";
    } else if (topAgencyShare !== undefined && topAgencyShare >= 40) {
      actionText = "One visible agency has a high share of supply here. Review competitor footprint before farming this building.";
    } else if (priceDropRate !== undefined && priceDropRate > 0) {
      actionText = "Price movement is present in this building. Review repricing patterns before outreach.";
    } else if (top3Share !== undefined && top3Share >= 50) {
      actionText = "The top visible agencies represent a large share of this building’s supply. Review concentration before entering this building.";
    } else {
      actionText = "Use this building as public listing context before comparing supply, competition, or outreach strategy.";
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
        style={{ background: C.cyHi, boxShadow: `0 0 10px ${C.cyHi}` }} 
      />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        
        {/* Top Row: Rank & Type */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="rounded px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-widest"
            style={{ color: C.cyHi, background: "rgba(34,211,238,0.1)", border: `1px solid rgba(34,211,238,0.2)` }}
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
            {categoryLabel}
          </span>
        </div>

        <h3 className="text-[18px] font-extrabold text-white tracking-tight mb-1">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-[12px] font-bold mb-4" style={{ color: C.t4 }}>
            {subtitle}
          </p>
        )}
        
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
          <div className="rounded-lg border p-3 mb-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: C.cyHi }}>
              Top visible agency
            </span>
            <span 
              className="block text-[13px] font-bold leading-relaxed text-white line-clamp-2"
              title={topAgencyShare !== undefined ? `${topAgency} · ${formatPercent(topAgencyShare)} visible share` : topAgency}
            >
              {topAgencyShare !== undefined ? `${topAgency} · ${formatPercent(topAgencyShare)} visible share` : topAgency}
            </span>
          </div>
        )}
        
        {buildingReadLine && (
          <p className="text-[13px] leading-relaxed font-medium mb-3" style={{ color: C.t3 }}>
            {buildingReadLine}
          </p>
        )}

        {/* Price Context Row */}
        {(avgPrice || avgPriceSqft) && (
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {avgPrice && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>Avg Price:</span>
                <span className="text-[12px] font-bold tabular-nums text-white">{formatCurrencyCompact(avgPrice, currency)}</span>
              </div>
            )}
            {avgPriceSqft && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>Price/sqft:</span>
                <span className="text-[12px] font-bold tabular-nums text-white">{formatCurrencyCompact(avgPriceSqft, currency)}/sqft</span>
              </div>
            )}
          </div>
        )}

        {/* Action Box */}
        <div className="mt-auto mb-5 rounded-xl border p-3.5" style={{ background: "rgba(0,0,0,0.18)", borderColor: C.borderSub }}>
          <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.cyHi }}>
            Why this matters
          </span>
          <p className="text-[12.5px] leading-relaxed font-medium" style={{ color: C.t2 }}>
            {actionText}
          </p>
        </div>

        {/* Footer Row (CTA) */}
        <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: C.borderSub }}>
          <Link
            href={`${routeBase}/inventory-pressure`}
            className="text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: C.t4 }}
          >
            Supply Pressure
          </Link>
          <Link
            href={`${routeBase}/market-radar`}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: C.cyHi }}
          >
            Review Market Context
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function BuildingIntelligencePage({
  country,
  data,
}: {
  country: CountryConfig;
  data: Module5DataResult;
}) {
  const isUae = country.slug === "uae";
  
  // Source Selection
  const rawBuildings = data.buildingIntelligence?.items ?? [];

  // KSA or Empty Limited State
  if (!isUae || rawBuildings.length === 0) {
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
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
          
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
                style={{ color: C.t3, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.1)` }}
              >
                <Building2 className="h-3.5 w-3.5" />
                Building Intelligence
              </span>
            </div>

            <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
              Building-Level Tracking Is Limited Here
            </h1>
            
            <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
              Building-level intelligence is not available for this workspace snapshot. Use district, supply, and market movement intelligence instead.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                href={`${country.routeBase}/communities`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
                style={{ 
                  background: "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)", 
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(6,182,212,0.25)" 
                }}
              >
                Districts to Monitor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              
              <Link
                href={`${country.routeBase}/inventory-pressure`}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
                style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                Supply Pressure
              </Link>

              <Link
                href={`${country.routeBase}/market-radar`}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
                style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                Market Radar
              </Link>
            </div>
            
            <p className="mt-8 text-[12px] font-medium" style={{ color: C.t4 }}>
              No building-level cards are shown without reliable building data.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Deduplicate and filter
  const validCards: Module5Record[] = [];
  const seenKeys = new Set<string>();

  for (const card of rawBuildings) {
    const city = getStringField(card, ["city"]);
    const loc = getStringField(card, ["community", "district"]);
    const bldg = getStringField(card, ["building_name"]);

    if (!city || !loc || !bldg) continue;

    let dedupeKey = buildBuildingDedupeKey(card);
    if (!dedupeKey) {
      dedupeKey = `bldg-${validCards.length}`;
    }

    if (!seenKeys.has(dedupeKey)) {
      seenKeys.add(dedupeKey);
      validCards.push(card);
    }
  }

  // Sort logic
  const sortedCards = [...validCards].sort((a, b) => {
    const scoreA = getNumberField(a, ["inventory_pressure_score", "dominance_score"]) ?? 0;
    const scoreB = getNumberField(b, ["inventory_pressure_score", "dominance_score"]) ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;

    const refreshA = getNumberField(a, ["refresh_inflated_rate_pct"]) ?? 0;
    const refreshB = getNumberField(b, ["refresh_inflated_rate_pct"]) ?? 0;
    if (refreshB !== refreshA) return refreshB - refreshA;
    
    const supplyA = getNumberField(a, ["active_listings"]) ?? 0;
    const supplyB = getNumberField(b, ["active_listings"]) ?? 0;
    if (supplyB !== supplyA) return supplyB - supplyA;

    const shareA = getNumberField(a, ["top_agency_share_pct"]) ?? 0;
    const shareB = getNumberField(b, ["top_agency_share_pct"]) ?? 0;
    if (shareB !== shareA) return shareB - shareA;

    const rankA = getNumberField(a, ["dashboard_rank"]) ?? 0;
    const rankB = getNumberField(b, ["dashboard_rank"]) ?? 0;
    return rankB - rankA; // Tie-breaker
  });

  // Visual Display Dedupe (Prevents seeing identical buildings with different categories/keys)
  const displayCandidateCards = [...sortedCards].sort((a, b) => {
    const keyA = buildBuildingDisplayKey(a);
    const keyB = buildBuildingDisplayKey(b);

    if (keyA === keyB) {
      const specificityA = getBuildingSpecificityScore(a);
      const specificityB = getBuildingSpecificityScore(b);
      if (specificityB !== specificityA) return specificityB - specificityA;

      const scoreA = getNumberField(a, ["inventory_pressure_score", "dominance_score"]) ?? 0;
      const scoreB = getNumberField(b, ["inventory_pressure_score", "dominance_score"]) ?? 0;
      if (scoreB !== scoreA) return scoreB - scoreA;

      const supplyA = getNumberField(a, ["active_listings"]) ?? 0;
      const supplyB = getNumberField(b, ["active_listings"]) ?? 0;
      if (supplyB !== supplyA) return supplyB - supplyA;

      const rankA = getNumberField(a, ["dashboard_rank"]) ?? 0;
      const rankB = getNumberField(b, ["dashboard_rank"]) ?? 0;
      if (rankB !== rankA) return rankB - rankA;
    }

    return 0;
  });

  const displayDedupedCards: Module5Record[] = [];
  const seenDisplayKeys = new Set<string>();

  for (const card of displayCandidateCards) {
    const displayKey = buildBuildingDisplayKey(card);
    
    if (!displayKey) {
      displayDedupedCards.push(card);
    } else if (!seenDisplayKeys.has(displayKey)) {
      seenDisplayKeys.add(displayKey);
      displayDedupedCards.push(card);
    }
  }

  // Overview Metrics
  const trackedBuildingsCount = displayDedupedCards.length;
  
  const activeSupplyCount = displayDedupedCards.reduce((acc, card) => {
    return acc + (getNumberField(card, ["active_listings"]) ?? 0);
  }, 0);

  const agencyPresencesCount = displayDedupedCards.reduce((acc, card) => {
    return acc + (getNumberField(card, ["agencies", "unique_agencies", "total_agencies"]) ?? 0);
  }, 0);

  const pressureMovementCount = displayDedupedCards.filter(card => {
    const pressure = getNumberField(card, ["inventory_pressure_score"]);
    const drop = getNumberField(card, ["price_drop_rate_pct"]);
    const refresh = getNumberField(card, ["refresh_inflated_rate_pct"]);
    const ownerDirect = getNumberField(card, ["owner_direct_rate_pct"]);
    return (pressure && pressure > 0) || (drop && drop > 0) || (refresh && refresh > 0) || (ownerDirect && ownerDirect > 0);
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
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.cyHi, background: "rgba(34,211,238,0.1)", border: `1px solid rgba(34,211,238,0.2)` }}
            >
              <Building2 className="h-3.5 w-3.5" />
              Building Intelligence
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            Which Buildings Deserve Attention?
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Review building-level visible supply, agency concentration, pressure signals, refresh inflation, and movement indicators to choose which towers to monitor next.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href="#building-list"
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(6,182,212,0.25)" 
              }}
            >
              Review Buildings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            
            <Link
              href={`${country.routeBase}/communities`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Communities
            </Link>

            <Link
              href={`${country.routeBase}/inventory-pressure`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Supply Pressure
            </Link>

            <Link
              href={`${country.routeBase}/market-dominance`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Market Dominance
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Building Overview Cards ─────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.cyHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Buildings Overview
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Buildings Tracked"
            value={formatNumber(trackedBuildingsCount)}
            description="Unique buildings evaluated."
            icon={<Building2 className="h-5 w-5" />}
            accentColor={C.cyHi}
            href="#building-list"
            ctaLabel="View Buildings"
          />
          <SnapshotCard
            title="Active Supply"
            value={formatNumber(activeSupplyCount)}
            description="Combined active listings analyzed."
            icon={<Layers className="h-5 w-5" />}
            accentColor={C.emHi}
            href="#building-list"
            ctaLabel="Review Supply"
          />
          <SnapshotCard
            title="Agency Presences"
            value={formatNumber(agencyPresencesCount)}
            description="Agency footprints across buildings."
            icon={<Users className="h-5 w-5" />}
            accentColor={C.rdHi}
            href="#building-list"
            ctaLabel="Check Competition"
          />
          <SnapshotCard
            title="Pressure / Movement"
            value={formatNumber(pressureMovementCount)}
            description="Buildings with active signals."
            icon={<TrendingDown className="h-5 w-5" />}
            accentColor={C.amHi}
            href="#building-list"
            ctaLabel="Find Movement"
          />
        </div>
      </section>

      {/* ── 3. Insight Panels ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Building Intelligence
          </h2>
        </div>

        <IntelligencePanel
          title="Tower Supply Watch"
          purpose="Identify buildings where visible active supply is worth monitoring."
          agentUseText="Use this to prioritize towers with optimal supply and manageable competition for your outreach."
          chips={["Building-level watchlist", "Tower supply", "Location monitoring"]}
          icon={<Building2 className="h-5 w-5" />}
          accentColor={C.cyHi}
          primaryCta={{ label: "View Buildings", href: "#building-list" }}
        />

        <IntelligencePanel
          title="Refresh & Price Movement"
          purpose="Highlight buildings with refresh inflation, price drops, stale price movement, or pricing pressure."
          agentUseText="Use this to spot buildings experiencing high pricing pressure, stagnant inventory, or inflated portal freshness."
          chips={["Refresh activity", "Price drops", "Stale inventory"]}
          icon={<Activity className="h-5 w-5" />}
          accentColor={C.amHi}
          primaryCta={{ label: "Check Movement", href: "#building-list" }}
        />

        <IntelligencePanel
          title="Agency Concentration"
          purpose="Understand visible top-agency share and fragmented or competitive building markets."
          agentUseText="Use this to review the competitive landscape before committing resources to a new building."
          chips={["Agency presences", "Top visible agency", "Market concentration"]}
          icon={<Users className="h-5 w-5" />}
          accentColor={C.rdHi}
          primaryCta={{ label: "Review Competition", href: "#building-list" }}
        />
      </section>

      {/* ── 4. Main Building List ─────────────────────────────────── */}
      <section id="building-list" className="scroll-mt-10 pt-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5" style={{ color: C.cyHi }} />
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
              Ranked Buildings
            </h2>
          </div>
          <span 
            className="hidden sm:inline-flex rounded-full border px-3 py-1 text-[11px] font-bold"
            style={{ color: C.t3, background: "rgba(255,255,255,0.02)", borderColor: C.border }}
          >
            {formatNumber(displayDedupedCards.length)} Buildings
          </span>
        </div>

        {visibleCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((card, idx) => (
              <BuildingCard 
                key={buildBuildingReactKey(card, idx)} 
                idx={idx} 
                card={card} 
                routeBase={country.routeBase} 
                currency={country.currency}
              />
            ))}
          </div>
        ) : rawBuildings.length > 0 ? (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">Building signals available — names incomplete</p>
            <p className="mt-2 max-w-lg mx-auto text-[13px] font-medium" style={{ color: C.t4 }}>
              This workspace snapshot contains building signals, but the building labels are not complete enough to display reliable cards.
            </p>
          </div>
        ) : (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">No building intelligence available</p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: C.t4 }}>
              No building intelligence is available in this workspace snapshot.
            </p>
          </div>
        )}

        {displayDedupedCards.length > visibleCards.length && (
          <p className="mt-6 text-center text-[13px] font-bold" style={{ color: C.t4 }}>
            Showing top {visibleCards.length} of {formatNumber(displayDedupedCards.length)} analyzed buildings
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
              Intelligence is based on visible public listing activity
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

function buildBuildingReactKey(record: Module5Record, idx: number): string {
  const baseKey = buildBuildingDedupeKey(record);
  return `${baseKey || "bldg"}-${idx}`;
}