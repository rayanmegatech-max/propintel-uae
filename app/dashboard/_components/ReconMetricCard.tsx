// app/dashboard/_components/ReconMetricCard.tsx
"use client";

import { motion } from "framer-motion";
import type { ReconMetric } from "@/lib/recon/types";

const TONE_COLORS: Record<
  NonNullable<ReconMetric["tone"]>,
  { accent: string; glow: string }
> = {
  emerald: { accent: "#34d399", glow: "rgba(16,185,129,0.15)" },
  cyan:    { accent: "#22d3ee", glow: "rgba(34,211,238,0.15)" },
  amber:   { accent: "#fbbf24", glow: "rgba(245,158,11,0.15)" },
  red:     { accent: "#fb7185", glow: "rgba(244,63,94,0.15)" },
  slate:   { accent: "#94a3b8", glow: "rgba(148,163,184,0.15)" },
  teal:    { accent: "#2dd4bf", glow: "rgba(20,184,166,0.15)" },
};

export default function ReconMetricCard({ metric }: { metric: ReconMetric }) {
  const tone = metric.tone ?? "slate";
  const colors = TONE_COLORS[tone];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-[16px] border transition-colors duration-300"
      style={{
        background: "rgba(255, 255, 255, 0.015)",
        borderColor: "rgba(255,255,255,0.05)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top Border Highlight */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300" 
        style={{ background: colors.accent, boxShadow: `0 0 12px ${colors.accent}` }} 
      />

      {/* Ambient hover glow */}
      <div 
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: colors.glow }}
      />

      <div className="relative z-10 px-5 py-5 sm:px-6 sm:py-6">
        {/* Label row */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              background: colors.accent,
              boxShadow: `0 0 8px ${colors.accent}`,
            }}
          />
          <span
            className="text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ color: colors.accent }}
          >
            {metric.label}
          </span>
        </div>

        {/* Value */}
        <p
          className="text-[32px] font-extrabold tabular-nums leading-none tracking-tight sm:text-[36px]"
          style={{ color: "#ffffff" }}
        >
          {metric.value}
        </p>

        {/* Description */}
        <p
          className="mt-2.5 text-[12px] font-medium leading-relaxed"
          style={{ color: "#a1a1aa" }}
        >
          {metric.description}
        </p>
      </div>
    </motion.div>
  );
}