"use client";

import { useMemo, useState } from "react";
import ReconOpportunityCard from "./ReconOpportunityCard";
import ReconTabSelector, { type ReconTabOption } from "./ReconTabSelector";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { KsaReconDataResult, KsaReconListPayload } from "@/lib/data/ksaRecon";

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

type KsaReconTabsClientProps = {
  data: KsaReconDataResult;
};

const TAB_CONFIG: Array<{
  key: KsaReconTabKey;
  label: string;
  description: string;
}> = [
  {
    key: "hotLeads",
    label: "Hot Leads",
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
    label: "Refresh Inflation",
    description: "Relisting/refresh signals",
  },
  {
    key: "contactable",
    label: "Contactable",
    description: "Phone/contact-ready leads",
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

function getCount(payload: KsaReconListPayload | null): number | undefined {
  return payload?.total_rows_available;
}

export default function KsaReconTabsClient({ data }: KsaReconTabsClientProps) {
  const [activeTab, setActiveTab] = useState<KsaReconTabKey>("hotLeads");

  const tabs: ReconTabOption[] = TAB_CONFIG.map((tab) => ({
    key: tab.key,
    label: tab.label,
    description: tab.description,
    count: getCount(getPayload(data, tab.key)),
  }));

  const activePayload =
    getPayload(data, activeTab) ||
    data.lists.hotLeads ||
    data.lists.multiSignal ||
    data.lists.contactable;

  const normalizedItems = useMemo(() => {
    if (!activePayload) {
      return [];
    }

    return normalizeReconList(
      activePayload.items,
      "ksa",
      activePayload.source_table
    );
  }, [activePayload]);

  const visibleItems = normalizedItems.slice(0, 25);

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="mb-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            KSA Recon opportunity tabs
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Switch between product-safe KSA Recon dashboard exports. Showing the
            first 25 rows from the selected local sample.
          </p>
        </div>

        <ReconTabSelector
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabKey) => setActiveTab(tabKey as KsaReconTabKey)}
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
          No rows available for this tab.
        </div>
      )}
    </section>
  );
}