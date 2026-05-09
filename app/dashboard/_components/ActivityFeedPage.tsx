// app/dashboard/_components/ActivityFeedPage.tsx
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Globe2,
  Layers,
  MapPinned,
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
  const special = ["aed", "sar", "uae", "ksa"];
  return words
    .map((w) => (special.includes(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function getMovementProductLabel(card: Module5Record): string {
  const haystack = [
    getStringField(card, ["activity_type"]),
    getStringField(card, ["activity_label"]),
    getStringField(card, ["card_subtype"]),
    getStringField(card, ["card_title"]),
    getStringField(card, ["activity_summary"]),
    getStringField(card, ["card_summary"]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (haystack.includes("dominance") || haystack.includes("share") || haystack.includes("concentration")) {
    return "Competitive Movement";
  }
  if (haystack.includes("agency") || haystack.includes("portfolio")) {
    return "Agency Movement";
  }
  if (haystack.includes("price") || haystack.includes("drop") || haystack.includes("repricing")) {
    return "Price Movement";
  }
  if (haystack.includes("pressure")) {
    return "Supply Pressure";
  }
  if (haystack.includes("recon") || haystack.includes("recently detected") || haystack.includes("direct") || haystack.includes("opportunity")) {
    return "Deal Movement";
  }
  if (haystack.includes("community") || haystack.includes("district") || haystack.includes("location")) {
    return "Area Movement";
  }

  return "Market Movement";
}

function buildMovementDedupeKey(record: Module5Record): string {
  const title = formatDisplayLabel(
    getStringField(record, ["activity_label", "card_title", "location_label", "name"])
  );
  const type = formatDisplayLabel(
    getStringField(record, ["activity_type", "card_subtype", "type"])
  );
  const date = getStringField(record, ["activity_date", "activity_at", "evidence_date", "generated_at"]);
  const city = formatDisplayLabel(getStringField(record, ["city"]));
  const loc = formatDisplayLabel(
    getStringField(record, ["community", "community_name", "district", "district_name", "building_name", "building"])
  );
  const agency = formatDisplayLabel(
    getStringField(record, ["agency_name", "agency_display_name", "top_agency_name"])
  );
  const sourceUrl = getStringField(record, ["source_url", "source_record_key", "canonical_id"]);

  const parts = [title, type, date, city, loc, agency, sourceUrl].filter(Boolean);
  return parts.join("-").toLowerCase();
}

function buildMovementReactKey(record: Module5Record, idx: number): string {
  const baseKey = buildMovementDedupeKey(record);
  return `${baseKey || "movement"}-${idx}`;
}

// ─── Overview Count Helpers ───────────────────────────────────────────────
const matchesMovementCategory = (card: Module5Record, terms: string[]): boolean => {
  const haystack = [
    getStringField(card, ["activity_type"]),
    getStringField(card, ["activity_label"]),
    getStringField(card, ["card_subtype"]),
    getStringField(card, ["card_title"]),
    getStringField(card, ["activity_summary"]),
    getStringField(card, ["card_summary"]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return terms.some((term) => haystack.includes(term));
};

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="movement-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#movement-grid)" />
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
    <div className="flex items-center gap-1.5 rounded-md px-2 py-1 border" style={{ background: c.bg, borderColor: c.border }}>
      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>{label}:</span>
      <span 
        className={`text-[11px] font-bold tabular-nums ${truncate ? "max-w-[120px] truncate" : ""}`} 
        style={{ color: c.text }} 
        title={typeof value === 'string' ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function MovementCard({ card, idx, routeBase, currency }: { card: Module5Record; idx: number; routeBase: string; currency: string }) {
  // Title Priority
  const rawTitle = getStringField(card, [
    "agency_name",
    "agency_display_name",
    "top_agency_name",
    "card_title",
    "activity_label",
    "location_label",
    "name"
  ]);
  const title = rawTitle ? formatDisplayLabel(rawTitle) : "Market movement signal";

  const productLabel = getMovementProductLabel(card);
  const sourceCategory = humanizeToken(getStringField(card, ["source_category", "category"]));

  const dateLabel = getStringField(card, ["activity_date", "activity_at", "evidence_date", "generated_at"]);
  const priority = humanizeToken(getStringField(card, ["activity_priority_label", "priority_label"]));

  // Location Context
  const city = formatDisplayLabel(getStringField(card, ["city"]));
  const community = formatDisplayLabel(getStringField(card, ["community_name", "community"]));
  const buildingName = formatDisplayLabel(getStringField(card, ["building_name", "building"]));
  const district = formatDisplayLabel(getStringField(card, ["district_name", "district"]));
  
  const locationContext = [city, community, buildingName].filter(Boolean).join(" · ") || [city, district].filter(Boolean).join(" · ");
  
  // Subtitle
  const subtitleParts = [sourceCategory, productLabel, locationContext].filter(Boolean);
  const subtitle = subtitleParts.join(" · ");

  // Metrics Extraction
  const score = getNumberField(card, ["activity_score"]);
  const pressureScore = getNumberField(card, ["pressure_score", "inventory_pressure_score"]);
  const dropPct = getNumberField(card, ["drop_pct", "avg_drop_pct", "price_drop_rate_pct"]);
  const price = getNumberField(card, ["price", "avg_price"]);
  const pricePerSqft = getNumberField(card, ["price_per_sqft", "avg_price_per_sqft"]);
  const pressureBucket = humanizeToken(getStringField(card, ["pressure_bucket"]));
  const confidence = humanizeToken(getStringField(card, ["confidence_tier", "confidence"]));
  const agencyName = formatDisplayLabel(getStringField(card, ["agency_name", "agency_display_name", "top_agency_name"]));

  // Metric Pills Logic (Max 4)
  const availableMetrics: Record<string, { label: string; value: string | number; tone?: "neutral"|"rd"|"am"|"cy"|"em"; truncate?: boolean }> = {};
  
  if (score !== undefined) availableMetrics["score"] = { label: "Score", value: score.toFixed(1), tone: "cy" };
  if (pressureScore !== undefined) availableMetrics["pressure"] = { label: "Pressure", value: pressureScore.toFixed(1), tone: "am" };
  if (dropPct !== undefined) availableMetrics["drop"] = { label: "Drop", value: formatPercent(dropPct), tone: "rd" };
  if (price !== undefined) availableMetrics["price"] = { label: "Price", value: formatCurrencyCompact(price, currency) };
  if (pricePerSqft !== undefined) availableMetrics["priceSqft"] = { label: `${currency}/sqft`, value: formatNumber(pricePerSqft) };
  if (pressureBucket) availableMetrics["bucket"] = { label: "Bucket", value: pressureBucket, tone: "am" };
  if (confidence) availableMetrics["confidence"] = { label: "Confidence", value: confidence, tone: "em" };
  if (agencyName && agencyName.toLowerCase() !== title.toLowerCase()) {
    availableMetrics["agency"] = { label: "Agency", value: agencyName, truncate: true };
  }

  let preferredKeys: string[] = [];
  if (productLabel.includes("Agency")) preferredKeys = ["score", "drop", "price", "confidence"];
  else if (productLabel.includes("Price")) preferredKeys = ["drop", "price", "priceSqft", "score"];
  else if (productLabel.includes("Pressure")) preferredKeys = ["pressure", "bucket", "score", "drop"];
  else if (productLabel.includes("Competitive")) preferredKeys = ["score", "pressure", "bucket", "confidence"];
  else preferredKeys = ["score", "price", "drop", "confidence"];

  const pillsToRender = [];
  const usedKeys = new Set<string>();

  for (const k of preferredKeys) {
    if (availableMetrics[k]) {
      pillsToRender.push(availableMetrics[k]);
      usedKeys.add(k);
    }
  }

  if (pillsToRender.length < 4) {
    for (const k of Object.keys(availableMetrics)) {
      if (availableMetrics[k] && !usedKeys.has(k)) {
        pillsToRender.push(availableMetrics[k]);
        usedKeys.add(k);
        if (pillsToRender.length >= 4) break;
      }
    }
  }

  // Summary & Action
  const rawSummary = getStringField(card, ["activity_summary", "card_summary", "summary", "description"]);
  const displaySummary = (rawSummary && rawSummary.toLowerCase().trim() !== title.toLowerCase().trim()) ? rawSummary : undefined;
  
  const actionText = getStringField(card, ["recommended_action", "product_note"]);
  const rank = idx + 1;

  // CTA Routing
  const routeHint = `${productLabel} ${title} ${displaySummary || ""}`.toLowerCase();
  
  let ctaLabel = "Review Market Radar";
  let ctaHref = `${routeBase}/market-radar`;
  let toneColor: string = C.cyHi;

  if (routeHint.includes("dominance") || routeHint.includes("share") || routeHint.includes("concentration") || productLabel === "Competitive Movement") {
    ctaLabel = "Review Market Dominance";
    ctaHref = `${routeBase}/market-dominance`;
    toneColor = C.amHi;
  } else if (routeHint.includes("agency") || routeHint.includes("portfolio") || productLabel === "Agency Movement") {
    ctaLabel = "Review Agency Profiles";
    ctaHref = `${routeBase}/agency-profiles`;
    toneColor = C.rdHi;
  } else if (routeHint.includes("price") || routeHint.includes("drop") || routeHint.includes("repricing") || productLabel === "Price Movement") {
    ctaLabel = "Review Price Drops";
    ctaHref = `${routeBase}/price-drops`;
    toneColor = C.rdHi;
  } else if (routeHint.includes("pressure") || productLabel === "Supply Pressure") {
    ctaLabel = "Review Supply Pressure";
    ctaHref = `${routeBase}/inventory-pressure`;
    toneColor = C.amHi;
  } else if (routeHint.includes("recon") || routeHint.includes("recently detected") || routeHint.includes("direct") || routeHint.includes("opportunity") || productLabel === "Deal Movement") {
    ctaLabel = "Review Deal Radar";
    ctaHref = `${routeBase}/recon`;
    toneColor = C.emHi;
  } else if (routeHint.includes("community") || routeHint.includes("district") || routeHint.includes("location") || productLabel === "Area Movement") {
    ctaLabel = "Review Communities";
    ctaHref = `${routeBase}/communities`;
    toneColor = C.emHi;
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
        style={{ background: toneColor, boxShadow: `0 0 10px ${toneColor}` }} 
      />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        
        {/* Top Row: Badges & Date */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
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
                background: "rgba(255,255,255,0.04)",
                borderColor: C.borderSub,
              }}
            >
              {productLabel}
            </span>
            {priority && (
              <span
                className="rounded px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-widest"
                style={{ color: C.t1, background: "rgba(255,255,255,0.1)", border: `1px solid rgba(255,255,255,0.2)` }}
              >
                {priority}
              </span>
            )}
          </div>
          {dateLabel && (
            <div className="flex items-center gap-1.5 shrink-0" style={{ color: C.t4 }}>
              <Clock className="h-3 w-3" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{dateLabel}</span>
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-[17px] font-extrabold text-white tracking-tight mb-1">
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
              <MetricPill key={i} label={p.label} value={p.value} tone={p.tone} truncate={p.truncate} />
            ))}
          </div>
        )}
        
        {/* Summary */}
        {displaySummary && (
          <p className="text-[13px] leading-relaxed font-medium mb-2" style={{ color: C.t3 }}>
            {displaySummary}
          </p>
        )}

        {/* Action Box */}
        {actionText && (
          <div className="mt-3 rounded-xl border p-3.5 mb-2" style={{ background: "rgba(0,0,0,0.18)", borderColor: C.borderSub }}>
            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: toneColor }}>
              Why this matters
            </span>
            <p className="text-[12.5px] leading-relaxed font-medium" style={{ color: C.t2 }}>
              {actionText}
            </p>
          </div>
        )}

        {/* Footer Row (CTA) */}
        <div className="mt-auto pt-4 border-t flex items-center justify-end" style={{ borderColor: C.borderSub }}>
          <Link
            href={ctaHref}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: toneColor }}
          >
            {ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function ActivityFeedPage({
  country,
  data,
}: {
  country: CountryConfig;
  data: Module5DataResult;
}) {
  const rawCards = (data.activityFeed?.items ?? []) as Module5Record[];

  // Deduplicate and filter out generic placeholder titles
  const validCards: Module5Record[] = [];
  const seenKeys = new Set<string>();

  for (const card of rawCards) {
    const rawTitle = getStringField(card, ["activity_label", "card_title", "location_label", "name"]);
    const title = rawTitle ? formatDisplayLabel(rawTitle) : undefined;
    const lowerTitle = title?.toLowerCase().trim();

    // Skip empty or generic placeholders
    if (!lowerTitle || lowerTitle === "activity" || lowerTitle === "movement") {
      continue;
    }

    let dedupeKey = buildMovementDedupeKey(card);
    if (!dedupeKey) {
      dedupeKey = `movement-${validCards.length}`;
    }

    if (!seenKeys.has(dedupeKey)) {
      seenKeys.add(dedupeKey);
      validCards.push(card);
    }
  }

  // Sort logic
  const sortedCards = [...validCards].sort((a, b) => {
    const scoreA = getNumberField(a, ["activity_score"]) ?? 0;
    const scoreB = getNumberField(b, ["activity_score"]) ?? 0;

    if (scoreB !== scoreA) return scoreB - scoreA;

    const rankA = getNumberField(a, ["dashboard_rank"]) ?? 0;
    const rankB = getNumberField(b, ["dashboard_rank"]) ?? 0;

    return rankB - rankA;
  });

  // Metrics overview counts
  const totalActivityCount = validCards.length;

  const priceMovementCount = validCards.filter((card) =>
    matchesMovementCategory(card, ["price", "drop", "repricing"])
  ).length;

  const agencyMovementCount = validCards.filter((card) =>
    matchesMovementCategory(card, ["agency", "portfolio", "dominance", "share", "concentration"])
  ).length;

  const areaWatchCount = validCards.filter((card) => {
    const city = getStringField(card, ["city"]);
    const community = getStringField(card, ["community_name", "community"]);
    const district = getStringField(card, ["district_name", "district"]);
    const building = getStringField(card, ["building_name", "building"]);
    return !!city && !!(community || district || building);
  }).length;
  
  // Display limit
  const visibleCards = sortedCards.slice(0, 15);

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
              <Activity className="h-3.5 w-3.5" />
              Recent Market Movement
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            What Changed in the Market?
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Review recent public listing activity, price movement, and agency/market signals from the latest workspace snapshot.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href="#recent-movement"
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(6,182,212,0.25)" 
              }}
            >
              Review Latest Movement
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
              href={`${country.routeBase}/communities`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Communities to Monitor
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

      {/* ── 2. Movement Summary Cards ─────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.cyHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Movement Overview
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Latest Activity"
            value={formatNumber(totalActivityCount)}
            description="Track recent public listing changes."
            icon={<Globe2 className="h-5 w-5" />}
            accentColor={C.cyHi}
            href="#recent-movement"
            ctaLabel="View Activity"
          />
          <SnapshotCard
            title="Price Movement"
            value={formatNumber(priceMovementCount)}
            description="Spot repricing signals and price drops."
            icon={<TrendingDown className="h-5 w-5" />}
            accentColor={C.amHi}
            href="#recent-movement"
            ctaLabel="Review Pricing"
          />
          <SnapshotCard
            title="Agency Movement"
            value={formatNumber(agencyMovementCount)}
            description="Monitor visible competitor operational changes."
            icon={<Users className="h-5 w-5" />}
            accentColor={C.rdHi}
            href={`${country.routeBase}/agency-profiles`}
            ctaLabel="Track Agencies"
          />
          <SnapshotCard
            title="Areas to Watch"
            value={formatNumber(areaWatchCount)}
            description="Identify active communities and locations."
            icon={<MapPinned className="h-5 w-5" />}
            accentColor={C.emHi}
            href={`${country.routeBase}/communities`}
            ctaLabel="Find Open Markets"
          />
        </div>
      </section>

      {/* ── 3. Insight Panels ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Movement Intelligence
          </h2>
        </div>

        <IntelligencePanel
          title="Fresh Activity"
          purpose="Catch recent public listing changes and visible market movement as they happen."
          agentUseText="Use this to catch new public listing activity before manually browsing portals."
          chips={["New activity", "Market changes", "Latest signals"]}
          icon={<Calendar className="h-5 w-5" />}
          accentColor={C.cyHi}
          primaryCta={{ label: "View Fresh Activity", href: "#recent-movement" }}
        />

        <IntelligencePanel
          title="Price Movement"
          purpose="Spot recent price-drop or repricing signals across public markets."
          agentUseText="Use this to identify motivated sellers and emerging price pressure early."
          chips={["Price drops", "Repricing", "Motivated sellers"]}
          icon={<TrendingDown className="h-5 w-5" />}
          accentColor={C.amHi}
          primaryCta={{ label: "Check Price Movement", href: "#recent-movement" }}
        />

        <IntelligencePanel
          title="Agency & Market Movement"
          purpose="Track visible activity patterns that may matter for farming or competitor monitoring."
          agentUseText="Use this to monitor which competitors are gaining traction and where to focus your efforts."
          chips={["Agency movement", "Market shifts", "Competitor footprint"]}
          icon={<Building2 className="h-5 w-5" />}
          accentColor={C.rdHi}
          primaryCta={{ label: "Monitor Agencies", href: "#recent-movement" }}
        />
      </section>

      {/* ── 4. Main Recent Movement List ─────────────────────────────────── */}
      <section id="recent-movement" className="scroll-mt-10 pt-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5" style={{ color: C.cyHi }} />
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
              Recent Market Movement
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
          <div className="space-y-4">
            {visibleCards.map((card, idx) => (
              <MovementCard 
                key={buildMovementReactKey(card, idx)} 
                idx={idx} 
                card={card} 
                routeBase={country.routeBase} 
                currency={country.currency} 
              />
            ))}
          </div>
        ) : rawCards.length > 0 ? (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">Movement signals available — labels incomplete</p>
            <p className="mt-2 max-w-lg mx-auto text-[13px] font-medium" style={{ color: C.t4 }}>
              This workspace snapshot contains movement signals, but the labels are not complete enough to display reliable activity cards.
            </p>
          </div>
        ) : (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">No recent movement available</p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: C.t4 }}>
              No recent movement signals are available in this workspace snapshot.
            </p>
          </div>
        )}

        {validCards.length > visibleCards.length && (
          <p className="mt-6 text-center text-[13px] font-bold" style={{ color: C.t4 }}>
            Showing latest {visibleCards.length} of {formatNumber(validCards.length)} movement signals
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
              Movement is based on visible public listing activity
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