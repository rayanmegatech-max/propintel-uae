// app/dashboard/_components/ReconMetricCard.tsx
"use client";

import type { ReconMetric } from "@/lib/recon/types";

const TONE_COLORS: Record<
  NonNullable<ReconMetric["tone"]>,
  { accent: string; bg: string; border: string; dot: string }
> = {
  emerald: {
    accent: "#34d399",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.18)",
    dot: "#10b981",
  },
  cyan: {
    accent: "#22d3ee",
    bg: "rgba(34,211,238,0.06)",
    border: "rgba(34,211,238,0.18)",
    dot: "#06b6d4",
  },
  amber: {
    accent: "#fbbf24",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.18)",
    dot: "#f59e0b",
  },
  red: {
    accent: "#fb7185",
    bg: "rgba(244,63,94,0.06)",
    border: "rgba(244,63,94,0.18)",
    dot: "#f43f5e",
  },
  slate: {
    accent: "#94a3b8",
    bg: "rgba(148,163,184,0.04)",
    border: "rgba(255,255,255,0.08)",
    dot: "#64748b",
  },
  teal: {
    accent: "#2dd4bf",
    bg: "rgba(20,184,166,0.06)",
    border: "rgba(20,184,166,0.18)",
    dot: "#14b8a6",
  },
};

export default function ReconMetricCard({ metric }: { metric: ReconMetric }) {
  const tone = metric.tone ?? "slate";
  const colors = TONE_COLORS[tone];

  return (
    <div
      className="group relative overflow-hidden rounded-xl transition-all duration-150 hover:-translate-y-0.5"
      style={{
        background: "#111113",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderTopColor: colors.border,
        borderTopWidth: "2px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {/* Label row */}
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              background: colors.dot,
              boxShadow: `0 0 6px ${colors.dot}80`,
            }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: colors.accent }}
          >
            {metric.label}
          </span>
        </div>

        {/* Value */}
        <p
          className="text-[28px] font-bold tabular-nums leading-none tracking-tight sm:text-[32px]"
          style={{ color: "#f4f4f5", letterSpacing: "-0.03em" }}
        >
          {metric.value}
        </p>

        {/* Description */}
        <p
          className="mt-2 text-[11px] leading-snug"
          style={{ color: "#52525b" }}
        >
          {metric.description}
        </p>
      </div>
    </div>
  );
}
