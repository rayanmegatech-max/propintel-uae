// app/dashboard/_components/PriceDropRadarPage.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Database,
  ExternalLink,
  Layers3,
  Shield,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import ReconOpportunityCard from "./ReconOpportunityCard";
import ReconFiltersBar from "./ReconFiltersBar";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import {
  DEFAULT_RECON_FILTERS,
  applyReconFilters,
  buildReconFilterOptions,
  hasActiveReconFilters,
  type ReconFilterState,
} from "@/lib/recon/filter";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type {
  KsaReconDataResult,
  KsaReconListPayload,
} from "@/lib/data/ksaRecon";
import type {
  UaeReconDataResult,
  UaeReconListPayload,
} from "@/lib/data/uaeRecon";
import type {
  ReconMetric,
  NormalizedReconOpportunity,
  ReconCurrency,
} from "@/lib/recon/types";

// ─── Design tokens — amber/red accent, distinct from emerald/cyan ────────────
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
  // Amber — module badge / brand accent
  am: "#f59e0b",
  amHi: "#fbbf24",
  amBg: "rgba(245,158,11,0.06)",
  amBdr: "rgba(245,158,11,0.18)",
  // Red — price drop / movement indicator
  rd: "#f43f5e",
  rdHi: "#fb7185",
  rdBg: "rgba(244,63,94,0.06)",
  rdBdr: "rgba(244,63,94,0.16)",
  // Teal — secondary stat
  tl: "#14b8a6",
  tlHi: "#2dd4bf",
  tlBg: "rgba(20,184,166,0.06)",
  tlBdr: "rgba(20,184,166,0.16)",
} as const;

type PriceDropRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

// "all" = all filtered items
// "strong" = dropPct >= 10% — strong directional signal
// "documented" = dropAmount !== null — exact drop figure available
type ViewMode = "all" | "strong" | "documented";

// ─── Segment helpers ────────────────────────────────────────────────────────
const STRONG_DROP_THRESHOLD = 10; // percent

function isStrongMovement(item: NormalizedReconOpportunity): boolean {
  return item.dropPct !== null && item.dropPct >= STRONG_DROP_THRESHOLD;
}

function isDocumented(item: NormalizedReconOpportunity): boolean {
  return item.dropAmount !== null;
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
function EmptyPriceDropState({
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
          background: "rgba(245,158,11,0.04)",
          borderColor: "rgba(245,158,11,0.15)",
        }}
      >
        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.15)",
          }}
        >
          <Database className="h-5 w-5" style={{ color: C.amHi }} />
        </div>
        <h1 className="text-lg font-bold" style={{ color: C.t1 }}>
          {country.label} Price Drop export not loaded
        </h1>
        <p
          className="mt-2 max-w-2xl text-[13px] leading-relaxed"
          style={{ color: "rgba(251,191,36,0.7)" }}
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
      style={{ background: C.amBg, borderColor: C.amBdr }}
    >
      <ShieldCheck
        className="mt-px h-3.5 w-3.5 shrink-0"
        style={{ color: C.amHi }}
      />
      <p className="text-[11px] leading-relaxed" style={{ color: C.t3 }}>
        These are{" "}
        <span className="font-semibold" style={{ color: C.t2 }}>
          cleaned dashboard-safe price movement signals
        </span>
        . Verify the current advertised price on the source listing before outreach.
      </p>
    </div>
  );
}

// ─── Data freshness strip ───────────────────────────────────────────────────
function DataStrip({
  sourceTable,
  exportedRows,
  totalRows,
  exportedAt,
}: {
  sourceTable: string;
  exportedRows: number;
  totalRows: number;
  exportedAt: string;
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
        <Database className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
        <span className="text-[10px]" style={{ color: C.t5 }}>
          Source
        </span>
        <span className="text-[10px] font-semibold" style={{ color: C.t3 }}>
          {sourceTable}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Layers3 className="h-3 w-3 shrink-0" style={{ color: C.t5 }} />
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
        <span className="text-[10px] font-semibold" style={{ color: C.amHi }}>
          {compactDate(exportedAt)}
        </span>
      </div>
    </div>
  );
}

// ─── Price movement breakdown row ────────────────────────────────────────────
// Inset surface with three horizontal stat items.
// Visually distinct from the KPI card row above it.
function PriceMovementBreakdown({
  strongCount,
  documentedCount,
  averageDropPct,
}: {
  strongCount: number;
  documentedCount: number;
  averageDropPct: number | null;
}) {
  const items = [
    {
      icon: TrendingDown,
      iconColor: C.rdHi,
      label: `≥${STRONG_DROP_THRESHOLD}% movement`,
      value: strongCount.toLocaleString("en-US"),
      note: "Sample rows with strong downward price signal",
    },
    {
      icon: BarChart2,
      iconColor: C.amHi,
      label: "Drop amount known",
      value: documentedCount.toLocaleString("en-US"),
      note: "Sample rows with documented price-drop figure",
    },
    {
      icon: TrendingDown,
      iconColor: C.tlHi,
      label: "Avg movement",
      value:
        averageDropPct !== null
          ? (formatPercent(averageDropPct) ?? "—")
          : "—",
      note: "Average drop % across sample rows with % data",
    },
  ] as const;

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        background: C.insetBg,
        borderColor: C.borderSub,
        boxShadow: "inset 0 1px 0 rgba(0,0,0,0.15)",
      }}
    >
      <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map(({ icon: Icon, iconColor, label, value, note }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:py-4"
            style={{ borderColor: C.borderInner }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${C.borderFt}`,
              }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
            </div>
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.07em]"
                style={{ color: iconColor }}
              >
                {label}
              </p>
              <p
                className="mt-0.5 text-[20px] font-bold tabular-nums leading-none"
                style={{ color: C.t1, letterSpacing: "-0.02em" }}
              >
                {value}
              </p>
              <p
                className="mt-1 text-[10px] leading-snug"
                style={{ color: C.t5 }}
              >
                {note}
              </p>
            </div>
          </div>
        ))}
      </div>
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
  counts: { all: number; strong: number; documented: number };
}) {
  const modes: Array<{ key: ViewMode; label: string; count: number }> = [
    { key: "all", label: "All signals", count: counts.all },
    {
      key: "strong",
      label: `≥${STRONG_DROP_THRESHOLD}% drop`,
      count: counts.strong,
    },
    { key: "documented", label: "Drop amount known", count: counts.documented },
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
              color: isActive ? C.amHi : C.t3,
              background: isActive ? C.amBg : "rgba(255,255,255,0.025)",
              border: `1px solid ${isActive ? C.amBdr : C.borderFt}`,
              boxShadow: isActive
                ? "0 0 12px rgba(245,158,11,0.06)"
                : "none",
            }}
            aria-pressed={isActive}
          >
            {isActive && (
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: C.amHi,
                  boxShadow: "0 0 4px rgba(251,191,36,0.5)",
                }}
              />
            )}
            {m.label}
            <span
              className="rounded px-1.5 py-[1px] text-[10px] font-bold tabular-nums"
              style={{
                color: isActive ? C.amHi : C.t5,
                background: isActive
                  ? "rgba(245,158,11,0.12)"
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
  icon: typeof TrendingDown;
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

// ─── Total drop amount helper (safe — only available when documented) ────────
function computeTotalDropAmount(
  items: NormalizedReconOpportunity[]
): number | null {
  const documented = items.filter((i) => i.dropAmount !== null);
  if (documented.length === 0) return null;
  return documented.reduce((sum, i) => sum + (i.dropAmount ?? 0), 0);
}

function computeAverageDropPct(
  items: NormalizedReconOpportunity[]
): number | null {
  const withPct = items
    .map((i) => i.dropPct)
    .filter((v): v is number => v !== null);
  if (withPct.length === 0) return null;
  return withPct.reduce((s, v) => s + v, 0) / withPct.length;
}

// ═══════════════════════════════════════════════════════════════════════════
// INNER CONTENT — all hooks at the top, no conditional returns before them
// ═══════════════════════════════════════════════════════════════════════════
function PriceDropContent({
  country,
  payload,
}: {
  country: CountryConfig;
  payload: UaeReconListPayload | KsaReconListPayload;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [filters, setFilters] = useState<ReconFilterState>({
    ...DEFAULT_RECON_FILTERS,
  });

  // ── Normalize once ────────────────────────────────────────
  const normalizedAll = useMemo(
    () => normalizeReconList(payload.items, country.slug, payload.source_table),
    [payload, country.slug]
  );

  const filterOptions = useMemo(
    () => buildReconFilterOptions(normalizedAll),
    [normalizedAll]
  );

  const filteredAll = useMemo(
    () => applyReconFilters(normalizedAll, filters),
    [normalizedAll, filters]
  );

  const strongItems = useMemo(
    () => filteredAll.filter(isStrongMovement),
    [filteredAll]
  );

  const documentedItems = useMemo(
    () => filteredAll.filter(isDocumented),
    [filteredAll]
  );

  const activeItems =
    viewMode === "strong"
      ? strongItems
      : viewMode === "documented"
        ? documentedItems
        : filteredAll;

  // ── Unfiltered statistics ─────────────────────────────────
  const totalRows = payload.total_rows_available;
  const exportedRows = payload.exported_rows;

  const withDropPctCount = normalizedAll.filter((i) => i.dropPct !== null).length;
  const withDropAmountCount = normalizedAll.filter(
    (i) => i.dropAmount !== null
  ).length;
  const totalDropAmount = computeTotalDropAmount(normalizedAll);
  const averageDropPct = computeAverageDropPct(normalizedAll);

  // Breakdown counts from full normalized (unfiltered)
  const strongCount = normalizedAll.filter(isStrongMovement).length;
  const documentedCount = normalizedAll.filter(isDocumented).length;

  // ── KPI metrics — overview level ─────────────────────────
  const currency = payload.currency as ReconCurrency;

  const metrics: ReconMetric[] = [
    {
      label: "Price-drop signals",
      value: formatNumber(totalRows),
      description: "Total rows in source table",
      tone: "red",
    },
    {
      label: "Sample loaded",
      value: formatNumber(exportedRows),
      description: "Rows in this frontend preview",
      tone: "slate",
    },
    {
      label: "Drop % available",
      value: formatNumber(withDropPctCount),
      description: "Sample rows with drop percentage data",
      tone: "amber",
    },
    {
      label: "Avg drop",
      value: averageDropPct !== null
        ? (formatPercent(averageDropPct) ?? "—")
        : "—",
      description: "Average price movement % across sample",
      tone: "teal",
    },
  ];

  const featuredItem = activeItems[0] ?? null;
  const remainingItems = activeItems.slice(1);
  const hasFilters = hasActiveReconFilters(filters);

  return (
    <div className="space-y-5">
      {/* ── 1. Page header ────────────────────────────────────── */}
      <header className="relative">
        {/* Amber hairline — distinct from cyan (Owner Direct) and emerald (Recon Hub) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.28) 30%, rgba(251,191,36,0.09) 70%, transparent 100%)",
          }}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[9px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: C.amHi,
                  background: C.amBg,
                  border: `1px solid ${C.amBdr}`,
                }}
              >
                <TrendingDown className="h-2.5 w-2.5" />
                {country.label} Price Drop
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
              Price Movement Review
            </h1>
            <p
              className="mt-0.5 max-w-2xl text-[13px] leading-relaxed"
              style={{ color: C.t4 }}
            >
              Identify repriced public listings — verify current advertised
              price before review or outreach.
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
        sourceTable={payload.source_table}
        exportedRows={exportedRows}
        totalRows={totalRows}
        exportedAt={payload.exported_at}
      />

      {/* ── 4. KPI overview row ───────────────────────────────── */}
      <div className="space-y-2">
        <GroupLabel>Overview</GroupLabel>
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {metrics.map((metric) => (
            <ReconMetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      {/* ── 5. Price movement breakdown ───────────────────────── */}
      {/* Inset surface — clearly secondary to KPI row above */}
      <div className="space-y-2">
        <GroupLabel>Price movement breakdown</GroupLabel>

        {/* Total drop amount — only rendered when documented items exist */}
        {totalDropAmount !== null && withDropAmountCount > 0 && (
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg border px-3.5 py-2"
            style={{
              background: "rgba(244,63,94,0.03)",
              borderColor: "rgba(244,63,94,0.1)",
            }}
          >
            <TrendingDown
              className="h-3 w-3 shrink-0"
              style={{ color: C.rdHi }}
            />
            <span className="text-[10px]" style={{ color: C.t4 }}>
              Sample total drop value
            </span>
            <span
              className="text-[10px] font-bold tabular-nums"
              style={{ color: C.rdHi }}
            >
              {formatCurrency(totalDropAmount, currency)}
            </span>
            <span className="text-[10px]" style={{ color: C.t5 }}>
              across {withDropAmountCount.toLocaleString()} documented rows —
              verify current advertised price on source listing
            </span>
          </div>
        )}

        <PriceMovementBreakdown
          strongCount={strongCount}
          documentedCount={documentedCount}
          averageDropPct={averageDropPct}
        />
      </div>

      {/* ── 6. Signal filter / view mode command bar ──────────── */}
      <section
        className="rounded-xl border"
        style={{ background: C.cardBg, borderColor: C.border }}
      >
        <div className="p-3 pb-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-black uppercase tracking-[0.16em]"
                style={{ color: C.t5 }}
              >
                Price movement filter
              </span>
              <div
                className="h-px flex-1"
                style={{ background: C.borderFt }}
              />
            </div>
            {/* Helper line */}
            <p className="text-[10px] leading-snug" style={{ color: C.t5 }}>
              <span style={{ color: C.t4 }}>
                ≥{STRONG_DROP_THRESHOLD}% drop
              </span>{" "}
              = strong directional signal.{" "}
              <span style={{ color: C.t4 }}>Drop amount known</span> = exact
              price-drop figure available from export.
            </p>
            <ViewModeSelector
              mode={viewMode}
              onModeChange={setViewMode}
              counts={{
                all: filteredAll.length,
                strong: strongItems.length,
                documented: documentedItems.length,
              }}
            />
          </div>
        </div>

        <div
          className="border-t px-4 py-3"
          style={{ borderColor: C.borderFt }}
        >
          <ReconFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            options={filterOptions}
            totalCount={normalizedAll.length}
            filteredCount={filteredAll.length}
          />
        </div>
      </section>

      {/* ── 7. Featured top repriced listing ──────────────────── */}
      {featuredItem && (
        <section>
          <div className="mb-2.5 flex items-center gap-2.5">
            <div
              className="h-4 w-[3px] shrink-0 rounded-full"
              style={{ background: C.rdHi }}
            />
            <h2
              className="text-[14px] font-semibold"
              style={{ color: C.t1, letterSpacing: "-0.01em" }}
            >
              {viewMode === "strong"
                ? "Top strong price movement"
                : viewMode === "documented"
                  ? "Top documented price drop"
                  : "Top repriced listing"}
            </h2>
            <span className="text-[11px]" style={{ color: C.t5 }}>
              · Verify first
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
              viewMode === "strong"
                ? TrendingDown
                : viewMode === "documented"
                  ? BarChart2
                  : Layers3
            }
            label={
              viewMode === "strong"
                ? `Strong price movement (≥${STRONG_DROP_THRESHOLD}%)`
                : viewMode === "documented"
                  ? "Documented price drops"
                  : "All repriced listings"
            }
            count={remainingItems.length}
            accent={
              viewMode === "strong"
                ? C.rdHi
                : viewMode === "documented"
                  ? C.amHi
                  : C.t3
            }
            description={
              viewMode === "strong"
                ? "Verify current advertised price on source listing"
                : viewMode === "documented"
                  ? "Drop amount available from export data"
                  : "Ranked by recon score"
            }
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
            No repriced listings match the current view and filters.
          </p>
          <p className="mt-1.5 text-[11px]" style={{ color: C.t5 }}>
            {hasFilters
              ? "Try adjusting your filters or switching the price movement view."
              : "Try selecting a different price movement view."}
          </p>
        </div>
      )}

      {/* ── 9. Footer nav ─────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <ExternalLink className="h-3 w-3" style={{ color: C.t5 }} />
          <span className="text-[10px]" style={{ color: C.t5 }}>
            Always verify current advertised price on source listing before outreach
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
// EXPORT — guards before hooks, delegates to PriceDropContent
// ═══════════════════════════════════════════════════════════════════════════
export default function PriceDropRadarPage({
  country,
  data,
}: PriceDropRadarPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyPriceDropState country={country} message={data.message} />;
  }

  const priceDropPayload = data.lists.priceDrops;

  if (!priceDropPayload || priceDropPayload.items.length === 0) {
    return (
      <EmptyPriceDropState
        country={country}
        message={`${country.label} Price Drop export loaded, but no price-drop records were available in the local frontend sample.`}
      />
    );
  }

  return <PriceDropContent country={country} payload={priceDropPayload} />;
}
