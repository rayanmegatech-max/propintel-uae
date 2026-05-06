"use client";

import { motion } from "framer-motion";
import type { ReconMetric } from "@/lib/recon/types";

const TONE_CLASS_MAP: Record<NonNullable<ReconMetric["tone"]>, string> = {
  emerald:
    "border-emerald-400/20 bg-emerald-400/[0.075] text-emerald-300 shadow-[0_16px_50px_rgba(16,185,129,0.08)]",
  cyan:
    "border-cyan-400/20 bg-cyan-400/[0.075] text-cyan-300 shadow-[0_16px_50px_rgba(34,211,238,0.08)]",
  amber:
    "border-amber-400/20 bg-amber-400/[0.075] text-amber-300 shadow-[0_16px_50px_rgba(251,191,36,0.08)]",
  red:
    "border-red-400/20 bg-red-400/[0.075] text-red-300 shadow-[0_16px_50px_rgba(248,113,113,0.08)]",
  slate:
    "border-white/[0.08] bg-white/[0.045] text-slate-300 shadow-[0_16px_50px_rgba(0,0,0,0.16)]",
  teal:
    "border-teal-400/20 bg-teal-400/[0.075] text-teal-300 shadow-[0_16px_50px_rgba(20,184,166,0.08)]",
};

const DOT_CLASS_MAP: Record<NonNullable<ReconMetric["tone"]>, string> = {
  emerald: "bg-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.7)]",
  cyan: "bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.7)]",
  amber: "bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.7)]",
  red: "bg-red-300 shadow-[0_0_18px_rgba(248,113,113,0.7)]",
  slate: "bg-slate-300 shadow-[0_0_18px_rgba(148,163,184,0.45)]",
  teal: "bg-teal-300 shadow-[0_0_18px_rgba(20,184,166,0.7)]",
};

export default function ReconMetricCard({ metric }: { metric: ReconMetric }) {
  const tone = metric.tone ?? "slate";
  const toneClasses = TONE_CLASS_MAP[tone];
  const dotClasses = DOT_CLASS_MAP[tone];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/45 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/[0.045] blur-2xl transition group-hover:bg-emerald-400/[0.08]" />

      <div className="relative">
        <div
          className={[
            "mb-4 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]",
            toneClasses,
          ].join(" ")}
        >
          <span className={["h-1.5 w-1.5 rounded-full", dotClasses].join(" ")} />
          {metric.label}
        </div>

        <p className="text-3xl font-black tracking-[-0.04em] text-white">
          {metric.value}
        </p>

        <p className="mt-2 min-h-[2.75rem] text-sm leading-6 text-slate-400">
          {metric.description}
        </p>
      </div>
    </motion.div>
  );
}