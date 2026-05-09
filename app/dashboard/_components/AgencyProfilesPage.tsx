// app/dashboard/_components/AgencyProfilesPage.tsx
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
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
  const special = ["aed", "sar", "uae", "ksa"];
  return words
    .map((w) => (special.includes(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function buildAgencyDedupeKey(record: Module5Record): string {
  const pubKey = getStringField(record, ["agency_public_key"]);
  if (pubKey) return pubKey.toLowerCase();

  const name = formatDisplayLabel(getStringField(record, ["agency_name", "agency_display_name", "top_agency_name"]));
  return name.toLowerCase() || "";
}

function buildAgencyReactKey(record: Module5Record, idx: number): string {
  const baseKey = buildAgencyDedupeKey(record);
  return `${baseKey || "agency"}-${idx}`;
}

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="agency-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#agency-grid)" />
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
  tone = "neutral" 
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
    <div className="flex items-center gap-1.5 rounded-md px-2 py-1 border" style={{ background: c.bg, borderColor: c.border }}>
      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>{label}:</span>
      <span className="text-[11px] font-bold tabular-nums" style={{ color: c.text }}>{value}</span>
    </div>
  );
}

function AgencyProfileCard({ card, idx, routeBase }: { card: Module5Record; idx: number; routeBase: string }) {
  const rawTitle = getStringField(card, ["agency_name", "agency_display_name", "top_agency_name"]);
  const title = rawTitle ? formatDisplayLabel(rawTitle) : "Agency Profile";

  const topCity = formatDisplayLabel(getStringField(card, ["top_city", "primary_city", "city"]));
  const topDistrict = formatDisplayLabel(getStringField(card, ["top_community", "primary_district", "district"]));
  
  const locationContext = [topCity, topDistrict].filter(Boolean).join(" · ");
  const subtitle = locationContext || "Public portfolio";

  const rank = idx + 1;

  // Metrics extraction
  const activeSupply = getNumberField(card, ["active_listings"]);
  const agents = getNumberField(card, ["active_agents", "unique_agents"]);
  
  const footprintScore = getNumberField(card, ["footprint_score"]);
  const reconRows = getNumberField(card, ["recon_signal_rows", "recon_opportunities"]);
  
  const dropRate = getNumberField(card, ["price_drop_rate_pct", "avg_drop_pct"]);
  const ownerDirectRate = getNumberField(card, ["owner_direct_rate_pct"]);
  const refreshRate = getNumberField(card, ["refresh_rate_pct"]);
  
  const confidence = humanizeToken(getStringField(card, ["confidence_tier"]));

  // Metric Pills Logic (Max 5)
  const availableMetrics: Record<string, { label: string; value: string | number; tone?: "neutral"|"rd"|"am"|"cy"|"em" }> = {};
  
  if (activeSupply !== undefined) availableMetrics["supply"] = { label: "Active Supply", value: formatNumber(activeSupply), tone: "cy" };
  if (agents !== undefined) availableMetrics["agents"] = { label: "Agents", value: formatNumber(agents), tone: "neutral" };
  if (footprintScore !== undefined) availableMetrics["footprint"] = { label: "Footprint Score", value: footprintScore.toFixed(1), tone: "am" };
  if (reconRows !== undefined && reconRows > 0) availableMetrics["recon"] = { label: "Opp Signals", value: formatNumber(reconRows), tone: "em" };
  if (dropRate !== undefined) availableMetrics["dropRate"] = { label: "Drop Rate", value: formatPercent(dropRate), tone: "rd" };
  if (ownerDirectRate !== undefined) availableMetrics["ownerDirect"] = { label: "Owner/Direct", value: formatPercent(ownerDirectRate), tone: "em" };
  if (refreshRate !== undefined) availableMetrics["refreshRate"] = { label: "Refresh Rate", value: formatPercent(refreshRate), tone: "am" };
  if (confidence) availableMetrics["confidence"] = { label: "Confidence", value: confidence, tone: "neutral" };

  const preferredKeys = ["supply", "agents", "footprint", "recon", "dropRate", "ownerDirect", "refreshRate", "confidence"];
  const pillsToRender = [];
  
  for (const k of preferredKeys) {
    if (availableMetrics[k]) {
      pillsToRender.push(availableMetrics[k]);
      if (pillsToRender.length >= 5) break;
    }
  }

  // Portfolio Focus Line
  let portfolioFocusLine = "";
  if (topCity && topDistrict && activeSupply) {
    portfolioFocusLine = `${topCity} · ${topDistrict} focus with ${activeSupply} visible listings.`;
  } else if (topCity && activeSupply) {
    portfolioFocusLine = `${topCity} focus with ${activeSupply} visible listings.`;
  }

  // Action / Reason Line
  const actionText = getStringField(card, ["recommended_action", "product_note"]) 
    || "Use this profile as public portfolio context before comparing territory or movement signals.";

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
            Agency Profile
          </span>
        </div>

        <h3 className="line-clamp-2 text-[18px] font-extrabold text-white tracking-tight mb-1">
          {title}
        </h3>
        
        <p className="text-[12px] font-bold mb-4" style={{ color: C.t4 }}>
          {subtitle}
        </p>
        
        {/* Metric Pills Row */}
        {pillsToRender.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {pillsToRender.map((p, i) => (
              <MetricPill key={i} label={p.label} value={p.value} tone={p.tone} />
            ))}
          </div>
        )}
        
        {portfolioFocusLine && (
          <p className="text-[13px] leading-relaxed font-medium mb-3" style={{ color: C.t3 }}>
            {portfolioFocusLine}
          </p>
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
            href={`${routeBase}/market-dominance`}
            className="text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: C.t4 }}
          >
            Market Dominance
          </Link>
          <Link
            href={`${routeBase}/competitor-radar`}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80" 
            style={{ color: C.cyHi }}
          >
            Review Competitor Context
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AgencyProfilesPage({
  country,
  data,
}: {
  country: CountryConfig;
  data: Module5DataResult;
}) {
  const isUae = country.slug === "uae";
  
  // Source Selection
  let rawProfiles = (data.agencyProfiles?.items ?? []) as Module5Record[];
  if (rawProfiles.length === 0) {
    rawProfiles = (data.agencyProfilesMajor?.items ?? []) as Module5Record[];
  }

  // Deduplicate and filter
  const validCards: Module5Record[] = [];
  const seenKeys = new Set<string>();

  for (const card of rawProfiles) {
    const rawTitle = getStringField(card, ["agency_name", "agency_display_name", "top_agency_name"]);
    const title = rawTitle ? formatDisplayLabel(rawTitle) : undefined;
    const lowerTitle = title?.toLowerCase().trim();

    // Skip empty or generic placeholders
    if (!lowerTitle) {
      continue;
    }

    let dedupeKey = buildAgencyDedupeKey(card);
    if (!dedupeKey) {
      dedupeKey = `agency-${validCards.length}`;
    }

    if (!seenKeys.has(dedupeKey)) {
      seenKeys.add(dedupeKey);
      validCards.push(card);
    }
  }

  // Sort logic
  const sortedCards = [...validCards].sort((a, b) => {
    const listingsA = getNumberField(a, ["active_listings"]) ?? 0;
    const listingsB = getNumberField(b, ["active_listings"]) ?? 0;

    if (listingsB !== listingsA) return listingsB - listingsA;
    
    const scoreA = getNumberField(a, ["footprint_score", "activity_score", "pressure_score"]) ?? 0;
    const scoreB = getNumberField(b, ["footprint_score", "activity_score", "pressure_score"]) ?? 0;
    
    if (scoreB !== scoreA) return scoreB - scoreA;

    const rankA = getNumberField(a, ["dashboard_rank"]) ?? 0;
    const rankB = getNumberField(b, ["dashboard_rank"]) ?? 0;

    return rankB - rankA; // Tie-breaker
  });

  // Overview Metrics
  const visibleAgenciesCount = validCards.length;
  
  const activeSupplyCount = validCards.reduce((acc, card) => {
    return acc + (getNumberField(card, ["active_listings"]) ?? 0);
  }, 0);

  const opportunitySignalsCount = validCards.reduce((acc, card) => {
    if (isUae) {
      return acc + (getNumberField(card, ["recon_signal_rows"]) ?? 0);
    } else {
      const recon = getNumberField(card, ["recon_opportunities"]) ?? 0;
      const ownerDirect = getNumberField(card, ["owner_direct_signals"]) ?? 0;
      const priceDrop = getNumberField(card, ["price_drop_signals"]) ?? 0;
      return acc + recon + ownerDirect + priceDrop;
    }
  }, 0);

  const territoriesSet = new Set<string>();
  validCards.forEach(card => {
    const loc = getStringField(card, ["top_city", "primary_city", "city"]);
    if (loc) territoriesSet.add(loc.toLowerCase());
  });
  const territoriesCount = territoriesSet.size;
  
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
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.cyHi, background: "rgba(34,211,238,0.1)", border: `1px solid rgba(34,211,238,0.2)` }}
            >
              <Users className="h-3.5 w-3.5" />
              Agency Profiles
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            Who Is Active in the Market?
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Review visible agency portfolios, territory focus, listing mix, and public movement signals from the latest workspace snapshot.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href="#agency-profiles"
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(6,182,212,0.25)" 
              }}
            >
              Review Agency Profiles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            
            <Link
              href={`${country.routeBase}/competitor-radar`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Competitor Radar
            </Link>

            <Link
              href={`${country.routeBase}/activity-feed`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Recent Market Movement
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

      {/* ── 2. Agency Overview Cards ─────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.cyHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Agency Overview
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Visible Agencies"
            value={formatNumber(visibleAgenciesCount)}
            description="Agencies active in this workspace."
            icon={<Users className="h-5 w-5" />}
            accentColor={C.cyHi}
            href="#agency-profiles"
            ctaLabel="View Profiles"
          />
          <SnapshotCard
            title="Active Supply"
            value={formatNumber(activeSupplyCount)}
            description="Combined visible agency listings."
            icon={<Building2 className="h-5 w-5" />}
            accentColor={C.emHi}
            href="#agency-profiles"
            ctaLabel="Review Supply"
          />
          <SnapshotCard
            title="Opportunity Signals"
            value={formatNumber(opportunitySignalsCount)}
            description="Public movement and opportunity signals."
            icon={<TrendingDown className="h-5 w-5" />}
            accentColor={C.amHi}
            href="#agency-profiles"
            ctaLabel="Check Signals"
          />
          <SnapshotCard
            title="Territories Covered"
            value={formatNumber(territoriesCount)}
            description="Unique primary cities identified."
            icon={<MapPinned className="h-5 w-5" />}
            accentColor={C.rdHi}
            href="#agency-profiles"
            ctaLabel="Find Markets"
          />
        </div>
      </section>

      {/* ── 3. Insight Panels ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Agency Intelligence
          </h2>
        </div>

        <IntelligencePanel
          title="Portfolio Footprint"
          purpose="Understand visible active supply, portal/category mix, and territory concentration."
          agentUseText="Use this to gauge an agency's overall size and where they allocate their marketing resources."
          chips={["Visible supply", "Portfolio mix", "Agency size"]}
          icon={<PieChart className="h-5 w-5" />}
          accentColor={C.cyHi}
          primaryCta={{ label: "View Portfolios", href: "#agency-profiles" }}
        />

        <IntelligencePanel
          title="Movement Signals"
          purpose="Spot agencies with price-drop, refresh, owner/direct, or recon/opportunity signals."
          agentUseText="Use this to monitor how competitors manage their inventory and to spot repricing patterns."
          chips={["Price drops", "Refresh rate", "Opportunity signals"]}
          icon={<TrendingDown className="h-5 w-5" />}
          accentColor={C.amHi}
          primaryCta={{ label: "Check Signals", href: "#agency-profiles" }}
        />

        <IntelligencePanel
          title="Territory Focus"
          purpose="Identify where an agency appears concentrated by city, community, or district."
          agentUseText="Use this to understand who your main competitors are in specific farming areas."
          chips={["Territory focus", "City footprint", "District concentration"]}
          icon={<MapPinned className="h-5 w-5" />}
          accentColor={C.emHi}
          primaryCta={{ label: "Review Territories", href: "#agency-profiles" }}
        />
      </section>

      {/* ── 4. Main Agency Profiles List ─────────────────────────────────── */}
      <section id="agency-profiles" className="scroll-mt-10 pt-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5" style={{ color: C.cyHi }} />
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
              Ranked Agency Profiles
            </h2>
          </div>
          <span 
            className="hidden sm:inline-flex rounded-full border px-3 py-1 text-[11px] font-bold"
            style={{ color: C.t3, background: "rgba(255,255,255,0.02)", borderColor: C.border }}
          >
            {formatNumber(visibleAgenciesCount)} Agencies
          </span>
        </div>

        {visibleCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((card, idx) => (
              <AgencyProfileCard 
                key={buildAgencyReactKey(card, idx)} 
                idx={idx} 
                card={card} 
                routeBase={country.routeBase} 
              />
            ))}
          </div>
        ) : rawProfiles.length > 0 ? (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">Agency signals available — names incomplete</p>
            <p className="mt-2 max-w-lg mx-auto text-[13px] font-medium" style={{ color: C.t4 }}>
              This workspace snapshot contains agency signals, but the names are not complete enough to display reliable agency cards.
            </p>
          </div>
        ) : (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">No agency profiles available</p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: C.t4 }}>
              No agency profile signals are available in this workspace snapshot.
            </p>
          </div>
        )}

        {validCards.length > visibleCards.length && (
          <p className="mt-6 text-center text-[13px] font-bold" style={{ color: C.t4 }}>
            Showing top {visibleCards.length} of {formatNumber(validCards.length)} agency profiles
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
              Visibility is based on public source presence
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