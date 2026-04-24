"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Search, ChevronDown, Loader2, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
  id: number;
  address: string;
  community: string;
  claimedAge: string;
  trueAge: number;
  ris: number;
  relists: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_LISTINGS: Listing[] = [
  { id: 1, address: "Burj Khalifa, Tower B, 88F",  community: "Downtown Dubai", claimedAge: "2 days", trueAge: 94,  ris: 47.0, relists: 5 },
  { id: 2, address: "Marina Gate 2, 22F",           community: "Dubai Marina",   claimedAge: "5 days", trueAge: 38,  ris: 7.6,  relists: 2 },
  { id: 3, address: "Bloom Towers, 12F",            community: "JVC",            claimedAge: "1 day",  trueAge: 61,  ris: 61.0, relists: 4 },
  { id: 4, address: "Address Sky View, 45F",        community: "Downtown Dubai", claimedAge: "7 days", trueAge: 12,  ris: 1.7,  relists: 0 },
  { id: 5, address: "The Palm Tower, 18F",          community: "Palm Jumeirah",  claimedAge: "3 days", trueAge: 215, ris: 71.7, relists: 8 },
];

const BEDROOM_OPTIONS = ["Any", "Studio", "1", "2", "3", "4", "5+"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function risStyle(ris: number) {
  if (ris < 7)   return { chip: "text-emerald-400 bg-emerald-500/10", dot: "bg-emerald-400" };
  if (ris <= 30) return { chip: "text-amber-400 bg-amber-500/10",     dot: "bg-amber-400"   };
  return               { chip: "text-red-400 bg-red-500/10",          dot: "bg-red-400"     };
}

function StatusBadge({ relists }: { relists: number }) {
  if (relists === 0) {
    return (
      <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
        Active
      </span>
    );
  }
  const isDanger = relists >= 4;
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
        isDanger
          ? "border-red-500/30 bg-red-500/10 text-red-400"
          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
      }`}
    >
      Re-listed ×{relists}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrueListingAgePage() {
  const [community, setCommunity] = useState("");
  const [bedrooms, setBedrooms]   = useState("Any");
  const [loading, setLoading]     = useState(false);
  const [showResults, setShowResults] = useState(false);

  const canSearch = community.trim().length > 0;

  const handleSearch = () => {
    if (!canSearch) return;
    setShowResults(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 950);
  };

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15">
          <Clock className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">True Listing Age</h1>
          <p className="text-sm text-slate-400">
            Expose hidden days‑on‑market behind relisted and refreshed properties.
          </p>
        </div>
      </div>

      {/* ── Search card ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">Search Properties</h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

          {/* Community input */}
          <div className="flex-1">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Community / Building
            </label>
            <input
              type="text"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Downtown Dubai, JVC, Palm Jumeirah…"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>

          {/* Bedrooms dropdown */}
          <div className="sm:w-36">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Bedrooms
            </label>
            <div className="relative">
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              >
                {BEDROOM_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b === "Any" ? "Any" : b === "Studio" ? "Studio" : `${b} BR`}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={!canSearch || loading}
            className="flex h-[42px] min-w-[120px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search
              </>
            )}
          </button>
        </div>

        {/* Hint when field is empty */}
        {!canSearch && !loading && (
          <p className="mt-3 text-[11px] text-slate-600">
            Enter a community or building name to begin.
          </p>
        )}
      </div>

      {/* ── Results ── */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >

            {/* ── a) Summary stats ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label:  "Avg. True DOM",
                  value:  "127 days",
                  sub:    "cross-portal verified",
                  color:  "text-red-400",
                  border: "border-red-500/20",
                  bg:     "bg-red-500/[0.07]",
                },
                {
                  label:  "Avg. Claimed DOM",
                  value:  "24 days",
                  sub:    "as displayed on portals",
                  color:  "text-amber-400",
                  border: "border-amber-500/20",
                  bg:     "bg-amber-500/[0.07]",
                },
                {
                  label:  "Manipulation Rate",
                  value:  "81%",
                  sub:    "of listings refreshed ≥1×",
                  color:  "text-cyan-400",
                  border: "border-cyan-500/20",
                  bg:     "bg-cyan-500/[0.07]",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl border p-5 backdrop-blur-xl ${s.border} ${s.bg}`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {s.label}
                  </p>
                  <p className={`mt-2 text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* ── b) Listings table ── */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">

              {/* Card header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                <h2 className="text-sm font-semibold text-white">Listing Intelligence</h2>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold text-slate-400">
                  {MOCK_LISTINGS.length} results
                </span>
              </div>

              {/* Horizontal scroll on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      {["Address", "Community", "Claimed Age", "True Age", "RIS", "Status"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {MOCK_LISTINGS.map((row, idx) => {
                      const ris = risStyle(row.ris);
                      return (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.07 * idx, duration: 0.3, ease: "easeOut" }}
                          className="transition-colors hover:bg-white/[0.02]"
                        >
                          {/* Address */}
                          <td className="px-5 py-3.5 font-medium text-slate-200 whitespace-nowrap">
                            {row.address}
                          </td>
                          {/* Community */}
                          <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                            {row.community}
                          </td>
                          {/* Claimed age */}
                          <td className="px-5 py-3.5 text-slate-400">
                            {row.claimedAge}
                          </td>
                          {/* True age */}
                          <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                            {row.trueAge} days
                          </td>
                          {/* RIS chip */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums ${ris.chip}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${ris.dot}`} />
                              {row.ris.toFixed(1)}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <StatusBadge relists={row.relists} />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* RIS legend footer */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] px-6 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  RIS key:
                </span>
                {[
                  { label: "Clean (<7)",     dot: "bg-emerald-400" },
                  { label: "Suspect (7–30)", dot: "bg-amber-400"   },
                  { label: "Inflated (>30)", dot: "bg-red-400"     },
                ].map((k) => (
                  <span key={k.label} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className={`h-2 w-2 rounded-full ${k.dot}`} />
                    {k.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Disclaimer ── */}
            <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              <p className="text-[11px] leading-relaxed text-slate-500">
                True Days‑on‑Market calculated from cross‑portal SCD-2 listing snapshots.
                Portal‑claimed age may differ due to listing refreshes.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}