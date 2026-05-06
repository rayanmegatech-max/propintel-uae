"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Building2,
  Database,
  Factory,
  Globe2,
  LayoutDashboard,
  LineChart,
  MapPinned,
  Menu,
  Radar,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
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
  type ProductSectionSlug,
} from "@/lib/countries/productNavigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  internalOnly?: boolean;
  disabledReason?: string;
}

const SECTION_ICON_MAP: Record<ProductSectionSlug, React.ElementType> = {
  recon: Radar,
  "owner-direct": UserCheck,
  "price-drops": TrendingDown,
  "listing-age": RefreshCcw,
  "market-intelligence": LineChart,
  "inventory-pressure": Activity,
  "market-dominance": BarChart3,
  "agency-profiles": Factory,
  "activity-feed": Globe2,
  buildings: Building2,
  communities: MapPinned,
  "data-quality": Database,
};

function getCountryFromPath(pathname: string): CountryConfig | undefined {
  const maybeCountry = pathname.split("/")[2];

  if (maybeCountry && isCountrySlug(maybeCountry)) {
    return getCountryConfig(maybeCountry);
  }

  return undefined;
}

function buildNavItems(country: CountryConfig | undefined): NavItem[] {
  if (!country) {
    return [
      {
        label: "GCC Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "UAE Dashboard",
        href: "/dashboard/uae",
        icon: Building2,
      },
      {
        label: "KSA Dashboard",
        href: "/dashboard/ksa",
        icon: MapPinned,
      },
    ];
  }

  return [
    {
      label: `${country.label} Overview`,
      href: country.routeBase,
      icon: LayoutDashboard,
    },
    ...PRODUCT_SECTIONS.map((section) => ({
      label: section.shortLabel,
      href: `${country.routeBase}/${section.slug}`,
      icon: SECTION_ICON_MAP[section.slug],
      internalOnly: section.internalOnly,
      disabledReason: country.disabledSections?.[section.slug],
    })),
  ];
}

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
      width="210"
      height="40"
      viewBox="0 0 210 40"
      fill="none"
      className={className}
      aria-label="PropIntel GCC"
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
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="48%" stopColor="#14b8a6" />
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
        fontWeight="800"
        letterSpacing="-0.04em"
      >
        <tspan fill="#ffffff">PropIntel</tspan>
        <tspan fill="#14b8a6" fontWeight="500">
          {" "}
          GCC
        </tspan>
      </text>
    </svg>
  );
}

function CountrySwitcher({
  activeCountry,
  onNav,
}: {
  activeCountry?: CountryConfig;
  onNav?: () => void;
}) {
  return (
    <div className="px-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          Country
        </p>
        <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-300">
          GCC
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {COUNTRY_LIST.map((country) => {
          const active = activeCountry?.slug === country.slug;

          return (
            <Link
              key={country.slug}
              href={country.routeBase}
              onClick={onNav}
              className={[
                "relative overflow-hidden rounded-xl border px-3 py-2.5 text-center text-xs font-black transition-all duration-200",
                active
                  ? "border-emerald-400/35 bg-emerald-400/12 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                  : "border-white/[0.08] bg-white/[0.035] text-slate-400 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-slate-100",
              ].join(" ")}
            >
              {active ? (
                <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-emerald-300/70" />
              ) : null}
              {country.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function NavLink({ item, onNav }: { item: NavItem; onNav?: () => void }) {
  const pathname = usePathname();

  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNav}
      title={item.disabledReason ?? item.label}
      className={[
        "group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200",
        isActive
          ? "border-white/[0.13] bg-white/[0.105] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.18)]"
          : item.disabledReason
            ? "border-amber-400/10 bg-amber-400/[0.025] text-slate-500 hover:border-amber-400/20 hover:bg-amber-400/[0.05] hover:text-amber-100"
            : "border-transparent bg-transparent text-slate-400 hover:border-white/[0.08] hover:bg-white/[0.05] hover:text-slate-100",
      ].join(" ")}
    >
      {isActive ? (
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-emerald-300" />
      ) : null}

      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
          isActive
            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
            : item.disabledReason
              ? "border-amber-400/10 bg-amber-400/[0.04] text-amber-400/70"
              : "border-white/[0.06] bg-white/[0.035] text-slate-500 group-hover:text-slate-200",
        ].join(" ")}
      >
        <Icon className="h-3.8 w-3.5" />
      </span>

      <span className="flex-1 truncate">{item.label}</span>

      {item.internalOnly ? (
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-300">
          Admin
        </span>
      ) : null}

      {item.disabledReason ? (
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-300">
          Limited
        </span>
      ) : null}
    </Link>
  );
}

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  const activeCountry = useMemo(() => getCountryFromPath(pathname), [pathname]);
  const navItems = useMemo(() => buildNavItems(activeCountry), [activeCountry]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/[0.08] px-4 py-4">
        <Link href="/dashboard" onClick={onNav} aria-label="Go to dashboard">
          <PropIntelLogo className="h-8 w-auto" uid="sidebar" />
        </Link>

        <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.055] p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
              Intelligence OS
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-emerald-50/65">
            UAE + KSA real-data command center.
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <CountrySwitcher activeCountry={activeCountry} onNav={onNav} />

        <div className="mt-5 px-1">
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            {activeCountry ? `${activeCountry.label} Intelligence` : "GCC Platform"}
          </p>

          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNav={onNav} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div
        className="border-t border-white/[0.08] px-4 py-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-3 py-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldAlert className="h-3.5 w-3.5 text-slate-500" />
            <span>Local preview mode</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-600">© 2026 PropIntel GCC</p>
        </div>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_30%),#020617] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />

      <div className="relative flex h-screen">
        <aside className="hidden w-[274px] shrink-0 border-r border-white/[0.08] bg-slate-950/55 shadow-[20px_0_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl lg:block">
          <SidebarContent />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation overlay"
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={closeMobile}
            />

            <motion.aside
              initial={{ x: -290, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -290, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 w-[284px] border-r border-white/[0.08] bg-slate-950/90 shadow-2xl backdrop-blur-2xl"
            >
              <SidebarContent onNav={closeMobile} />
            </motion.aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center border-b border-white/[0.08] bg-slate-950/70 px-4 backdrop-blur-2xl lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="ml-3">
              <Link href="/dashboard" onClick={closeMobile}>
                <PropIntelLogo className="h-7 w-auto" uid="mobile" />
              </Link>
            </div>
          </header>

          <main
            className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-7 lg:py-6"
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mx-auto w-full max-w-[1660px]"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}