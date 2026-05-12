"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Filter,
  Globe2,
  Layers,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type {
  Module6AiReconItem,
  Module6DataResult,
} from "@/lib/data/module6";

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
  vi: "#8b5cf6",
  viHi: "#a78bfa",
  border: "rgba(255,255,255,0.06)",
  borderSub: "rgba(255,255,255,0.04)",
} as const;

type AIReconIntelligencePageProps = {
  country: CountryConfig;
  data: Module6DataResult;
};

function GridPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 select-none opacity-[0.035]"
      style={{ zIndex: 0 }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="ai-recon-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ai-recon-grid)" />
      </svg>
    </div>
  );
}

function getStringField(
  record: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return undefined;
}

function getNumberField(
  record: Record<string, unknown>,
  keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function coerceBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["1", "true", "yes", "y", "safe"].includes(normalized);
  }

  return false;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(
  value: number | undefined,
  currency: "AED" | "SAR"
): string {
  if (value === undefined) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function compactScore(value: number | undefined): string {
  if (value === undefined) return "—";
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function getItemId(item: Module6AiReconItem, index: number): string {
  const directId =
    getStringField(item, ["listing_key", "canonical_id", "normalized_id"]) ??
    getStringField(item, ["portal_id"]);

  if (directId) return directId;

  const reconId = item.recon_id;
  if (typeof reconId === "number" || typeof reconId === "string") {
    return String(reconId);
  }

  return `module6-ai-recon-${index}`;
}

function getLocationLabel(item: Module6AiReconItem): string {
  const city = getStringField(item, ["city"]);
  const district = getStringField(item, ["district", "community"]);
  const location = getStringField(item, ["location"]);

  if (city && district) return `${city} · ${district}`;
  if (district) return district;
  if (city) return city;
  if (location) return location;

  return "Location not specified";
}

function getFilterKey(item: Module6AiReconItem): string {
  const city = getStringField(item, ["city"]) ?? "";
  const district = getStringField(item, ["district", "community"]) ?? "";
  const location = getStringField(item, ["location"]) ?? "";

  return `${city}|||${district}|||${location}`.toLowerCase();
}

function getTitleFallback(item: Module6AiReconItem, index: number): string {
  const propertyType = getStringField(item, ["property_type_norm", "property_type"]);
  const purpose = getStringField(item, ["purpose"]);
  const location = getStringField(item, ["location"]);
  const fallbackParts = [propertyType, purpose, location].filter(Boolean);

  if (fallbackParts.length > 0) {
    return fallbackParts.join(" · ");
  }

  return `AI narrative ${index + 1}`;
}

function getSafeFlags(item: Module6AiReconItem): string[] {
  const flags: string[] = [];

  if (coerceBoolean(item.safe_to_show) || coerceBoolean(item.safe_for_frontend)) {
    flags.push("Frontend safe");
  }

  if (coerceBoolean(item.safe_for_outreach) || coerceBoolean(item.is_safe_for_outreach)) {
    flags.push("Outreach review");
  }

  if (coerceBoolean(item.is_contactable) || coerceBoolean(item.has_any_direct_contact)) {
    flags.push("Contact signal");
  }

  if (coerceBoolean(item.has_phone_available) || coerceBoolean(item.has_phone)) {
    flags.push("Phone listed");
  }

  if (coerceBoolean(item.has_whatsapp_available) || coerceBoolean(item.has_whatsapp)) {
    flags.push("WhatsApp listed");
  }

  if (coerceBoolean(item.has_email_available)) {
    flags.push("Email listed");
  }

  if (coerceBoolean(item.contact_via_url)) {
    flags.push("Source URL contact");
  }

  return flags;
}

function getMetaBadges(item: Module6AiReconItem): string[] {
  return [
    getStringField(item, ["priority_bucket", "priority_label"]),
    getStringField(item, ["opportunity_lane"]),
    getStringField(item, ["direct_confidence_class", "confidence_tier"]),
    getStringField(item, ["owner_direct_bucket"]),
    getStringField(item, ["di_pressure_bucket"]),
  ].filter((value): value is string => Boolean(value));
}

function metricAverageScore(items: Module6AiReconItem[]): number | null {
  const scores = items
    .map((item) => getNumberField(item, ["recon_score", "ai_recon_score"]))
    .filter((value): value is number => value !== undefined);

  if (scores.length === 0) return null;

  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

function StatusPill({
  status,
}: {
  status: Module6DataResult["status"];
}) {
  const statusConfig =
    status === "ready"
      ? {
          label: "Ready",
          color: C.emHi,
          bg: "rgba(52,211,153,0.1)",
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        }
      : status === "missing"
        ? {
            label: "Missing export",
            color: C.amHi,
            bg: "rgba(251,191,36,0.1)",
            icon: <AlertTriangle className="h-3.5 w-3.5" />,
          }
        : {
            label: "Load error",
            color: C.rdHi,
            bg: "rgba(251,113,133,0.1)",
            icon: <AlertTriangle className="h-3.5 w-3.5" />,
          };

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
      style={{
        color: statusConfig.color,
        background: statusConfig.bg,
        borderColor: `${statusConfig.color}33`,
      }}
    >
      {statusConfig.icon}
      {statusConfig.label}
    </span>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
  accentColor,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  accentColor: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[16px] border p-5"
      style={{
        background: "rgba(255,255,255,0.015)",
        borderColor: C.borderSub,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl"
        style={{ background: accentColor, opacity: 0.1 }}
      />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: C.t3 }}
          >
            {title}
          </p>
          <p className="mt-2 text-[25px] font-black tracking-tight text-white">
            {value}
          </p>
          <p className="mt-1.5 text-[12px] font-medium leading-relaxed" style={{ color: C.t3 }}>
            {description}
          </p>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
          style={{
            color: accentColor,
            borderColor: "rgba(255,255,255,0.1)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function NarrativeBlock({
  label,
  children,
  accentColor,
}: {
  label: string;
  children: string;
  accentColor: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        background: "rgba(255,255,255,0.018)",
        borderColor: C.borderSub,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
        />
        <p
          className="text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: C.t3 }}
        >
          {label}
        </p>
      </div>
      <p className="text-[13px] font-medium leading-relaxed" style={{ color: C.t2 }}>
        {children || "No narrative available in this export row."}
      </p>
    </div>
  );
}

function PreviewCard({
  item,
  country,
  index,
}: {
  item: Module6AiReconItem;
  country: CountryConfig;
  index: number;
}) {
  const price = getNumberField(item, ["price_amount", "price"]);
  const score = getNumberField(item, ["recon_score", "ai_recon_score"]);
  const location = getLocationLabel(item);
  const safeFlags = getSafeFlags(item);
  const metaBadges = getMetaBadges(item);
  const listingProfile =
    getStringField(item, ["listing_profile_text", "ai_summary_text", "narrative_summary"]) ??
    "";
  const sellerBehavior = getStringField(item, ["seller_behavior_text"]) ?? "";
  const marketContext = getStringField(item, ["market_context_text"]) ?? "";
  const title =
    getStringField(item, ["title"]) ??
    getTitleFallback(item, index);
  const portal = getStringField(item, ["portal", "schema_name"]);
  const sourceUrl = getStringField(item, ["property_url", "source_url"]);

  return (
    <article
      className="group relative overflow-hidden rounded-[22px] border p-5 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.015)",
        borderColor: C.borderSub,
        boxShadow:
          "0 18px 40px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.025)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-[1.5px] opacity-0 transition-opacity duration-300 group-hover:opacity-70"
        style={{
          background: `linear-gradient(90deg, ${C.viHi}, ${C.cyHi})`,
          boxShadow: `0 0 14px ${C.viHi}`,
        }}
      />
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{
                  color: C.viHi,
                  background: "rgba(167,139,250,0.1)",
                  borderColor: "rgba(167,139,250,0.2)",
                }}
              >
                <Sparkles className="h-3 w-3" />
                Pre-computed narrative
              </span>
              {portal && (
                <span
                  className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    color: C.t3,
                    background: "rgba(255,255,255,0.025)",
                    borderColor: C.border,
                  }}
                >
                  {portal}
                </span>
              )}
              {metaBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    color: C.cyHi,
                    background: "rgba(34,211,238,0.07)",
                    borderColor: "rgba(34,211,238,0.16)",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            <h3 className="text-[17px] font-extrabold tracking-tight text-white">
              {title}
            </h3>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] font-bold" style={{ color: C.t3 }}>
              <MapPinned className="h-3.5 w-3.5" />
              {location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <div
              className="rounded-xl border px-3 py-2 text-right"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: C.t4 }}>
                Price
              </p>
              <p className="text-[13px] font-black text-white">
                {formatCurrency(price, country.currency)}
              </p>
            </div>
            <div
              className="rounded-xl border px-3 py-2 text-right"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: C.t4 }}>
                Recon score
              </p>
              <p className="text-[13px] font-black text-white">
                {compactScore(score)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <NarrativeBlock label="Listing profile" accentColor={C.cyHi}>
            {listingProfile}
          </NarrativeBlock>
          <NarrativeBlock label="Seller behavior text" accentColor={C.viHi}>
            {sellerBehavior}
          </NarrativeBlock>
          <NarrativeBlock label="Market context" accentColor={C.emHi}>
            {marketContext}
          </NarrativeBlock>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: C.borderSub }}>
          <div className="flex flex-wrap items-center gap-2">
            {safeFlags.length > 0 ? (
              safeFlags.map((flag) => (
                <span
                  key={flag}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{
                    color: C.emHi,
                    background: "rgba(52,211,153,0.08)",
                    borderColor: "rgba(52,211,153,0.18)",
                  }}
                >
                  <ShieldCheck className="h-3 w-3" />
                  {flag}
                </span>
              ))
            ) : (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{
                  color: C.amHi,
                  background: "rgba(251,191,36,0.08)",
                  borderColor: "rgba(251,191,36,0.18)",
                }}
              >
                <AlertTriangle className="h-3 w-3" />
                Review required
              </span>
            )}
          </div>

          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-all hover:bg-white/[0.08]"
              style={{
                color: C.t1,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Verify source
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-[11px] font-bold" style={{ color: C.t4 }}>
              Verify source before outreach
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AIReconIntelligencePage({
  country,
  data,
}: AIReconIntelligencePageProps) {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const items = useMemo(() => data.aiRecon?.items ?? [], [data.aiRecon?.items]);
  const exportedCount =
    data.aiRecon?.exported_count ??
    data.manifest?.exported_count ??
    data.aiRecon?.exported_rows ??
    items.length;
  const exportLimit =
    data.aiRecon?.limit ??
    data.manifest?.limit ??
    data.renderLimit;
  const generatedAt =
    data.aiRecon?.generated_at_utc ??
    data.aiRecon?.generated_at ??
    data.aiRecon?.exported_at ??
    data.manifest?.generated_at_utc ??
    data.manifest?.generated_at ??
    data.manifest?.exported_at ??
    null;

  const locationOptions = useMemo(() => {
    const optionMap = new Map<string, string>();

    items.forEach((item) => {
      const key = getFilterKey(item);
      if (!key || key === "||||||") return;

      optionMap.set(key, getLocationLabel(item));
    });

    return Array.from(optionMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      if (locationFilter !== "all" && getFilterKey(item) !== locationFilter) {
        return false;
      }

      if (!normalizedSearch) return true;

      const haystack = [
        item.listing_profile_text,
        item.seller_behavior_text,
        item.market_context_text,
        item.ai_summary_text,
        item.narrative_summary,
        item.title,
        item.property_type,
        item.property_type_norm,
        item.purpose,
        item.location,
        item.city,
        item.district,
        item.community,
        item.building_name,
        item.agency_name,
        item.agency_display_name,
        item.agent_name,
        item.portal,
        item.schema_name,
        item.listing_key,
        item.canonical_id,
        item.priority_bucket,
        item.opportunity_lane,
        item.direct_confidence_class,
        item.owner_direct_bucket,
        item.di_pressure_bucket,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [items, locationFilter, search]);

  const metrics = useMemo(() => {
    const locationSet = new Set<string>();
    let safeFlagCount = 0;

    items.forEach((item) => {
      const key = getFilterKey(item);
      if (key && key !== "||||||") {
        locationSet.add(key);
      }

      if (getSafeFlags(item).length > 0) {
        safeFlagCount += 1;
      }
    });

    const avgScore = metricAverageScore(items);

    return {
      renderedItems: items.length,
      exportedCount,
      exportLimit,
      locationCount: locationSet.size,
      avgScore,
      safeFlagCount,
    };
  }, [items, exportedCount, exportLimit]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      <section
        className="relative overflow-hidden rounded-[28px] border"
        style={{
          background:
            "linear-gradient(180deg, rgba(24,24,27,0.72) 0%, rgba(9,9,11,0.92) 100%)",
          borderColor: "rgba(255,255,255,0.06)",
          boxShadow:
            "0 24px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        <GridPattern />
        <div className="pointer-events-none absolute left-1/4 top-0 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-violet-500/10 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[420px] w-[420px] translate-y-1/2 rounded-full bg-cyan-500/10 blur-[110px]" />

        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm"
              style={{
                color: C.viHi,
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.22)",
              }}
            >
              <BrainCircuit className="h-3.5 w-3.5" />
              AI Recon Intelligence
            </span>
            <StatusPill status={data.status} />
          </div>

          <h1 className="mb-4 bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-[38px] font-extrabold leading-[1.1] tracking-tighter text-transparent drop-shadow-sm sm:text-[48px] lg:text-[56px]">
            Ask the Market in Plain English
          </h1>

          <p className="max-w-3xl text-[16px] font-medium leading-[1.6] sm:text-[18px]" style={{ color: C.t2 }}>
            {country.label} AI Recon Intelligence packages pre-computed AI narratives for listing review, semantic search groundwork, and safer prioritization workflows. Vectors are stripped from the frontend export, and every opportunity should be verified at source before outreach.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div
              className="rounded-2xl border px-4 py-3"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: C.borderSub }}
            >
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: C.t3 }}>
                <Database className="h-3.5 w-3.5" />
                Export status
              </div>
              <p className="mt-1 text-[14px] font-black text-white">
                {data.status === "ready" ? "Loaded" : data.status === "missing" ? "Missing files" : "Error"}
              </p>
            </div>

            <div
              className="rounded-2xl border px-4 py-3"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: C.borderSub }}
            >
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: C.t3 }}>
                <Layers className="h-3.5 w-3.5" />
                Item count
              </div>
              <p className="mt-1 text-[14px] font-black text-white">
                {formatNumber(exportedCount)} exported · limit {formatNumber(exportLimit)} · {formatNumber(items.length)} rendered
              </p>
            </div>

            <div
              className="rounded-2xl border px-4 py-3"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: C.borderSub }}
            >
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: C.t3 }}>
                <Clock3 className="h-3.5 w-3.5" />
                Generated
              </div>
              <p className="mt-1 text-[14px] font-black text-white">
                {formatDateTime(generatedAt)}
              </p>
            </div>
          </div>

          {data.status !== "ready" && (
            <div
              className="mt-6 rounded-2xl border p-4 text-[13px] font-semibold leading-relaxed"
              style={{
                color: data.status === "missing" ? C.amHi : C.rdHi,
                background:
                  data.status === "missing"
                    ? "rgba(251,191,36,0.08)"
                    : "rgba(251,113,133,0.08)",
                borderColor:
                  data.status === "missing"
                    ? "rgba(251,191,36,0.18)"
                    : "rgba(251,113,133,0.18)",
              }}
            >
              {data.message}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3 px-1">
          <Sparkles className="h-5 w-5" style={{ color: C.viHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            AI Narrative Overview
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Rendered narratives"
            value={formatNumber(metrics.renderedItems)}
            description={`Exported ${formatNumber(metrics.exportedCount)} rows with a source limit of ${formatNumber(metrics.exportLimit)}.`}
            icon={<FileText className="h-5 w-5" />}
            accentColor={C.viHi}
          />
          <MetricCard
            title="Locations covered"
            value={metrics.locationCount > 0 ? formatNumber(metrics.locationCount) : "—"}
            description="City, district, and exporter location labels present in the export."
            icon={<MapPinned className="h-5 w-5" />}
            accentColor={C.cyHi}
          />
          <MetricCard
            title="Average score"
            value={metrics.avgScore === null ? "—" : compactScore(metrics.avgScore)}
            description="Average recon score across rendered narrative rows."
            icon={<Target className="h-5 w-5" />}
            accentColor={C.emHi}
          />
          <MetricCard
            title="Safe flags present"
            value={formatNumber(metrics.safeFlagCount)}
            description="Rows with frontend, contact, or outreach review flags."
            icon={<ShieldCheck className="h-5 w-5" />}
            accentColor={C.amHi}
          />
        </div>
      </section>

      <section
        className="rounded-[22px] border p-5"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderColor: C.borderSub,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: C.t3 }}>
              <Filter className="h-4 w-4" />
              Local review filters
            </div>
            <p className="mt-1 text-[13px] font-medium" style={{ color: C.t3 }}>
              Search the pre-computed narratives currently loaded in the browser.
            </p>
          </div>

          <div className="grid gap-3 lg:min-w-[560px] lg:grid-cols-[1fr_220px]">
            <label
              className="flex items-center gap-2 rounded-2xl border px-3.5 py-3"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: C.border }}
            >
              <Search className="h-4 w-4 shrink-0" style={{ color: C.t4 }} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search narratives, agency, location..."
                className="w-full bg-transparent text-[13px] font-semibold text-white outline-none placeholder:text-zinc-600"
              />
            </label>

            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              className="rounded-2xl border px-3.5 py-3 text-[13px] font-bold text-white outline-none"
              style={{
                background: "rgba(15,15,18,0.96)",
                borderColor: C.border,
              }}
            >
              <option value="all">All cities / districts</option>
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: C.borderSub }}>
          <p className="text-[12px] font-bold" style={{ color: C.t3 }}>
            Showing <span style={{ color: C.t1 }}>{formatNumber(filteredItems.length)}</span> of{" "}
            <span style={{ color: C.t1 }}>{formatNumber(items.length)}</span> rendered narratives.
          </p>
          <p className="inline-flex items-center gap-2 text-[12px] font-bold" style={{ color: C.t3 }}>
            <Globe2 className="h-3.5 w-3.5" />
            Vectors stripped from frontend export
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <BrainCircuit className="h-5 w-5" style={{ color: C.viHi }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Narrative Preview Cards
          </h2>
        </div>

        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <PreviewCard
                key={getItemId(item, index)}
                item={item}
                country={country}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-[22px] border p-8 text-center"
            style={{
              background: "rgba(255,255,255,0.015)",
              borderColor: C.borderSub,
            }}
          >
            <Search className="mx-auto h-8 w-8" style={{ color: C.t4 }} />
            <h3 className="mt-4 text-[16px] font-extrabold text-white">
              No narratives match the current filters
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-[13px] font-medium leading-relaxed" style={{ color: C.t3 }}>
              Try clearing the search text or selecting all cities and districts. This page only searches the pre-computed narratives included in the frontend export.
            </p>
          </div>
        )}
      </section>

      <section>
        <div
          className="flex flex-col gap-4 rounded-[16px] border px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: C.borderSub,
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: C.viHi }} />
              Pre-computed AI narratives
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <Database className="h-3.5 w-3.5" style={{ color: C.cyHi }} />
              Semantic search groundwork
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t1 }}>
              <ShieldCheck className="h-4 w-4" style={{ color: C.emHi }} />
              Verify source before outreach
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[12px] font-bold tracking-wide" style={{ color: C.t3 }}>
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] uppercase tracking-widest text-zinc-300 shadow-inner">
              {country.currency}
            </span>
            {country.label} Module 6
          </div>
        </div>
      </section>
    </div>
  );
}
