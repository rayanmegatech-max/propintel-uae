import { CheckCircle2, Clock3, Layers3, ShieldCheck } from "lucide-react";

type ReconStatusStripProps = {
  countryLabel: string;
  exportLimit: number;
  summaryRows: number;
  tabCount: number;
  activeDataMode: string;
};

export default function ReconStatusStrip({
  countryLabel,
  tabCount,
  summaryRows,
  activeDataMode,
}: ReconStatusStripProps) {
  const items = [
    { label: "Market", value: countryLabel, icon: Layers3 },
    { label: "Lanes", value: `${tabCount}`, icon: CheckCircle2 },
    { label: "Active rows", value: summaryRows.toLocaleString("en-US"), icon: Clock3 },
    { label: "Source", value: activeDataMode === "Local JSON" ? "Local exports" : activeDataMode, icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-1.5">
          <Icon className="h-3 w-3 shrink-0" />
          <span>{label}</span>
          <span className="font-semibold text-zinc-300">{value}</span>
        </div>
      ))}
    </div>
  );
}