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
    <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-2 backdrop-blur-xl">
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
                "group min-w-fit rounded-xl border px-4 py-3 text-left transition",
                isActive
                  ? "border-emerald-400/40 bg-emerald-400/15 text-white shadow-[0_0_30px_rgba(16,185,129,0.10)]"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-slate-200",
              ].join(" ")}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{tab.label}</span>

                {countLabel ? (
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      isActive
                        ? "bg-emerald-300/15 text-emerald-200"
                        : "bg-slate-800 text-slate-500 group-hover:text-slate-300",
                    ].join(" ")}
                  >
                    {countLabel}
                  </span>
                ) : null}
              </div>

              {tab.description ? (
                <p
                  className={[
                    "mt-1 max-w-44 truncate text-xs",
                    isActive ? "text-emerald-100/70" : "text-slate-500",
                  ].join(" ")}
                >
                  {tab.description}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}