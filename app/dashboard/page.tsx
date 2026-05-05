import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Database,
  Globe2,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { COUNTRY_LIST } from "@/lib/countries/countryConfig";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Globe2 className="h-3.5 w-3.5" />
              GCC Real Estate Intelligence SaaS
            </div>

            <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-white sm:text-4xl">
              One intelligence platform for UAE and KSA real estate markets.
            </h1>

            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400 sm:text-base">
              PropIntel is being rebuilt as a unified GCC intelligence dashboard,
              not a portal clone. The product focuses on opportunity discovery,
              owner/direct signals, price movement, listing truth, market pressure,
              dominance, agency footprint, building/community intelligence, and
              daily activity signals.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {COUNTRY_LIST.map((country) => (
                <Link
                  key={country.slug}
                  href={country.routeBase}
                  className="group rounded-2xl border border-white/[0.08] bg-slate-950/50 p-5 transition hover:border-emerald-400/30 hover:bg-slate-900/70"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                      {country.slug === "uae" ? (
                        <Building2 className="h-6 w-6" />
                      ) : (
                        <MapPinned className="h-6 w-6" />
                      )}
                    </div>

                    <ArrowRight className="h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
                  </div>

                  <h2 className="text-xl font-bold text-white">
                    {country.label} Dashboard
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {country.productPositioning}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                      {country.currency}
                    </span>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                      {country.publishStatus}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Local backend remains the engine
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            UAE and KSA scrapers, dedup, and feature engines remain local heavy
            pipelines. The frontend will later consume product-safe published
            tables, not raw local SQLite directly in production.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Product-safe tables first
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Country pages are designed around dashboard-ready and frontend-safe
            tables. Raw evidence tables remain internal and should not be shown to
            paid users.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Globe2 className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Country-aware by design
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            UAE uses AED and UAE table names. KSA uses SAR and KSA table names.
            Both countries share one product family and one SaaS interface.
          </p>
        </div>
      </section>
    </div>
  );
}