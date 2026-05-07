// app/dashboard/_components/ReconFiltersBar.tsx
"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ReconFilterOption, ReconFilterState } from "@/lib/recon/filter";
import { DEFAULT_RECON_FILTERS, hasActiveReconFilters } from "@/lib/recon/filter";

const C = {
  cardBg:  "#111113",
  wellBg:  "#18181b",
  deepBg:  "#09090b",
  border:  "rgba(255,255,255,0.07)",
  borderFt:"rgba(255,255,255,0.04)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  em:    "#10b981",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.08)",
  emBdr: "rgba(16,185,129,0.2)",
} as const;

type ReconFiltersBarProps = {
  filters: ReconFilterState;
  onFiltersChange: (filters: ReconFilterState) => void;
  options: {
    locations: ReconFilterOption[];
    portals: ReconFilterOption[];
    sourceCategories: ReconFilterOption[];
  };
  totalCount: number;
  filteredCount: number;
};

// ─── Select field ─────────────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ReconFilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span
        className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: C.t4 }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[30px] min-w-[80px] flex-1 rounded-lg border px-2 text-[12px] font-medium outline-none transition-colors"
        style={{
          background:  C.deepBg,
          borderColor: C.border,
          color:       C.t2,
          appearance:  "auto",
        }}
      >
        <option value="all">All</option>
        {options.slice(0, 80).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({opt.count})
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Toggle chip ──────────────────────────────────────────────────────────────
function ToggleChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-[11px] font-medium transition-all duration-150"
      style={{
        color:       active ? C.emHi  : C.t3,
        background:  active ? C.emBg  : "rgba(255,255,255,0.03)",
        borderColor: active ? C.emBdr : C.borderFt,
      }}
    >
      {label}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ReconFiltersBar({
  filters,
  onFiltersChange,
  options,
  totalCount,
  filteredCount,
}: ReconFiltersBarProps) {
  const hasFilters = hasActiveReconFilters(filters);

  const update = (patch: Partial<ReconFilterState>) =>
    onFiltersChange({ ...filters, ...patch });

  return (
    <div className="space-y-2.5">
      {/* ── Row 1: search + selects ──────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div
          className="flex h-[30px] flex-1 items-center gap-2 rounded-lg border px-2.5 transition-colors focus-within:border-emerald-500/40 min-w-[160px]"
          style={{ background: C.deepBg, borderColor: C.border }}
        >
          <Search className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search leads…"
            className="h-full w-full bg-transparent text-[12px] font-medium outline-none"
            style={{ color: C.t1 }}
          />
        </div>

        {/* Dropdowns */}
        <SelectField
          label="Location"
          value={filters.location}
          options={options.locations}
          onChange={(v) => update({ location: v })}
        />
        <SelectField
          label="Portal"
          value={filters.portal}
          options={options.portals}
          onChange={(v) => update({ portal: v })}
        />
        <SelectField
          label="Category"
          value={filters.sourceCategory}
          options={options.sourceCategories}
          onChange={(v) => update({ sourceCategory: v })}
        />

        {/* Min score */}
        <div className="flex items-center gap-1.5">
          <span
            className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: C.t4 }}
          >
            Score
          </span>
          <input
            value={filters.minScore}
            onChange={(e) => update({ minScore: e.target.value })}
            inputMode="numeric"
            placeholder="0"
            className="h-[30px] w-14 rounded-lg border px-2 text-[12px] font-medium outline-none transition-colors focus:border-emerald-500/40"
            style={{ background: C.deepBg, borderColor: C.border, color: C.t2 }}
          />
        </div>
      </div>

      {/* ── Row 2: toggles + count ───────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <ToggleChip
          active={filters.onlyContactable}
          label="Contact-ready"
          onClick={() => update({ onlyContactable: !filters.onlyContactable })}
        />
        <ToggleChip
          active={filters.onlyPriceMovement}
          label="Price movement"
          onClick={() => update({ onlyPriceMovement: !filters.onlyPriceMovement })}
        />
        <ToggleChip
          active={filters.onlyOwnerDirect}
          label="Owner / direct"
          onClick={() => update({ onlyOwnerDirect: !filters.onlyOwnerDirect })}
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Count + clear */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3 w-3" style={{ color: C.t4 }} />
          <span className="text-[11px]" style={{ color: C.t3 }}>
            <span className="font-semibold" style={{ color: C.t2 }}>
              {filteredCount.toLocaleString()}
            </span>
            <span style={{ color: C.t4 }}>/{totalCount.toLocaleString()}</span>
          </span>

          {hasFilters && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...DEFAULT_RECON_FILTERS })}
              className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors hover:opacity-75"
              style={{ color: C.t3 }}
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
