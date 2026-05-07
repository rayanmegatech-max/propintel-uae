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
  UserRound,
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
  pageBg:  "#09090b",
  cardBg:  "#111113",
  wellBg:  "#18181b",
  deepBg:  "#0d0d0f",
  border:  "rgba(255,255,255,0.07)",
  borderFt:"rgba(255,255,255,0.04)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  // emerald — active / positive / CTA
  em:    "#10b981",
  emHi:  "#34d399",
  emBg:  "rgba(16,185,129,0.08)",
  emBdr: "rgba(16,185,129,0.2)",
  // amber — stale / watch / caution
  am:    "#fbbf24",
  amBg:  "rgba(245,158,11,0.08)",
  amBdr: "rgba(245,158,11,0.18)",
  // rose/red — price drop only
  rd:    "#fb7185",
  rdBg:  "rgba(244,63,94,0.08)",
  rdBdr: "rgba(244,63,94,0.18)",
} as const;

// ─── Badge tone — no cyan/violet ──────────────────────────────────────────────
function badgeStyle(label: string): { color: string; bg: string; border: string } {
  const l = label.toLowerCase();
  if (l.includes("drop") || l.includes("price") || l.includes("reduction"))
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

// ─── Insight line ─────────────────────────────────────────────────────────────
function buildInsight(opp: NormalizedReconOpportunity): string {
  const dropPct = opp.dropPct;
  if (dropPct != null && dropPct > 0)
    return `Price moved ${formatPercent(dropPct)} below previous ask — verify current listing.`;
  if (opp.priorityLabel?.toLowerCase().includes("owner"))
    return "Owner/direct-style signal — contact path available.";
  if (opp.score != null && opp.score >= 90)
    return "Top-scoring opportunity in this lane. Review now.";
  if (opp.signalBadges.some((b) => b.label?.toLowerCase().includes("multi")))
    return "Multiple public listing signals detected on this property.";
  const isUrlOnly = !opp.hasPhone && !opp.hasWhatsapp && !opp.hasEmail;
  if (isUrlOnly)
    return "Source-only lead — open the source to verify details before outreach.";
  return "Public listing activity changed — verify current listing.";
}

// ─── Contact info ─────────────────────────────────────────────────────────────
function contactInfo(opp: NormalizedReconOpportunity): { label: string; isUrlOnly: boolean } {
  if (opp.hasPhone)    return { label: "Phone signal",    isUrlOnly: false };
  if (opp.hasWhatsapp) return { label: "WhatsApp signal", isUrlOnly: false };
  if (opp.hasEmail)    return { label: "Email signal",    isUrlOnly: false };
  return { label: "Source-only lead", isUrlOnly: true };
}

// ─── Shared price movement block ──────────────────────────────────────────────
function PriceMovement({ opp }: { opp: NormalizedReconOpportunity }) {
  const has =
    opp.oldPrice !== null ||
    opp.newPrice !== null ||
    opp.dropAmount !== null ||
    opp.dropPct !== null;

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

// ─── Agent avatar line ────────────────────────────────────────────────────────
function AgentLine({ opp }: { opp: NormalizedReconOpportunity }) {
  const name   = opp.agentName  ?? null;
  const agency = opp.agencyName ?? null;
  if (!name && !agency) return null;
  const initial = (name ?? agency ?? "A").charAt(0).toUpperCase();
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ background: C.wellBg, color: C.t2, border: `1px solid ${C.border}` }}
      >
        {initial}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium" style={{ color: C.t2 }}>
          {name ?? agency}
        </p>
        {name && agency && (
          <p className="truncate text-[11px]" style={{ color: C.t4 }}>
            {agency}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── FEATURED card ────────────────────────────────────────────────────────────
function FeaturedCard({ opp }: { opp: NormalizedReconOpportunity }) {
  const dropPct     = formatPercent(opp.dropPct);
  const contact     = contactInfo(opp);
  const title       = buildTitle(opp);
  const insight     = buildInsight(opp);
  const visibleBadges = opp.signalBadges.slice(0, 3);
  const overflow    = opp.signalBadges.length - visibleBadges.length;
  const hasPriceMov =
    opp.oldPrice !== null || opp.newPrice !== null ||
    opp.dropAmount !== null || opp.dropPct !== null;
  const ctaLabel    = contact.isUrlOnly
    ? "View Source"
    : opp.hasPhone || opp.hasWhatsapp
    ? "Open Listing"
    : "Open Listing";

  return (
    <article
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background:  "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, #0d0d0f 40%)",
        borderColor: "rgba(16,185,129,0.22)",
        boxShadow:   "0 0 0 1px rgba(16,185,129,0.08), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Hairline top highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.3),transparent)" }}
      />

      <div className="grid gap-0 lg:grid-cols-[1fr_264px]">
        {/* ── Left: content ───────────────────────────────────────── */}
        <div className="p-5 sm:p-6">
          {/* Rank + score + drop */}
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
            {(opp.sizeLabel || opp.sizeValue) && (
              <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: C.t2 }}>
                <Maximize className="h-3.5 w-3.5 shrink-0" style={{ color: C.t4 }} />
                {opp.sizeLabel ?? `${formatNumber(opp.sizeValue!)} sqft`}
              </span>
            )}
            {opp.portal && (
              <span className="text-[12px]" style={{ color: C.t4 }}>
                {labelize(opp.portal)}
              </span>
            )}
          </div>

          {/* Agent */}
          <div className="mt-4">
            <AgentLine opp={opp} />
          </div>

          {/* Insight */}
          {insight && (
            <div
              className="mt-4 rounded-xl border-l-2 px-4 py-2.5 text-[12px] font-medium leading-[1.55]"
              style={{
                borderLeftColor: C.am,
                background:      C.amBg,
                color:           C.am,
              }}
            >
              {insight}
            </div>
          )}
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
            {/* Primary CTA */}
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

            {/* Contact row */}
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
  const visibleBadges = opp.signalBadges.slice(0, 2);
  const overflow      = opp.signalBadges.length - visibleBadges.length;
  const ctaLabel      = contact.isUrlOnly ? "View Source" : "Open Listing";
  const hasPriceMov =
    opp.oldPrice !== null || opp.newPrice !== null ||
    opp.dropAmount !== null || opp.dropPct !== null;

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
        style={{ background: "rgba(255,255,255,0.016)" }}
      />

      <div className="grid gap-0 lg:grid-cols-[1fr_220px]">
        {/* Left */}
        <div className="p-4 sm:p-5">
          {/* Rank + badges row */}
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            {opp.rank != null && (
              <span
                className="rounded-md px-2 py-[2px] text-[10px] font-medium tabular-nums"
                style={{ color: C.t4, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderFt}` }}
              >
                #{opp.rank}
              </span>
            )}
            {dropPct && (
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-[2px] text-[10px] font-semibold"
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
                +{overflow}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="line-clamp-1 text-[15px] font-semibold"
            style={{ color: C.t1, letterSpacing: "-0.018em" }}
          >
            {title}
          </h3>

          {/* Spec line */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {opp.locationLabel && (
              <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: C.t3 }}>
                <MapPinned className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
                {opp.locationLabel}
              </span>
            )}
            {opp.bedrooms != null && (
              <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: C.t3 }}>
                <Bed className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
                {opp.bedrooms} Beds
              </span>
            )}
            {(opp.sizeLabel || opp.sizeValue) && (
              <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: C.t3 }}>
                <Maximize className="h-3 w-3 shrink-0" style={{ color: C.t4 }} />
                {opp.sizeLabel ?? `${formatNumber(opp.sizeValue!)} sqft`}
              </span>
            )}
            {opp.portal && (
              <span className="text-[12px]" style={{ color: C.t4 }}>
                {labelize(opp.portal)}
              </span>
            )}
          </div>

          {/* Agent — compact */}
          {(opp.agentName ?? opp.agencyName) && (
            <p className="mt-2.5 truncate text-[12px]" style={{ color: C.t4 }}>
              <UserRound className="mb-[2px] mr-1 inline-block h-3 w-3" />
              {opp.agentName ?? opp.agencyName}
              {opp.agentName && opp.agencyName && (
                <span style={{ color: C.t4 }}> · {opp.agencyName}</span>
              )}
            </p>
          )}
        </div>

        {/* Right: price + CTA */}
        <aside
          className="flex flex-col justify-between gap-3 border-t p-4 lg:border-l lg:border-t-0"
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
              <div className="mt-2">
                <PriceMovement opp={opp} />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
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
