// app/dashboard/_components/ReconOpportunityCard.tsx
import Link from "next/link";
import {
  ArrowUpRight,
  Bed,
  Building2,
  ExternalLink,
  MapPinned,
  Maximize,
  Phone,
  TrendingDown,
} from "lucide-react";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  labelize,
} from "@/lib/recon/formatters";
import type { NormalizedReconOpportunity, ReconSignalBadge } from "@/lib/recon/types";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  pageBg:   "#09090b",
  cardBg:   "#111113",
  wellBg:   "#18181b",
  deepBg:   "#0d0d0f",
  agentBg:  "#141416",   // slightly lighter than deepBg for agent block
  border:   "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  em:    "#10b981",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.08)",
  emBdr: "rgba(16,185,129,0.2)",
  am:    "#fbbf24",
  amBg:  "rgba(245,158,11,0.08)",
  amBdr: "rgba(245,158,11,0.18)",
  rd:    "#fb7185",
  rdBg:  "rgba(244,63,94,0.08)",
  rdBdr: "rgba(244,63,94,0.18)",
} as const;

// ─── Badge tone ───────────────────────────────────────────────────────────────
function badgeStyle(label: string): { color: string; bg: string; border: string } {
  const l = label.toLowerCase();
  if (l.includes("drop") || l.includes("price") || l.includes("reduction") || l.includes("movement"))
    return { color: C.rd,   bg: C.rdBg,  border: C.rdBdr };
  if (l.includes("owner") || l.includes("direct") || l.includes("hot") || l.includes("multi"))
    return { color: C.emHi, bg: C.emBg,  border: C.emBdr };
  if (l.includes("stale") || l.includes("refresh") || l.includes("aged") || l.includes("inflat"))
    return { color: C.am,   bg: C.amBg,  border: C.amBdr };
  return { color: C.t3, bg: "rgba(255,255,255,0.04)", border: C.borderFt };
}

function SignalBadge({ badge }: { badge: ReconSignalBadge }) {
  const s = badgeStyle(badge.label);
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.07em]"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {badge.label}
    </span>
  );
}

// ─── Title builder: asset-first ───────────────────────────────────────────────
function buildTitle(opp: NormalizedReconOpportunity): string {
  const beds = opp.bedrooms != null ? `${opp.bedrooms} Bed ` : "";
  const type = opp.propertyType ?? null;
  const loc  = opp.locationLabel ?? null;
  if (type && loc) return `${beds}${type} — ${loc}`;
  if (type)        return `${beds}${type}`;
  if (loc)         return `Listing Opportunity — ${loc}`;
  return "Listing Opportunity";
}

// ─── Country-aware size display ───────────────────────────────────────────────
// UAE (AED) → sqft primary; KSA (SAR) → sqm primary.
// Always prefer sizeLabel if the normalizer already provided one.
function buildSizeDisplay(opp: NormalizedReconOpportunity): string | null {
  if (opp.sizeLabel) return opp.sizeLabel;
  if (opp.sizeValue == null) return null;
  const unit = opp.currency === "SAR" ? "sqm" : "sqft";
  return `${formatNumber(opp.sizeValue)} ${unit}`;
}

// ─── Insight line ─────────────────────────────────────────────────────────────
type InsightResult = { text: string; tone: "am" | "em" | "neutral" };

function buildInsight(opp: NormalizedReconOpportunity): InsightResult {
  const dropPct = opp.dropPct;
  if (dropPct != null && dropPct > 0)
    return { text: `Price moved ${formatPercent(dropPct)} below previous ask — verify current listing.`, tone: "am" };
  if (opp.priorityLabel?.toLowerCase().includes("owner"))
    return { text: "Owner/direct-style signal — contact path available.", tone: "em" };
  if (opp.score != null && opp.score >= 90)
    return { text: "Top-scoring opportunity in this lane. Review now.", tone: "em" };
  if (opp.signalBadges.some((b) => b.label?.toLowerCase().includes("multi")))
    return { text: "Multiple public listing signals detected on this property.", tone: "em" };
  const isUrlOnly = !opp.hasPhone && !opp.hasWhatsapp && !opp.hasEmail;
  if (isUrlOnly)
    return { text: "Source-only lead — open the source to verify details before outreach.", tone: "neutral" };
  return { text: "Public listing activity changed — verify current listing.", tone: "neutral" };
}

// ─── Contact info ─────────────────────────────────────────────────────────────
function contactInfo(opp: NormalizedReconOpportunity): { label: string; isUrlOnly: boolean } {
  if (opp.hasPhone)    return { label: "Phone signal",    isUrlOnly: false };
  if (opp.hasWhatsapp) return { label: "WhatsApp signal", isUrlOnly: false };
  if (opp.hasEmail)    return { label: "Email signal",    isUrlOnly: false };
  return { label: "Source-only lead", isUrlOnly: true };
}

// ─── Price movement block (shared) ───────────────────────────────────────────
function PriceMovement({ opp }: { opp: NormalizedReconOpportunity }) {
  const has =
    opp.oldPrice !== null || opp.newPrice !== null ||
    opp.dropAmount !== null || opp.dropPct !== null;
  if (!has) return null;
  return (
    <div
      className="space-y-1.5 rounded-xl border p-3"
      style={{ background: C.wellBg, borderColor: C.border }}
    >
      {opp.oldPrice !== null && (
        <div className="flex items-center justify-between text-[12px]">
          <span style={{ color: C.t3 }}>Was</span>
          <span className="tabular-nums line-through" style={{ color: C.t3 }}>
            {formatCurrency(opp.oldPrice, opp.currency)}
          </span>
        </div>
      )}
      {opp.newPrice !== null && (
        <div className="flex items-center justify-between text-[12px]">
          <span style={{ color: C.t3 }}>Now</span>
          <span className="font-semibold tabular-nums" style={{ color: C.t1 }}>
            {formatCurrency(opp.newPrice, opp.currency)}
          </span>
        </div>
      )}
      {opp.dropAmount !== null && (
        <div
          className="flex items-center justify-between border-t pt-1.5 text-[12px]"
          style={{ borderColor: C.borderFt }}
        >
          <span style={{ color: C.t3 }}>Drop</span>
          <span className="font-semibold tabular-nums" style={{ color: C.am }}>
            {formatCurrency(opp.dropAmount, opp.currency)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Agent identity block ─────────────────────────────────────────────────────
// Two variants: "featured" (larger avatar, bolder text) and "list" (contained card)
function AgentBlock({
  opp,
  variant,
}: {
  opp: NormalizedReconOpportunity;
  variant: "featured" | "list";
}) {
  const name   = opp.agentName  ?? null;
  const agency = opp.agencyName ?? null;
  if (!name && !agency) return null;

  const primary   = name ?? agency!;
  const secondary = name && agency ? agency : null;
  const initial   = primary.charAt(0).toUpperCase();
  const isFeatured = variant === "featured";

  return (
    <div
      className="flex items-center gap-3 rounded-xl border"
      style={{
        background:  isFeatured ? C.wellBg : C.agentBg,
        borderColor: C.border,
        padding:     isFeatured ? "10px 14px" : "8px 12px",
      }}
    >
      {/* Avatar */}
      <div
        className="flex shrink-0 items-center justify-center rounded-full font-bold"
        style={{
          width:      isFeatured ? 36 : 30,
          height:     isFeatured ? 36 : 30,
          fontSize:   isFeatured ? 13  : 11,
          background: "linear-gradient(145deg,#27272a,#18181b)",
          color:      C.emHi,
          border:     `1px solid ${C.border}`,
        }}
      >
        {initial}
      </div>

      {/* Name + agency */}
      <div className="min-w-0">
        <p
          className="truncate font-semibold leading-tight"
          style={{
            fontSize: isFeatured ? 14 : 13,
            color:    C.t1,
          }}
        >
          {primary}
        </p>
        {secondary && (
          <p
            className="mt-0.5 truncate leading-tight"
            style={{ fontSize: isFeatured ? 12 : 11, color: C.t3 }}
          >
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── FEATURED card ────────────────────────────────────────────────────────────
function FeaturedCard({ opp }: { opp: NormalizedReconOpportunity }) {
  const dropPct       = formatPercent(opp.dropPct);
  const contact       = contactInfo(opp);
  const title         = buildTitle(opp);
  const insight       = buildInsight(opp);
  const sizeDisplay   = buildSizeDisplay(opp);
  const visibleBadges = opp.signalBadges.slice(0, 3);
  const overflow      = opp.signalBadges.length - visibleBadges.length;
  const hasPriceMov   =
    opp.oldPrice !== null || opp.newPrice !== null ||
    opp.dropAmount !== null || opp.dropPct !== null;
  const ctaLabel = contact.isUrlOnly ? "View Source" : "Open Listing";

  const insightBarColor =
    insight.tone === "am" ? C.am :
    insight.tone === "em" ? C.emHi : C.t4;
  const insightTextColor =
    insight.tone === "am" ? C.am :
    insight.tone === "em" ? C.emHi : C.t3;

  return (
    <article
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background:  "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, #0d0d0f 40%)",
        borderColor: "rgba(16,185,129,0.22)",
        boxShadow:   "0 0 0 1px rgba(16,185,129,0.08), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Top hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.3),transparent)" }}
      />

      <div className="grid gap-0 lg:grid-cols-[1fr_264px]">
        {/* ── Left ───────────────────────────────────────────────── */}
        <div className="p-5 sm:p-6">
          {/* Micro-row: rank + score + drop + badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {opp.rank != null && (
              <span
                className="rounded-md px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: C.emHi, background: C.emBg, border: `1px solid ${C.emBdr}` }}
              >
                Rank #{opp.rank}
              </span>
            )}
            {opp.score != null && (
              <span
                className="rounded-md px-2.5 py-[3px] text-[10px] font-semibold tabular-nums"
                style={{ color: C.t2, background: C.wellBg, border: `1px solid ${C.border}` }}
              >
                Score {opp.score}
              </span>
            )}
            {dropPct && (
              <span
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-[3px] text-[10px] font-semibold"
                style={{ color: C.rd, background: C.rdBg, border: `1px solid ${C.rdBdr}` }}
              >
                <TrendingDown className="h-3 w-3" />
                {dropPct}
              </span>
            )}
            {visibleBadges.map((b) => (
              <SignalBadge key={b.label} badge={b} />
            ))}
            {overflow > 0 && (
              <span className="text-[10px]" style={{ color: C.t4 }}>
                +{overflow} more
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            className="line-clamp-2 text-[20px] font-bold leading-snug sm:text-[22px]"
            style={{ color: C.t1, letterSpacing: "-0.025em" }}
          >
            {title}
          </h2>

          {/* Spec bar */}
          <div
            className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-t py-3"
            style={{ borderColor: C.borderFt }}
          >
            {opp.locationLabel && (
              <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: C.t2 }}>
                <MapPinned className="h-3.5 w-3.5 shrink-0" style={{ color: C.t4 }} />
                {opp.locationLabel}
              </span>
            )}
            {opp.propertyType && (
              <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: C.t2 }}>
                <Building2 className="h-3.5 w-3.5 shrink-0" style={{ color: C.t4 }} />
                {opp.propertyType}
              </span>
            )}
            {opp.bedrooms != null && (
              <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: C.t2 }}>
                <Bed className="h-3.5 w-3.5 shrink-0" style={{ color: C.t4 }} />
                {opp.bedrooms} Beds
              </span>
            )}
            {sizeDisplay && (
              <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: C.t2 }}>
                <Maximize className="h-3.5 w-3.5 shrink-0" style={{ color: C.t4 }} />
                {sizeDisplay}
              </span>
            )}
            {opp.portal && (
              <span className="text-[12px]" style={{ color: C.t4 }}>
                {labelize(opp.portal)}
              </span>
            )}
          </div>

          {/* Agent identity — featured size */}
          <div className="mt-4">
            <AgentBlock opp={opp} variant="featured" />
          </div>

          {/* Insight */}
          <div
            className="mt-4 rounded-xl border-l-2 px-4 py-2.5 text-[12px] font-medium leading-[1.6]"
            style={{
              borderLeftColor: insightBarColor,
              background:      insight.tone === "am" ? C.amBg : insight.tone === "em" ? C.emBg : "rgba(255,255,255,0.03)",
              color:           insightTextColor,
            }}
          >
            {insight.text}
          </div>
        </div>

        {/* ── Right: price + action ───────────────────────────────── */}
        <aside
          className="flex flex-col justify-between gap-5 border-t p-5 lg:border-l lg:border-t-0"
          style={{ background: C.deepBg, borderColor: C.border }}
        >
          <div>
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: C.t4 }}
            >
              {opp.priceLabel ?? "Advertised price"}
            </p>
            <p
              className="mt-1.5 text-[28px] font-bold tabular-nums leading-none"
              style={{ color: C.t1, letterSpacing: "-0.03em" }}
            >
              {formatCurrency(opp.price, opp.currency)}
            </p>
            {hasPriceMov && (
              <div className="mt-3">
                <PriceMovement opp={opp} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            {opp.listingUrl ? (
              <Link
                href={opp.listingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
                style={{ background: C.em, boxShadow: "0 4px 14px rgba(16,185,129,0.24)" }}
              >
                {ctaLabel}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center rounded-xl py-2.5 text-[13px] font-medium"
                style={{ background: C.wellBg, color: C.t4, border: `1px solid ${C.border}` }}
              >
                Listing unavailable
              </button>
            )}

            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-2"
              style={{ background: C.wellBg, borderColor: C.border }}
            >
              <Phone className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
              <span className="flex-1 text-[11px]" style={{ color: C.t3 }}>
                {contact.label}
              </span>
              {opp.listingUrl && (
                <Link
                  href={opp.listingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-75"
                  style={{ color: C.emHi }}
                >
                  Source
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {contact.isUrlOnly && (
              <p className="text-center text-[10px]" style={{ color: C.t4 }}>
                Verify details from source before outreach
              </p>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}

// ─── LIST card ────────────────────────────────────────────────────────────────
function ListCard({ opp }: { opp: NormalizedReconOpportunity }) {
  const dropPct       = formatPercent(opp.dropPct);
  const contact       = contactInfo(opp);
  const title         = buildTitle(opp);
  const insight       = buildInsight(opp);
  const sizeDisplay   = buildSizeDisplay(opp);
  const visibleBadges = opp.signalBadges.slice(0, 2);
  const overflow      = opp.signalBadges.length - visibleBadges.length;
  const ctaLabel      = contact.isUrlOnly ? "View Source" : "Open Listing";
  const hasPriceMov   =
    opp.oldPrice !== null || opp.newPrice !== null ||
    opp.dropAmount !== null || opp.dropPct !== null;

  const insightBarColor =
    insight.tone === "am" ? C.am :
    insight.tone === "em" ? C.emHi : C.t4;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border transition-colors duration-150"
      style={{
        background:  C.cardBg,
        borderColor: C.border,
        boxShadow:   "0 2px 8px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Hover tint */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ background: "rgba(255,255,255,0.015)" }}
      />

      <div className="grid gap-0 lg:grid-cols-[1fr_230px]">
        {/* ── Left ───────────────────────────────────────────────── */}
        <div className="relative z-10 p-4 sm:p-5">
          {/* Micro-row: rank, score, drop, badges */}
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            {opp.rank != null && (
              <span
                className="rounded-md px-2 py-[2px] text-[10px] font-medium tabular-nums"
                style={{ color: C.t4, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderFt}` }}
              >
                #{opp.rank}
              </span>
            )}
            {opp.score != null && (
              <span
                className="rounded-md px-2 py-[2px] text-[10px] font-medium tabular-nums"
                style={{ color: C.t3, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderFt}` }}
              >
                {opp.score}
              </span>
            )}
            {dropPct && (
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-[2px] text-[10px] font-semibold"
                style={{ color: C.rd, background: C.rdBg, border: `1px solid ${C.rdBdr}` }}
              >
                <TrendingDown className="h-2.5 w-2.5" />
                {dropPct}
              </span>
            )}
            {visibleBadges.map((b) => (
              <SignalBadge key={b.label} badge={b} />
            ))}
            {overflow > 0 && (
              <span className="text-[10px]" style={{ color: C.t4 }}>
                +{overflow}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="line-clamp-1 text-[15px] font-semibold"
            style={{ color: C.t1, letterSpacing: "-0.02em" }}
          >
            {title}
          </h3>

          {/* Spec row: location · type · beds · size · portal */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {opp.locationLabel && (
              <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: C.t3 }}>
                <MapPinned className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
                {opp.locationLabel}
              </span>
            )}
            {opp.propertyType && (
              <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: C.t3 }}>
                <Building2 className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
                {opp.propertyType}
              </span>
            )}
            {opp.bedrooms != null && (
              <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: C.t3 }}>
                <Bed className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
                {opp.bedrooms} Beds
              </span>
            )}
            {sizeDisplay && (
              <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: C.t3 }}>
                <Maximize className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
                {sizeDisplay}
              </span>
            )}
            {opp.portal && (
              <span className="text-[11px]" style={{ color: C.t4 }}>
                {labelize(opp.portal)}
              </span>
            )}
          </div>

          {/* Agent identity block — prominent */}
          <div className="mt-3">
            <AgentBlock opp={opp} variant="list" />
          </div>

          {/* Insight line — compact, left-bordered */}
          <div
            className="mt-3 border-l-2 pl-2.5"
            style={{ borderLeftColor: insightBarColor }}
          >
            <p className="text-[11px] leading-[1.5]" style={{ color: C.t3 }}>
              {insight.text}
            </p>
          </div>
        </div>

        {/* ── Right: price + CTA ─────────────────────────────────── */}
        <aside
          className="relative z-10 flex flex-col justify-between gap-3 border-t p-4 lg:border-l lg:border-t-0"
          style={{ background: C.deepBg, borderColor: C.border }}
        >
          <div>
            <p
              className="text-[22px] font-bold tabular-nums leading-none"
              style={{ color: C.t1, letterSpacing: "-0.025em" }}
            >
              {formatCurrency(opp.price, opp.currency)}
            </p>
            {hasPriceMov && (
              <div className="mt-2.5">
                <PriceMovement opp={opp} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            {opp.listingUrl ? (
              <Link
                href={opp.listingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-85"
                style={{ background: C.em }}
              >
                {ctaLabel}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center rounded-xl py-2 text-[12px] font-medium"
                style={{ background: C.wellBg, color: C.t4, border: `1px solid ${C.border}` }}
              >
                Unavailable
              </button>
            )}

            <p className="text-center text-[10px]" style={{ color: C.t4 }}>
              {contact.label}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ReconOpportunityCard({
  opportunity,
  variant = "list",
}: {
  opportunity: NormalizedReconOpportunity;
  variant?: "featured" | "list";
}) {
  if (variant === "featured") return <FeaturedCard opp={opportunity} />;
  return <ListCard opp={opportunity} />;
}