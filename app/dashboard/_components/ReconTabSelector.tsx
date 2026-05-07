"use client";

import { BarChart3 } from "lucide-react";

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

  const primaryTabs = tabs.slice(0, 4);
  const moreTabs = tabs.slice(4);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      <div className="mr-2 flex items-center gap-1.5 text-zinc-500 shrink-0">
        <BarChart3 className="h-3.5 w-3.5" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em]">
          Lanes
        </span>
      </div>

      {primaryTabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const countLabel = formatCount(tab.count);
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold whitespace-nowrap rounded-t-lg transition-colors",
              isActive
                ? "bg-white/[0.03] border-b-2 border-emerald-400 text-white"
                : "text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent",
            ].join(" ")}
            aria-pressed={isActive}
          >
            {tab.label}
            {countLabel && (
              <span
                className={[
                  "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-black",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-white/[0.06] text-zinc-500",
                ].join(" ")}
              >
                {countLabel}
              </span>
            )}
          </button>
        );
      })}

      {moreTabs.length > 0 && (
        <div className="flex items-center gap-1 ml-1 border-l border-white/[0.08] pl-2">
          {moreTabs.map((tab) => {
            const isActive = tab.key === activeTab;
            const countLabel = formatCount(tab.count);
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={[
                  "flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap rounded-lg transition-colors",
                  isActive
                    ? "bg-white/[0.04] text-white"
                    : "text-zinc-500 hover:text-zinc-300",
                ].join(" ")}
                aria-pressed={isActive}
              >
                {tab.label}
                {countLabel && (
                  <span className="text-[10px] bg-white/[0.06] rounded px-1 py-0.5 text-zinc-500">
                    {countLabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}