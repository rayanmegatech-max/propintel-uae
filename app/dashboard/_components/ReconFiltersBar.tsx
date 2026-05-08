// app/dashboard/_components/ReconFiltersBar.tsx
"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ReconFilterOption, ReconFilterState } from "@/lib/recon/filter";
import { DEFAULT_RECON_FILTERS, hasActiveReconFilters } from "@/lib/recon/filter";

const C = {
  deepBg: "#09090b",
  wellBg: "#18181b",
  border: "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.06)",
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

function MiniSelect({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: ReconFilterOption[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 min-w-[60px] max-w-[140px] rounded-md border px-2 text-[11px] font-medium outline-none transition-colors focus:border-emerald-500/30"
      style={{
        background: C.deepBg,
        borderColor: value === "all" ? C.borderFt : C.emBdr,
        color: value === "all" ? C.t4 : C.t2,
        appearance: "auto",
      }}
    >
      <option value="all">{placeholder}</option>
      {options.slice(0, 60).map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label} ({opt.count})
        </option>
      ))}
    </select>
  );
}

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
      className="rounded-md px-2.5 py-[4px] text-[10px] font-semibold transition-all duration-150"
      style={{
        color: active ? C.emHi : C.t4,
        background: active ? C.emBg : "transparent",
        border: `1px solid ${active ? C.emBdr : C.borderFt}`,
      }}
    >
      {label}
    </button>
  );
}

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
    <div className="space-y-2">
      {/* Row 1: search + selects + score */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Icon label */}
        <SlidersHorizontal
          className="h-3 w-3 shrink-0 hidden sm:block"
          style={{ color: C.t4 }}
        />

        {/* Search */}
        <div
          className="flex h-7 flex-1 items-center gap-1.5 rounded-md border px-2.5 transition-colors focus-within:border-emerald-500/30 min-w-[120px] max-w-[200px]"
          style={{ background: C.deepBg, borderColor: C.borderFt }}
        >
          <Search className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search…"
            className="h-full w-full bg-transparent text-[11px] outline-none"
            style={{ color: C.t1 }}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => update({ search: "" })}
              className="shrink-0 transition-opacity hover:opacity-60"
              style={{ color: C.t4 }}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>

        {/* Selects */}
        <MiniSelect
          value={filters.location}
          options={options.locations}
          placeholder="Location"
          onChange={(v) => update({ location: v })}
        />
        <MiniSelect
          value={filters.portal}
          options={options.portals}
          placeholder="Portal"
          onChange={(v) => update({ portal: v })}
        />
        <MiniSelect
          value={filters.sourceCategory}
          options={options.sourceCategories}
          placeholder="Category"
          onChange={(v) => update({ sourceCategory: v })}
        />

        {/* Min score */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] font-medium uppercase tracking-[0.08em]"
            style={{ color: C.t4 }}
          >
            Score
          </span>
          <input
            value={filters.minScore}
            onChange={(e) => update({ minScore: e.target.value })}
            inputMode="numeric"
            placeholder="—"
            className="h-7 w-10 rounded-md border px-1.5 text-center text-[11px] font-medium outline-none transition-colors focus:border-emerald-500/30"
            style={{ background: C.deepBg, borderColor: C.borderFt, color: C.t2 }}
          />
        </div>
      </div>

      {/* Row 2: toggles + count + clear */}
      <div className="flex flex-wrap items-center gap-1.5">
        <ToggleChip
          active={filters.onlyContactable}
          label="Contact-ready"
          onClick={() => update({ onlyContactable: !filters.onlyContactable })}
        />
        <ToggleChip
          active={filters.onlyPriceMovement}
          label="Price movement"
          onClick={() =>
            update({ onlyPriceMovement: !filters.onlyPriceMovement })
          }
        />
        <ToggleChip
          active={filters.onlyOwnerDirect}
          label="Owner / direct"
          onClick={() => update({ onlyOwnerDirect: !filters.onlyOwnerDirect })}
        />

        <div className="flex flex-1 items-center justify-end gap-2">
          <span className="text-[10px] tabular-nums" style={{ color: C.t4 }}>
            <span style={{ color: hasFilters ? C.emHi : C.t3 }}>
              {filteredCount.toLocaleString()}
            </span>
            <span style={{ color: C.t4 }}> / {totalCount.toLocaleString()}</span>
          </span>

          {hasFilters && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...DEFAULT_RECON_FILTERS })}
              className="inline-flex items-center gap-1 rounded-md px-2 py-[3px] text-[10px] font-medium transition-opacity hover:opacity-70"
              style={{
                color: C.t3,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.borderFt}`,
              }}
            >
              <X className="h-2.5 w-2.5" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
