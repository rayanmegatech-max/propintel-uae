// app/dashboard/_components/InventoryPressurePage.tsx
"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Gauge,
  Globe2,
  Layers,
  MapPinned,
  ShieldCheck,
  TrendingDown,
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

function buildPressureCardKey(record: Module5Record, idx: number, isUae: boolean): string {
  const city = formatDisplayLabel(getStringField(record, ["city"]));
  const community = formatDisplayLabel(getStringField(record, ["community_name", "community"]));
  const buildingName = formatDisplayLabel(getStringField(record, ["building_name", "building"]));
  const district = formatDisplayLabel(getStringField(record, ["district_name", "district"]));
  const fallback = formatDisplayLabel(getStringField(record, ["market_key", "canonical_market_key", "card_title", "location_label", "area_name", "name"]));

  const parts = isUae
    ? [city, community, buildingName, fallback]
    : [city, district, fallback];

  const key = parts.filter(Boolean).join("-").toLowerCase();

  return key || `pressure-area-${idx}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pressure-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pressure-grid)" />
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
          {disabled ? "Unavailable" : ctaLabel ?? "Review Area"}
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
  tone?: "neutral" | "rd" | "am" | "cy";
  truncate?: boolean;
}) {
  const colors = {
    neutral: { text: C.t1, bg: "rgba(255,255,255,0.03)", border: C.borderSub },
    rd: { text: C.rdHi, bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)" },
    am: { text: C.amHi, bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
    cy: { text: C.cyHi, bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)" },
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

function PressureAreaCard({ card, idx, isUae, routeBase }: { card: Module5Record; idx: number; isUae: boolean; routeBase: string }) {
  const city = formatDisplayLabel(getStringField(card, ["city"]));
  const community = formatDisplayLabel(getStringField(card, ["community_name", "community"]));
  const buildingName = formatDisplayLabel(getStringField(card, ["building_name", "building"]));
  const district = formatDisplayLabel(getStringField(card, ["district_name", "district"]));
  const fallbackTitle = formatDisplayLabel(getStringField(card, ["card_title", "location_label", "area_name", "name"]) || "Area");

  let title = fallbackTitle;
  let context = "";
  let typeLabel = "Area";

  if (isUae) {
    if (buildingName) {
      typeLabel = "Building";
      title = buildingName;
      context = [city, community].filter(Boolean).join(" · ");
    } else if (community) {
      typeLabel = "Community";
      title = community;
      context = city;
    }
  } else {
    if (district) {
      typeLabel = "District";
      title = district;
      context = city;
    } else {
      typeLabel = "District";
    }
  }

  const rank = idx + 1;

  // Metrics extraction
  const pressureScore = getNumberField(card, ["inventory_pressure_score"]);
  const activeSupply = getNumberField(card, ["active_listings"]);
  const avgDropPct = getNumberField(card, ["avg_drop_pct"]);
  const priceDropRate = getNumberField(card, ["price_drop_rate_pct"]);
  const refreshPressure = getNumberField(card, ["refresh_inflated_rate_pct", "refresh_rate_pct"]);
  const ownerDirect = getNumberField(card, ["owner_direct_rate_pct"]);
  const topAgency = getStringField(card, ["top_agency_name"]);

  // Action / Reason Line
  const reason = getStringField(card, [
    "recommended_action",
    "pressure_action",
    "pressure_reason",
    "interpretation_note",
    "dashboard_use_case",
    "product_note"
  ]) || "Visible public listing activity suggests this area should be monitored.";

  const reviewHref = isUae && typeLabel === "Building" ? `${routeBase}/buildings` : `${routeBase}/communities`;
  const reviewLabel = isUae && typeLabel === "Building" ? "Review in Buildings" : "Review in Communities";

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
        <div className="flex items-start justify-between gap-3 mb-3">
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
          <span
            className="rounded px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-widest"
            style={{ color: C.amHi, background: "rgba(245,158,11,0.1)", border: `1px solid rgba(245,158,11,0.2)` }}
          >
            #{rank}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[18px] font-extrabold text-white tracking-tight mb-1">
          {title}
        </h3>
        {context && (
          <p className="text-[12px] font-bold mb-4" style={{ color: C.t4 }}>
            {context}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {pressureScore !== undefined && <MetricPill label="Pressure Score" value={pressureScore.toFixed(1)} tone="am" />}
          {activeSupply !== undefined && <MetricPill label="Active Supply" value={formatNumber(activeSupply)} />}
          {avgDropPct !== undefined && <MetricPill label="Avg Drop" value={formatPercent(avgDropPct)} tone="rd" />}
          {priceDropRate !== undefined && avgDropPct === undefined && <MetricPill label="Price Drop Rate" value={formatPercent(priceDropRate)} tone="rd" />}
          {refreshPressure !== undefined && <MetricPill label="Refresh Pressure" value={formatPercent(refreshPressure)} tone="am" />}
          {ownerDirect !== undefined && <MetricPill label="Owner/Direct" value={formatPercent(ownerDirect)} tone="cy" />}
          {topAgency && <MetricPill label="Top Agency" value={topAgency} truncate />}
        </div>

        <div className="rounded-xl p-3 mb-5 border shadow-inner" style={{ background: "rgba(0,0,0,0.2)", borderColor: C.borderSub }}>
          <p className="text-[12.5px] leading-relaxed font-medium" style={{ color: C.t2 }}>
            {reason}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t" style={{ borderColor: C.borderSub }}>
          <Link
            href={reviewHref}
            className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider transition-transform group-hover:translate-x-0.5" 
            style={{ color: C.amHi }}
          >
            {reviewLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function InventoryPressurePage({
  country,
  data,
}: {
  country: CountryConfig;
  data: Module5DataResult;
}) {
  const isUae = country.slug === "uae";
  const isBuildingsDisabled = !!country.disabledSections?.["buildings"];

  // 1. Source Fallback
  let rawCards = (data.inventoryPressureLarge?.items ?? []) as Module5Record[];
  if (rawCards.length === 0) {
    rawCards = (data.inventoryPressure?.items ?? []) as Module5Record[];
  }

  const pressureSignalCards = (data.inventoryPressure?.items ?? []) as Module5Record[];

  // 2. Dedupe & Filter
  const validCards: Module5Record[] = [];
  const seenKeys = new Set<string>();

  for (const card of rawCards) {
    const city = getStringField(card, ["city"]);
    const community = getStringField(card, ["community_name", "community"]);
    const buildingName = getStringField(card, ["building_name", "building"]);
    const district = getStringField(card, ["district_name", "district"]);
    const fallbackTitle = getStringField(card, ["card_title", "location_label", "area_name", "name"]);

    let mainTitle = "";
    let dedupeKey = "";

    if (isUae) {
      dedupeKey = [city, community, buildingName].filter(Boolean).join("-").toLowerCase();
      mainTitle = buildingName || community || fallbackTitle || "";
    } else {
      dedupeKey = [city, district].filter(Boolean).join("-").toLowerCase();
      mainTitle = district || fallbackTitle || "";
    }

    const cleanTitle = formatDisplayLabel(mainTitle).toLowerCase();
    
    // Filter out generic placeholders
    if (!cleanTitle || cleanTitle === "market area" || cleanTitle === "area") {
      continue;
    }

    if (!dedupeKey) {
      const typeLabel = getStringField(card, ["card_subtype", "property_type", "location_type", "type", "category"]) || "default";
      dedupeKey = `${cleanTitle}-${typeLabel.toLowerCase()}`;
    }

    if (!seenKeys.has(dedupeKey)) {
      seenKeys.add(dedupeKey);
      validCards.push(card);
    }
  }

  // 3. Sort logic
  const sortedCards = [...validCards].sort((a, b) => {
    const scoreA = getNumberField(a, ["inventory_pressure_score"]) ?? 0;
    const scoreB = getNumberField(b, ["inventory_pressure_score"]) ?? 0;

    if (scoreB !== scoreA) return scoreB - scoreA;

    const listingsA = getNumberField(a, ["active_listings"]) ?? 0;
    const listingsB = getNumberField(b, ["active_listings"]) ?? 0;

    return listingsB - listingsA;
  });

  // Metrics
  const metricTotalPressureAreas = validCards.length;
  const metricTotalPressureSignals = pressureSignalCards.length > 0 ? pressureSignalCards.length : rawCards.length;

  const visibleCards = sortedCards.slice(0, 12); // Limit to top 12

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
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.amHi, background: "rgba(251,191,36,0.1)", border: `1px solid rgba(251,191,36,0.2)` }}
            >
              <Gauge className="h-3.5 w-3.5" />
              Supply Pressure
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            Where Supply Is Building Pressure.
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Track public listing supply, price movement, and aged inventory signals across markets, communities, and buildings.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href="#pressure-areas"
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #fcd34d 0%, #fbbf24 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(245,158,11,0.25)" 
              }}
            >
              Review Pressure Areas
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            
            <Link
              href={`${country.routeBase}/activity-feed`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Recent Market Movement
            </Link>

            <Link
              href={`${country.routeBase}/communities`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Communities to Monitor
            </Link>

            <Link
              href={isBuildingsDisabled ? "#" : `${country.routeBase}/buildings`}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all ${isBuildingsDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/[0.08]"}`}
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Buildings to Monitor
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Today's Focus (Summary Cards) ────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.amHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Today's Pressure Focus
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Pressure Areas"
            value={formatNumber(metricTotalPressureAreas)}
            description="Track areas with dense visible supply."
            icon={<MapPinned className="h-5 w-5" />}
            accentColor={C.amHi}
            href="#pressure-areas"
            ctaLabel="View Areas"
          />
          <SnapshotCard
            title="Pressure Signals"
            value={formatNumber(metricTotalPressureSignals)}
            description="Monitor active public listing pressure signals."
            icon={<Gauge className="h-5 w-5" />}
            accentColor={C.emHi}
            href="#pressure-areas"
            ctaLabel="Review Signals"
          />
          <SnapshotCard
            title="Price Movement"
            description="Review areas with active repricing signals."
            icon={<TrendingDown className="h-5 w-5" />}
            accentColor={C.rdHi}
            href="#pressure-areas"
            ctaLabel="Check Repricing"
          />
          <SnapshotCard
            title="Aged Inventory"
            description="Monitor older listings with accumulating pressure."
            icon={<Clock className="h-5 w-5" />}
            accentColor={C.cyHi}
            href="#pressure-areas"
            ctaLabel="Find Aged Supply"
          />
        </div>
      </section>

      {/* ── 3. Supply Pressure Intelligence Panels ──────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Supply Pressure Intelligence
          </h2>
        </div>

        <IntelligencePanel
          title="Crowded Supply"
          purpose="Find markets, communities, and buildings where active public listing volume suggests supply crowding."
          agentUseText="Use this to identify areas where sellers may face high competition or need better positioning."
          chips={["Crowded supply", "High volume", "Active listings"]}
          icon={<AlertTriangle className="h-5 w-5" />}
          accentColor={C.amHi}
          primaryCta={{ label: "View Crowded Areas", href: "#pressure-areas" }}
        />

        <IntelligencePanel
          title="Repricing Pressure"
          purpose="Highlight areas where public price movement and reductions suggest emerging pricing pressure."
          agentUseText="Use this to spot motivated sellers, downward price trends, and negotiation opportunities."
          chips={["Price movement", "Repricing", "Motivated sellers"]}
          icon={<TrendingDown className="h-5 w-5" />}
          accentColor={C.rdHi}
          primaryCta={{ label: "Check Repricing Pressure", href: "#pressure-areas" }}
        />

        <IntelligencePanel
          title="Aged Inventory"
          purpose="Identify areas where older, slow-moving public listings may require closer attention or repricing."
          agentUseText="Use this to find aged inventory that might present a farming opportunity or need a fresh approach."
          chips={["Aged inventory", "Slow-moving", "Time on market"]}
          icon={<Clock className="h-5 w-5" />}
          accentColor={C.cyHi}
          primaryCta={{ label: "Find Aged Supply", href: "#pressure-areas" }}
        />
      </section>

      {/* ── 4. Main Pressure Areas Grid ─────────────────────────────────── */}
      <section id="pressure-areas" className="scroll-mt-10 pt-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <Gauge className="h-5 w-5" style={{ color: C.amHi }} />
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
              Ranked Pressure Areas
            </h2>
          </div>
          <span 
            className="hidden sm:inline-flex rounded-full border px-3 py-1 text-[11px] font-bold"
            style={{ color: C.t3, background: "rgba(255,255,255,0.02)", borderColor: C.border }}
          >
            {formatNumber(metricTotalPressureAreas)} Tracked Areas
          </span>
        </div>

        {visibleCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((card, idx) => (
              <PressureAreaCard 
                key={buildPressureCardKey(card, idx, isUae)} 
                idx={idx} 
                card={card} 
                isUae={isUae} 
                routeBase={country.routeBase} 
              />
            ))}
          </div>
        ) : rawCards.length > 0 ? (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">Pressure signals available — area labels incomplete</p>
            <p className="mt-2 max-w-lg mx-auto text-[13px] font-medium" style={{ color: C.t4 }}>
              This workspace snapshot contains pressure signals, but the area labels are not complete enough to display reliable location cards. Review the source export before using this section for outreach.
            </p>
          </div>
        ) : (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">No pressure areas available</p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: C.t4 }}>
              No pressure areas are available in this workspace snapshot.
            </p>
          </div>
        )}

        {validCards.length > visibleCards.length && (
          <p className="mt-6 text-center text-[13px] font-bold" style={{ color: C.t4 }}>
            Showing top {visibleCards.length} of {formatNumber(validCards.length)} monitored areas
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
              Pressure is based on visible public listing activity
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