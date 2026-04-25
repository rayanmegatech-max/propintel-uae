"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, ChevronDown, AlertTriangle, BarChart2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommunityShare {
  community: string;
  pct: number; // 0-100
  count: number;
}

interface AgencyData {
  id: string;
  name: string;
  totalActive: number;
  avgAskingPrice: string;
  medianPsf: string;
  newListings7d: number;
  delisted7d: number;
  priceDrops7d: number;
  avgDom: number;
  primaryCommunity: string;
  luxuryShare: string;
  premiumAdSpend: number;
  communities: CommunityShare[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const AGENCIES: AgencyData[] = [
  {
    id: "al-nour",
    name: "Al Nour Real Estate",
    totalActive: 214,
    avgAskingPrice: "AED 1,840,000",
    medianPsf: "AED 1,420",
    newListings7d: 31,
    delisted7d: 9,
    priceDrops7d: 14,
    avgDom: 38,
    primaryCommunity: "Dubai Marina",
    luxuryShare: "18%",
    premiumAdSpend: 47,
    communities: [
      { community: "Dubai Marina",     pct: 34, count: 73 },
      { community: "JVC",              pct: 24, count: 51 },
      { community: "Downtown Dubai",   pct: 18, count: 39 },
      { community: "JLT",              pct: 14, count: 30 },
      { community: "Business Bay",     pct: 10, count: 21 },
    ],
  },
  {
    id: "prestige",
    name: "Prestige Realty Group",
    totalActive: 158,
    avgAskingPrice: "AED 4,210,000",
    medianPsf: "AED 2,870",
    newListings7d: 19,
    delisted7d: 5,
    priceDrops7d: 8,
    avgDom: 61,
    primaryCommunity: "Palm Jumeirah",
    luxuryShare: "64%",
    premiumAdSpend: 91,
    communities: [
      { community: "Palm Jumeirah",    pct: 42, count: 66 },
      { community: "Downtown Dubai",   pct: 27, count: 43 },
      { community: "DIFC",             pct: 16, count: 25 },
      { community: "Dubai Hills",      pct: 10, count: 16 },
      { community: "Emirates Hills",   pct: 5,  count: 8  },
    ],
  },
  {
    id: "goldkey",
    name: "GoldKey Properties",
    totalActive: 97,
    avgAskingPrice: "AED 2,560,000",
    medianPsf: "AED 1,980",
    newListings7d: 14,
    delisted7d: 3,
    priceDrops7d: 6,
    avgDom: 44,
    primaryCommunity: "Arabian Ranches",
    luxuryShare: "31%",
    premiumAdSpend: 28,
    communities: [
      { community: "Arabian Ranches",  pct: 38, count: 37 },
      { community: "Damac Hills",      pct: 29, count: 28 },
      { community: "Dubai Hills",      pct: 19, count: 18 },
      { community: "Jumeirah",         pct: 9,  count: 9  },
      { community: "Al Barsha",        pct: 5,  count: 5  },
    ],
  },
];

const AGENCY_NAMES = AGENCIES.map((a) => a.name);

// ─── Comparison rows config ───────────────────────────────────────────────────

type RowWinner = "lower" | "higher" | "none";

interface CompRow {
  label: string;
  key: keyof AgencyData;
  winner: RowWinner; // which direction is "better"
  format?: (v: AgencyData[keyof AgencyData]) => string;
}

const COMP_ROWS: CompRow[] = [
  { label: "Total Active Listings",    key: "totalActive",      winner: "higher" },
  { label: "Avg Asking Price",         key: "avgAskingPrice",   winner: "none"   },
  { label: "Median Price / sqft",      key: "medianPsf",        winner: "none"   },
  { label: "New Listings (7 days)",    key: "newListings7d",    winner: "higher" },
  { label: "Delisted (7 days)",        key: "delisted7d",       winner: "lower"  },
  { label: "Price Drops (7 days)",     key: "priceDrops7d",     winner: "lower"  },
  { label: "Avg Days on Market",       key: "avgDom",           winner: "lower",
    format: (v) => `${v} days` },
  { label: "Primary Community",        key: "primaryCommunity", winner: "none"   },
  { label: "Luxury Share (>AED 3M)",   key: "luxuryShare",      winner: "none"   },
  { label: "Premium Ad Spend (count)", key: "premiumAdSpend",   winner: "none"   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAgency(name: string): AgencyData | undefined {
  return AGENCIES.find((a) => a.name === name);
}

function cellClass(
  row: CompRow,
  val1: AgencyData[keyof AgencyData],
  val2: AgencyData[keyof AgencyData],
  isA1: boolean
): string {
  if (row.winner === "none") return "text-white";
  const n1 = parseFloat(String(val1).replace(/[^0-9.]/g, ""));
  const n2 = parseFloat(String(val2).replace(/[^0-9.]/g, ""));
  if (isNaN(n1) || isNaN(n2) || n1 === n2) return "text-white";

  const thisVal = isA1 ? n1 : n2;
  const otherVal = isA1 ? n2 : n1;
  const isBetter =
    row.winner === "higher" ? thisVal > otherVal : thisVal < otherVal;

  return isBetter ? "text-emerald-400 font-semibold" : "text-slate-400";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgencySelect({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  exclude: string;
}) {
  return (
    <div className="flex-1">
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
        >
          <option value="">— Select agency —</option>
          {AGENCY_NAMES.filter((n) => n !== exclude).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  );
}

function CommunityHeatmap({ agency }: { agency: AgencyData }) {
  const peak = Math.max(...agency.communities.map((c) => c.pct));

  return (
    <div className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <BarChart2 className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-white truncate">{agency.name}</h3>
      </div>
      <div className="space-y-3">
        {agency.communities.map((c, idx) => (
          <div key={c.community}>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-300">{c.community}</span>
              <span className="text-slate-500">{c.count} listings · {c.pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(c.pct / peak) * 100}%` }}
                transition={{ delay: 0.08 * idx + 0.3, duration: 0.55, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WarRoomPage() {
  const [agencyA, setAgencyA] = useState("");
  const [agencyB, setAgencyB] = useState("");
  const [compared, setCompared] = useState<{ a: AgencyData; b: AgencyData } | null>(null);

  const canCompare = agencyA !== "" && agencyB !== "" && agencyA !== agencyB;

  function handleCompare() {
    const a = getAgency(agencyA);
    const b = getAgency(agencyB);
    if (a && b) setCompared({ a, b });
  }

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
          <Swords className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">War Room</h1>
          <p className="text-sm text-slate-400">
            Side-by-side agency comparison. Track competitor inventory, pricing, and territory moves.
          </p>
        </div>
      </div>

      {/* ── Compare bar ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Compare Agencies</h2>
        <div className="flex flex-col items-end gap-3 sm:flex-row">
          <AgencySelect
            label="Agency 1"
            value={agencyA}
            onChange={(v) => { setAgencyA(v); setCompared(null); }}
            exclude={agencyB}
          />

          {/* VS divider */}
          <div className="flex h-[42px] items-center">
            <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              vs
            </span>
          </div>

          <AgencySelect
            label="Agency 2"
            value={agencyB}
            onChange={(v) => { setAgencyB(v); setCompared(null); }}
            exclude={agencyA}
          />

          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:shadow-red-500/40 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:shrink-0"
          >
            <Swords className="h-4 w-4" />
            Compare
          </button>
        </div>

        {agencyA === agencyB && agencyA !== "" && (
          <p className="mt-2 text-[11px] text-amber-400">Select two different agencies to compare.</p>
        )}
      </div>

      {/* ── Results ── */}
      <AnimatePresence>
        {compared && (
          <motion.div
            key={`${compared.a.id}-${compared.b.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >

            {/* ── a) Comparison table ── */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
              {/* Table header */}
              <div className="border-b border-white/[0.06] px-6 py-4">
                <h2 className="text-sm font-semibold text-white">Head-to-Head Metrics</h2>
              </div>

              {/* Horizontal scroll on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 w-[40%]">
                        Metric
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">
                          {compared.a.name}
                        </span>
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                          {compared.b.name}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {COMP_ROWS.map((row) => {
                      const v1 = compared.a[row.key];
                      const v2 = compared.b[row.key];
                      const display = row.format
                        ? (v: AgencyData[keyof AgencyData]) => row.format!(v)
                        : (v: AgencyData[keyof AgencyData]) => String(v);

                      return (
                        <tr key={row.key} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-5 py-3.5 text-[13px] text-slate-400">
                            {row.label}
                          </td>
                          <td className={`px-5 py-3.5 text-[13px] ${cellClass(row, v1, v2, true)}`}>
                            {display(v1)}
                          </td>
                          <td className={`px-5 py-3.5 text-[13px] ${cellClass(row, v1, v2, false)}`}>
                            {display(v2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 border-t border-white/[0.06] px-6 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Legend:</span>
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Better value
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-slate-600" />
                  Weaker / neutral
                </span>
                <span className="ml-auto text-[11px] text-slate-600">
                  Directional only — no winner declared for price metrics
                </span>
              </div>
            </div>

            {/* ── b) Community heatmaps ── */}
            <div>
              <h2 className="mb-3 text-sm font-semibold text-white">Community Presence</h2>
              <div className="flex flex-col gap-4 sm:flex-row">
                <CommunityHeatmap agency={compared.a} />
                <CommunityHeatmap agency={compared.b} />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state when nothing selected ── */}
      {!compared && (
        <div className="rounded-2xl border border-dashed border-white/[0.08] py-16 text-center">
          <Swords className="mx-auto h-8 w-8 text-slate-700" />
          <p className="mt-3 text-sm text-slate-500">
            Select two agencies above and click Compare to begin.
          </p>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
        <p className="text-[11px] leading-relaxed text-slate-500">
          Data from cross-portal listing snapshots. No private CRM data accessed.
        </p>
      </div>

    </div>
  );
}