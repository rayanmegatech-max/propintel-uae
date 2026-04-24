"use client";

import {
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
  ListFilter, Activity, Clock, Zap, Calculator, Crosshair, MapPin,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// STATIC CHART DATA
// (replace with server-fetched props as needed)
// ─────────────────────────────────────────────
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
  { id: 1, label: "Absorption spike detected",    sub: "JVC · Villa Segment",         time: "2m ago",  color: "text-emerald-600", bg: "bg-emerald-50", Icon: Zap         },
  { id: 2, label: "TDOM anomaly flagged",          sub: "Palm Jumeirah · Apt",          time: "11m ago", color: "text-amber-600",   bg: "bg-amber-50",   Icon: Clock       },
  { id: 3, label: "Listing volume –8.4%",          sub: "Abu Dhabi · Commercial",       time: "34m ago", color: "text-rose-500",    bg: "bg-rose-50",    Icon: TrendingDown },
  { id: 4, label: "New arbitrage window",          sub: "Dubai Marina · Off-plan",      time: "1h ago",  color: "text-emerald-600", bg: "bg-emerald-50", Icon: Crosshair   },
  { id: 5, label: "ReEstimate™ batch complete",    sub: "2,340 units recalculated",     time: "2h ago",  color: "text-slate-500",   bg: "bg-slate-100",  Icon: Calculator  },
];

const TOP_LISTINGS = [
  { area: "Downtown Dubai",           listings: 3842, delta: "+4.2%", up: true  },
  { area: "Business Bay",             listings: 2917, delta: "+1.8%", up: true  },
  { area: "Palm Jumeirah",            listings: 1654, delta: "–2.1%", up: false },
  { area: "Jumeirah Village Circle",  listings: 4201, delta: "+7.3%", up: true  },
  { area: "Dubai Marina",             listings: 3108, delta: "+0.4%", up: true  },
];

// ─────────────────────────────────────────────
// METRIC CARD CONFIG
// ─────────────────────────────────────────────
type AccentKey = "emerald" | "blue" | "violet";

const ACCENT_MAP: Record<AccentKey, { bg: string; icon: string; badge: string }> = {
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  blue:    { bg: "bg-blue-50",    icon: "text-blue-600",    badge: "bg-blue-100 text-blue-700"       },
  violet:  { bg: "bg-violet-50",  icon: "text-violet-600",  badge: "bg-violet-100 text-violet-700"   },
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
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
      sub:    "Time on market (all types)",
      Icon:   Clock,
      accent: "violet" as AccentKey,
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Page heading */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Good Morning, Ahmed ☕
          </p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Market Intelligence Overview
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin size={12} />
          <span>UAE · All Emirates</span>
          <span className="mx-1 text-slate-200">|</span>
          {/* Swap for a real date in production */}
          <span>Tue, 21 Apr 2026 · 08:14 GST</span>
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-3 gap-4">
        {metricCards.map(({ label, stat, sub, Icon, accent }) => {
          const a = ACCENT_MAP[accent];
          return (
            <div
              key={label}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${a.bg}`}>
                  <Icon size={16} className={a.icon} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${a.badge}`}>
                  {stat.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {stat.delta}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 mt-0.5">{label}</p>
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-100 pt-2.5">{sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── MIDDLE ROW: Chart + Signal Feed ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Area chart — 2 cols */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">Listing Volume Trend</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Active units across all emirates · 6-month rolling
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={11} /> +14.1% period
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={AREA_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis                 tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                cursor={{ stroke: "#e2e8f0" }}
              />
              <Area
                type="monotone" dataKey="value"
                stroke="#10b981" strokeWidth={2}
                fill="url(#emeraldGrad)"
                dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Signal Feed — 1 col */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">Signal Feed</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex-1 space-y-1 overflow-auto">
            {ACTIVITY_FEED.map(({ id, label, sub, time, color, bg, Icon }) => (
              <div
                key={id}
                className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className={`mt-0.5 p-1.5 rounded-md ${bg} shrink-0`}>
                  <Icon size={12} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{label}</p>
                  <p className="text-[11px] text-slate-400 truncate">{sub}</p>
                </div>
                <p className="text-[10px] text-slate-300 shrink-0 mt-0.5">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Bar Chart + Top Areas ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Volume by Emirate */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-0.5">Volume by Emirate</p>
          <p className="text-xs text-slate-400 mb-4">Transactions (units) · MTD</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={BAR_DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="zone" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis                tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="vol" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Active Areas — 2 cols */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">Top Active Areas</p>
              <p className="text-xs text-slate-400 mt-0.5">By listing count · all property types</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors">
              <ListFilter size={12} /> Filter
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="text-left pb-2 font-semibold">Area</th>
                <th className="text-right pb-2 font-semibold">Listings</th>
                <th className="text-right pb-2 font-semibold">30-day Δ</th>
                <th className="text-right pb-2 font-semibold">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TOP_LISTINGS.map(({ area, listings, delta, up }) => (
                <tr key={area} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="py-2.5 font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
                    {area}
                  </td>
                  <td className="py-2.5 text-right text-slate-600 font-mono text-xs">
                    {listings.toLocaleString()}
                  </td>
                  <td className={`py-2.5 text-right font-semibold text-xs ${up ? "text-emerald-600" : "text-rose-500"}`}>
                    {delta}
                  </td>
                  <td className="py-2.5 text-right">
                    {up ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <TrendingUp size={9} /> Rising
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <TrendingDown size={9} /> Cooling
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}