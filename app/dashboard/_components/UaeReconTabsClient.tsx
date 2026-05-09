// app/dashboard/_components/UaeReconTabsClient.tsx
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
import type {
  UaeReconDataResult,
  UaeReconListPayload,
} from "@/lib/data/uaeRecon";

const C = {
  border: "rgba(255,255,255,0.06)",
  borderFt: "rgba(255,255,255,0.04)",
  t1: "#ffffff",
  t3: "#71717a",
  t4: "#52525b",
  emHi: "#34d399",
} as const;

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

type UaeReconTabsClientProps = { data: UaeReconDataResult };

const TAB_CONFIG: Array<{
  key: UaeReconTabKey;
  label: string;
  description: string;
}> = [
  {
    key: "hotLeads",
    label: "Best Deals",
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
    label: "Aged + Price Moved",
    description: "Aged listings with drops",
  },
  {
    key: "refreshInflated",
    label: "Refresh Signals",
    description: "Relisted / refresh signals",
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
    description: "Daily / weekly / monthly",
  },
];

function getPayload(
  data: UaeReconDataResult,
  key: UaeReconTabKey
): UaeReconListPayload | null {
  return data.lists[key] ?? null;
}

function activeTabLabel(key: UaeReconTabKey): string {
  return TAB_CONFIG.find((t) => t.key === key)?.label ?? "Deal Radar";
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
    count: getPayload(data, tab.key)?.total_rows_available,
  }));

  const activePayload =
    getPayload(data, activeTab) ?? data.lists.hotLeads ?? null;

  const normalizedItems = useMemo(() => {
    if (!activePayload) return [];
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

  const featuredItem = filteredItems[0] ?? null;
  const remainingItems = filteredItems.slice(1);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as UaeReconTabKey);
    setFilters({ ...DEFAULT_RECON_FILTERS });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Featured lead ───────────────────────────────────── */}
      {featuredItem && (
        <section>
          <div className="mb-3 flex items-center gap-2.5 px-1">
            <div
              className="h-4 w-[3px] rounded-full shrink-0"
              style={{ background: C.emHi }}
            />
            <h2
              className="text-[14px] font-bold uppercase tracking-wider"
              style={{ color: C.t1 }}
            >
              Review first
            </h2>
            <span className="text-[12px] font-medium" style={{ color: C.t4 }}>
              · {activeTabLabel(activeTab)} view
            </span>
          </div>
          <ReconOpportunityCard opportunity={featuredItem} variant="featured" />
        </section>
      )}

      {/* ── 2. Command bar ─────────────────────────────────────── */}
      <section
        className="rounded-[20px] border shadow-md"
        style={{ background: "rgba(24,24,27,0.4)", borderColor: C.border, backdropFilter: "blur(12px)" }}
      >
        <div className="p-4 pb-0">
          <ReconTabSelector
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div
          className="border-t px-5 py-4 mt-3"
          style={{ borderColor: C.borderFt }}
        >
          <ReconFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            options={filterOptions}
            totalCount={normalizedItems.length}
            filteredCount={filteredItems.length}
          />
        </div>
      </section>

      {/* ── 3. Remaining list ──────────────────────────────────── */}
      {remainingItems.length > 0 ? (
        <div className="space-y-3">
          {remainingItems.map((opportunity) => (
            <ReconOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              variant="list"
            />
          ))}
        </div>
      ) : !featuredItem ? (
        <div
          className="rounded-[20px] border p-12 text-center shadow-inner"
          style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}
        >
          <p className="text-[15px] font-bold" style={{ color: C.t1 }}>
            No opportunities match the current filters.
          </p>
          <p className="mt-2 text-[13px] font-medium" style={{ color: C.t3 }}>
            Try clearing your search or selecting a different Signal View.
          </p>
        </div>
      ) : null}
    </div>
  );
}