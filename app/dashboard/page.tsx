"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Sparkles,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import { COUNTRY_LIST } from "@/lib/countries/countryConfig";

const reconStats = [
  {
    label: "Hot Leads",
    value: "43K",
    description: "Priority opportunities",
    tone: "emerald",
  },
  {
    label: "Price Drops",
    value: "19K",
    description: "Recent movement",
    tone: "red",
  },
  {
    label: "Owner / Direct",
    value: "36K",
    description: "Direct-style signals",
    tone: "cyan",
  },
  {
    label: "Stale + Drops",
    value: "13K",
    description: "Aged repricing",
    tone: "amber",
  },
];

const platformHighlights = [
  "Real local JSON exports",
  "UAE + KSA country-aware routes",
  "Product-safe dashboard tables",
  "Frontend-first before Supabase/auth/billing",
];

function toneClasses(tone: string) {
  if (tone === "emerald") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  if (tone === "red") return "border-red-400/20 bg-red-400/10 text-red-200";
  if (tone === "cyan") return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
  if (tone === "amber") return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  return "border-white/[0.08] bg-white/[0.04] text-slate-300";
}

function MiniMetric({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4">
      <div
        className={[
          "mb-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
          toneClasses(tone),
        ].join(" ")}
      >
        {label}
      </div>
      <div className="text-3xl font-black tracking-[-0.05em] text-white">
        {value}
      </div>
      <div className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </div>
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
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.16 }}>
      <Link
        href={country.routeBase}
        className="group relative block overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-slate-950/50 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.20)] backdrop-blur-xl transition hover:border-emerald-400/30 hover:bg-slate-900/70"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-400/[0.08] blur-3xl transition group-hover:bg-emerald-400/[0.13]" />

        <div className="relative">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              {isUae ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <MapPinned className="h-5 w-5" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                {country.currency}
              </span>
              <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
            </div>
          </div>

          <div className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
            {isUae ? "Primary launch market" : "Second launch market"}
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            {country.label} Intelligence
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
            {country.productPositioning}
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Live family
              </div>
              <div className="mt-1 text-sm font-bold text-white">Modules 0–5</div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Status
              </div>
              <div className="mt-1 text-sm font-bold text-white">
                {isUae ? "UAE ready" : "KSA ready"}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),rgba(15,23,42,0.42)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/[0.08] blur-3xl" />

        <div className="relative grid gap-7 xl:grid-cols-[1fr_430px] xl:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
                  <Globe2 className="h-3.5 w-3.5" />
                  GCC Intelligence SaaS
                </span>

                <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  UAE + KSA
                </span>

                <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Local export bridge
                </span>
              </div>

              <h1 className="max-w-5xl text-4xl font-black tracking-[-0.06em] text-white sm:text-6xl">
                Real estate intelligence command center.
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                PropIntel GCC turns your UAE and KSA listing pipelines into a
                premium operator terminal for opportunities, price movement,
                listing truth, inventory pressure, dominance, agency footprint,
                and market activity.
              </p>
            </div>

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
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.055] px-5 py-3 text-sm font-black text-slate-200 transition hover:bg-white/[0.08]"
              >
                Open KSA
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <Radar className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-black text-emerald-50">
                  Recon module preview
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                  Real local-export dashboard stats from the first sellable
                  intelligence module pattern.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {reconStats.map((stat) => (
                <MiniMetric key={stat.label} {...stat} />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {COUNTRY_LIST.map((country) => (
          <CountryCard key={country.slug} country={country} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.6rem] border border-white/[0.08] bg-slate-950/45 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            Intelligence layers
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ["Owner / Direct", UserCheck],
              ["Price Drops", TrendingDown],
              ["Listing Truth", ShieldCheck],
              ["Pressure", BarChart3],
              ["Dominance", Radar],
              ["Agency Footprint", FactoryIcon],
            ].map(([label, Icon]) => {
              const IconComponent = Icon as React.ElementType;

              return (
                <div
                  key={label as string}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"
                >
                  <IconComponent className="mb-3 h-5 w-5 text-emerald-300" />
                  <div className="text-sm font-bold text-white">{label as string}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/[0.08] bg-slate-950/45 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
            <BadgeCheck className="h-3.5 w-3.5" />
            Build guardrails
          </div>

          <div className="space-y-3">
            {platformHighlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2"
              >
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                <span className="text-sm font-medium text-slate-200">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FactoryIcon(props: React.ComponentProps<typeof Database>) {
  return <Database {...props} />;
}