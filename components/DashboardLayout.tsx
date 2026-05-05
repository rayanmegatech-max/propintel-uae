"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  className = "h-7 w-auto",
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

function CountrySwitcher({
  activeCountry,
  onNav,
}: {
  activeCountry?: CountryConfig;
  onNav?: () => void;
}) {
  return (
    <div className="px-3">
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Country
      </p>

      <div className="grid grid-cols-2 gap-2">
        {COUNTRY_LIST.map((country) => {
          const active = activeCountry?.slug === country.slug;

          return (
            <Link
              key={country.slug}
              href={country.routeBase}
              onClick={onNav}
              className={[
                "rounded-xl border px-3 py-2 text-center text-xs font-semibold transition",
                active
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200",
              ].join(" ")}
            >
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
      className={[
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-white/10 text-white shadow-sm"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
      ].join(" ")}
    >
      <Icon
        className={[
          "h-4 w-4 shrink-0 transition-colors",
          isActive
            ? "text-emerald-400"
            : "text-slate-500 group-hover:text-slate-300",
        ].join(" ")}
      />

      <span className="flex-1 truncate">{item.label}</span>

      {item.internalOnly && (
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
          Admin
        </span>
      )}

      {item.disabledReason && (
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
          Limited
        </span>
      )}
    </Link>
  );
}

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  const activeCountry = useMemo(() => getCountryFromPath(pathname), [pathname]);
  const navItems = useMemo(() => buildNavItems(activeCountry), [activeCountry]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <Link href="/dashboard" onClick={onNav} aria-label="Go to dashboard">
          <PropIntelLogo className="h-7 w-auto" uid="sidebar" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <CountrySwitcher activeCountry={activeCountry} onNav={onNav} />

        <div className="mt-5 px-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {activeCountry ? `${activeCountry.label} Intelligence` : "GCC Platform"}
          </p>

          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onNav={onNav} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div
        className="border-t border-white/10 px-4 py-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <p className="text-[11px] text-slate-600">© 2026 PropIntel GCC</p>
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
    <div className="flex h-screen bg-slate-950 text-white">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-900 lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />

          <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-slate-900">
            <SidebarContent onNav={closeMobile} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-white/10 bg-slate-900 px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
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
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}