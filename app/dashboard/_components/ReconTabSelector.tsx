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
    <div className="rounded-3xl border border-white/[0.08] bg-slate-950/45 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
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
                "group min-w-[164px] rounded-2xl border px-4 py-3.5 text-left transition",
                isActive
                  ? "border-emerald-400/40 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),rgba(16,185,129,0.08))] text-white shadow-[0_0_34px_rgba(16,185,129,0.13)]"
                  : "border-white/[0.08] bg-white/[0.035] text-slate-400 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-slate-200",
              ].join(" ")}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black">{tab.label}</span>

                {countLabel ? (
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-black",
                      isActive
                        ? "bg-emerald-300/15 text-emerald-100"
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
                  isActive ? "bg-emerald-300/70" : "bg-transparent",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}