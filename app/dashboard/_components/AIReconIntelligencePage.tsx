"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Globe2,
  MapPinned,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type {
  Module6AiReconItem,
  Module6DataResult,
} from "@/lib/data/module6";

/* ─── props ─── */
type AIReconIntelligencePageProps = {
  country: CountryConfig;
  data: Module6DataResult;
};

/* ─────────────────────────────────────────────────────────────
   FIELD HELPERS
   ───────────────────────────────────────────────────────────── */

function getStringField(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
  }
  return undefined;
}

function getNumberField(record: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

function coerceBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") return ["1", "true", "yes", "y", "safe"].includes(value.trim().toLowerCase());
  return false;
}

/* ─────────────────────────────────────────────────────────────
   FORMAT HELPERS
   ───────────────────────────────────────────────────────────── */

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(value: number | undefined, currency: "AED" | "SAR"): string {
  if (value === undefined) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function compactScore(value: number | undefined): string {
  if (value === undefined) return "—";
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

/* ─────────────────────────────────────────────────────────────
   ITEM HELPERS
   ───────────────────────────────────────────────────────────── */

function getItemId(item: Module6AiReconItem, index: number): string {
  const directId = getStringField(item, ["listing_key", "canonical_id", "normalized_id"]) ?? getStringField(item, ["portal_id"]);
  if (directId) return directId;
  const reconId = item.recon_id;
  if (typeof reconId === "number" || typeof reconId === "string") return String(reconId);
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

function getTitleCompact(item: Module6AiReconItem): string {
  const propertyType = getStringField(item, ["property_type_norm", "property_type"]);
  const purpose = getStringField(item, ["purpose"]);
  const parts = [propertyType, purpose].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "listing";
}

/* ─────────────────────────────────────────────────────────────
   SIGNAL DETECTION
   ───────────────────────────────────────────────────────────── */

function isContactable(item: Module6AiReconItem): boolean {
  return coerceBoolean(item.is_contactable) || coerceBoolean(item.has_any_direct_contact) || coerceBoolean(item.has_phone) || coerceBoolean(item.has_phone_available) || coerceBoolean(item.has_whatsapp) || coerceBoolean(item.has_whatsapp_available) || coerceBoolean(item.has_email_available) || coerceBoolean(item.contact_via_url);
}

function isOwnerDirect(item: Module6AiReconItem): boolean {
  if (coerceBoolean(item.is_owner_direct) || coerceBoolean(item["has_owner_direct_signal"])) return true;
  const ownerBucket = (getStringField(item, ["owner_direct_bucket"]) ?? "").toLowerCase();
  if (ownerBucket && /high|medium|direct|owner/.test(ownerBucket)) return true;
  const confClass = (getStringField(item, ["direct_confidence_class"]) ?? "").toLowerCase();
  if (confClass.includes("direct")) return true;
  const textSignal = [getStringField(item, ["opportunity_summary"]) ?? "", getStringField(item, ["seller_behavior_text"]) ?? ""].join(" ").toLowerCase();
  if (textSignal.includes("owner/direct") || textSignal.includes("direct-style signal")) return true;
  return false;
}

/* ─────────────────────────────────────────────────────────────
   SMART QUERY PARSER
   ───────────────────────────────────────────────────────────── */

const QUERY_STOP_WORDS = new Set(["show", "find", "where", "should", "today", "which", "are", "the", "me", "a", "i", "in", "and", "or", "with", "for", "of", "to", "by", "what", "how", "give", "list", "do", "have", "has", "look", "like", "s", "want", "need", "can", "will", "only"]);
const GENERIC_ONLY_WORDS = new Set(["prospect", "prospecting", "summarize", "summary", "market", "markets", "opportunity", "opportunities", "listing", "listings", "district", "districts", "context", "narrative", "narratives", "sar", "aed", "score", "recon", "agent", "agents", "signals", "signal", "results", "strong"]);
const KNOWN_CITIES = ["jeddah", "riyadh", "dammam", "mecca", "medina", "khobar", "yanbu", "abha", "tabuk", "dubai", "sharjah", "abudhabi"] as const;
const INTENT_KEYWORDS = new Set<string>(["owner", "direct", "owner-direct", "owner/direct", "contactable", "contact", "phone", "whatsapp", "outreach", "pressure", "elevated", "refresh", "refreshed", "refreshing", "under", "1m", "1000000", ...KNOWN_CITIES]);

function matchesQuery(query: string, item: Module6AiReconItem): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const detectedCity = KNOWN_CITIES.find((city) => q.includes(city));
  const hasOwnerDirectIntent = q.includes("owner") || q.includes("owner-direct") || q.includes("owner/direct");
  const hasContactableIntent = q.includes("contactable") || q.includes("contact") || q.includes("phone") || q.includes("whatsapp") || q.includes("outreach");
  const hasPressureIntent = q.includes("pressure") || q.includes("elevated");
  const hasRefreshIntent = q.includes("refresh") || q.includes("refreshed");
  const hasPriceCap = (q.includes("under") && (q.includes("1m") || q.includes("1 m"))) || q.includes("1000000") || /under\s*(sar|aed)?\s*1\s*m/i.test(q);

  if (detectedCity) {
    const itemLocation = [getStringField(item, ["city"]) ?? "", getStringField(item, ["district", "community"]) ?? "", getStringField(item, ["location"]) ?? ""].join(" ").toLowerCase();
    if (!itemLocation.includes(detectedCity)) return false;
  }
  if (hasOwnerDirectIntent && !isOwnerDirect(item)) return false;
  if (hasContactableIntent && !isContactable(item)) return false;

  if (hasPressureIntent) {
    const pressureBucket = (getStringField(item, ["di_pressure_bucket"]) ?? "").toLowerCase();
    const marketText = (getStringField(item, ["market_context_text"]) ?? "").toLowerCase();
    if (!pressureBucket.includes("elevated") && !pressureBucket.includes("pressure") && !marketText.includes("pressure") && !marketText.includes("elevated")) return false;
  }

  if (hasRefreshIntent) {
    const behaviorText = (getStringField(item, ["seller_behavior_text"]) ?? "").toLowerCase();
    const opportunityText = (getStringField(item, ["opportunity_summary", "recommended_action"]) ?? "").toLowerCase();
    const marketText = (getStringField(item, ["market_context_text"]) ?? "").toLowerCase();
    if (!behaviorText.includes("refresh") && !opportunityText.includes("refresh") && !marketText.includes("refresh")) return false;
  }

  if (hasPriceCap) {
    const price = getNumberField(item, ["price_amount", "price"]);
    if (price === undefined || price > 1_000_000) return false;
  }

  const tokens = q.split(/[\s,]+/).map((t) => t.replace(/[^a-z0-9]/g, "")).filter((t) => t.length > 1 && !QUERY_STOP_WORDS.has(t));
  const remainingTokens = tokens.filter((t) => !INTENT_KEYWORDS.has(t) && !GENERIC_ONLY_WORDS.has(t));
  if (remainingTokens.length === 0) return true;

  const haystack = [
    item.city, item.district, item.community, item.property_type_norm, item.property_type, item.purpose,
    item.listing_profile_text, item.seller_behavior_text, item.market_context_text, item.ai_summary_text,
    item.narrative_summary, item.recommended_action, item.recommended_action_text, item.owner_direct_bucket,
    item.direct_confidence_class, item.di_pressure_bucket, item.location, item.building_name, item.agency_name,
    item.title, item.portal, getStringField(item, ["opportunity_summary"]) ?? "",
  ].filter(Boolean).join(" ").toLowerCase();

  return remainingTokens.every((token) => haystack.includes(token));
}

/* ─────────────────────────────────────────────────────────────
   COPILOT ANALYSIS ENGINE
   ───────────────────────────────────────────────────────────── */

type CopilotAnalysis = {
  summary: string;
  observations: string[];
  actions: string[];
  cityBreakdown: { city: string; count: number }[];
  contactableCount: number;
  ownerDirectCount: number;
  pressureElevatedCount: number;
  topScoreRange: string;
};

function buildCopilotAnalysis(items: Module6AiReconItem[]): CopilotAnalysis {
  const cityMap = new Map<string, number>();
  const districtMap = new Map<string, number>();
  let contactableCount = 0; let ownerDirectCount = 0; let pressureElevatedCount = 0;
  const scores: number[] = [];

  for (const item of items) {
    const city = getStringField(item, ["city"]);
    if (city) cityMap.set(city, (cityMap.get(city) ?? 0) + 1);
    const district = getStringField(item, ["district", "community"]);
    if (district) districtMap.set(district, (districtMap.get(district) ?? 0) + 1);

    const pressure = (getStringField(item, ["di_pressure_bucket"]) ?? "").toLowerCase();
    if (pressure.includes("elevated")) pressureElevatedCount += 1;
    if (isContactable(item)) contactableCount += 1;
    if (isOwnerDirect(item)) ownerDirectCount += 1;

    const score = getNumberField(item, ["recon_score", "ai_recon_score"]);
    if (score !== undefined) scores.push(score);
  }

  const cityBreakdown = Array.from(cityMap.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  const topDistricts = Array.from(districtMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([d]) => d);

  scores.sort((a, b) => b - a);
  const topScoreRange = scores.length >= 2 ? `${compactScore(scores[Math.min(4, scores.length - 1)])}–${compactScore(scores[0])}` : scores.length === 1 ? compactScore(scores[0]) : "—";

  const topCity = cityBreakdown[0]?.city ?? "the market";
  const districtPhrase = topDistricts.length > 0 ? topDistricts.join(", ") : "multiple districts";

  const summary = items.length === 0
    ? "I couldn't find any narratives matching that specific query. Try broadening your criteria or looking at another location."
    : `I've analyzed ${formatNumber(items.length)} pre-computed narratives based on your query. Concentrated opportunity appears around ${topCity} across ${districtPhrase}` +
      (pressureElevatedCount > 0 ? ` with ${pressureElevatedCount} elevated-pressure signals` : "") +
      `. ` + (contactableCount > 0 ? `${formatNumber(contactableCount)} listings have direct contact signals.` : "Contact signals are limited here.") +
      " Remember to verify the source before beginning outreach.";

  const observations: string[] = [];
  if (cityBreakdown.length > 0) observations.push(`Strongest concentration: ${cityBreakdown[0].city} (${cityBreakdown[0].count} listings).`);
  if (contactableCount > 0) observations.push(`${formatNumber(contactableCount)} contactable listings with phone/WhatsApp signals.`);
  if (ownerDirectCount > 0) observations.push(`${formatNumber(ownerDirectCount)} owner/direct-style signals detected.`);
  if (pressureElevatedCount > 0) observations.push(`${formatNumber(pressureElevatedCount)} listings show elevated district-inventory pressure.`);
  if (scores.length > 0) observations.push(`Top recon score range: ${topScoreRange} across ${formatNumber(scores.length)} scored rows.`);
  if (observations.length === 0) observations.push("Limited distinct signal data available for the current filter.");

  const actions: string[] = [];
  if (contactableCount > 0) actions.push("Start with contactable listings — prioritize direct numbers.");
  if (pressureElevatedCount > 0) actions.push("Prioritize elevated-pressure districts for time-sensitive prospecting.");
  actions.push("Always verify source availability before starting outreach.");
  if (topDistricts.length > 0) actions.push(`Use district context (${topDistricts.slice(0, 2).join(", ")}) to decide call priority.`);

  return { summary, observations, actions, cityBreakdown, contactableCount, ownerDirectCount, pressureElevatedCount, topScoreRange };
}

const PROMPT_CHIPS = ["Where should I prospect today?", "Show owner-direct signals in Jeddah", "Find pressure markets under SAR 1M", "Which districts look refreshed?", "Show contactable opportunities"] as const;
const FOLLOW_UP_CHIPS = ["Narrow to under 1M", "Only contactable listings", "Show strongest districts"] as const;

type ChatMessage = { id: string; role: "user" | "assistant"; text?: string; analysis?: CopilotAnalysis; itemCount?: number; };

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────────────────────── */

function MissingExportState({ country, message }: { country: CountryConfig; message: string; }) {
  const label = country.slug.toUpperCase();
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/60 p-12 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative z-10">
        <Clock3 className="h-7 w-7 text-amber-400" />
      </div>
      <h2 className="text-[22px] font-bold tracking-tight text-white relative z-10">{label} Module 6 export is pending</h2>
      <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-zinc-400 relative z-10">
        The AI Recon Copilot interface is ready, but the {label} frontend-safe Module 6 JSON has not been generated yet.
      </p>
      <div className="mt-8 w-full max-w-md rounded-xl border border-white/5 bg-white/[0.02] p-5 text-left shadow-inner relative z-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Expected files</p>
        <code className="block text-[11px] font-mono leading-relaxed text-amber-300/80">exports/frontend/{country.slug}/module6_ai_recon.json</code>
        <code className="block text-[11px] font-mono leading-relaxed text-amber-300/80 mt-1.5">exports/frontend/{country.slug}/module6_manifest.json</code>
      </div>
      {message && <p className="mx-auto mt-5 max-w-md text-[11px] leading-relaxed text-zinc-500 relative z-10">{message}</p>}
    </div>
  );
}

function OpportunityRow({ item, rank, currency }: { item: Module6AiReconItem; rank: number; currency: "AED" | "SAR"; }) {
  const title = getTitleCompact(item);
  const location = getLocationLabel(item);
  const price = getNumberField(item, ["price_amount", "price"]);
  const score = getNumberField(item, ["recon_score", "ai_recon_score"]);
  const ownerBucket = getStringField(item, ["owner_direct_bucket"]);
  const contactable = isContactable(item);
  const pressureBucket = getStringField(item, ["di_pressure_bucket"]);
  const fallbackOwnerDirect = !ownerBucket && isOwnerDirect(item);
  const sourceUrl = getStringField(item, ["property_url", "source_url"]);

  const reason = getStringField(item, ["recommended_action", "recommended_action_text"]) ?? getStringField(item, ["narrative_summary"]);
  const scoreTier = score !== undefined ? (score >= 70 ? "#34d399" : score >= 50 ? "#fcd34d" : "#a1a1aa") : "#71717a";

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-4 transition-all hover:bg-[#121212] hover:border-white/[0.15] hover:shadow-lg relative overflow-hidden backdrop-blur-md">
      {/* Subtle side accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3 pl-1">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-[10px] font-black text-zinc-400 border border-white/5">{rank}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-[13px] font-semibold text-white tracking-tight">{title}</span>
              <span className="text-[11px] font-medium text-zinc-400">{location}</span>
            </div>
            {reason && <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-zinc-400">{truncateText(reason, 90)}</p>}
            <div className="mt-2.5 flex flex-wrap gap-2">
              {ownerBucket && <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan-400 shadow-sm">{ownerBucket.replace(/_/g, ' ')}</span>}
              {fallbackOwnerDirect && <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan-400 shadow-sm">Owner/direct-style</span>}
              {contactable && <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 shadow-sm">Contactable</span>}
              {pressureBucket && <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-400 shadow-sm">{pressureBucket.replace(/_/g, ' ')}</span>}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[13px] font-black text-white tracking-tight">{formatCurrency(price, currency)}</span>
          <span className="text-[11px] font-bold" style={{ color: scoreTier }}>{compactScore(score)}</span>
        </div>
      </div>
      <div className="flex justify-end border-t border-white/5 pt-2.5 mt-1 relative z-10">
        {sourceUrl ? (
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 transition-all hover:text-white">
            Verify source <ArrowUpRight className="h-3 w-3" />
          </a>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            Verify source before outreach
          </span>
        )}
      </div>
    </div>
  );
}

function EvidenceAccordion({ item, index }: { item: Module6AiReconItem; index: number; }) {
  const [open, setOpen] = useState(false);
  const title = getTitleCompact(item);
  const location = getLocationLabel(item);
  const listingProfile = getStringField(item, ["listing_profile_text", "ai_summary_text", "narrative_summary"]) ?? "";
  const sellerBehavior = getStringField(item, ["seller_behavior_text"]) ?? "";
  const sourceUrl = getStringField(item, ["property_url", "source_url"]);
  const hasNarrative = listingProfile || sellerBehavior;

  return (
    <div className={`rounded-xl border transition-all backdrop-blur-sm ${open ? "border-white/20 bg-[#111111]" : "border-white/[0.06] bg-[#0a0a0a]"}`}>
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 p-3.5 text-left hover:bg-white/[0.03] rounded-xl transition-colors">
        <span className="w-5 shrink-0 text-right text-[10px] font-bold text-zinc-500">{index + 1}</span>
        <span className="min-w-0 flex-1 text-[12px] font-semibold text-zinc-200 truncate tracking-tight">{title} <span className="text-zinc-500 font-medium">— {location}</span></span>
        {open ? <ChevronDown className="h-4 w-4 shrink-0 text-white" /> : <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />}
      </button>
      {open && hasNarrative && (
        <div className="space-y-4 px-4 pb-4 pt-1">
          {listingProfile && (
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-cyan-400">Listing profile</p>
              <p className="text-[12px] leading-relaxed text-zinc-400">{truncateText(listingProfile, 200)}</p>
            </div>
          )}
          {sellerBehavior && (
            <div>
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-zinc-300">Signal summary</p>
              <p className="text-[12px] leading-relaxed text-zinc-400">{truncateText(sellerBehavior, 200)}</p>
            </div>
          )}
          {sourceUrl && (
            <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white">
              Verify source <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export default function AIReconIntelligencePage({ country, data }: AIReconIntelligencePageProps) {
  const [search, setSearch] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => data.aiRecon?.items ?? [], [data.aiRecon?.items]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const locationOptions = useMemo(() => {
    const optionMap = new Map<string, string>();
    items.forEach((item) => {
      const key = getFilterKey(item);
      if (key && key !== "||||||") optionMap.set(key, getLocationLabel(item));
    });
    return Array.from(optionMap.entries()).map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (locationFilter !== "all" && getFilterKey(item) !== locationFilter) return false;
      return matchesQuery(currentQuery, item);
    });
  }, [items, locationFilter, currentQuery]);

  const rankedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const sa = getNumberField(a, ["recon_score", "ai_recon_score"]) ?? 0;
      const sb = getNumberField(b, ["recon_score", "ai_recon_score"]) ?? 0;
      return sb - sa;
    });
  }, [filteredItems]);

  const top5 = rankedItems.slice(0, 5);
  const railAnalysis = useMemo(() => buildCopilotAnalysis(filteredItems), [filteredItems]);

  const handleSubmit = useCallback((queryStr: string) => {
    const q = queryStr.trim();
    if (!q) return;

    const specificFiltered = items.filter(item => {
      if (locationFilter !== "all" && getFilterKey(item) !== locationFilter) return false;
      return matchesQuery(q, item);
    });
    const newAnalysis = buildCopilotAnalysis(specificFiltered);

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text: q },
      { id: (Date.now() + 1).toString(), role: "assistant", analysis: newAnalysis, itemCount: specificFiltered.length },
    ]);
    
    setCurrentQuery(q);
    setSearch("");
  }, [items, locationFilter]);

  if (data.status !== "ready") {
    return (
      <div className="mx-auto max-w-[1600px] flex flex-col lg:flex-row gap-6 pb-6 h-[calc(100vh-6rem)]">
        <div className="w-full lg:w-[60%] xl:w-[62%] flex flex-col h-full">
          <div className="mb-4 flex items-center gap-3 px-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              <Sparkles className="h-3 w-3" /> AI Recon Copilot Preview
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
              <AlertTriangle className="h-3 w-3" /> {data.status === "missing" ? "Pending Export" : "Error"}
            </span>
          </div>
          <MissingExportState country={country} message={data.message} />
        </div>
        <div className="hidden lg:flex w-full lg:w-[40%] xl:w-[38%] flex-col rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl h-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] flex flex-col lg:flex-row gap-6 pb-6 h-[calc(100vh-6rem)]">
      
      {/* ━━━ LEFT COLUMN: AI COPILOT WORKSPACE ━━━ */}
      {/* GLOSSY MIRRORING BLACK Base */}
      <div className="flex w-full lg:w-[60%] xl:w-[62%] flex-col rounded-2xl border border-white/[0.08] bg-black shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden h-full relative z-0">
        
        {/* Mirror Reflection Overlay (Top gradient highlight) */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        
        {/* Chat Header */}
        <div className="border-b border-white/[0.08] bg-transparent p-6 sm:px-8 sm:py-6 shrink-0 relative z-10 backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-zinc-300">
              <Sparkles className="h-3 w-3" /> AI Recon Copilot Preview
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> Ready
            </span>
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-white">Ask PropIntel what matters today</h1>
        </div>

        {/* Conversation Thread Feed */}
        <div className="flex-1 overflow-y-auto p-6 sm:px-8 space-y-6 relative z-10 bg-transparent">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center relative z-10 animate-in fade-in duration-500">
              {/* Sleek, simple logo card instead of large brain */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-transparent shadow-[0_0_30px_rgba(255,255,255,0.03)] backdrop-blur-md">
                <Sparkles className="h-6 w-6 text-zinc-300" />
              </div>
              <h2 className="text-[16px] font-semibold text-white tracking-tight">PropIntel Advisor</h2>
              <p className="text-[13px] text-zinc-400 mt-2 max-w-sm">
                I can analyze the loaded Module 6 narratives to help you prioritize contactable listings, owner/direct-style signals, pressure markets, and evidence to verify before outreach.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500/70" /> Owner/direct-style signals
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500/70" /> Source verification required
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {msg.role === "user" && (
                  <div className="flex items-center gap-3 max-w-[85%]">
                    {/* User bubble using frosted glass */}
                    <div className="rounded-2xl rounded-tr-sm bg-white/10 border border-white/10 px-4 py-3 text-[14px] text-white shadow-md font-medium tracking-tight backdrop-blur-md">
                      {msg.text}
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10">
                      <User className="h-4 w-4 text-zinc-300" />
                    </div>
                  </div>
                )}
                {msg.role === "assistant" && msg.analysis && (
                  <div className="flex items-start gap-4 max-w-[95%] sm:max-w-[85%] mt-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.03] border border-white/10 shadow-sm mt-1 backdrop-blur-md">
                      <Sparkles className="h-4 w-4 text-zinc-300" />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      {/* Assistant Bubble - Glossy Dark */}
                      <div className="rounded-2xl rounded-tl-sm bg-[#0a0a0a] border border-white/[0.08] px-5 py-5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
                        <p className="text-[13px] leading-relaxed text-zinc-200 font-medium">
                          {msg.analysis.summary}
                        </p>
                        {(msg.analysis.observations.length > 0 || msg.analysis.actions.length > 0) && (
                          <div className="mt-5 grid gap-6 sm:grid-cols-2 border-t border-white/5 pt-5">
                            <div>
                              <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-cyan-400">What PropIntel sees</p>
                              <ul className="space-y-2">
                                {msg.analysis.observations.map((obs, i) => (
                                  <li key={i} className="flex items-start gap-2.5 text-[12px] leading-snug text-zinc-300">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" /> {obs}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-emerald-400">Recommended actions</p>
                              <ul className="space-y-2">
                                {msg.analysis.actions.map((act, i) => (
                                  <li key={i} className="flex items-start gap-2.5 text-[12px] leading-snug text-zinc-300">
                                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> {act}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                      {msg.itemCount !== undefined && msg.itemCount > 0 && (
                        <div className="flex flex-wrap gap-2 pl-1">
                          {FOLLOW_UP_CHIPS.map(chip => (
                            <button key={chip} onClick={() => handleSubmit(`${currentQuery} ${chip}`.trim())} className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white backdrop-blur-md">
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Composer Area */}
        <div className="border-t border-white/[0.08] bg-transparent p-4 sm:p-6 shrink-0 relative z-10 backdrop-blur-sm">
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            
            {/* Filter & Prompts Bar */}
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 shrink-0 hover:bg-white/[0.06] transition-colors backdrop-blur-md">
                <MapPinned className="h-3.5 w-3.5 text-zinc-400" />
                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="bg-transparent text-[11px] font-semibold text-zinc-200 outline-none cursor-pointer">
                  <option value="all">All locations</option>
                  {locationOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="h-4 w-px bg-white/10 shrink-0" />
              {PROMPT_CHIPS.map((chip) => (
                <button key={chip} type="button" onClick={() => handleSubmit(chip)} className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium text-zinc-300 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white backdrop-blur-md">
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Box - Pure Dark with crisp white ring on focus */}
            <div className="relative flex items-end gap-2 rounded-2xl border border-white/10 bg-black/60 p-1.5 shadow-xl transition-all focus-within:bg-[#050505] focus-within:border-white/30 focus-within:ring-4 focus-within:ring-white/10 backdrop-blur-xl">
              <textarea
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(search); } }}
                placeholder="Ask PropIntel..."
                rows={1}
                className="w-full resize-none bg-transparent px-4 py-3.5 text-[14px] font-medium text-white outline-none placeholder:text-zinc-600 max-h-32 min-h-[48px]"
              />
              <button
                onClick={() => handleSubmit(search)}
                disabled={!search.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:bg-white/5 disabled:text-zinc-600 mb-1 mr-1 shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ RIGHT COLUMN: PROOF & ACTION RAIL ━━━ */}
      <div className="flex w-full lg:w-[40%] xl:w-[38%] flex-col gap-6 overflow-y-auto pr-2 pb-2 hide-scrollbar h-full">
        
        {/* A. Advisor Summary */}
        <section className="shrink-0">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Current Scope</h2>
            <span className="text-[10px] font-medium text-zinc-500">{formatNumber(filteredItems.length)} narratives active</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Rows matched", value: formatNumber(filteredItems.length), dot: "bg-zinc-400" },
              { label: "Strongest area", value: railAnalysis.cityBreakdown[0]?.city ?? "—", dot: "bg-cyan-400" },
              { label: "Owner/direct-style", value: formatNumber(railAnalysis.ownerDirectCount), dot: "bg-emerald-400" },
              { label: "Pressure markers", value: formatNumber(railAnalysis.pressureElevatedCount), dot: "bg-amber-400" },
            ].map((m) => (
              <div key={m.label} className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-4 py-3 flex flex-col justify-center backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{m.label}</p>
                </div>
                <p className="text-[15px] font-bold tracking-tight text-white truncate pl-3">{m.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* B. Action Rail */}
        {railAnalysis.actions.length > 0 && (
          <section className="shrink-0">
            <div className="mb-3 px-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Action Playbook</h2>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40" />
              <ul className="space-y-3">
                {railAnalysis.actions.slice(0, 3).map((act, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                    </div>
                    <span className="text-[12px] font-medium leading-relaxed text-zinc-200 tracking-tight">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* C. Top Opportunities */}
        {top5.length > 0 && (
          <section className="shrink-0">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Top Opportunities</h2>
              <span className="text-[10px] font-medium text-zinc-500">by recon score</span>
            </div>
            <div className="space-y-2.5">
              {top5.map((item, i) => (
                <OpportunityRow key={getItemId(item, i)} item={item} rank={i + 1} currency={country.currency} />
              ))}
            </div>
          </section>
        )}

        {/* D. Supporting Evidence */}
        {rankedItems.length > 0 && (
          <section className="shrink-0">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Supporting Evidence</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                  <ShieldCheck className="h-3 w-3 text-emerald-500/70" /> Verify Source
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                  <Globe2 className="h-3 w-3 text-zinc-400/70" /> Vectors Stripped
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {rankedItems.slice(0, 10).map((item, i) => (
                <EvidenceAccordion key={getItemId(item, i)} item={item} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}