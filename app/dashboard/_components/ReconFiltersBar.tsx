"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ReconFilterOption, ReconFilterState } from "@/lib/recon/filter";
import { DEFAULT_RECON_FILTERS, hasActiveReconFilters } from "@/lib/recon/filter";

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
    <label className="space-y-1.5">
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-white/[0.08] bg-slate-950/85 px-3 text-sm font-semibold text-slate-200 outline-none transition hover:border-white/[0.16] focus:border-emerald-400/50"
      >
        <option value="all">All</option>
        {options.slice(0, 80).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleButton({
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
      className={[
        "rounded-2xl border px-3.5 py-2.5 text-xs font-black transition-all duration-200",
        active
          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100 shadow-[0_0_26px_rgba(16,185,129,0.12)]"
          : "border-white/[0.08] bg-white/[0.035] text-slate-400 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-slate-200",
      ].join(" ")}
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

  const update = (patch: Partial<ReconFilterState>) => {
    onFiltersChange({
      ...filters,
      ...patch,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_32%),rgba(2,6,23,0.72)] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />

      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.045] text-emerald-300">
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-black text-white">
              Opportunity controls
            </h3>
            <p className="text-xs leading-5 text-slate-500">
              Showing{" "}
              <span className="font-black text-slate-200">
                {filteredCount.toLocaleString("en-US")}
              </span>{" "}
              of{" "}
              <span className="font-black text-slate-200">
                {totalCount.toLocaleString("en-US")}
              </span>{" "}
              exported rows in this lane.
            </p>
          </div>
        </div>

        {hasFilters ? (
          <button
            type="button"
            onClick={() => onFiltersChange({ ...DEFAULT_RECON_FILTERS })}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.045] px-3.5 py-2.5 text-xs font-black text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        ) : (
          <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[11px] font-semibold text-slate-500">
            No active filters
          </span>
        )}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr_1fr_1fr_140px]">
        <label className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Search
          </span>

          <div className="flex h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-slate-950/85 px-3 transition focus-within:border-emerald-400/50">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={filters.search}
              onChange={(event) => update({ search: event.target.value })}
              placeholder="Title, city, portal, agency..."
              className="h-full w-full bg-transparent text-sm font-semibold text-slate-200 outline-none placeholder:text-slate-600"
            />
          </div>
        </label>

        <SelectField
          label="Location"
          value={filters.location}
          options={options.locations}
          onChange={(value) => update({ location: value })}
        />

        <SelectField
          label="Portal"
          value={filters.portal}
          options={options.portals}
          onChange={(value) => update({ portal: value })}
        />

        <SelectField
          label="Category"
          value={filters.sourceCategory}
          options={options.sourceCategories}
          onChange={(value) => update({ sourceCategory: value })}
        />

        <label className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Min score
          </span>

          <input
            value={filters.minScore}
            onChange={(event) => update({ minScore: event.target.value })}
            inputMode="numeric"
            placeholder="0"
            className="h-11 w-full rounded-2xl border border-white/[0.08] bg-slate-950/85 px-3 text-sm font-semibold text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-white/[0.16] focus:border-emerald-400/50"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ToggleButton
          active={filters.onlyContactable}
          label="Only contactable"
          onClick={() => update({ onlyContactable: !filters.onlyContactable })}
        />

        <ToggleButton
          active={filters.onlyPriceMovement}
          label="Only price movement"
          onClick={() =>
            update({ onlyPriceMovement: !filters.onlyPriceMovement })
          }
        />

        <ToggleButton
          active={filters.onlyOwnerDirect}
          label="Only owner/direct"
          onClick={() => update({ onlyOwnerDirect: !filters.onlyOwnerDirect })}
        />
      </div>
    </div>
  );
}