import {
  CheckCircle2,
  Clock3,
  Database,
  Layers3,
  ShieldCheck,
} from "lucide-react";

type ReconStatusStripProps = {
  countryLabel: string;
  exportLimit: number;
  summaryRows: number;
  tabCount: number;
  activeDataMode: string;
};

export default function ReconStatusStrip({
  countryLabel,
  exportLimit,
  summaryRows,
  tabCount,
  activeDataMode,
}: ReconStatusStripProps) {
  const items = [
    {
      label: "Country",
      value: countryLabel,
      icon: Layers3,
    },
    {
      label: "Tabs loaded",
      value: `${tabCount}`,
      icon: CheckCircle2,
    },
    {
      label: "Export limit",
      value: `${exportLimit.toLocaleString("en-US")} / tab`,
      icon: Database,
    },
    {
      label: "Summary rows",
      value: summaryRows.toLocaleString("en-US"),
      icon: Clock3,
    },
    {
      label: "Mode",
      value: activeDataMode,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </span>
                <Icon className="h-4 w-4 text-emerald-300/80" />
              </div>
              <p className="truncate text-sm font-bold text-white">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}