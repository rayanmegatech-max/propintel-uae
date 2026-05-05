import type { ReconMetric } from "@/lib/recon/types";

const TONE_CLASS_MAP: Record<NonNullable<ReconMetric["tone"]>, string> = {
  emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  red: "border-red-400/20 bg-red-400/10 text-red-300",
  slate: "border-white/[0.08] bg-white/[0.04] text-slate-300",
  teal: "border-teal-400/20 bg-teal-400/10 text-teal-300",
};

export default function ReconMetricCard({ metric }: { metric: ReconMetric }) {
  const tone = metric.tone ?? "slate";
  const toneClasses = TONE_CLASS_MAP[tone];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
      <div
        className={[
          "mb-4 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
          toneClasses,
        ].join(" ")}
      >
        {metric.label}
      </div>

      <p className="text-2xl font-bold text-white">{metric.value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {metric.description}
      </p>
    </div>
  );
}