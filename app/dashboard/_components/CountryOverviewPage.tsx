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
  DollarSign,
  Filter,
  Globe2,
  Info,
  MapPinned,
  Radar,
  RefreshCcw,
  Shield,
  ShieldCheck,
  TrendingDown,
  UserCheck,
  Zap,
} from "lucide-react";
import {
  getCountrySections,
  type CountryConfig,
} from "@/lib/countries/countryConfig";

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  cardBg:   "#111113",
  wellBg:   "#18181b",
  deepBg:   "#0d0d0f",
  border:   "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",
  border6:  "rgba(255,255,255,0.06)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  t4: "#52525b",
  em:    "#10b981",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.07)",
  emBdr: "rgba(16,185,129,0.18)",
  am:    "#fbbf24",
  amBg:  "rgba(245,158,11,0.07)",
  amBdr: "rgba(245,158,11,0.15)",
  cy:    "#06b6d4",
  cyHi:  "#22d3ee",
  cyBg:  "rgba(34,211,238,0.07)",
  cyBdr: "rgba(34,211,238,0.16)",
  vi:    "#7c3aed",
  viHi:  "#a78bfa",
  viBg:  "rgba(139,92,246,0.06)",
  viBdr: "rgba(139,92,246,0.18)",
} as const;

const CARD_BASE = {
  background: C.cardBg,
  borderColor: C.border,
  boxShadow:  "0 2px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)",
} as const;

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
  return { label: "Available", color: C.t3, bg: C.wellBg, border: C.border };
}

// ─── Small primitives ──────────────────────────────────────────────────────
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

function DotPattern({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
      }}
    />
  );
}

// ─── Primary action card for Today's Command Center ───────────────────────
function PrimaryActionCard({
  slug,
  label,
  description,
  stat,
  icon,
  accentColor,
  accentBg,
  accentBorder,
  countryRouteBase,
}: {
  slug: string;
  label: string;
  description: string;
  stat: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  countryRouteBase: string;
}) {
  const statStyle =
    stat === "Live"
      ? { color: C.emHi, bg: C.emBg, border: C.emBdr }
      : stat === "Available"
        ? { color: C.t3, bg: C.wellBg, border: C.border }
        : stat === "Limited"
          ? { color: C.am, bg: C.amBg, border: C.amBdr }
          : { color: C.t4, bg: "rgba(255,255,255,0.03)", border: C.borderFt };

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.14 }}>
      <Link
        href={`${countryRouteBase}/${slug}`}
        className="group relative flex flex-col rounded-2xl border p-5 transition-colors duration-200"
        style={{
          background: accentBg,
          borderColor: accentBorder,
          boxShadow: "0 2px 10px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(255,255,255,0.02)" }}
        />
        <div className="relative flex h-full flex-col">
          <div className="mb-3 flex items-start justify-between">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
              style={{ background: "rgba(255,255,255,0.06)", borderColor: accentBorder, color: accentColor }}
            >
              {icon}
            </div>
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.1em] rounded-md px-2 py-[3px]"
              style={{ color: statStyle.color, background: statStyle.bg, border: `1px solid ${statStyle.border}` }}
            >
              {stat}
            </span>
          </div>
          <h3 className="text-[15px] font-semibold leading-snug mb-1" style={{ color: C.t1 }}>
            {label}
          </h3>
          <p className="text-[12px] leading-relaxed" style={{ color: C.t3 }}>
            {description}
          </p>
          <div className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] font-medium" style={{ color: accentColor }}>
            Open {label}
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Deeper intelligence card (larger visual with decorative pattern) ─────
function DeepIntelCard({
  slug,
  label,
  description,
  icon,
  accentColor,
  accentBorder,
  countryRouteBase,
}: {
  slug: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBorder: string;
  countryRouteBase: string;
}) {
  return (
    <Link
      href={`${countryRouteBase}/${slug}`}
      className="group relative flex flex-col rounded-2xl border p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/30"
      style={{
        background: C.cardBg,
        borderColor: accentBorder,
        boxShadow: "0 2px 10px rgba(0,0,0,0.22)",
      }}
    >
      <DotPattern opacity={0.04} />
      <div className="relative flex h-full flex-col">
        <div className="mb-4 flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: accentBorder, color: accentColor }}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-[16px] font-bold leading-tight" style={{ color: C.t1 }}>
              {label}
            </h3>
            <p className="text-[13px] leading-relaxed mt-1" style={{ color: C.t3 }}>
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-end gap-[2px] h-6 mt-3 opacity-50" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px]"
              style={{
                height: `${10 + (i % 3) * 5}px`,
                background: accentColor,
              }}
            />
          ))}
        </div>
        <div className="mt-auto flex items-center gap-1.5 pt-4 text-[12px] font-medium" style={{ color: accentColor }}>
          Explore {label}
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}

// ─── Caveat label helper ──────────────────────────────────────────────────
type CaveatMeta = { label: string; icon: React.ReactNode; tone: string };

function getCaveatMeta(caveat: string): CaveatMeta {
  const lower = caveat.toLowerCase();
  if (lower.includes("aed") || lower.includes("sar") || lower.includes("currency") || lower.includes("pricing")) {
    return { label: "Pricing Context", icon: <DollarSign className="h-4 w-4" />, tone: C.emHi };
  }
  if (lower.includes("dashboard-ready") || lower.includes("product tables") || lower.includes("dashboard tables") || lower.includes("recon_dashboard_") || lower.includes("module5_dashboard_")) {
    return { label: "Dashboard-Safe Tables", icon: <Database className="h-4 w-4" />, tone: C.cyHi };
  }
  if (lower.includes("raw") || lower.includes("expose") || lower.includes("events") || lower.includes("price_history") || lower.includes("suspicious") || lower.includes("do not expose")) {
    return { label: "Data Exposure Rule", icon: <Shield className="h-4 w-4" />, tone: C.am };
  }
  if (lower.includes("short-rental") || lower.includes("source-category") || lower.includes("filter")) {
    return { label: "Source Mix", icon: <Filter className="h-4 w-4" />, tone: C.viHi };
  }
  if (lower.includes("commercial") || lower.includes("land") || lower.includes("dedup") || lower.includes("residential")) {
    return { label: "Dedup Quality", icon: <Building2 className="h-4 w-4" />, tone: C.t2 };
  }
  if (lower.includes("ksa") || lower.includes("city") || lower.includes("district") || lower.includes("location")) {
    return { label: "Location Mapping", icon: <MapPinned className="h-4 w-4" />, tone: C.t2 };
  }
  return { label: "Operating Note", icon: <Info className="h-4 w-4" />, tone: C.t3 };
}

// ─── Props ─────────────────────────────────────────────────────────────────
type CountryOverviewPageProps = { country: CountryConfig };

// ─── Page ─────────────────────────────────────────────────────────────────
export default function CountryOverviewPage({ country }: CountryOverviewPageProps) {
  const sections        = getCountrySections(country);
  const isUae           = country.slug === "uae";

  const publicSections  = sections.filter((s) => !s.internalOnly);
  const internalSections = sections.filter((s) => s.internalOnly);

  // Today's primary actions: 5 key modules
  const primarySlugs = ["recon", "owner-direct", "price-drops", "listing-age", "activity-feed"];
  const primarySections = publicSections.filter(s => primarySlugs.includes(s.slug));

  // Deeper intelligence modules
  const deeperSlugs = ["inventory-pressure", "market-dominance", "agency-profiles", "communities", "buildings"];
  const deeperSections = publicSections.filter(s => deeperSlugs.includes(s.slug));

  // Accent colors per slug
  const slugAccent = (slug: string) => {
    if (slug === "recon") return { color: C.emHi, bg: C.emBg, border: C.emBdr };
    if (slug === "owner-direct") return { color: C.cyHi, bg: C.cyBg, border: C.cyBdr };
    if (slug === "price-drops") return { color: "#fb7185", bg: "rgba(244,63,94,0.05)", border: "rgba(244,63,94,0.12)" };
    if (slug === "listing-age") return { color: C.viHi, bg: C.viBg, border: C.viBdr };
    if (slug === "activity-feed") return { color: C.cyHi, bg: C.cyBg, border: C.cyBdr };
    if (slug === "inventory-pressure") return { color: C.am, bg: C.amBg, border: C.amBdr };
    if (slug === "market-dominance") return { color: C.emHi, bg: C.emBg, border: C.emBdr };
    if (slug === "agency-profiles") return { color: C.t3, bg: C.wellBg, border: C.border };
    if (slug === "communities") return { color: C.t2, bg: C.wellBg, border: C.border };
    if (slug === "buildings") return { color: C.t2, bg: C.wellBg, border: C.border };
    return { color: C.am, bg: C.amBg, border: C.amBdr };
  };

  return (
    <div className="space-y-5">
      {/* ── Country hero / command center ────────────────────────────────── */}
      <section
        className="relative rounded-2xl border overflow-hidden"
        style={{
          background:  C.deepBg,
          borderColor: C.border,
          boxShadow:   "0 2px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 60%, rgba(16,185,129,0.12) 0%, transparent 50%)`,
          }}
        />
        <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
          <div className="relative p-6 sm:p-8">
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

            <h1
              className="text-[28px] font-bold leading-[1.18] sm:text-[36px]"
              style={{ color: C.t1, letterSpacing: "-0.03em" }}
            >
              {country.fullName}
              <br />
              <span style={{ color: C.t3 }}>Intelligence Platform</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[13px] leading-[1.7]" style={{ color: C.t2 }}>
              {country.productPositioning}
            </p>

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
                Explore Market Intelligence
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div
            className="p-5 sm:p-6 lg:w-[280px] lg:border-l lg:self-stretch flex flex-col justify-center"
            style={{ borderColor: C.border }}
          >
            <Label em>Workspace intelligence</Label>
            <div className="mt-3 space-y-2">
              {[
                "Country-aware routing",
                "Product-safe table mapping",
                "Modules 0–5 intelligence",
                isUae ? "Building intelligence enabled" : "City / district first",
                "Local export bridge",
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

      {/* ── Today's Command Center ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4" style={{ color: C.emHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.1em]" style={{ color: C.t2 }}>
            Today&rsquo;s Command Center
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {primarySections.map((section) => {
            const status = moduleStatus(section.slug, section.internalOnly, section.disabledReason).label;
            const acc = slugAccent(section.slug);
            return (
              <PrimaryActionCard
                key={section.slug}
                slug={section.slug}
                label={section.label}
                description={section.description}
                stat={status}
                icon={moduleIcon(section.slug, section.internalOnly)}
                accentColor={acc.color}
                accentBg={acc.bg}
                accentBorder={acc.border}
                countryRouteBase={country.routeBase}
              />
            );
          })}
        </div>
      </section>

      {/* ── Recommended Workflow ────────────────────────────────────────── */}
      <section className="rounded-2xl border p-6" style={{ ...CARD_BASE, background: C.deepBg }}>
        <div className="mb-5">
          <Label em>Recommended workflow</Label>
          <h2 className="mt-1 text-[16px] font-semibold" style={{ color: C.t1 }}>
            Start your daily review
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { step: "1", title: "Open Recon Hub", desc: "Start with ranked opportunity signals." },
            { step: "2", title: "Verify Signals", desc: "Check owner/direct, price movement, and freshness evidence." },
            { step: "3", title: "Analyze Market Context", desc: "Use activity, pressure, and market intelligence for broader movement." },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: C.emBg, color: C.emHi, border: `1px solid ${C.emBdr}` }}
              >
                {item.step}
              </span>
              <div>
                <h4 className="text-[15px] font-semibold" style={{ color: C.t1 }}>{item.title}</h4>
                <p className="text-[12px] mt-1" style={{ color: C.t4 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Deeper Intelligence Layers ──────────────────────────────────── */}
      {deeperSections.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4" style={{ color: C.t3 }} />
            <h2 className="text-[14px] font-bold uppercase tracking-[0.1em]" style={{ color: C.t2 }}>
              Deeper Intelligence Layers
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {deeperSections.map((section) => {
              const acc = slugAccent(section.slug);
              return (
                <DeepIntelCard
                  key={section.slug}
                  slug={section.slug}
                  label={section.label}
                  description={section.disabledReason || section.description}
                  icon={moduleIcon(section.slug, section.internalOnly)}
                  accentColor={acc.color}
                  accentBorder={acc.border}
                  countryRouteBase={country.routeBase}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── All Modules (compact) ──────────────────────────────────────── */}
      <section className="rounded-2xl border p-5" style={CARD_BASE}>
        <div className="mb-4">
          <Label>{country.label} intelligence modules</Label>
          <h2 className="mt-1 text-[15px] font-semibold" style={{ color: C.t1 }}>
            All {country.label} modules
          </h2>
          <p className="mt-1 text-[13px]" style={{ color: C.t3 }}>
            Country-specific product pages wired to real local data exports.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[...publicSections, ...internalSections].map((section) => {
            const status = moduleStatus(section.slug, section.internalOnly, section.disabledReason);
            const isLimited = !!section.disabledReason;
            const isAdmin = !!section.internalOnly;
            return (
              <Link
                key={section.slug}
                href={`${country.routeBase}/${section.slug}`}
                className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-white/[0.04]"
                style={{
                  background: isLimited ? C.amBg : isAdmin ? C.wellBg : C.cardBg,
                  borderColor: isLimited ? C.amBdr : isAdmin ? C.border6 : C.border,
                }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
                  {moduleIcon(section.slug, section.internalOnly)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold" style={{ color: isLimited ? C.am : isAdmin ? C.t4 : C.t1 }}>
                    {section.label}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: C.t4 }}>
                    {isLimited ? section.disabledReason : section.description}
                  </p>
                </div>
                <StatusBadge status={status} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Trust & Operating Notes ──────────────────────────────────────── */}
      <section className="rounded-2xl border p-5" style={CARD_BASE}>
        <div className="mb-5">
          <Label em>Trust &amp; Operating Notes</Label>
          <h2 className="mt-1 text-[16px] font-semibold" style={{ color: C.t1 }}>
            Country Data Readiness
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed max-w-2xl" style={{ color: C.t3 }}>
            Dashboard-safe intelligence built from local public-listing exports. 
            These notes explain how to interpret this country workspace before outreach or business decisions.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {country.caveats.map((caveat, i) => {
            const meta = getCaveatMeta(caveat);
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-white/[0.02]"
                style={{ background: C.wellBg, borderColor: C.border }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border6}`, color: meta.tone }}
                >
                  {meta.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] mb-1" style={{ color: meta.tone }}>
                    {meta.label}
                  </p>
                  <p className="text-[12px] leading-[1.55]" style={{ color: C.t3 }}>
                    {caveat}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust footer strip */}
        <div
          className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border px-4 py-3 text-[11px]"
          style={{ background: "rgba(255,255,255,0.015)", borderColor: C.borderFt, color: C.t4 }}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" style={{ color: C.emHi }} />
            Local export bridge
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="h-3 w-3" style={{ color: C.t4 }} />
            Product-safe views first
          </div>
          <div className="flex items-center gap-1.5">
            <Globe2 className="h-3 w-3" style={{ color: C.t4 }} />
            Verify source listing before outreach
          </div>
        </div>
      </section>
    </div>
  );
}