"use client";

const METRICS = [1, 2, 3];

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6">
        <h1 className="text-xl font-bold text-white">Arbitrage Sniper</h1>
        <p className="mt-1 text-sm text-slate-400">
          Identify mispriced listings across UAE portals before competitors act on them.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {METRICS.map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse"
          />
        ))}
      </div>

      <p className="text-sm text-slate-500">Full module dashboard coming soon.</p>
    </div>
  );
}