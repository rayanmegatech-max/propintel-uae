// app/dashboard/_components/ReconStatusStrip.tsx

import { Database, Layers3, Radio, Shield } from "lucide-react";

type ReconStatusStripProps = {
  countryLabel: string;
  exportLimit: number;
  summaryRows: number;
  tabCount: number;
  activeDataMode: string;
};

const C = {
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  t5: "#3f3f46",
  border: "rgba(255,255,255,0.05)",
  emHi: "#34d399",
} as const;

export default function ReconStatusStrip({
  countryLabel,
  tabCount,
  summaryRows,
  exportLimit,
  activeDataMode,
}: ReconStatusStripProps) {
  const sourceLabel =
    activeDataMode === "Local JSON" ? "Local export" : activeDataMode;

  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-lg px-3.5 py-2"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${C.border}`,
      }}
    >
      {/* Market */}
      <div className="flex items-center gap-1.5">
        <Layers3 className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Market
        </span>
        <span className="text-[10px] font-semibold" style={{ color: C.t3 }}>
          {countryLabel}
        </span>
      </div>

      {/* Lanes */}
      <div className="flex items-center gap-1.5">
        <Radio className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Lanes
        </span>
        <span
          className="text-[10px] font-semibold tabular-nums"
          style={{ color: C.t3 }}
        >
          {tabCount}
        </span>
      </div>

      {/* Rows available */}
      <div className="flex items-center gap-1.5">
        <Database className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Summary rows
        </span>
        <span
          className="text-[10px] font-semibold tabular-nums"
          style={{ color: C.t2 }}
        >
          {summaryRows.toLocaleString("en-US")}
        </span>
      </div>

      {/* Sample loaded */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Sample limit
        </span>
        <span
          className="text-[10px] font-semibold tabular-nums"
          style={{ color: C.t3 }}
        >
          {exportLimit.toLocaleString("en-US")}
        </span>
      </div>

      {/* Source */}
      <div className="flex items-center gap-1.5">
        <Shield className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Source
        </span>
        <span className="text-[10px] font-semibold" style={{ color: C.emHi }}>
          {sourceLabel}
        </span>
      </div>
    </div>
  );
}