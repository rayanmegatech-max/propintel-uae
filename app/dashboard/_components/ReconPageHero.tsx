import { Sparkles } from "lucide-react";

type ReconPageHeroProps = {
  countryLabel: string;
  countryCode: "UAE" | "KSA";
  currency: "AED" | "SAR";
  exportedAt: string;
  title: string;
  description: string;
  primaryTableText: string;
  marketScopeText: string;
};

function compactDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default function ReconPageHero({
  countryCode,
  currency,
  exportedAt,
  title,
  description,
}: ReconPageHeroProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-zinc-400 max-w-3xl">{description}</p>
      </div>

      <div className="flex items-center gap-2 sm:self-start mt-1 sm:mt-0">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
          <Sparkles className="h-3 w-3" />
          {countryCode}
        </span>
        <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-0.5 text-[10px] font-medium text-zinc-300">
          {currency}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-950/55 px-2.5 py-0.5 text-[10px] font-bold text-zinc-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
        <span className="text-[10px] text-zinc-500 ml-2 hidden sm:block">
          Synced {compactDate(exportedAt)}
        </span>
      </div>
    </div>
  );
}