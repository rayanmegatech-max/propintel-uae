"use client";

import { useState, useRef } from "react";
import {
  Calculator, Search, Loader2, BedDouble, Bath, Ruler,
  Building2, MapPin, BadgeCheck, AlertTriangle, ChevronRight,
  TrendingUp, TrendingDown, BarChart2, ArrowUpRight, ArrowDownRight,
  Info, Clock, Layers, Home, FileText, Share2, Download,
  CheckCircle2, CircleDot, Minus, Sparkles, RefreshCw
} from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from "recharts";

// ─────────────────────────────────────────────────────────────
// MOCK DATA BANK  –  keyed by query string (lowercased)
// ─────────────────────────────────────────────────────────────
const MOCK_RESULTS = {
  default: {
    property: {
      id: "PROP-00214-MG2",
      building: "Marina Gate II",
      community: "Dubai Marina",
      beds: 1, baths: 1, size: 742,
      floor: 18, furnishing: "Furnished",
      askingPrice: 1_550_000,
      listedDays: 24,
    },
    valuation: {
      estimate: 1_418_000,
      low:      1_303_000,
      high:     1_534_000,
      confidence: 92,
      tdomDecay: -1.2,        // %
      furnishingAdj: +4.8,    // %
    },
    methods: {
      building: { weight: 40, comps: 14, value: 1_405_000, psf: 1894, trend: +3.1  },
      community:{ weight: 25, comps: 31, value: 1_441_000, psf: 1942, trend: +4.6  },
      psf:      { weight: 20, comps: 0,  value: 1_404_000, psf: 1891, trend: null  },
      tdom:     { weight: 10, value: 0,  decay: -1.2 },
      furnish:  { weight: 5,  value: 0,  adj: +4.8   },
    },
    compsScatter: [
      { size: 680, price: 1_310_000, type: "building" },
      { size: 712, price: 1_350_000, type: "building" },
      { size: 742, price: 1_405_000, type: "subject"  },
      { size: 758, price: 1_420_000, type: "building" },
      { size: 790, price: 1_480_000, type: "building" },
      { size: 650, price: 1_270_000, type: "community"},
      { size: 720, price: 1_360_000, type: "community"},
      { size: 800, price: 1_510_000, type: "community"},
      { size: 840, price: 1_570_000, type: "community"},
      { size: 700, price: 1_330_000, type: "community"},
    ],
    recentComps: [
      { building: "Marina Gate II",   beds: 1, size: 712, price: 1_350_000, daysAgo: 11, type: "building" },
      { building: "Marina Gate II",   beds: 1, size: 758, price: 1_420_000, daysAgo: 18, type: "building" },
      { building: "Marina Gate I",    beds: 1, size: 720, price: 1_360_000, daysAgo: 7,  type: "community"},
      { building: "Silverene Tower B",beds: 1, size: 800, price: 1_510_000, daysAgo: 22, type: "community"},
      { building: "JBR - Shams 4",    beds: 1, size: 690, price: 1_290_000, daysAgo: 30, type: "community"},
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmt  = (n) => `AED ${n.toLocaleString()}`;
const fmtK = (n) => n >= 1_000_000 ? `AED ${(n/1_000_000).toFixed(3)}M` : `AED ${(n/1_000).toFixed(0)}K`;

function confMeta(score) {
  if (score >= 88) return { label:"High",   color:"text-emerald-600", bg:"bg-emerald-50",  ring:"ring-emerald-200", icon: BadgeCheck    };
  if (score >= 72) return { label:"Medium", color:"text-amber-600",   bg:"bg-amber-50",    ring:"ring-amber-200",   icon: AlertTriangle };
  return               { label:"Low",    color:"text-rose-500",    bg:"bg-rose-50",     ring:"ring-rose-200",    icon: Minus         };
}

function deltaPill(pct, invert = false) {
  const pos = invert ? pct < 0 : pct > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full
      ${pos ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
      {pos ? <ArrowUpRight size={9}/> : <ArrowDownRight size={9}/>}
      {pct > 0 ? "+" : ""}{pct}%
    </span>
  );
}

const METHOD_META = {
  building:  { label:"Building Comps",   color:"bg-emerald-500", light:"bg-emerald-50", text:"text-emerald-700", icon: Building2  },
  community: { label:"Community Comps",  color:"bg-blue-500",    light:"bg-blue-50",    text:"text-blue-700",    icon: MapPin     },
  psf:       { label:"PSF Method",       color:"bg-violet-500",  light:"bg-violet-50",  text:"text-violet-700",  icon: Ruler      },
  tdom:      { label:"TDOM Decay",       color:"bg-amber-400",   light:"bg-amber-50",   text:"text-amber-700",   icon: Clock      },
  furnish:   { label:"Furnishing Adj.",  color:"bg-teal-400",    light:"bg-teal-50",    text:"text-teal-700",    icon: Home       },
};

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────
function WeightBar({ weight, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${weight}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-500 w-7 text-right">{weight}%</span>
    </div>
  );
}

function MethodCard({ methodKey, data, contribution }) {
  const m = METHOD_META[methodKey];
  const Icon = m.icon;
  const showComps = data.comps > 0;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${m.light}`}>
            <Icon size={13} className={m.text} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">{m.label}</p>
            {showComps
              ? <p className="text-[10px] text-slate-400">{data.comps} comps used</p>
              : <p className="text-[10px] text-slate-400">Market rate basis</p>
            }
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.light} ${m.text}`}>
          {data.weight}% weight
        </span>
      </div>

      {data.value > 0 && (
        <div>
          <p className="text-lg font-bold text-slate-800 tracking-tight">{fmtK(data.value)}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {data.psf && <span className="text-[11px] text-slate-400">AED {data.psf}/sqft</span>}
            {data.trend !== undefined && data.trend !== null && deltaPill(data.trend)}
          </div>
        </div>
      )}

      {methodKey === "tdom"    && <p className="text-sm text-slate-600">Freshness decay <span className="font-semibold text-amber-600">{data.decay}%</span> applied for 24 days on market</p>}
      {methodKey === "furnish" && <p className="text-sm text-slate-600">Furnished premium <span className="font-semibold text-teal-600">+{data.adj}%</span> applied vs unfurnished comps</p>}

      <WeightBar weight={data.weight} color={m.color} />

      <div className="text-[10px] text-slate-400 flex items-center gap-1 border-t border-slate-50 pt-2">
        <span className="font-semibold text-slate-500">Contribution:</span>
        {fmtK(contribution)}
      </div>
    </div>
  );
}

// Custom scatter dot
function ScatterDot(props) {
  const { cx, cy, payload } = props;
  if (payload.type === "subject") {
    return <polygon points={`${cx},${cy-8} ${cx+7},${cy+5} ${cx-7},${cy+5}`} fill="#10b981" stroke="#fff" strokeWidth={1.5} />;
  }
  const color = payload.type === "building" ? "#10b981" : "#3b82f6";
  return <circle cx={cx} cy={cy} r={5} fill={color} fillOpacity={0.7} stroke="#fff" strokeWidth={1.5} />;
}

function CustomScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700">{d.type === "subject" ? "📍 Subject Property" : d.type === "building" ? "Building Comp" : "Community Comp"}</p>
      <p className="text-slate-500">{d.size} sqft · {fmtK(d.price)}</p>
      <p className="text-slate-400">AED {Math.round(d.price / d.size)}/sqft</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ReEstimateView() {
  const [query, setQuery]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const inputRef                = useRef(null);

  function runValuation() {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(MOCK_RESULTS.default);
      setLoading(false);
    }, 1600);
  }

  function handleKey(e) { if (e.key === "Enter") runValuation(); }

  function reset() { setResult(null); setQuery(""); inputRef.current?.focus(); }

  const r = result;
  const conf = r ? confMeta(r.valuation.confidence) : null;
  const ConfIcon = conf?.icon;

  // Weighted contributions
  const contributions = r ? {
    building:  Math.round(r.methods.building.value  * (r.methods.building.weight  / 100)),
    community: Math.round(r.methods.community.value * (r.methods.community.weight / 100)),
    psf:       Math.round(r.methods.psf.value       * (r.methods.psf.weight       / 100)),
    tdom:      Math.round(r.valuation.estimate      * (r.methods.tdom.weight      / 100)),
    furnish:   Math.round(r.valuation.estimate      * (r.methods.furnish.weight   / 100)),
  } : {};

  const delta = r ? ((r.valuation.estimate - r.property.askingPrice) / r.property.askingPrice * 100) : 0;

  return (
    <div className="p-6 space-y-6 min-h-full">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 bg-violet-50 rounded-lg">
              <Calculator size={16} className="text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ReEstimate™</h1>
            <span className="text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Valuation Engine</span>
          </div>
          <p className="text-sm text-slate-400 ml-0.5">
            Weighted-median AVM · Building Comps · Community Comps · PSF · TDOM Decay · Furnishing
          </p>
        </div>
        {r && (
          <div className="flex items-center gap-2">
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors">
              <RefreshCw size={12}/> New Valuation
            </button>
            <button className="flex items-center gap-1.5 text-xs text-white bg-violet-600 hover:bg-violet-700 rounded-lg px-3 py-2 transition-colors">
              <Download size={12}/> Export PDF
            </button>
          </div>
        )}
      </div>

      {/* ── INPUT BAR ── */}
      <div className={`bg-white border rounded-xl p-5 transition-all ${r ? "border-slate-200" : "border-violet-200 shadow-sm shadow-violet-50"}`}>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Property Lookup</p>
        <div className="flex items-center gap-3">
          <div className={`flex-1 flex items-center gap-3 border rounded-xl px-4 py-3 transition-all ${r ? "bg-slate-50 border-slate-200" : "bg-white border-slate-300 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100"}`}>
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading || !!r}
              placeholder="Paste a Bayut / PF / Dubizzle listing URL or Canonical ID (e.g. PROP-00214-MG2)…"
              className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent disabled:cursor-not-allowed"
            />
            {r && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
          </div>
          <button
            onClick={r ? reset : runValuation}
            disabled={loading || (!query.trim() && !r)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all shrink-0
              ${r
                ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                : "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-violet-200"
              }`}
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Generating…</> : r ? "Clear" : <><Sparkles size={14}/> Generate Valuation</>}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1">
          <Info size={10}/> Try: <button onClick={() => { setQuery("PROP-00214-MG2"); }} className="text-violet-500 font-medium hover:underline">PROP-00214-MG2</button> · <button onClick={() => setQuery("bayut.com/property-for-sale/marina-gate")} className="text-violet-500 font-medium hover:underline">bayut.com/property-for-sale/marina-gate</button>
        </p>
      </div>

      {/* ── LOADING STATE ── */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-violet-100 flex items-center justify-center">
              <Calculator size={22} className="text-violet-400" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">Running ReEstimate™ Algorithm</p>
            <p className="text-xs text-slate-400 mt-1">Pulling building comps · Indexing community data · Normalising PSF…</p>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {r && !loading && (
        <div className="space-y-5">

          {/* ── HERO CARD ── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CircleDot size={11} className="text-violet-500" />
                <span className="font-mono font-semibold text-slate-600">{r.property.id}</span>
                <ChevronRight size={12} className="text-slate-300" />
                <span>{r.property.building}</span>
                <ChevronRight size={12} className="text-slate-300" />
                <span>{r.property.community}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock size={10}/> Listed {r.property.listedDays} days ago
              </div>
            </div>

            <div className="p-5 grid grid-cols-3 gap-6">
              {/* Left: property specs */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Property Details</p>
                <div>
                  <p className="text-lg font-bold text-slate-800">{r.property.building}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-sm text-slate-500">
                    <MapPin size={12} className="text-slate-300"/>{r.property.community}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: BedDouble, label: "Beds",      val: r.property.beds },
                    { icon: Bath,      label: "Baths",     val: r.property.baths },
                    { icon: Ruler,     label: "Size",      val: `${r.property.size} sqft` },
                    { icon: Layers,    label: "Floor",     val: `Floor ${r.property.floor}` },
                    { icon: Home,      label: "Furnishing",val: r.property.furnishing, wide: true },
                  ].map(({ icon: Icon, label, val, wide }) => (
                    <div key={label} className={`bg-slate-50 rounded-lg px-3 py-2 ${wide ? "col-span-2" : ""}`}>
                      <div className="flex items-center gap-1.5">
                        <Icon size={11} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Asking Price</p>
                    <p className="text-sm font-bold text-slate-700">{fmtK(r.property.askingPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">vs. Estimate</p>
                    {deltaPill(parseFloat(delta.toFixed(1)), true)}
                  </div>
                </div>
              </div>

              {/* Center: the big number */}
              <div className="flex flex-col items-center justify-center text-center border-x border-slate-100 px-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ReEstimate™ Value</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                    {fmtK(r.valuation.estimate)}
                  </p>
                  <p className="text-xs text-slate-400">
                    AED {Math.round(r.valuation.estimate / r.property.size).toLocaleString()} per sqft
                  </p>
                </div>

                {/* Confidence band */}
                <div className="w-full space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Low  {fmtK(r.valuation.low)}</span>
                    <span>{fmtK(r.valuation.high)}  High</span>
                  </div>
                  <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                    {/* band */}
                    <div
                      className="absolute h-full bg-violet-100 rounded-full"
                      style={{
                        left:  `${((r.valuation.low  - r.valuation.low * 0.97) / (r.valuation.high * 1.03 - r.valuation.low * 0.97)) * 100}%`,
                        right: `${100 - ((r.valuation.high - r.valuation.low * 0.97) / (r.valuation.high * 1.03 - r.valuation.low * 0.97)) * 100}%`,
                      }}
                    />
                    {/* estimate pin */}
                    <div
                      className="absolute top-0.5 bottom-0.5 w-1.5 bg-violet-600 rounded-full"
                      style={{ left: "50%", transform: "translateX(-50%)" }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    ± Band: {fmtK(r.valuation.high - r.valuation.low)} range
                  </p>
                </div>

                {/* Confidence badge */}
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ring-2 ${conf.bg} ${conf.ring}`}>
                  <ConfIcon size={15} className={conf.color} />
                  <div className="text-left">
                    <p className={`text-base font-black ${conf.color}`}>{r.valuation.confidence}%</p>
                    <p className={`text-[10px] font-semibold ${conf.color} opacity-80`}>{conf.label} Confidence</p>
                  </div>
                </div>
              </div>

              {/* Right: comps scatter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Comp Distribution</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/>Building</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"/>Community</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="size" type="number" name="Size" unit=" sqft" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={["dataMin - 40", "dataMax + 40"]} />
                    <YAxis dataKey="price" type="number" name="Price" tickFormatter={v => `${(v/1e6).toFixed(1)}M`} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomScatterTooltip />} />
                    <ReferenceLine y={r.valuation.estimate} stroke="#7c3aed" strokeDasharray="4 3" strokeWidth={1.5} />
                    <Scatter data={r.compsScatter} shape={<ScatterDot />} />
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <span className="w-2 border-t border-dashed border-violet-400 inline-block"/>
                  Dashed line = ReEstimate™ value
                </p>
              </div>
            </div>
          </div>

          {/* ── METHOD BREAKDOWN ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={14} className="text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Algorithm Breakdown</p>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">5 signals · 100% weight</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {["building","community","psf","tdom","furnish"].map(k => (
                <MethodCard key={k} methodKey={k} data={r.methods[k]} contribution={contributions[k]} />
              ))}
            </div>
          </div>

          {/* ── COMPARABLE TRANSACTIONS ── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">Recent Comparable Listings</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                View all comps <ChevronRight size={12}/>
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-2.5 font-semibold">Building</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Beds</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Size</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Price</th>
                  <th className="text-right px-4 py-2.5 font-semibold">AED/sqft</th>
                  <th className="text-right px-5 py-2.5 font-semibold">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {r.recentComps.map((c, i) => {
                  const isBuilding = c.type === "building";
                  return (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isBuilding ? "bg-emerald-400" : "bg-blue-400"}`}/>
                          <span className="font-medium text-slate-700 text-sm">{c.building}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isBuilding ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                            {isBuilding ? "Building" : "Community"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-500">{c.beds} bed</td>
                      <td className="px-4 py-3 text-right text-xs font-mono text-slate-500">{c.size} sqft</td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-slate-800">{fmtK(c.price)}</td>
                      <td className="px-4 py-3 text-right text-xs font-mono text-slate-500">
                        {Math.round(c.price / c.size).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-slate-400">{c.daysAgo}d ago</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!r && !loading && (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Calculator size={24} className="text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">No valuation generated yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Paste a listing URL from Bayut, Property Finder, or Dubizzle — or enter a Canonical ID — above to run the ReEstimate™ algorithm.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            {["Building Comps · 40%","Community Comps · 25%","PSF Method · 20%","TDOM Decay · 10%","Furnishing · 5%"].map(l => (
              <span key={l} className="flex items-center gap-1"><CircleDot size={9} className="text-violet-300"/>{l}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}