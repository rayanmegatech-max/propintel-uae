// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Factory,
  MapPinned,
  ShieldCheck,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import { COUNTRY_LIST } from "@/lib/countries/countryConfig";

// ─── Design tokens (mirrors DashboardLayout) ──────────────────────────────────
const C = {
  cardBg:   "#111113",
  wellBg:   "#18181b",
  deepBg:   "#0d0d0f",
  border:   "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  em:    "#10b981",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.07)",
  emBdr: "rgba(16,185,129,0.18)",
  am:    "#fbbf24",
  amBg:  "rgba(245,158,11,0.07)",
  amBdr: "rgba(245,158,11,0.15)",
} as const;

const CARD_BASE = {
  background: C.cardBg,
  borderColor: C.border,
  boxShadow:  "0 2px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)",
} as const;

// ─── Static data ──────────────────────────────────────────────────────────────
const RECON_METRICS: {
  label: string;
  value: string;
  sub: string;
  variant: "em" | "am" | "neutral";
}[] = [
  { label: "Hot Leads",      value: "43K", sub: "Priority opportunities",  variant: "em"      },
  { label: "Price Drops",    value: "19K", sub: "Recent repricing signals", variant: "neutral" },
  { label: "Owner / Direct", value: "36K", sub: "Direct-style contacts",    variant: "neutral" },
  { label: "Stale + Drops",  value: "13K", sub: "Aged Supply Pressure",  variant: "am"      },
];

const PRODUCT_LAYERS: { label: string; icon: React.ElementType }[] = [
  { label: "Owner / Direct",     icon: UserCheck   },
  { label: "Price Drops",        icon: TrendingDown },
  { label: "Listing Truth",      icon: ShieldCheck  },
  { label: "Supply Pressure", icon: Activity     },
  { label: "Market Dominance",   icon: BarChart3    },
  { label: "Agency Footprint",   icon: Factory      },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function Label({ children, em }: { children: React.ReactNode; em?: boolean }) {
  return (
    <span
      className="text-[9px] font-semibold uppercase tracking-[0.14em]"
      style={{ color: em ? C.emHi : C.t3 }}
    >
      {children}
    </span>
  );
}

function ReconMetric({
  label,
  value,
  sub,
  variant,
}: (typeof RECON_METRICS)[number]) {
  const isEm = variant === "em";
  const isAm = variant === "am";
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background:  isEm ? C.emBg  : isAm ? C.amBg  : C.wellBg,
        borderColor: isEm ? C.emBdr : isAm ? C.amBdr : C.border,
      }}
    >
      <Label em={isEm}>{label}</Label>
      <p
        className="mt-2 text-2xl font-bold tabular-nums"
        style={{ color: C.t1, letterSpacing: "-0.03em" }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px]" style={{ color: C.t4 }}>
        {sub}
      </p>
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
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
      <Link
        href={country.routeBase}
        className="group relative block rounded-2xl border p-5 transition-colors duration-200"
        style={CARD_BASE}
      >
        {/* hover tint */}
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(255,255,255,0.018)" }}
        />

        <div className="relative">
          {/* Top row */}
          <div className="mb-4 flex items-start justify-between">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl border"
              style={{ background: C.emBg, borderColor: C.emBdr, color: C.emHi }}
            >
              {isUae
                ? <Building2 className="h-4 w-4" />
                : <MapPinned className="h-4 w-4" />}
            </div>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: C.t4 }}
            />
          </div>

          {/* Eye-brow + title */}
          <Label em>{isUae ? "Primary market" : "Second market"}</Label>
          <h2
            className="mt-1.5 text-xl font-bold"
            style={{ color: C.t1, letterSpacing: "-0.025em" }}
          >
            {country.label} Intelligence
          </h2>
          <p
            className="mt-2 text-[13px] leading-[1.55] line-clamp-2"
            style={{ color: C.t2 }}
          >
            {country.productPositioning}
          </p>

          {/* Footer chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {[country.currency, "Modules 0–5"].map((chip) => (
              <span
                key={chip}
                className="text-[11px] font-medium rounded-lg px-2.5 py-1"
                style={{ background: C.wellBg, color: C.t2, border: `1px solid ${C.border}` }}
              >
                {chip}
              </span>
            ))}
            <span
              className="ml-auto text-[11px] font-medium rounded-lg px-2.5 py-1"
              style={{ background: C.emBg, color: C.emHi, border: `1px solid ${C.emBdr}` }}
            >
              {isUae ? "UAE ready" : "KSA ready"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="rounded-2xl border"
        style={{
          background:  C.deepBg,
          borderColor: C.border,
          boxShadow:   "0 2px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
          {/* Left: copy */}
          <div className="p-6 sm:p-8">
            {/* Chips */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full px-3 py-1"
                style={{ color: C.emHi, background: C.emBg, border: `1px solid ${C.emBdr}` }}
              >
                <span className="inline-block w-[5px] h-[5px] rounded-full bg-emerald-400 animate-pulse" />
                GCC Intelligence Platform
              </span>
              {["UAE + KSA", "Local preview"].map((chip) => (
                <span
                  key={chip}
                  className="text-[10px] font-medium rounded-full px-3 py-1"
                  style={{ color: C.t3, background: C.wellBg, border: `1px solid ${C.border}` }}
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Headline */}
            <h1
              className="text-[32px] font-bold leading-[1.15] tracking-tight sm:text-[40px]"
              style={{ color: C.t1, letterSpacing: "-0.033em" }}
            >
              Real estate intelligence
              <br />
              <span style={{ color: C.t3 }}>command center.</span>
            </h1>

            <p
              className="mt-4 max-w-xl text-[14px] leading-[1.7]"
              style={{ color: C.t2 }}
            >
              PropIntel GCC converts UAE and KSA listing pipelines into a premium
              operator terminal for opportunities, price movement, market pressure,
              and agency intelligence.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/uae"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity duration-150 hover:opacity-85"
                style={{ background: C.em, boxShadow: "0 4px 16px rgba(16,185,129,0.22)" }}
              >
                UAE Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/dashboard/ksa"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all duration-150 hover:opacity-75"
                style={{ color: C.t2, background: C.wellBg, border: `1px solid ${C.border}` }}
              >
                KSA Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Recon metrics */}
          <div
            className="grid grid-cols-2 gap-3 p-5 lg:border-l lg:content-start"
            style={{ borderColor: C.border }}
          >
            <div className="col-span-2 mb-1">
              <Label>Recon module · live stats</Label>
            </div>
            {RECON_METRICS.map((m) => (
              <ReconMetric key={m.label} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Country cards ──────────────────────────────────────────────────── */}
      <section className="grid gap-4 lg:grid-cols-2">
        {COUNTRY_LIST.map((country) => (
          <CountryCard key={country.slug} country={country} />
        ))}
      </section>

      {/* ── Product layers ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl border p-5" style={CARD_BASE}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Label>Intelligence layers</Label>
            <h2
              className="mt-1 text-[16px] font-bold"
              style={{ color: C.t1, letterSpacing: "-0.02em" }}
            >
              Product modules
            </h2>
          </div>
          <span
            className="text-[10px] font-medium rounded-full px-3 py-1"
            style={{ color: C.t3, background: C.wellBg, border: `1px solid ${C.border}` }}
          >
            6 modules
          </span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {PRODUCT_LAYERS.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border px-4 py-3"
              style={{ background: C.wellBg, borderColor: C.border }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: C.emBg, color: C.emHi, border: `1px solid ${C.emBdr}` }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-[13px] font-medium" style={{ color: C.t1 }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
