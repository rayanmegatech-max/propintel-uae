// app/dashboard/_components/OwnerDirectRadarPage.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Globe2,
  Layers,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { formatNumber } from "@/lib/recon/formatters";
import { normalizeReconList } from "@/lib/recon/normalize";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { KsaReconDataResult } from "@/lib/data/ksaRecon";
import type { UaeReconDataResult } from "@/lib/data/uaeRecon";
import type { NormalizedReconOpportunity } from "@/lib/recon/types";

// ─── Render cap ────────────────────────────────────────────────────────────────
const OWNER_DIRECT_RENDER_LIMIT = 150;

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  t1: "#ffffff",
  t2: "#e4e4e7",
  t3: "#a1a1aa",
  t4: "#71717a",
  em: "#10b981",
  emHi: "#34d399",
  cy: "#06b6d4",
  cyHi: "#22d3ee",
  am: "#fbbf24",
  amHi: "#fcd34d",
  rd: "#fb7185",
  rdHi: "#f43f5e",
  border: "rgba(255,255,255,0.06)",
  borderSub: "rgba(255,255,255,0.04)",
} as const;

export type OwnerDirectRadarPageProps = {
  country: CountryConfig;
  data: UaeReconDataResult | KsaReconDataResult;
};

type DirectView = "all" | "contactable" | "owner-direct" | "source-led";
type CategoryFilter = "all" | "residential_buy" | "residential_rent" | "commercial_buy" | "commercial_rent" | "short_rental" | "land";

// ─── Type Helpers ─────────────────────────────────────────────────────────
function getStringField(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const val = record[key];
    if (typeof val === "string" && val.trim() !== "") {
      return val.trim();
    }
  }
  return undefined;
}

function getBooleanField(record: Record<string, unknown>, keys: string[]): boolean {
  for (const key of keys) {
    const val = record[key];
    if (val === true || val === 1 || val === "true" || val === "1") return true;
  }
  return false;
}

// ─── Formatters ───────────────────────────────────────────────────────────
function formatCurrencyCompact(value: number, currency: string): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ${currency}`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k ${currency}`;
  return `${value} ${currency}`;
}

function formatLocation(value: string | null | undefined): string {
  if (!value) return "Unknown Location";
  return value
    .replace(/\|+/g, " · ")
    .replace(/\s*-\s*/g, " · ")
    .replace(/\s*\/\s*/g, " · ")
    .replace(/\s+/g, " ")
    .replace(/\s+·\s+/g, " · ")
    .trim();
}

function formatPropertyType(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  const lower = cleaned.toLowerCase();
  if (lower === "residential lands" || lower === "residential land" || lower === "lands" || lower === "land" || lower === "commercial lands" || lower === "commercial land") return "Land";
  return cleaned.split(" ").map((part) => part.length > 0 ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part).join(" ");
}

function formatCategoryLabel(item: NormalizedReconOpportunity): string | undefined {
  const sc = (item.sourceCategory || "").toLowerCase();
  const pt = (item.propertyType || "").toLowerCase();

  const hasRes = sc.includes("residential") || pt.includes("residential");
  const hasCom = sc.includes("commercial") || pt.includes("commercial");
  const hasBuy = sc.includes("buy") || sc.includes("sale") || pt.includes("buy") || pt.includes("sale");
  const hasRent = sc.includes("rent") || sc.includes("lease") || pt.includes("rent") || pt.includes("lease");

  if (hasRes && hasCom) return "Mixed Category";
  if (sc.includes("short") || sc.includes("holiday") || pt.includes("short") || pt.includes("holiday")) return "Short Rental";
  if (sc.includes("land") || pt.includes("land")) return "Land";
  if (hasRes && hasBuy) return "Residential Buy";
  if (hasRes && hasRent) return "Residential Rent";
  if (hasCom && hasBuy) return "Commercial Buy";
  if (hasCom && hasRent) return "Commercial Rent";
  if (hasRes) return "Residential";
  if (hasCom) return "Commercial";

  if (item.sourceCategory && item.sourceCategory.toLowerCase() !== "all") return item.sourceCategory.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  if (item.propertyType) return formatPropertyType(item.propertyType);
  return undefined;
}

function formatOwnerDirectLabel(value: string): string {
  const cleaned = value.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  const lower = cleaned.toLowerCase();

  if (lower.includes("confirmed")) {
    return "Higher Confidence";
  }

  return cleaned.replace(/\b\w/g, (l) => l.toUpperCase());
}

function getItemCategoryFilter(item: NormalizedReconOpportunity): CategoryFilter {
  const sc = (item.sourceCategory || "").toLowerCase();
  const pt = (item.propertyType || "").toLowerCase();
  if (pt.includes("land") || sc.includes("land")) return "land";
  if (sc.includes("short") || sc.includes("holiday") || pt.includes("short") || pt.includes("holiday")) return "short_rental";
  if (sc.includes("commercial") && (sc.includes("buy") || sc.includes("sale"))) return "commercial_buy";
  if (sc.includes("commercial") && (sc.includes("rent") || sc.includes("lease"))) return "commercial_rent";
  if (sc.includes("residential") && (sc.includes("buy") || sc.includes("sale"))) return "residential_buy";
  if (sc.includes("residential") && (sc.includes("rent") || sc.includes("lease"))) return "residential_rent";
  if (sc.includes("commercial")) return "commercial_rent";
  if (sc.includes("buy") || sc.includes("sale")) return "residential_buy";
  if (sc.includes("rent") || sc.includes("lease")) return "residential_rent";
  return "all";
}

// ─── Location filter helpers ──────────────────────────────────────────────
function getLocationFilterKey(item: NormalizedReconOpportunity): string {
  const label = getLocationFilterLabel(item);
  if (!label || label.toLowerCase() === "unknown location") return "unknown";
  return label.toLowerCase().trim();
}

function getLocationFilterLabel(item: NormalizedReconOpportunity): string {
  const rawCity = item.city?.trim();
  const rawDistrict = item.districtOrCommunity?.trim();

  const city = rawCity ? formatLocation(rawCity) : undefined;
  const district = rawDistrict ? formatLocation(rawDistrict) : undefined;

  if (city && district) return `${city} · ${district}`;
  if (city) return city;
  if (district) return district;

  const fallback = formatLocation(item.locationLabel);
  if (!fallback || fallback.toLowerCase() === "unknown location") return "Unknown Location";
  return fallback;
}

function getCityFilterKey(item: NormalizedReconOpportunity): string {
  const rawCity = item.city?.trim();
  if (!rawCity) return "unknown";
  const formatted = formatLocation(rawCity);
  if (!formatted || formatted.toLowerCase() === "unknown location") return "unknown";
  return formatted.toLowerCase();
}

function cleanTitle(item: NormalizedReconOpportunity): string {
  const title = item.title || item.subtitle || "";
  const location = formatLocation(item.locationLabel);
  const lower = title.toLowerCase();
  if (
    lower.includes("owner/direct signal") ||
    lower.includes("price movement") ||
    lower.includes("refresh signal") ||
    lower.includes("signal +") ||
    lower.includes(" + ") ||
    lower.includes("price drop") ||
    lower.includes("stale") ||
    lower.includes("aged")
  ) {
    return location;
  }
  return title || location;
}

// ─── Segment helpers ────────────────────────────────────────────────────────
function isContactable(item: NormalizedReconOpportunity): boolean {
  return item.hasPhone || item.hasWhatsapp || item.hasEmail;
}

function isOwnerDirectStyle(item: NormalizedReconOpportunity): boolean {
  const raw = item.raw;
  return (
    getBooleanField(raw, ["is_owner_direct", "has_owner_direct_signal"]) ||
    !!getStringField(raw, ["owner_direct_bucket", "owner_direct_label"])
  );
}

function isSourceLed(item: NormalizedReconOpportunity): boolean {
  return !isContactable(item) && Boolean(item.listingUrl);
}

function isHigherConfidence(item: NormalizedReconOpportunity): boolean {
  const raw = item.raw;
  const tier = getStringField(raw, ["owner_direct_confidence_tier"]);
  if (tier) {
    const lower = tier.toLowerCase();
    return lower.includes("high") || lower.includes("strong");
  }
  const bucket = getStringField(raw, ["owner_direct_bucket"]);
  if (bucket) {
    const lower = bucket.toLowerCase();
    return lower.includes("high") || lower.includes("strong") || lower.includes("owner");
  }
  return false;
}

// ─── Dedupe Logic ───────────────────────────────────────────────────────────
function getDedupeKey(item: NormalizedReconOpportunity): string {
  if (item.listingUrl) return `url:${item.listingUrl}`;
  const loc = formatLocation(item.locationLabel);
  const propType = formatPropertyType(item.propertyType) ?? "";
  return [item.portal || "", loc, item.agencyName || "", item.price ?? 0, propType].join("-").toLowerCase();
}

function dedupeItems(items: NormalizedReconOpportunity[]): NormalizedReconOpportunity[] {
  const map = new Map<string, NormalizedReconOpportunity>();
  for (const item of items) {
    const key = getDedupeKey(item);
    if (!map.has(key)) {
      map.set(key, item);
    } else {
      const existing = map.get(key)!;
      if (isContactable(item) && !isContactable(existing)) {
        map.set(key, item);
      } else if (item.listingUrl && !existing.listingUrl) {
        map.set(key, item);
      }
    }
  }
  return Array.from(map.values());
}

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="owner-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#owner-grid)" />
      </svg>
    </div>
  );
}

// ─── Components ─────────────────────────────────────────────────────────────

function SnapshotCard({
  title,
  description,
  value,
  icon,
  accentColor,
  href,
  ctaLabel,
}: {
  title: string;
  description: string;
  value?: string | number;
  icon: React.ReactNode;
  accentColor: string;
  href: string;
  ctaLabel?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col h-full rounded-[16px] border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.015)",
        borderColor: C.borderSub,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-60 transition-all duration-300"
        style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
      />
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{ background: accentColor }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3.5 mb-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-inner transition-colors duration-300"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              borderColor: "rgba(255,255,255,0.1)",
              color: accentColor,
            }}
          >
            {icon}
          </div>
          {value !== undefined && (
            <span className="text-[18px] font-black tabular-nums tracking-tight text-white mt-1">
              {value}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 mb-3">
          <h3 className="text-[15px] font-bold tracking-tight text-white flex items-center gap-2 mb-1">
            {title}
          </h3>
          <p className="text-[13px] leading-relaxed font-medium" style={{ color: C.t3 }}>
            {description}
          </p>
        </div>

        <div
          className="mt-auto flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-transform group-hover:translate-x-0.5"
          style={{ color: accentColor }}
        >
          {ctaLabel ?? "Open Workspace"}
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}

function IntelligencePanel({
  title,
  purpose,
  agentUseText,
  chips,
  icon,
  accentColor,
  primaryAction,
}: {
  title: string;
  purpose: string;
  agentUseText: string;
  chips: string[];
  icon: React.ReactNode;
  accentColor: string;
  primaryAction: { label: string; onClick: () => void };
}) {
  return (
    <article
      className="relative overflow-hidden rounded-[20px] border shadow-md"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,27,0.4) 0%, rgba(9,9,11,0.6) 100%)",
        borderColor: C.border,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full opacity-80" style={{ background: accentColor }} />
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-10" style={{ background: accentColor }} />

      <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10" style={{ color: accentColor }}>
              {icon}
            </div>
            <h2 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight text-white">
              {title}
            </h2>
          </div>

          <p className="text-[13.5px] leading-relaxed font-medium mb-3 pl-1" style={{ color: C.t2 }}>
            {purpose}
          </p>

          <div className="flex flex-wrap gap-2 mb-3.5 pl-1">
            {chips.map((chip) => (
              <span
                key={chip}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm"
                style={{
                  color: accentColor,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-black/20 border border-white/5 shadow-inner">
            <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
            <p className="text-[13px] leading-relaxed font-medium" style={{ color: C.t3 }}>
              <span className="text-white font-bold mr-1.5">Agent Workflow:</span>
              {agentUseText}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 md:min-w-[180px] shrink-0 mt-2 md:mt-0">
          <button
            onClick={primaryAction.onClick}
            className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-[13px] font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px shadow-sm"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {primaryAction.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function MetricPill({
  label,
  value,
  tone = "neutral",
  truncate = false,
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "rd" | "am" | "cy" | "em";
  truncate?: boolean;
}) {
  const colors = {
    neutral: { text: C.t1, bg: "rgba(255,255,255,0.03)", border: C.borderSub },
    rd: { text: C.rdHi, bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)" },
    am: { text: C.amHi, bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
    cy: { text: C.cyHi, bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)" },
    em: { text: C.emHi, bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
  };
  const c = colors[tone];

  return (
    <div className="flex flex-col gap-0.5 rounded-lg px-2.5 py-1.5 border" style={{ background: c.bg, borderColor: c.border }}>
      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>{label}</span>
      <span
        className={`text-[12px] font-bold tabular-nums ${truncate ? "max-w-[110px] truncate" : ""}`}
        style={{ color: c.text }}
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function OwnerDirectCard({
  item,
  idx,
  routeBase,
  currency,
}: {
  item: NormalizedReconOpportunity;
  idx: number;
  routeBase: string;
  currency: string;
}) {
  const raw = item.raw;
  const rank = idx + 1;

  const contactable = isContactable(item);
  const ownerDirect = isOwnerDirectStyle(item);
  const sourceLed = isSourceLed(item);
  const higherConf = isHigherConfidence(item);

  const ownerLabel = getStringField(raw, ["owner_direct_label", "owner_direct_bucket"]);
  const confTier = getStringField(raw, ["owner_direct_confidence_tier"]);

  // Card read
  let directRead = "This public listing includes direct-style or contactable signals. Verify the source before outreach.";
  if (contactable) {
    directRead = "This public listing includes a visible contact route. Verify the source before outreach.";
  } else if (sourceLed) {
    directRead = "This source-led record needs listing verification before outreach.";
  } else if (ownerDirect) {
    directRead = "This record shows owner/direct-style public listing evidence. Treat it as a lead candidate, not confirmed ownership.";
  }

  let actionText = "Agents can prioritize listings with clearer contact or direct-style evidence while avoiding unsupported ownership claims.";
  if (contactable && ownerDirect) {
    actionText = "A contactable listing with owner/direct-style signals is worth prioritizing for follow-up verification.";
  } else if (contactable) {
    actionText = "Visible contact routes reduce friction in follow-up. Verify advertiser context before outreach.";
  } else if (sourceLed) {
    actionText = "Source-led signals need verification through the listing URL before any contact attempt.";
  }

  const categoryBadge = formatCategoryLabel(item);
  const displayTitle = cleanTitle(item);
  const formattedLocation = formatLocation(item.locationLabel);

  const toneColor = contactable ? C.emHi : sourceLed ? C.amHi : ownerDirect ? C.cyHi : C.amHi;
  const badgeLabel = contactable
    ? "Contactable"
    : sourceLed
    ? "Verify Source"
    : ownerDirect
    ? "Owner/Direct Style"
    : "Review Signal";

  const pillsToRender: Array<{ label: string; value: string | number; tone: "neutral" | "rd" | "am" | "cy" | "em" }> = [];

  if (item.price !== null) {
    pillsToRender.push({ label: "Price", value: formatCurrencyCompact(item.price, currency), tone: "neutral" });
  }

  if (item.portal) {
    pillsToRender.push({ label: "Portal", value: item.portal, tone: "neutral" });
  }

  if (ownerLabel) {
    const lowerOL = ownerLabel.toLowerCase();
    let evidenceLabel = "Evidence";
    let evidenceValue = formatOwnerDirectLabel(ownerLabel);
    if (lowerOL.includes("low")) {
      evidenceLabel = "Review Evidence";
      evidenceValue = "Needs Review";
    } else if (lowerOL.includes("high") || lowerOL.includes("strong") || lowerOL.includes("confirmed")) {
      evidenceLabel = "Stronger Evidence";
      evidenceValue = "Higher Confidence";
    }
    pillsToRender.push({ label: evidenceLabel, value: evidenceValue, tone: "cy" });
  }

  if (confTier) {
    const formattedConfidence = formatOwnerDirectLabel(confTier);
    const confidenceIsReview = formattedConfidence.toLowerCase() === "review";
    const evidenceLabel = confidenceIsReview ? "Review Evidence" : higherConf ? "Stronger Evidence" : "Evidence";
    pillsToRender.push({
      label: evidenceLabel,
      value: confidenceIsReview ? "Needs Review" : formattedConfidence,
      tone: higherConf ? "em" : "neutral",
    });
  }

  const displayPropertyType = formatPropertyType(item.propertyType);
  if (displayPropertyType && pillsToRender.length < 5) {
    pillsToRender.push({ label: "Type", value: displayPropertyType, tone: "neutral" });
  }

  const finalPills = pillsToRender.slice(0, 5);

  return (
    <article
      className="group relative flex flex-col rounded-[20px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,27,0.48) 0%, rgba(9,9,11,0.72) 100%)",
        borderColor: "rgba(255,255,255,0.065)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-50 transition-all duration-300 z-10"
        style={{ background: toneColor, boxShadow: `0 0 10px ${toneColor}` }}
      />
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-[70px] opacity-[0.08] pointer-events-none z-0" style={{ background: toneColor }} />

      <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-10">
        {/* Top Row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="rounded px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-widest"
              style={{ color: toneColor, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderSub}` }}
            >
              #{rank}
            </span>
            <span
              className="inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest leading-none shadow-sm"
              style={{
                color: C.t2,
                background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              {badgeLabel}
            </span>
          </div>
          {categoryBadge && (
            <span
              className="inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest leading-none shadow-sm"
              style={{ color: C.t3, background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}
            >
              {categoryBadge}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-[16px] font-extrabold text-white tracking-tight mb-1">
          {displayTitle}
        </h3>

        {displayTitle !== formattedLocation && formattedLocation && formattedLocation !== "Unknown Location" && (
          <p className="text-[12px] font-bold mb-4" style={{ color: C.t4 }}>
            {formattedLocation}
          </p>
        )}

        {/* Agency/Agent */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 rounded-lg border p-3 mb-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
          <span
            className="block text-[13px] leading-relaxed line-clamp-2"
            style={{
              color: item.agencyName ? C.t1 : C.t4,
              fontWeight: item.agencyName ? 700 : 500,
              opacity: item.agencyName ? 1 : 0.7,
            }}
            title={item.agencyName || "Agency not listed"}
          >
            {item.agencyName || "Agency not listed"}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider shrink-0" style={{ color: C.t4 }}>
            {item.agentName || "Agent not listed"}
          </span>
        </div>

        {/* Contact Indicators */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.hasPhone && (
            <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold" style={{ color: C.emHi, background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}>
              <Phone className="h-3 w-3" /> Phone
            </span>
          )}
          {item.hasWhatsapp && (
            <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold" style={{ color: C.emHi, background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}>
              <Phone className="h-3 w-3" /> WhatsApp
            </span>
          )}
          {item.hasEmail && (
            <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold" style={{ color: C.cyHi, background: "rgba(34,211,238,0.08)", borderColor: "rgba(34,211,238,0.2)" }}>
              <Mail className="h-3 w-3" /> Email
            </span>
          )}
          {item.listingUrl && !contactable && (
            <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold" style={{ color: C.amHi, background: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.2)" }}>
              <Globe2 className="h-3 w-3" /> Source Available
            </span>
          )}
        </div>

        {/* Metric Pills */}
        {finalPills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {finalPills.map((p, i) => (
              <MetricPill key={i} label={p.label} value={p.value} tone={p.tone} />
            ))}
          </div>
        )}

        <p className="text-[13px] leading-relaxed font-medium mb-3" style={{ color: C.t3 }}>
          {directRead}
        </p>

        {/* Action Box */}
        <div className="mt-auto mb-5 rounded-xl border p-3.5" style={{ background: "rgba(0,0,0,0.18)", borderColor: C.borderSub }}>
          <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: toneColor }}>
            Why this matters
          </span>
          <p className="text-[12.5px] leading-relaxed font-medium" style={{ color: C.t2 }}>
            {actionText}
          </p>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: C.borderSub }}>
          {item.listingUrl ? (
            <a
              href={item.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80"
              style={{ color: toneColor }}
            >
              Verify Source
            </a>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>
              Source Unavailable
            </span>
          )}

          <Link
            href={`${routeBase}/listing-age`}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80"
            style={{ color: item.listingUrl ? C.t4 : toneColor }}
          >
            Review Listing Truth
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function OwnerDirectRadarPage({
  country,
  data,
}: OwnerDirectRadarPageProps) {
  const isUae = country.slug === "uae";

  const [activeLane, setActiveLane] = useState<DirectView>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const allNormalized = useMemo(() => {
    const seenIds = new Set<string>();
    const results: NormalizedReconOpportunity[] = [];

    function addItems(items: Record<string, unknown>[] | undefined | null, sourceTable?: string | null) {
      if (!items || items.length === 0) return;
      const normalized = normalizeReconList(items, country.slug, sourceTable ?? null);
      for (const item of normalized) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          results.push(item);
        }
      }
    }

    if (isUae) {
      const uData = data as UaeReconDataResult;
      addItems(uData.lists.ownerDirect?.items as Record<string, unknown>[] | undefined, uData.lists.ownerDirect?.source_table);
    } else {
      const kData = data as KsaReconDataResult;
      addItems(kData.lists.ownerDirect?.items as Record<string, unknown>[] | undefined, kData.lists.ownerDirect?.source_table);
      addItems(kData.lists.contactable?.items as Record<string, unknown>[] | undefined, kData.lists.contactable?.source_table);
    }

    return results;
  }, [country.slug, data, isUae]);

  const dedupedItems = useMemo(() => dedupeItems(allNormalized), [allNormalized]);

  const cityOptions = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const item of dedupedItems) {
      const key = getCityFilterKey(item);
      if (key === "unknown") continue;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        const rawCity = item.city?.trim();
        const label = rawCity ? formatLocation(rawCity) : key;
        map.set(key, { label, count: 1 });
      }
    }
    return Array.from(map.entries())
      .map(([value, { label, count }]) => ({ value, label, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 5);
  }, [dedupedItems]);

  const locationOptions = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();

    for (const item of dedupedItems) {
      const key = getLocationFilterKey(item);
      if (key === "unknown") continue;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        const label = getLocationFilterLabel(item);
        map.set(key, { label, count: 1 });
      }
    }

    return Array.from(map.entries())
      .map(([value, { label, count }]) => ({ value: `loc:${value}`, label, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 40);
  }, [dedupedItems]);

  const filteredItems = useMemo(() => {
    return dedupedItems.filter((item) => {
      let laneMatch = false;
      if (activeLane === "all") laneMatch = true;
      else if (activeLane === "contactable") laneMatch = isContactable(item);
      else if (activeLane === "owner-direct") laneMatch = isOwnerDirectStyle(item);
      else if (activeLane === "source-led") laneMatch = isSourceLed(item);

      let catMatch = false;
      if (categoryFilter === "all") catMatch = true;
      else catMatch = getItemCategoryFilter(item) === categoryFilter;

      let locationMatch = false;
      if (locationFilter === "all") locationMatch = true;
      else if (locationFilter.startsWith("city:")) {
        const cityKey = locationFilter.slice(5);
        locationMatch = getCityFilterKey(item) === cityKey;
      } else if (locationFilter.startsWith("loc:")) {
        const locKey = locationFilter.slice(4);
        locationMatch = getLocationFilterKey(item) === locKey;
      } else {
        // legacy fallback (should not happen with new UI)
        locationMatch = getLocationFilterKey(item) === locationFilter;
      }

      return laneMatch && catMatch && locationMatch;
    });
  }, [dedupedItems, activeLane, categoryFilter, locationFilter]);

  const visibleCards = filteredItems.slice(0, OWNER_DIRECT_RENDER_LIMIT);

  // Overview metrics
  const totalSignals = dedupedItems.length;
  const contactableCount = dedupedItems.filter(isContactable).length;
  const sourceLedCount = dedupedItems.filter(isSourceLed).length;
  const higherConfCount = dedupedItems.filter(isHigherConfidence).length;

  const categoryOptions: Array<{ value: CategoryFilter; label: string }> = [
    { value: "all", label: "All Categories" },
    { value: "residential_buy", label: "Residential Buy" },
    { value: "residential_rent", label: "Residential Rent" },
    { value: "commercial_buy", label: "Commercial Buy" },
    { value: "commercial_rent", label: "Commercial Rent" },
    { value: "short_rental", label: "Short Rental" },
    { value: "land", label: "Land" },
  ];

  // Empty state
  if (allNormalized.length === 0) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        <section
          className="relative rounded-[28px] border overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.9) 100%)",
            borderColor: "rgba(255,255,255,0.06)",
            boxShadow: "0 24px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <GridPattern />
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
                style={{ color: C.cyHi, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}
              >
                <UserCheck className="h-3.5 w-3.5" />
                Owner / Direct Radar
              </span>
            </div>

            <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
              No owner/direct signals available
            </h1>

            <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
              No public owner/direct-style signals are available in this workspace snapshot.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                href={`${country.routeBase}/activity-feed`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)",
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(6,182,212,0.25)",
                }}
              >
                Open Recent Market Movement
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href={`${country.routeBase}/price-drops`}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
                style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                Open Price Drops
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section
        className="relative rounded-[28px] border overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.9) 100%)",
          borderColor: "rgba(255,255,255,0.06)",
          boxShadow: "0 24px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        <GridPattern />
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.cyHi, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Owner / Direct Radar
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            Find Direct & Contactable Listings
          </h1>

          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Review public direct-style, no-commission, and contactable listing signals before outreach.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                document.getElementById("owner-direct-list")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(6,182,212,0.25)",
              }}
            >
              Review Direct Signals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <Link
              href={`${country.routeBase}/price-drops`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Price Drops
            </Link>

            <Link
              href={`${country.routeBase}/listing-age`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Listing Truth
            </Link>

            <Link
              href={`${country.routeBase}/activity-feed`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Recent Market Movement
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Overview Cards ─────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Activity className="h-5 w-5" style={{ color: C.cyHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Signal Overview
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Direct Signals"
            value={formatNumber(totalSignals)}
            description="Total owner/direct-style records in this snapshot."
            icon={<UserCheck className="h-5 w-5" />}
            accentColor={C.cyHi}
            href="#owner-direct-list"
            ctaLabel="View Signals"
          />
          <SnapshotCard
            title="Contactable"
            value={formatNumber(contactableCount)}
            description="Records with phone, WhatsApp, or email signals."
            icon={<Phone className="h-5 w-5" />}
            accentColor={C.emHi}
            href="#owner-direct-list"
            ctaLabel="View Contactable"
          />
          <SnapshotCard
            title="Source-Led"
            value={formatNumber(sourceLedCount)}
            description="Source URL available but no direct contact signal."
            icon={<Globe2 className="h-5 w-5" />}
            accentColor={C.amHi}
            href="#owner-direct-list"
            ctaLabel="Review Sources"
          />
          <SnapshotCard
            title="Higher Confidence"
            value={formatNumber(higherConfCount)}
            description="Records with stronger direct-style evidence."
            icon={<ShieldCheck className="h-5 w-5" />}
            accentColor={C.t2}
            href="#owner-direct-list"
            ctaLabel="Review Evidence"
          />
        </div>
      </section>

      {/* ── 3. Intelligence Panels ────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <Layers className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Direct Signal Intelligence
          </h2>
        </div>

        <IntelligencePanel
          title="Contactable Signals"
          purpose="Find public listings with visible phone, WhatsApp, or email contact routes for direct follow-up."
          agentUseText="Use this to prioritize listings where a contact path is already visible, reducing the effort needed to initiate outreach."
          chips={["Phone", "WhatsApp", "Email", "Contact route"]}
          icon={<Phone className="h-5 w-5" />}
          accentColor={C.emHi}
          primaryAction={{ label: "View Contactable", onClick: () => setActiveLane("contactable") }}
        />

        <IntelligencePanel
          title="Owner/Direct-Style Signals"
          purpose="Review public listings classified with direct, no-commission, or owner-style wording and advertiser context."
          agentUseText="Use this to find listings that may represent direct advertiser activity, but always verify before claiming ownership status."
          chips={["Direct signal", "No-commission style", "Advertiser context"]}
          icon={<UserCheck className="h-5 w-5" />}
          accentColor={C.cyHi}
          primaryAction={{ label: "View Direct Signals", onClick: () => setActiveLane("owner-direct") }}
        />

        <IntelligencePanel
          title="Source-Led Verification"
          purpose="Review source URLs where direct or contact evidence needs verification through the original listing."
          agentUseText="Use this to find listings that need source verification before outreach. Open the listing URL to confirm advertiser context."
          chips={["Source URL", "Verification needed", "Listing review"]}
          icon={<Globe2 className="h-5 w-5" />}
          accentColor={C.amHi}
          primaryAction={{ label: "Review Sources", onClick: () => setActiveLane("source-led") }}
        />
      </section>

      {/* ── Filter Selectors ────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 pt-2">
        {/* Row 1: signal type buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { key: "all" as const, label: "All Direct Signals" },
              { key: "contactable" as const, label: "Contactable" },
              { key: "owner-direct" as const, label: "Owner/Direct Style" },
              { key: "source-led" as const, label: "Source Verification" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveLane(opt.key)}
              className="rounded-full px-5 py-2 text-[13px] font-bold transition-colors"
              style={{
                background: activeLane === opt.key ? C.cyHi : "rgba(255,255,255,0.05)",
                color: activeLane === opt.key ? "#000" : C.t2,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Row 2: location row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All locations */}
          <button
            onClick={() => setLocationFilter("all")}
            className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
            style={{
              background: locationFilter === "all" ? C.cyHi : "rgba(255,255,255,0.05)",
              color: locationFilter === "all" ? "#000" : C.t2,
              border: `1px solid ${locationFilter === "all" ? "transparent" : C.borderSub}`,
            }}
          >
            All locations
          </button>

          {/* city chips */}
          {cityOptions.map((city) => {
            const cityValue = `city:${city.value}`;
            const isActive = locationFilter === cityValue;
            return (
              <button
                key={cityValue}
                onClick={() => setLocationFilter(cityValue)}
                className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{
                  background: isActive ? C.cyHi : "rgba(255,255,255,0.05)",
                  color: isActive ? "#000" : C.t2,
                  border: `1px solid ${isActive ? "transparent" : C.borderSub}`,
                }}
              >
                {city.label} ({city.count})
              </button>
            );
          })}

          {/* More locations select */}
          <div className="relative inline-block">
            <select
              value={locationFilter.startsWith("loc:") ? locationFilter : ""}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: C.t2,
                border: `1px solid ${C.borderSub}`,
                backdropFilter: "blur(8px)",
                paddingRight: "2rem",
              }}
            >
              <option value="">Districts / more locations</option>
              {locationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.count})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.t4 }}>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Row 3: category chips */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b" style={{ borderColor: C.borderSub }}>
          {categoryOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategoryFilter(opt.value)}
              className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
              style={{
                background: categoryFilter === opt.value ? "rgba(255,255,255,0.15)" : "transparent",
                color: categoryFilter === opt.value ? C.t1 : C.t4,
                border: `1px solid ${categoryFilter === opt.value ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.05)"}`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. Main Card Grid ────────────────────────────────────────── */}
      <section id="owner-direct-list" className="scroll-mt-10 pt-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <UserCheck className="h-5 w-5" style={{ color: C.cyHi }} />
            <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
              Owner / Direct Signals
            </h2>
          </div>
          <span
            className="hidden sm:inline-flex rounded-full border px-3 py-1 text-[11px] font-bold"
            style={{ color: C.t3, background: "rgba(255,255,255,0.02)", borderColor: C.border }}
          >
            {formatNumber(visibleCards.length)} Signals
          </span>
        </div>

        {visibleCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((item, idx) => (
              <OwnerDirectCard
                key={item.id}
                idx={idx}
                item={item}
                routeBase={country.routeBase}
                currency={country.currency}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border p-12 text-center" style={{ background: "rgba(255,255,255,0.015)", borderColor: C.border }}>
            <p className="text-[15px] font-bold text-white">No signals found in this view</p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: C.t4 }}>
              Try selecting a different signal category, location, or filter.
            </p>
          </div>
        )}

        {filteredItems.length > visibleCards.length && (
          <p className="mt-6 text-center text-[13px] font-bold" style={{ color: C.t4 }}>
            Showing top {visibleCards.length} of {formatNumber(filteredItems.length)} filtered signals
          </p>
        )}
      </section>

      {/* ── 5. Trust Strip ──────────────────────────────────────────────── */}
      <section className="pt-4">
        <div
          className="flex flex-col sm:flex-row flex-wrap sm:items-center justify-between gap-4 rounded-[16px] border px-6 py-4 shadow-sm"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: C.borderSub,
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <Globe2 className="h-3.5 w-3.5 opacity-70" style={{ color: C.t3 }} />
              Public listing evidence
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t1 }}>
              <CheckCircle2 className="h-4 w-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ color: C.emHi }} />
              Verify source before outreach
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <ShieldCheck className="h-3.5 w-3.5 opacity-70" style={{ color: C.t3 }} />
              Owner/direct-style signals are not ownership confirmation
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[12px] font-bold tracking-wide" style={{ color: C.t3 }}>
            <span className="uppercase tracking-widest text-[9px] text-zinc-300 bg-white/5 border border-white/10 px-2 py-1 rounded-md shadow-inner">
              {country.currency}
            </span>
            {country.label} Workspace
          </div>
        </div>
      </section>
    </div>
  );
}