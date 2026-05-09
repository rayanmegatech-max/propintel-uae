"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Globe2,
  MapPinned,
  Radar,
  ShieldCheck,
  CheckCircle2,
  ListTodo,
} from "lucide-react";
import { type CountryConfig } from "@/lib/countries/countryConfig";

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  t1: "#ffffff",
  t2: "#a1a1aa", // zinc-400
  t3: "#71717a", // zinc-500
  em:    "#10b981",
  emHi:  "#34d399",
  cy:    "#06b6d4",
  cyHi:  "#22d3ee",
  am:    "#fbbf24",
  amHi:  "#fcd34d",
} as const;

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.04]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </div>
  );
}

// ─── Radar Card Component ───────────────────────────────────────────────────
function RadarCard({
  href,
  title,
  description,
  icon,
  accentColor,
  accentGlow,
  actionLabel,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  accentGlow: string;
  actionLabel: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full">
      <Link
        href={href}
        className="group relative flex flex-col h-full rounded-[20px] border p-7 transition-all duration-300 overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.015)", // Brighter, glassy base
          borderColor: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Subtle Ambient Background Gradient */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${accentGlow} 0%, transparent 70%)` }}
        />
        
        {/* Vibrant Top Border Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-all duration-300" 
          style={{ background: accentColor, boxShadow: `0 0 12px ${accentColor}` }} 
        />
        
        <div className="relative z-10 mb-6 flex items-center justify-between">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/5 shadow-inner">
            {/* Inner Icon Glow */}
            <div 
              className="absolute inset-0 rounded-[14px] opacity-30 group-hover:opacity-60 blur-md transition-opacity duration-300" 
              style={{ backgroundColor: accentColor }} 
            />
            <div className="relative z-10" style={{ color: accentColor }}>
              {icon}
            </div>
          </div>
        </div>
        
        <h3 className="relative z-10 text-[20px] font-bold tracking-tight mb-2 text-white group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        
        <p className="relative z-10 text-[14px] leading-relaxed mb-8 flex-1 font-medium" style={{ color: C.t2 }}>
          {description}
        </p>
        
        <div 
          className="relative z-10 mt-auto flex items-center gap-2 text-[13px] font-bold tracking-wide transition-all group-hover:translate-x-1" 
          style={{ color: accentColor }}
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────
type CountryOverviewPageProps = { country: CountryConfig };

// ─── Page ─────────────────────────────────────────────────────────────────
export default function CountryOverviewPage({ country }: CountryOverviewPageProps) {
  const isUae = country.slug === "uae";

  return (
    <div className="relative space-y-12 max-w-7xl mx-auto pb-16">
      
      {/* ── Page-Level Ambient Lighting to fix "Empty Sides" ── */}
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[-1]" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none translate-x-1/4 translate-y-1/4 z-[-1]" />
      
      {/* ── 1. Hero / Command Intro ──────────────────────────────────────── */}
      <section
        className="relative rounded-[28px] border overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.9) 100%)",
          borderColor: "rgba(255,255,255,0.06)",
          boxShadow: "0 24px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        <GridPattern />

        {/* Hero internal glows */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 p-8 sm:p-14 lg:p-16">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.emHi, background: "rgba(16,185,129,0.08)", border: `1px solid rgba(16,185,129,0.2)` }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              {isUae ? "UAE Command Center" : "KSA Command Center"}
            </span>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.15em] rounded-full px-4 py-1.5"
              style={{ color: C.t2, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.06)` }}
            >
              Intelligence OS
            </span>
          </div>

          <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-extrabold leading-[1.05] tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-500 drop-shadow-sm">
            {country.fullName} <br className="hidden sm:block" />
            Market Intelligence.
          </h1>
          
          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.65] font-medium" style={{ color: C.t2 }}>
            The professional real estate intelligence platform to find actionable property 
            opportunities, track inventory pressure, and monitor competitive agency visibility across public markets.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`${country.routeBase}/recon`}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-[15px] font-bold text-white transition-all hover:scale-[1.02]"
              style={{ 
                background: "linear-gradient(180deg, #10b981 0%, #059669 100%)", 
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25), 0 8px 24px rgba(16,185,129,0.25)" 
              }}
            >
              Open Deal Radar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            
            <Link
              href={`${country.routeBase}/market-radar`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-[15px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Market Radar
            </Link>

            <Link
              href={`${country.routeBase}/competitor-radar`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-[15px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Competitor Radar
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Today's Intelligence Snapshot ───────────────────────────── */}
      <section>
        <div className="mb-6 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.emHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Workspace Radars
          </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <RadarCard
            href={`${country.routeBase}/recon`}
            title="Deal Radar"
            description="Find owner/direct signals, price drops, listing refreshes, and high-priority property opportunities."
            icon={<Radar className="h-6 w-6" />}
            accentColor={C.emHi}
            accentGlow="rgba(16,185,129,0.06)"
            actionLabel="Review Opportunities"
          />
          
          <RadarCard
            href={`${country.routeBase}/market-radar`}
            title="Market Radar"
            description="See communities and buildings where pressure, activity, or overall inventory is shifting."
            icon={<MapPinned className="h-6 w-6" />}
            accentColor={C.cyHi}
            accentGlow="rgba(34,211,238,0.06)"
            actionLabel="Track Market"
          />
          
          <RadarCard
            href={`${country.routeBase}/competitor-radar`}
            title="Competitor Radar"
            description="Track visible agency footprints, market dominance, and competitive concentration."
            icon={<ShieldCheck className="h-6 w-6" />}
            accentColor={C.amHi}
            accentGlow="rgba(251,191,36,0.06)"
            actionLabel="Monitor Agencies"
          />
        </div>
      </section>

      {/* ── 3. Recommended Workflow ────────────────────────────────────── */}
      <section className="relative">
        <div className="mb-8 flex items-center gap-3 px-1">
          <ListTodo className="h-5 w-5" style={{ color: C.cyHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Recommended Daily Workflow
          </h2>
        </div>
        
        <div className="relative">
          {/* Connecting Pipeline Line (Desktop only) */}
          <div className="hidden sm:block absolute top-6 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-amber-500/20 z-0" />

          <div className="grid gap-6 sm:grid-cols-3 relative z-10">
            {[
              { 
                step: "01", 
                title: "Review Deal Radar", 
                desc: "Start your day with ranked, actionable property signals and price drops.",
                color: C.emHi,
                bg: "rgba(16,185,129,0.1)"
              },
              { 
                step: "02", 
                title: "Check Market Movement", 
                desc: "Use Market Radar to identify macro inventory pressure and active areas.",
                color: C.cyHi,
                bg: "rgba(34,211,238,0.1)"
              },
              { 
                step: "03", 
                title: "Monitor Competitors", 
                desc: "Track visible agency footprints and fragmented markets in your territory.",
                color: C.amHi,
                bg: "rgba(251,191,36,0.1)"
              },
            ].map((item) => (
              <div 
                key={item.step} 
                className="relative flex flex-col p-7 rounded-[20px] border shadow-lg transition-transform hover:-translate-y-1 duration-300"
                style={{
                  background: "rgba(24, 24, 27, 0.4)",
                  borderColor: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)"
                }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <span 
                    className="text-[12px] font-extrabold tracking-widest flex items-center justify-center h-10 w-10 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    style={{ background: item.bg, color: item.color, border: `1px solid ${item.color}40` }}
                  >
                    {item.step}
                  </span>
                  <h4 className="text-[17px] font-bold tracking-tight text-white">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[14px] leading-relaxed font-medium" style={{ color: C.t2 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Data Trust Strip ────────────────────────────────────────── */}
      <section>
        <div
          className="flex flex-col sm:flex-row flex-wrap sm:items-center justify-between gap-5 rounded-[16px] border px-8 py-5 shadow-sm"
          style={{ 
            background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(9,9,11,0.2) 100%)", 
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)"
          }}
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2.5 text-[13px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <Globe2 className="h-4 w-4 opacity-70" style={{ color: C.t3 }} />
              Public listing intelligence
            </div>
            <div className="flex items-center gap-2.5 text-[13px] font-bold tracking-wide" style={{ color: C.t1 }}>
              <CheckCircle2 className="h-4.5 w-4.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ color: C.emHi }} />
              Source verification recommended
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-[13px] font-bold tracking-wide" style={{ color: C.t3 }}>
            <span className="uppercase tracking-widest text-[10px] text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shadow-inner">
              {country.currency}
            </span>
            {country.label} Workspace
          </div>
        </div>
      </section>

    </div>
  );
}