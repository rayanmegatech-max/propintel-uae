"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  UserCheck,
  Zap,
} from "lucide-react";
import {
  getCountrySections,
  type CountryConfig,
} from "@/lib/countries/countryConfig";

type CountryOverviewPageProps = {
  country: CountryConfig;
};

const MODULE_STATS: Record<string, string> = {
  recon: "Live",
  "owner-direct": "36K",
  "price-drops": "19K",
  "listing-age": "200K",
  "market-intelligence": "4.5K",
  "inventory-pressure": "927",
  "market-dominance": "5K",
  "agency-profiles": "7K",
  "activity-feed": "76K",
  buildings: "5K",
  communities: "4.5K",
  "data-quality": "Admin",
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
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.16 }}
      className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl"
    >
      <div
        className={[
          "mb-4 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]",
          toneClassMap[tone],
        ].join(" ")}
      >
        {label}
      </div>
      <p className="text-3xl font-black tracking-[-0.05em] text-white">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </motion.div>
  );
}

function ModuleIcon({ slug, internalOnly }: { slug: string; internalOnly?: boolean }) {
  if (internalOnly) return <Database className="h-4 w-4" />;
  if (slug === "recon") return <Radar className="h-4 w-4" />;
  if (slug === "owner-direct") return <UserCheck className="h-4 w-4" />;
  if (slug === "price-drops") return <TrendingDown className="h-4 w-4" />;
  if (slug === "listing-age") return <Gauge className="h-4 w-4" />;
  if (slug === "market-dominance") return <BarChart3 className="h-4 w-4" />;
  if (slug === "inventory-pressure") return <Layers3 className="h-4 w-4" />;
  if (slug === "buildings") return <Building2 className="h-4 w-4" />;
  if (slug === "communities") return <MapPinned className="h-4 w-4" />;
  if (slug === "market-intelligence") return <Sparkles className="h-4 w-4" />;
  if (slug === "activity-feed") return <Globe2 className="h-4 w-4" />;
  if (slug === "agency-profiles") return <ShieldCheck className="h-4 w-4" />;
  return <Zap className="h-4 w-4" />;
}

function getModuleStatus(slug: string, disabledReason?: string) {
  if (slug === "recon") {
    return {
      label: "Live",
      className:
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    };
  }

  if (disabledReason) {
    return {
      label: "Limited",
      className: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    };
  }

  return {
    label: "Ready",
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
  const isUae = country.slug === "uae";

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),rgba(15,23,42,0.42)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/[0.08] blur-3xl" />

        <div className="relative grid gap-7 xl:grid-cols-[1fr_430px] xl:items-stretch">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
                <Globe2 className="h-3.5 w-3.5" />
                {isUae ? "🇦🇪 UAE Market OS" : "🇸🇦 KSA Market OS"}
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Currency: {country.currency}
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Local export mode
              </span>
            </div>

            <h1 className="max-w-5xl text-4xl font-black tracking-[-0.06em] text-white sm:text-6xl">
              {country.fullName} intelligence command center
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              {country.productPositioning}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/recon`}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(16,185,129,0.22)] transition hover:bg-emerald-400"
              >
                Open Recon Hub
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`${country.routeBase}/market-intelligence`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.055] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Market Intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-black text-emerald-50">
                  Launchable intelligence workspace
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                  Real-data pages are wired through local frontend exports while
                  hosted sync, auth, and payments remain intentionally out of scope.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                "Country-aware routing",
                "Product-safe table mapping",
                "Module 5 real-data pages",
                isUae ? "Building intelligence enabled" : "City/district first",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2"
                >
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  <span className="text-sm font-semibold text-emerald-50/90">
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
          description="Unified lead, listing, pressure, dominance, and activity intelligence."
          tone="emerald"
        />
        <StatCard
          label="Country"
          value={country.label}
          description={`Routes, currency, caveats, and table mappings for ${country.fullName}.`}
          tone="cyan"
        />
        <StatCard
          label="Live module"
          value="Recon"
          description="The first sellable local-data module with tabs, filters, and cards."
          tone="amber"
        />
        <StatCard
          label="Pages"
          value={`${publicSections.length}+`}
          description={`${publicSections.length} public product pages and ${internalSections.length} internal QA page.`}
        />
      </section>

      <section className="rounded-[1.6rem] border border-white/[0.08] bg-slate-950/45 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Module grid
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {country.label} intelligence modules
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Clean launch pages for the country-specific SaaS product family.
            </p>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            {publicSections.length} public · {internalSections.length} internal
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {sections.map((section) => {
            const disabled = Boolean(section.disabledReason);
            const status = getModuleStatus(section.slug, section.disabledReason);
            const isRecon = section.slug === "recon";
            const stat = MODULE_STATS[section.slug] ?? "Ready";

            return (
              <motion.div
                key={section.slug}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.16 }}
              >
                <Link
                  href={`${country.routeBase}/${section.slug}`}
                  className={[
                    "group relative block min-h-[190px] overflow-hidden rounded-2xl border p-4 shadow-[0_16px_50px_rgba(0,0,0,0.14)] transition",
                    isRecon
                      ? "border-emerald-400/25 bg-emerald-400/[0.075] hover:border-emerald-400/40"
                      : disabled
                        ? "border-amber-400/15 bg-amber-400/[0.04] hover:border-amber-400/25"
                        : "border-white/[0.08] bg-white/[0.035] hover:border-cyan-400/25 hover:bg-white/[0.055]",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl transition group-hover:bg-emerald-400/10" />

                  <div className="relative flex h-full flex-col">
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

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={[
                            "rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
                            status.className,
                          ].join(" ")}
                        >
                          {status.label}
                        </span>
                        <span className="text-2xl font-black tracking-[-0.05em] text-white">
                          {stat}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white">
                      {section.label}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                      {disabled ? section.disabledReason : section.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-5">
                      <span className="text-xs font-semibold text-slate-500">
                        {section.internalOnly
                          ? "Internal QA"
                          : disabled
                            ? "Limited route"
                            : "Open module"}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {reconSection ? (
        <section className="rounded-[1.6rem] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_34%),rgba(16,185,129,0.055)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
                Featured live module
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Recon Hub is the current sellable preview.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Start here to show a buyer or agency the product value: hot leads,
                owner/direct, price drops, listing truth, refresh inflation, and
                contactable opportunity cards.
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

      <section className="rounded-[1.6rem] border border-white/[0.08] bg-slate-950/45 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <h2 className="text-base font-black text-white">
          Country-specific caveats
        </h2>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {country.caveats.map((caveat) => (
            <div
              key={caveat}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm leading-6 text-slate-400"
            >
              {caveat}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}