// app/dashboard/_components/OwnerDirectRadarPage.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  ExternalLink,
  Globe,
  Layers3,
  Phone,
  Shield,
  ShieldCheck,
  Users,
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
} from "@/lib/recon/types";

// ─── Design tokens ───────────────────────────────────────────────────────────
// Cyan accent throughout — distinct from Recon Hub's emerald
const C = {
  cardBg: "#111113",
  cardBgLift: "#131315",   // slightly lifted surface for KPI section
  wellBg: "#18181b",
  deepBg: "#0d0d0f",
  insetBg: "#0f0f11",       // inset/secondary surface for breakdown row
  border: "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",
  borderSub: "rgba(255,255,255,0.055)",
  borderInner: "rgba(255,255,255,0.035)", // subtle inner dividers
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  t4: "#52525b",
  t5: "#3f3f46",
  cy: "#06b6d4",
  cyHi: "#22d3ee",
  cyBg: "rgba(34,211,238,0.06)",
  cyBdr: "rgba(34,211,238,0.18)",
  em: "#10b981",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.06)",
  am: "#fbbf24",
  amBg: "rgba(245,158,11,0.05)",
  amBdr: "rgba(245,158,11,0.14)",
} as const;

type OwnerDirectRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

type ViewMode = "all" | "contactable" | "source-led";

// ─── Segment helpers ────────────────────────────────────────────────────────
function isContactable(item: NormalizedReconOpportunity): boolean {
  return item.hasPhone || item.hasWhatsapp || item.hasEmail;
}

function isSourceLed(item: NormalizedReconOpportunity): boolean {
  return !isContactable(item) && Boolean(item.listingUrl);
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
// Light overline label to visually group and separate top-half sections
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
function EmptyOwnerDirectState({
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
          <Database className="h-5 w-5" style={{ color: "#fbbf24" }} />
        </div>
        <h1 className="text-lg font-bold" style={{ color: C.t1 }}>
          {country.label} Owner / Direct export not loaded
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

// ─── View mode selector ─────────────────────────────────────────────────────
function ViewModeSelector({
  mode,
  onModeChange,
  counts,
}: {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  counts: { all: number; contactable: number; sourceLed: number };
}) {
  const modes: Array<{ key: ViewMode; label: string; count: number }> = [
    { key: "all", label: "All signals", count: counts.all },
    { key: "contactable", label: "Contactable", count: counts.contactable },
    { key: "source-led", label: "Source-led", count: counts.sourceLed },
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
              color: isActive ? C.cyHi : C.t3,
              background: isActive ? C.cyBg : "rgba(255,255,255,0.025)",
              border: `1px solid ${isActive ? C.cyBdr : C.borderFt}`,
              boxShadow: isActive
                ? "0 0 12px rgba(34,211,238,0.06)"
                : "none",
            }}
            aria-pressed={isActive}
          >
            {isActive && (
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: C.cyHi,
                  boxShadow: "0 0 4px rgba(34,211,238,0.5)",
                }}
              />
            )}
            {m.label}
            <span
              className="rounded px-1.5 py-[1px] text-[10px] font-bold tabular-nums"
              style={{
                color: isActive ? C.cyHi : C.t5,
                background: isActive
                  ? "rgba(34,211,238,0.1)"
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

// ─── Safe caveat strip ──────────────────────────────────────────────────────
function SafeCaveatStrip() {
  return (
    <div
      className="flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5"
      style={{ background: C.amBg, borderColor: C.amBdr }}
    >
      <ShieldCheck
        className="mt-px h-3.5 w-3.5 shrink-0"
        style={{ color: C.am }}
      />
      <p className="text-[11px] leading-relaxed" style={{ color: C.t3 }}>
        This page shows{" "}
        <span className="font-semibold" style={{ color: C.t2 }}>
          owner/direct-style public listing signals
        </span>
        , not guaranteed private-owner leads. Verify before outreach.
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
        <span className="text-[10px] font-semibold" style={{ color: C.cyHi }}>
          {compactDate(exportedAt)}
        </span>
      </div>
    </div>
  );
}

// ─── Qualification breakdown row ─────────────────────────────────────────────
// A single inset surface with three horizontal stat items separated by dividers.
// Visually distinct from the KPI card row above it.
function QualificationBreakdown({
  contactableCount,
  sourceLedCount,
  agencyCount,
}: {
  contactableCount: number;
  sourceLedCount: number;
  agencyCount: number;
}) {
  const items = [
    {
      icon: Phone,
      iconColor: C.emHi,
      label: "Contact-ready",
      value: contactableCount,
      note: "Phone, WhatsApp, or email signal in sample",
    },
    {
      icon: Globe,
      iconColor: C.cyHi,
      label: "Source-led",
      value: sourceLedCount,
      note: "URL path only — verify before outreach",
    },
    {
      icon: Users,
      iconColor: C.am,
      label: "Agencies",
      value: agencyCount,
      note: "Distinct agencies in sample",
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
      <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}
      >
        {items.map(({ icon: Icon, iconColor, label, value, note }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:py-4"
            style={{
              borderColor: C.borderInner,
            }}
          >
            {/* Icon */}
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${C.borderFt}`,
              }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
            </div>

            {/* Text */}
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
                {value.toLocaleString("en-US")}
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

// ─── Section divider ────────────────────────────────────────────────────────
function SectionDivider({
  icon: Icon,
  label,
  count,
  accent,
  description,
}: {
  icon: typeof Phone;
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
function OwnerDirectContent({
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

  const contactableItems = useMemo(
    () => filteredAll.filter(isContactable),
    [filteredAll]
  );
  const sourceItems = useMemo(
    () => filteredAll.filter(isSourceLed),
    [filteredAll]
  );

  const activeItems =
    viewMode === "contactable"
      ? contactableItems
      : viewMode === "source-led"
        ? sourceItems
        : filteredAll;

  // ── Unfiltered statistics (from full normalized list) ─────
  const totalRows = payload.total_rows_available;
  const exportedRows = payload.exported_rows;
  const contactableCount = normalizedAll.filter(isContactable).length;
  // urlReadyCount = ALL items with listingUrl (incl. contactable ones) — for overview KPI
  const urlReadyCount = normalizedAll.filter((i) => i.listingUrl).length;
  // sourceLedCount = items that are URL-only (no contact) — for breakdown card
  const sourceLedCount = normalizedAll.filter(isSourceLed).length;
  const agencyCount = new Set(
    normalizedAll
      .map((i) => i.agencyName)
      .filter((v): v is string => Boolean(v))
  ).size;

  // ── KPI metrics — overview-level numbers ─────────────────
  // "URL-ready" replaces the old "Source-led" KPI to avoid conflict
  // with the breakdown row's "Source-led" card (which is URL-only).
  const metrics: ReconMetric[] = [
    {
      label: "Owner/direct signals",
      value: formatNumber(totalRows),
      description: "Total rows in source table",
      tone: "cyan",
    },
    {
      label: "Sample loaded",
      value: formatNumber(exportedRows),
      description: "Rows in this frontend preview",
      tone: "slate",
    },
    {
      label: "Contactable",
      value: formatNumber(contactableCount),
      description: "Sample rows with phone, WhatsApp, or email",
      tone: "emerald",
    },
    {
      label: "URL-ready",
      value: formatNumber(urlReadyCount),
      description: "Rows in sample with source URL path",
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
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.3) 30%, rgba(34,211,238,0.1) 70%, transparent 100%)",
          }}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[9px] font-black uppercase tracking-[0.16em]"
                style={{
                  color: C.cyHi,
                  background: C.cyBg,
                  border: `1px solid ${C.cyBdr}`,
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: C.cyHi,
                    boxShadow: "0 0 6px rgba(34,211,238,0.6)",
                  }}
                />
                {country.label} Owner / Direct
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
              Owner / Direct Signal Review
            </h1>
            <p
              className="mt-0.5 max-w-2xl text-[13px] leading-relaxed"
              style={{ color: C.t4 }}
            >
              Qualify owner/direct-style signals — review contactable leads and
              source-led opportunities before outreach.
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

      {/* ── 5. Qualification breakdown ────────────────────────── */}
      {/* Visually distinct from KPI row: single inset surface, horizontal layout */}
      <div className="space-y-2">
        <GroupLabel>Qualification breakdown</GroupLabel>
        <QualificationBreakdown
          contactableCount={contactableCount}
          sourceLedCount={sourceLedCount}
          agencyCount={agencyCount}
        />
      </div>

      {/* ── 6. Signal qualification + filters ─────────────────── */}
      <section
        className="rounded-xl border"
        style={{ background: C.cardBg, borderColor: C.border }}
      >
        <div className="p-3 pb-0">
          <div className="space-y-2">
            {/* Header row */}
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-black uppercase tracking-[0.16em]"
                style={{ color: C.t5 }}
              >
                Signal qualification
              </span>
              <div
                className="h-px flex-1"
                style={{ background: C.borderFt }}
              />
            </div>

            {/* Helper line explaining what each mode means */}
            <p className="text-[10px] leading-snug" style={{ color: C.t5 }}>
              <span style={{ color: C.t4 }}>Contactable</span>
              {" "}= phone, WhatsApp, or email signal.{" "}
              <span style={{ color: C.t4 }}>Source-led</span>
              {" "}= source URL path without a direct contact signal.
            </p>

            <ViewModeSelector
              mode={viewMode}
              onModeChange={setViewMode}
              counts={{
                all: filteredAll.length,
                contactable: contactableItems.length,
                sourceLed: sourceItems.length,
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

      {/* ── 7. Featured lead ──────────────────────────────────── */}
      {featuredItem && (
        <section>
          <div className="mb-2.5 flex items-center gap-2.5">
            <div
              className="h-4 w-[3px] shrink-0 rounded-full"
              style={{ background: C.cyHi }}
            />
            <h2
              className="text-[14px] font-semibold"
              style={{ color: C.t1, letterSpacing: "-0.01em" }}
            >
              {viewMode === "contactable"
                ? "Top contactable signal"
                : viewMode === "source-led"
                  ? "Top source-led signal"
                  : "Top owner/direct-style signal"}
            </h2>
            <span className="text-[11px]" style={{ color: C.t5 }}>
              · Review first
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
              viewMode === "contactable"
                ? Phone
                : viewMode === "source-led"
                  ? ExternalLink
                  : Layers3
            }
            label={
              viewMode === "contactable"
                ? "Contactable signals"
                : viewMode === "source-led"
                  ? "Source-led signals"
                  : "All owner/direct-style signals"
            }
            count={remainingItems.length}
            accent={
              viewMode === "contactable"
                ? C.emHi
                : viewMode === "source-led"
                  ? C.cyHi
                  : C.t3
            }
            description={
              viewMode === "contactable"
                ? "Phone, WhatsApp, or email signal"
                : viewMode === "source-led"
                  ? "Verify from source before outreach"
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
            No signals match the current view and filters.
          </p>
          <p className="mt-1.5 text-[11px]" style={{ color: C.t5 }}>
            {hasFilters
              ? "Try adjusting your filters or switching the qualification view."
              : "Try selecting a different qualification view."}
          </p>
        </div>
      )}

      {/* ── 9. Footer nav ─────────────────────────────────────── */}
      <div className="flex justify-end pt-2">
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
// EXPORT — guards before hooks, delegates to OwnerDirectContent
// ═══════════════════════════════════════════════════════════════════════════
export default function OwnerDirectRadarPage({
  country,
  data,
}: OwnerDirectRadarPageProps) {
  if (data.status !== "ready" || !data.manifest) {
    return <EmptyOwnerDirectState country={country} message={data.message} />;
  }

  const ownerDirectPayload = data.lists.ownerDirect;

  if (!ownerDirectPayload || ownerDirectPayload.items.length === 0) {
    return (
      <EmptyOwnerDirectState
        country={country}
        message={`${country.label} Owner / Direct export loaded, but no owner/direct records were available in the local frontend sample.`}
      />
    );
  }

  return <OwnerDirectContent country={country} payload={ownerDirectPayload} />;
}