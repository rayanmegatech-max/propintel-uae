// app/dashboard/_components/PriceDropRadarPage.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  CheckCircle2,
  Clock,
  Globe2,
  Layers,
  Search,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { formatNumber } from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { KsaReconDataResult } from "@/lib/data/ksaRecon";
import type { UaeReconDataResult } from "@/lib/data/uaeRecon";
import type { NormalizedReconOpportunity } from "@/lib/recon/types";

// ─── Render cap to keep static/ISR payload under Vercel limits ────────────────
const PRICE_DROP_RENDER_LIMIT = 150;

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

export type PriceDropRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

type PriceDropView = "all" | "strong" | "documented" | "stale";
type CategoryFilter = "all" | "residential_buy" | "residential_rent" | "commercial_buy" | "commercial_rent" | "short_rental" | "land";

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

// ─── Formatters ───────────────────────────────────────────────────────────
function formatCurrencyCompact(value: number, currency: string): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ${currency}`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k ${currency}`;
  return `${value} ${currency}`;
}

function formatDropPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatPriceLocation(value: string | null | undefined): string {
  if (!value) return "Unknown Location";

  return value
    .replace(/\|+/g, " · ")
    .replace(/\s*-\s*/g, " · ")
    .replace(/\s*\/\s*/g, " · ")
    .replace(/\s+/g, " ")
    .replace(/\s+·\s+/g, " · ")
    .trim();
}

function formatPropertyType(value: string | null | undefined): string | undefined {
  if (!value) return undefined;

  const cleaned = value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const lower = cleaned.toLowerCase();

  if (
    lower === "residential lands" ||
    lower === "residential land" ||
    lower === "lands" ||
    lower === "land" ||
    lower === "commercial lands" ||
    lower === "commercial land"
  ) {
    return "Land";
  }

  return cleaned
    .split(" ")
    .map((part) => part.length > 0 ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part)
    .join(" ");
}

function formatCategoryLabel(item: NormalizedReconOpportunity): string | undefined {
  const sc = (item.sourceCategory || "").toLowerCase();
  const pt = (item.propertyType || "").toLowerCase();

  if (sc.includes("short") || sc.includes("holiday") || pt.includes("short") || pt.includes("holiday")) return "Short Rental";
  if (sc.includes("land") || pt.includes("land")) return "Land";
  if (sc.includes("residential") && sc.includes("buy")) return "Residential Buy";
  if (sc.includes("residential") && sc.includes("rent")) return "Residential Rent";
  if (sc.includes("commercial") && sc.includes("buy")) return "Commercial Buy";
  if (sc.includes("commercial") && sc.includes("rent")) return "Commercial Rent";
  
  if (item.sourceCategory && item.sourceCategory.toLowerCase() !== "all") {
     return item.sourceCategory.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  }
  if (item.propertyType) {
     return formatPropertyType(item.propertyType);
  }
  return undefined;
}

function getItemCategoryFilter(item: NormalizedReconOpportunity): CategoryFilter {
  const sc = (item.sourceCategory || "").toLowerCase();
  const pt = (item.propertyType || "").toLowerCase();
  
  if (pt.includes("land") || sc.includes("land")) return "land";
  if (sc.includes("short") || sc.includes("holiday") || pt.includes("short") || pt.includes("holiday")) return "short_rental";
  if (sc.includes("commercial") && (sc.includes("buy") || sc.includes("sale"))) return "commercial_buy";
  if (sc.includes("commercial") && (sc.includes("rent") || sc.includes("lease"))) return "commercial_rent";
  if (sc.includes("residential") && (sc.includes("buy") || sc.includes("sale"))) return "residential_buy";
  if (sc.includes("residential") && (sc.includes("rent") || sc.includes("lease"))) return "residential_rent";
  
  if (sc.includes("commercial")) return "commercial_rent";
  if (sc.includes("buy") || sc.includes("sale")) return "residential_buy";
  if (sc.includes("rent") || sc.includes("lease")) return "residential_rent";
  
  return "all";
}

// ─── Location filter helpers ──────────────────────────────────────────────
function getLocationFilterLabel(item: NormalizedReconOpportunity): string {
  const rawCity = item.city?.trim();
  const rawDistrict = item.districtOrCommunity?.trim();

  const city = rawCity ? formatPriceLocation(rawCity) : undefined;
  const district = rawDistrict ? formatPriceLocation(rawDistrict) : undefined;

  if (city && district) return `${city} · ${district}`;
  if (city) return city;
  if (district) return district;

  const fallback = formatPriceLocation(item.locationLabel);
  if (!fallback || fallback.toLowerCase() === "unknown location") return "Unknown Location";
  return fallback;
}

function getLocationFilterKey(item: NormalizedReconOpportunity): string {
  const label = getLocationFilterLabel(item);
  if (!label || label.toLowerCase() === "unknown location") return "unknown";
  return label.toLowerCase().trim();
}

function getCityFilterKey(item: NormalizedReconOpportunity): string {
  const rawCity = item.city?.trim();
  if (!rawCity) return "unknown";
  const formatted = formatPriceLocation(rawCity);
  if (!formatted || formatted.toLowerCase() === "unknown location") return "unknown";
  return formatted.toLowerCase();
}

function cleanPriceTitle(item: NormalizedReconOpportunity): string {
  const title = item.title || item.subtitle || "";
  const location = formatPriceLocation(item.locationLabel);

  const lower = title.toLowerCase();
  
  if (
    lower.includes("owner/direct signal") ||
    lower.includes("price movement") ||
    lower.includes("refresh signal") ||
    lower.includes("price drop") ||
    lower.includes("stale") ||
    lower.includes("aged") ||
    lower.includes("signal +") ||
    lower.includes(" + ")
  ) {
    return location;
  }

  return title || location;
}

// ─── Competitor Lens helpers ─────────────────────────────────────────────
function getStringField(raw: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const val = raw[key];
    if (typeof val === "string" && val.trim() !== "") {
      return val.trim();
    }
  }
  return undefined;
}

function getActorSearchText(item: NormalizedReconOpportunity): string {
  const raw = item.raw as Record<string, unknown>;
  const parts: string[] = [];
  if (item.agencyName) parts.push(item.agencyName);
  if (item.agentName) parts.push(item.agentName);
  // include raw fields for completeness (agency/agent may be missing in normalized)
  const rawAgency = getStringField(raw, ["agency_name", "brokerage_name", "company_name"]);
  const rawAgent = getStringField(raw, ["agent_name"]);
  if (rawAgency && !parts.includes(rawAgency)) parts.push(rawAgency);
  if (rawAgent && !parts.includes(rawAgent)) parts.push(rawAgent);
  return parts.join(" ").toLowerCase().trim();
}

function hasAgencyActor(item: NormalizedReconOpportunity): boolean {
  const raw = item.raw as Record<string, unknown>;
  return Boolean(
    item.agencyName?.trim() ||
    getStringField(raw, ["agency_name"]) ||
    getStringField(raw, ["brokerage_name"]) ||
    getStringField(raw, ["company_name"])
  );
}

function hasOwnerDirectStyleSignal(item: NormalizedReconOpportunity): boolean {
  const raw = item.raw as Record<string, unknown>;
  const boolVal = getBooleanField(raw, ["has_owner_direct_signal", "is_owner_direct"]);
  if (boolVal) return true;

  const fields = ["owner_direct_bucket", "owner_direct_label", "owner_direct_confidence_tier", "direct_confidence_class"];
  for (const key of fields) {
    const val = getStringField(raw, [key]);
    if (val) {
      const lower = val.toLowerCase();
      // reject meaningless or explicitly negative values
      if (lower === "none" || lower === "no" || lower === "false" || lower === "low" || lower === "unknown") continue;
      // accept if contains any positive indicator
      if (/owner|direct|high|medium|likely|true/.test(lower)) return true;
    }
  }
  return false;
}

// ─── Dedupe Logic ───────────────────────────────────────────────────────────
function getPriceDisplayDedupeKey(item: NormalizedReconOpportunity): string {
  if (item.listingUrl) return `url:${item.listingUrl}`;
  const raw = item.raw as Record<string, unknown>;
  const oldPrice = getNumberField(raw, ["old_price"]) ?? item.oldPrice ?? 0;
  const newPrice = getNumberField(raw, ["new_price"]) ?? item.newPrice ?? item.price ?? 0;
  const dropAmount = getNumberField(raw, ["drop_amount", "price_drop_amount"]) ?? item.dropAmount ?? 0;
  const dropPct = getNumberField(raw, ["drop_pct", "price_drop_rate_pct"]) ?? item.dropPct ?? 0;
  const propType = formatPropertyType(item.propertyType) ?? "";
  const loc = formatPriceLocation(item.locationLabel);
  
  return [item.portal || "", loc, item.agencyName || "", oldPrice, newPrice, dropAmount, dropPct, propType].join("-").toLowerCase();
}

function dedupePriceDrops(items: NormalizedReconOpportunity[]): NormalizedReconOpportunity[] {
  const map = new Map<string, NormalizedReconOpportunity>();
  for (const item of items) {
    const key = getPriceDisplayDedupeKey(item);
    if (!map.has(key)) {
      map.set(key, item);
    } else {
      const existing = map.get(key)!;
      const extRaw = existing.raw as Record<string, unknown>;
      const itemRaw = item.raw as Record<string, unknown>;

      const extPct = getNumberField(extRaw, ["drop_pct", "price_drop_rate_pct"]) ?? existing.dropPct ?? 0;
      const itemPct = getNumberField(itemRaw, ["drop_pct", "price_drop_rate_pct"]) ?? item.dropPct ?? 0;
      
      if (itemPct > extPct) {
        map.set(key, item);
        continue;
      } else if (itemPct < extPct) {
        continue;
      }

      const extAmt = getNumberField(extRaw, ["drop_amount", "price_drop_amount"]) ?? existing.dropAmount ?? 0;
      const itemAmt = getNumberField(itemRaw, ["drop_amount", "price_drop_amount"]) ?? item.dropAmount ?? 0;

      if (itemAmt > extAmt) {
        map.set(key, item);
        continue;
      } else if (itemAmt < extAmt) {
        continue;
      }

      if (item.listingUrl && !existing.listingUrl) {
        map.set(key, item);
        continue;
      } else if (!item.listingUrl && existing.listingUrl) {
        continue;
      }

      if (item.agencyName && !existing.agencyName) {
        map.set(key, item);
        continue;
      }
    }
  }
  return Array.from(map.values());
}

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="price-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#price-grid)" />
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

function PriceDropCard({ item, idx, routeBase, currency }: { item: NormalizedReconOpportunity; idx: number; routeBase: string; currency: string }) {
  const raw = item.raw;
  const rank = idx + 1;

  const dropPct = getNumberField(raw, ["drop_pct", "price_drop_rate_pct"]) ?? item.dropPct;
  const dropAmount = getNumberField(raw, ["drop_amount", "price_drop_amount"]) ?? item.dropAmount;
  const oldPrice = getNumberField(raw, ["old_price"]) ?? item.oldPrice;
  const newPrice = getNumberField(raw, ["new_price"]) ?? item.newPrice ?? item.price;
  
  const trueAge = getNumberField(raw, ["effective_true_age_days"]);
  const isStale = getBooleanField(raw, ["is_stale", "is_old_inventory", "is_very_old_inventory"]) || (trueAge !== undefined && trueAge > 60) || item.signalBadges?.some(b => b.label.toLowerCase().includes("stale") || b.label.toLowerCase().includes("aged"));
  const isStrongDrop = dropPct !== undefined && dropPct >= 10;
  const isDocumented = dropAmount !== undefined || (oldPrice !== undefined && newPrice !== undefined);

  const agentName = item.agentName;
  const agencyName = item.agencyName;

  // Price Read
  let priceRead = "This listing shows public price-movement evidence. Verify the current advertised price before acting.";
  if (isStrongDrop) {
    priceRead = "This listing shows a strong advertised price reduction. Verify current source price before outreach.";
  } else if (dropAmount !== undefined) {
    priceRead = "This listing has documented public price movement. Review source and listing context before follow-up.";
  } else if (isStale) {
    priceRead = "Aged inventory with price movement can provide useful repricing context, but source verification is required.";
  }

  // Why this matters
  let actionText = "Use this as pricing context before outreach, negotiation review, or comparing nearby supply.";
  if (isStrongDrop) {
    actionText = "Larger advertised reductions can help agents prioritize pricing review, follow-up, or negotiation context.";
  } else if (isDocumented) {
    actionText = "Old/new price evidence gives stronger context than a generic price-drop label.";
  } else if (isStale) {
    actionText = "Older inventory with price movement may deserve closer review when Listing Truth also confirms age.";
  }

  // Category Badge
  const categoryBadge = formatCategoryLabel(item);

  // Pills
  const pillsToRender = [];
  
  if (dropPct !== undefined) {
    pillsToRender.push({ label: "Drop %", value: formatDropPercent(dropPct), tone: "rd" as const });
  }
  
  if (dropAmount !== undefined) {
    pillsToRender.push({ label: "Drop Amount", value: formatCurrencyCompact(dropAmount, currency), tone: "rd" as const });
  }
  
  if (oldPrice !== undefined) {
    pillsToRender.push({ label: "Old Price", value: formatCurrencyCompact(oldPrice, currency), tone: "neutral" as const });
  }
  
  if (newPrice !== undefined) {
    pillsToRender.push({ label: "Current Price", value: formatCurrencyCompact(newPrice, currency), tone: "neutral" as const });
  } else if (item.price !== null) {
    pillsToRender.push({ label: "Current Price", value: formatCurrencyCompact(item.price, currency), tone: "neutral" as const });
  }
  
  if (item.portal) {
    pillsToRender.push({ label: "Portal", value: item.portal, tone: "neutral" as const });
  }
  
  const displayPropertyType = formatPropertyType(item.propertyType);
  if (displayPropertyType && pillsToRender.length < 5) {
    pillsToRender.push({ label: "Type", value: displayPropertyType, tone: "neutral" as const });
  }

  const finalPills = pillsToRender.slice(0, 5);
  
  const toneColor = isStrongDrop ? C.rdHi : isStale ? C.amHi : C.cyHi;
  const badgeLabel = isStrongDrop ? "Strong Drop" : isStale ? "Stale + Drop" : "Price Movement";

  const displayTitle = cleanPriceTitle(item);
  const formattedLocation = formatPriceLocation(item.locationLabel);

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
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
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
          {categoryBadge && (
            <span 
              className="inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest leading-none shadow-sm"
              style={{
                color: C.t3,
                background: "rgba(255,255,255,0.02)",
                borderColor: C.borderSub,
              }}
            >
              {categoryBadge}
            </span>
          )}
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
        
        {priceRead && (
          <p className="text-[13px] leading-relaxed font-medium mb-3" style={{ color: C.t3 }}>
            {priceRead}
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
              className="text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80 rounded-full border px-2.5 py-1"
              style={{
                color: toneColor,
                borderColor: toneColor,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(4px)"
              }}
            >
              Verify Source
            </a>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>
              Source Unavailable
            </span>
          )}
          
          <Link
            href={`${routeBase}/listing-age`}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: item.listingUrl ? C.t4 : toneColor }}
          >
            Review Listing Truth
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function PriceDropRadarPage({
  country,
  data,
}: PriceDropRadarPageProps) {
  const isUae = country.slug === "uae";
  
  const [activeLane, setActiveLane] = useState<PriceDropView>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [actorQuery, setActorQuery] = useState("");
  const [actorFilter, setActorFilter] = useState<"all" | "agency" | "owner_direct">("all");

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
      addItems(uData.lists.priceDrops?.items as Record<string, unknown>[] | undefined, uData.lists.priceDrops?.source_table);
      addItems(uData.lists.stalePriceDrops?.items as Record<string, unknown>[] | undefined, uData.lists.stalePriceDrops?.source_table);
    } else {
      const kData = data as KsaReconDataResult;
      addItems(kData.lists.priceDrops?.items as Record<string, unknown>[] | undefined, kData.lists.priceDrops?.source_table);
    }

    return results;
  }, [country.slug, data, isUae]);

  const dedupedPriceDrops = useMemo(() => dedupePriceDrops(allNormalized), [allNormalized]);

  const cityOptions = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const item of dedupedPriceDrops) {
      const key = getCityFilterKey(item);
      if (key === "unknown") continue;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        const rawCity = item.city?.trim();
        const label = rawCity ? formatPriceLocation(rawCity) : key;
        map.set(key, { label, count: 1 });
      }
    }
    return Array.from(map.entries())
      .map(([value, { label, count }]) => ({ value, label, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 5);
  }, [dedupedPriceDrops]);

  const locationOptions = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const item of dedupedPriceDrops) {
      const key = getLocationFilterKey(item);
      if (key === "unknown") continue;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        const label = getLocationFilterLabel(item);
        map.set(key, { label, count: 1 });
      }
    }
    return Array.from(map.entries())
      .map(([value, { label, count }]) => ({ value: `loc:${value}`, label, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 40);
  }, [dedupedPriceDrops]);

  const filteredItems = useMemo(() => {
    const query = actorQuery.trim().toLowerCase();
    return dedupedPriceDrops.filter(item => {
      // Lane filter
      let laneMatch = false;
      if (activeLane === "all") laneMatch = true;
      else {
        const raw = item.raw;
        const trueAge = getNumberField(raw, ["effective_true_age_days"]);
        const isStale = getBooleanField(raw, ["is_stale", "is_old_inventory", "is_very_old_inventory"]) || (trueAge !== undefined && trueAge > 60) || item.signalBadges?.some(b => b.label.toLowerCase().includes("stale") || b.label.toLowerCase().includes("aged"));
        const dropPct = getNumberField(raw, ["drop_pct", "price_drop_rate_pct"]) ?? item.dropPct ?? 0;
        const dropAmount = getNumberField(raw, ["drop_amount", "price_drop_amount"]) ?? item.dropAmount;
        const oldPrice = getNumberField(raw, ["old_price"]) ?? item.oldPrice;
        const newPrice = getNumberField(raw, ["new_price"]) ?? item.newPrice ?? item.price;
        
        const isStrongDrop = dropPct >= 10;
        const isDocumented = dropAmount !== undefined || (oldPrice !== undefined && newPrice !== undefined);

        if (activeLane === "strong") laneMatch = isStrongDrop;
        else if (activeLane === "documented") laneMatch = isDocumented;
        else if (activeLane === "stale") laneMatch = isStale;
      }

      // Category filter
      let catMatch = false;
      if (categoryFilter === "all") {
        catMatch = true;
      } else {
        catMatch = getItemCategoryFilter(item) === categoryFilter;
      }

      // Location filter
      let locationMatch = false;
      if (locationFilter === "all") locationMatch = true;
      else if (locationFilter.startsWith("city:")) {
        const cityKey = locationFilter.slice(5);
        locationMatch = getCityFilterKey(item) === cityKey;
      } else if (locationFilter.startsWith("loc:")) {
        const locKey = locationFilter.slice(4);
        locationMatch = getLocationFilterKey(item) === locKey;
      } else {
        // legacy fallback
        locationMatch = getLocationFilterKey(item) === locationFilter;
      }

      // Competitor Lens filter
      let actorMatch = true;
      if (query) {
        const searchText = getActorSearchText(item);
        actorMatch = searchText.includes(query);
      }
      if (actorMatch && actorFilter !== "all") {
        if (actorFilter === "agency") actorMatch = hasAgencyActor(item);
        else if (actorFilter === "owner_direct") actorMatch = hasOwnerDirectStyleSignal(item);
      }

      return laneMatch && catMatch && locationMatch && actorMatch;
    });
  }, [dedupedPriceDrops, activeLane, categoryFilter, locationFilter, actorQuery, actorFilter]);

  const visibleCards = filteredItems.slice(0, PRICE_DROP_RENDER_LIMIT);

  // Overview Metrics based on dedupedPriceDrops
  const totalSignalsCount = dedupedPriceDrops.length;
  
  const strongDropsCount = dedupedPriceDrops.filter(item => {
    const raw = item.raw;
    const dropPct = getNumberField(raw, ["drop_pct", "price_drop_rate_pct"]) ?? item.dropPct ?? 0;
    return dropPct >= 10;
  }).length;

  const documentedDropsCount = dedupedPriceDrops.filter(item => {
    const raw = item.raw;
    const dropAmount = getNumberField(raw, ["drop_amount", "price_drop_amount"]) ?? item.dropAmount;
    const oldPrice = getNumberField(raw, ["old_price"]) ?? item.oldPrice;
    const newPrice = getNumberField(raw, ["new_price"]) ?? item.newPrice ?? item.price;
    return dropAmount !== undefined || (oldPrice !== undefined && newPrice !== undefined);
  }).length;

  const staleDropsCount = dedupedPriceDrops.filter(item => {
    const raw = item.raw;
    const trueAge = getNumberField(raw, ["effective_true_age_days"]);
    return getBooleanField(raw, ["is_stale", "is_old_inventory", "is_very_old_inventory"]) || (trueAge !== undefined && trueAge > 60) || item.signalBadges?.some(b => b.label.toLowerCase().includes("stale") || b.label.toLowerCase().includes("aged"));
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
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
          
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
                style={{ color: C.rdHi, background: "rgba(244,63,94,0.1)", border: `1px solid rgba(244,63,94,0.2)` }}
              >
                <TrendingDown className="h-3.5 w-3.5" />
                Price Drop Radar
              </span>
            </div>

            <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
              No price-drop signals available
            </h1>
            
            <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
              No public price-drop signals are available in this workspace snapshot.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                href={`${country.routeBase}/activity-feed`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
                style={{ 
                  background: "linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)", 
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(225,29,72,0.25)" 
                }}
              >
                Open Recent Market Movement
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              
              <Link
                href={`${country.routeBase}/listing-age`}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
                style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                Open Listing Truth
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const categoryOptions: { value: CategoryFilter, label: string }[] = [
    { value: "all", label: "All Categories" },
    { value: "residential_buy", label: "Residential Buy" },
    { value: "residential_rent", label: "Residential Rent" },
    { value: "commercial_buy", label: "Commercial Buy" },
    { value: "commercial_rent", label: "Commercial Rent" },
    { value: "short_rental", label: "Short Rental" },
    { value: "land", label: "Land" },
  ];

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
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.rdHi, background: "rgba(244,63,94,0.1)", border: `1px solid rgba(244,63,94,0.2)` }}
            >
              <TrendingDown className="h-3.5 w-3.5" />
              Price Drop Radar
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            Where Did Prices Move?
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Review public price-drop signals, advertised price changes, and repricing context before deciding which listings deserve follow-up.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                document.getElementById('price-drop-list')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(225,29,72,0.25)" 
              }}
            >
              Review Price Drops
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            
            <Link
              href={`${country.routeBase}/listing-age`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Listing Truth
            </Link>

            <Link
              href={`${country.routeBase}/inventory-pressure`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Supply Pressure
            </Link>

            <Link
              href={`${country.routeBase}/activity-feed`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Recent Market Movement
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Overview Cards ─────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.rdHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Pricing Overview
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Price Drop Signals"
            value={formatNumber(totalSignalsCount)}
            description="Total visible items analyzed."
            icon={<ShieldCheck className="h-5 w-5" />}
            accentColor={C.cyHi}
            href="#price-drop-list"
            ctaLabel="View Signals"
          />
          <SnapshotCard
            title="Strong Drops"
            value={formatNumber(strongDropsCount)}
            description="Listings with reductions over 10%."
            icon={<TrendingDown className="h-5 w-5" />}
            accentColor={C.rdHi}
            href="#price-drop-list"
            ctaLabel="Review Strong Drops"
          />
          <SnapshotCard
            title="Documented Drops"
            value={formatNumber(documentedDropsCount)}
            description="Items with old/new price evidence."
            icon={<BarChart2 className="h-5 w-5" />}
            accentColor={C.emHi}
            href="#price-drop-list"
            ctaLabel="View Evidence"
          />
          <SnapshotCard
            title="Stale + Dropped"
            value={formatNumber(staleDropsCount)}
            description="Aged inventory with price movement."
            icon={<Clock className="h-5 w-5" />}
            accentColor={C.amHi}
            href="#price-drop-list"
            ctaLabel="Find Follow-ups"
          />
        </div>
      </section>

      {/* ── 3. Insight Panels ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Pricing Intelligence
          </h2>
        </div>

        <IntelligencePanel
          title="Strong Price Movement"
          purpose="Find listings with larger advertised price reductions."
          agentUseText="Use this to prioritize follow-up on listings that have shown significant repricing activity."
          chips={["Strong drops", "Repricing", "Follow-up opportunities"]}
          icon={<TrendingDown className="h-5 w-5" />}
          accentColor={C.rdHi}
          primaryAction={{ label: "View Strong Drops", onClick: () => setActiveLane("strong") }}
        />

        <IntelligencePanel
          title="Documented Drop Evidence"
          purpose="Review listings where old/new price or drop amount is available."
          agentUseText="Use this to gain precise context on pricing changes before initiating a conversation."
          chips={["Price evidence", "Drop amount", "Old/new price"]}
          icon={<BarChart2 className="h-5 w-5" />}
          accentColor={C.emHi}
          primaryAction={{ label: "View Documented Drops", onClick: () => setActiveLane("documented") }}
        />

        {(isUae || staleDropsCount > 0) && (
          <IntelligencePanel
            title="Stale + Price Drop"
            purpose="Combine aged inventory and price movement for stronger follow-up context."
            agentUseText="Use this to identify older inventory with repricing context before prioritizing follow-up."
            chips={["Aged inventory", "Price movement", "Negotiation context"]}
            icon={<Clock className="h-5 w-5" />}
            accentColor={C.amHi}
            primaryAction={{ label: "Review Stale Inventory", onClick: () => setActiveLane("stale") }}
          />
        )}
      </section>

      {/* ── Filter Selectors ────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 pt-2">
        {/* Row 1: signal type buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveLane("all")}
            className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
            style={{
              background: activeLane === "all" ? C.rdHi : "rgba(255,255,255,0.05)",
              color: activeLane === "all" ? "#000" : C.t2,
            }}
          >
            All Price Drops
          </button>
          <button
            onClick={() => setActiveLane("strong")}
            className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
            style={{
              background: activeLane === "strong" ? C.rdHi : "rgba(255,255,255,0.05)",
              color: activeLane === "strong" ? "#000" : C.t2,
            }}
          >
            Strong Drops
          </button>
          <button
            onClick={() => setActiveLane("documented")}
            className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
            style={{
              background: activeLane === "documented" ? C.rdHi : "rgba(255,255,255,0.05)",
              color: activeLane === "documented" ? "#000" : C.t2,
            }}
          >
            Documented Drops
          </button>
          {(isUae || staleDropsCount > 0) && (
            <button
              onClick={() => setActiveLane("stale")}
              className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
              style={{
                background: activeLane === "stale" ? C.rdHi : "rgba(255,255,255,0.05)",
                color: activeLane === "stale" ? "#000" : C.t2,
              }}
            >
              Stale + Dropped
            </button>
          )}
        </div>

        {/* Row 2: location row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All locations */}
          <button
            onClick={() => setLocationFilter("all")}
            className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
            style={{
              background: locationFilter === "all" ? C.rdHi : "rgba(255,255,255,0.05)",
              color: locationFilter === "all" ? "#000" : C.t2,
              border: `1px solid ${locationFilter === "all" ? "transparent" : C.borderSub}`,
            }}
          >
            All locations
          </button>

          {/* city chips */}
          {cityOptions.map((city) => {
            const cityValue = `city:${city.value}`;
            const isActive = locationFilter === cityValue;
            return (
              <button
                key={cityValue}
                onClick={() => setLocationFilter(cityValue)}
                className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{
                  background: isActive ? C.rdHi : "rgba(255,255,255,0.05)",
                  color: isActive ? "#000" : C.t2,
                  border: `1px solid ${isActive ? "transparent" : C.borderSub}`,
                }}
              >
                {city.label} ({city.count})
              </button>
            );
          })}

          {/* More locations select */}
          <div className="relative inline-block">
            <select
              value={locationFilter.startsWith("loc:") ? locationFilter : ""}
              onChange={(e) => setLocationFilter(e.target.value || "all")}
              className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: C.t2,
                border: `1px solid ${C.borderSub}`,
                backdropFilter: "blur(8px)",
                paddingRight: "2rem",
              }}
            >
              <option value="">Districts / more locations</option>
              {locationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.count})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.t4 }}>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Row 3: Competitor Lens */}
        <div
          className="rounded-xl border p-4 flex flex-col md:flex-row md:items-center gap-3"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub, backdropFilter: "blur(10px)" }}
        >
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-bold text-white">Competitor Lens</h3>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: C.t4 }}>
              Filter public price drops by agency, agent, or owner/direct-style signal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search input */}
            <div className="relative w-full md:min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: C.t4 }} />
              <input
                type="text"
                value={actorQuery}
                onChange={(e) => setActorQuery(e.target.value)}
                placeholder="Search agency or agent…"
                className="w-full rounded-full pl-9 pr-4 py-1.5 text-[12px] font-medium placeholder:text-white/30 border outline-none transition-all focus:border-white/20"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: C.t2,
                  borderColor: C.borderSub,
                }}
              />
            </div>
            {/* Actor filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActorFilter("all")}
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{
                  background: actorFilter === "all" ? C.rdHi : "rgba(255,255,255,0.05)",
                  color: actorFilter === "all" ? "#000" : C.t2,
                  border: `1px solid ${actorFilter === "all" ? "transparent" : C.borderSub}`,
                }}
              >
                All actors
              </button>
              <button
                onClick={() => setActorFilter("agency")}
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{
                  background: actorFilter === "agency" ? C.rdHi : "rgba(255,255,255,0.05)",
                  color: actorFilter === "agency" ? "#000" : C.t2,
                  border: `1px solid ${actorFilter === "agency" ? "transparent" : C.borderSub}`,
                }}
              >
                Agencies only
              </button>
              <button
                onClick={() => setActorFilter("owner_direct")}
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{
                  background: actorFilter === "owner_direct" ? C.rdHi : "rgba(255,255,255,0.05)",
                  color: actorFilter === "owner_direct" ? "#000" : C.t2,
                  border: `1px solid ${actorFilter === "owner_direct" ? "transparent" : C.borderSub}`,
                }}
              >
                Owner/direct-style
              </button>
            </div>
          </div>
        </div>

        {/* Row 4: category chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b" style={{ borderColor: C.borderSub }}>
          {categoryOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setCategoryFilter(opt.value)}
              className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
              style={{
                background: categoryFilter === opt.value ? "rgba(255,255,255,0.15)" : "transparent",
                color: categoryFilter === opt.value ? C.t1 : C.t4,
                border: `1px solid ${categoryFilter === opt.value ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.05)"}`
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. Main Price Drop List ─────────────────────────────────── */}
      <section id="price-drop-list" className="scroll-mt-10 pt-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-5 w-5" style={{ color: C.rdHi }} />
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
              Price Drop Signals
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
              <PriceDropCard 
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
              Try selecting a different price movement, location, category, or competitor filter.
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
              Public price-movement evidence
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t1 }}>
              <CheckCircle2 className="h-4 w-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ color: C.emHi }} />
              Verify source before action
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <ShieldCheck className="h-3.5 w-3.5 opacity-70" style={{ color: C.t3 }} />
              Price signals are not seller-intent claims
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