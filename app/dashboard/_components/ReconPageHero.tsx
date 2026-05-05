import {
  Activity,
  BadgeCheck,
  Database,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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

export default function ReconPageHero({
  countryLabel,
  countryCode,
  currency,
  exportedAt,
  title,
  description,
  primaryTableText,
  marketScopeText,
}: ReconPageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_420px]">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              {countryCode} Recon Hub
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Intelligence command center
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Currency: {currency}
            </span>
          </div>

          <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
            {description}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <Globe2 className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Market
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                {countryLabel}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {marketScopeText}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Database className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Data layer
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                Product-safe exports
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {primaryTableText}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <Activity className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Last export
              </p>
              <p className="mt-1 truncate text-sm font-bold text-white">
                {exportedAt}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Local JSON preview bridge.
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-[1.7rem] border border-emerald-400/20 bg-emerald-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-emerald-50">
                Safe commercial intelligence layer
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                This screen reads dashboard-ready product exports only. It does not
                expose raw evidence tables, raw price-history events, local database
                paths, crawler internals, or unsafe diagnostic records.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              "Opportunity ranking",
              "Price movement visibility",
              "Owner/direct and contactability cues",
              "Listing truth and refresh signals",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2"
              >
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                <span className="text-sm font-medium text-emerald-50/90">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}