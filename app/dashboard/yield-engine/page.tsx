"use client";

import { DollarSign } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
          <DollarSign className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Investor Yield Engine</h1>
          <p className="text-sm text-slate-400">Long-term vs. short-term rental arbitrage scanner. See which buildings yield 20%+ gross margin.</p>
        </div>
      </div>

      {/* ── Coming Q3 card ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Investor Yield Engine</h2>
            <p className="max-w-lg text-sm text-slate-400">Long-term vs. short-term rental arbitrage scanner. See which buildings yield 20%+ gross margin.</p>
          </div>

          {/* Amber Coming Q3 badge */}
          <div className="flex shrink-0 items-center gap-1.5 self-start rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            Coming Q3
          </div>
        </div>

        <div className="mt-6 border-t border-white/[0.06] pt-5">
          <p className="text-[13px] text-slate-400">
            Available <span className="font-semibold text-white">Q3 2026</span> — included
            in your subscription at no extra charge.
          </p>

          {/* Skeleton preview */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
            <div className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
            <div className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
          </div>
          <div className="mt-3 h-28 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
        </div>
      </div>

      {/* ── Notify me card ── */}
      <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] backdrop-blur-xl p-5">
        <p className="text-sm font-semibold text-amber-300">Get notified when it launches</p>
        <p className="mt-1 text-[13px] text-slate-400">
          We'll send you an in-dashboard alert the moment Investor Yield Engine goes live. No action needed.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-medium text-amber-400">Scheduled for Q3 2026</span>
        </div>
      </div>

    </div>
  );
}