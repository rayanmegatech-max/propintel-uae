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
  ShieldCheck,
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

// ─── Design tokens ────────────────────────────────────────────────────────────
// Graphite/zinc terminal. Emerald = active/live only. Amber = caution only.
// No cyan. No blue. No corner glows. No dot grid.
const C = {
  pageBg:   "#09090b",   // zinc-950 — page, main area
  sideBg:   "#0c0c0e",   // near-black — sidebar
  cardBg:   "#111113",   // active nav surface
  wellBg:   "#18181b",   // zinc-900 — toggle active pill
  border:   "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",

  // Text hierarchy
  t1: "#f4f4f5",  // primary labels
  t2: "#a1a1aa",  // secondary / inactive nav
  t3: "#52525b",  // muted (section headers, chips)
  t4: "#3f3f46",  // dim (disabled items, footer meta)

  // Emerald — ONLY: active nav bar, live dot, notification dot, avatar gradient top
  em:   "#10b981",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.07)",

  // Amber — ONLY: Limited badge
  am:    "#fbbf24",
  amBg:  "rgba(245,158,11,0.07)",
  amBdr: "rgba(245,158,11,0.14)",

  // Violet — ONLY: AI engine footer chip
  vi:    "#c4b5fd",
  viBg:  "rgba(139,92,246,0.07)",
  viBdr: "rgba(139,92,246,0.14)",
} as const;

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

// ─── Section → icon ───────────────────────────────────────────────────────────
const SECTION_ICON: Record<ProductSectionSlug, React.ElementType> = {
  recon:                 Radar,
  "ai-recon":            Radar,
  "market-radar":        Activity,
  "competitor-radar":    ShieldCheck,
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

// ─── Nav groups ───────────────────────────────────────────────────────────────
const GROUP_DEFS: { label: string; slugs: ProductSectionSlug[] }[] = [
  {
    label: "Opportunities",
    slugs: ["recon", "owner-direct", "price-drops", "listing-age"],
  },
  {
    label: "Market",
    slugs: [
      "market-radar",
      "competitor-radar",
      "market-intelligence",
      "inventory-pressure",
      "market-dominance",
      "agency-profiles",
      "activity-feed",
    ],
  },
  {
    label: "Intelligence",
    slugs: ["buildings", "communities"],
  },
  {
    label: "Admin",
    slugs: ["data-quality"],
  },
];

// ─── Route helpers ────────────────────────────────────────────────────────────
function countryFromPath(pathname: string): CountryConfig | undefined {
  const seg = pathname.split("/")[2];
  if (seg && isCountrySlug(seg)) return getCountryConfig(seg);
  return undefined;
}

function deriveTitle(
  pathname: string,
  country: CountryConfig | undefined
): string {
  if (!country) return "GCC Overview";
  const slug = pathname.split("/")[3];
  if (!slug) return `${country.label} Overview`;
  return getProductSection(slug)?.label ?? `${country.label} Overview`;
}

function buildGroups(country: CountryConfig | undefined): NavGroup[] {
  // GCC root — no country selected
  if (!country) {
    return [
      {
        label: "Command",
        items: [
          { label: "GCC Overview",  href: "/dashboard",     icon: LayoutDashboard },
          { label: "UAE Dashboard", href: "/dashboard/uae", icon: Building2       },
          { label: "KSA Dashboard", href: "/dashboard/ksa", icon: MapPinned       },
        ],
      },
    ];
  }

  // Country selected — overview + grouped product sections
  const groups: NavGroup[] = [
    {
      label: "Command",
      items: [
        {
          label: `${country.label} Overview`,
          href:  country.routeBase,
          icon:  LayoutDashboard,
        },
      ],
    },
  ];

  for (const def of GROUP_DEFS) {
    const items = def.slugs
      .map<NavItem | null>((slug) => {
        const sec = PRODUCT_SECTIONS.find((s) => s.slug === slug);
        // Exclude completely if not found or explicitly hidden from sidebar
        if (!sec || sec.isHidden) return null;
        return {
          label:          sec.shortLabel,
          href:           `${country.routeBase}/${sec.slug}`,
          icon:           SECTION_ICON[sec.slug],
          internalOnly:   sec.internalOnly,
          disabledReason: country.disabledSections?.[sec.slug],
        };
      })
      .filter((item): item is NavItem => item !== null);

    if (items.length) groups.push({ label: def.label, items });
  }

  return groups;
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function LiveDot({ size = 5 }: { size?: number }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width:      size,
        height:     size,
        background: C.em,
        animation:  "livepulse 2.8s ease-in-out infinite",
      }}
    />
  );
}

// ─── Logo — Wordmark-first with emerald accent ────────────────────────────────
// Clean, premium B2B SaaS lockup. No complex icon, no grid, no house, no radar.
// A subtle emerald vertical bar adds brand colour without being noisy.
function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="RASAD — GCC Real Estate Intelligence">
      {/* Emerald vertical accent bar */}
      <div
        style={{
          width: "2px",
          height: "18px",
          background: C.em,
          borderRadius: "1px",
        }}
      />
      <div className="flex flex-col">
        <span
          style={{
            color: C.t1,
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            lineHeight: 1.2,
          }}
        >
          RASAD
        </span>
        <span
          style={{
            color: C.t2,
            fontSize: "9px",
            fontWeight: 500,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          Real Estate Intelligence
        </span>
      </div>
    </div>
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
    <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: C.border }}>
      <div
        className="flex gap-1 p-[3px] rounded-[10px]"
        style={{ background: "#050507" }}
      >
        {COUNTRY_LIST.map((c) => {
          const active = activeCountry?.slug === c.slug;
          return (
            <Link
              key={c.slug}
              href={c.routeBase}
              onClick={onNav}
              className="flex-1 text-center py-[5px] rounded-[8px] text-[12px] font-semibold transition-all duration-200"
              style={{
                color:      active ? C.t1 : C.t3,
                background: active ? C.wellBg : undefined,
                boxShadow:  active ? "0 1px 4px rgba(0,0,0,0.4)" : undefined,
              }}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 mt-2.5 pl-0.5">
        <LiveDot size={5} />
        <span
          className="text-[11px]"
          style={{ fontFamily: "'DM Mono',monospace", color: C.t3 }}
        >
          {activeCountry
            ? `${activeCountry.currency} · Live`
            : "GCC · Live"}
        </span>
      </div>
    </div>
  );
}

// ─── Nav link ─────────────────────────────────────────────────────────────────
function NavLink({ item, onNav }: { item: NavItem; onNav?: () => void }) {
  const pathname  = usePathname();
  const isActive  = item.href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isLimited = !!item.disabledReason;
  const isAdmin   = !!item.internalOnly && !isLimited;
  const Icon      = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNav}
      title={item.disabledReason ?? item.label}
      className="relative flex items-center gap-2.5 px-3 py-[8px] rounded-[10px] group transition-all duration-150"
      style={{ background: isActive ? C.cardBg : undefined }}
    >
      {/* Emerald left accent bar — active only */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
          style={{ width: "2px", height: "14px", background: C.em }}
        />
      )}

      {/* Hover tint — inactive only */}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150"
          style={{ background: "rgba(255,255,255,0.025)" }}
        />
      )}

      {/* Icon */}
      <span
        className="relative z-10 shrink-0"
        style={{
          color: isActive  ? C.emHi
               : isLimited ? C.t4
               : C.t3,
        }}
      >
        <Icon className="w-[14px] h-[14px]" />
      </span>

      {/* Label */}
      <span
        className="relative z-10 flex-1 truncate text-[13px] font-medium"
        style={{
          color: isActive  ? C.t1
               : isLimited ? C.t4
               : C.t2,
        }}
      >
        {item.label}
      </span>

      {/* Limited badge */}
      {isLimited && (
        <span
          className="relative z-10 shrink-0 text-[9px] font-semibold uppercase tracking-wide rounded px-1.5 py-[2px]"
          style={{ color: C.am, background: C.amBg, border: `1px solid ${C.amBdr}` }}
        >
          Limited
        </span>
      )}

      {/* Admin badge */}
      {isAdmin && (
        <span
          className="relative z-10 shrink-0 text-[9px] font-medium uppercase tracking-wide rounded px-1.5 py-[2px]"
          style={{
            color:      C.t3,
            background: "rgba(255,255,255,0.04)",
            border:     `1px solid ${C.borderFt}`,
          }}
        >
          Admin
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar inner ────────────────────────────────────────────────────────────
function SidebarInner({ onNav }: { onNav?: () => void }) {
  const pathname      = usePathname();
  const activeCountry = useMemo(() => countryFromPath(pathname), [pathname]);
  const groups        = useMemo(() => buildGroups(activeCountry), [activeCountry]);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className="relative flex items-center px-5 py-[17px] border-b shrink-0"
        style={{ borderColor: C.border }}
      >
        <Link href="/dashboard" onClick={onNav} aria-label="RASAD home">
          <Logo />
        </Link>

        {/* Mobile close — only when onNav is provided (mobile mode) */}
        {onNav && (
          <button
            type="button"
            onClick={onNav}
            aria-label="Close navigation"
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden transition-colors"
            style={{ color: C.t3 }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Country switcher */}
      <CountrySwitcher activeCountry={activeCountry} onNav={onNav} />

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
        style={{ scrollbarWidth: "none" }}
      >
        {groups.map((g) => (
          <div key={g.label}>
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.14em] mb-1 px-3"
              style={{ color: C.t4 }}
            >
              {g.label}
            </p>
            <div className="space-y-0.5">
              {g.items.map((item) => (
                <NavLink key={item.href} item={item} onNav={onNav} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4 border-t space-y-3 shrink-0"
        style={{
          borderColor:   C.border,
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* AI / local preview chip */}
        <div
          className="rounded-xl px-3.5 py-2.5 border"
          style={{ background: C.viBg, borderColor: C.viBdr }}
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-[11px] h-[11px] shrink-0" style={{ color: C.vi }} />
            <span
              className="text-[10px] font-medium tracking-[0.1em] flex-1"
              style={{ fontFamily: "'DM Mono',monospace", color: C.vi }}
            >
              Local Preview
            </span>
            <span
              className="inline-block w-[5px] h-[5px] rounded-full shrink-0"
              style={{ background: C.vi, animation: "livepulse 2.8s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* User row */}
        <div className="flex items-center gap-2.5 pl-0.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: "linear-gradient(145deg,#10b981,#065f46)" }}
          >
            A
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: C.t1 }}>
              Analyst
            </p>
            <p className="text-[10px] truncate" style={{ color: C.t4 }}>
              © 2026 RASAD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({
  mobileOpen,
  onToggle,
  activeCountry,
  title,
}: {
  mobileOpen: boolean;
  onToggle: () => void;
  activeCountry?: CountryConfig;
  title: string;
}) {
  return (
    <header
      className="shrink-0 h-[52px] flex items-center px-5 sm:px-6 gap-4 border-b z-10"
      style={{
        background:     "rgba(9,9,11,0.94)",
        borderColor:    C.border,
        backdropFilter: "blur(14px)",
      }}
    >
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle navigation"
        className="lg:hidden shrink-0 transition-colors"
        style={{ color: C.t3 }}
      >
        {mobileOpen
          ? <X className="w-[18px] h-[18px]" />
          : <Menu className="w-[18px] h-[18px]" />}
      </button>

      {/* Mobile logo */}
      <div className="lg:hidden shrink-0">
        <Link href="/dashboard"><Logo /></Link>
      </div>

      {/* Desktop: title + context chips */}
      <div className="hidden lg:flex items-center gap-3 min-w-0">
        <h1
          className="text-[15px] font-semibold tracking-tight truncate"
          style={{ color: C.t1 }}
        >
          {title}
        </h1>

        {activeCountry && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Country — graphite only, no colour */}
            <span
              className="text-[11px] font-medium rounded-md px-2 py-[3px]"
              style={{
                color:      C.t2,
                background: "rgba(255,255,255,0.05)",
                border:     `1px solid ${C.border}`,
              }}
            >
              {activeCountry.label}
            </span>

            {/* Currency — mono, dimmer */}
            <span
              className="text-[11px] rounded-md px-2 py-[3px]"
              style={{
                fontFamily: "'DM Mono',monospace",
                color:      C.t3,
                background: "rgba(255,255,255,0.03)",
                border:     `1px solid ${C.borderFt}`,
              }}
            >
              {activeCountry.currency}
            </span>

            {/* Live — emerald dot + plain text, no pill */}
            <span className="flex items-center gap-[5px]">
              <LiveDot size={5} />
              <span className="text-[11px]" style={{ color: C.t3 }}>
                Live
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Desktop search */}
        <div
          className="hidden md:flex items-center gap-2 rounded-xl px-3.5 py-[6px] border"
          style={{
            background:  "#050507",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: C.t4 }} />
          <input
            type="text"
            placeholder="Search listings…"
            readOnly
            className="bg-transparent border-none outline-none text-[13px] w-36 min-w-0 cursor-pointer"
            style={{ color: C.t1 }}
          />
          <span
            className="text-[10px] border rounded px-[5px] py-px ml-1 shrink-0"
            style={{
              fontFamily:  "'DM Mono',monospace",
              color:       C.t4,
              borderColor: C.borderFt,
            }}
          >
            ⌘K
          </span>
        </div>

        {/* Mobile search icon */}
        <button
          type="button"
          aria-label="Search"
          className="md:hidden transition-colors"
          style={{ color: C.t3 }}
        >
          <Search className="w-[17px] h-[17px]" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative transition-colors"
          style={{ color: C.t3 }}
        >
          <Bell className="w-[17px] h-[17px]" />
          <span
            className="absolute -top-[2px] -right-[2px] w-[5px] h-[5px] rounded-full"
            style={{ background: C.em }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 select-none"
          style={{ background: "linear-gradient(145deg,#10b981,#065f46)" }}
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
  const activeCountry = useMemo(() => countryFromPath(pathname), [pathname]);
  const title         = useMemo(
    () => deriveTitle(pathname, activeCountry),
    [pathname, activeCountry]
  );

  const closeMobile = () => setMobileOpen(false);

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      style={{ background: C.pageBg, color: C.t1 }}
    >
      <style>{`
        @keyframes livepulse { 0%,100%{opacity:.22} 50%{opacity:1} }
        ::-webkit-scrollbar        { width:3px; height:3px; }
        ::-webkit-scrollbar-track  { background:transparent; }
        ::-webkit-scrollbar-thumb  { background:rgba(255,255,255,0.06); border-radius:3px; }
      `}</style>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-[236px] shrink-0 border-r h-full"
        style={{ background: C.sideBg, borderColor: C.border }}
      >
        <SidebarInner />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mob"
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-y-0 left-0 z-50 w-[248px] flex flex-col border-r lg:hidden"
            style={{ background: C.sideBg, borderColor: C.border }}
          >
            <SidebarInner onNav={closeMobile} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Header
          mobileOpen={mobileOpen}
          onToggle={() => setMobileOpen((v) => !v)}
          activeCountry={activeCountry}
          title={title}
        />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            background:    C.pageBg,
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
        >
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto w-full max-w-[1660px] px-4 py-5 sm:px-6 lg:px-7 lg:py-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}