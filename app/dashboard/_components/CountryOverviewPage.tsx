// app/dashboard/_components/CountryOverviewPage.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Database,
  Globe2,
  MapPinned,
  Radar,
  RefreshCcw,
  ShieldCheck,
  TrendingDown,
  UserCheck,
  Zap,
} from "lucide-react";
import {
  getCountrySections,
  type CountryConfig,
} from "@/lib/countries/countryConfig";

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

// ─── Module data ──────────────────────────────────────────────────────────────
const MODULE_STATS: Record<string, string> = {
  recon:                 "Live",
  "owner-direct":        "36K",
  "price-drops":         "19K",
  "listing-age":         "200K",
  "market-intelligence": "4.5K",
  "inventory-pressure":  "927",
  "market-dominance":    "5K",
  "agency-profiles":     "7K",
  "activity-feed":       "76K",
  buildings:             "5K",
  communities:           "4.5K",
  "data-quality":        "Admin",
};

function moduleIcon(slug: string, internalOnly?: boolean): React.ReactNode {
  const cls = "h-4 w-4";
  if (internalOnly)                    return <Database className={cls} />;
  if (slug === "recon")                return <Radar className={cls} />;
  if (slug === "owner-direct")         return <UserCheck className={cls} />;
  if (slug === "price-drops")          return <TrendingDown className={cls} />;
  if (slug === "listing-age")          return <RefreshCcw className={cls} />;
  if (slug === "market-intelligence")  return <Zap className={cls} />;
  if (slug === "inventory-pressure")   return <Activity className={cls} />;
  if (slug === "market-dominance")     return <BarChart3 className={cls} />;
  if (slug === "agency-profiles")      return <ShieldCheck className={cls} />;
  if (slug === "activity-feed")        return <Globe2 className={cls} />;
  if (slug === "buildings")            return <Building2 className={cls} />;
  if (slug === "communities")          return <MapPinned className={cls} />;
  return <Zap className={cls} />;
}

type ModuleStatus = {
  label:  string;
  color:  string;
  bg:     string;
  border: string;
};

function moduleStatus(
  slug: string,
  internalOnly?: boolean,
  disabledReason?: string
): ModuleStatus {
  if (internalOnly) {
    return { label: "Internal", color: C.t4, bg: "rgba(255,255,255,0.03)", border: C.borderFt };
  }
  if (disabledReason) {
    return { label: "Limited", color: C.am, bg: C.amBg, border: C.amBdr };
  }
  if (slug === "recon") {
    return { label: "Live", color: C.emHi, bg: C.emBg, border: C.emBdr };
  }
  return { label: "Ready", color: C.t2, bg: C.wellBg, border: C.border };
}

// ─── Small primitives ─────────────────────────────────────────────────────────
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

function StatusBadge({ status }: { status: ModuleStatus }) {
  return (
    <span
      className="text-[9px] font-semibold uppercase tracking-[0.1em] rounded-md px-2 py-[3px]"
      style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
    >
      {status.label}
    </span>
  );
}

// ─── Module card ──────────────────────────────────────────────────────────────
function ModuleCard({
  section,
  countryRouteBase,
}: {
  section: ReturnType<typeof getCountrySections>[number];
  countryRouteBase: string;
}) {
  const status   = moduleStatus(section.slug, section.internalOnly, section.disabledReason);
  const stat     = MODULE_STATS[section.slug] ?? "Ready";
  const isRecon  = section.slug === "recon";
  const isLimited = !!section.disabledReason;
  const isAdmin   = !!section.internalOnly;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.14 }}>
      <Link
        href={`${countryRouteBase}/${section.slug}`}
        className="group relative flex flex-col rounded-2xl border p-4 transition-colors duration-200"
        style={{
          minHeight: 180,
          background: isRecon
            ? C.emBg
            : isLimited
            ? C.amBg
            : C.cardBg,
          borderColor: isRecon
            ? C.emBdr
            : isLimited
            ? C.amBdr
            : C.border,
          boxShadow: "0 2px 10px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Hover tint */}
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(255,255,255,0.018)" }}
        />

        <div className="relative flex h-full flex-col">
          {/* Header */}
          <div className="mb-3.5 flex items-start justify-between gap-2">
            {/* Icon */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
              style={{
                background:  isRecon ? "rgba(16,185,129,0.12)" : isLimited ? C.amBg : C.wellBg,
                borderColor: isRecon ? C.emBdr : isLimited ? C.amBdr : C.border,
                color:       isRecon ? C.emHi  : isLimited ? C.am    : C.t2,
              }}
            >
              {moduleIcon(section.slug, section.internalOnly)}
            </div>

            {/* Status + stat column */}
            <div className="flex flex-col items-end gap-1.5">
              <StatusBadge status={status} />
              {!isAdmin && (
                <span
                  className="text-xl font-bold tabular-nums"
                  style={{ color: isLimited ? C.am : C.t1, letterSpacing: "-0.03em" }}
                >
                  {stat}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-[14px] font-semibold leading-snug"
            style={{ color: isLimited ? C.am : isAdmin ? C.t4 : C.t1 }}
          >
            {section.label}
          </h3>

          {/* Body */}
          <p
            className="mt-1.5 text-[12px] leading-[1.55] line-clamp-3 flex-1"
            style={{ color: isAdmin ? C.t4 : C.t3 }}
          >
            {isLimited ? section.disabledReason : section.description}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-4">
            <span
              className="text-[11px] font-medium"
              style={{ color: isAdmin ? C.t4 : isLimited ? C.am : C.t3 }}
            >
              {isAdmin ? "Internal QA" : isLimited ? "Limited route" : "Open module"}
            </span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: isRecon ? C.emHi : C.t4 }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
type CountryOverviewPageProps = { country: CountryConfig };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CountryOverviewPage({ country }: CountryOverviewPageProps) {
  const sections        = getCountrySections(country);
  const reconSection    = sections.find((s) => s.slug === "recon");
  const publicSections  = sections.filter((s) => !s.internalOnly);
  const internalSections = sections.filter((s) => s.internalOnly);
  const isUae           = country.slug === "uae";

  return (
    <div className="space-y-4">

      {/* ── Country hero ────────────────────────────────────────────────── */}
      <section
        className="rounded-2xl border"
        style={{
          background:  C.deepBg,
          borderColor: C.border,
          boxShadow:   "0 2px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
          {/* Copy block */}
          <div className="p-6 sm:p-8">
            {/* Chips */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full px-3 py-1"
                style={{ color: C.emHi, background: C.emBg, border: `1px solid ${C.emBdr}` }}
              >
                <span className="inline-block w-[5px] h-[5px] rounded-full bg-emerald-400 animate-pulse" />
                {isUae ? "UAE Market OS" : "KSA Market OS"}
              </span>
              {[`Currency: ${country.currency}`, "Local export mode"].map((chip) => (
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
              className="text-[28px] font-bold leading-[1.18] sm:text-[36px]"
              style={{ color: C.t1, letterSpacing: "-0.03em" }}
            >
              {country.fullName}
              <br />
              <span style={{ color: C.t3 }}>Intelligence platform.</span>
            </h1>

            <p
              className="mt-4 max-w-2xl text-[13px] leading-[1.7]"
              style={{ color: C.t2 }}
            >
              {country.productPositioning}
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`${country.routeBase}/recon`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
                style={{ background: C.em, boxShadow: "0 4px 16px rgba(16,185,129,0.22)" }}
              >
                Open Recon Hub
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`${country.routeBase}/market-intelligence`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all hover:opacity-75"
                style={{ color: C.t2, background: C.wellBg, border: `1px solid ${C.border}` }}
              >
                Market Intelligence
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: platform bullets */}
          <div
            className="p-5 sm:p-6 lg:w-[280px] lg:border-l lg:self-stretch flex flex-col justify-center"
            style={{ borderColor: C.border }}
          >
            <Label>Platform</Label>
            <div className="mt-3 space-y-2">
              {[
                "Country-aware routing",
                "Product-safe table mapping",
                "Modules 0–5 intelligence",
                isUae ? "Building intelligence enabled" : "City / district first",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
                  style={{ background: C.wellBg, borderColor: C.border }}
                >
                  <span
                    className="inline-block w-[5px] h-[5px] rounded-full shrink-0"
                    style={{ background: C.em }}
                  />
                  <span className="text-[12px] font-medium" style={{ color: C.t2 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Status row ──────────────────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            eyebrow:  "Product family",
            value:    "Modules 0–5",
            sub:      "Unified lead, listing, pressure, dominance, and activity intelligence.",
            em:       true,
          },
          {
            eyebrow:  "Country",
            value:    country.label,
            sub:      `${country.currency} · Routes, caveats, and table mappings for ${country.fullName}.`,
            em:       false,
          },
          {
            eyebrow:  "Live module",
            value:    "Recon",
            sub:      "The first sellable local-data module with tabs, filters, and cards.",
            em:       false,
          },
          {
            eyebrow:  "Pages",
            value:    `${publicSections.length}+`,
            sub:      `${publicSections.length} public product pages · ${internalSections.length} internal QA.`,
            em:       false,
          },
        ].map(({ eyebrow, value, sub, em }) => (
          <div
            key={eyebrow}
            className="rounded-2xl border p-5"
            style={{
              ...CARD_BASE,
              background:  em ? C.emBg    : C.cardBg,
              borderColor: em ? C.emBdr   : C.border,
            }}
          >
            <Label em={em}>{eyebrow}</Label>
            <p
              className="mt-2 text-2xl font-bold tabular-nums"
              style={{ color: C.t1, letterSpacing: "-0.03em" }}
            >
              {value}
            </p>
            <p className="mt-1 text-[12px] leading-[1.55]" style={{ color: C.t3 }}>
              {sub}
            </p>
          </div>
        ))}
      </section>

      {/* ── Module grid ────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border p-5" style={CARD_BASE}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Label>{country.label} intelligence modules</Label>
            <h2
              className="mt-1 text-[18px] font-bold"
              style={{ color: C.t1, letterSpacing: "-0.02em" }}
            >
              {country.label} module grid
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: C.t3 }}>
              Country-specific product pages wired to real local data exports.
            </p>
          </div>
          <span
            className="shrink-0 text-[10px] font-medium rounded-full px-3 py-1"
            style={{ color: C.t3, background: C.wellBg, border: `1px solid ${C.border}` }}
          >
            {publicSections.length} public · {internalSections.length} internal
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {sections.map((section) => (
            <ModuleCard
              key={section.slug}
              section={section}
              countryRouteBase={country.routeBase}
            />
          ))}
        </div>
      </section>

      {/* ── Featured Recon card ─────────────────────────────────────────────── */}
      {reconSection && (
        <section
          className="rounded-2xl border p-6"
          style={{
            background:  C.emBg,
            borderColor: C.emBdr,
            boxShadow:   "0 2px 14px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Label em>Best place to start</Label>
              <h2
                className="mt-1.5 text-[20px] font-bold"
                style={{ color: C.t1, letterSpacing: "-0.025em" }}
              >
                Recon Hub is the flagship module.
              </h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-[1.65]" style={{ color: C.t2 }}>
                Start here to demonstrate product value: ranked hot leads, owner/direct
                signals, price drops, listing-age truth, and refresh-inflation data —
                all derived from local public-listing exports.
              </p>
            </div>
            <Link
              href={`${country.routeBase}/${reconSection.slug}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: C.em, boxShadow: "0 4px 16px rgba(16,185,129,0.24)" }}
            >
              Open Recon Hub
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Country caveats ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl border p-5" style={CARD_BASE}>
        <div className="mb-4">
          <Label>Data &amp; product notes</Label>
          <h2
            className="mt-1 text-[15px] font-semibold"
            style={{ color: C.t1, letterSpacing: "-0.015em" }}
          >
            {country.label} operating caveats
          </h2>
        </div>

        <div className="grid gap-2.5 lg:grid-cols-2">
          {country.caveats.map((caveat, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{ background: C.wellBg, borderColor: C.border }}
            >
              <span
                className="mt-[3px] inline-block w-[5px] h-[5px] rounded-full shrink-0"
                style={{ background: C.t4 }}
              />
              <p className="text-[12px] leading-[1.6]" style={{ color: C.t3 }}>
                {caveat}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
