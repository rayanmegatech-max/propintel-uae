// app/dashboard/_components/ReconTabSelector.tsx
"use client";

export type ReconTabOption = {
  key: string;
  label: string;
  count?: number;
  description?: string;
};

type ReconTabSelectorProps = {
  tabs: ReconTabOption[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
};

const C = {
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  t4: "#52525b",
  t5: "#3f3f46",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.08)",
  emBdr: "rgba(16,185,129,0.22)",
  border: "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",
} as const;

function formatCount(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return null;
  if (value >= 1_000_000)
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000)
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return new Intl.NumberFormat("en-US").format(value);
}

export default function ReconTabSelector({
  tabs,
  activeTab,
  onTabChange,
}: ReconTabSelectorProps) {
  if (tabs.length === 0) return null;

  const priorityTabs = tabs.slice(0, 4);
  const secondaryTabs = tabs.slice(4);

  return (
    <div className="space-y-2">
      {/* Lane label */}
      <div className="flex items-center gap-2">
        <span
          className="text-[9px] font-black uppercase tracking-[0.16em]"
          style={{ color: C.t5 }}
        >
          Workflow lanes
        </span>
        <div className="h-px flex-1" style={{ background: C.borderFt }} />
      </div>

      {/* Priority + secondary lane row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {priorityTabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const countLabel = formatCount(tab.count);

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-[7px] text-[12px] font-semibold whitespace-nowrap transition-all duration-150"
              style={{
                color: isActive ? C.emHi : C.t3,
                background: isActive ? C.emBg : "rgba(255,255,255,0.025)",
                border: `1px solid ${isActive ? C.emBdr : C.borderFt}`,
                boxShadow: isActive
                  ? "0 0 12px rgba(16,185,129,0.08)"
                  : "none",
              }}
              aria-pressed={isActive}
            >
              {isActive && (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
                  style={{
                    background: C.emHi,
                    boxShadow: "0 0 4px rgba(52,211,153,0.5)",
                  }}
                />
              )}
              {tab.label}
              {countLabel && (
                <span
                  className="rounded px-1.5 py-[1px] text-[10px] font-bold tabular-nums"
                  style={{
                    color: isActive ? C.emHi : C.t4,
                    background: isActive
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(255,255,255,0.04)",
                  }}
                >
                  {countLabel}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator + secondary lanes */}
        {secondaryTabs.length > 0 && (
          <>
            <div
              className="mx-1 hidden h-5 w-px sm:block"
              style={{ background: C.borderFt }}
            />
            {secondaryTabs.map((tab) => {
              const isActive = tab.key === activeTab;
              const countLabel = formatCount(tab.count);

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className="flex items-center gap-1 rounded-md px-2.5 py-[5px] text-[11px] font-medium whitespace-nowrap transition-all duration-150"
                  style={{
                    color: isActive ? C.t1 : C.t4,
                    background: isActive
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                    border: `1px solid ${isActive ? C.border : "transparent"}`,
                  }}
                  aria-pressed={isActive}
                >
                  {tab.label}
                  {countLabel && (
                    <span
                      className="text-[10px] tabular-nums"
                      style={{ color: isActive ? C.t3 : C.t5 }}
                    >
                      {countLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
