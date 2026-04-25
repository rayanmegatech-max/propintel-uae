"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Coffee,
  Crosshair,
  TrendingUp,
  Building2,
  Swords,
  BarChart3,
  Newspaper,
  Clock,
  UserPlus,
  DollarSign,
  Calculator,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = "count" | "alert";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: {
    text: string;
    variant: BadgeVariant;
  };
}

// ─── Navigation Definition ────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Market Overview", href: "/dashboard", icon: Coffee },
  { label: "Arbitrage Sniper", href: "/dashboard/arbitrage", icon: Crosshair, badge: { text: "3", variant: "count" } },
  { label: "ReEstimate™", href: "/dashboard/reestimate", icon: TrendingUp },
  { label: "Commercial Intel", href: "/dashboard/commercial", icon: Building2 },
  { label: "War Room", href: "/dashboard/war-room", icon: Swords, badge: { text: "!", variant: "alert" } },
  { label: "Developer SOV", href: "/dashboard/developer-sov", icon: BarChart3 },
  { label: "Morning Brief", href: "/dashboard/morning-brief", icon: Newspaper },
  { label: "True Listing Age", href: "/dashboard/true-listing-age", icon: Clock },
  { label: "FSBO Lead Magnet", href: "/dashboard/fsbo", icon: UserPlus },
  { label: "Investor Yield Engine", href: "/dashboard/yield-engine", icon: DollarSign },
  { label: "Smart Pricing", href: "/dashboard/smart-pricing", icon: Calculator },
  { label: "Rival Radar", href: "/dashboard/rival-radar", icon: AlertTriangle, badge: { text: "!", variant: "alert" } },
];

// ─── Brand Logo ───────────────────────────────────────────────────────────────

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

// ─── Badge Component ──────────────────────────────────────────────────────────

function NavBadge({ badge }: { badge: NavItem["badge"] }) {
  if (!badge) return null;
  const base =
    "inline-flex items-center justify-center rounded-full text-[10px] font-bold leading-none px-1.5 py-0.5 min-w-[18px]";
  const variants: Record<BadgeVariant, string> = {
    count: "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30",
    alert: "bg-red-500/20 text-red-400 ring-1 ring-red-500/30",
  };
  return (
    <span className={`${base} ${variants[badge.variant]}`}>{badge.text}</span>
  );
}

// ─── Nav Item Component ───────────────────────────────────────────────────────

function NavLink({
  item,
  onNav,
}: {
  item: NavItem;
  onNav?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNav}
      className={`
        group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
        transition-all duration-150
        ${
          isActive
            ? "bg-white/10 text-white shadow-sm"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
        }
      `}
    >
      <Icon
        className={`h-4 w-4 shrink-0 transition-colors ${
          isActive
            ? "text-blue-400"
            : "text-slate-500 group-hover:text-slate-300"
        }`}
      />
      <span className="flex-1 truncate">{item.label}</span>
      <NavBadge badge={item.badge} />
    </Link>
  );
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────

function SidebarContent({ onNav }: { onNav?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <PropIntelLogo className="h-7 w-auto" uid="sidebar" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Agent Tools
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onNav={onNav} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="border-t border-white/10 px-4 py-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <p className="text-[11px] text-slate-600">© 2026 PropIntel UAE</p>
      </div>
    </div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-slate-900 lg:block">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <aside className="absolute inset-y-0 left-0 w-56 border-r border-white/10 bg-slate-900">
            <SidebarContent onNav={closeMobile} />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center border-b border-white/10 bg-slate-900 px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="ml-3">
            <PropIntelLogo className="h-7 w-auto" uid="mobile" />
          </div>
        </header>

        {/* Page content */}
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