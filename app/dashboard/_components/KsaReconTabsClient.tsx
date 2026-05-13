// app/dashboard/_components/KsaReconTabsClient.tsx
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
  KsaReconDataResult,
  KsaReconListPayload,
} from "@/lib/data/ksaRecon";

const C = {
  border: "rgba(255,255,255,0.06)",
  borderFt: "rgba(255,255,255,0.04)",
  t1: "#ffffff",
  t3: "#71717a",
  t4: "#52525b",
  emHi: "#34d399",
} as const;

type KsaReconTabKey =
  | "hotLeads"
  | "multiSignal"
  | "ownerDirect"
  | "priceDrops"
  | "refreshInflation"
  | "contactable"
  | "urlOnly"
  | "residentialRent"
  | "residentialBuy"
  | "commercial";

type KsaReconTabsClientProps = { data: KsaReconDataResult };

const TAB_CONFIG: Array<{
  key: KsaReconTabKey;
  label: string;
  description: string;
}> = [
  {
    key: "hotLeads",
    label: "Best Deals",
    description: "Ranked opportunity list",
  },
  {
    key: "multiSignal",
    label: "Multi-Signal",
    description: "Combined opportunity signals",
  },
  {
    key: "ownerDirect",
    label: "Owner / Direct",
    description: "Direct-owner candidates",
  },
  {
    key: "priceDrops",
    label: "Price Drops",
    description: "Verified price movement",
  },
  {
    key: "refreshInflation",
    label: "Refresh Signals",
    description: "Relisting / refresh signals",
  },
  {
    key: "contactable",
    label: "Contactable",
    description: "Contact-ready leads",
  },
  {
    key: "urlOnly",
    label: "URL Leads",
    description: "Source URL lead paths",
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
    description: "Commercial opportunity view",
  },
];

function getPayload(
  data: KsaReconDataResult,
  key: KsaReconTabKey
): KsaReconListPayload | null {
  return data.lists[key] ?? null;
}

function activeTabLabel(key: KsaReconTabKey): string {
  return TAB_CONFIG.find((t) => t.key === key)?.label ?? "Deal Radar";
}

export default function KsaReconTabsClient({ data }: KsaReconTabsClientProps) {
  const [activeTab, setActiveTab] = useState<KsaReconTabKey>("hotLeads");
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
    getPayload(data, activeTab) ??
    data.lists.hotLeads ??
    data.lists.multiSignal ??
    data.lists.contactable ??
    null;

  const normalizedItems = useMemo(() => {
    if (!activePayload) return [];
    return normalizeReconList(
      activePayload.items,
      "ksa",
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
    setActiveTab(tabKey as KsaReconTabKey);
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
              Top Priority Today
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
            Try clearing your search or selecting a different Opportunity View.
          </p>
        </div>
      ) : null}
    </div>
  );
}
