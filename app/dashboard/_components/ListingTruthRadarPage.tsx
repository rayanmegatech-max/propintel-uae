// app/dashboard/_components/ListingTruthRadarPage.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Database,
  Layers3,
  RefreshCcw,
  Shield,
  ShieldCheck,
  Timer,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import ReconOpportunityCard from "./ReconOpportunityCard";
import ReconFiltersBar from "./ReconFiltersBar";
import { formatNumber } from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import {
  DEFAULT_RECON_FILTERS,
  applyReconFilters,
  buildReconFilterOptions,
  hasActiveReconFilters,
  type ReconFilterState,
} from "@/lib/recon/filter";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { KsaReconDataResult } from "@/lib/data/ksaRecon";
import type { UaeReconDataResult } from "@/lib/data/uaeRecon";
import type {
  ReconMetric,
  NormalizedReconOpportunity,
} from "@/lib/recon/types";

// ─── Render cap to keep static/ISR payload under Vercel limits ────────────────
const LISTING_TRUTH_RENDER_LIMIT = 150;

// ─── Design tokens — violet/indigo accent, distinct from all other modules ──
// Emerald = Recon Hub | Cyan = Owner Direct | Amber/Red = Price Drops
// Violet = Listing Truth / Freshness
const C = {
  cardBg: "#111113",
  insetBg: "#0f0f11",
  deepBg: "#0d0d0f",
  wellBg: "#18181b",
  border: "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",
  borderSub: "rgba(255,255,255,0.055)",
  borderInner: "rgba(255,255,255,0.035)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  t4: "#52525b",
  t5: "#3f3f46",
  // Violet — module brand accent
  vi: "#7c3aed",
  viHi: "#a78bfa",
  viBg: "rgba(139,92,246,0.06)",
  viBdr: "rgba(139,92,246,0.18)",
  // Slate-blue — secondary tone for "aged/stale"
  slBg: "rgba(100,116,139,0.06)",
  slBdr: "rgba(100,116,139,0.14)",
  slHi: "#94a3b8",
  // Teal — refresh signal accent
  tl: "#14b8a6",
  tlHi: "#2dd4bf",
  tlBg: "rgba(20,184,166,0.06)",
  tlBdr: "rgba(20,184,166,0.14)",
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────
type ListingTruthRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

type ListingTruthLane = {
  key: string;
  label: string;
  description: string;
  sourceTable: string;
  totalRows: number;
  exportedRows: number;
  items: NormalizedReconOpportunity[];
};

// "all" = all filtered items in the active lane
// "refresh" = items with refresh/inflated signal badge
// "stale" = items with age/time-on-market signal badge
type ViewMode = "all" | "refresh" | "stale";

// ─── Badge signal segment helpers ────────────────────────────────────────────
function hasRefreshSignal(item: NormalizedReconOpportunity): boolean {
  return item.signalBadges.some((b) => {
    const l = b.label.toLowerCase();
    return l.includes("refresh") || l.includes("inflat");
  });
}

function hasStaleSignal(item: NormalizedReconOpportunity): boolean {
  return item.signalBadges.some((b) => {
    const l = b.label.toLowerCase();
    return l.includes("stale") || l.includes("old") || l.includes("age");
  });
}

// ─── Lane builder (pure function, no hooks) ──────────────────────────────────
function buildLanes(
  country: CountryConfig,
  data: UaeReconDataResult | KsaReconDataResult
): ListingTruthLane[] {
  if (country.slug === "uae") {
    const uaeData = data as UaeReconDataResult;

    return [
      {
        key: "listingTruth",
        label: "Listing Truth",
        description: "Freshness and listing history evidence",
        sourceTable: uaeData.lists.listingTruth?.source_table ?? "",
        totalRows: uaeData.lists.listingTruth?.total_rows_available ?? 0,
        exportedRows: uaeData.lists.listingTruth?.exported_rows ?? 0,
        items: uaeData.lists.listingTruth
          ? normalizeReconList(
              uaeData.lists.listingTruth.items,
              "uae",
              uaeData.lists.listingTruth.source_table
            )
          : [],
      },
      {
        key: "refreshInflated",
        label: "Refresh Inflated",
        description: "Refresh or repost-style activity",
        sourceTable: uaeData.lists.refreshInflated?.source_table ?? "",
        totalRows: uaeData.lists.refreshInflated?.total_rows_available ?? 0,
        exportedRows: uaeData.lists.refreshInflated?.exported_rows ?? 0,
        items: uaeData.lists.refreshInflated
          ? normalizeReconList(
              uaeData.lists.refreshInflated.items,
              "uae",
              uaeData.lists.refreshInflated.source_table
            )
          : [],
      },
      {
        key: "stalePriceDrops",
        label: "Stale + Price Drops",
        description:
          "Aged inventory plus price movement",
        sourceTable: uaeData.lists.stalePriceDrops?.source_table ?? "",
        totalRows: uaeData.lists.stalePriceDrops?.total_rows_available ?? 0,
        exportedRows: uaeData.lists.stalePriceDrops?.exported_rows ?? 0,
        items: uaeData.lists.stalePriceDrops
          ? normalizeReconList(
              uaeData.lists.stalePriceDrops.items,
              "uae",
              uaeData.lists.stalePriceDrops.source_table
            )
          : [],
      },
    ]
      .map((lane) => ({
        ...lane,
        items: lane.items.slice(0, LISTING_TRUTH_RENDER_LIMIT),
      }))
      .filter((lane) => lane.items.length > 0);
  }

  const ksaData = data as KsaReconDataResult;

  return [
    {
      key: "refreshInflation",
      label: "Refresh Inflation",
      description:
        "KSA refresh and repost-style listing signals with time-on-market evidence.",
      sourceTable: ksaData.lists.refreshInflation?.source_table ?? "",
      totalRows: ksaData.lists.refreshInflation?.total_rows_available ?? 0,
      exportedRows: ksaData.lists.refreshInflation?.exported_rows ?? 0,
      items: ksaData.lists.refreshInflation
        ? normalizeReconList(
            ksaData.lists.refreshInflation.items,
            "ksa",
            ksaData.lists.refreshInflation.source_table
          )
        : [],
    },
  ]
    .map((lane) => ({
      ...lane,
      items: lane.items.slice(0, LISTING_TRUTH_RENDER_LIMIT),
    }))
    .filter((lane) => lane.items.length > 0);
}

// ─── Compact date ───────────────────────────────────────────────────────────
function compactDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

// ─── Section group label ─────────────────────────────────────────────────────
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[9px] font-black uppercase tracking-[0.16em]"
        style={{ color: C.t5 }}
      >
        {children}
      </span>
      <div className="h-px flex-1" style={{ background: C.borderFt }} />
    </div>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────
function EmptyListingTruthState({
  country,
  message,
}: {
  country: CountryConfig;
  message: string;
}) {
  return (
    <div className="space-y-5">
      <section
        className="rounded-xl border p-6"
        style={{
          background: "rgba(139,92,246,0.04)",
          borderColor: "rgba(139,92,246,0.15)",
        }}
      >
        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <Database className="h-5 w-5" style={{ color: C.viHi }} />
        </div>
        <h1 className="text-lg font-bold" style={{ color: C.t1 }}>
          {country.label} Listing Truth export not loaded
        </h1>
        <p
          className="mt-2 max-w-2xl text-[13px] leading-relaxed"
          style={{ color: "rgba(167,139,250,0.7)" }}
        >
          {message}
        </p>
        <div
          className="mt-4 rounded-lg p-3"
          style={{
            background: "rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[12px] font-medium" style={{ color: C.t2 }}>
            Run locally:
          </p>
          <code
            className="mt-1.5 block rounded-md p-2.5 text-[11px]"
            style={{ background: "rgba(0,0,0,0.3)", color: C.t4 }}
          >
            {country.slug === "uae"
              ? "python tools\\export_uae_recon_frontend_data.py"
              : "python tools\\export_ksa_recon_frontend_data.py"}
          </code>
        </div>
      </section>
    </div>
  );
}

// ─── Safe caveat strip ──────────────────────────────────────────────────────
function SafeCaveatStrip() {
  return (
    <div
      className="flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5"
      style={{
        background: "rgba(139,92,246,0.04)",
        borderColor: "rgba(139,92,246,0.14)",
      }}
    >
      <ShieldCheck
        className="mt-px h-3.5 w-3.5 shrink-0"
        style={{ color: C.viHi }}
      />
      <p className="text-[11px] leading-relaxed" style={{ color: C.t3 }}>
        These are{" "}
        <span className="font-semibold" style={{ color: C.t2 }}>
          public listing evidence signals
        </span>
        , not fraud or misconduct claims. Verify the current source listing before drawing conclusions.
      </p>
    </div>
  );
}

// ─── Data freshness strip ───────────────────────────────────────────────────
function DataStrip({
  exportedAt,
  totalRows,
  exportedRows,
  laneCount,
}: {
  exportedAt: string;
  totalRows: number;
  exportedRows: number;
  laneCount: number;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-lg px-3.5 py-2"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${C.borderFt}`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <Layers3 className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Evidence lanes
        </span>
        <span
          className="text-[10px] font-semibold tabular-nums"
          style={{ color: C.t3 }}
        >
          {laneCount}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Database className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Total rows
        </span>
        <span
          className="text-[10px] font-semibold tabular-nums"
          style={{ color: C.t2 }}
        >
          {totalRows.toLocaleString("en-US")}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Sample loaded
        </span>
        <span
          className="text-[10px] font-semibold tabular-nums"
          style={{ color: C.t3 }}
        >
          {exportedRows.toLocaleString("en-US")}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Shield className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Exported
        </span>
        <span className="text-[10px] font-semibold" style={{ color: C.viHi }}>
          {compactDate(exportedAt)}
        </span>
      </div>
    </div>
  );
}

// ─── Evidence breakdown row ──────────────────────────────────────────────────
// Inset surface — visually secondary to KPI cards above it.
function EvidenceBreakdown({
  lanes,
  refreshCount,
  staleCount,
  singleLane,
}: {
  lanes: ListingTruthLane[];
  refreshCount: number;
  staleCount: number;
  singleLane?: boolean;
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        background: C.insetBg,
        borderColor: C.borderSub,
        boxShadow: "inset 0 1px 0 rgba(0,0,0,0.15)",
      }}
    >
      {/* Per-lane row */}
      <div
        className="grid divide-y sm:divide-x sm:divide-y-0"
        style={{
          gridTemplateColumns: `repeat(${Math.max(lanes.length, 1)}, 1fr)`,
          borderColor: C.borderInner,
        }}
      >
        {lanes.map((lane) => (
          <div
            key={lane.key}
            className={`flex items-center gap-3 px-4 ${singleLane ? "py-2.5" : "py-3"}`}
            style={{ borderColor: C.borderInner }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${C.borderFt}`,
              }}
            >
              <Clock3 className="h-3.5 w-3.5" style={{ color: C.viHi }} />
            </div>
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.07em]"
                style={{ color: C.viHi }}
              >
                {lane.label}
              </p>
              <p
                className="mt-0.5 text-[18px] font-bold tabular-nums leading-none"
                style={{ color: C.t1, letterSpacing: "-0.02em" }}
              >
                {lane.items.length.toLocaleString("en-US")}
              </p>
              <p
                className="mt-0.5 text-[10px] leading-snug"
                style={{ color: C.t5 }}
              >
                {lane.exportedRows.toLocaleString()} exported ·{" "}
                {lane.totalRows.toLocaleString()} total rows
              </p>
              {lane.description && (
                <p
                  className="mt-0.5 text-[9px] leading-snug"
                  style={{ color: C.t5 }}
                >
                  {lane.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Signal summary row (hidden for single lane) */}
      {!singleLane && (
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t px-4 py-2"
          style={{ borderColor: C.borderInner }}
        >
          <div className="flex items-center gap-1.5">
            <RefreshCcw className="h-2.5 w-2.5" style={{ color: C.tlHi }} />
            <span className="text-[10px]" style={{ color: C.t5 }}>
              Refresh signals across sample
            </span>
            <span
              className="text-[10px] font-semibold tabular-nums"
              style={{ color: C.tlHi }}
            >
              {refreshCount.toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Timer className="h-2.5 w-2.5" style={{ color: C.slHi }} />
            <span className="text-[10px]" style={{ color: C.t5 }}>
              Aged inventory signals across sample
            </span>
            <span
              className="text-[10px] font-semibold tabular-nums"
              style={{ color: C.slHi }}
            >
              {staleCount.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lane selector ───────────────────────────────────────────────────────────
function LaneSelector({
  lanes,
  activeLaneKey,
  onLaneChange,
}: {
  lanes: ListingTruthLane[];
  activeLaneKey: string;
  onLaneChange: (key: string) => void;
}) {
  if (lanes.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {lanes.map((lane) => {
        const isActive = lane.key === activeLaneKey;
        return (
          <button
            key={lane.key}
            type="button"
            onClick={() => onLaneChange(lane.key)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-[7px] text-[12px] font-semibold transition-all duration-150"
            style={{
              color: isActive ? C.viHi : C.t3,
              background: isActive ? C.viBg : "rgba(255,255,255,0.025)",
              border: `1px solid ${isActive ? C.viBdr : C.borderFt}`,
              boxShadow: isActive ? "0 0 12px rgba(139,92,246,0.06)" : "none",
            }}
            aria-pressed={isActive}
          >
            {isActive && (
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: C.viHi,
                  boxShadow: "0 0 4px rgba(167,139,250,0.5)",
                }}
              />
            )}
            {lane.label}
            <span
              className="rounded px-1.5 py-[1px] text-[10px] font-bold tabular-nums"
              style={{
                color: isActive ? C.viHi : C.t5,
                background: isActive
                  ? "rgba(139,92,246,0.12)"
                  : "rgba(255,255,255,0.04)",
              }}
            >
              {lane.items.length.toLocaleString("en-US")}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── View mode selector ─────────────────────────────────────────────────────
function ViewModeSelector({
  mode,
  onModeChange,
  counts,
}: {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  counts: { all: number; refresh: number; stale: number };
}) {
  const modes: Array<{ key: ViewMode; label: string; count: number }> = [
    { key: "all", label: "All signals", count: counts.all },
    { key: "refresh", label: "Refresh signals", count: counts.refresh },
    { key: "stale", label: "Aged inventory", count: counts.stale },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {modes.map((m) => {
        const isActive = m.key === mode;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => onModeChange(m.key)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-[7px] text-[12px] font-semibold transition-all duration-150"
            style={{
              color: isActive ? C.viHi : C.t3,
              background: isActive ? C.viBg : "rgba(255,255,255,0.025)",
              border: `1px solid ${isActive ? C.viBdr : C.borderFt}`,
              boxShadow: isActive ? "0 0 12px rgba(139,92,246,0.06)" : "none",
            }}
            aria-pressed={isActive}
          >
            {isActive && (
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: C.viHi,
                  boxShadow: "0 0 4px rgba(167,139,250,0.5)",
                }}
              />
            )}
            {m.label}
            <span
              className="rounded px-1.5 py-[1px] text-[10px] font-bold tabular-nums"
              style={{
                color: isActive ? C.viHi : C.t5,
                background: isActive
                  ? "rgba(139,92,246,0.12)"
                  : "rgba(255,255,255,0.04)",
              }}
            >
              {m.count.toLocaleString("en-US")}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Section divider ────────────────────────────────────────────────────────
function SectionDivider({
  icon: Icon,
  label,
  count,
  accent,
  description,
}: {
  icon: typeof Clock3;
  label: string;
  count: number;
  accent: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-[3px] shrink-0 rounded-full"
          style={{ background: accent }}
        />
        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
        <h2
          className="text-[13px] font-semibold"
          style={{ color: C.t1, letterSpacing: "-0.01em" }}
        >
          {label}
        </h2>
        <span
          className="rounded px-1.5 py-[1px] text-[10px] font-bold tabular-nums"
          style={{
            color: accent,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.borderFt}`,
          }}
        >
          {count}
        </span>
      </div>
      <span className="text-[10px]" style={{ color: C.t5 }}>
        {description}
      </span>
      <div
        className="hidden h-px flex-1 sm:block"
        style={{ background: C.borderFt }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INNER CONTENT — all hooks at the top, no conditional returns before them
// ═══════════════════════════════════════════════════════════════════════════
function ListingTruthContent({
  country,
  lanes,
  exportedAt,
}: {
  country: CountryConfig;
  lanes: ListingTruthLane[];
  exportedAt: string;
}) {
  const [activeLaneKey, setActiveLaneKey] = useState<string>(
    lanes[0]?.key ?? ""
  );
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [filters, setFilters] = useState<ReconFilterState>({
    ...DEFAULT_RECON_FILTERS,
  });

  const isSingleLane = lanes.length === 1;

  // ── Active lane ───────────────────────────────────────────
  const activeLane = useMemo(
    () => lanes.find((l) => l.key === activeLaneKey) ?? lanes[0],
    [lanes, activeLaneKey]
  );

  // Reset view mode and filters when lane changes
  const handleLaneChange = (key: string) => {
    setActiveLaneKey(key);
    setViewMode("all");
    setFilters({ ...DEFAULT_RECON_FILTERS });
  };

  const filterOptions = useMemo(
    () => buildReconFilterOptions(activeLane?.items ?? []),
    [activeLane]
  );

  const filteredItems = useMemo(
    () => applyReconFilters(activeLane?.items ?? [], filters),
    [activeLane, filters]
  );

  const refreshItems = useMemo(
    () => filteredItems.filter(hasRefreshSignal),
    [filteredItems]
  );

  const staleItems = useMemo(
    () => filteredItems.filter(hasStaleSignal),
    [filteredItems]
  );

  const activeItems =
    viewMode === "refresh"
      ? refreshItems
      : viewMode === "stale"
        ? staleItems
        : filteredItems;

  // ── Cross-lane statistics (unfiltered) ────────────────────
  const combinedItems = useMemo(
    () => lanes.flatMap((l) => l.items),
    [lanes]
  );
  const totalRows = lanes.reduce((s, l) => s + l.totalRows, 0);
  const exportedRows = lanes.reduce((s, l) => s + l.exportedRows, 0);
  const refreshSignalCount = combinedItems.filter(hasRefreshSignal).length;
  const staleSignalCount = combinedItems.filter(hasStaleSignal).length;

  // ── KPI metrics — overview level ─────────────────────────
  const sampleDescription = isSingleLane
    ? "Rows in this frontend preview"
    : "Rows in this frontend preview · 500 per lane";

  const metrics: ReconMetric[] = [
    {
      label: "Freshness signals",
      value: formatNumber(totalRows),
      description: "Total rows across all active evidence lanes",
      tone: "cyan",
    },
    {
      label: "Sample loaded",
      value: formatNumber(exportedRows),
      description: sampleDescription,
      tone: "slate",
    },
    {
      label: "Refresh signals",
      value: formatNumber(refreshSignalCount),
      description: "Sample rows with refresh/inflation badge",
      tone: "teal",
    },
    {
      label: "Aged inventory",
      value: formatNumber(staleSignalCount),
      description: "Sample rows with age or time-on-market evidence",
      tone: staleSignalCount > 0 ? "amber" : "slate",
    },
  ];

  const featuredItem = activeItems[0] ?? null;
  const remainingItems = activeItems.slice(1);
  const hasFilters = hasActiveReconFilters(filters);

  // ── Featured label per view mode ──────────────────────────
  const featuredLabel =
    viewMode === "refresh"
      ? "Top refresh signal"
      : viewMode === "stale"
        ? "Top aged inventory signal"
        : "Review first";

  const listLabel =
    viewMode === "refresh"
      ? "Refresh signals"
      : viewMode === "stale"
        ? "Aged inventory signals"
        : `${activeLane?.label ?? "All"} signals`;

  const listAccent =
    viewMode === "refresh"
      ? C.tlHi
      : viewMode === "stale"
        ? C.slHi
        : C.viHi;

  const listDescription =
    viewMode === "refresh"
      ? "Listings with refresh or repost-style signal evidence"
      : viewMode === "stale"
        ? "Listings with age or time-on-market evidence"
        : "Ranked by recon score — verify current source listing";

  return (
    <div className="space-y-5">
      {/* ── 1. Page header ────────────────────────────────────── */}
      <header className="relative">
        {/* Violet hairline */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.25) 30%, rgba(167,139,250,0.08) 70%, transparent 100%)",
          }}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[9px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: C.viHi,
                  background: C.viBg,
                  border: `1px solid ${C.viBdr}`,
                }}
              >
                <Clock3 className="h-2.5 w-2.5" />
                {country.label} Listing Truth
              </span>
              <span
                className="rounded-md px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  color: C.t5,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.border}`,
                }}
              >
                {country.currency}
              </span>
            </div>

            <h1
              className="text-[20px] font-bold tracking-tight sm:text-[24px]"
              style={{ color: C.t1, letterSpacing: "-0.025em" }}
            >
              Freshness & Refresh Signal Review
            </h1>
            <p
              className="mt-0.5 max-w-2xl text-[13px] leading-relaxed"
              style={{ color: C.t4 }}
            >
              Assess which listings show genuine freshness and which carry
              time-on-market, refresh, or aged inventory signals.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:self-end">
            <Link
              href={`${country.routeBase}/recon`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-white/[0.04]"
              style={{ color: C.t3, border: `1px solid ${C.borderFt}` }}
            >
              Recon Hub
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href={country.routeBase}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-white/[0.04]"
              style={{ color: C.t4, border: `1px solid ${C.borderFt}` }}
            >
              {country.label}
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. Safe caveat ────────────────────────────────────── */}
      <SafeCaveatStrip />

      {/* ── 3. Data freshness strip ───────────────────────────── */}
      <DataStrip
        exportedAt={exportedAt}
        totalRows={totalRows}
        exportedRows={exportedRows}
        laneCount={lanes.length}
      />

      {/* Subtle separator */}
      <div className="border-t" style={{ borderColor: C.borderSub }} />

      {/* ── 4. KPI overview row ───────────────────────────────── */}
      <div className="space-y-2">
        <GroupLabel>Overview</GroupLabel>
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {metrics.map((metric) => (
            <ReconMetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      {/* Subtle separator */}
      <div className="border-t" style={{ borderColor: C.borderSub }} />

      {/* ── 5. Evidence breakdown ─────────────────────────────── */}
      <div className="space-y-2">
        <GroupLabel>
          {isSingleLane ? "Evidence summary" : "Evidence lanes"}
        </GroupLabel>
        <EvidenceBreakdown
          lanes={lanes}
          refreshCount={refreshSignalCount}
          staleCount={staleSignalCount}
          singleLane={isSingleLane}
        />
      </div>

      {/* ── 6. Command bar: lane + view mode + filters ────────── */}
      <section
        className="rounded-xl border"
        style={{ background: C.cardBg, borderColor: C.border }}
      >
        <div className="p-3 pb-0 space-y-3">
          {/* Lane selector (only shown when >1 lane) */}
          {lanes.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-black uppercase tracking-[0.16em]"
                  style={{ color: C.t5 }}
                >
                  Evidence lane
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: C.borderFt }}
                />
              </div>
              <LaneSelector
                lanes={lanes}
                activeLaneKey={activeLaneKey}
                onLaneChange={handleLaneChange}
              />
            </div>
          )}

          {/* View mode selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-black uppercase tracking-[0.16em]"
                style={{ color: C.t5 }}
              >
                Signal filter
              </span>
              <div
                className="h-px flex-1"
                style={{ background: C.borderFt }}
              />
            </div>
            {/* Helper line */}
            <p className="text-[10px] leading-snug" style={{ color: C.t5 }}>
              <span style={{ color: C.t4 }}>Refresh signals</span> = listings
              with detected refresh or repost-style activity.{" "}
              <span style={{ color: C.t4 }}>Aged inventory</span> = listings
              with age or time-on-market evidence.
            </p>
            <ViewModeSelector
              mode={viewMode}
              onModeChange={setViewMode}
              counts={{
                all: filteredItems.length,
                refresh: refreshItems.length,
                stale: staleItems.length,
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div
          className="border-t px-4 py-3"
          style={{ borderColor: C.borderFt }}
        >
          <ReconFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            options={filterOptions}
            totalCount={activeLane?.items.length ?? 0}
            filteredCount={filteredItems.length}
          />
        </div>
      </section>

      {/* ── 7. Featured listing ───────────────────────────────── */}
      {featuredItem && (
        <section>
          <div className="mb-2.5 flex items-center gap-2.5">
            <div
              className="h-4 w-[3px] shrink-0 rounded-full"
              style={{ background: C.viHi }}
            />
            <h2
              className="text-[14px] font-semibold"
              style={{ color: C.t1, letterSpacing: "-0.01em" }}
            >
              {featuredLabel}
            </h2>
            <span className="text-[11px]" style={{ color: C.t5 }}>
              · {activeLane?.label ?? ""} lane · Verify first
            </span>
          </div>
          <ReconOpportunityCard
            opportunity={featuredItem}
            variant="featured"
          />
        </section>
      )}

      {/* ── 8. Remaining list ─────────────────────────────────── */}
      {remainingItems.length > 0 && (
        <section>
          <SectionDivider
            icon={
              viewMode === "refresh"
                ? RefreshCcw
                : viewMode === "stale"
                  ? Timer
                  : Clock3
            }
            label={listLabel}
            count={remainingItems.length}
            accent={listAccent}
            description={listDescription}
          />
          <div className="mt-2 space-y-2">
            {remainingItems.map((opportunity) => (
              <ReconOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                variant="list"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state ───────────────────────────────────────── */}
      {activeItems.length === 0 && (
        <div
          className="rounded-xl border p-10 text-center"
          style={{ background: C.cardBg, borderColor: C.border }}
        >
          <p className="text-[13px] font-medium" style={{ color: C.t3 }}>
            No signals match the current lane, view, and filters.
          </p>
          <p className="mt-1.5 text-[11px]" style={{ color: C.t5 }}>
            {hasFilters
              ? "Try adjusting your filters or switching the signal view."
              : "Try selecting a different signal view or evidence lane."}
          </p>
        </div>
      )}

      {/* ── 9. Footer ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3" style={{ color: C.t5 }} />
          <span className="text-[10px]" style={{ color: C.t5 }}>
            Refresh and age signals are public listing evidence — not fraud or
            misconduct claims
          </span>
        </div>
        <Link
          href={`${country.routeBase}/recon`}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-white/[0.04]"
          style={{
            color: C.t4,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Compare with Recon Hub
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT — guards before hooks; delegates to ListingTruthContent
// ═══════════════════════════════════════════════════════════════════════════
export default function ListingTruthRadarPage({
  country,
  data,
}: ListingTruthRadarPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return (
      <EmptyListingTruthState country={country} message={data.message} />
    );
  }

  const lanes = buildLanes(country, data);

  if (lanes.length === 0) {
    return (
      <EmptyListingTruthState
        country={country}
        message={`${country.label} Listing Truth / Refresh Inflation export loaded, but no usable records were available in the local frontend sample.`}
      />
    );
  }

  // exportedAt — use the first available lane's timestamp
  const exportedAt =
    (country.slug === "uae"
      ? (data as UaeReconDataResult).lists.listingTruth?.exported_at ??
        (data as UaeReconDataResult).lists.refreshInflated?.exported_at
      : (data as KsaReconDataResult).lists.refreshInflation?.exported_at) ??
    data.manifest.exported_at;

  return (
    <ListingTruthContent
      country={country}
      lanes={lanes}
      exportedAt={exportedAt}
    />
  );
}