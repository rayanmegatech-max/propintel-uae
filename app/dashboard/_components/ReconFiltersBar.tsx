"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ReconFilterOption, ReconFilterState } from "@/lib/recon/filter";
import { hasActiveReconFilters } from "@/lib/recon/filter";

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
    <label className="space-y-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-3 text-sm text-slate-200 outline-none transition hover:border-white/[0.16] focus:border-emerald-400/50"
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
        "rounded-xl border px-3 py-2 text-xs font-semibold transition",
        active
          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
          : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.16] hover:text-slate-200",
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
    <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-4">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-300">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Recon filters
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredCount.toLocaleString("en-US")} of{" "}
              {totalCount.toLocaleString("en-US")} exported rows in this tab.
            </p>
          </div>
        </div>

        {hasFilters ? (
          <button
            type="button"
            onClick={() =>
              onFiltersChange({
                search: "",
                location: "all",
                portal: "all",
                sourceCategory: "all",
                minScore: "",
                onlyContactable: false,
                onlyPriceMovement: false,
                onlyOwnerDirect: false,
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08]"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr_1fr_1fr_140px]">
        <label className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Search
          </span>
          <div className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-slate-950/70 px-3 transition focus-within:border-emerald-400/50">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={filters.search}
              onChange={(event) => update({ search: event.target.value })}
              placeholder="Title, city, portal, agency..."
              className="h-full w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
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

        <label className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Min score
          </span>
          <input
            value={filters.minScore}
            onChange={(event) => update({ minScore: event.target.value })}
            inputMode="numeric"
            placeholder="0"
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-white/[0.16] focus:border-emerald-400/50"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
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