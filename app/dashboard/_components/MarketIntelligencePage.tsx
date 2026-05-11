// app/dashboard/_components/MarketIntelligencePage.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Gauge,
  Globe2,
  Layers,
  MapPinned,
  ShieldCheck,
  TrendingDown,
  UserCheck,
  Users,
} from "lucide-react";
import { formatNumber } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { Module5DataResult } from "@/lib/data/module5";

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
function getStringField(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const val = record[key];
    if (typeof val === "string" && val.trim() !== "") {
      return val.trim();
    }
  }
  return undefined;
}

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

function ModuleCard({
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
      className={`group relative flex flex-col rounded-[20px] border p-6 transition-all duration-300 ${
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
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-60 transition-all duration-300"
          style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
        />
      )}

      <div className="flex items-start gap-4 mb-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-inner transition-colors duration-300"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            borderColor: "rgba(255,255,255,0.1)",
            color: disabled ? C.t4 : accentColor,
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-[16px] font-extrabold tracking-tight text-white flex items-center gap-2">
            {title}
            {disabled && (
              <span className="text-[9px] uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded shadow-inner">
                Limited
              </span>
            )}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed font-medium" style={{ color: C.t3 }}>
            {description}
          </p>
        </div>
      </div>

      <div 
        className="mt-2 flex items-center justify-end gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-transform group-hover:translate-x-0.5" 
        style={{ color: disabled ? C.t4 : accentColor }}
      >
        {disabled ? "Unavailable" : ctaLabel ?? "Open Module"}
        <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function MarketIntelligencePage({
  country,
  data,
}: {
  country: CountryConfig;
  data: Module5DataResult;
}) {
  const isUae = country.slug === "uae";

  const {
    locationCount,
    visibleSupply,
    agencyCount,
    activitySignals
  } = useMemo(() => {
    // 1. Location Count
    const locPayloads = [
      data.communityIntelligence,
      data.cityIntelligence,
      data.cityIntelligenceMajor,
      data.districtIntelligence
    ].filter(Boolean);

    let calcLocationCount: number | string = "—";
    let maxLocRows = 0;

    locPayloads.forEach(payload => {
      if (payload && typeof payload.total_rows_available === "number") {
        if (payload.total_rows_available > maxLocRows) {
          maxLocRows = payload.total_rows_available;
        }
      }
    });

    if (maxLocRows > 0) {
      calcLocationCount = maxLocRows;
    } else {
      const uniqueLocs = new Set<string>();
      locPayloads.forEach(payload => {
        if (payload && Array.isArray(payload.items)) {
          payload.items.forEach(item => {
            const r = item as Record<string, unknown>;
            const city = getStringField(r, ["city"]) || "";
            const comm = getStringField(r, ["community", "district"]) || "";
            const key = `${city}-${comm}`.toLowerCase();
            if (key && key !== "-") {
              uniqueLocs.add(key);
            }
          });
        }
      });
      if (uniqueLocs.size > 0) {
        calcLocationCount = uniqueLocs.size;
      }
    }

    // 2. Visible Supply
    const supplyPayloads = [
      data.communityIntelligence,
      data.cityIntelligence,
      data.cityIntelligenceMajor,
      data.districtIntelligence,
      data.inventoryPressure,
      data.inventoryPressureLarge
    ].filter(Boolean);

    let calcVisibleSupply: number | string = "—";
    let maxSupplyObserved = 0;

    supplyPayloads.forEach(payload => {
      if (payload && Array.isArray(payload.items)) {
        payload.items.forEach(item => {
          const val = getNumberField(item as Record<string, unknown>, ["active_listings", "listing_count", "total_listings"]);
          if (val && val > maxSupplyObserved) {
            maxSupplyObserved = val;
          }
        });
      }
    });

    if (maxSupplyObserved > 0) {
      calcVisibleSupply = maxSupplyObserved;
    }

    // 3. Agency Count
    let calcAgencyCount: number | string = "—";
    const profRows = data.agencyProfiles?.total_rows_available ?? data.agencyProfilesMajor?.total_rows_available;

    if (typeof profRows === "number" && profRows > 0) {
      calcAgencyCount = profRows;
    } else {
      const uniqueAgencies = new Set<string>();
      const profPayloads = [data.agencyProfiles, data.agencyProfilesMajor].filter(Boolean);
      profPayloads.forEach(payload => {
        if (payload && Array.isArray(payload.items)) {
          payload.items.forEach(item => {
            const agency = getStringField(item as Record<string, unknown>, ["agency_name", "agency_display_name", "top_agency_name"]);
            if (agency) uniqueAgencies.add(agency.toLowerCase());
          });
        }
      });
      if (uniqueAgencies.size > 0) {
        calcAgencyCount = uniqueAgencies.size;
      }
    }

    // 4. Activity Signals
    let calcActivitySignals: number | string = "—";
    if (typeof data.activityFeed?.total_rows_available === "number" && data.activityFeed.total_rows_available > 0) {
      calcActivitySignals = data.activityFeed.total_rows_available;
    } else if (Array.isArray(data.activityFeed?.items) && data.activityFeed.items.length > 0) {
      calcActivitySignals = data.activityFeed.items.length;
    }

    return {
      locationCount: calcLocationCount,
      visibleSupply: calcVisibleSupply,
      agencyCount: calcAgencyCount,
      activitySignals: calcActivitySignals
    };
  }, [data]);

  // Handle KSA Buildings Shortcut Logic
  const isBuildingsDisabled = !!country.disabledSections?.buildings;
  let buildingsTitle = "Buildings";
  let buildingsDescription = "Building-level supply, pressure, and agency presence.";

  if (!isUae) {
    if (isBuildingsDisabled) {
      buildingsTitle = "Building Coverage Limited";
      buildingsDescription = "Building-level intelligence is limited in this workspace.";
    } else {
      buildingsTitle = "Building Intelligence";
      buildingsDescription = "Building-level records available where source coverage supports it.";
    }
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
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.cyHi, background: "rgba(34,211,238,0.1)", border: `1px solid rgba(34,211,238,0.2)` }}
            >
              <Globe2 className="h-3.5 w-3.5" />
              Public Listing Intelligence
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            {country.label} Market Intelligence
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            A unified workspace for public listing insights. Track visible supply, agency footprints, market pressure, and competitor movement across locations.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href={`${country.routeBase}/market-radar`}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(6,182,212,0.25)" 
              }}
            >
              Review Market Radar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            
            <Link
              href={`${country.routeBase}/recon`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Opportunities
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
              Recent Movement
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Overview Metrics ─────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.cyHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Workspace Overview
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Tracked Locations"
            value={typeof locationCount === "number" ? formatNumber(locationCount) : locationCount}
            description="Locations represented in this workspace snapshot."
            icon={<MapPinned className="h-5 w-5" />}
            accentColor={C.cyHi}
            href={`${country.routeBase}/communities`}
            ctaLabel="View Locations"
          />
          <SnapshotCard
            title="Supply Signals"
            value={typeof visibleSupply === "number" ? formatNumber(visibleSupply) : visibleSupply}
            description="Supply-related records available for review."
            icon={<Layers className="h-5 w-5" />}
            accentColor={C.emHi}
            href={`${country.routeBase}/inventory-pressure`}
            ctaLabel="Review Supply"
          />
          <SnapshotCard
            title="Agency Footprints"
            value={typeof agencyCount === "number" ? formatNumber(agencyCount) : agencyCount}
            description="Agency portfolio records available for review."
            icon={<Users className="h-5 w-5" />}
            accentColor={C.amHi}
            href={`${country.routeBase}/agency-profiles`}
            ctaLabel="Track Agencies"
          />
          <SnapshotCard
            title="Activity Signals"
            value={typeof activitySignals === "number" ? formatNumber(activitySignals) : activitySignals}
            description="Recent market movement records in this snapshot."
            icon={<TrendingDown className="h-5 w-5" />}
            accentColor={C.rdHi}
            href={`${country.routeBase}/activity-feed`}
            ctaLabel="View Activity"
          />
        </div>
      </section>

      {/* ── 3. Module Navigation Grid ────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Intelligence Modules
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ModuleCard
            title="Market Radar"
            description="Centralized view of movement, price drops, and listing truth."
            icon={<Activity className="h-5 w-5" />}
            href={`${country.routeBase}/market-radar`}
            accentColor={C.cyHi}
            ctaLabel="Open Radar"
          />

          <ModuleCard
            title="Inventory Pressure"
            description="Supply trends, aging listings, and visible market saturation."
            icon={<Gauge className="h-5 w-5" />}
            href={`${country.routeBase}/inventory-pressure`}
            accentColor={C.emHi}
            ctaLabel="Review Pressure"
          />

          <ModuleCard
            title="Market Dominance"
            description="Agency concentration and fragmented areas by territory."
            icon={<BarChart3 className="h-5 w-5" />}
            href={`${country.routeBase}/market-dominance`}
            accentColor={C.amHi}
            ctaLabel="View Dominance"
          />

          <ModuleCard
            title="Agency Profiles"
            description="Competitor footprints, listing mix, and operational signals."
            icon={<Users className="h-5 w-5" />}
            href={`${country.routeBase}/agency-profiles`}
            accentColor={C.rdHi}
            ctaLabel="Track Agencies"
          />

          <ModuleCard
            title={isUae ? "Communities" : "Districts"}
            description={`Identify key ${isUae ? "communities" : "districts"} based on supply and pressure.`}
            icon={<MapPinned className="h-5 w-5" />}
            href={`${country.routeBase}/communities`}
            accentColor={C.cyHi}
            ctaLabel="View Locations"
          />

          <ModuleCard
            title={buildingsTitle}
            description={buildingsDescription}
            icon={<Building2 className="h-5 w-5" />}
            href={`${country.routeBase}/buildings`}
            accentColor={C.emHi}
            disabled={isBuildingsDisabled}
            ctaLabel={isBuildingsDisabled ? "Unavailable" : "View Buildings"}
          />

          <ModuleCard
            title="Recent Market Movement"
            description="Tracking public portfolio and supply changes."
            icon={<TrendingDown className="h-5 w-5" />}
            href={`${country.routeBase}/activity-feed`}
            accentColor={C.amHi}
            ctaLabel="View Activity"
          />

          <ModuleCard
            title="Owner / Direct Radar"
            description="Contactable listings and direct-style signals."
            icon={<UserCheck className="h-5 w-5" />}
            href={`${country.routeBase}/owner-direct`}
            accentColor={C.rdHi}
            disabled={!!country.disabledSections?.["owner-direct"]}
            ctaLabel="View Direct Signals"
          />
        </div>
      </section>

      {/* ── 4. Trust Strip ──────────────────────────────────────────────── */}
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
              Country-level overview
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