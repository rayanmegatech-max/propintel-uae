// app/dashboard/_components/ActivityFeedPage.tsx
import Link from "next/link";
import type { ElementType } from "react";
import {
  Activity,
  ArrowRight,
  Database,
  Eye,
  ShieldCheck,
  TrendingDown,
  Zap,
} from "lucide-react";
import { formatNumber } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type { Module5ActivityRecord, Module5DataResult } from "@/lib/data/module5";

// ─── Design tokens (unified with other Module 5 pages) ────────────────────────
const T = {
  cardBg:  "#0c0c0e",
  wellBg:  "#18181b",
  border:  "rgba(255,255,255,0.07)",
  borderFt:"rgba(255,255,255,0.04)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  t4: "#52525b",
  em:    "#10b981",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.08)",
  emBdr: "rgba(16,185,129,0.2)",
  am:    "#fbbf24",
  amBg:  "rgba(245,158,11,0.06)",
  amBdr: "rgba(245,158,11,0.14)",
  rd:    "#fb7185",
  rdBg:  "rgba(244,63,94,0.05)",
  rdBdr: "rgba(244,63,94,0.12)",
  cy: "#06b6d4",
  cyHi: "#22d3ee",
  cyBg: "rgba(34,211,238,0.06)",
  cyBdr: "rgba(34,211,238,0.16)",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type ActivityFeedPageProps = {
  country: CountryConfig;
  data: Module5DataResult;
};

type NormalizedActivityCard = {
  id: string;
  rank: number | null;
  title: string;
  summary: string;
  action: string | null;
  bucket: string;
  type: string;
  subtype: string | null;
  location: string;
  agency: string | null;
  agent: string | null;
  portal: string | null;
  category: string | null;
  propertyType: string | null;
  price: number | null;
  oldPrice: number | null;
  newPrice: number | null;
  priceChangeAmount: number | null;
  priceChangePct: number | null;
  score: number | null;
  confidence: string | null;
  pressure: string | null;
  dominanceSharePct: number | null;
  url: string | null;
  date: string | null;
  sourceTable: string | null;
};

type MetricTone = "emerald" | "amber" | "rose" | "cyan" | "neutral";

// ─── Data helpers (preserved from original) ───────────────────────────────────
function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
function formatLabel(value: string | null): string | null {
  if (!value) return null;
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
function joinParts(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(" · ");
}
function getRecordLocation(country: CountryConfig, record: Module5ActivityRecord): string {
  if (country.slug === "ksa") {
    return joinParts([
      asString(record.city_display_name) ?? asString(record.city),
      asString(record.district_display_name) ?? asString(record.district),
    ]) || "KSA market";
  }
  return joinParts([
    asString(record.city),
    asString(record.community),
    asString(record.building_name),
  ]) || "UAE market";
}
function getRecordTitle(country: CountryConfig, record: Module5ActivityRecord): string {
  if (country.slug === "ksa") {
    return asString(record.card_title) || formatLabel(asString(record.card_type)) || "KSA market activity signal";
  }
  return asString(record.activity_label) || formatLabel(asString(record.activity_type)) || "UAE market activity signal";
}
function getRecordSummary(country: CountryConfig, record: Module5ActivityRecord): string {
  if (country.slug === "ksa") {
    return asString(record.card_summary) || asString(record.product_note) || "A dashboard-safe KSA public-listing activity signal from Module 5.";
  }
  return asString(record.activity_summary) || asString(record.product_note) || "A dashboard-safe UAE public-listing activity signal from Module 5.";
}
function normalizeActivityRecord(
  country: CountryConfig,
  record: Module5ActivityRecord,
  index: number
): NormalizedActivityCard {
  const title = getRecordTitle(country, record);
  const type = formatLabel(asString(record.activity_type)) || formatLabel(asString(record.card_type)) || "Activity Signal";
  const bucket = formatLabel(asString(record.activity_bucket)) || asString(record.activity_priority_label) || "Market Signal";
  const price = asNumber(record.price) ?? asNumber(record.price_amount) ?? asNumber(record.new_price);
  const priceChangeAmount = asNumber(record.drop_amount) ?? asNumber(record.price_change_amount);
  const priceChangePct = asNumber(record.drop_pct) ?? asNumber(record.price_change_pct);
  const url = asString(record.property_url) ?? asString(record.source_url);
  const rank = asNumber(record.dashboard_rank) ?? asNumber(record.category_rank) ?? asNumber(record.activity_rank);
  return {
    id: asString(record.listing_key) || asString(record.normalized_id) || asString(record.canonical_id) || `${country.slug}-activity-${index}`,
    rank,
    title,
    summary: getRecordSummary(country, record),
    action: asString(record.recommended_action),
    bucket,
    type,
    subtype: formatLabel(asString(record.card_subtype)) || formatLabel(asString(record.activity_priority_label)),
    location: getRecordLocation(country, record),
    agency: asString(record.agency_display_name) || asString(record.agency_name) || asString(record.agency_public_key),
    agent: asString(record.agent_name),
    portal: asString(record.portal) || asString(record.source_portal),
    category: formatLabel(asString(record.source_category)),
    propertyType: formatLabel(asString(record.property_type_norm)) || formatLabel(asString(record.property_type)),
    price,
    oldPrice: asNumber(record.old_price),
    newPrice: asNumber(record.new_price),
    priceChangeAmount,
    priceChangePct,
    score: asNumber(record.activity_score) ?? asNumber(record.recon_score) ?? asNumber(record.pressure_score),
    confidence: formatLabel(asString(record.confidence_tier)),
    pressure: formatLabel(asString(record.pressure_bucket)),
    dominanceSharePct: asNumber(record.dominance_share_pct),
    url,
    date: asString(record.activity_date) || asString(record.activity_at) || asString(record.evidence_date) || asString(record.generated_at) || asString(record.built_at),
    sourceTable: asString(record.source_table),
  };
}

// ─── Mini visual primitives ───────────────────────────────────────────────────
function MiniBarRail({ count, tone }: { count?: number; tone: MetricTone }) {
  const segments = 12;
  const filled = Math.min(segments, Math.ceil((count ?? 0) / 1000));
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : tone === "cyan" ? T.cy : T.t3;
  const bg = "rgba(255,255,255,0.08)";
  return (
    <div className="flex items-end gap-[2px] h-5 mt-1">
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} className="flex-1 rounded-[1px]" style={{
          height: `${8 + (i + 1) * 1.2}px`,
          background: i < filled ? color : bg,
          opacity: i < filled ? 0.7 : 0.25,
        }} />
      ))}
    </div>
  );
}
function MiniDotRow({ count, tone }: { count?: number; tone: MetricTone }) {
  const dots = 10;
  const active = Math.min(dots, Math.ceil((count ?? 0) / 500));
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : tone === "cyan" ? T.cy : T.t3;
  return (
    <div className="flex items-center gap-[3px] mt-1">
      {Array.from({ length: dots }).map((_, i) => (
        <div key={i} className="h-[4px] w-[4px] rounded-full" style={{ background: i < active ? color : "rgba(255,255,255,0.08)" }} />
      ))}
    </div>
  );
}
function MiniSignalWave({ tone }: { tone: MetricTone }) {
  const color = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : tone === "cyan" ? T.cy : T.t3;
  return (
    <svg width="44" height="16" viewBox="0 0 44 16" fill="none" aria-hidden="true" className="opacity-50 mt-1">
      <path d="M0 12 L4 10 L8 12 L12 6 L16 8 L20 4 L24 6 L28 2 L32 4 L36 1 L40 3 L44 0" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function AbstractGrid({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
      }} />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyActivityState({ country, message }: { country: CountryConfig; message: string }) {
  const exportCmd = country.slug === "uae" ? "python tools\\export_uae_module5_frontend_data.py" : "python tools\\export_ksa_module5_frontend_data.py";
  const title = country.slug === "ksa" ? `${country.label} Activity Priority not available` : `${country.label} Activity Feed not available`;
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border" style={{ background: T.amBg, borderColor: T.amBdr }}>
        <Database className="h-6 w-6" style={{ color: T.am }} />
      </div>
      <h1 className="text-xl font-bold" style={{ color: T.t1 }}>{title}</h1>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed" style={{ color: T.t3 }}>{message}</p>
      <div className="mt-6 rounded-xl border px-5 py-4 text-left w-full max-w-md" style={{ background: T.cardBg, borderColor: T.border }}>
        <p className="text-xs font-medium" style={{ color: T.t2 }}>Generate local exports:</p>
        <code className="mt-2 block rounded-lg p-3 text-xs" style={{ background: "#000", color: T.emHi, fontFamily: "'DM Mono', monospace" }}>{exportCmd}</code>
      </div>
    </div>
  );
}

// ─── KPI metric card (top accent bar) ────────────────────────────────────────
function MetricCard({ label, value, description, tone = "neutral", visual }: { label: string; value: string; description: string; tone?: MetricTone; visual?: "bars" | "dots" | "signal"; }) {
  const accentColor = tone === "emerald" ? T.emHi : tone === "amber" ? T.am : tone === "rose" ? T.rd : tone === "cyan" ? T.cyHi : T.t4;
  const numVal = parseInt(value.replace(/,/g, ""), 10) || 0;
  return (
    <div className="relative rounded-2xl border p-5 transition-shadow hover:shadow-lg hover:shadow-black/20" style={{
      background: T.cardBg,
      borderColor: T.border,
      borderTopColor: accentColor,
      borderTopWidth: "2px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.05)",
    }}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: accentColor }}>{label}</p>
      <p className="mt-2 font-bold tabular-nums leading-none" style={{ color: T.t1, fontSize: "clamp(22px, 2.4vw, 34px)", letterSpacing: "-0.03em" }}>{value}</p>
      <div className="mt-1 mb-2">
        {visual === "bars" && <MiniBarRail count={numVal} tone={tone} />}
        {visual === "dots" && <MiniDotRow count={numVal} tone={tone} />}
        {visual === "signal" && <MiniSignalWave tone={tone} />}
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: T.t3 }}>{description}</p>
    </div>
  );
}

// ─── Activity Pulse featured card ─────────────────────────────────────────────
function ActivityPulse({ totalRows, priceMovementCount, marketLevelCount, averageScore }: { totalRows: number; priceMovementCount: number; marketLevelCount: number; averageScore: number | null; }) {
  const insights = [
    `${formatNumber(totalRows)} total activity events available in this export`,
    `${formatNumber(priceMovementCount)} records with directional price movement context`,
    `${formatNumber(marketLevelCount)} market‑level signals (pressure, dominance, agency)`,
    averageScore !== null ? `Average signal score: ${formatNumber(averageScore)}` : null,
  ].filter(Boolean);

  return (
    <div className="relative overflow-hidden rounded-2xl border" style={{
      background: `radial-gradient(circle at 30% 60%, rgba(16,185,129,0.05) 0%, transparent 45%), ${T.cardBg}`,
      borderColor: T.border,
      boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}>
      <AbstractGrid className="opacity-30" />
      <div className="relative p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border" style={{ background: T.emBg, borderColor: T.emBdr }}>
            <Zap className="h-5 w-5" style={{ color: T.emHi }} />
          </div>
          <div>
            <h2 className="text-[20px] font-bold tracking-tight" style={{ color: T.t1 }}>Activity Pulse</h2>
            <p className="mt-1 text-[13px]" style={{ color: T.t3 }}>Directional summary of recent public‑listing movement and review signals.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: i === 0 ? T.em : i === 1 ? T.am : i === 2 ? T.cy : T.t4 }} />
                <p className="text-[13px] leading-relaxed" style={{ color: T.t2 }}>{insight}</p>
              </div>
            ))}
          </div>
          <div className="hidden sm:flex items-end gap-[3px] h-[80px] opacity-50" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => {
              const h = i % 3 === 0 ? 0.5 + (priceMovementCount % 10) / 20 : i % 3 === 1 ? 0.3 + (marketLevelCount % 10) / 30 : 0.35 + (totalRows % 10) / 35;
              return (
                <div key={i} className="flex-1 rounded-t-[2px]" style={{
                  height: `${Math.min(100, h * 100)}%`,
                  background: i % 3 === 0 ? `linear-gradient(to top, ${T.am}30, ${T.am}08)` : i % 3 === 1 ? `linear-gradient(to top, ${T.cy}30, ${T.cy}08)` : `linear-gradient(to top, ${T.em}30, ${T.em}08)`,
                }} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Lane Card (left accent bar) ────────────────────────────────────
function ActivityLaneCard({ icon: Icon, title, description, statLabel, statValue, ctaHref, ctaText, tone = "neutral" }: { icon: ElementType; title: string; description: string; statLabel: string; statValue: string; ctaHref?: string; ctaText: string; tone?: MetricTone; }) {
  const accentColor = tone === "emerald" ? T.em : tone === "amber" ? T.am : tone === "rose" ? T.rd : tone === "cyan" ? T.cy : T.t3;
  const iconBg = tone === "emerald" ? T.emBg : tone === "amber" ? T.amBg : tone === "rose" ? T.rdBg : tone === "cyan" ? T.cyBg : "rgba(255,255,255,0.04)";
  const iconBdr = tone === "emerald" ? T.emBdr : tone === "amber" ? T.amBdr : tone === "rose" ? T.rdBdr : tone === "cyan" ? T.cyBdr : T.border;
  const iconClr = tone === "emerald" ? T.emHi : tone === "amber" ? T.am : tone === "rose" ? T.rd : tone === "cyan" ? T.cyHi : T.t2;

  return (
    <div className="relative flex flex-col rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20" style={{
      background: T.cardBg, borderColor: T.border,
      boxShadow: "0 2px 10px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
    }}>
      <span className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl" style={{ background: accentColor }} />
      <div className="flex-1 p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border" style={{ background: iconBg, borderColor: iconBdr }}>
            <Icon className="h-5 w-5" style={{ color: iconClr }} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold" style={{ color: T.t1 }}>{title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: T.t3 }}>{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border px-4 py-3 mb-5" style={{ background: T.wellBg, borderColor: T.border }}>
          <span className="text-[11px] font-medium" style={{ color: T.t4 }}>{statLabel}</span>
          <span className="text-lg font-bold tabular-nums" style={{ color: T.t1, letterSpacing: "-0.025em" }}>{statValue}</span>
        </div>
        <div className="flex items-end gap-[2px] h-6 opacity-35" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-1 rounded-t-[2px]" style={{ height: `${14 + (i % 4) * 6}px`, background: accentColor }} />
          ))}
        </div>
      </div>
      <div className="border-t px-6 py-3.5" style={{ borderColor: T.borderFt }}>
        {ctaHref ? (
          <Link href={ctaHref} className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-opacity hover:opacity-75" style={{ color: tone === "neutral" ? T.t2 : accentColor }}>
            {ctaText}<ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-[13px] font-medium cursor-not-allowed" style={{ color: T.t4 }}>{ctaText}</span>
        )}
      </div>
    </div>
  );
}

// ─── Date formatter for timeline ──────────────────────────────────────────────
function formatTimelineDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateStr;
  }
}

// ─── Clean raw enum terms for display ─────────────────────────────────────────
function cleanEnumTerm(term: string): string {
  const map: Record<string, string> = {
    "CITY_FOCUSED": "City-focused activity",
    "DISTRICT_FOCUSED": "District-focused activity",
    "COMMUNITY_FOCUSED": "Community-focused activity",
    "BUILDING_FOCUSED": "Building-focused activity",
    "ELEVATED_SIGNAL_PORTFOLIO": "Elevated portfolio signal",
    "HIGH_PORTFOLIO_PRESSURE": "High portfolio pressure",
    "MEDIUM_PORTFOLIO_PRESSURE": "Medium portfolio pressure",
    "LOW_PORTFOLIO_PRESSURE": "Low portfolio pressure",
  };
  return map[term] ?? term.replace(/_/g, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

// ─── Extract listing count from summary string ─────────────────────────────────
function extractListingCount(summary: string): number | null {
  // Support multiple variants: "has 32 active/visible listings", "with 92 active/visible listings", "shows 92 active/visible listings"
  const match = summary.match(/(?:has|with|shows)\s+(\d+)\s+(visible|active)\s+listings/i);
  if (match) return parseInt(match[1], 10);
  return null;
}

// ─── Build agent-friendly summary for agency/portfolio records ────────────────
function buildAgencySummary(card: NormalizedActivityCard): { insight: string; whyItMatters: string } {
  const listingCount = extractListingCount(card.summary);
  const location = card.location || "this market";
  
  const insight = listingCount !== null
    ? `${listingCount} visible public listings detected in ${location}.`
    : `Visible public listing activity detected in ${location}.`;

  // Extract additional context from original summary (focus, signal class, pressure)
  const focusMatch = card.summary.match(/focus:\s*([\w_]+)/i);
  const signalClassMatch = card.summary.match(/signal class:\s*([\w_]+)/i);
  const pressureMatch = card.summary.match(/(\w+)\s+Portfolio\s+Pressure/i) || card.summary.match(/Portfolio Pressure:\s*(\w+)/i);

  const context: string[] = [];
  if (focusMatch) context.push(cleanEnumTerm(focusMatch[1]));
  if (signalClassMatch) context.push(cleanEnumTerm(signalClassMatch[1]));
  if (pressureMatch) context.push(cleanEnumTerm(pressureMatch[0].replace(":", "").trim()));

  const whyItMatters = context.length > 0 ? context.join(" · ") : "Public listing activity signal";

  return { insight, whyItMatters };
}

// ─── Score Ring (simple circle with numeric score) ──────────────────────────────
function ScoreRing({ score, tone }: { score: number; tone: MetricTone }) {
  const color = tone === "cyan" ? T.cy : tone === "amber" ? T.am : tone === "emerald" ? T.em : T.t3;
  const bg = tone === "cyan" ? T.cyBg : tone === "amber" ? T.amBg : tone === "emerald" ? T.emBg : "rgba(255,255,255,0.04)";
  const bdr = tone === "cyan" ? T.cyBdr : tone === "amber" ? T.amBdr : tone === "emerald" ? T.emBdr : T.border;
  return (
    <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border" style={{ background: bg, borderColor: bdr }}>
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: T.t4 }}>Score</span>
      <span className="text-xl font-bold tabular-nums leading-none" style={{ color: color }}>{formatNumber(score)}</span>
    </div>
  );
}

// ─── Activity Timeline Row (premium intelligence card) ──────────────────────────
function ActivityTimelineRow({ card, country }: { card: NormalizedActivityCard; country: CountryConfig }) {
  const titleLower = card.title.toLowerCase();
  const typeLower = card.type.toLowerCase();
  const bucketLower = card.bucket.toLowerCase();
  const subtypeLower = card.subtype?.toLowerCase() ?? "";

  const isAgency = card.agency != null ||
    titleLower.includes("agency") ||
    typeLower.includes("agency") ||
    bucketLower.includes("agency") ||
    subtypeLower.includes("agency");
  const isPressure = card.pressure != null ||
    titleLower.includes("pressure") ||
    typeLower.includes("pressure") ||
    bucketLower.includes("pressure") ||
    subtypeLower.includes("pressure");
  const isDominance = card.dominanceSharePct != null ||
    titleLower.includes("dominance") ||
    typeLower.includes("dominance") ||
    bucketLower.includes("dominance") ||
    subtypeLower.includes("dominance");
  const hasPriceMovement = card.priceChangeAmount !== null || card.priceChangePct !== null ||
    (card.oldPrice !== null && card.newPrice !== null && card.oldPrice !== card.newPrice);
  const isPriceMove = hasPriceMovement &&
    (titleLower.includes("price") || typeLower.includes("price") || bucketLower.includes("price"));

  let signalKind = "";
  let signalTone: MetricTone = "neutral";

  if (isAgency) {
    signalKind = "Agency signal";
    signalTone = "cyan";
  } else if (isPressure) {
    signalKind = "Pressure signal";
    signalTone = "amber";
  } else if (isDominance) {
    signalKind = "Dominance signal";
    signalTone = "emerald";
  } else if (isPriceMove) {
    signalKind = "Price move";
    signalTone = "rose";
  } else if (hasPriceMovement) {
    signalKind = "Price move";
    signalTone = "rose";
  } else {
    signalKind = "Market signal";
    signalTone = "neutral";
  }

  const accentColor = signalTone === "rose" ? T.rd : signalTone === "amber" ? T.am : signalTone === "cyan" ? T.cy : signalTone === "emerald" ? T.em : T.t3;
  const badgeBg = signalTone === "rose" ? T.rdBg : signalTone === "amber" ? T.amBg : signalTone === "cyan" ? T.cyBg : signalTone === "emerald" ? T.emBg : "rgba(255,255,255,0.04)";
  const badgeBdr = signalTone === "rose" ? T.rdBdr : signalTone === "amber" ? T.amBdr : signalTone === "cyan" ? T.cyBdr : signalTone === "emerald" ? T.emBdr : T.border;
  const badgeText = signalTone === "rose" ? T.rd : signalTone === "amber" ? T.am : signalTone === "cyan" ? T.cyHi : signalTone === "emerald" ? T.emHi : T.t4;

  const formattedDate = formatTimelineDate(card.date);

  let displayTitle = card.title;
  let entityName = card.agency || card.agent || "Market";
  let insight = "";
  let whyItMatters = "";

  if (isAgency) {
    displayTitle = "Agency Portfolio Activity";
    const { insight: ins, whyItMatters: why } = buildAgencySummary(card);
    insight = ins;
    whyItMatters = why;
    if (card.agency) entityName = card.agency;
  } else if (isPressure) {
    displayTitle = "Pressure Activity";
    insight = "Inventory pressure signal detected in " + (card.location || "this market");
    whyItMatters = card.pressure ? cleanEnumTerm(card.pressure) : "Pressure signal";
  } else if (isDominance) {
    displayTitle = "Dominance Activity";
    insight = "Market dominance signal detected in " + (card.location || "this market");
    whyItMatters = card.dominanceSharePct != null ? `Dominance share ${card.dominanceSharePct}%` : "Dominance signal";
  } else if (signalKind === "Price move") {
    displayTitle = "Price Movement Activity";
    insight = card.priceChangeAmount !== null
      ? `Price dropped by ${formatNumber(card.priceChangeAmount)} (${card.priceChangePct !== null ? card.priceChangePct.toFixed(1) + "%" : "—"}) in ${card.location || "this market"}.`
      : "Price movement detected in " + (card.location || "this market");
    whyItMatters = "Price movement signal · Verify current listing";
  } else {
    displayTitle = "Market Activity Signal";
    insight = card.summary;
    whyItMatters = card.bucket || "Market activity";
  }

  const listingCount = isAgency ? extractListingCount(card.summary) : null;
  const score = card.score;
  const priority = card.bucket;
  const confidence = card.confidence;

  return (
    <div
      className="relative rounded-2xl border p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/30 group"
      style={{
        background: `radial-gradient(circle at 10% 20%, ${accentColor}10 0%, transparent 40%), ${T.cardBg}`,
        borderColor: T.border,
        borderLeftWidth: "3px",
        borderLeftColor: accentColor,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Middle content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Top row: signal label + date/rank */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: accentColor }}>
                {displayTitle}
              </span>
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ background: accentColor, opacity: 0.3 }}
              />
            </div>
            <div className="flex items-center gap-2">
              {formattedDate && (
                <span className="text-[11px] font-medium" style={{ color: T.t4 }}>
                  {formattedDate}
                </span>
              )}
              {card.rank !== null && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium" style={{ color: T.t4, background: T.wellBg, borderColor: T.borderFt }}>
                  #{card.rank}
                </span>
              )}
            </div>
          </div>

          {/* Entity name */}
          <h3 className="text-[19px] font-bold leading-tight" style={{ color: T.t1 }}>
            {entityName}
          </h3>

          {/* Location */}
          {card.location && (
            <p className="text-[13px]" style={{ color: T.t3 }}>
              {card.location}
            </p>
          )}

          {/* Insight */}
          <p className="text-[14px] leading-relaxed" style={{ color: T.t2 }}>
            {insight}
          </p>

          {/* Listing count block (if agency and count exists) */}
          {isAgency && listingCount !== null && (
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black tabular-nums" style={{ color: accentColor, letterSpacing: "-0.02em" }}>
                {listingCount.toLocaleString()}
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: T.t4 }}>
                VISIBLE LISTINGS
              </span>
              {/* Mini sparkline decorative */}
              <div className="flex items-end gap-[2px] h-5 ml-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-1.5 rounded-t-[1px]" style={{
                    height: `${10 + (i % 3) * 4}px`,
                    background: accentColor,
                    opacity: 0.3 + i * 0.1,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Why it matters */}
          <p className="text-[12px] font-medium leading-relaxed" style={{ color: T.t4 }}>
            {whyItMatters}
          </p>

          {/* Chips row: compact metadata */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[11px] font-medium px-2 py-1 rounded-lg border"
              style={{ color: badgeText, background: badgeBg, borderColor: badgeBdr }}
            >
              {signalKind}
            </span>
            {card.location && (
              <span className="text-[11px] px-2 py-1 rounded-lg border" style={{ color: T.t3, background: T.wellBg, borderColor: T.borderFt }}>
                {card.location}
              </span>
            )}
            {card.agency && (
              <span className="text-[11px] px-2 py-1 rounded-lg border truncate max-w-[160px]" style={{ color: T.t3, background: T.wellBg, borderColor: T.borderFt }}>
                {card.agency}
              </span>
            )}
            {card.score !== null && (
              <span className="text-[11px] px-2 py-1 rounded-lg border tabular-nums" style={{ color: T.t3, background: T.wellBg, borderColor: T.borderFt }}>
                Score {formatNumber(card.score)}
              </span>
            )}
            {card.confidence && (
              <span className="text-[11px] px-2 py-1 rounded-lg border" style={{ color: T.t3, background: T.wellBg, borderColor: T.borderFt }}>
                {card.confidence}
              </span>
            )}
            {card.bucket && (
              <span className="text-[11px] px-2 py-1 rounded-lg border" style={{ color: T.t3, background: T.wellBg, borderColor: T.borderFt }}>
                {priority}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={`${country.routeBase}/market-intelligence`}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-75"
              style={{ color: accentColor }}
            >
              Compare market
              <ArrowRight className="h-3 w-3" />
            </Link>
            <span
              className="inline-flex items-center gap-1.5 text-[12px] font-medium cursor-not-allowed"
              style={{ color: T.t4 }}
            >
              Review signal
              <Eye className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Right panel (score, confidence, priority) */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {score !== null && (
            <ScoreRing score={score} tone={signalKind === "Agency signal" ? "cyan" : signalKind === "Pressure signal" ? "amber" : signalKind === "Dominance signal" ? "emerald" : "neutral"} />
          )}
          {confidence && (
            <span
              className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
              style={{ color: T.t3, background: T.wellBg, borderColor: T.borderFt }}
            >
              {confidence}
            </span>
          )}
          {priority && (
            <span
              className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
              style={{ color: T.t3, background: T.wellBg, borderColor: T.borderFt }}
            >
              {priority}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Data confidence footer ───────────────────────────────────────────────────
function DataConfidenceFooter({ exportedAt, sourceCount }: { exportedAt?: string | null; sourceCount?: number; }) {
  if (!exportedAt && !sourceCount) return null;
  const formattedTime = exportedAt ? new Date(exportedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : null;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border px-5 py-3 text-[11px]" style={{ background: "rgba(255,255,255,0.015)", borderColor: T.borderFt, color: T.t4 }}>
      {formattedTime && <div className="flex items-center gap-1.5"><span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: T.em }} />Synced {formattedTime}</div>}
      {sourceCount !== undefined && <div className="flex items-center gap-1.5"><Database className="h-3 w-3" style={{ color: T.t4 }} />{sourceCount} data exports loaded</div>}
      <div className="ml-auto flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" style={{ color: T.t4 }} />Dashboard‑safe activity view</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ActivityFeedPage({ country, data }: ActivityFeedPageProps) {
  // ── Country‑aware activity payload ─────────────────────────────────────────
  const activityPayload = data.activityFeed;

  if (data.status !== "ready" || !data.manifest || !activityPayload) {
    return <EmptyActivityState country={country} message={data.message} />;
  }
  if (activityPayload.status !== "ready" || activityPayload.items.length === 0) {
    const emptyMsg = country.slug === "ksa"
      ? `${country.label} Module 5 Activity Priority export loaded, but no usable activity records were available in the local frontend sample.`
      : `${country.label} Module 5 Activity Feed export loaded, but no usable activity records were available in the local frontend sample.`;
    return <EmptyActivityState country={country} message={emptyMsg} />;
  }

  const cards: NormalizedActivityCard[] = activityPayload.items.map((record, index) => normalizeActivityRecord(country, record, index));
  const visibleCards = cards.slice(0, 12);

  const totalRows = activityPayload.total_rows_available;
  const exportedRows = activityPayload.exported_rows;
  const withUrlCount = cards.filter(c => c.url).length;
  const marketLevelCount = cards.length - withUrlCount;
  const withPriceMovementCount = cards.filter(c => {
    const has = c.priceChangeAmount !== null || c.priceChangePct !== null || (c.oldPrice !== null && c.newPrice !== null && c.oldPrice !== c.newPrice);
    return has;
  }).length;
  const averageScoreValues = cards.map(c => c.score).filter((v): v is number => v !== null);
  const averageScore = averageScoreValues.length > 0 ? averageScoreValues.reduce((a, b) => a + b, 0) / averageScoreValues.length : null;

  const metricTotalRows = formatNumber(totalRows);
  const metricExported = formatNumber(exportedRows);
  const metricMarketSignals = formatNumber(marketLevelCount);
  const metricAvgScore = averageScore === null ? "—" : formatNumber(averageScore);

  const exportTime = data.manifest.exported_at;
  const sourceCount = Object.keys(data.manifest.exports).length;
  const locationTerm = country.slug === "uae" ? "communities" : "cities/districts";

  // ── Country‑specific wording ──────────────────────────────────────────────
  const pageTitle = country.slug === "ksa" ? "Activity Priority" : "Activity Feed";
  const pageDescription = country.slug === "ksa"
    ? "Review priority public listing movements, market signals, and directional intelligence."
    : "Review recent public listing movement, market signals, and directional intelligence.";
  const badgeLabel = country.slug === "ksa" ? `${country.label} Activity Priority` : `${country.label} Activity Feed`;

  return (
    <div className="space-y-6">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.emHi, background: T.emBg, borderColor: T.emBdr }}>
            <Activity className="h-3 w-3" />
            {badgeLabel}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: T.t1, letterSpacing: "-0.03em" }}>{pageTitle}</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: T.t2 }}>{pageDescription}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="rounded-full border px-3 py-1.5 text-[11px] font-medium" style={{ color: T.t2, background: T.wellBg, borderColor: T.border }}>{country.label}</span>
          <span className="rounded-full border px-3 py-1.5 text-[11px] font-medium" style={{ fontFamily: "'DM Mono', monospace", color: T.t3, background: T.wellBg, borderColor: T.border }}>{country.currency}</span>
          <span className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium" style={{ color: T.emHi, background: T.emBg, borderColor: T.emBdr }}>
            <span className="inline-block h-[5px] w-[5px] rounded-full" style={{ background: T.em }} />
            Live
          </span>
        </div>
      </div>

      {/* ── KPI row ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Activity Events" value={metricTotalRows} description="Total activity records in source table." tone="cyan" visual="bars" />
        <MetricCard label="Exported Sample" value={metricExported} description="Rows loaded in this frontend preview." tone="neutral" visual="dots" />
        <MetricCard label="Market Signals" value={metricMarketSignals} description="Market, pressure, or agency signals." tone="amber" visual="signal" />
        <MetricCard label="Avg Signal Score" value={metricAvgScore} description="Average activity score where available." tone="emerald" visual="bars" />
      </div>

      {/* ── Activity Pulse ───────────────────────────────────────────────── */}
      <ActivityPulse
        totalRows={totalRows}
        priceMovementCount={withPriceMovementCount}
        marketLevelCount={marketLevelCount}
        averageScore={averageScore}
      />

      {/* ── Activity Lanes ───────────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-3">
        <ActivityLaneCard
          icon={Activity}
          title="Recent Movement"
          description="Latest detected listing activity and market changes."
          statLabel="Activity events"
          statValue={metricTotalRows}
          ctaHref={`${country.routeBase}/activity-feed`}
          ctaText="View full feed"
          tone="emerald"
        />
        <ActivityLaneCard
          icon={TrendingDown}
          title="Price / Inventory Signals"
          description="Records with price drops, price movement, or inventory context."
          statLabel="Price moves"
          statValue={formatNumber(withPriceMovementCount)}
          ctaHref={`${country.routeBase}/price-drops`}
          ctaText="View price drops"
          tone="amber"
        />
        <ActivityLaneCard
          icon={Eye}
          title="Market Review Queue"
          description="Market-level signals, pressure, dominance, and agency activity."
          statLabel="Market signals"
          statValue={metricMarketSignals}
          ctaHref={`${country.routeBase}/market-intelligence`}
          ctaText="View market intelligence"
          tone="cyan"
        />
      </div>

      {/* ── Signal Timeline ──────────────────────────────────────────────── */}
      {visibleCards.length > 0 && (
        <div className="rounded-2xl border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: "0 2px 10px rgba(0,0,0,0.22)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold" style={{ color: T.t1 }}>Signal Timeline</h3>
              <p className="mt-1 text-[13px]" style={{ color: T.t3 }}>Top {visibleCards.length} activity records from {locationTerm}.</p>
            </div>
            <span className="rounded-full border px-3 py-1 text-[11px] font-medium" style={{ color: T.t4, background: T.wellBg, borderColor: T.border }}>{metricTotalRows} total</span>
          </div>
          <div className="space-y-3">
            {visibleCards.map(card => <ActivityTimelineRow key={card.id} card={card} country={country} />)}
          </div>
          {cards.length > visibleCards.length && (
            <p className="mt-5 text-center text-[12px]" style={{ color: T.t4 }}>First {visibleCards.length} of {formatNumber(cards.length)} exported</p>
          )}
        </div>
      )}

      {/* ── Data confidence footer ──────────────────────────────────────── */}
      <DataConfidenceFooter exportedAt={exportTime} sourceCount={sourceCount} />
    </div>
  );
}