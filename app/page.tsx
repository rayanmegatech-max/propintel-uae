"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  Database,
  Factory,
  Globe2,
  LineChart,
  Lock,
  MapPinned,
  Radar,
  RefreshCcw,
  Sparkles,
  TrendingDown,
  UserCheck,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const PRODUCT_MODULES = [
  {
    icon: Radar,
    title: "Recon Hub",
    description:
      "A daily command center for high-priority public listing opportunities across UAE and KSA.",
  },
  {
    icon: UserCheck,
    title: "Owner / Direct Radar",
    description:
      "Detect owner-like, direct, no-commission, URL-lead, and contactable opportunity signals.",
  },
  {
    icon: TrendingDown,
    title: "Price Drop Radar",
    description:
      "Track frontend-safe price movements from cleaned product tables, not raw evidence feeds.",
  },
  {
    icon: RefreshCcw,
    title: "Listing Truth",
    description:
      "Understand true listing age, old inventory, refresh signals, and stale opportunity patterns.",
  },
  {
    icon: BarChart3,
    title: "Market Dominance",
    description:
      "Measure visible public listing share, concentrated markets, and agency presence by location.",
  },
  {
    icon: Activity,
    title: "Supply Pressure",
    description:
      "Spot pressure signals across markets, communities, districts, buildings, and listing categories.",
  },
  {
    icon: Factory,
    title: "Agency Inventory Profile",
    description:
      "Analyze public agency portfolios, footprint, category mix, portal mix, and pressure exposure.",
  },
  {
    icon: LineChart,
    title: "Market Activity Feed",
    description:
      "A balanced feed of recon opportunities, price movement, pressure, dominance, and agency signals.",
  },
];

const COUNTRIES = [
  {
    label: "UAE",
    fullName: "United Arab Emirates",
    currency: "AED",
    href: "/dashboard/uae",
    icon: Building2,
    bullets: [
      "Recon Hub dashboard tables",
      "Module 5 building and community intelligence",
      "AED pricing and source-category filters",
    ],
  },
  {
    label: "KSA",
    fullName: "Kingdom of Saudi Arabia",
    currency: "SAR",
    href: "/dashboard/ksa",
    icon: MapPinned,
    bullets: [
      "KSA dashboard-ready product tables",
      "City, district, agency, and activity intelligence",
      "SAR pricing and URL-lead support",
    ],
  },
];

const SAFE_RULES = [
  "Uses product-safe dashboard tables first",
  "Keeps raw price-history evidence internal",
  "Separates UAE AED data from KSA SAR data",
  "Built for publish/sync to hosted database later",
];

function LogoMark({ uid }: { uid: string }) {
  const gid = `landing-logo-${uid}`;

  return (
    <svg width="210" height="40" viewBox="0 0 210 40" fill="none">
      <defs>
        <linearGradient
          id={gid}
          x1="0"
          y1="0"
          x2="0"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      <g>
        <rect x="2" y="24" width="5" height="12" rx="1" fill={`url(#${gid})`} />
        <rect x="10" y="16" width="5" height="20" rx="1" fill={`url(#${gid})`} />
        <path d="M18 36V6L21 0L24 6V36H18Z" fill={`url(#${gid})`} />
      </g>

      <text
        x="36"
        y="28"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        <tspan fill="#ffffff">PropIntel</tspan>
        <tspan fill="#14b8a6" fontWeight="400">
          {" "}
          GCC
        </tspan>
      </text>
    </svg>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl",
        "shadow-2xl shadow-black/20",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
      {children}
    </div>
  );
}

function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-slate-950/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="PropIntel GCC home" className="shrink-0">
          <LogoMark uid="nav" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#platform"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Platform
          </a>
          <a
            href="#countries"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Countries
          </a>
          <a
            href="#modules"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Modules
          </a>
          <a
            href="#architecture"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Architecture
          </a>
        </nav>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/40"
        >
          Open Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

function HeroMockup() {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
        <div className="ml-auto text-[11px] font-medium text-slate-500">
          GCC Market Command Center
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Today&apos;s Intelligence
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              UAE + KSA Opportunity Feed
            </h3>
          </div>

          <div className="flex rounded-xl border border-white/[0.08] bg-slate-950/60 p-1">
            <span className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              UAE
            </span>
            <span className="px-3 py-1.5 text-xs font-semibold text-slate-500">
              KSA
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Recon opportunities", "39.8k+", "KSA module-ready"],
            ["UAE active listings", "2.0M+", "Unified foundation"],
            ["Activity signals", "76k+", "UAE feed layer"],
          ].map(([label, value, sub]) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {[
            {
              tag: "Price Movement",
              title: "Large listed price change detected",
              meta: "Product-safe table · verify current advertised price",
            },
            {
              tag: "Owner / Direct",
              title: "URL-lead opportunity with direct-style signal",
              meta: "Source URL path · contactability varies by portal",
            },
            {
              tag: "Pressure Signal",
              title: "Inventory pressure rising in a visible market",
              meta: "Dashboard-ready market pressure view",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-white/[0.08] bg-slate-950/50 p-4 transition hover:border-emerald-400/30 hover:bg-slate-900/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {item.tag}
                  </span>
                  <h4 className="mt-3 text-sm font-semibold text-white">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
                </div>

                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-emerald-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <LandingNav />

      <section className="relative flex min-h-screen items-center pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-32 top-28 h-[560px] w-[560px] rounded-full bg-emerald-500/20 blur-[140px]"
          />
          <motion.div
            animate={{ scale: [1.15, 1, 1.15], opacity: [0.18, 0.35, 0.18] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-32 bottom-20 h-[520px] w-[520px] rounded-full bg-teal-500/20 blur-[130px]"
          />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp}>
              <SectionPill>
                <Sparkles className="h-3.5 w-3.5" />
                AI-powered GCC real estate intelligence
              </SectionPill>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Stop browsing portals.
              <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Start reading the market.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg"
            >
              PropIntel GCC turns public UAE and KSA listing activity into
              opportunity intelligence for agents, agencies, investors, and market
              operators. Track owner/direct signals, price movements, listing
              truth, pressure, dominance, agency footprint, and activity feeds in
              one country-aware SaaS dashboard.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 transition hover:shadow-emerald-500/45"
              >
                Open GCC Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/uae"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.05] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
              >
                View UAE
                <Building2 className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/ksa"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.05] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
              >
                View KSA
                <MapPinned className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {["UAE", "KSA", "AED/SAR", "Modules 0–5"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-slate-300"
                >
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 42 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute inset-8 rounded-3xl bg-emerald-400/10 blur-3xl" />
            <HeroMockup />
          </motion.div>
        </div>
      </section>

      <section id="platform" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionPill>
              <Globe2 className="h-3.5 w-3.5" />
              Not a portal clone
            </SectionPill>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Built for market intelligence, not property search.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-400">
              Portals help buyers browse listings. PropIntel helps professionals
              understand public listing behavior: what moved, where pressure is
              building, which agencies dominate visible inventory, and which
              opportunities deserve action.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {[
              ["Opportunity discovery", "Find actionable public listing signals."],
              ["Listing truth", "Expose age, refresh, and stale inventory patterns."],
              ["Market pressure", "Track pressure by market, city, district, community, or building."],
              ["Agency intelligence", "Understand public agency inventory footprint and activity."],
            ].map(([title, description]) => (
              <GlassCard key={title} className="p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section id="countries" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionPill>
                <MapPinned className="h-3.5 w-3.5" />
                Country-aware platform
              </SectionPill>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                One product family. Two launch markets.
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-400">
              UAE and KSA share the same intelligence philosophy, but each country
              has its own currency, backend tables, caveats, and data quality rules.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {COUNTRIES.map((country) => {
              const Icon = country.icon;

              return (
                <Link
                  key={country.label}
                  href={country.href}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl transition hover:border-emerald-400/30 hover:bg-white/[0.06]"
                >
                  <div className="p-6">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-300">
                        {country.currency}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      {country.label}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {country.fullName}
                    </p>

                    <div className="mt-5 space-y-3">
                      {country.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                          <p className="text-sm leading-6 text-slate-400">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                      Open {country.label} dashboard
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="modules" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionPill>
              <Radar className="h-3.5 w-3.5" />
              Modules 0–5
            </SectionPill>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              A launch product built on real backend intelligence departments.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-400">
              The frontend is now aligned with the finished UAE and KSA backend
              modules: unified active listings, owner/direct signals, price
              movement, listing truth, Recon Hub, market dominance, inventory
              pressure, agency profiles, and activity feeds.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PRODUCT_MODULES.map((module) => {
              const Icon = module.icon;

              return (
                <GlassCard
                  key={module.title}
                  className="p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-white/[0.06]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {module.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <section id="architecture" className="relative py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionPill>
              <Database className="h-3.5 w-3.5" />
              Production architecture
            </SectionPill>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Local intelligence engine. Hosted SaaS dashboard.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-400">
              The heavy backend stays local for scraping, normalization, dedup,
              and feature generation. The web app is designed for a future
              publish/sync step into hosted storage or database infrastructure.
            </p>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/40"
            >
              Enter dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <GlassCard className="p-6">
            <div className="space-y-4">
              {[
                ["1", "Local pipelines", "Scrapers and feature engines generate UAE and KSA intelligence databases."],
                ["2", "Product-safe export", "Only approved dashboard-ready tables move toward the frontend data layer."],
                ["3", "Hosted serving layer", "Supabase/PostgreSQL or storage will serve the production web app later."],
                ["4", "Next.js SaaS UI", "Vercel hosts the country-aware GCC intelligence dashboard."],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex gap-4 rounded-2xl border border-white/[0.08] bg-slate-950/50 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm font-bold text-emerald-300">
                    {number}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-teal-400/5 p-8 text-center backdrop-blur-xl sm:p-12">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <Lock className="h-6 w-6" />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Built on data discipline before sales polish.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-400">
            Raw evidence stays internal. Product pages use cleaned, dashboard-ready
            tables. UAE and KSA stay separated by country config. This is how the
            platform becomes reliable enough to sell.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SAFE_RULES.map((rule) => (
              <div
                key={rule}
                className="rounded-xl border border-white/[0.08] bg-slate-950/40 px-4 py-3 text-sm font-medium text-slate-300"
              >
                {rule}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <LogoMark uid="footer" />
          <p className="text-sm text-slate-500">
            © 2026 PropIntel GCC. Public listing intelligence for UAE and KSA.
          </p>
        </div>
      </footer>
    </main>
  );
}

