"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Building2, Menu, X, ChevronRight, ChevronDown,
  LayoutDashboard, ScanSearch, Users, TrendingDown, BarChart3, Gauge, Globe2, Settings,
  Bell, Search, ArrowUpRight, ArrowDownRight,
  MapPin, ExternalLink, Bookmark, Star, Bed,
  Cpu, Database, RefreshCw, Zap, Eye, Map,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Premium Dark Palette – Pure Zinc Terminal
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_BG = "#09090b"; // zinc-950
const SIDE    = "#09090b"; // zinc-950
const CARD    = "#18181b"; // zinc-900
const WELL    = "#27272a"; // zinc-800
const INPUT   = "#09090b"; // same as page, recessed
const BDR     = "rgba(255,255,255,0.08)";
const BDRS    = "rgba(255,255,255,0.05)";

// ─────────────────────────────────────────────────────────────────────────────
// Accent maps
// ─────────────────────────────────────────────────────────────────────────────
type ModAc  = "emerald" | "cyan" | "violet";
type NoteAc = "violet"  | "cyan" | "amber";

const MOD_AC: Record<ModAc, { ring: string; icon: string; bg: string; chip: string }> = {
  emerald: { ring:"ring-emerald-500/20", icon:"text-emerald-400", bg:"rgba(16,185,129,0.08)",  chip:"text-emerald-400 bg-emerald-500/[0.09]" },
  cyan:    { ring:"ring-cyan-500/20",    icon:"text-cyan-400",    bg:"rgba(34,211,238,0.08)",  chip:"text-cyan-400 bg-cyan-500/[0.09]"       },
  violet:  { ring:"ring-violet-500/20",  icon:"text-violet-400",  bg:"rgba(139,92,246,0.08)", chip:"text-violet-400 bg-violet-500/[0.09]"   },
};

const NOTE_AC: Record<NoteAc, { txt: string; bg: string; bdr: string; bar: string; label: string }> = {
  violet: { txt:"text-violet-400", bg:"rgba(139,92,246,0.06)", bdr:"rgba(139,92,246,0.2)", bar:"#a78bfa", label:"AI note" },
  cyan:   { txt:"text-cyan-400",   bg:"rgba(34,211,238,0.06)", bdr:"rgba(34,211,238,0.2)", bar:"#22d3ee", label:"Market"  },
  amber:  { txt:"text-amber-400",  bg:"rgba(245,158,11,0.06)", bdr:"rgba(245,158,11,0.2)", bar:"#fbbf24", label:"Watch"   },
};

// ─────────────────────────────────────────────────────────────────────────────
// Stable heat‑grid (deterministic)
// ─────────────────────────────────────────────────────────────────────────────
const HEAT: number[] = [
  0.08,0.55,0.72,0.19,0.88,0.34,0.61,
  0.43,0.27,0.91,0.50,0.15,0.76,0.38,
  0.64,0.82,0.23,0.57,0.10,0.95,0.48,
  0.31,0.69,0.44,0.86,0.22,0.73,0.59,
  0.12,0.78,0.36,0.65,0.92,0.29,0.54,
  0.41,0.83,0.17,0.70,0.47,0.98,0.25,
  0.66,0.39,0.85,0.53,0.18,0.77,0.32,
  0.94,0.21,0.60,0.45,0.80,0.13,0.68,
  0.37,0.71,0.26,0.89,0.52,0.16,0.79,
  0.46,0.93,0.30,0.63,0.42,0.87,0.11,
  0.74,0.58,0.20,0.96,0.33,0.67,0.49,
  0.84,0.14,0.75,0.40,0.99,0.24,0.56,
  0.35,0.62,0.90,0.28,0.81,0.07,0.72,
  0.53,0.76,0.19,0.88,0.44,0.61,0.30,
];

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 96, H = 32;
  const max = Math.max(...data), min = Math.min(...data), rng = max - min || 1;
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / rng) * (H - 6) - 4,
  ]);
  const line = pts
    .map(([x, y], i) => {
      const cmd = i === 0 ? "M" : "L";
      return cmd + x.toFixed(1) + "," + y.toFixed(1);
    })
    .join(" ");
  const area = line + " L" + W + "," + H + " L0," + H + " Z";
  const gid = "sp" + color.replace("#", "");
  return (
    <svg width={W} height={H} viewBox={"0 0 " + W + " " + H} aria-hidden className="opacity-80">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={"url(#" + gid + ")"}/>
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }} aria-hidden>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="#10b981" strokeWidth="4"
        strokeDasharray={`${(score / 100) * circ} ${circ}`}
        strokeLinecap="round"/>
    </svg>
  );
}

function HeatGrid() {
  const col = (v: number) =>
    v < 0.22 ? "rgba(255,255,255,0.06)"
    : v < 0.48 ? "rgba(6,78,59,0.55)"
    : v < 0.74 ? "rgba(16,185,129,0.28)"
    : "rgba(16,185,129,0.55)";
  return (
    <div className="flex gap-[3px]" aria-hidden>
      {Array.from({ length: 14 }, (_, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }, (_, di) => (
            <div
              key={di}
              className="relative w-[10px] h-[10px] rounded-[2px] hover:z-10 hover:scale-[1.8] transition-transform duration-100 cursor-crosshair hover:ring-1 hover:ring-white/50"
              style={{ background: col(HEAT[wi * 7 + di] ?? 0.5) }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Pulse({ color = "bg-emerald-400" }: { color?: string }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${color}`}
      style={{ animation: "pdot 2.4s ease-in-out infinite" }}/>
  );
}

/* ── Radar map with LED glow filter (zinc colours) ── */
function PropertyThumb({ community }: { community: string }) {
  return (
    <div
      className="hidden sm:flex relative shrink-0 overflow-hidden items-end"
      style={{
        width: 180,
        minHeight: "100%",
        background: "radial-gradient(circle at 50% 0%, #27272a 0%, #18181b 100%)",
      }}
    >
      <svg
        viewBox="0 0 180 220"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <defs>
          {/* Grid pattern */}
          <pattern id="radar-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
          </pattern>
          {/* LED glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect x="0" y="0" width="180" height="220" fill="url(#radar-grid)"/>

        {/* Radar rings */}
        <circle cx="90" cy="110" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <circle cx="90" cy="110" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <circle cx="90" cy="110" r="140" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

        {/* Core building wireframe (softened) */}
        <path d="M 40 100 L 60 100 L 60 60 L 70 60 L 70 35 L 80 20 L 90 35 L 100 20 L 110 35 L 110 60 L 120 60 L 120 100 L 140 100 L 140 140 L 40 140 Z" 
              fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M 50 140 L 50 115 L 70 115 L 70 140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
        <path d="M 110 140 L 110 115 L 130 115 L 130 140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>

        {/* Outlying buildings */}
        <rect x="22" y="110" width="16" height="30" rx="1" fill="rgba(255,255,255,0.06)"/>
        <rect x="142" y="105" width="16" height="35" rx="1" fill="rgba(255,255,255,0.06)"/>

        {/* Glowing pulse nodes (hot leads) */}
        <circle cx="62" cy="78" r="3" fill="#10b981" fillOpacity="0.9" filter="url(#glow)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="108" cy="52" r="3" fill="#10b981" fillOpacity="0.9" filter="url(#glow)">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="90" cy="95" r="2" fill="#fbbf24" fillOpacity="0.9" filter="url(#glow)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        
        {/* Scan line */}
        <line x1="0" y1="50" x2="180" y2="50" stroke="rgba(16,185,129,0.2)" strokeWidth="1" filter="url(#glow)">
          <animate attributeName="y1" values="20;200" dur="4s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="20;200" dur="4s" repeatCount="indefinite"/>
        </line>
      </svg>

      {/* Overlay gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.3) 60%, transparent 100%)"
      }}/>

      {/* Community label */}
      <div className="relative z-10 px-3 pb-3 pt-16 w-full">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300 leading-none">
          {community}
        </p>
      </div>
    </div>
  );
}

function NavItem({
  icon, label, active, count,
}: {
  icon: ReactNode; label: string; active?: boolean; count?: number;
}) {
  return (
    <button className={[
      "relative w-full flex items-center gap-3 px-3 py-[9px] rounded-xl text-left",
      "transition-all duration-150 group",
      active
        ? "bg-emerald-500/[0.08] text-emerald-400"
        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]",
    ].join(" ")}>
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-[18px] bg-emerald-400 rounded-r-full"/>
      )}
      <span className={`shrink-0 ${active ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-400"}`}>
        {icon}
      </span>
      <span className="text-[13px] font-medium">{label}</span>
      {count !== undefined && (
        <span className={`ml-auto mono text-[10px] tabular-nums ${active ? "text-emerald-500/60" : "text-zinc-600"}`}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Semantic badge accent map for the data grid
// ─────────────────────────────────────────────────────────────────────────────
type BadgeAc = "violet" | "cyan" | "emerald";
const BADGE_AC: Record<BadgeAc, string> = {
  violet:  "text-violet-400 border-violet-500/30 bg-violet-500/10",
  cyan:    "text-cyan-400   border-cyan-500/30   bg-cyan-500/10",
  emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function DesignLabPage() {
  const [activeTab,     setActiveTab]     = useState<"hot"|"drops"|"owner"|"stale">("hot");
  const [activeCountry, setActiveCountry] = useState<"UAE"|"KSA">("UAE");
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [saved,         setSaved]         = useState(false);

  const METRICS = [
    {
      label: "Opportunities Today", value: "43,368",
      trend: "+2.4%", up: true, sub: "Best leads to contact",
      color: "#10b981", data: [55,62,58,70,65,78,72,84,80,91,88,95],
    },
    {
      label: "Price Movements",     value: "18,822",
      trend: "+5.1%", up: true, sub: "Listings with price reductions",
      color: "#22d3ee", data: [45,62,40,73,55,80,65,78,70,85,75,90],
    },
    {
      label: "Owner / Direct",      value: "36,336",
      trend: "+1.8%", up: true, sub: "Direct-owner contacts",
      color: "#a78bfa", data: [60,65,62,70,68,75,72,80,78,85,82,88],
    },
    {
      label: "Listing Pressure",    value: "12,794",
      trend: "−0.9%", up: false, sub: "90+ days on market",
      color: "#fbbf24", data: [80,75,78,70,72,65,68,60,62,55,52,48],
    },
  ];

  const TABS = [
    { id:"hot",   label:"Hot Leads",      count:"43,368" },
    { id:"drops", label:"Price Drops",    count:"18,822" },
    { id:"owner", label:"Owner / Direct", count:"36,336" },
    { id:"stale", label:"Stale + Drops",  count:"12,794" },
  ] as const;

  const AI_BRIEF: { c: NoteAc; title: string; body: string }[] = [
    {
      c: "violet",
      title: "Act today",
      body: "3 Marina listings dropped below zone average this week. First-mover advantage is open.",
    },
    {
      c: "cyan",
      title: "Best direct lead",
      body: "Mohammed Al-Khalidi (Tower C) is owner-listed. No agent. Respond within 48 hours.",
    },
    {
      c: "amber",
      title: "Watch",
      body: "Saadiyat absorption is slowing. Check inventory before any buyer showing there.",
    },
  ];

  const MODULES: { icon: ReactNode; label: string; desc: string; stat: string; c: ModAc }[] = [
    { icon:<ScanSearch size={15}/>, label:"Recon Hub",      desc:"Ranked leads across all portals",         stat:"2,841 live",     c:"emerald" },
    { icon:<Eye size={15}/>,        label:"Owner Radar",    desc:"Direct-owner contacts & scoring",         stat:"36,336 leads",   c:"cyan"    },
    { icon:<TrendingDown size={15}/>,label:"Price Drops",   desc:"Price movement signals & history",        stat:"18,822 tracked", c:"violet"  },
    { icon:<BarChart3 size={15}/>,  label:"Market Intel",   desc:"Absorption rates & zone velocity",        stat:"Live feed",       c:"cyan"    },
    { icon:<Zap size={15}/>,        label:"Pressure Index", desc:"Listing pressure & time-on-market",      stat:"412 flagged",    c:"violet"  },
    { icon:<Map size={15}/>,        label:"Communities",    desc:"Supply, demand & density by zone",        stat:"89 zones",       c:"emerald" },
  ];

  const NAV_SECTIONS = [
    {
      label: "COMMAND",
      items: [{ icon:<LayoutDashboard size={15}/>, label:"Dashboard" }],
    },
    {
      label: "OPPORTUNITIES",
      items: [
        { icon:<ScanSearch size={15}/>,    label:"Recon Hub",   active:true, count:43368 },
        { icon:<Users size={15}/>,         label:"Owner Radar",              count:36336 },
        { icon:<TrendingDown size={15}/>,  label:"Price Drops",              count:18822 },
      ],
    },
    {
      label: "MARKET",
      items: [
        { icon:<BarChart3 size={15}/>, label:"Market Intel"   },
        { icon:<Gauge size={15}/>,     label:"Pressure Index" },
        { icon:<Globe2 size={15}/>,    label:"Communities"    },
      ],
    },
    {
      label: "ADMIN",
      items: [{ icon:<Settings size={15}/>, label:"Settings" }],
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="relative flex h-screen overflow-hidden"
      style={{ background: PAGE_BG, color: "#e2e8f0", fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}
    >
      {/* ── Global styles ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .mono { font-family:'DM Mono',monospace; }
        .nums { font-variant-numeric:tabular-nums; }

        @keyframes riseIn {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .r0 { animation: riseIn .5s  .00s both; }
        .r1 { animation: riseIn .5s  .08s both; }
        .r2 { animation: riseIn .5s  .16s both; }
        .r3 { animation: riseIn .5s  .24s both; }
        .r4 { animation: riseIn .5s  .32s both; }
        .r5 { animation: riseIn .5s  .40s both; }

        @keyframes pdot { 0%,100%{opacity:.4} 50%{opacity:1} }

        .glow-border {
          animation: glow 3s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from { box-shadow: 0 0 10px rgba(16,185,129,0.04), 0 0 2px rgba(16,185,129,0.1); }
          to   { box-shadow: 0 0 18px rgba(16,185,129,0.08), 0 0 6px rgba(16,185,129,0.25); }
        }

        ::-webkit-scrollbar        { width:4px; height:4px; }
        ::-webkit-scrollbar-track  { background:transparent; }
        ::-webkit-scrollbar-thumb  { background:rgba(255,255,255,0.09); border-radius:4px; }
      `}</style>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════ SIDEBAR ══════════════ */}
      <aside
        className={[
          "fixed lg:static inset-y-0 left-0 z-50 lg:z-auto",
          "w-[228px] shrink-0 flex flex-col h-full border-r",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
        style={{ background: SIDE, borderColor: BDR }}
      >
        {/* Logo */}
        <div
          className="relative flex items-center gap-3 px-5 py-5 border-b"
          style={{ borderColor: BDR }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#10b981,#0e7490)" }}
          >
            <Building2 size={15} className="text-white"/>
          </div>
          <div>
            <p className="font-bold text-[15px] text-white leading-none tracking-tight">PropIntel</p>
            <p className="mono text-[9px] text-zinc-500 tracking-[0.18em] mt-0.5">GCC · UAE · KSA</p>
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-zinc-500 hover:text-zinc-300 transition-colors"
            onClick={() => setSidebarOpen(false)} aria-label="Close"
          >
            <X size={15}/>
          </button>
        </div>

        {/* Country switcher */}
        <div className="px-4 pt-3.5 pb-3 border-b" style={{ borderColor: BDR }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2 pl-1">Market</p>
          <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: "#09090b" }}>
            {(["UAE","KSA"] as const).map(c => (
              <button
                key={c}
                onClick={() => setActiveCountry(c)}
                className={[
                  "flex-1 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200",
                  activeCountry === c
                    ? "text-white bg-[#27272a]"
                    : "text-zinc-400 hover:text-zinc-200",
                ].join(" ")}
              >{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 pl-1">
            <Pulse/>
            <span className="text-[11px] font-medium text-zinc-400">AED · Live data</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_SECTIONS.map(({ label, items }) => (
            <div key={label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5 px-3">{label}</p>
              <div className="space-y-0.5">
                {items.map(item => <NavItem key={item.label} {...item}/>)}
              </div>
            </div>
          ))}
        </nav>

        {/* AI status */}
        <div className="px-4 py-4 border-t space-y-3" style={{ borderColor: BDR }}>
          <div
            className="rounded-xl px-3.5 py-3 border"
            style={{ background: "#18181b", borderColor: "rgba(167,139,250,0.15)" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Cpu size={11} className="text-violet-400"/>
              <span className="mono text-[9px] text-violet-400 tracking-wider">AI ENGINE</span>
              <Pulse color="bg-violet-400 ml-auto"/>
            </div>
            <p className="text-[12px] text-zinc-300 leading-snug flex items-center">
              Monitoring 61,190 listings · 6 modules active
              <span className="inline-block w-1.5 h-3 bg-violet-400 rounded-sm animate-pulse ml-1.5 align-middle" />
            </p>
          </div>
          <div className="flex items-center gap-2.5 pl-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#10b981,#0e7490)" }}
            >A</div>
            <div>
              <p className="text-[13px] font-semibold text-zinc-200">Analyst</p>
              <p className="mono text-[10px] text-zinc-500">admin@propintel.ae</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════ MAIN ═════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Top header (glassmorphism) ───────────────────────────────── */}
        <header
          className="shrink-0 h-[54px] flex items-center px-5 sm:px-6 gap-4 border-b backdrop-blur-md z-10"
          style={{ background: "rgba(9,9,11,0.8)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <button
            className="lg:hidden text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
            onClick={() => setSidebarOpen(true)} aria-label="Open menu"
          >
            <Menu size={18}/>
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[15px] font-bold text-white truncate tracking-tight">
              UAE Recon Command
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span
                className="text-[10px] font-semibold uppercase text-emerald-400 border rounded-md px-2 py-[3px] tracking-wide"
                style={{ background:"rgba(16,185,129,0.08)", borderColor:"rgba(16,185,129,0.2)" }}
              >UAE</span>
              <span
                className="text-[10px] font-medium text-zinc-300 border rounded-md px-2 py-[3px]"
                style={{ borderColor: BDR }}
              >AED</span>
              <span
                className="flex items-center gap-1.5 pb-[1px] text-[10px] font-medium text-cyan-400 border rounded-md px-2 py-[3px]"
                style={{ background:"rgba(34,211,238,0.06)", borderColor:"rgba(34,211,238,0.2)" }}
              >
                <Pulse color="bg-cyan-400"/>LIVE
              </span>
            </div>
          </div>
          <div className="flex-1"/>
          <div className="flex items-center gap-3">
            <div
              className="hidden md:flex items-center gap-2 border rounded-xl px-3.5 py-2 ring-1 ring-inset ring-zinc-800
                         focus-within:ring-emerald-500/30 focus-within:border-emerald-500/50 transition-all"
              style={{ background: INPUT, borderColor: "rgba(255,255,255,0.1)" }}
            >
              <Search size={13} className="text-zinc-500"/>
              <input
                type="text"
                placeholder="Search leads…"
                className="bg-transparent border-none outline-none text-white placeholder:text-zinc-500 flex-1 min-w-0"
              />
              <span
                className="text-[10px] text-zinc-600 border rounded px-1 ml-4"
                style={{ borderColor: BDRS }}
              >⌘K</span>
            </div>
            <button className="md:hidden text-zinc-500 hover:text-zinc-300 transition-colors">
              <Search size={16}/>
            </button>
            <button className="relative text-zinc-500 hover:text-zinc-300 transition-colors">
              <Bell size={16}/>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full"/>
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#10b981,#0e7490)" }}
            >A</div>
          </div>
        </header>

        {/* ── Scrollable body ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-5 sm:px-6 lg:px-7 py-6 lg:py-7 space-y-5 lg:space-y-6 max-w-[1500px]">
            
            {/* ─── Metrics row (with inner highlights) ─────────────────── */}
            <div className="r0 relative">
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.04), transparent 60%)" }}
              />
              <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {METRICS.map(m => (
                  <div
                    key={m.label}
                    className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-shadow duration-200 ring-1 ring-zinc-800"
                    style={{
                      background: CARD,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 leading-tight">
                        {m.label}
                      </p>
                      <span className={`shrink-0 flex items-center gap-0.5 mono text-[10px] px-1.5 py-0.5 rounded-lg ${
                        m.up 
                          ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-400"
                          : "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-400"
                      }`}>
                        {m.up ? <ArrowUpRight size={9}/> : <ArrowDownRight size={9}/>}
                        {m.trend}
                      </span>
                    </div>
                    <div>
                      <p
                        className="nums font-bold leading-none text-white tracking-tight"
                        style={{ fontSize: "clamp(22px,2.8vw,34px)" }}
                      >{m.value}</p>
                      <p className="text-[11px] font-medium text-zinc-400 mt-1.5 leading-none">{m.sub}</p>
                    </div>
                    <Sparkline data={m.data} color={m.color}/>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Main 2-col: Lead card + Right panel ─────────────────── */}
            <div className="r1 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 items-start">
              {/* ── Featured opportunity card (crown jewel) ───────────── */}
              <div className="relative group">
                <div className="absolute -inset-2 rounded-3xl pointer-events-none"
                  style={{ background: "radial-gradient(circle at 40% 30%, rgba(16,185,129,0.06), transparent 70%)" }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 glow-border ring-1 ring-emerald-500/10"
                  style={{ background: "#18181b" }}
                >
                  <div className="absolute inset-0 rounded-2xl pointer-events-none" 
                    style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.05), transparent 60%)" }}
                  />
                  <div className="relative">
                    <div
                      className="flex items-center justify-between px-5 sm:px-6 py-4 border-b"
                      style={{ borderColor: BDRS }}
                    >
                      <div>
                        <p className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight">
                          Best opportunities to contact today
                        </p>
                        <p className="text-[11px] font-medium text-zinc-400 mt-0.5">
                          Ranked by AI score · Updated 4 min ago
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          className="hidden sm:flex items-center gap-1.5 border rounded-xl px-3 py-1.5 text-[12px] font-medium text-zinc-400 hover:text-white transition-colors"
                          style={{ borderColor: BDR, background: INPUT }}
                        >
                          <ChevronDown size={11}/>Filters
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 lg:p-6">
                      <div
                        className="rounded-2xl border transition-colors duration-200 hover:border-white/[0.13] overflow-hidden shadow-lg shadow-black/20"
                        style={{
                          background: WELL,
                          borderColor: "rgba(255,255,255,0.06)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                        }}
                      >
                        <div className="flex items-stretch min-h-0">
                          <PropertyThumb community="DUBAI MARINA"/>
                          <div className="flex-1 min-w-0 p-4 sm:p-5">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                                <div className="relative w-[52px] h-[52px]">
                                  <ScoreRing score={98} size={52}/>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[14px] font-bold text-emerald-400 nums leading-none">98</span>
                                    <span className="mono text-[8px] text-zinc-500 leading-none mt-0.5">score</span>
                                  </div>
                                </div>
                                <span className="mono text-[9px] text-zinc-500">#1</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  {[
                                    { t:"HOT LEAD",     c:"text-emerald-400", bg:"rgba(16,185,129,0.08)",  b:"rgba(16,185,129,0.25)"  },
                                    { t:"OWNER DIRECT", c:"text-violet-400",  bg:"rgba(167,139,250,0.08)", b:"rgba(167,139,250,0.25)" },
                                    { t:"BELOW MARKET", c:"text-cyan-400",    bg:"rgba(34,211,238,0.07)",  b:"rgba(34,211,238,0.22)"  },
                                  ].map(({ t, c, bg, b }) => (
                                    <span
                                      key={t}
                                      className={`mono text-[9px] font-semibold rounded-md px-2 py-[3px] ${c}`}
                                      style={{ background: bg, border: `1px solid ${b}` }}
                                    >{t}</span>
                                  ))}
                                </div>
                                <h2 className="text-[16px] sm:text-[18px] font-bold text-white leading-tight tracking-tight">
                                  3BR Apartment — Marina Promenade Tower C
                                </h2>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <MapPin size={11} className="text-zinc-500 shrink-0"/>
                                  <span className="text-[12px] text-zinc-300">
                                    Dubai Marina · JBR Waterfront Zone · Dubai, UAE
                                  </span>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center gap-1 shrink-0">
                                <Star size={12} className="text-amber-400 fill-amber-400"/>
                                <span className="mono text-[11px] text-amber-400 nums">94</span>
                              </div>
                            </div>

                            <div
                              className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-3 mb-3 border-t border-b"
                              style={{ borderColor: BDRS }}
                            >
                              {[
                                { icon:<Bed size={12}/>,            v:"3 Beds"          },
                                { icon:<span className="text-zinc-500 text-[11px]">⬜</span>, v:"2,480 sqft" },
                                { icon:<Database size={12}/>,       v:"Bayut · Owner"   },
                                { icon:<span className="mono text-[11px] text-zinc-500">📅</span>, v:"63 days listed" },
                              ].map(({ icon, v }) => (
                                <div key={v} className="flex items-center gap-1.5 text-[12px] text-zinc-300">
                                  <span className="text-zinc-500">{icon}</span>{v}
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Asking</p>
                                <p
                                  className="nums font-bold text-white leading-none tracking-tight"
                                  style={{ fontSize: "clamp(18px,2vw,24px)" }}
                                >AED 3.20M</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Was</p>
                                <p className="nums text-[16px] sm:text-[18px] font-semibold text-zinc-500 line-through leading-none">
                                  3.65M
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Drop</p>
                                <div className="flex items-center gap-1">
                                  <ArrowDownRight size={13} className="text-amber-400 shrink-0"/>
                                  <span className="nums text-[16px] sm:text-[18px] font-bold text-amber-400 leading-none">
                                    −11.8%
                                  </span>
                                </div>
                                <p className="text-[11px] font-medium text-zinc-500 mt-0.5">3 reductions</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">AED/Sqft</p>
                                <p className="nums text-[16px] sm:text-[18px] font-bold text-cyan-400 leading-none">
                                  1,290
                                </p>
                                <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Zone avg 1,480</p>
                              </div>
                            </div>

                            {/* Zone gauge with tick marks */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-medium text-zinc-400">12.8% below zone average — buyer advantage</span>
                                <span className="text-[11px] font-medium text-cyan-400">1,290 / 1,480</span>
                              </div>
                              <div
                                className="h-[3px] rounded-full relative overflow-hidden"
                                style={{
                                  background: `repeating-linear-gradient(90deg, 
                                    transparent, 
                                    transparent calc(100%/13 - 1px), 
                                    rgba(255,255,255,0.15) calc(100%/13 - 1px), 
                                    rgba(255,255,255,0.15) calc(100%/13 + 1px))`,
                                }}
                              >
                                <div
                                  className="h-full rounded-full bg-cyan-500 absolute left-0 top-0"
                                  style={{ width: "87%" }}
                                />
                              </div>
                            </div>

                            <div
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t"
                              style={{ borderColor: BDRS }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-zinc-200 shrink-0"
                                  style={{ background:"#27272a" }}
                                >MK</div>
                                <div>
                                  <p className="text-[13px] font-semibold text-zinc-200">Mohammed Al-Khalidi</p>
                                  <p className="text-[11px] font-medium text-zinc-500">Better Homes · +971 50 123 4567</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:shrink-0">
                                <button
                                  onClick={() => setSaved(s => !s)}
                                  className={[
                                    "flex items-center gap-1.5 border rounded-xl px-3.5 py-2 text-[12px] font-medium transition-all active:scale-[0.98]",
                                    saved
                                      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.08]"
                                      : "text-zinc-400 hover:text-white hover:border-white/20",
                                  ].join(" ")}
                                  style={!saved ? { borderColor: BDR } : {}}
                                >
                                  <Bookmark size={13} className={saved ? "fill-emerald-400" : ""}/>
                                  {saved ? "Saved" : "Save Lead"}
                                </button>
                                <button
                                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] font-bold text-white hover:opacity-90 transition-all active:scale-[0.98]"
                                  style={{ background:"#10b981" }}
                                >
                                  <ExternalLink size={13}/>Open Listing
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-[11px] font-medium text-zinc-500">
                          Showing #1 of 43,368 ranked opportunities
                        </p>
                        <button className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-400 transition-colors">
                          Load next <ChevronRight size={10}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right panel ──────────────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                {/* AI Action Brief (inner highlight) */}
                <div
                  className="rounded-2xl border p-5"
                  style={{
                    background: CARD,
                    borderColor: BDR,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background:"rgba(167,139,250,0.14)" }}
                    >
                      <Cpu size={13} className="text-violet-400"/>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white leading-none">AI Action Brief</p>
                      <p className="text-[11px] font-medium text-zinc-400 mt-0.5">What to focus on today</p>
                    </div>
                    <Pulse color="bg-violet-400 ml-auto"/>
                  </div>
                  <div className="space-y-3">
                    {AI_BRIEF.map(({ c, title, body }) => {
                      const a = NOTE_AC[c];
                      return (
                        <div
                          key={title}
                          className="flex gap-3 rounded-xl p-3.5 border"
                          style={{ background: a.bg, borderColor: a.bdr }}
                        >
                          <div
                            className="w-[4px] rounded-full shrink-0"
                            style={{
                              background: a.bar,
                              minHeight: "100%",
                              filter: `drop-shadow(0 0 3px ${a.bar}80)`,
                            }}
                          />
                          <div className="min-w-0">
                            <p className={`text-[12px] font-bold mb-1 ${a.txt}`}>{title}</p>
                            <p className="text-[12px] text-zinc-300 leading-snug">{body}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: BDRS }}>
                    <div
                      className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 border ring-1 ring-inset ring-zinc-800"
                      style={{ background: INPUT, borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      <span className="text-[12px] text-zinc-500 flex-1 select-none">
                        Ask about a specific lead…
                      </span>
                      <ArrowUpRight size={12} className="text-violet-500 shrink-0"/>
                    </div>
                  </div>
                </div>

                {/* Market Pulse (inner highlight, grounded bars) */}
                <div
                  className="rounded-2xl border p-5"
                  style={{
                    background: CARD,
                    borderColor: BDR,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[13px] font-bold text-white leading-none">Market Pulse</p>
                      <p className="text-[11px] font-medium text-zinc-400 mt-1">{activeCountry} · 30-day listing velocity</p>
                    </div>
                    <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                      <RefreshCw size={12}/>
                    </button>
                  </div>
                  <div 
                    className="flex items-end gap-[3px] h-[48px] mb-5 relative"
                    style={{
                      background: "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(255,255,255,0.05) 12px)"
                    }}
                  >
                    {[36,50,42,66,56,72,60,86,74,90,80,94,86,100].map((v,i,arr) => {
                      const isLast = i === arr.length-1;
                      const bg = isLast 
                        ? "linear-gradient(to top, rgba(16,185,129,0.8), rgba(16,185,129,0.3))"
                        : i >= arr.length-4 
                          ? "rgba(16,185,129,0.25)" 
                          : "rgba(255,255,255,0.06)";
                      return (
                        <div key={i} className="flex-1 rounded-t-[2px] transition-all" style={{
                          height:`${v}%`,
                          background: bg,
                          ...(isLast && { boxShadow: "0 0 6px rgba(16,185,129,0.4)" })
                        }}/>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label:"Dubai",   val:"2,841",  color:"text-emerald-400" },
                      { label:"AD",      val:"1,204",  color:"text-cyan-400"    },
                      { label:"Riyadh",  val:"892",    color:"text-violet-400"  },
                    ].map(({ label, val, color }) => (
                      <div key={label}
                        className="rounded-xl p-2.5 text-center border"
                        style={{ background: WELL, borderColor: BDRS }}
                      >
                        <p className={`nums text-[14px] font-bold ${color}`}>{val}</p>
                        <p className="text-[10px] font-medium text-zinc-400 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">OPPORTUNITY DENSITY · 14 WEEKS</p>
                    <HeatGrid/>
                  </div>
                </div>

                {/* ── Live Intercepts / Signal Feed ───────────────────── */}
                <div
                  className="rounded-2xl border p-5"
                  style={{
                    background: CARD,
                    borderColor: BDR,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-bold text-white leading-none">Live Intercepts</p>
                    <Pulse color="bg-cyan-400" />
                  </div>
                  <div className="space-y-0 divide-y divide-white/[0.06]">
                    {[
                      { icon: <TrendingDown size={12} className="text-amber-400" />, text: "AED 150K drop · Downtown Dubai", time: "Just now" },
                      { icon: <Users size={12} className="text-violet-400" />, text: "New direct owner · Palm Jumeirah", time: "2m ago" },
                      { icon: <ScanSearch size={12} className="text-cyan-400" />, text: "Duplicate listing removed · JVC", time: "14m ago" },
                      { icon: <Building2 size={12} className="text-emerald-400" />, text: "High-conviction lead flagged", time: "1h ago" },
                    ].map((ev, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                        <span className="shrink-0">{ev.icon}</span>
                        <div className="min-w-0 flex-1 text-[11px] text-zinc-300 leading-tight">{ev.text}</div>
                        <span className="text-[10px] text-zinc-500 whitespace-nowrap">{ev.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Explore all leads (tabs upgraded, row hover left highlight) ── */}
            <div className="r2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[14px] font-bold text-white">Explore all leads</p>
                <button className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-400 transition-colors">
                  All filters <ChevronRight size={11}/>
                </button>
              </div>
              <div
                className="rounded-2xl border overflow-hidden shadow-lg shadow-black/30"
                style={{ background: CARD, borderColor: BDR }}
              >
                <div className="flex overflow-x-auto border-b px-4 sm:px-6" style={{ borderColor: BDRS }}>
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={[
                        "flex items-center gap-2 py-3 mr-5 text-[12px] font-semibold shrink-0",
                        "border-b-[2px] transition-all duration-150 whitespace-nowrap",
                        activeTab === tab.id
                          ? "border-emerald-400 text-white bg-white/[0.03] rounded-t-lg"
                          : "border-transparent text-zinc-400 hover:text-zinc-300",
                      ].join(" ")}
                    >
                      {tab.label}
                      <span className={`mono text-[10px] px-1.5 py-0.5 rounded-lg nums ${
                        activeTab === tab.id
                          ? "text-emerald-400 bg-emerald-500/[0.1]"
                          : "text-zinc-500 bg-white/[0.04]"
                      }`}>{tab.count}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 py-3">
                  <div
                    className="flex items-center gap-2 border rounded-xl px-3 py-1.5 flex-1 max-w-[200px] ring-1 ring-inset ring-zinc-800
                               focus-within:ring-emerald-500/30 focus-within:border-emerald-500/50 transition-all"
                    style={{ background: INPUT, borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <Search size={11} className="text-zinc-500 shrink-0"/>
                    <input
                      type="text"
                      placeholder="Search listings…"
                      className="bg-transparent border-none outline-none text-white placeholder:text-zinc-500 text-[11px] flex-1 min-w-0"
                    />
                  </div>
                  {["Location","Portal","Min Score"].map(f => (
                    <button
                      key={f}
                      className="flex items-center gap-1 border rounded-xl px-3 py-1.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
                      style={{ background: INPUT, borderColor: BDR }}
                    >
                      {f}<ChevronDown size={9}/>
                    </button>
                  ))}
                  <span className="ml-auto text-[11px] font-medium text-zinc-500 hidden sm:block">43,368 results</span>
                </div>

                {/* Data Grid Header Row */}
                <div className="flex items-center gap-4 px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  <span className="w-5 shrink-0">#</span>
                  <span className="flex-1 min-w-0">ASSET & LOCATION</span>
                  <span className="hidden sm:block w-24 shrink-0">SIGNAL</span>
                  <span className="text-right w-[100px] shrink-0">PRICING</span>
                  {/* invisible column for hover score */}
                  <span className="w-8 shrink-0"></span>
                </div>

                <div className="px-4 sm:px-6 pb-4 space-y-1.5">
                  {[
                    { rank:2, title:"2BR — Park Island Tower B",    loc:"Dubai Marina",  score:94, badge:"Price Drop",   color:"violet"  as BadgeAc, price:"AED 1.82M", drop:"−8.4%" },
                    { rank:3, title:"Studio — Cayan Tower",          loc:"JBR, Dubai",    score:91, badge:"Owner Direct", color:"cyan"    as BadgeAc, price:"AED 890K",  drop:"−6.1%" },
                    { rank:4, title:"4BR Penthouse — Address Marina", loc:"Dubai Marina",  score:88, badge:"Below Market", color:"emerald" as BadgeAc, price:"AED 7.4M",  drop:"−5.3%" },
                  ].map(r => (
                    <div
                      key={r.rank}
                      className="flex items-center gap-4 px-3 py-2 rounded-xl border border-l-2 border-l-transparent transition-all hover:bg-white/[0.04] hover:border-l-emerald-400/50 hover:translate-y-[-1px] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-lg hover:shadow-black/30 active:scale-[0.98] cursor-pointer group"
                      style={{ background: WELL, borderColor: BDRS }}
                    >
                      <span className="mono text-[11px] text-zinc-500 w-5 shrink-0">#{r.rank}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-zinc-200 truncate">{r.title}</p>
                        <p className="text-[10px] font-medium text-zinc-500">{r.loc}</p>
                      </div>
                      <span className={`hidden sm:block text-[10px] font-medium border rounded px-2 py-0.5 ${BADGE_AC[r.color]}`}>
                        {r.badge}
                      </span>
                      <div className="text-right shrink-0 w-[100px]">
                        <p className="nums text-[13px] font-extrabold text-white">{r.price}</p>
                        <p className="text-[11px] font-medium text-amber-400">{r.drop}</p>
                      </div>
                      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out"
                        style={{ background:"rgba(16,185,129,0.1)", borderColor:"rgba(16,185,129,0.2)" }}>
                        <span className="nums text-[11px] font-bold text-emerald-400">{r.score}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 text-[11px] font-medium text-zinc-500 hover:text-zinc-400 transition-colors text-center">
                    Load 43,365 more opportunities →
                  </button>
                </div>
              </div>
            </div>

            {/* ─── Intelligence Modules (grid pattern + inner highlight) ─ */}
            <div className="r3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[14px] font-bold text-white">Intelligence Modules</p>
                <button className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-400 transition-colors">
                  All modules<ChevronRight size={11}/>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MODULES.map(mod => {
                  const ac = MOD_AC[mod.c];
                  return (
                    <div
                      key={mod.label}
                      className="relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer group overflow-hidden active:scale-[0.98]"
                      style={{
                        background: CARD,
                        borderColor: BDR,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Grid pattern overlay */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                        backgroundSize: "12px 12px"
                      }}/>
                      <div className="relative z-10 flex items-start justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border ${ac.ring}`}
                          style={{ background: ac.bg }}
                        >
                          <span className={ac.icon}>{mod.icon}</span>
                        </div>
                        <ArrowUpRight size={14}
                          className="text-zinc-600 group-hover:text-zinc-400 transition-colors"/>
                      </div>
                      <p className="relative z-10 text-[13px] font-bold text-white mb-1">{mod.label}</p>
                      <p className="relative z-10 text-[11px] text-zinc-400 leading-snug mb-3">{mod.desc}</p>
                      <span className={`relative z-10 mono text-[10px] rounded-lg px-2.5 py-1 ${ac.chip}`}>
                        {mod.stat}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── Source coverage + status ────────────────────────────── */}
            <div className="r4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
              <div
                className="rounded-2xl border p-5"
                style={{
                  background: CARD,
                  borderColor: BDR,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Database size={13} className="text-cyan-400"/>
                  <p className="text-[13px] font-bold text-white">Source Coverage</p>
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                    <Pulse/>All live
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { src:"Bayut",           pct:94, color:"#10b981" },
                    { src:"Property Finder", pct:88, color:"#22d3ee" },
                    { src:"Dubizzle",        pct:76, color:"#a78bfa" },
                    { src:"Aqar (KSA)",      pct:61, color:"#64748b" },
                  ].map(({ src, pct, color }) => (
                    <div key={src}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[12px] font-medium text-zinc-300">{src}</span>
                        <span className="mono text-[10px] text-zinc-500 nums">{pct}%</span>
                      </div>
                      <div className="h-[3px] rounded-full" style={{ background:"rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width:`${pct}%`, background:color }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="rounded-2xl border px-5 py-4 flex flex-col gap-2"
                style={{
                  background: "#18181b",
                  borderColor: BDRS,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05)",
                }}
              >
                {[
                  { l:"Sources",    v:"14 active",    dot:"bg-emerald-400" },
                  { l:"Last crawl", v:"4 min ago",    dot:"bg-cyan-400"    },
                  { l:"Indexed",    v:"2.4M records",  dot:"bg-violet-400"  },
                  { l:"Uptime",     v:"99.9%",         dot:"bg-emerald-400" },
                ].map(({ l, v, dot }) => (
                  <div key={l} className="flex items-center gap-2 whitespace-nowrap">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`}/>
                    <span className="text-[11px] font-medium text-zinc-400">{l}</span>
                    <span className="text-[11px] font-medium text-zinc-300 ml-auto pl-4">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-4"/>
          </div>
        </div>
      </div>
    </div>
  );
}