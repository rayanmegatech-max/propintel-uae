import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Database,
  Globe2,
  MapPinned,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { COUNTRY_LIST } from "@/lib/countries/countryConfig";

function PlatformStatCard({
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

function CountryCard({
  country,
}: {
  country: (typeof COUNTRY_LIST)[number];
}) {
  const isUae = country.slug === "uae";

  return (
    <Link
      href={country.routeBase}
      className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_34%),rgba(255,255,255,0.04)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-emerald-400/35 hover:bg-white/[0.06]"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl transition group-hover:bg-emerald-400/16" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            {isUae ? (
              <Building2 className="h-6 w-6" />
            ) : (
              <MapPinned className="h-6 w-6" />
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              {country.currency}
            </span>
            <ArrowRight className="h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
          </div>
        </div>

        <div className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
          {country.publishStatus}
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white">
          {country.label} Intelligence
        </h2>

        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
          {country.productPositioning}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              Active module
            </p>
            <p className="mt-1 text-sm font-bold text-white">Recon Hub</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Real local export preview.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              Scope
            </p>
            <p className="mt-1 text-sm font-bold text-white">Country-aware</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Routes, currency, modules.
            </p>
          </div>
        </div>

        <div className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(16,185,129,0.22)] transition group-hover:bg-emerald-400">
          Enter {country.label} dashboard
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
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
                GCC Real Estate Intelligence SaaS
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                UAE + KSA launch workspace
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Frontend-first build
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              The GCC command center for real estate market intelligence.
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              PropIntel GCC is being shaped into a unified intelligence SaaS for
              UAE and KSA — not a portal clone. The platform is built around
              opportunities, owner/direct signals, price movement, listing truth,
              inventory pressure, market dominance, agency footprint, building and
              community intelligence, and activity signals.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/dashboard/uae"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(16,185,129,0.22)] transition hover:bg-emerald-400"
              >
                Open UAE
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/ksa"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Open KSA
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.7rem] border border-emerald-400/20 bg-emerald-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <Radar className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-emerald-50">
                  Recon Hub is now the first live module pattern
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                  Both countries now have real-data Recon pages using local JSON
                  exports, normalized cards, clickable tabs, search, filters, and
                  product-safe dashboard tables.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                "UAE Recon tabs + filters",
                "KSA Recon tabs + filters",
                "Shared opportunity card system",
                "Frontend-first before Supabase/auth/billing",
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
        <PlatformStatCard
          label="Countries"
          value="UAE + KSA"
          description="Two launch markets under one country-aware GCC product architecture."
          tone="emerald"
        />
        <PlatformStatCard
          label="Active module"
          value="Recon Hub"
          description="Real local-export data with tabs, filters, and normalized opportunity cards."
          tone="cyan"
        />
        <PlatformStatCard
          label="Product family"
          value="Modules 0–5"
          description="Owner/direct, price movement, listing truth, Recon Hub, market dominance, and inventory velocity."
          tone="amber"
        />
        <PlatformStatCard
          label="Backend mode"
          value="Local engine"
          description="Heavy SQLite pipelines remain local until hosted sync is designed later."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {COUNTRY_LIST.map((country) => (
          <CountryCard key={country.slug} country={country} />
        ))}
      </section>

      <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Platform architecture principles
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              The app is being built as a real intelligence SaaS, not a collection
              of disconnected mock pages.
            </p>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Production-minded frontend phase
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-slate-950/50 p-4">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Local backend remains the engine
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              UAE and KSA scrapers, dedup, and feature engines remain local heavy
              pipelines. The frontend consumes product-safe exported datasets in
              this phase.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-950/50 p-4">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Product-safe tables first
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Country pages are designed around dashboard-ready and frontend-safe
              tables. Raw evidence tables and diagnostic internals stay hidden.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-950/50 p-4">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              One GCC interface
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              UAE uses AED and UAE table names. KSA uses SAR and KSA table names.
              Both countries share one product family and one SaaS interface.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
