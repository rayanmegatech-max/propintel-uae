// app/dashboard/_components/ReconOpportunityCard.tsx
import Link from "next/link";
import {
  ArrowUpRight,
  Bed,
  Building2,
  Droplets,
  ExternalLink,
  MapPinned,
  Maximize,
  Phone,
  TrendingDown,
} from "lucide-react";
import {
  formatCurrency,
  formatPercent,
  labelize,
} from "@/lib/recon/formatters";
import type {
  NormalizedReconOpportunity,
  ReconSignalBadge,
} from "@/lib/recon/types";

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  cardBg: "#111113",
  wellBg: "#18181b",
  deepBg: "#0d0d0f",
  surfaceBg: "#141416",
  border: "rgba(255,255,255,0.07)",
  borderFt: "rgba(255,255,255,0.04)",
  borderSub: "rgba(255,255,255,0.055)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  t4: "#52525b",
  t5: "#3f3f46",
  em: "#10b981",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.07)",
  emBdr: "rgba(16,185,129,0.2)",
  am: "#fbbf24",
  amBg: "rgba(245,158,11,0.06)",
  amBdr: "rgba(245,158,11,0.16)",
  rd: "#fb7185",
  rdBg: "rgba(244,63,94,0.06)",
  rdBdr: "rgba(244,63,94,0.16)",
  cyHi: "#22d3ee",
  cyBg: "rgba(34,211,238,0.06)",
  cyBdr: "rgba(34,211,238,0.16)",
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatSizeValue(val: number): string {
  const fixed = Number(val).toFixed(2);
  // Add thousands separators
  return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ─── Badge tone ─────────────────────────────────────────────────────────────
function badgeColors(label: string): {
  color: string;
  bg: string;
  border: string;
} {
  const l = label.toLowerCase();
  if (
    l.includes("drop") ||
    l.includes("price") ||
    l.includes("reduction") ||
    l.includes("movement")
  )
    return { color: C.rd, bg: C.rdBg, border: C.rdBdr };
  if (l.includes("owner") || l.includes("direct"))
    return { color: C.cyHi, bg: C.cyBg, border: C.cyBdr };
  if (l.includes("hot") || l.includes("multi"))
    return { color: C.emHi, bg: C.emBg, border: C.emBdr };
  if (
    l.includes("stale") ||
    l.includes("refresh") ||
    l.includes("aged") ||
    l.includes("inflat")
  )
    return { color: C.am, bg: C.amBg, border: C.amBdr };
  return { color: C.t4, bg: "rgba(255,255,255,0.03)", border: C.borderFt };
}

function SignalBadge({
  badge,
  size = "sm",
}: {
  badge: ReconSignalBadge;
  size?: "sm" | "md";
}) {
  const s = badgeColors(badge.label);
  const isMd = size === "md";
  return (
    <span
      className={`inline-flex items-center font-semibold uppercase leading-none ${
        isMd
          ? "rounded-md px-2 py-[3px] text-[10px] tracking-[0.04em]"
          : "rounded px-1.5 py-[2px] text-[10px] tracking-[0.04em]"
      }`}
      style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {badge.label}
    </span>
  );
}

// ─── Market context chips builder ───────────────────────────────────────────
function getMarketContextChips(opp: NormalizedReconOpportunity): string[] {
  const chips: Set<string> = new Set();
  const cat = opp.sourceCategory?.trim().toLowerCase();
  const pur = opp.purpose?.trim().toLowerCase();
  const rentMode = opp.rentalMode?.trim().toLowerCase();
  const freq = opp.priceFrequency?.trim().toLowerCase();

  const addPrimary = (value: string) => chips.add(value);

  if (cat) {
    if (cat === "short_rental" || cat.includes("short")) {
      addPrimary("Short Rental");
    } else if (cat === "land_buy") {
      addPrimary("Land Buy");
    } else if (pur) {
      const catLabel = labelize(cat);
      const purLabel = labelize(pur);
      if (cat.includes(pur)) {
        addPrimary(catLabel);
      } else {
        addPrimary(`${catLabel} ${purLabel}`);
      }
    } else {
      addPrimary(labelize(cat));
    }
  } else if (pur) {
    addPrimary(labelize(pur));
  }

  const primaryLower = [...chips][0]?.toLowerCase() ?? "";

  if (cat !== "short_rental" && !cat?.includes("short")) {
    if (rentMode && !primaryLower.includes(rentMode)) {
      chips.add(labelize(rentMode));
    }
    if (freq && !primaryLower.includes(freq) && !rentMode) {
      chips.add(labelize(freq));
    }
  }

  return [...chips];
}

// ─── Title builder ──────────────────────────────────────────────────────────
function buildTitle(opp: NormalizedReconOpportunity): string {
  const beds = opp.bedrooms != null ? `${opp.bedrooms} Bed ` : "";
  const type = opp.propertyType ?? null;
  const loc = opp.locationLabel ?? null;
  if (type && loc) return `${beds}${type} — ${loc}`;
  if (type) return `${beds}${type}`;
  if (loc) return `Listing Opportunity — ${loc}`;
  return "Listing Opportunity";
}

// ─── Size display ───────────────────────────────────────────────────────────
function buildSizeDisplay(opp: NormalizedReconOpportunity): string | null {
  if (opp.sizeValue == null) return null;
  const unit = opp.currency === "SAR" ? "sqm" : "sqft";
  if (opp.sizeLabel && !/size$/i.test(opp.sizeLabel.trim())) {
    return opp.sizeLabel;
  }
  return `${formatSizeValue(opp.sizeValue)} ${unit}`;
}

// ─── Insight line ───────────────────────────────────────────────────────────
type InsightResult = { text: string; tone: "am" | "em" | "neutral" };

function buildInsight(opp: NormalizedReconOpportunity): InsightResult {
  const dropPct = opp.dropPct;
  if (dropPct != null && dropPct > 0)
    return {
      text: `Price moved ${formatPercent(dropPct)} below previous ask — verify current listing.`,
      tone: "am",
    };
  if (opp.priorityLabel?.toLowerCase().includes("owner"))
    return {
      text: "Owner/direct-style signal — contact path available.",
      tone: "em",
    };
  if (opp.score != null && opp.score >= 90)
    return {
      text: "Top-scoring opportunity in this lane. Review now.",
      tone: "em",
    };
  if (opp.signalBadges.some((b) => b.label?.toLowerCase().includes("multi")))
    return {
      text: "Multiple public listing signals detected on this property.",
      tone: "em",
    };
  const isUrlOnly = !opp.hasPhone && !opp.hasWhatsapp && !opp.hasEmail;
  if (isUrlOnly)
    return {
      text: "Source-only lead — open source to verify details before outreach.",
      tone: "neutral",
    };
  return {
    text: "Public listing activity changed — verify current listing.",
    tone: "neutral",
  };
}

// ─── Contact info ───────────────────────────────────────────────────────────
function contactInfo(opp: NormalizedReconOpportunity): {
  label: string;
  isUrlOnly: boolean;
} {
  if (opp.hasPhone) return { label: "Phone signal", isUrlOnly: false };
  if (opp.hasWhatsapp) return { label: "WhatsApp signal", isUrlOnly: false };
  if (opp.hasEmail) return { label: "Email signal", isUrlOnly: false };
  return { label: "Source-only lead", isUrlOnly: true };
}

// ─── Right side fallback when no price movement ─────────────────────────────
function RightSideContext({
  opp,
}: {
  opp: NormalizedReconOpportunity;
}) {
  const isContactable = opp.hasPhone || opp.hasWhatsapp || opp.hasEmail;
  return (
    <div
      className="rounded-lg border px-2.5 py-2 text-[10px] leading-tight"
      style={{
        background: C.wellBg,
        borderColor: C.borderSub,
        color: C.t3,
      }}
    >
      <p className="font-medium" style={{ color: C.t2 }}>
        {isContactable ? "Contact path" : "Source-led signal"}
      </p>
      <p className="mt-0.5">
        {isContactable
          ? "Phone/WhatsApp/Email signal available"
          : "Open source to verify details before outreach"}
      </p>
    </div>
  );
}

// ─── Spec row ───────────────────────────────────────────────────────────────
function SpecRow({
  opp,
  size = "sm",
}: {
  opp: NormalizedReconOpportunity;
  size?: "sm" | "md";
}) {
  const sizeDisplay = buildSizeDisplay(opp);
  const specs: Array<{ icon: typeof MapPinned; text: string }> = [];

  if (opp.locationLabel)
    specs.push({ icon: MapPinned, text: opp.locationLabel });
  if (opp.propertyType)
    specs.push({ icon: Building2, text: opp.propertyType });
  if (opp.bedrooms != null)
    specs.push({ icon: Bed, text: `${opp.bedrooms} Beds` });
  if (opp.bathrooms != null)
    specs.push({ icon: Droplets, text: `${opp.bathrooms} Baths` });
  if (sizeDisplay) specs.push({ icon: Maximize, text: sizeDisplay });

  if (specs.length === 0 && !opp.portal) return null;

  const isMd = size === "md";
  const textCls = isMd ? "text-[12px]" : "text-[11px]";
  const iconCls = isMd ? "h-3.5 w-3.5" : "h-3 w-3";
  const gapCls = isMd ? "gap-x-4 gap-y-1.5" : "gap-x-3 gap-y-1";

  return (
    <div className={`flex flex-wrap items-center ${gapCls}`}>
      {specs.map(({ icon: Icon, text }) => (
        <span
          key={text}
          className={`inline-flex items-center gap-1 ${textCls}`}
          style={{ color: C.t3 }}
        >
          <Icon className={`${iconCls} shrink-0`} style={{ color: C.t4 }} />
          {text}
        </span>
      ))}
      {opp.portal && (
        <span
          className={`inline-flex items-center rounded border px-1.5 py-px text-[10px] leading-none ${textCls}`}
          style={{
            color: C.t2,
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          {labelize(opp.portal)}
        </span>
      )}
    </div>
  );
}

// ─── Agent block ────────────────────────────────────────────────────────────
function AgentBlock({
  opp,
  variant,
}: {
  opp: NormalizedReconOpportunity;
  variant: "featured" | "list";
}) {
  const name = opp.agentName ?? null;
  const agency = opp.agencyName ?? null;
  if (!name && !agency) return null;

  const primary = name ?? agency!;
  const secondary = name && agency ? agency : null;
  const initial = primary.charAt(0).toUpperCase();
  const isFeatured = variant === "featured";

  const avatarSize = isFeatured ? 32 : 28;
  const avatarFontSize = isFeatured ? 12 : 11;
  const nameSize = isFeatured ? 13 : 12;
  const agencySize = isFeatured ? 11 : 10;

  return (
    <div
      className="flex items-center gap-2.5 rounded-lg border"
      style={{
        background: isFeatured ? C.surfaceBg : C.wellBg,
        borderColor: C.borderSub,
        padding: isFeatured ? "10px 12px" : "8px 10px",
      }}
    >
      {/* Avatar */}
      <div
        className="flex shrink-0 items-center justify-center rounded-full font-bold"
        style={{
          width: avatarSize,
          height: avatarSize,
          fontSize: avatarFontSize,
          background: "linear-gradient(145deg, #27272a, #1c1c1f)",
          color: C.emHi,
          border: `1px solid ${C.border}`,
        }}
      >
        {initial}
      </div>

      {/* Name + agency */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate font-semibold leading-tight"
          style={{ fontSize: nameSize, color: C.t1 }}
        >
          {primary}
        </p>
        {secondary && (
          <p
            className="mt-0.5 truncate leading-tight"
            style={{ fontSize: agencySize, color: C.t4 }}
          >
            {secondary}
          </p>
        )}
      </div>

      {/* Contact signal chips */}
      <div className="flex shrink-0 items-center gap-1">
        {opp.hasPhone && (
          <span
            className="flex h-5 w-5 items-center justify-center rounded"
            style={{ background: "rgba(255,255,255,0.04)" }}
            title="Phone signal"
          >
            <Phone className="h-2.5 w-2.5" style={{ color: C.t4 }} />
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Price movement ─────────────────────────────────────────────────────────
function PriceMovement({ opp }: { opp: NormalizedReconOpportunity }) {
  const has =
    opp.oldPrice !== null ||
    opp.newPrice !== null ||
    opp.dropAmount !== null ||
    opp.dropPct !== null;
  if (!has) return null;

  return (
    <div
      className="space-y-1 rounded-lg border p-2.5"
      style={{ background: C.wellBg, borderColor: C.borderFt }}
    >
      {opp.oldPrice !== null && (
        <div className="flex items-center justify-between text-[11px]">
          <span style={{ color: C.t5 }}>Was</span>
          <span className="tabular-nums line-through" style={{ color: C.t5 }}>
            {formatCurrency(opp.oldPrice, opp.currency)}
          </span>
        </div>
      )}
      {opp.newPrice !== null && (
        <div className="flex items-center justify-between text-[11px]">
          <span style={{ color: C.t5 }}>Now</span>
          <span className="font-semibold tabular-nums" style={{ color: C.t1 }}>
            {formatCurrency(opp.newPrice, opp.currency)}
          </span>
        </div>
      )}
      {opp.dropAmount !== null && (
        <div
          className="flex items-center justify-between border-t pt-1 text-[11px]"
          style={{ borderColor: C.borderFt }}
        >
          <span style={{ color: C.t5 }}>Drop</span>
          <span className="font-semibold tabular-nums" style={{ color: C.am }}>
            {formatCurrency(opp.dropAmount, opp.currency)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── CTA block ──────────────────────────────────────────────────────────────
function CtaBlock({
  opp,
  contact,
  compact,
}: {
  opp: NormalizedReconOpportunity;
  contact: { label: string; isUrlOnly: boolean };
  compact?: boolean;
}) {
  const ctaLabel = contact.isUrlOnly ? "View Source" : "Open Listing";
  const pyClass = compact ? "py-[7px]" : "py-2.5";
  const textCls = compact ? "text-[11px]" : "text-[12px]";

  return (
    <div className="space-y-1.5">
      {opp.listingUrl ? (
        <Link
          href={opp.listingUrl}
          target="_blank"
          rel="noreferrer"
          className={`flex w-full items-center justify-center gap-1.5 rounded-lg ${pyClass} ${textCls} font-semibold text-white transition-opacity hover:opacity-85`}
          style={{
            background: C.em,
            boxShadow: compact
              ? "none"
              : "0 2px 12px rgba(16,185,129,0.22)",
          }}
        >
          {ctaLabel}
          <ExternalLink className="h-3 w-3" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className={`flex w-full cursor-not-allowed items-center justify-center rounded-lg ${pyClass} ${textCls} font-medium`}
          style={{
            background: C.wellBg,
            color: C.t5,
            border: `1px solid ${C.border}`,
          }}
        >
          Unavailable
        </button>
      )}

      {/* Contact + source row */}
      <div
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
        style={{ background: C.wellBg, border: `1px solid ${C.borderFt}` }}
      >
        <Phone className="h-2.5 w-2.5 shrink-0" style={{ color: C.t5 }} />
        <span className="flex-1 text-[10px]" style={{ color: C.t4 }}>
          {contact.label}
        </span>
        {opp.listingUrl && (
          <Link
            href={opp.listingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 text-[10px] font-medium transition-opacity hover:opacity-75"
            style={{ color: C.emHi }}
          >
            Source
            <ArrowUpRight className="h-2.5 w-2.5" />
          </Link>
        )}
      </div>

      {contact.isUrlOnly && (
        <p className="text-center text-[9px]" style={{ color: C.t5 }}>
          Verify details from source before outreach
        </p>
      )}
    </div>
  );
}

// ─── Signal header row ──────────────────────────────────────────────────────
function SignalHeaderRow({
  opp,
  variant,
}: {
  opp: NormalizedReconOpportunity;
  variant: "featured" | "list";
}) {
  const dropPct = formatPercent(opp.dropPct);
  const isFeatured = variant === "featured";
  const maxBadges = isFeatured ? 3 : 2;
  const visibleBadges = opp.signalBadges.slice(0, maxBadges);
  const overflow = opp.signalBadges.length - visibleBadges.length;
  const badgeSize = isFeatured ? "md" : "sm";

  const chipPad = isFeatured
    ? "px-2 py-[3px] text-[10px]"
    : "px-1.5 py-[2px] text-[10px]";
  const chipRound = isFeatured ? "rounded-md" : "rounded";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Rank */}
      {opp.rank != null && (
        <span
          className={`${chipRound} ${chipPad} font-bold uppercase tabular-nums tracking-[0.06em]`}
          style={{
            color: isFeatured ? C.emHi : C.t3,
            background: isFeatured ? C.emBg : "rgba(255,255,255,0.035)",
            border: `1px solid ${isFeatured ? C.emBdr : C.borderFt}`,
          }}
        >
          {isFeatured ? `Rank #${opp.rank}` : `#${opp.rank}`}
        </span>
      )}

      {/* Score */}
      {opp.score != null && (
        <span
          className={`${chipRound} ${chipPad} font-semibold tabular-nums`}
          style={{
            color: C.t3,
            background: "rgba(255,255,255,0.035)",
            border: `1px solid ${C.borderFt}`,
          }}
        >
          {isFeatured ? `Score ${opp.score}` : opp.score}
        </span>
      )}

      {/* Drop % */}
      {dropPct && (
        <span
          className={`inline-flex items-center gap-1 ${chipRound} ${chipPad} font-semibold`}
          style={{
            color: C.rd,
            background: C.rdBg,
            border: `1px solid ${C.rdBdr}`,
          }}
        >
          <TrendingDown className="h-2.5 w-2.5" />
          {dropPct}
        </span>
      )}

      {/* Priority label — featured only */}
      {isFeatured && opp.priorityLabel && (
        <span
          className="rounded-md px-2 py-[3px] text-[10px] font-semibold"
          style={{
            color: C.t2,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.borderFt}`,
          }}
        >
          {labelize(opp.priorityLabel)}
        </span>
      )}

      {/* Signal badges */}
      {visibleBadges.map((b) => (
        <SignalBadge key={b.label} badge={b} size={badgeSize} />
      ))}
      {overflow > 0 && (
        <span className="text-[10px] font-medium" style={{ color: C.t5 }}>
          +{overflow}
        </span>
      )}
    </div>
  );
}

// ─── Market context chips ───────────────────────────────────────────────────
function MarketContextRow({ opp }: { opp: NormalizedReconOpportunity }) {
  const chips = getMarketContextChips(opp);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip}
          className="inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium leading-none"
          style={{
            color: C.t2,
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURED card — lead brief layout
// ═══════════════════════════════════════════════════════════════════════════
function FeaturedCard({ opp }: { opp: NormalizedReconOpportunity }) {
  const contact = contactInfo(opp);
  const title = buildTitle(opp);
  const insight = buildInsight(opp);
  const hasPriceMov =
    opp.oldPrice !== null ||
    opp.newPrice !== null ||
    opp.dropAmount !== null ||
    opp.dropPct !== null;

  const insightBarColor =
    insight.tone === "am" ? C.am : insight.tone === "em" ? C.emHi : C.t5;
  const insightBg =
    insight.tone === "am"
      ? C.amBg
      : insight.tone === "em"
        ? C.emBg
        : "rgba(255,255,255,0.02)";
  const insightTextColor =
    insight.tone === "am" ? C.am : insight.tone === "em" ? C.emHi : C.t3;

  return (
    <article
      className="relative overflow-hidden rounded-xl border"
      style={{
        background:
          "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #0d0d0f 30%)",
        borderColor: "rgba(16,185,129,0.2)",
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.06), 0 8px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Top hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(52,211,153,0.3) 50%, transparent 90%)",
        }}
      />

      <div className="grid gap-0 lg:grid-cols-[1fr_250px]">
        {/* ── Left: lead brief ──────────────────────────────────── */}
        <div className="space-y-3 p-5 sm:p-6">
          {/* 1. Signal header: rank / score / badges */}
          <SignalHeaderRow opp={opp} variant="featured" />

          {/* 2. Market context chips (deal type) */}
          <MarketContextRow opp={opp} />

          {/* 3. Title — opportunity identity */}
          <h2
            className="line-clamp-2 text-[19px] font-bold leading-snug sm:text-[21px]"
            style={{ color: C.t1, letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>

          {/* 4. Location / spec / source */}
          <div
            className="border-b border-t py-2.5"
            style={{ borderColor: C.borderFt }}
          >
            <SpecRow opp={opp} size="md" />
          </div>

          {/* 5. Agent / agency / contact */}
          <AgentBlock opp={opp} variant="featured" />

          {/* 6. Insight / reason — why this matters */}
          <div
            className="rounded-lg border-l-[3px] px-3.5 py-2.5 text-[11px] font-medium leading-relaxed"
            style={{
              borderLeftColor: insightBarColor,
              background: insightBg,
              color: insightTextColor,
            }}
          >
            {insight.text}
          </div>
        </div>

        {/* ── Right: price + action column ──────────────────────── */}
        <aside
          className="flex flex-col justify-between gap-4 border-t p-5 lg:border-l lg:border-t-0"
          style={{ background: C.deepBg, borderColor: C.border }}
        >
          <div>
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: C.t5 }}
            >
              {opp.priceLabel ?? "Advertised price"}
            </p>
            <p
              className="mt-1.5 text-[26px] font-bold tabular-nums leading-none sm:text-[28px]"
              style={{ color: C.t1, letterSpacing: "-0.03em" }}
            >
              {formatCurrency(opp.price, opp.currency)}
            </p>
            {hasPriceMov && (
              <div className="mt-3">
                <PriceMovement opp={opp} />
              </div>
            )}
            {!hasPriceMov && (
              <div className="mt-3">
                <RightSideContext opp={opp} />
              </div>
            )}
          </div>

          <CtaBlock opp={opp} contact={contact} />
        </aside>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LIST card — compact but clear hierarchy
// ═══════════════════════════════════════════════════════════════════════════
function ListCard({ opp }: { opp: NormalizedReconOpportunity }) {
  const contact = contactInfo(opp);
  const title = buildTitle(opp);
  const insight = buildInsight(opp);
  const hasPriceMov =
    opp.oldPrice !== null ||
    opp.newPrice !== null ||
    opp.dropAmount !== null ||
    opp.dropPct !== null;

  const insightBarColor =
    insight.tone === "am" ? C.am : insight.tone === "em" ? C.emHi : C.t5;

  return (
    <article
      className="group relative overflow-hidden rounded-xl border transition-colors duration-150"
      style={{
        background: C.cardBg,
        borderColor: C.border,
        boxShadow:
          "0 1px 4px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Hover tint */}
      <span
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ background: "rgba(255,255,255,0.015)" }}
      />

      <div className="grid gap-0 lg:grid-cols-[1fr_220px]">
        {/* ── Left ──────────────────────────────────────────────── */}
        <div className="relative z-10 space-y-2 p-4 sm:p-[18px]">
          {/* 1. Signal header: rank / score / badges */}
          <SignalHeaderRow opp={opp} variant="list" />

          {/* 2. Market context chips (deal type) */}
          <MarketContextRow opp={opp} />

          {/* 3. Title */}
          <h3
            className="line-clamp-1 text-[14px] font-semibold sm:text-[15px]"
            style={{ color: C.t1, letterSpacing: "-0.015em" }}
          >
            {title}
          </h3>

          {/* 4. Spec row */}
          <SpecRow opp={opp} size="sm" />

          {/* 5. Agent block */}
          <AgentBlock opp={opp} variant="list" />

          {/* 6. Insight — compact left-border */}
          <div
            className="border-l-2 pl-2.5"
            style={{ borderLeftColor: insightBarColor }}
          >
            <p className="text-[11px] leading-relaxed" style={{ color: C.t4 }}>
              {insight.text}
            </p>
          </div>
        </div>

        {/* ── Right: price + CTA ────────────────────────────────── */}
        <aside
          className="relative z-10 flex flex-col justify-between gap-3 border-t p-4 lg:border-l lg:border-t-0"
          style={{ background: C.deepBg, borderColor: C.border }}
        >
          <div>
            <p
              className="text-[20px] font-bold tabular-nums leading-none sm:text-[22px]"
              style={{ color: C.t1, letterSpacing: "-0.025em" }}
            >
              {formatCurrency(opp.price, opp.currency)}
            </p>
            {hasPriceMov && (
              <div className="mt-2">
                <PriceMovement opp={opp} />
              </div>
            )}
            {!hasPriceMov && (
              <div className="mt-2">
                <RightSideContext opp={opp} />
              </div>
            )}
          </div>

          <CtaBlock opp={opp} contact={contact} compact />
        </aside>
      </div>
    </article>
  );
}

// ─── Export ─────────────────────────────────────────────────────────────────
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