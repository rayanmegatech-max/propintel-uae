"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  Cpu,
  Database,
  Factory,
  Globe2,
  LayoutDashboard,
  LineChart,
  MapPinned,
  Menu,
  Radar,
  RefreshCcw,
  Search,
  TrendingDown,
  UserCheck,
  X,
} from "lucide-react";
import {
  COUNTRY_LIST,
  getCountryConfig,
  isCountrySlug,
  type CountryConfig,
} from "@/lib/countries/countryConfig";
import {
  PRODUCT_SECTIONS,
  getProductSection,
  type ProductSectionSlug,
} from "@/lib/countries/productNavigation";

// ─── Palette constants ────────────────────────────────────────────────────────
const BDR  = "rgba(255,255,255,0.08)";
const BDRS = "rgba(255,255,255,0.05)";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  internalOnly?: boolean;
  disabledReason?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Section → icon map ───────────────────────────────────────────────────────
const SECTION_ICON_MAP: Record<ProductSectionSlug, React.ElementType> = {
  recon:                 Radar,
  "owner-direct":        UserCheck,
  "price-drops":         TrendingDown,
  "listing-age":         RefreshCcw,
  "market-intelligence": LineChart,
  "inventory-pressure":  Activity,
  "market-dominance":    BarChart3,
  "agency-profiles":     Factory,
  "activity-feed":       Globe2,
  buildings:             Building2,
  communities:           MapPinned,
  "data-quality":        Database,
};

// ─── Nav section grouping ─────────────────────────────────────────────────────
const NAV_GROUP_DEFS: { label: string; slugs: ProductSectionSlug[] }[] = [
  {
    label: "OPPORTUNITIES",
    slugs: ["recon", "owner-direct", "price-drops", "listing-age"],
  },
  {
    label: "MARKET",
    slugs: [
      "market-intelligence",
      "inventory-pressure",
      "market-dominance",
      "agency-profiles",
      "activity-feed",
    ],
  },
  {
    label: "INTELLIGENCE",
    slugs: ["buildings", "communities"],
  },
  {
    label: "ADMIN",
    slugs: ["data-quality"],
  },
];

// ─── Path helpers ─────────────────────────────────────────────────────────────
function getCountryFromPath(pathname: string): CountryConfig | undefined {
  const segment = pathname.split("/")[2];
  if (segment && isCountrySlug(segment)) return getCountryConfig(segment);
  return undefined;
}

function getPageTitle(
  pathname: string,
  country: CountryConfig | undefined
): string {
  if (!country) return "GCC Overview";
  const sectionSlug = pathname.split("/")[3];
  if (!sectionSlug) return `${country.label} Overview`;
  const section = getProductSection(sectionSlug);
  return section ? section.label : `${country.label} Overview`;
}

function buildNavGroups(country: CountryConfig | undefined): NavGroup[] {
  if (!country) {
    return [
      {
        label: "COMMAND",
        items: [
          { label: "GCC Overview",    href: "/dashboard",     icon: LayoutDashboard },
          { label: "UAE Dashboard",   href: "/dashboard/uae", icon: Building2       },
          { label: "KSA Dashboard",   href: "/dashboard/ksa", icon: MapPinned       },
        ],
      },
    ];
  }

  const groups: NavGroup[] = [
    {
      label: "COMMAND",
      items: [
        {
          label: `${country.label} Overview`,
          href: country.routeBase,
          icon: LayoutDashboard,
        },
      ],
    },
  ];

  for (const def of NAV_GROUP_DEFS) {
    const items: NavItem[] = def.slugs
      .map<NavItem | null>((slug) => {
        const section = PRODUCT_SECTIONS.find((s) => s.slug === slug);
        if (!section) return null;
        return {
          label:         section.shortLabel,
          href:          `${country.routeBase}/${section.slug}`,
          icon:          SECTION_ICON_MAP[section.slug],
          internalOnly:  section.internalOnly,
          disabledReason: country.disabledSections?.[section.slug],
        } satisfies NavItem;
      })
      .filter((item): item is NavItem => item !== null);

    if (items.length > 0) groups.push({ label: def.label, items });
  }

  return groups;
}

// ─── Pulse dot ───────────────────────────────────────────────────────────────
function Pulse({ color = "bg-emerald-400" }: { color?: string }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${color}`}
      style={{ animation: "pdot 2.4s ease-in-out infinite" }}
    />
  );
}

// ─── PropIntel logo SVG ───────────────────────────────────────────────────────
function PropIntelLogo({ uid }: { uid: string }) {
  const gid = `pi-g-${uid}`;
  return (
    <svg
      width="150"
      height="28"
      viewBox="0 0 150 28"
      fill="none"
      aria-label="PropIntel GCC"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#22d3ee" />
          <stop offset="48%"  stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Chart bar mark */}
      <rect x="1"  y="18" width="4" height="8"  rx="0.8" fill={`url(#${gid})`} />
      <rect x="7"  y="12" width="4" height="14" rx="0.8" fill={`url(#${gid})`} />
      <path d="M13 26V4L15.5 0L18 4V26H13Z" fill={`url(#${gid})`} />
      {/* Wordmark */}
      <text
        x="26"
        y="20"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="16"
        fontWeight="800"
        letterSpacing="-0.03em"
      >
        <tspan fill="#fafafa">PropIntel</tspan>
        <tspan fill="#14b8a6" fontWeight="500"> GCC</tspan>
      </text>
    </svg>
  );
}

// ─── Country switcher ─────────────────────────────────────────────────────────
function CountrySwitcher({
  activeCountry,
  onNav,
}: {
  activeCountry?: CountryConfig;
  onNav?: () => void;
}) {
  return (
    <div className="px-4 pt-3.5 pb-3.5 border-b shrink-0" style={{ borderColor: BDR }}>
      <p
        className="text-[10px] font-semibold uppercase tracking-widest mb-2 pl-1"
        style={{ color: "#52525b" }}
      >
        Market
      </p>

      {/* Toggle pill */}
      <div
        className="flex gap-1.5 p-[4px] rounded-xl"
        style={{ background: "#000000" }}
      >
        {COUNTRY_LIST.map((country) => {
          const active = activeCountry?.slug === country.slug;
          return (
            <Link
              key={country.slug}
              href={country.routeBase}
              onClick={onNav}
              className={[
                "flex-1 py-[6px] rounded-[9px] text-[12px] font-semibold transition-all duration-200 text-center",
                active
                  ? "text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-200",
              ].join(" ")}
              style={active ? { background: "#27272a" } : undefined}
            >
              {country.label}
            </Link>
          );
        })}
      </div>

      {/* Live status row */}
      <div className="flex items-center gap-1.5 mt-2.5 pl-1">
        <Pulse color={activeCountry ? "bg-emerald-400" : "bg-zinc-600"} />
        <span className="text-[11px] font-medium" style={{ color: "#a1a1aa" }}>
          {activeCountry
            ? `${activeCountry.currency} · Live data`
            : "GCC · Live data"}
        </span>
      </div>
    </div>
  );
}

// ─── Single nav link ──────────────────────────────────────────────────────────
function NavLink({ item, onNav }: { item: NavItem; onNav?: () => void }) {
  const pathname   = usePathname();
  const isActive   = item.href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isDisabled = !!item.disabledReason;
  const isAdmin    = !!item.internalOnly;
  const Icon       = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNav}
      title={item.disabledReason ?? item.label}
      className={[
        "relative flex items-center gap-2.5 px-3 py-[9px] rounded-xl transition-all duration-150 group",
        isActive
          ? "text-emerald-400"
          : isDisabled
          ? "text-zinc-600 hover:text-amber-300/80"
          : "text-zinc-400 hover:text-zinc-200",
      ].join(" ")}
      style={{
        background: isActive
          ? "rgba(16,185,129,0.08)"
          : isDisabled
          ? "rgba(245,158,11,0.025)"
          : undefined,
      }}
    >
      {/* Active left accent bar */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full bg-emerald-400"
          style={{ width: "2.5px", height: "18px" }}
        />
      )}

      {/* Icon bubble */}
      <span
        className={[
          "shrink-0 transition-colors",
          isActive
            ? "text-emerald-400"
            : isDisabled
            ? "text-amber-700/60 group-hover:text-amber-500/70"
            : "text-zinc-600 group-hover:text-zinc-300",
        ].join(" ")}
      >
        <Icon className="w-[15px] h-[15px]" />
      </span>

      {/* Label */}
      <span className="text-[13px] font-medium flex-1 truncate">{item.label}</span>

      {/* Admin badge */}
      {isAdmin && !isDisabled && (
        <span
          className="rounded-md px-1.5 py-[3px] text-[9px] font-bold uppercase tracking-wide text-amber-400"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.18)",
          }}
        >
          Admin
        </span>
      )}

      {/* Limited badge */}
      {isDisabled && (
        <span
          className="rounded-md px-1.5 py-[3px] text-[9px] font-bold uppercase tracking-wide text-amber-500/80"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.14)",
          }}
        >
          Limited
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar inner content ────────────────────────────────────────────────────
function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname     = usePathname();
  const activeCountry = useMemo(() => getCountryFromPath(pathname), [pathname]);
  const navGroups    = useMemo(() => buildNavGroups(activeCountry), [activeCountry]);

  return (
    <div
      className="flex h-full flex-col"
      style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',Inter,sans-serif" }}
    >
      {/* ── Logo block ─────────────────────────────────────────────────── */}
      <div
        className="relative flex items-center gap-3 px-5 py-[18px] border-b shrink-0"
        style={{ borderColor: BDR }}
      >
        <Link href="/dashboard" onClick={onNav} aria-label="PropIntel GCC home">
          <PropIntelLogo uid="sidebar" />
        </Link>

        {/* Mobile close button (absolute-positioned) */}
        {onNav && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden transition-colors"
            style={{ color: "#52525b" }}
            onClick={onNav}
            aria-label="Close navigation"
          >
            <X className="w-[15px] h-[15px]" />
          </button>
        )}
      </div>

      {/* ── Country switcher ────────────────────────────────────────────── */}
      <CountrySwitcher activeCountry={activeCountry} onNav={onNav} />

      {/* ── Navigation groups ───────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
        style={{ scrollbarWidth: "none" }}
      >
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-1.5 px-3"
              style={{ color: "#3f3f46" }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} onNav={onNav} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer: AI engine + user ─────────────────────────────────────── */}
      <div
        className="px-4 py-4 border-t space-y-3 shrink-0"
        style={{
          borderColor: BDR,
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* AI engine block */}
        <div
          className="rounded-xl px-3.5 py-3 border"
          style={{
            background:   "#18181b",
            borderColor:  "rgba(167,139,250,0.14)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Cpu className="w-3 h-3 text-violet-400 shrink-0" />
            <span
              className="text-[9px] font-semibold tracking-[0.16em] text-violet-400"
              style={{ fontFamily: "'DM Mono',monospace" }}
            >
              AI ENGINE
            </span>
            <Pulse color="bg-violet-400 ml-auto" />
          </div>
          <p className="text-[12px] leading-snug" style={{ color: "#a1a1aa" }}>
            Local preview mode
            <span
              className="inline-block w-[5px] h-3 rounded-sm animate-pulse ml-1.5 align-middle"
              style={{ background: "#a78bfa" }}
            />
          </p>
        </div>

        {/* User row */}
        <div className="flex items-center gap-2.5 pl-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg,#10b981,#0e7490)" }}
          >
            A
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: "#e4e4e7" }}>
              Analyst
            </p>
            <p
              className="text-[10px] truncate"
              style={{ fontFamily: "'DM Mono',monospace", color: "#3f3f46" }}
            >
              © 2026 PropIntel GCC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Top header bar ───────────────────────────────────────────────────────────
function TopHeader({
  mobileOpen,
  onMobileToggle,
  activeCountry,
  pageTitle,
}: {
  mobileOpen: boolean;
  onMobileToggle: () => void;
  activeCountry?: CountryConfig;
  pageTitle: string;
}) {
  return (
    <header
      className="shrink-0 h-[54px] flex items-center px-5 sm:px-6 gap-4 border-b backdrop-blur-md z-10"
      style={{
        background:  "rgba(9,9,11,0.85)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onMobileToggle}
        className="lg:hidden shrink-0 transition-colors"
        style={{ color: "#71717a" }}
        aria-label="Toggle navigation"
      >
        {mobileOpen
          ? <X className="w-[18px] h-[18px]" />
          : <Menu className="w-[18px] h-[18px]" />
        }
      </button>

      {/* Mobile logo */}
      <div className="lg:hidden shrink-0">
        <Link href="/dashboard">
          <PropIntelLogo uid="mobile" />
        </Link>
      </div>

      {/* Desktop: title + context chips */}
      <div className="hidden lg:flex items-center gap-3 min-w-0">
        <h1
          className="text-[15px] font-bold tracking-tight truncate"
          style={{ color: "#fafafa" }}
        >
          {pageTitle}
        </h1>

        {activeCountry && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-[10px] font-semibold uppercase tracking-wide border rounded-[6px] px-2 py-[3px]"
              style={{
                color:       "#34d399",
                background:  "rgba(16,185,129,0.08)",
                borderColor: "rgba(16,185,129,0.2)",
              }}
            >
              {activeCountry.label}
            </span>

            <span
              className="text-[10px] font-medium border rounded-[6px] px-2 py-[3px]"
              style={{ color: "#d4d4d8", borderColor: BDR }}
            >
              {activeCountry.currency}
            </span>

            <span
              className="flex items-center gap-1.5 text-[10px] font-medium border rounded-[6px] px-2 py-[3px]"
              style={{
                color:       "#22d3ee",
                background:  "rgba(34,211,238,0.06)",
                borderColor: "rgba(34,211,238,0.2)",
              }}
            >
              <Pulse color="bg-cyan-400" />
              LIVE
            </span>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Desktop search */}
        <div
          className="hidden md:flex items-center gap-2 border rounded-xl px-3.5 py-[7px] transition-all"
          style={{
            background:   "#000000",
            borderColor:  "rgba(255,255,255,0.09)",
            boxShadow:    "inset 0 0 0 1px rgba(39,39,42,0.8)",
          }}
        >
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "#52525b" }} />
          <input
            type="text"
            placeholder="Search listings…"
            readOnly
            className="bg-transparent border-none outline-none text-[13px] w-36 min-w-0 cursor-pointer"
            style={{
              color:             "#fafafa",
              caretColor:        "#10b981",
            }}
          />
          <span
            className="text-[10px] border rounded px-[5px] py-px ml-2 shrink-0"
            style={{ color: "#3f3f46", borderColor: BDRS }}
          >
            ⌘K
          </span>
        </div>

        {/* Mobile search icon */}
        <button
          type="button"
          className="md:hidden transition-colors"
          style={{ color: "#52525b" }}
          aria-label="Search"
        >
          <Search className="w-[17px] h-[17px]" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative transition-colors"
          style={{ color: "#52525b" }}
          aria-label="Notifications"
        >
          <Bell className="w-[17px] h-[17px]" />
          <span className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] bg-emerald-400 rounded-full" />
        </button>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg,#10b981,#0e7490)" }}
        >
          A
        </div>
      </div>
    </header>
  );
}

// ─── Root layout ──────────────────────────────────────────────────────────────
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname      = usePathname();
  const activeCountry = useMemo(() => getCountryFromPath(pathname), [pathname]);
  const pageTitle     = useMemo(
    () => getPageTitle(pathname, activeCountry),
    [pathname, activeCountry]
  );

  const closeMobile = () => setMobileOpen(false);

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      style={{
        background:  "#09090b",
        color:       "#e4e4e7",
        fontFamily:  "'Plus Jakarta Sans','DM Sans',Inter,sans-serif",
      }}
    >
      {/* ── Global keyframes ──────────────────────────────────────────── */}
      <style>{`
        @keyframes pdot { 0%,100%{opacity:.3} 50%{opacity:1} }
        ::-webkit-scrollbar        { width:3px; height:3px; }
        ::-webkit-scrollbar-track  { background:transparent; }
        ::-webkit-scrollbar-thumb  { background:rgba(255,255,255,0.08); border-radius:3px; }
      `}</style>

      {/* Subtle dot-grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient corner glows */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(16,185,129,0.07) 0%, transparent 45%)," +
            "radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.05) 0%, transparent 45%)",
        }}
      />

      {/* ── Mobile backdrop ──────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mob-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.72)" }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ───────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-[242px] shrink-0 border-r h-full"
        style={{ background: "#09090b", borderColor: BDR }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar ────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mob-sidebar"
            initial={{ x: -265, opacity: 0 }}
            animate={{ x: 0,    opacity: 1 }}
            exit={{ x: -265,    opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 left-0 z-50 w-[252px] flex flex-col border-r lg:hidden"
            style={{ background: "#09090b", borderColor: BDR }}
          >
            <SidebarContent onNav={closeMobile} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main content column ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopHeader
          mobileOpen={mobileOpen}
          onMobileToggle={() => setMobileOpen((v) => !v)}
          activeCountry={activeCountry}
          pageTitle={pageTitle}
        />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mx-auto w-full max-w-[1660px] px-4 py-5 sm:px-6 lg:px-7 lg:py-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}