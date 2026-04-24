"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  FileText,
  ChevronDown,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValuationForm {
  community: string;
  type: "apartment" | "villa";
  bedrooms: string;
  sizeSqft: string;
}

interface Comparable {
  address: string;
  price: string;
  psf: string;
  dom: number;
}

// ─── Static mock data ─────────────────────────────────────────────────────────

const COMPARABLES: Comparable[] = [
  { address: "Downtown Dubai, Burj Vista T1, 15F",  price: "AED 2,250,000", psf: "AED 2,108", dom: 18 },
  { address: "Downtown Dubai, The Address Sky View", price: "AED 2,400,000", psf: "AED 2,248", dom: 31 },
  { address: "Downtown Dubai, Act One Act Two",      price: "AED 2,370,000", psf: "AED 2,219", dom: 9  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30";

const selectCls =
  "w-full cursor-pointer appearance-none rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SmartPricingPage() {
  const [form, setForm] = useState<ValuationForm>({
    community: "",
    type: "apartment",
    bedrooms: "2",
    sizeSqft: "",
  });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const set = (k: keyof ValuationForm, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleGenerate = () => {
    if (!form.community || !form.sizeSqft) return;
    setShowResults(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1100);
  };

  const canSubmit = form.community.trim().length > 0 && form.sizeSqft.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* ── Page header ── */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
            <Calculator className="h-4 w-4 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Smart Pricing Engine</h1>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Price any listing within 2% of true market value using live DLD comparables.
        </p>
      </div>

      {/* ── Input card ── */}
      <GlassCard className="p-6">
        <h2 className="mb-5 text-sm font-semibold text-white">Property Details</h2>

        <div className="space-y-4">
          {/* Community */}
          <div>
            <Label>Community / Building</Label>
            <input
              type="text"
              placeholder="e.g. Downtown Dubai, Dubai Marina, JVC…"
              value={form.community}
              onChange={(e) => set("community", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Type + Bedrooms row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Property Type</Label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value as ValuationForm["type"])}
                  className={selectCls}
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa / Townhouse</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            <div>
              <Label>Bedrooms</Label>
              <div className="relative">
                <select
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                  className={selectCls}
                >
                  {["Studio", "1", "2", "3", "4", "5+"].map((b) => (
                    <option key={b} value={b}>
                      {b === "Studio" ? "Studio" : `${b} BR`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Size */}
          <div>
            <Label>Size (sq ft)</Label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 1,065"
              value={form.sizeSqft}
              onChange={(e) => set("sizeSqft", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleGenerate}
            disabled={!canSubmit || loading}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analysing DLD data…
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Generate Valuation
              </>
            )}
          </button>

          {!canSubmit && !loading && (
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <AlertCircle className="h-3 w-3" />
              Enter a community name and size to continue.
            </p>
          )}
        </div>
      </GlassCard>

      {/* ── Results card ── */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="p-6">
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Estimated Market Value
                  </p>
                  <p className="mt-1 font-display text-3xl font-black text-white">
                    AED 2,340,000
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                      Confidence ±3.2%
                    </span>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-slate-400">
                      Range: AED 2,265,120 – AED 2,414,880
                    </span>
                  </div>
                </div>

                {/* Export button */}
                <button className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.09] hover:text-white">
                  <FileText className="h-3.5 w-3.5" />
                  Export PDF
                </button>
              </div>

              {/* Confidence meter */}
              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>DLD Match Confidence</span>
                  <span className="font-semibold text-emerald-400">94%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
              </div>

              {/* Comparable listings — horizontal scroll on mobile */}
              <div className="mt-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Comparable Listings (DLD — last 90 days)
                </p>
                <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-left">
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Address
                        </th>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Price
                        </th>
                        <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          PSF
                        </th>
                        <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          DOM
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {COMPARABLES.map((c) => (
                        <tr key={c.address} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-slate-300">{c.address}</td>
                          <td className="px-4 py-3 font-medium text-white">{c.price}</td>
                          <td className="px-4 py-3 text-slate-400">{c.psf}</td>
                          <td className="px-4 py-3 text-right text-slate-400">
                            {c.dom}d
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-slate-600">
                Valuations are indicative only. Based on registered DLD transactions
                and portal data. Not a formal RERA appraisal.
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}