"use client";

import { useMemo, useState } from "react";
import ReconFiltersBar from "./ReconFiltersBar";
import ReconOpportunityCard from "./ReconOpportunityCard";
import ReconTabSelector, { type ReconTabOption } from "./ReconTabSelector";
import {
  DEFAULT_RECON_FILTERS,
  applyReconFilters,
  buildReconFilterOptions,
  type ReconFilterState,
} from "@/lib/recon/filter";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { UaeReconDataResult, UaeReconListPayload } from "@/lib/data/uaeRecon";

type UaeReconTabKey =
  | "hotLeads"
  | "priceDrops"
  | "ownerDirect"
  | "stalePriceDrops"
  | "refreshInflated"
  | "listingTruth"
  | "residentialRent"
  | "residentialBuy"
  | "commercial"
  | "shortRental";

type UaeReconTabsClientProps = {
  data: UaeReconDataResult;
};

const TAB_CONFIG: Array<{
  key: UaeReconTabKey;
  label: string;
  description: string;
}> = [
  {
    key: "hotLeads",
    label: "Hot Leads",
    description: "Ranked opportunity list",
  },
  {
    key: "priceDrops",
    label: "Price Drops",
    description: "Recent price movement",
  },
  {
    key: "ownerDirect",
    label: "Owner / Direct",
    description: "Direct-owner signals",
  },
  {
    key: "stalePriceDrops",
    label: "Stale + Drops",
    description: "Aged listings with drops",
  },
  {
    key: "refreshInflated",
    label: "Refresh Inflated",
    description: "Relisted/refresh signals",
  },
  {
    key: "listingTruth",
    label: "Listing Truth",
    description: "True age signals",
  },
  {
    key: "residentialRent",
    label: "Residential Rent",
    description: "Rent opportunity view",
  },
  {
    key: "residentialBuy",
    label: "Residential Buy",
    description: "Buy opportunity view",
  },
  {
    key: "commercial",
    label: "Commercial",
    description: "Commercial listings",
  },
  {
    key: "shortRental",
    label: "Short Rental",
    description: "Daily/weekly/monthly",
  },
];

function getPayload(
  data: UaeReconDataResult,
  key: UaeReconTabKey
): UaeReconListPayload | null {
  return data.lists[key] ?? null;
}

function getCount(payload: UaeReconListPayload | null): number | undefined {
  return payload?.total_rows_available;
}

export default function UaeReconTabsClient({ data }: UaeReconTabsClientProps) {
  const [activeTab, setActiveTab] = useState<UaeReconTabKey>("hotLeads");
  const [filters, setFilters] = useState<ReconFilterState>({
    ...DEFAULT_RECON_FILTERS,
  });

  const tabs: ReconTabOption[] = TAB_CONFIG.map((tab) => ({
    key: tab.key,
    label: tab.label,
    description: tab.description,
    count: getCount(getPayload(data, tab.key)),
  }));

  const activePayload = getPayload(data, activeTab) || data.lists.hotLeads;

  const normalizedItems = useMemo(() => {
    if (!activePayload) {
      return [];
    }

    return normalizeReconList(
      activePayload.items,
      "uae",
      activePayload.source_table
    );
  }, [activePayload]);

  const filterOptions = useMemo(
    () => buildReconFilterOptions(normalizedItems),
    [normalizedItems]
  );

  const filteredItems = useMemo(
    () => applyReconFilters(normalizedItems, filters),
    [normalizedItems, filters]
  );

  const visibleItems = filteredItems.slice(0, 25);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as UaeReconTabKey);
    setFilters({ ...DEFAULT_RECON_FILTERS });
  };

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="mb-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            UAE Recon opportunity tabs
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Switch between product-safe UAE Recon dashboard exports. Search and
            filter within the selected local sample.
          </p>
        </div>

        <ReconTabSelector
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activePayload ? (
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1">
              Source: {activePayload.source_table}
            </span>
            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1">
              Exported rows: {activePayload.exported_rows}
            </span>
            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-3 py-1">
              Total rows: {activePayload.total_rows_available}
            </span>
          </div>
        ) : null}

        <ReconFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          options={filterOptions}
          totalCount={normalizedItems.length}
          filteredCount={filteredItems.length}
        />
      </div>

      {visibleItems.length > 0 ? (
        <div className="space-y-3">
          {visibleItems.map((opportunity) => (
            <ReconOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-slate-950/60 p-6 text-sm text-slate-400">
          No rows match the current filters.
        </div>
      )}
    </section>
  );
}