// app/dashboard/_components/MarketRadarPage.tsx
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Gauge,
  Globe2,
  MapPinned,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { type CountryConfig } from "@/lib/countries/countryConfig";

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
  border: "rgba(255,255,255,0.06)",
  borderSub: "rgba(255,255,255,0.04)",
} as const;

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#radar-grid)" />
      </svg>
    </div>
  );
}

// ─── Components ─────────────────────────────────────────────────────────────

function SnapshotCard({
  title,
  description,
  icon,
  accentColor,
  href,
  ctaLabel,
  disabled,
}: {
  title: string;
  description: string;
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
        <div className="flex items-start gap-3.5 mb-3">
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
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2">
              {title}
              {disabled && (
                <span className="text-[9px] uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded shadow-inner">
                  Limited
                </span>
              )}
            </h3>
          </div>
        </div>
        
        <p className="text-[13px] leading-relaxed font-medium mb-4 flex-1" style={{ color: C.t3 }}>
          {description}
        </p>

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
  secondaryCta,
}: {
  title: string;
  purpose: string;
  agentUseText: string;
  chips: string[];
  icon: React.ReactNode;
  accentColor: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string; disabled?: boolean };
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

        <div className="flex flex-col gap-2.5 md:min-w-[200px] shrink-0 mt-2 md:mt-0">
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

          {secondaryCta && (
            <Link
              href={secondaryCta.disabled ? "#" : secondaryCta.href}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-[12px] font-bold transition-all ${
                secondaryCta.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"
              }`}
              style={{
                color: C.t2,
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {secondaryCta.label}
              {secondaryCta.disabled && <span className="text-[9px] uppercase text-amber-500 ml-1">Limited</span>}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function MarketRadarPage({ country }: { country: CountryConfig }) {
  const isBuildingsDisabled = !!country.disabledSections?.["buildings"];

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
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.cyHi, background: "rgba(34,211,238,0.1)", border: `1px solid rgba(34,211,238,0.2)` }}
            >
              <Activity className="h-3.5 w-3.5" />
              Market Radar
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            Where to Focus.
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Track public market movement, supply pressure, and building/community activity from listing intelligence.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href={`${country.routeBase}/inventory-pressure`}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(6,182,212,0.25)" 
              }}
            >
              Review Supply Pressure
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
              href={`${country.routeBase}/buildings`}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all ${isBuildingsDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/[0.08]"}`}
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Buildings to Monitor
            </Link>

            <Link
              href={`${country.routeBase}/communities`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Communities to Monitor
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Market Snapshot Cards ────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.cyHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Today's Market Focus
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Supply Pressure"
            description="Monitor active pressure signals and market crowding."
            icon={<Gauge className="h-5 w-5" />}
            accentColor={C.amHi}
            href={`${country.routeBase}/inventory-pressure`}
            ctaLabel="Review Pressure"
          />
          <SnapshotCard
            title="Market Movement"
            description="Review recent public listing activity and daily changes."
            icon={<Globe2 className="h-5 w-5" />}
            accentColor={C.cyHi}
            href={`${country.routeBase}/activity-feed`}
            ctaLabel="Open Movement"
          />
          <SnapshotCard
            title="Communities"
            description="Compare community-level activity and concentration."
            icon={<MapPinned className="h-5 w-5" />}
            accentColor={C.emHi}
            href={`${country.routeBase}/communities`}
            ctaLabel="Compare Areas"
          />
          <SnapshotCard
            title="Buildings"
            description={isBuildingsDisabled ? "Building tracking limited in KSA v1." : "Track building-level movement and active supply."}
            icon={<Building2 className="h-5 w-5" />}
            accentColor={C.t2}
            href={`${country.routeBase}/buildings`}
            ctaLabel="Track Buildings"
            disabled={isBuildingsDisabled}
          />
        </div>
      </section>

      {/* ── 3. Main Intelligence Panels ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Market Intelligence Workspace
          </h2>
        </div>

        <IntelligencePanel
          title="Supply Pressure Alerts"
          purpose="Find markets, buildings, and communities where visible supply, price movement, or aged inventory suggest areas requiring immediate monitoring."
          agentUseText="Use this to find areas where sellers may need repricing or where inventory is crowded."
          chips={["Supply pressure", "Price movement", "Aged inventory"]}
          icon={<Gauge className="h-5 w-5" />}
          accentColor={C.amHi}
          primaryCta={{ label: "Review Supply Pressure", href: `${country.routeBase}/inventory-pressure` }}
        />

        <IntelligencePanel
          title="Recent Market Movement"
          purpose="A readable timeline of recent public listing activity, market updates, and daily operational changes."
          agentUseText="Use this to catch new public listing activity before manually browsing portals."
          chips={["New activity", "Agency movement", "Market shifts"]}
          icon={<Globe2 className="h-5 w-5" />}
          accentColor={C.cyHi}
          primaryCta={{ label: "Open Recent Market Movement", href: `${country.routeBase}/activity-feed` }}
        />

        <IntelligencePanel
          title="Buildings & Communities to Monitor"
          purpose="Location intelligence analyzing public market evidence to help pick specific areas for farming or client focusing."
          agentUseText="Use this to choose farming targets by building, district, or community."
          chips={["Buildings", "Communities", "Area focus"]}
          icon={<Building2 className="h-5 w-5" />}
          accentColor={C.emHi}
          primaryCta={{ label: "View Communities", href: `${country.routeBase}/communities` }}
          secondaryCta={{ label: "View Buildings", href: `${country.routeBase}/buildings`, disabled: isBuildingsDisabled }}
        />
      </section>

      {/* ── 4. Country Market Overview ──────────────────────────────────── */}
      <section className="pt-2">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-[20px] border px-6 py-5 shadow-sm"
          style={{ 
            background: "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(9,9,11,0.4) 100%)", 
            borderColor: C.borderSub,
            backdropFilter: "blur(10px)"
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-white/5 border border-white/10 text-zinc-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white mb-1">Country Market Overview</h3>
              <p className="text-[13px] font-medium text-zinc-400">Review the broader market summary across pressure, activity, and location movement.</p>
            </div>
          </div>
          
          <Link
            href={`${country.routeBase}/market-intelligence`}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all hover:bg-white/10 shrink-0"
            style={{ color: C.t1, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.1)` }}
          >
            Open Market Overview
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── 5. Trust Strip ──────────────────────────────────────────────── */}
      <section className="pt-2">
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