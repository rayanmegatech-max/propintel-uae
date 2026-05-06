import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Database,
  Gauge,
  Globe2,
  Layers3,
  MapPinned,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";
import {
  getCountrySections,
  type CountryConfig,
} from "@/lib/countries/countryConfig";

type CountryOverviewPageProps = {
  country: CountryConfig;
};

function StatCard({
  label,
  value,
  description,
  tone = "slate",
}: {
  label: string;
  value: string;
  description: string;
  tone?: "emerald" | "cyan" | "amber" | "slate";
}) {
  const toneClassMap = {
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    slate: "border-white/[0.08] bg-white/[0.04] text-slate-300",
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div
        className={[
          "mb-4 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]",
          toneClassMap[tone],
        ].join(" ")}
      >
        {label}
      </div>
      <p className="text-2xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function ModuleIcon({ slug, internalOnly }: { slug: string; internalOnly?: boolean }) {
  if (internalOnly) return <Database className="h-4 w-4" />;
  if (slug === "recon") return <Radar className="h-4 w-4" />;
  if (slug === "owner-direct") return <ShieldCheck className="h-4 w-4" />;
  if (slug === "price-drops") return <TrendingDown className="h-4 w-4" />;
  if (slug === "listing-age") return <Gauge className="h-4 w-4" />;
  if (slug === "market-dominance") return <BarChart3 className="h-4 w-4" />;
  if (slug === "inventory-pressure") return <Layers3 className="h-4 w-4" />;
  if (slug === "buildings") return <Building2 className="h-4 w-4" />;
  if (slug === "communities") return <MapPinned className="h-4 w-4" />;
  if (slug === "market-intelligence") return <Sparkles className="h-4 w-4" />;
  return <Zap className="h-4 w-4" />;
}

function getModuleStatus(slug: string, disabledReason?: string) {
  if (slug === "recon") {
    return {
      label: "Live preview",
      className:
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    };
  }

  if (disabledReason) {
    return {
      label: "Internal / later",
      className: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    };
  }

  return {
    label: "Shell ready",
    className: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  };
}

export default function CountryOverviewPage({
  country,
}: CountryOverviewPageProps) {
  const sections = getCountrySections(country);

  const reconSection = sections.find((section) => section.slug === "recon");
  const publicSections = sections.filter((section) => !section.internalOnly);
  const internalSections = sections.filter((section) => section.internalOnly);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_420px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
                <Globe2 className="h-3.5 w-3.5" />
                {country.label} Market OS
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                GCC intelligence platform
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Currency: {country.currency}
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              {country.fullName} intelligence command center
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              {country.productPositioning}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Data engine
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  Local SQLite exports
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Heavy intelligence remains local until hosted sync is designed.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Active module
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  Recon Hub
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Real exported data, tabs, filters, and normalized cards.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Publish status
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {country.publishStatus}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Frontend-first build before Supabase/auth/billing.
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
                  Launchable SaaS structure
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                  This country workspace is no longer just a route shell. Recon Hub
                  is live in local-preview mode, while the remaining launch modules
                  are structured as country-aware product pages ready for phased UI
                  buildout.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                "Country-specific routing",
                "Product-safe dashboard table mapping",
                "Real-data Recon preview",
                "Premium UI before hosted backend sync",
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Product family"
          value="Modules 0–5"
          description="Unified listing foundation, owner/direct, price movement, listing truth, Recon Hub, and market dominance."
          tone="emerald"
        />
        <StatCard
          label="Country"
          value={country.label}
          description={`Country-aware routes, currency, table mappings, caveats, and publish status for ${country.fullName}.`}
          tone="cyan"
        />
        <StatCard
          label="Active preview"
          value="Recon Hub"
          description="The first real-data dashboard module with tabs, filters, normalized cards, and product-safe exports."
          tone="amber"
        />
        <StatCard
          label="Positioning"
          value="Intel OS"
          description="Not a portal clone. Built for opportunities, pressure, dominance, listing truth, and market activity."
        />
      </section>

      {reconSection ? (
        <section className="rounded-[1.7rem] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_34%),rgba(16,185,129,0.055)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="grid gap-5 lg:grid-cols-[1fr_280px] lg:items-center">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
                Featured live module
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Recon Hub is the current sellable module preview
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Open the real-data Recon experience for {country.label}: clickable
                tabs, search, filters, normalized opportunity cards, and
                product-safe exports built from your local intelligence pipeline.
              </p>
            </div>

            <Link
              href={`${country.routeBase}/${reconSection.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(16,185,129,0.22)] transition hover:bg-emerald-400"
            >
              Open Recon Hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : null}

      <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              {country.label} product modules
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Country-aware launch modules. Recon is live in local-preview mode;
              the remaining modules will receive the same premium UI treatment in
              controlled phases.
            </p>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            {publicSections.length} public pages · {internalSections.length} internal
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const disabled = Boolean(section.disabledReason);
            const status = getModuleStatus(section.slug, section.disabledReason);
            const isRecon = section.slug === "recon";

            return (
              <Link
                key={section.slug}
                href={`${country.routeBase}/${section.slug}`}
                className={[
                  "group relative overflow-hidden rounded-3xl border p-5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] transition",
                  isRecon
                    ? "border-emerald-400/25 bg-emerald-400/[0.075] hover:border-emerald-400/40"
                    : disabled
                      ? "border-amber-400/15 bg-amber-400/[0.04] hover:border-amber-400/25"
                      : "border-white/[0.08] bg-slate-950/50 hover:border-cyan-400/25 hover:bg-slate-900/70",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl transition group-hover:bg-emerald-400/10" />

                <div className="relative">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div
                      className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                        isRecon
                          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                          : disabled
                            ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                            : "border-white/[0.08] bg-white/[0.05] text-slate-300 group-hover:text-cyan-300",
                      ].join(" ")}
                    >
                      <ModuleIcon
                        slug={section.slug}
                        internalOnly={section.internalOnly}
                      />
                    </div>

                    <span
                      className={[
                        "rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
                        status.className,
                      ].join(" ")}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">
                    {section.label}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                    {disabled ? section.disabledReason : section.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      {section.internalOnly ? "Internal workspace" : "Country page"}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <h2 className="text-base font-bold text-white">
          Country-specific caveats
        </h2>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {country.caveats.map((caveat) => (
            <div
              key={caveat}
              className="rounded-2xl border border-white/[0.08] bg-slate-950/50 p-4 text-sm leading-6 text-slate-400"
            >
              {caveat}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}