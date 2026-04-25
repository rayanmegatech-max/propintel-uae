"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
  ListFilter, Activity, Clock, Zap, Calculator, Crosshair, MapPin,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface MetricStat {
  value: string;
  delta: string;
  up: boolean;
}

interface MorningCoffeeGridProps {
  metrics: {
    totalActiveListings: MetricStat;
    marketTurnover:      MetricStat;
    avgTDOM:             MetricStat;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  (preserved verbatim — swap for server props as needed)
// ─────────────────────────────────────────────────────────────────────────────

const AREA_DATA = [
  { month: "Nov", value: 4200 },
  { month: "Dec", value: 3800 },
  { month: "Jan", value: 5100 },
  { month: "Feb", value: 4700 },
  { month: "Mar", value: 6200 },
  { month: "Apr", value: 5800 },
];

const BAR_DATA = [
  { zone: "DXB", vol: 1840 },
  { zone: "AUH", vol: 1120 },
  { zone: "SHJ", vol: 670  },
  { zone: "RAK", vol: 290  },
  { zone: "AJM", vol: 180  },
];

const ACTIVITY_FEED = [
  { id: 1, label: "Absorption spike detected",  sub: "JVC · Villa Segment",        time: "2m ago",  iconCls: "text-emerald-400", bgCls: "bg-emerald-500/15", Icon: Zap         },
  { id: 2, label: "TDOM anomaly flagged",        sub: "Palm Jumeirah · Apt",         time: "11m ago", iconCls: "text-amber-400",   bgCls: "bg-amber-500/15",   Icon: Clock       },
  { id: 3, label: "Listing volume –8.4%",        sub: "Abu Dhabi · Commercial",      time: "34m ago", iconCls: "text-rose-400",    bgCls: "bg-rose-500/15",    Icon: TrendingDown },
  { id: 4, label: "New arbitrage window",        sub: "Dubai Marina · Off-plan",     time: "1h ago",  iconCls: "text-emerald-400", bgCls: "bg-emerald-500/15", Icon: Crosshair   },
  { id: 5, label: "ReEstimate™ batch complete",  sub: "2,340 units recalculated",    time: "2h ago",  iconCls: "text-slate-400",   bgCls: "bg-white/[0.05]",   Icon: Calculator  },
];

const TOP_LISTINGS = [
  { area: "Downtown Dubai",          listings: 3842, delta: "+4.2%", up: true  },
  { area: "Business Bay",            listings: 2917, delta: "+1.8%", up: true  },
  { area: "Palm Jumeirah",           listings: 1654, delta: "–2.1%", up: false },
  { area: "Jumeirah Village Circle", listings: 4201, delta: "+7.3%", up: true  },
  { area: "Dubai Marina",            listings: 3108, delta: "+0.4%", up: true  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG AREA CHART  (replaces Recharts AreaChart — no responsiveness bugs)
// ─────────────────────────────────────────────────────────────────────────────

function SvgAreaChart() {
  // Normalise AREA_DATA into a 0-100 scale for the SVG viewport
  const W = 480;
  const H = 120;
  const PAD = { t: 8, r: 8, b: 24, l: 32 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const vals  = AREA_DATA.map((d) => d.value);
  const minV  = Math.min(...vals);
  const maxV  = Math.max(...vals);
  const range = maxV - minV || 1;

  const pts = AREA_DATA.map((d, i) => {
    const x = PAD.l + (i / (AREA_DATA.length - 1)) * innerW;
    const y = PAD.t + innerH - ((d.value - minV) / range) * innerH;
    return [x, y] as [number, number];
  });

  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${(PAD.t + innerH).toFixed(1)} L${PAD.l.toFixed(1)},${(PAD.t + innerH).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: 150 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="mcg-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 0.33, 0.66, 1].map((t, i) => {
        const y = PAD.t + innerH * t;
        return (
          <line
            key={i}
            x1={PAD.l} y1={y.toFixed(1)}
            x2={PAD.l + innerW} y2={y.toFixed(1)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1"
          />
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#mcg-area-grad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots + x-axis labels */}
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="3" fill="#10b981" />
          <text
            x={x.toFixed(1)} y={(PAD.t + innerH + 14).toFixed(1)}
            textAnchor="middle" fontSize="10" fill="rgba(148,163,184,0.9)"
          >
            {AREA_DATA[i].month}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG BAR CHART  (replaces Recharts BarChart)
// ─────────────────────────────────────────────────────────────────────────────

function SvgBarChart() {
  const W = 280;
  const H = 140;
  const PAD = { t: 8, r: 8, b: 24, l: 8 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const maxVol = Math.max(...BAR_DATA.map((d) => d.vol));
  const barW   = innerW / BAR_DATA.length;
  const barGap = barW * 0.25;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: 140 }}
      aria-hidden
    >
      {/* Horizontal grid */}
      {[0, 0.5, 1].map((t, i) => {
        const y = PAD.t + innerH * t;
        return (
          <line
            key={i}
            x1={PAD.l} y1={y.toFixed(1)}
            x2={PAD.l + innerW} y2={y.toFixed(1)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1"
          />
        );
      })}

      {BAR_DATA.map(({ zone, vol }, i) => {
        const barH  = (vol / maxVol) * innerH;
        const x     = PAD.l + i * barW + barGap / 2;
        const y     = PAD.t + innerH - barH;
        const w     = barW - barGap;

        return (
          <g key={zone}>
            <rect
              x={x.toFixed(1)} y={y.toFixed(1)}
              width={w.toFixed(1)} height={barH.toFixed(1)}
              fill="#10b981" opacity="0.8"
              rx="3" ry="3"
            />
            <text
              x={(x + w / 2).toFixed(1)}
              y={(PAD.t + innerH + 14).toFixed(1)}
              textAnchor="middle" fontSize="10" fill="rgba(148,163,184,0.9)"
            >
              {zone}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC CARD CONFIG
// ─────────────────────────────────────────────────────────────────────────────

type AccentKey = "emerald" | "blue" | "violet";

const ACCENT_MAP: Record<AccentKey, { iconBg: string; iconCls: string; badgeCls: string }> = {
  emerald: { iconBg: "bg-emerald-500/15", iconCls: "text-emerald-400", badgeCls: "bg-emerald-500/15 text-emerald-400" },
  blue:    { iconBg: "bg-blue-500/15",    iconCls: "text-blue-400",    badgeCls: "bg-blue-500/15 text-blue-400"       },
  violet:  { iconBg: "bg-violet-500/15",  iconCls: "text-violet-400",  badgeCls: "bg-violet-500/15 text-violet-400"   },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function MorningCoffeeGrid({ metrics }: MorningCoffeeGridProps) {

  const metricCards = [
    {
      label:  "Total Active Listings",
      stat:   metrics.totalActiveListings,
      sub:    "vs. last 30 days",
      Icon:   ListFilter,
      accent: "emerald" as AccentKey,
    },
    {
      label:  "Market Turnover",
      stat:   metrics.marketTurnover,
      sub:    "Monthly transaction volume",
      Icon:   Activity,
      accent: "blue" as AccentKey,
    },
    {
      label:  "Avg. TDOM",
      stat:   metrics.avgTDOM,
      sub:    "Time on market · all types",
      Icon:   Clock,
      accent: "violet" as AccentKey,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* ── Page heading ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Good Morning, Ahmed ☕
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Market Intelligence Overview
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <MapPin className="h-3 w-3 shrink-0" />
          <span>UAE · All Emirates</span>
          <span className="mx-1 opacity-30">|</span>
          <span>Tue, 21 Apr 2026 · 08:14 GST</span>
        </div>
      </motion.div>

      {/* ── METRIC CARDS ──────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {metricCards.map(({ label, stat, sub, Icon, accent }) => {
          const a = ACCENT_MAP[accent];
          return (
            <motion.div key={label} variants={cardVariant}>
              <GlassCard className="flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-xl hover:shadow-black/30">
                {/* Icon + delta badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.iconBg}`}>
                    <Icon className={`h-4 w-4 ${a.iconCls}`} />
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${a.badgeCls}`}>
                    {stat.up
                      ? <ArrowUpRight className="h-3 w-3" />
                      : <ArrowDownRight className="h-3 w-3" />
                    }
                    {stat.delta}
                  </span>
                </div>

                {/* Value + label */}
                <div>
                  <p className="text-[1.65rem] font-black leading-none tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-slate-400">{label}</p>
                </div>

                {/* Sub */}
                <p className="border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">{sub}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── MIDDLE ROW: Area chart + Signal Feed ──────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Area chart — takes 2 cols on lg */}
        <motion.div variants={cardVariant} className="lg:col-span-2">
          <GlassCard className="h-full p-5">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Listing Volume Trend</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Active units across all emirates · 6-month rolling
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                +14.1% period
              </span>
            </div>

            {/* SVG chart */}
            <div className="mt-4 overflow-hidden">
              <SvgAreaChart />
            </div>
          </GlassCard>
        </motion.div>

        {/* Signal Feed — 1 col */}
        <motion.div variants={cardVariant}>
          <GlassCard className="flex h-full flex-col p-5">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Signal Feed</p>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Feed items */}
            <div className="flex-1 space-y-1 overflow-y-auto">
              {ACTIVITY_FEED.map(({ id, label, sub, time, iconCls, bgCls, Icon }) => (
                <div
                  key={id}
                  className="flex items-start gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-white/[0.04] cursor-pointer"
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bgCls}`}>
                    <Icon className={`h-3.5 w-3.5 ${iconCls}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-slate-200">{label}</p>
                    <p className="truncate text-[11px] text-slate-500">{sub}</p>
                  </div>
                  <p className="shrink-0 text-[10px] text-slate-600 mt-0.5">{time}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* ── BOTTOM ROW: Bar chart + Top Areas ─────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Volume by Emirate — 1 col */}
        <motion.div variants={cardVariant}>
          <GlassCard className="h-full p-5">
            <p className="text-sm font-semibold text-white">Volume by Emirate</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Transactions (units) · MTD</p>
            <div className="mt-4 overflow-hidden">
              <SvgBarChart />
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Active Areas — 2 cols */}
        <motion.div variants={cardVariant} className="lg:col-span-2">
          <GlassCard className="h-full p-5">
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Top Active Areas</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  By listing count · all property types
                </p>
              </div>
              <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.08] hover:text-white">
                <ListFilter className="h-3 w-3" />
                Filter
              </button>
            </div>

            {/* Horizontally scrollable table on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    {["Area", "Listings", "30-day Δ", "Signal"].map((h, i) => (
                      <th
                        key={h}
                        className={`pb-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 ${i > 0 ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {TOP_LISTINGS.map(({ area, listings, delta, up }) => (
                    <tr
                      key={area}
                      className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="py-2.5 pr-4 font-medium text-slate-200 group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                        {area}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[12px] text-slate-400">
                        {listings.toLocaleString()}
                      </td>
                      <td className={`py-2.5 text-right text-[12px] font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}>
                        {delta}
                      </td>
                      <td className="py-2.5 text-right">
                        {up ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            <TrendingUp className="h-2.5 w-2.5" />
                            Rising
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
                            <TrendingDown className="h-2.5 w-2.5" />
                            Cooling
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

    </div>
  );
}