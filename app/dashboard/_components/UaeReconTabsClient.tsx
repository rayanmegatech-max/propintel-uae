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
import type { UaeReconDataResult, UaeReconListPayload } from "@/lib/data/uaeRecon";

const C = {
  cardBg:  "#111113",
  wellBg:  "#18181b",
  border:  "rgba(255,255,255,0.07)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.07)",
  emBdr: "rgba(16,185,129,0.15)",
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

type UaeReconTabsClientProps = {
  data: UaeReconDataResult;
};

const TAB_CONFIG: Array<{ key: UaeReconTabKey; label: string; description: string }> = [
  { key: "hotLeads",        label: "Hot Leads",         description: "Ranked opportunity list"      },
  { key: "priceDrops",      label: "Price Drops",        description: "Recent price movement"        },
  { key: "ownerDirect",     label: "Owner / Direct",     description: "Direct-owner signals"         },
  { key: "stalePriceDrops", label: "Stale + Drops",      description: "Aged listings with drops"     },
  { key: "refreshInflated", label: "Refresh Inflated",   description: "Relisted / refresh signals"   },
  { key: "listingTruth",    label: "Listing Truth",      description: "True age signals"             },
  { key: "residentialRent", label: "Residential Rent",   description: "Rent opportunity view"        },
  { key: "residentialBuy",  label: "Residential Buy",    description: "Buy opportunity view"         },
  { key: "commercial",      label: "Commercial",         description: "Commercial listings"          },
  { key: "shortRental",     label: "Short Rental",       description: "Daily / weekly / monthly"     },
];

function getPayload(
  data: UaeReconDataResult,
  key: UaeReconTabKey
): UaeReconListPayload | null {
  return data.lists[key] ?? null;
}

export default function UaeReconTabsClient({ data }: UaeReconTabsClientProps) {
  const [activeTab, setActiveTab] = useState<UaeReconTabKey>("hotLeads");
  const [filters, setFilters] = useState<ReconFilterState>({ ...DEFAULT_RECON_FILTERS });

  const tabs: ReconTabOption[] = TAB_CONFIG.map((tab) => ({
    key:         tab.key,
    label:       tab.label,
    description: tab.description,
    count:       getPayload(data, tab.key)?.total_rows_available,
  }));

  const activePayload = getPayload(data, activeTab) ?? data.lists.hotLeads ?? null;

  const normalizedItems = useMemo(() => {
    if (!activePayload) return [];
    return normalizeReconList(activePayload.items, "uae", activePayload.source_table);
  }, [activePayload]);

  const filterOptions = useMemo(
    () => buildReconFilterOptions(normalizedItems),
    [normalizedItems]
  );

  const filteredItems = useMemo(
    () => applyReconFilters(normalizedItems, filters),
    [normalizedItems, filters]
  );

  const featuredItem   = filteredItems[0] ?? null;
  const remainingItems = filteredItems.slice(1);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as UaeReconTabKey);
    setFilters({ ...DEFAULT_RECON_FILTERS });
  };

  return (
    <div className="space-y-5">
      {/* ── 1. Featured lead (if any) ────────────────────────────── */}
      {featuredItem && (
        <section>
          {/* Section header */}
          <div className="mb-3 flex items-baseline gap-3">
            <h2
              className="text-[15px] font-semibold"
              style={{ color: C.t1, letterSpacing: "-0.015em" }}
            >
              Best opportunity right now
            </h2>
            <span className="text-[12px]" style={{ color: C.t4 }}>
              Ranked from the selected Recon lane.
            </span>
          </div>
          <ReconOpportunityCard opportunity={featuredItem} variant="featured" />
        </section>
      )}

      {/* ── 2. Command bar: tabs + filters ───────────────────────── */}
      <section
        className="rounded-xl border p-4 space-y-3"
        style={{ background: C.cardBg, borderColor: C.border }}
      >
        <ReconTabSelector
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div
          className="border-t pt-3"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
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

      {/* ── 3. Remaining list cards ───────────────────────────────── */}
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
        /* Empty state — no items at all */
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ background: C.cardBg, borderColor: C.border }}
        >
          <p className="text-[14px] font-medium" style={{ color: C.t3 }}>
            No opportunities match the current filters.
          </p>
          <p className="mt-1 text-[12px]" style={{ color: C.t4 }}>
            Try adjusting the filters or selecting a different lane above.
          </p>
        </div>
      ) : null}
    </div>
  );
}
