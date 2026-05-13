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
  t1: "#ffffff",
  t3: "#a1a1aa",
  t4: "#71717a",
  emHi: "#34d399",
  border: "rgba(255,255,255,0.08)",
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
    <div className="space-y-3">
      {/* Lane label */}
      <div className="flex items-center gap-3">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: C.t4 }}
        >
          Opportunity Views
        </span>
        <div className="h-px flex-1" style={{ background: C.borderFt }} />
      </div>

      {/* Priority + secondary lane row with horizontal scroll on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {priorityTabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const countLabel = formatCount(tab.count);

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-[9px] text-[13px] font-bold whitespace-nowrap transition-all duration-200"
              style={{
                color: isActive ? C.t1 : C.t3,
                background: isActive ? "linear-gradient(180deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? "rgba(52,211,153,0.3)" : C.borderFt}`,
                boxShadow: isActive ? "0 4px 12px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
              }}
              aria-pressed={isActive}
            >
              {isActive && (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
                  style={{
                    background: C.emHi,
                    boxShadow: "0 0 6px rgba(52,211,153,0.8)",
                  }}
                />
              )}
              {tab.label}
              {countLabel && (
                <span
                  className="rounded-md px-1.5 py-[2px] text-[10px] font-bold tabular-nums"
                  style={{
                    color: isActive ? C.emHi : C.t4,
                    background: isActive ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
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
            <div className="mx-2 hidden h-6 w-px shrink-0 sm:block" style={{ background: C.borderFt }} />
            {secondaryTabs.map((tab) => {
              const isActive = tab.key === activeTab;
              const countLabel = formatCount(tab.count);

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-[7px] text-[12px] font-semibold whitespace-nowrap transition-all duration-200"
                  style={{
                    color: isActive ? C.t1 : C.t4,
                    background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                    border: `1px solid ${isActive ? C.border : "transparent"}`,
                  }}
                  aria-pressed={isActive}
                >
                  {tab.label}
                  {countLabel && (
                    <span
                      className="text-[10px] tabular-nums font-medium"
                      style={{ color: isActive ? C.t3 : C.t4 }}
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
