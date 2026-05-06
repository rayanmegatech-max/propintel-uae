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
  if (value === undefined || Number.isNaN(value)) {
    return null;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export default function ReconTabSelector({
  tabs,
  activeTab,
  onTabChange,
}: ReconTabSelectorProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[1.5rem] border border-white/[0.08] bg-slate-950/50 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between gap-3 px-2 py-1">
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          <BarChart3 className="h-3.5 w-3.5 text-emerald-300/80" />
          Opportunity lanes
        </div>

        <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[10px] font-bold text-slate-500">
          {tabs.length} views
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const countLabel = formatCount(tab.count);

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={[
                "group relative min-w-[174px] overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200",
                isActive
                  ? "border-emerald-400/45 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),rgba(16,185,129,0.075))] text-white shadow-[0_0_36px_rgba(16,185,129,0.14)]"
                  : "border-white/[0.08] bg-white/[0.035] text-slate-400 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-slate-200",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {isActive ? (
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-emerald-300/70" />
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-black">{tab.label}</span>

                {countLabel ? (
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-black",
                      isActive
                        ? "border border-emerald-300/20 bg-emerald-300/12 text-emerald-100"
                        : "bg-slate-900 text-slate-500 group-hover:text-slate-300",
                    ].join(" ")}
                  >
                    {countLabel}
                  </span>
                ) : null}
              </div>

              {tab.description ? (
                <p
                  className={[
                    "mt-1 max-w-40 truncate text-[11px] font-medium",
                    isActive ? "text-emerald-100/70" : "text-slate-500",
                  ].join(" ")}
                >
                  {tab.description}
                </p>
              ) : null}

              <div
                className={[
                  "mt-3 h-1 rounded-full transition",
                  isActive
                    ? "bg-gradient-to-r from-emerald-300 via-cyan-300 to-transparent"
                    : "bg-white/[0.04]",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}