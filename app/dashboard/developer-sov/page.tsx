"use client";

export default function Page() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-white">Developer SOV</h1>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
          Coming Q3
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">Track developer share-of-voice, agent distribution, pricing discipline, and secondary market velocity.</p>
      <p className="mt-4 text-[13px] text-slate-500">
        This module will be available Q3 2026 and is included in your
        current subscription at no extra charge.
      </p>
    </div>
  );
}
