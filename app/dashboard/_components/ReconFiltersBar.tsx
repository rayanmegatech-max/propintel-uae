// app/dashboard/_components/ReconFiltersBar.tsx
"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ReconFilterOption, ReconFilterState } from "@/lib/recon/filter";
import { DEFAULT_RECON_FILTERS, hasActiveReconFilters } from "@/lib/recon/filter";

const C = {
  deepBg: "#09090b",
  border: "rgba(255,255,255,0.08)",
  borderFt: "rgba(255,255,255,0.04)",
  t1: "#ffffff",
  t2: "#a1a1aa",
  t3: "#71717a",
  t4: "#52525b",
  emHi: "#34d399",
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
    <div className="relative w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full sm:min-w-[100px] sm:max-w-[160px] rounded-lg border px-3 text-[12px] font-semibold outline-none transition-colors focus:border-emerald-500/50 appearance-none"
        style={{
          background: "rgba(0,0,0,0.2)",
          borderColor: value === "all" ? C.borderFt : "rgba(52,211,153,0.3)",
          color: value === "all" ? C.t3 : C.t1,
        }}
      >
        <option value="all">{placeholder}</option>
        {options.slice(0, 60).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({opt.count})
          </option>
        ))}
      </select>
      {/* Custom arrow to mask default appearance-none */}
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-50">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
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
      className="rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all duration-200 whitespace-nowrap"
      style={{
        color: active ? C.t1 : C.t3,
        background: active ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(52,211,153,0.3)" : C.borderFt}`,
        boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
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
    <div className="space-y-3">
      {/* Row 1: search + selects + score */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SlidersHorizontal
          className="h-4 w-4 shrink-0 hidden md:block opacity-70"
          style={{ color: C.t3 }}
        />

        {/* Search */}
        <div
          className="flex h-9 flex-1 items-center gap-2 rounded-lg border px-3 transition-colors focus-within:border-emerald-500/50 min-w-full sm:min-w-[180px] sm:max-w-[240px]"
          style={{ background: "rgba(0,0,0,0.2)", borderColor: C.borderFt }}
        >
          <Search className="h-3.5 w-3.5 shrink-0 opacity-70" style={{ color: C.t3 }} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search signals..."
            className="h-full w-full bg-transparent text-[12px] font-medium outline-none placeholder:text-zinc-600"
            style={{ color: C.t1 }}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => update({ search: "" })}
              className="shrink-0 transition-opacity hover:opacity-60"
              style={{ color: C.t3 }}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Selects Row */}
        <div className="grid grid-cols-3 sm:flex gap-2">
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
        </div>

        {/* Min score */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{ color: C.t3 }}
          >
            Min Score
          </span>
          <input
            value={filters.minScore}
            onChange={(e) => update({ minScore: e.target.value })}
            inputMode="numeric"
            placeholder="—"
            className="h-9 w-14 rounded-lg border px-2 text-center text-[12px] font-bold outline-none transition-colors focus:border-emerald-500/50 placeholder:text-zinc-700"
            style={{ background: "rgba(0,0,0,0.2)", borderColor: C.borderFt, color: C.t1 }}
          />
        </div>
      </div>

      {/* Row 2: toggles + count + clear */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
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

        <div className="flex flex-1 items-center justify-end gap-3">
          <span className="text-[11px] font-medium tabular-nums" style={{ color: C.t3 }}>
            Showing <span style={{ color: hasFilters ? C.emHi : C.t1, fontWeight: 700 }}>{filteredCount.toLocaleString()}</span> of {totalCount.toLocaleString()}
          </span>

          {hasFilters && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...DEFAULT_RECON_FILTERS })}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-[5px] text-[11px] font-bold transition-all hover:bg-white/[0.05]"
              style={{
                color: C.t2,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${C.borderFt}`,
              }}
            >
              <X className="h-3 w-3" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}