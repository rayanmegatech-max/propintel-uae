"use client";

import { useState } from "react";
import {
  Ghost, RefreshCw, Clock, Image, ShieldOff, GitCompare,
  TrendingDown, CheckCircle2, Circle, Building2, MapPin,
  Search, ChevronRight, AlertTriangle, User, Layers,
  ArrowUpRight, SlidersHorizontal, XCircle, BadgeAlert
} from "lucide-react";

// ─── SIGNAL DEFINITIONS ───────────────────────────────────────────────────────
const SIGNAL_META = {
  churnVelocity:           { name: "Churn Velocity",              icon: RefreshCw,   weight: 20 },
  reactivationCycling:     { name: "Reactivation Cycling",        icon: Clock,       weight: 20 },
  priceAnomaly:            { name: "Price Anomaly",               icon: TrendingDown, weight: 20 },
  photoPoverty:            { name: "Photo Poverty",               icon: Image,       weight: 15 },
  verificationAbsence:     { name: "Verification Absence",        icon: ShieldOff,   weight: 15 },
  crossPortalInconsistency:{ name: "Cross-Portal Inconsistency",  icon: GitCompare,  weight: 10 },
};

// ─── LISTING DATA ─────────────────────────────────────────────────────────────
const LISTINGS = [
  {
    id: 1, agentName: "Hassan M.", agencyName: "Al Nour Real Estate",
    building: "Oceana Residence", community: "Palm Jumeirah", beds: 2,
    askingPrice: 1_850_000, score: 94,
    signals: [
      { key: "churnVelocity",            fired: true,  sev: "high",   evidence: "Relisted 8× in the past 60 days"                            },
      { key: "reactivationCycling",      fired: true,  sev: "high",   evidence: "Delisted and reactivated 4× over 90 days"                   },
      { key: "priceAnomaly",             fired: true,  sev: "high",   evidence: "–32% below ReEstimate™ value of AED 2.71M"                  },
      { key: "photoPoverty",             fired: true,  sev: "medium", evidence: "Only 2 photos — identical to 3 other agent listings"        },
      { key: "verificationAbsence",      fired: true,  sev: "medium", evidence: "No DLD badge. Not portal-verified on any channel."          },
      { key: "crossPortalInconsistency", fired: true,  sev: "high",   evidence: "AED 1.85M on Bayut · AED 2.1M on PF · Absent on Dubizzle"  },
    ],
  },
  {
    id: 2, agentName: "Sara K.", agencyName: "Prestige Realty Group",
    building: "Elite Residence", community: "Business Bay", beds: 1,
    askingPrice: 920_000, score: 88,
    signals: [
      { key: "churnVelocity",            fired: true,  sev: "high",   evidence: "Relisted 6× in the past 45 days"                           },
      { key: "reactivationCycling",      fired: true,  sev: "high",   evidence: "Delisted and reactivated 3× over 60 days"                  },
      { key: "priceAnomaly",             fired: true,  sev: "high",   evidence: "–28% below ReEstimate™ value of AED 1.27M"                 },
      { key: "photoPoverty",             fired: false, sev: null,     evidence: null                                                         },
      { key: "verificationAbsence",      fired: true,  sev: "medium", evidence: "No DLD ORN. Unverified on Property Finder."                },
      { key: "crossPortalInconsistency", fired: true,  sev: "medium", evidence: "AED 920K on Dubizzle · AED 1.05M on Bayut"                 },
    ],
  },
  {
    id: 3, agentName: "Rami F.", agencyName: "GoldKey Properties",
    building: "Murjan 2", community: "Jumeirah Beach Res.", beds: 3,
    askingPrice: 2_100_000, score: 81,
    signals: [
      { key: "churnVelocity",            fired: true,  sev: "high",   evidence: "Relisted 5× in the past 30 days"                           },
      { key: "reactivationCycling",      fired: true,  sev: "medium", evidence: "Delisted and reactivated 2× — pattern consistent with ghost listing"},
      { key: "priceAnomaly",             fired: true,  sev: "high",   evidence: "–24% below ReEstimate™ value of AED 2.76M"                 },
      { key: "photoPoverty",             fired: true,  sev: "medium", evidence: "3 photos — same watermark as 5 other agent listings"       },
      { key: "verificationAbsence",      fired: false, sev: null,     evidence: null                                                         },
      { key: "crossPortalInconsistency", fired: true,  sev: "medium", evidence: "Price changed AED 200K between portals within same week"   },
    ],
  },
  {
    id: 4, agentName: "Layla N.", agencyName: "Al Nour Real Estate",
    building: "Index Tower", community: "DIFC", beds: 1,
    askingPrice: 1_050_000, score: 76,
    signals: [
      { key: "churnVelocity",            fired: true,  sev: "medium", evidence: "Relisted 4× in the past 60 days"                           },
      { key: "reactivationCycling",      fired: false, sev: null,     evidence: null                                                         },
      { key: "priceAnomaly",             fired: true,  sev: "high",   evidence: "–21% below ReEstimate™ value of AED 1.33M"                 },
      { key: "photoPoverty",             fired: true,  sev: "high",   evidence: "1 stock photo only — building exterior, no interior shots" },
      { key: "verificationAbsence",      fired: true,  sev: "medium", evidence: "No DLD ORN attached to listing."                          },
      { key: "crossPortalInconsistency", fired: true,  sev: "low",    evidence: "Listed on Bayut only — not present on PF or Dubizzle"      },
    ],
  },
  {
    id: 5, agentName: "Tariq B.", agencyName: "NextMove UAE",
    building: "Silverene Tower A", community: "Dubai Marina", beds: 2,
    askingPrice: 1_420_000, score: 69,
    signals: [
      { key: "churnVelocity",            fired: true,  sev: "medium", evidence: "Relisted 3× in the past 45 days"                           },
      { key: "reactivationCycling",      fired: true,  sev: "medium", evidence: "Delisted and reactivated 2× — possibly testing price"     },
      { key: "priceAnomaly",             fired: true,  sev: "medium", evidence: "–16% below ReEstimate™ value of AED 1.69M"                },
      { key: "photoPoverty",             fired: false, sev: null,     evidence: null                                                         },
      { key: "verificationAbsence",      fired: false, sev: null,     evidence: null                                                         },
      { key: "crossPortalInconsistency", fired: true,  sev: "low",    evidence: "Minor price variance of AED 30K across portals"           },
    ],
  },
  {
    id: 6, agentName: "Amira S.", agencyName: "Prestige Realty Group",
    building: "Botanica Tower", community: "Jumeirah Village Cir.", beds: 1,
    askingPrice: 610_000, score: 62,
    signals: [
      { key: "churnVelocity",            fired: false, sev: null,     evidence: null                                                         },
      { key: "reactivationCycling",      fired: true,  sev: "medium", evidence: "Relisted twice after short deactivation periods"           },
      { key: "priceAnomaly",             fired: true,  sev: "medium", evidence: "–14% below ReEstimate™ value of AED 710K"                 },
      { key: "photoPoverty",             fired: true,  sev: "high",   evidence: "2 photos, both watermarked with a different agency logo"  },
      { key: "verificationAbsence",      fired: true,  sev: "medium", evidence: "Not verified. No RERA permit number found."               },
      { key: "crossPortalInconsistency", fired: false, sev: null,     evidence: null                                                         },
    ],
  },
  {
    id: 7, agentName: "Omar H.", agencyName: "GoldKey Properties",
    building: "Sky Gardens", community: "DIFC", beds: 2,
    askingPrice: 1_750_000, score: 58,
    signals: [
      { key: "churnVelocity",            fired: true,  sev: "medium", evidence: "Relisted 3× in 90 days"                                   },
      { key: "reactivationCycling",      fired: false, sev: null,     evidence: null                                                         },
      { key: "priceAnomaly",             fired: true,  sev: "medium", evidence: "–12% below ReEstimate™ value of AED 1.99M"                },
      { key: "photoPoverty",             fired: false, sev: null,     evidence: null                                                         },
      { key: "verificationAbsence",      fired: true,  sev: "low",    evidence: "DLD flag present on Bayut but absent on Dubizzle version" },
      { key: "crossPortalInconsistency", fired: false, sev: null,     evidence: null                                                         },
    ],
  },
  {
    id: 8, agentName: "Nadia R.", agencyName: "NextMove UAE",
    building: "Rimal 3", community: "Jumeirah Beach Res.", beds: 3,
    askingPrice: 2_800_000, score: 51,
    signals: [
      { key: "churnVelocity",            fired: false, sev: null,     evidence: null                                                        },
      { key: "reactivationCycling",      fired: true,  sev: "low",    evidence: "Relisted once after 14-day deactivation"                  },
      { key: "priceAnomaly",             fired: true,  sev: "medium", evidence: "–11% below ReEstimate™ value of AED 3.15M"               },
      { key: "photoPoverty",             fired: true,  sev: "medium", evidence: "4 photos — partial overlap with another listing by same agent"},
      { key: "verificationAbsence",      fired: false, sev: null,     evidence: null                                                        },
      { key: "crossPortalInconsistency", fired: false, sev: null,     evidence: null                                                        },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function scoreTier(s) {
  if (s >= 80) return { label: "Flagged",  bg: "bg-rose-50",   text: "text-rose-700",   ring: "ring-rose-200",   arc: "#f43f5e", track: "#fecdd3" };
  if (s >= 50) return { label: "Watch",    bg: "bg-amber-50",  text: "text-amber-700",  ring: "ring-amber-200",  arc: "#f59e0b", track: "#fde68a" };
  return             { label: "Clean",    bg: "bg-emerald-50",text: "text-emerald-700",ring: "ring-emerald-200",arc: "#10b981", track: "#a7f3d0" };
}

function sevColor(sev) {
  if (sev === "high")   return "bg-rose-50 text-rose-600 border-rose-100";
  if (sev === "medium") return "bg-amber-50 text-amber-600 border-amber-100";
  return                       "bg-slate-50 text-slate-500 border-slate-100";
}

function fmtPrice(n) { return `AED ${(n/1_000_000).toFixed(2)}M`; }

// ─── SCORE RING SVG ───────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const t  = scoreTier(score);
  const R  = 44, cx = 52, cy = 52, sw = 8;
  const C  = 2 * Math.PI * R;
  const fill = C - (score / 100) * C;
  return (
    <svg width={104} height={104} viewBox="0 0 104 104">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={t.track} strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={t.arc} strokeWidth={sw}
        strokeDasharray={C} strokeDashoffset={fill}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 4}  textAnchor="middle" fontSize={22} fontWeight={800} fill={t.arc}>{score}</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize={10} fontWeight={600} fill="#94a3b8">/100</text>
    </svg>
  );
}

// ─── SUMMARY METRIC CARD ──────────────────────────────────────────────────────
function MetricCard({ label, value, sub, iconClass, bgClass, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-5">
      <div className={`p-3 rounded-xl ${bgClass} shrink-0`}>
        <Icon size={20} className={iconClass} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-800 tracking-tight leading-none">{value}</p>
        <p className="text-sm text-slate-400 mt-2">{sub}</p>
      </div>
    </div>
  );
}

// ─── EMPTY EVIDENCE STATE ─────────────────────────────────────────────────────
function EmptyEvidence() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-10">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
        <Ghost size={28} className="text-slate-300" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-600">No listing selected</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Select a suspect from the list to view the full evidence breakdown and signal analysis.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GhostScoreView() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [tierFilter, setTier]   = useState("All");

  const totalSuspicious  = LISTINGS.filter(l => l.score >= 50).length;
  const pollutionPct     = ((LISTINGS.filter(l => l.score >= 50).length / LISTINGS.length) * 100).toFixed(0);
  const topAgency        = "Al Nour Real Estate";

  const filtered = LISTINGS.filter(l => {
    const q = search.toLowerCase();
    const matchText = !q || l.agentName.toLowerCase().includes(q) || l.building.toLowerCase().includes(q) || l.community.toLowerCase().includes(q);
    const matchTier = tierFilter === "All"
      || (tierFilter === "Flagged" && l.score >= 80)
      || (tierFilter === "Watch"   && l.score >= 50 && l.score < 80);
    return matchText && matchTier;
  });

  const active = selected ? LISTINGS.find(l => l.id === selected) : null;
  const firedCount = active ? active.signals.filter(s => s.fired).length : 0;

  return (
    <div className="p-6 space-y-6 min-h-full">

      {/* ── PAGE HEADER ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-1.5 bg-rose-50 rounded-lg">
            <Ghost size={16} className="text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Ghost Listing Radar</h1>
          <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Fraud Score</span>
        </div>
        <p className="text-sm text-slate-400 mt-0.5">
          6-signal composite scoring engine · Churn, Reactivation, Price Anomaly, Photo Poverty, Verification, Cross-Portal
        </p>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-3 gap-5">
        <MetricCard
          icon={AlertTriangle} label="Suspicious Listings" value={totalSuspicious}
          sub="Score ≥ 50 · Active in past 30 days"
          iconClass="text-rose-600" bgClass="bg-rose-50"
        />
        <MetricCard
          icon={BadgeAlert} label="Est. Market Pollution" value={`${pollutionPct}%`}
          sub="Of all active listings flagged as suspect"
          iconClass="text-amber-600" bgClass="bg-amber-50"
        />
        <MetricCard
          icon={Building2} label="Top Offending Agency" value={topAgency}
          sub="2 listings in Flagged tier · Score avg 85"
          iconClass="text-violet-600" bgClass="bg-violet-50"
        />
      </div>

      {/* ── SPLIT VIEW ── */}
      <div className="grid grid-cols-5 gap-5" style={{ height: 580 }}>

        {/* ── LEFT: SUSPECTS LIST ── */}
        <div className="col-span-2 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">

          {/* List header + filters */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Suspect Listings</p>
              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">{filtered.length} shown</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Search size={13} className="text-slate-400 shrink-0" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search agent or building…"
                className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {["All", "Flagged", "Watch"].map(t => (
                <button key={t} onClick={() => setTier(t)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    tierFilter === t
                      ? t === "Flagged" ? "bg-rose-600 text-white" : t === "Watch" ? "bg-amber-500 text-white" : "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.map(listing => {
              const t = scoreTier(listing.score);
              const isActive = selected === listing.id;
              return (
                <button
                  key={listing.id}
                  onClick={() => setSelected(isActive ? null : listing.id)}
                  className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-all group
                    ${isActive ? "bg-rose-50/60 border-l-2 border-rose-400" : "hover:bg-slate-50/80 border-l-2 border-transparent"}`}
                >
                  {/* Score badge */}
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ring-1 ${t.bg} ${t.ring}`}>
                    <span className={`text-xl font-black leading-none ${t.text}`}>{listing.score}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wide mt-0.5 ${t.text} opacity-70`}>{t.label}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-800 text-sm truncate">{listing.agentName}</p>
                      <ChevronRight size={13} className={`shrink-0 transition-transform ${isActive ? "rotate-90 text-rose-400" : "text-slate-300"}`}/>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{listing.agencyName}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Building2 size={10} className="text-slate-300"/>
                      <span className="text-[11px] text-slate-500 truncate">{listing.building} · {listing.community}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-slate-400">{listing.beds} bed · {fmtPrice(listing.askingPrice)}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${listing.signals.filter(s=>s.fired).length >= 5 ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-600"}`}>
                        {listing.signals.filter(s => s.fired).length}/6 signals
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: EVIDENCE PANEL ── */}
        <div className="col-span-3 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
          {!active ? <EmptyEvidence /> : (
            <>
              {/* Evidence header */}
              <div className="px-7 pt-6 pb-5 border-b border-slate-100">
                <div className="flex items-start gap-5">
                  <ScoreRing score={active.score} />
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ring-1 ${scoreTier(active.score).bg} ${scoreTier(active.score).text} ${scoreTier(active.score).ring}`}>
                        {scoreTier(active.score).label}
                      </span>
                      <span className="text-xs text-slate-400">{firedCount} of 6 signals triggered</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800 leading-tight">{active.building}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={11} className="text-slate-300"/>
                      <span className="text-sm text-slate-500">{active.community}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><User size={11} className="text-slate-300"/>{active.agentName}</span>
                      <span className="flex items-center gap-1.5"><Building2 size={11} className="text-slate-300"/>{active.agencyName}</span>
                      <span className="flex items-center gap-1.5"><Layers size={11} className="text-slate-300"/>{active.beds} bed · {fmtPrice(active.askingPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signal checklist */}
              <div className="flex-1 overflow-y-auto px-7 py-5 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Signal Breakdown</p>
                {active.signals.map(sig => {
                  const meta = SIGNAL_META[sig.key];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={sig.key}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        sig.fired
                          ? "bg-white border-slate-200"
                          : "bg-slate-50/60 border-slate-100 opacity-50"
                      }`}
                    >
                      {/* Status icon */}
                      <div className={`mt-0.5 shrink-0 ${sig.fired ? "text-rose-500" : "text-slate-300"}`}>
                        {sig.fired
                          ? <XCircle size={18} />
                          : <CheckCircle2 size={18} className="text-slate-300"/>
                        }
                      </div>

                      {/* Signal info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Icon size={13} className={sig.fired ? "text-slate-500" : "text-slate-300"} />
                            <span className={`text-sm font-semibold ${sig.fired ? "text-slate-800" : "text-slate-400"}`}>
                              {meta.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {sig.fired && sig.sev && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${sevColor(sig.sev)}`}>
                                {sig.sev}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-medium">{meta.weight}% weight</span>
                          </div>
                        </div>
                        {sig.fired && sig.evidence && (
                          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                            {sig.evidence}
                          </p>
                        )}
                        {!sig.fired && (
                          <p className="text-xs text-slate-400 mt-1">Not triggered — signal within normal parameters.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer action */}
              <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
                <p className="text-xs text-slate-400">
                  Last scanned <span className="font-semibold text-slate-600">2 hours ago</span> · SCD-2 archive
                </p>
                <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                  <Ghost size={12}/> Flag for Review
                </button>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}