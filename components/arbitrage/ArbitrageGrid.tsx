"use client";

import { useState, useMemo } from "react";
import {
  Crosshair, SlidersHorizontal, TrendingUp, Building2,
  BedDouble, ChevronUp, ChevronDown, ChevronsUpDown,
  BadgeCheck, AlertTriangle, Minus, Search, Filter,
  ArrowUpRight, Info, Star, Zap, BarChart2, CircleDot,
  ChevronRight, RefreshCw
} from "lucide-react";

// ── RAW DATA ──────────────────────────────────────────────────────────────────
const RAW_OPPORTUNITIES = [
  { id: 1,  building: "Marina Gate II",       community: "Dubai Marina",          beds: 1, annualLease: 95000,  strRevRaw: 198000, comps: 34, confidence: 92 },
  { id: 2,  building: "Five Palm Residences", community: "Palm Jumeirah",         beds: 2, annualLease: 280000, strRevRaw: 612000, comps: 21, confidence: 88 },
  { id: 3,  building: "Vida Residences",      community: "Downtown Dubai",        beds: 1, annualLease: 130000, strRevRaw: 248000, comps: 47, confidence: 95 },
  { id: 4,  building: "The Address BLVD",     community: "Downtown Dubai",        beds: 2, annualLease: 210000, strRevRaw: 390000, comps: 29, confidence: 91 },
  { id: 5,  building: "Shams JBR",            community: "Jumeirah Beach Res.",   beds: 3, annualLease: 195000, strRevRaw: 342000, comps: 18, confidence: 79 },
  { id: 6,  building: "Index Tower",          community: "DIFC",                  beds: 1, annualLease: 115000, strRevRaw: 189000, comps: 12, confidence: 71 },
  { id: 7,  building: "Silverene Tower B",    community: "Dubai Marina",          beds: 2, annualLease: 145000, strRevRaw: 262000, comps: 38, confidence: 94 },
  { id: 8,  building: "Ocean Heights",        community: "Dubai Marina",          beds: 1, annualLease: 88000,  strRevRaw: 141000, comps: 41, confidence: 90 },
  { id: 9,  building: "Burj Vista 1",         community: "Downtown Dubai",        beds: 3, annualLease: 310000, strRevRaw: 498000, comps: 16, confidence: 83 },
  { id: 10, building: "Botanica Tower",       community: "Jumeirah Village Cir.", beds: 1, annualLease: 52000,  strRevRaw: 79000,  comps: 22, confidence: 76 },
  { id: 11, building: "Rimal 3",              community: "Jumeirah Beach Res.",   beds: 2, annualLease: 155000, strRevRaw: 271000, comps: 33, confidence: 87 },
  { id: 12, building: "Sky Gardens",          community: "DIFC",                  beds: 1, annualLease: 108000, strRevRaw: 162000, comps: 9,  confidence: 65 },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
function calcMetrics(
  row: (typeof RAW_OPPORTUNITIES)[number],
  occupancy: number,
  mgmtFee: number
) {
  const adj = row.strRevRaw * (occupancy / 100) * (1 - mgmtFee / 100);
  const grossMarginAED = adj - row.annualLease;
  const grossMarginPct = (grossMarginAED / row.annualLease) * 100;
  return { ...row, adjStrRev: Math.round(adj), grossMarginAED: Math.round(grossMarginAED), grossMarginPct };
}

function fmtAED(n) {
  if (Math.abs(n) >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)     return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n}`;
}

function confidenceMeta(score) {
  if (score >= 88) return { label: "High",   color: "text-emerald-600", bg: "bg-emerald-50",  icon: BadgeCheck   };
  if (score >= 74) return { label: "Medium", color: "text-amber-600",   bg: "bg-amber-50",    icon: AlertTriangle};
  return               { label: "Low",    color: "text-rose-500",    bg: "bg-rose-50",     icon: Minus        };
}

function marginColor(pct) {
  if (pct >= 60) return "text-emerald-600";
  if (pct >= 30) return "text-amber-600";
  return "text-rose-500";
}

function MarginBar({ pct }) {
  const clamped = Math.min(Math.max(pct, 0), 150);
  const w = Math.round((clamped / 150) * 100);
  const bg = pct >= 60 ? "bg-emerald-400" : pct >= 30 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${bg}`} style={{ width: `${w}%` }} />
    </div>
  );
}

const SORT_KEYS = ["grossMarginPct","grossMarginAED","adjStrRev","annualLease","confidence","beds"];

function SortIcon({ col, sortKey, dir }) {
  if (sortKey !== col) return <ChevronsUpDown size={12} className="text-slate-300" />;
  return dir === "asc" ? <ChevronUp size={12} className="text-emerald-600" /> : <ChevronDown size={12} className="text-emerald-600" />;
}

// ── SUMMARY CARDS ─────────────────────────────────────────────────────────────
function SummaryCard({ icon: Icon, label, value, sub, accent }) {
  const map = {
    emerald: { bg: "bg-emerald-50", ic: "text-emerald-600" },
    blue:    { bg: "bg-blue-50",    ic: "text-blue-600"    },
    violet:  { bg: "bg-violet-50",  ic: "text-violet-600"  },
    amber:   { bg: "bg-amber-50",   ic: "text-amber-600"   },
  };
  const a = map[accent];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${a.bg} shrink-0`}>
        <Icon size={16} className={a.ic} />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{value}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ── SLIDER ───────────────────────────────────────────────────────────────────
function SettingSlider({ label, value, min, max, step, unit, onChange, accentClass }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-slate-500 w-36 shrink-0">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-28 accent-emerald-500 h-1.5 cursor-pointer"
      />
      <span className={`text-sm font-bold w-12 tabular-nums ${accentClass}`}>
        {value}{unit}
      </span>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function ArbitrageGrid() {
  const [occupancy, setOccupancy] = useState(85);
  const [mgmtFee, setMgmtFee]     = useState(15);
  const [search, setSearch]       = useState("");
  const [bedFilter, setBedFilter] = useState(0); // 0 = all
  const [sortKey, setSortKey]     = useState("grossMarginPct");
  const [sortDir, setSortDir]     = useState("desc");
  const [sniped, setSniped]       = useState(new Set());

  function handleSort(col) {
    if (sortKey === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(col); setSortDir("desc"); }
  }

  const data = useMemo(() => {
    let rows = RAW_OPPORTUNITIES
      .map(r => calcMetrics(r, occupancy, mgmtFee))
      .filter(r => {
        const q = search.toLowerCase();
        const matchText = !q || r.building.toLowerCase().includes(q) || r.community.toLowerCase().includes(q);
        const matchBeds = bedFilter === 0 || r.beds === bedFilter;
        return matchText && matchBeds;
      })
      .sort((a, b) => {
        const mul = sortDir === "asc" ? 1 : -1;
        return (a[sortKey] - b[sortKey]) * mul;
      });
    return rows;
  }, [occupancy, mgmtFee, search, bedFilter, sortKey, sortDir]);

  const topMargin   = Math.max(...data.map(d => d.grossMarginPct));
  const totalProfit = data.reduce((s, d) => s + Math.max(d.grossMarginAED, 0), 0);
  const highConf    = data.filter(d => d.confidence >= 88).length;
  const avgMargin   = data.length ? data.reduce((s, d) => s + d.grossMarginPct, 0) / data.length : 0;

  const TH = ({ col, label, right }) => (
    <th
      className={`pb-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none group ${right ? "text-right" : "text-left"}`}
      onClick={() => handleSort(col)}
    >
      <span className={`inline-flex items-center gap-1 hover:text-slate-600 transition-colors ${right ? "flex-row-reverse" : ""}`}>
        {label}
        <SortIcon col={col} sortKey={sortKey} dir={sortDir} />
      </span>
    </th>
  );

  return (
    <div className="p-6 space-y-5 min-h-full">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Crosshair size={16} className="text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Arbitrage Sniper</h1>
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
          </div>
          <p className="text-sm text-slate-400 ml-0.5">
            Master-lease opportunities ranked by gross arbitrage margin · {data.length} properties detected
          </p>
        </div>
        <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50">
          <RefreshCw size={12} /> Refresh · 4h ago
        </button>
      </div>

      {/* ── SETTINGS BAR ── */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projection Parameters</span>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <SettingSlider
              label="Assumed Occupancy"
              value={occupancy} min={50} max={100} step={1} unit="%"
              onChange={setOccupancy}
              accentClass="text-emerald-600"
            />
            <div className="w-px h-6 bg-slate-200" />
            <SettingSlider
              label="Management Fees"
              value={mgmtFee} min={0} max={30} step={1} unit="%"
              onChange={setMgmtFee}
              accentClass="text-rose-500"
            />
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
              <Info size={11} className="shrink-0" />
              All figures adjusted in real-time
            </div>
          </div>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard icon={TrendingUp}  label="Top Gross Margin"   value={`${topMargin.toFixed(1)}%`}     sub="Best opportunity" accent="emerald" />
        <SummaryCard icon={BarChart2}   label="Avg. Gross Margin"  value={`${avgMargin.toFixed(1)}%`}     sub="Across all results" accent="blue" />
        <SummaryCard icon={Zap}         label="Total Pool Profit"  value={fmtAED(totalProfit)}             sub="If all leases taken" accent="violet" />
        <SummaryCard icon={BadgeCheck}  label="High Confidence"    value={`${highConf} / ${data.length}`} sub="≥88 confidence score" accent="amber" />
      </div>

      {/* ── FILTERS + SEARCH ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {[0,1,2,3].map(b => (
            <button
              key={b}
              onClick={() => setBedFilter(b)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                bedFilter === b
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {b === 0 ? "All Beds" : <><BedDouble size={11}/>{b} Bed</>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              type="text" placeholder="Filter by building or community…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-600 placeholder-slate-400 outline-none w-52 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 px-5">
              <th className="text-left pb-2.5 pt-3.5 pl-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Property</th>
              <TH col="beds"           label="Beds"       right />
              <TH col="annualLease"    label="Annual Lease" right />
              <TH col="adjStrRev"      label="Proj. STR Rev." right />
              <TH col="grossMarginAED" label="Gross Margin" right />
              <TH col="grossMarginPct" label="Margin %" right />
              <TH col="confidence"     label="Confidence" right />
              <th className="pb-2.5 pt-3.5 pr-5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-sm text-slate-400">
                  No opportunities match the current filters.
                </td>
              </tr>
            )}
            {data.map((row, i) => {
              const conf = confidenceMeta(row.confidence);
              const ConfIcon = conf.icon;
              const isTop = i === 0 && sortKey === "grossMarginPct" && sortDir === "desc";
              const isSniped = sniped.has(row.id);
              return (
                <tr
                  key={row.id}
                  className={`group transition-colors hover:bg-slate-50/80 ${isTop ? "bg-emerald-50/30" : ""}`}
                >
                  {/* Property */}
                  <td className="pl-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {isTop && <Star size={11} className="text-emerald-500 shrink-0 fill-emerald-400" />}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 text-sm">{row.building}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Building2 size={10} className="text-slate-300" />
                          <span className="text-[11px] text-slate-400">{row.community}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Beds */}
                  <td className="pr-4 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <BedDouble size={11} className="text-slate-300" />
                      {row.beds}
                    </span>
                  </td>

                  {/* Annual Lease */}
                  <td className="pr-4 py-3.5 text-right">
                    <span className="text-xs font-mono text-slate-600">{fmtAED(row.annualLease)}</span>
                  </td>

                  {/* Proj STR Rev */}
                  <td className="pr-4 py-3.5 text-right">
                    <span className="text-xs font-mono text-slate-700 font-semibold">{fmtAED(row.adjStrRev)}</span>
                    <div className="text-[10px] text-slate-400 text-right">{row.comps} comps</div>
                  </td>

                  {/* Gross Margin AED */}
                  <td className="pr-4 py-3.5 text-right">
                    <span className={`text-sm font-bold tabular-nums ${marginColor(row.grossMarginPct)}`}>
                      {row.grossMarginAED >= 0 ? "+" : ""}{fmtAED(row.grossMarginAED)}
                    </span>
                  </td>

                  {/* Gross Margin % + bar */}
                  <td className="pr-4 py-3.5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-sm font-bold tabular-nums flex items-center gap-1 ${marginColor(row.grossMarginPct)}`}>
                        <ArrowUpRight size={11} />
                        {row.grossMarginPct.toFixed(1)}%
                      </span>
                      <div className="w-20">
                        <MarginBar pct={row.grossMarginPct} />
                      </div>
                    </div>
                  </td>

                  {/* Confidence */}
                  <td className="pr-4 py-3.5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${conf.bg} ${conf.color}`}>
                        <ConfIcon size={9} />
                        {conf.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{row.confidence}/100</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="pr-5 py-3.5 text-right">
                    <button
                      onClick={() => setSniped(s => { const n = new Set(s); n.has(row.id) ? n.delete(row.id) : n.add(row.id); return n; })}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-150 ${
                        isSniped
                          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:shadow-sm hover:shadow-emerald-200"
                      }`}
                    >
                      <Crosshair size={11} />
                      {isSniped ? "Sniped ✓" : "Snipe"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table footer */}
        <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{data.length}</span> of {RAW_OPPORTUNITIES.length} opportunities
            {sniped.size > 0 && <span className="ml-2 text-emerald-600 font-semibold">· {sniped.size} sniped</span>}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <CircleDot size={10} className="text-emerald-500" />
            STR revenue adjusted for {occupancy}% occupancy &amp; {mgmtFee}% management fees
          </div>
        </div>
      </div>

    </div>
  );
}