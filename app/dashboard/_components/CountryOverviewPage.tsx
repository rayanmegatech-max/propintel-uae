import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Database,
  Globe2,
  MapPinned,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getCountrySections, type CountryConfig } from "@/lib/countries/countryConfig";

type CountryOverviewPageProps = {
  country: CountryConfig;
};

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export default function CountryOverviewPage({ country }: CountryOverviewPageProps) {
  const sections = getCountrySections(country);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Globe2 className="h-3.5 w-3.5" />
              {country.label} Intelligence Command Center
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                  {country.fullName} Real Estate Intelligence
                </h1>

                <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400 sm:text-base">
                  {country.productPositioning}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                    Currency: {country.currency}
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                    Publish status: {country.publishStatus}
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                    Local data engine: SQLite
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <div>
                    <h2 className="text-sm font-semibold text-emerald-100">
                      Frontend-safe backend status
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                      {country.launchStatus}. This shell is ready for data-contract
                      planning, but it is not wired to Supabase or live data yet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Product family"
          value="Modules 0–5"
          description="Unified listing foundation, owner/direct, price movement, listing truth, Recon Hub, and market dominance."
        />
        <StatCard
          label="Country"
          value={country.label}
          description={`Country-aware routes, currency, table mappings, caveats, and publish status for ${country.fullName}.`}
        />
        <StatCard
          label="Frontend mode"
          value="Shell"
          description="No live database connection yet. This phase stabilizes routes, navigation, and product contracts."
        />
        <StatCard
          label="Launch focus"
          value="Intelligence"
          description="Not a portal clone. The app focuses on opportunities, pressure, dominance, and activity signals."
        />
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {country.label} product modules
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Each page is country-aware and maps to product-safe backend tables.
            </p>
          </div>

          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Phase 5C.1 shell
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const disabled = Boolean(section.disabledReason);

            return (
              <Link
                key={section.slug}
                href={`${country.routeBase}/${section.slug}`}
                className={[
                  "group rounded-2xl border p-4 transition",
                  disabled
                    ? "border-amber-400/15 bg-amber-400/[0.04] hover:border-amber-400/25"
                    : "border-white/[0.08] bg-slate-950/50 hover:border-emerald-400/30 hover:bg-slate-900/70",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      disabled
                        ? "bg-amber-400/10 text-amber-300"
                        : "bg-white/[0.05] text-slate-300 group-hover:text-emerald-300",
                    ].join(" ")}
                  >
                    {section.internalOnly ? (
                      <Database className="h-4 w-4" />
                    ) : section.slug === "market-intelligence" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : section.slug === "buildings" ? (
                      <Building2 className="h-4 w-4" />
                    ) : section.slug === "communities" ? (
                      <MapPinned className="h-4 w-4" />
                    ) : (
                      <Radar className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white">
                      {section.label}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {disabled ? section.disabledReason : section.description}
                    </p>
                  </div>

                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
        <h2 className="text-base font-semibold text-white">
          Country-specific caveats
        </h2>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {country.caveats.map((caveat) => (
            <div
              key={caveat}
              className="rounded-xl border border-white/[0.08] bg-slate-950/50 p-3 text-sm leading-6 text-slate-400"
            >
              {caveat}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}