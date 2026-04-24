"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  BarChart3,
  Zap,
  Globe,
  Lock,
  Star,
  Check,
  ArrowRight,
  Play,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Calculator,
  Newspaper,
  Clock,
  UserPlus,
  DollarSign,
  Shield,
  Crosshair,
  Users,
  Building2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

type AccentColor = "emerald" | "teal" | "cyan";

interface Module {
  icon: React.ElementType;
  name: string;
  benefit: string;
  accent: AccentColor;
  wide: boolean;
  comingSoon?: boolean;
}

const MODULES: Module[] = [
  {
    icon: Calculator,
    name: "Smart Pricing Engine",
    benefit: "Price any listing within 2% of true market value in under 30 seconds, backed by live DLD comparables.",
    accent: "emerald",
    wide: true,
  },
  {
    icon: Newspaper,
    name: "Morning Market Brief",
    benefit: "Dubai, Abu Dhabi & Sharjah intel curated and in your inbox every day by 7AM.",
    accent: "teal",
    wide: false,
  },
  {
    icon: Clock,
    name: "True Listing Age",
    benefit: "Expose the real days-on-market hidden behind relisted and refreshed properties.",
    accent: "cyan",
    wide: false,
  },
  {
    icon: UserPlus,
    name: "FSBO Lead Magnet",
    benefit: "Intercept private sellers across Dubai and Abu Dhabi before your competition even knows they exist.",
    accent: "teal",
    wide: false,
  },
  {
    icon: DollarSign,
    name: "Investor Yield Engine",
    benefit: "Instant net yield, gross ROI, and cash-flow calc on any UAE property — fees and service charges included.",
    accent: "cyan",
    wide: false,
  },
  {
    icon: Shield,
    name: "Agent Trust Score",
    benefit: "Verified performance data on yourself and every competing agent — deal volume, ratings, and response time.",
    accent: "emerald",
    wide: false,
  },
  {
    icon: Users,
    name: "Agent Poaching Dossier",
    benefit: "Identify true top performers by deal velocity — not just listing volume. Recruiter-grade dossiers on every active agent.",
    accent: "cyan",
    wide: false,
    comingSoon: true,
  },
  {
    icon: Building2,
    name: "CoStar-UAE Commercial",
    benefit: "Structured cross-portal CRE intelligence: offices, warehouses, retail, land. PSF trends, absorption rates, and vacancy data.",
    accent: "emerald",
    wide: true,
    comingSoon: true,
  },
  {
    icon: BarChart3,
    name: "Developer Market Reports",
    benefit: "Track your project's agent distribution, pricing discipline, and secondary market velocity vs. direct competitors.",
    accent: "teal",
    wide: false,
    comingSoon: true,
  },
  {
    icon: Crosshair,
    name: "Rival Radar",
    benefit: "Live tracking of competitor listings, price cuts, and new mandates the moment they hit the market.",
    accent: "teal",
    wide: true,
  },
];

interface PricingTier {
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  highlight: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: { monthly: 49, annual: 39 },
    description: "For agents just getting started with data-driven selling.",
    features: [
      "Morning Market Brief",
      "True Listing Age",
      "Smart Pricing Engine (5 uses/mo)",
      "Basic Agent Profile",
      "Email support",
    ],
    notIncluded: [
      "FSBO Lead Magnet",
      "Investor Yield Engine",
      "Agent Trust Score",
      "Rival Radar",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: { monthly: 99, annual: 79 },
    description: "The full arsenal for high-performing UAE agents.",
    features: [
      "Everything in Starter",
      "Smart Pricing Engine (unlimited)",
      "FSBO Lead Magnet",
      "Investor Yield Engine",
      "Agent Trust Score",
      "Rival Radar",
      "Agent Poaching Dossier — Coming Q3 ✦",
      "CoStar-UAE Commercial read-only — Coming Q3 ✦",
      "Priority support",
    ],
    notIncluded: ["Team dashboard", "Custom branding", "API access"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Agency",
    price: { monthly: 249, annual: 199 },
    description: "For brokerages that want to dominate entire districts.",
    features: [
      "Everything in Pro",
      "Up to 10 agent seats",
      "Team performance dashboard",
      "Developer Market Reports — Coming Q3 ✦",
      "CoStar-UAE full access — Coming Q3 ✦",
      "Custom branding",
      "Dedicated account manager",
      "API access",
      "SLA guarantee",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Ahmed Al-Rashidi",
    role: "Senior Agent · Dubai Marina",
    agency: "Espace Real Estate",
    quote:
      "Rival Radar alone saved me 3 mandates I would have lost otherwise. I caught a competitor's price cut 4 hours before my client did and called them first.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Team Lead · Downtown Dubai",
    agency: "Better Homes",
    quote:
      "The Morning Brief is like having a research analyst on call. I walk into every client meeting knowing things they don't. That confidence closes deals.",
    rating: 5,
  },
  {
    name: "James Whitmore",
    role: "Luxury Specialist · Palm Jumeirah",
    agency: "Savills Dubai",
    quote:
      "Smart Pricing saved me an embarrassing conversation last month. The data was so precise my vendor didn't even attempt to negotiate.",
    rating: 5,
  },
  {
    name: "Fatima Al-Hosani",
    role: "Investment Consultant · Abu Dhabi",
    agency: "Aldar Properties",
    quote:
      "Investor Yield Engine closed a deal I'd been working for 6 weeks. One number — net yield after all fees — and the client signed the same afternoon.",
    rating: 5,
  },
  {
    name: "Marco Pellegrini",
    role: "Off-Plan Specialist · Business Bay",
    agency: "Engel & Völkers",
    quote:
      "FSBO tool found me two qualified sellers in my first week. Both listed with me. PropIntel pays for itself 10x over, every single month.",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "How is PropIntel different from Bayut or Property Finder?",
    a: "Bayut and Property Finder are consumer portals — they help buyers and renters search listings. PropIntel is an agent intelligence platform. We give you competitive analysis, pricing engines, lead generation tools, and real-time market signals that portals don't provide and never will. We complement portals; we don't replace them.",
  },
  {
    q: "Where does your data come from?",
    a: "We aggregate from DLD transaction records, RERA filings, ADM data, major portal listings, and proprietary field intelligence from our active agent network. All pricing data is reconciled against official DLD figures — not just asking prices, but actual registered transactions.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in, no cancellation fees. Cancel from your dashboard at any time and you retain full access until the end of your current billing period. No questions asked, no dark patterns.",
  },
  {
    q: "Is my client data safe?",
    a: "PropIntel never asks for or stores your CRM data, client contacts, or deal details. We are a market intelligence tool, not a CRM. Your client relationships are yours — we have zero visibility into them.",
  },
  {
    q: "Does it cover all seven Emirates?",
    a: "We have deep, live coverage across Dubai, Abu Dhabi, Sharjah, and Ajman with official DLD/ADM transaction data. Coverage for Ras Al Khaimah and Fujairah is currently in beta. Full Northern Emirates coverage is on our roadmap for Q3 2026.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — 14 days free, full Pro access, no credit card required. You'll see exactly why 500+ UAE agents pay for PropIntel before we ever ask for anything. If it doesn't change how you work, you owe us nothing.",
  },
];

const MARKET_WIDGETS = [
  {
    emoji: "🔥",
    title: "Hot Communities",
    subtitle: "Trending now",
    rows: ["Dubai Marina +12.1%", "JVC +8.4% WoW", "Business Bay +7.1%"],
  },
  {
    emoji: "📉",
    title: "Price Drop Radar",
    subtitle: "Biggest 24h reductions",
    rows: ["Palm Jumeirah −AED 180k", "DIFC −AED 95k", "JBR −AED 72k"],
  },
  {
    emoji: "💳",
    title: "Cheque Flexibility",
    subtitle: "Current market average",
    rows: ["4 cheques: 61% of listings", "6 cheques: 23% available", "12 cheques: 8% available"],
  },
  {
    emoji: "🏗️",
    title: "Payment Plan Board",
    subtitle: "Best live terms",
    rows: ["Emaar 60/40 · 0% interest", "Damac 70/30 · post-handover", "Nakheel 80/20 · 5yr PP"],
  },
  {
    emoji: "🏆",
    title: "Agent Leaderboard",
    subtitle: "Top closers this week",
    rows: ["#1 A. Al-Rashidi · 9 deals", "#2 P. Nair · 7 deals", "#3 J. Whitmore · 6 deals"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PropIntelLogo — inline SVG brand mark.
 *
 * Each rendered instance MUST receive a unique `uid` string so its
 * linearGradient id ("brand-grad-{uid}") doesn't collide with other
 * instances in the same document. SVG gradient ids are global in the DOM;
 * duplicate ids cause every instance after the first to inherit the first
 * gradient's coordinates, silently breaking the fill on subsequent renders.
 */
function PropIntelLogo({
  className = "h-8 w-auto",
  uid,
}: {
  className?: string;
  uid: string;
}) {
  const gid = `brand-grad-${uid}`;
  return (
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
      className={className}
      aria-label="PropIntel UAE"
    >
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
        <tspan fill="#14b8a6" fontWeight="400"> UAE</tspan>
      </text>
    </svg>
  );
}

function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl",
        hover
          ? "transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.065] hover:shadow-2xl hover:shadow-black/40"
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400">
      {children}
    </span>
  );
}

function InViewSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  function scrollTo(href: string) {
    setDrawerOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <>
      {/* ── Main nav bar ── */}
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-white/[0.07] bg-[#0a0f1e]/80 shadow-xl shadow-black/30 backdrop-blur-2xl"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <PropIntelLogo className="h-8 w-auto" uid="nav" />
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <button className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/45"
            >
              Start Free Trial
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Open navigation"
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-72 flex-col bg-[#0d1424] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                {/* Drawer logo */}
                <PropIntelLogo className="h-7 w-auto" uid="drawer" />
                <button
                  aria-label="Close navigation"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((l) => (
                  <button
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    className="flex min-h-[44px] items-center rounded-xl px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
                  >
                    {l.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-white/[0.07] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button className="min-h-[44px] rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white">
                  Sign In
                </button>
                <button className="min-h-[44px] rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
                  Start Free Trial
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  const avatarInitials = ["AH", "PN", "JW", "FA", "MP"];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* ── Animated gradient background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blob 1 — emerald */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-[20%] top-[20%] h-[640px] w-[640px] rounded-full bg-emerald-500/20 blur-[130px]"
        />
        {/* Blob 2 — teal */}
        <motion.div
          animate={{ scale: [1.12, 1, 1.12], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute -right-[20%] bottom-[15%] h-[560px] w-[560px] rounded-full bg-teal-500/20 blur-[120px]"
        />
        {/* Blob 3 — blue */}
        <motion.div
          animate={{ scale: [1, 1.22, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute left-1/2 top-1/3 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-[100px]"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.12) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
          {/* ── Left: Copy ── */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <SectionPill>
                <Zap className="h-3 w-3" />
                UAE Real Estate Intelligence
              </SectionPill>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="mt-7 font-display text-[2.65rem] font-black leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
            >
              The Bloomberg Terminal
              <br />
              for{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                UAE Real Estate
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-slate-400"
            >
              10 powerful tools that replace{" "}
              <span className="font-semibold text-white">
                90 minutes of daily portal scrolling.
              </span>{" "}
              Win more mandates. Close more deals. Know what your competition
              doesn't.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition-shadow hover:shadow-emerald-500/50"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/[0.1]"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.42 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2.5">
                {avatarInitials.map((init, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0a0f1e] bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-bold text-white"
                  >
                    {init[0]}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-[12px] text-slate-400">
                  Trusted by{" "}
                  <span className="font-semibold text-white">500+ UAE agents</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Morning Coffee Dashboard Mockup ── */}
<motion.div
  initial={{ opacity: 0, x: 48, y: 8 }}
  animate={{ opacity: 1, x: 0, y: 0 }}
  transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
  className="relative"
>
  {/* Glow behind card */}
  <div className="absolute inset-6 rounded-3xl bg-emerald-500/[0.12] blur-3xl" />

  <GlassCard hover={false} className="relative overflow-hidden p-0">

    {/* ── Window chrome ── */}
    <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
      <div className="h-2.5 w-2.5 rounded-full bg-red-500/55" />
      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/55" />
      <div className="h-2.5 w-2.5 rounded-full bg-green-500/55" />
      <div className="mx-auto flex items-center gap-1.5">
        <span className="text-[11px] font-medium text-slate-500">
          PropIntel UAE
        </span>
        <span className="text-[11px] text-slate-700">—</span>
        <span className="text-[11px] font-semibold text-slate-400">
          Morning Coffee
        </span>
        <span className="ml-1 text-[10px]">☕</span>
      </div>
    </div>

    <div className="space-y-3 p-4 sm:p-5">

      {/* ── Greeting + section title ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-slate-500">
            Thursday, 24 Apr 2026 · 07:04 GST
          </p>
          <p className="mt-0.5 text-sm font-bold text-white">
            Good Morning, Ahmed ☕
          </p>
        </div>
        <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          Market Overview
        </span>
      </div>

      {/* ── Three metric cards ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: "Active Listings",
            value: "48,320",
            delta: "+2.4%",
            sub: "vs last week",
            up: true,
          },
          {
            label: "Market Turnover",
            value: "AED 9.2B",
            delta: "+11.7%",
            sub: "30-day volume",
            up: true,
          },
          {
            label: "Avg. Days on Mkt",
            value: "38 days",
            delta: "–3 days",
            sub: "vs prev. period",
            up: true,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="flex flex-col gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5"
          >
            <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
              {m.label}
            </span>
            <span className="font-display text-[13px] font-extrabold leading-tight text-white">
              {m.value}
            </span>
            <div className="flex items-center gap-1">
              {/* Up arrow SVG */}
              <svg
                viewBox="0 0 8 8"
                className="h-2.5 w-2.5 shrink-0 text-emerald-400"
                fill="currentColor"
              >
                <path d="M4 1 L7 6 L1 6 Z" />
              </svg>
              <span className="text-[10px] font-semibold text-emerald-400">
                {m.delta}
              </span>
            </div>
            <span className="text-[9px] text-slate-600">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* ── 30-Day Price Trend placeholder ── */}
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-white/[0.05] px-3 py-2">
          <span className="text-[11px] font-semibold text-slate-400">
            30-Day Price Trend
          </span>
          <div className="flex items-center gap-3">
            {[
              { label: "Dubai", color: "bg-emerald-400" },
              { label: "Abu Dhabi", color: "bg-teal-400" },
              { label: "Sharjah", color: "bg-cyan-500" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`h-1.5 w-1.5 rounded-full ${l.color}`} />
                <span className="text-[9px] text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart body */}
        <div className="relative h-16 sm:h-20">
          {/* Faint grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "20% 25%",
            }}
          />
          {/* Emerald line gradient — Dubai */}
          <svg
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="fillEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="fillTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Dubai fill */}
            <path
              d="M0,45 C20,42 35,38 55,30 C75,22 90,28 110,20 C130,12 150,18 170,10 C185,5 195,8 200,6 L200,60 L0,60 Z"
              fill="url(#fillEmerald)"
            />
            {/* Dubai line */}
            <path
              d="M0,45 C20,42 35,38 55,30 C75,22 90,28 110,20 C130,12 150,18 170,10 C185,5 195,8 200,6"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Abu Dhabi fill */}
            <path
              d="M0,50 C25,48 40,44 60,38 C80,32 100,36 120,30 C140,24 165,26 200,20 L200,60 L0,60 Z"
              fill="url(#fillTeal)"
            />
            {/* Abu Dhabi line */}
            <path
              d="M0,50 C25,48 40,44 60,38 C80,32 100,36 120,30 C140,24 165,26 200,20"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
            {/* Sharjah line only */}
            <path
              d="M0,54 C30,53 50,50 75,46 C100,42 125,44 150,40 C170,37 185,38 200,35"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="3 3"
              strokeOpacity="0.6"
            />
            {/* Latest value dot */}
            <circle cx="200" cy="6" r="2.5" fill="#34d399" />
            <circle cx="200" cy="6" r="5" fill="#34d399" fillOpacity="0.2" />
          </svg>
        </div>
      </div>

      {/* ── Top Active Areas table ── */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.05] px-3 py-2">
          <span className="text-[11px] font-semibold text-slate-400">
            Top Active Areas
          </span>
          <span className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
            Listings this week
          </span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[
            { area: "Downtown Dubai", count: "3,842", bar: 75 },
            { area: "Business Bay",   count: "2,917", bar: 58 },
            { area: "JVC",            count: "4,201", bar: 92 },
          ].map((row) => (
            <div
              key={row.area}
              className="flex items-center gap-3 px-3 py-2"
            >
              <span className="w-[92px] shrink-0 text-[11px] text-slate-300">
                {row.area}
              </span>
              {/* Mini bar */}
              <div className="flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${row.bar}%` }}
                  transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
                  className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[11px] font-semibold text-white">
                  {row.count}
                </span>
                <svg
                  viewBox="0 0 8 8"
                  className="h-2 w-2 text-emerald-400"
                  fill="currentColor"
                >
                  <path d="M4 1 L7 6 L1 6 Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </GlassCard>

  {/* Floating badge — top right */}
  <motion.div
    animate={{ y: [0, -7, 0] }}
    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    className="absolute -right-3 -top-4 rounded-2xl border border-emerald-500/30 bg-slate-900/90 px-4 py-2.5 shadow-xl backdrop-blur-lg sm:-right-5"
  >
    <div className="text-xs font-extrabold text-emerald-400">
      +14.2% YoY
    </div>
    <div className="text-[10px] text-slate-500">Dubai avg. price</div>
  </motion.div>

  {/* Floating badge — bottom left */}
  <motion.div
    animate={{ y: [0, 7, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
    className="absolute -bottom-4 -left-3 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2.5 shadow-xl backdrop-blur-lg sm:-left-5"
  >
    <div className="text-xs font-extrabold text-white">
      10 tools active
    </div>
    <div className="text-[10px] text-slate-500">Full Pro mode</div>
  </motion.div>

</motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKET PULSE
// ─────────────────────────────────────────────────────────────────────────────

function MarketPulse() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InViewSection className="text-center">
          <motion.div variants={fadeUp}>
            <SectionPill>
              <Globe className="h-3 w-3" />
              Live Market Intelligence
            </SectionPill>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Free Market Intelligence
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-400"
          >
            A preview of what's moving across the UAE — right now. Pro
            subscribers see unblurred data, real agent names, and live AED
            figures updated every 15 minutes.
          </motion.p>
        </InViewSection>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {MARKET_WIDGETS.map((w) => (
            <motion.div key={w.title} variants={scaleIn} className="flex">
              <GlassCard className="flex w-full flex-col p-5">
                <span className="text-[1.6rem] leading-none">{w.emoji}</span>
                <p className="mt-3 text-sm font-bold text-white">{w.title}</p>
                <p className="text-[11px] text-slate-500">{w.subtitle}</p>

                <ul className="mt-4 flex-1 space-y-1.5">
                  {w.rows.map((row) => (
                    <li key={row} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" />
                      <span className="select-none text-[11px] text-slate-300 blur-[3.5px]">
                        {row}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled
                  className="mt-5 flex w-full cursor-not-allowed items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[10px] font-medium text-slate-600"
                >
                  <Lock className="h-3 w-3" />
                  Pro Trial Required
                  <span className="ml-auto">Unlock →</span>
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE SHOWCASE
// ─────────────────────────────────────────────────────────────────────────────

function ModuleShowcase() {
  const accentStyles: Record<
    AccentColor,
    { card: string; icon: string; glow: string }
  > = {
    emerald: {
      card: "from-emerald-500/[0.12] border-emerald-500/20 hover:border-emerald-500/40",
      icon: "bg-emerald-500/15 text-emerald-400",
      glow: "bg-emerald-500/20",
    },
    teal: {
      card: "from-teal-500/[0.12] border-teal-500/20 hover:border-teal-500/40",
      icon: "bg-teal-500/15 text-teal-400",
      glow: "bg-teal-500/20",
    },
    cyan: {
      card: "from-cyan-500/[0.12] border-cyan-500/20 hover:border-cyan-500/40",
      icon: "bg-cyan-500/15 text-cyan-400",
      glow: "bg-cyan-500/20",
    },
  };

  return (
    <section className="relative py-24 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-teal-500/[0.08] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InViewSection className="text-center">
          <motion.div variants={fadeUp}>
            <SectionPill>
              <Zap className="h-3 w-3" />
              The Arsenal
            </SectionPill>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Your Arsenal of{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              10 Intelligence Tools
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-400"
          >
            Each tool is built for one purpose: giving Dubai, Abu Dhabi, and
            Sharjah agents an unfair, compounding advantage over everyone else.
          </motion.p>
        </InViewSection>

        <InViewSection className="mt-12 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const s = accentStyles[mod.accent];
            return (
              <motion.div
                key={mod.name}
                variants={scaleIn}
                className={mod.wide ? "sm:col-span-2" : ""}
              >
                <div
                  className={[
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-6",
                    "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40",
                    s.card,
                    mod.comingSoon ? "opacity-90" : "",
                  ].join(" ")}
                >
                  {/* Coming Q3 badge */}
                  {mod.comingSoon && (
                    <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Coming Q3
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-display text-base font-bold text-white">
                    {mod.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                    {mod.benefit}
                  </p>

                  <button
                    className={[
                      "group/btn mt-6 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors",
                      mod.comingSoon
                        ? "cursor-default text-amber-500/60"
                        : "text-slate-500 hover:text-white",
                    ].join(" ")}
                    disabled={mod.comingSoon}
                  >
                    {mod.comingSoon ? "Notify Me When Live" : "Learn More"}
                    {!mod.comingSoon && (
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    )}
                  </button>

                  {/* Hover glow */}
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-opacity duration-500 ${s.glow} opacity-0 group-hover:opacity-60`}
                  />
                </div>
              </motion.div>
            );
          })}
        </InViewSection>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────────────────────────────────────

function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      {/* Top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="h-[2px] w-2/3 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-0 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InViewSection className="text-center">
          <motion.div variants={fadeUp}>
            <SectionPill>Pricing</SectionPill>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            No Contracts. Cancel Anytime.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl text-base text-slate-400"
          >
            14-day free trial on all plans. Full Pro access. No credit card
            required.
          </motion.p>

          {/* Annual/monthly toggle */}
          <motion.div
            variants={fadeUp}
            className="mt-8 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5"
          >
            {[
              { label: "Monthly", val: false },
              { label: "Annual", val: true, badge: "−20%" },
            ].map((opt) => (
              <button
                key={String(opt.val)}
                onClick={() => setAnnual(opt.val)}
                className={[
                  "relative rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200",
                  annual === opt.val
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-300",
                ].join(" ")}
              >
                {opt.label}
                {opt.badge && (
                  <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    {opt.badge}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </InViewSection>

        <InViewSection className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              variants={scaleIn}
              className={[
                "relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
                tier.highlight
                  ? "border-emerald-500/50 bg-gradient-to-b from-emerald-500/[0.12] to-transparent shadow-2xl shadow-emerald-500/10"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]",
              ].join(" ")}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-1 text-[11px] font-bold tracking-wide text-white shadow-lg shadow-emerald-500/30">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="font-display text-xs font-bold uppercase tracking-widest text-slate-400">
                {tier.name}
              </div>

              <div className="mt-4 flex items-end gap-1">
                <span className="font-display text-[2.6rem] font-black leading-none text-white">
                  ${annual ? tier.price.annual : tier.price.monthly}
                </span>
                <span className="mb-1.5 text-sm text-slate-500">/mo</span>
              </div>
              {annual && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Billed as $
                  {(annual ? tier.price.annual : tier.price.monthly) * 12}
                  /yr
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {tier.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={[
                  "mt-7 w-full rounded-xl py-3.5 text-sm font-bold transition-all",
                  tier.highlight
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/45"
                    : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.09]",
                ].join(" ")}
              >
                {tier.cta}
              </motion.button>

              <div className="mt-8 space-y-3">
                {tier.features.map((f) => {
                  const isComingSoon = f.includes("Coming Q3");
                  return (
                    <div key={f} className="flex items-start gap-3">
                      <Check
                        className={[
                          "mt-0.5 h-4 w-4 shrink-0",
                          isComingSoon ? "text-amber-400/70" : "text-emerald-400",
                        ].join(" ")}
                      />
                      <span
                        className={[
                          "text-sm",
                          isComingSoon ? "text-slate-400" : "text-slate-300",
                        ].join(" ")}
                      >
                        {f}
                      </span>
                    </div>
                  );
                })}
                {tier.notIncluded.map((f) => (
                  <div key={f} className="flex items-start gap-3 opacity-30">
                    <div className="mt-2.5 h-0.5 w-3 shrink-0 rounded-full bg-slate-600" />
                    <span className="text-sm text-slate-500">{f}</span>
                  </div>
                ))}
              </div>

              {/* Coming Q3 footnote */}
              {tier.features.some((f) => f.includes("Coming Q3")) && (
                <p className="mt-5 text-[10px] leading-relaxed text-slate-600">
                  ✦ Included in your subscription at no extra charge. Activates Q3 2026.
                </p>
              )}
            </motion.div>
          ))}
        </InViewSection>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InViewSection className="text-center">
          <motion.div variants={fadeUp}>
            <SectionPill>
              <Star className="h-3 w-3" />
              Agent Stories
            </SectionPill>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            What UAE Agents Are Saying
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl text-base text-slate-400"
          >
            Real stories from agents who switched from portal-scrolling to
            intelligence-led selling.
          </motion.p>
        </InViewSection>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="mt-12 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-5 lg:w-auto lg:grid lg:grid-cols-3 xl:grid-cols-5">
            {TESTIMONIALS.map((t) => (
              <GlassCard
                key={t.name}
                className="flex w-[18rem] shrink-0 flex-col p-6 lg:w-auto"
              >
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                  "{t.quote}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-bold text-white">
                    {t.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                    <p className="text-[10px] text-emerald-500/70">
                      {t.agency}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <InViewSection className="text-center">
          <motion.div variants={fadeUp}>
            <SectionPill>FAQ</SectionPill>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-black tracking-tight text-white sm:text-4xl"
          >
            Common Questions
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-lg text-base text-slate-400"
          >
            Everything you need to know before you start your trial. Can't find
            the answer?{" "}
            <a href="#" className="text-emerald-400 hover:underline">
              Chat with us.
            </a>
          </motion.p>
        </InViewSection>

        <InViewSection className="mt-12 space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard hover={false} className="overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white sm:text-[0.95rem]">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openIdx === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openIdx === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="border-t border-white/[0.06] px-6 pb-6 pt-4 text-sm leading-relaxed text-slate-400">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </InViewSection>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA BANNER
// ─────────────────────────────────────────────────────────────────────────────

function FinalCTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-8 py-16 text-center sm:px-16 sm:py-20"
        >
          {/* Overlays */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-white/[0.12] blur-3xl" />
            <div className="absolute -bottom-1/4 -right-1/4 h-3/4 w-3/4 rounded-full bg-black/25 blur-3xl" />
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.25) 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60">
              Start today — free for 14 days
            </p>
            <h2 className="mt-4 font-display text-3xl font-black text-white sm:text-4xl lg:text-[2.75rem]">
              Ready to Close More Deals?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/75">
              Join 500+ UAE agents who start every morning with PropIntel. Full
              Pro access for 14 days, no credit card required.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-9 inline-flex min-h-[52px] items-center gap-2.5 rounded-2xl bg-white px-9 py-4 text-sm font-bold text-slate-900 shadow-2xl shadow-black/35 transition-shadow hover:shadow-black/55"
            >
              Start Free Trial — 14 Days Free
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            <p className="mt-4 text-[11px] text-white/40">
              No credit card required &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp;
              Instant access
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        "Features",
        "Pricing",
        "Morning Brief",
        "Smart Pricing",
        "Rival Radar",
        "Agent Trust Score",
      ],
    },
    {
      title: "Markets",
      links: [
        "Dubai",
        "Abu Dhabi",
        "Sharjah",
        "Ajman",
        "Ras Al Khaimah",
        "Fujairah (Beta)",
      ],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press Kit", "Data Sources", "Contact"],
    },
    {
      title: "Legal",
      links: [
        "Privacy Policy",
        "Terms of Service",
        "Cookie Policy",
        "RERA Compliance",
        "Data Processing",
      ],
    },
  ];

  // Plain text links — no lucide brand icons (they don't exist in this version)
  const socialLinks = [
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Email", href: "#" },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-[#080c18]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand block */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            {/* Footer logo */}
            <PropIntelLogo className="h-7 w-auto" uid="footer" />
            <p className="mt-4 max-w-[220px] text-[12px] leading-relaxed text-slate-500">
              The intelligence layer for UAE real estate professionals. Data-driven
              decisions, not gut feeling.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[11px] font-medium text-slate-500 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[12px] text-slate-500 transition-colors hover:text-slate-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-[11px] text-slate-600">
            © 2026 PropIntel UAE. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-700">
            Powered by DLD &nbsp;·&nbsp; ADM &nbsp;·&nbsp; RERA verified data
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      {/* Google Fonts — Inter */}
      

      <div
        className="min-h-screen bg-[#0a0f1e] font-sans antialiased"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <Navbar />
        <Hero />
        <MarketPulse />
        <ModuleShowcase />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTABanner />
        <Footer />
      </div>
    </>
  );
}