// app/dashboard/_components/ReconStatusStrip.tsx
import { Database, Layers3, Radio, ShieldCheck } from "lucide-react";

type ReconStatusStripProps = {
  countryLabel: string;
  exportLimit: number;
  summaryRows: number;
  tabCount: number;
  activeDataMode: string;
};

const C = {
  t1: "#ffffff",
  t2: "#a1a1aa",
  t3: "#71717a",
  border: "rgba(255,255,255,0.06)",
  emHi: "#34d399",
} as const;

export default function ReconStatusStrip({
  countryLabel,
  tabCount,
  summaryRows,
  activeDataMode,
}: ReconStatusStripProps) {
  const sourceLabel = activeDataMode === "Local JSON" ? "Product-ready export" : activeDataMode;

  return (
    <div
      className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-x-6 gap-y-3 rounded-xl px-5 py-3.5 shadow-sm"
      style={{
        background: "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(9,9,11,0.2) 100%)",
        border: `1px solid ${C.border}`,
        backdropFilter: "blur(10px)"
      }}
    >
      {/* Market */}
      <div className="flex items-center gap-2">
        <Layers3 className="h-4 w-4 shrink-0 opacity-70" style={{ color: C.t3 }} />
        <span className="text-[11px] font-medium" style={{ color: C.t2 }}>Market</span>
        <span className="text-[11px] font-bold" style={{ color: C.t1 }}>{countryLabel}</span>
      </div>

      {/* Signal Views */}
      <div className="flex items-center gap-2">
        <Radio className="h-4 w-4 shrink-0 opacity-70" style={{ color: C.t3 }} />
        <span className="text-[11px] font-medium" style={{ color: C.t2 }}>Signal Views</span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color: C.t1 }}>
          {tabCount} active
        </span>
      </div>

      {/* Analyzed Listings */}
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 shrink-0 opacity-70" style={{ color: C.t3 }} />
        <span className="text-[11px] font-medium" style={{ color: C.t2 }}>Analyzed Listings</span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color: C.t1 }}>
          {summaryRows.toLocaleString("en-US")}
        </span>
      </div>

      {/* Source */}
      <div className="flex items-center gap-2 sm:ml-auto">
        <ShieldCheck className="h-4.5 w-4.5 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ color: C.emHi }} />
        <span className="text-[11px] font-bold" style={{ color: C.emHi }}>
          {sourceLabel}
        </span>
      </div>
    </div>
  );
}