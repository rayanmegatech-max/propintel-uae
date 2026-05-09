// app/dashboard/_components/ReconOpportunityCard.tsx
import Link from "next/link";
import type { ElementType } from "react";
import {
  ArrowUpRight,
  Bed,
  Building2,
  Bath,
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
  surfaceBg: "rgba(24, 24, 27, 0.4)",
  wellBg: "rgba(255,255,255,0.02)",
  deepBg: "rgba(0,0,0,0.2)",
  border: "rgba(255,255,255,0.06)",
  borderSub: "rgba(255,255,255,0.04)",
  t1: "#ffffff",
  t2: "#e4e4e7",
  t3: "#a1a1aa",
  t4: "#71717a",
  em: "#10b981",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.12)",
  emBdr: "rgba(16,185,129,0.25)",
  am: "#fbbf24",
  amBg: "rgba(245,158,11,0.1)",
  amBdr: "rgba(245,158,11,0.2)",
  rd: "#fb7185",
  rdBg: "rgba(244,63,94,0.1)",
  rdBdr: "rgba(244,63,94,0.2)",
  cyHi: "#22d3ee",
  cyBg: "rgba(34,211,238,0.1)",
  cyBdr: "rgba(34,211,238,0.2)",
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatSizeValue(val: number): string {
  const fixed = Number(val).toFixed(2);
  return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ─── Badge tone ─────────────────────────────────────────────────────────────
function badgeColors(label: string): { color: string; bg: string; border: string; } {
  const l = label.toLowerCase();
  if (l.includes("drop") || l.includes("price") || l.includes("reduction") || l.includes("movement"))
    return { color: C.rd, bg: C.rdBg, border: C.rdBdr };
  if (l.includes("owner") || l.includes("direct"))
    return { color: C.cyHi, bg: C.cyBg, border: C.cyBdr };
  if (l.includes("hot") || l.includes("multi"))
    return { color: C.emHi, bg: C.emBg, border: C.emBdr };
  if (l.includes("stale") || l.includes("refresh") || l.includes("aged") || l.includes("inflat"))
    return { color: C.am, bg: C.amBg, border: C.amBdr };
  return { color: C.t2, bg: "rgba(255,255,255,0.05)", border: C.borderSub };
}

function SignalBadge({ badge, size = "sm" }: { badge: ReconSignalBadge; size?: "sm" | "md"; }) {
  const s = badgeColors(badge.label);
  const isMd = size === "md";
  
  let displayLabel = badge.label;
  if (displayLabel.toLowerCase() === "stale") displayLabel = "Aged Listing";
  if (displayLabel.toLowerCase().includes("inflat")) displayLabel = "Refresh Signal";

  return (
    <span
      className={`inline-flex items-center font-extrabold uppercase tracking-wider ${
        isMd ? "rounded-md px-2 py-1 text-[10px]" : "rounded px-1.5 py-[3px] text-[9px]"
      }`}
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {displayLabel}
    </span>
  );
}

// ─── Market context chips builder ───────────────────────────────────────────
function getMarketContextChips(opp: NormalizedReconOpportunity): string[] {
  const chips: Set<string> = new Set();
  const cat = opp.sourceCategory?.trim().toLowerCase() || "";
  const pur = opp.purpose?.trim().toLowerCase() || "";
  const rentMode = opp.rentalMode?.trim().toLowerCase();
  const freq = opp.priceFrequency?.trim().toLowerCase();

  // Smart resolution to prevent "Residential Commercial"
  let mainType = "";
  if (cat.includes("short") || cat === "short_rental") mainType = "Short Rental";
  else if (cat.includes("land") || pur.includes("land")) mainType = "Land";
  else if (cat.includes("commercial") || pur.includes("commercial")) mainType = "Commercial";
  else if (cat.includes("residential") || pur.includes("residential")) mainType = "Residential";
  else if (cat) mainType = labelize(cat);

  let mainAction = "";
  if (pur.includes("rent")) mainAction = "Rent";
  else if (pur.includes("buy") || pur.includes("sale")) mainAction = "Buy";

  if (mainType && mainAction) chips.add(`${mainType} ${mainAction}`);
  else if (mainType) chips.add(mainType);
  else if (mainAction) chips.add(mainAction);

  const primaryLower = [...chips][0]?.toLowerCase() ?? "";

  if (mainType !== "Short Rental") {
    if (rentMode && !primaryLower.includes(rentMode)) chips.add(labelize(rentMode));
    if (freq && !primaryLower.includes(freq) && !rentMode) chips.add(labelize(freq));
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
  if (opp.sizeLabel && !/size$/i.test(opp.sizeLabel.trim())) return opp.sizeLabel;
  return `${formatSizeValue(opp.sizeValue)} ${unit}`;
}

// ─── Insight line ───────────────────────────────────────────────────────────
type InsightResult = { text: string; tone: "am" | "em" | "neutral" | "rd" };

function buildInsight(opp: NormalizedReconOpportunity): InsightResult {
  const dropPct = opp.dropPct;
  if (dropPct != null && dropPct > 0)
    return {
      text: `Price moved ${formatPercent(dropPct)} below previous ask. Verify current listing.`,
      tone: "rd",
    };
  if (opp.priorityLabel?.toLowerCase().includes("owner"))
    return {
      text: "Owner/direct-style signal detected. Contact path available.",
      tone: "em",
    };
  if (opp.score != null && opp.score >= 90)
    return {
      text: "Top-scoring opportunity. High probability signal match.",
      tone: "em",
    };
  if (opp.signalBadges.some((b) => b.label?.toLowerCase().includes("multi")))
    return {
      text: "Multiple overlapping public signals detected on this property.",
      tone: "em",
    };
  const isUrlOnly = !opp.hasPhone && !opp.hasWhatsapp && !opp.hasEmail;
  if (isUrlOnly)
    return {
      text: "Source verification required. Review public link for contact options.",
      tone: "neutral",
    };
  return {
    text: "Public listing activity changed. Review current listing.",
    tone: "neutral",
  };
}

// ─── Contact info ───────────────────────────────────────────────────────────
function contactInfo(opp: NormalizedReconOpportunity): { label: string; isUrlOnly: boolean; } {
  if (opp.hasPhone) return { label: "Phone signal available", isUrlOnly: false };
  if (opp.hasWhatsapp) return { label: "WhatsApp signal available", isUrlOnly: false };
  if (opp.hasEmail) return { label: "Email signal available", isUrlOnly: false };
  return { label: "Source verification", isUrlOnly: true };
}

// ─── Right side fallback when no price movement ─────────────────────────────
function RightSideContext({ opp }: { opp: NormalizedReconOpportunity; }) {
  const isContactable = opp.hasPhone || opp.hasWhatsapp || opp.hasEmail;
  return (
    <div
      className="rounded-lg border px-3 py-2.5 text-[11px] leading-relaxed shadow-inner"
      style={{ background: "rgba(0,0,0,0.2)", borderColor: C.borderSub, color: C.t3 }}
    >
      <p className="font-bold text-white mb-1 flex items-center gap-1.5">
        {isContactable ? <Phone className="h-3 w-3 text-emerald-400" /> : <ExternalLink className="h-3 w-3 text-zinc-400" />}
        {isContactable ? "Contact path ready" : "Source verification"}
      </p>
      <p className="text-[10.5px] leading-snug opacity-90">
        {isContactable
          ? "Phone/WhatsApp signals found."
          : "Open source link to verify details."}
      </p>
    </div>
  );
}

function SpecItem({
  icon: Icon,
  val,
  label,
  iconClassName,
}: {
  icon: ElementType;
  val?: string | number | null;
  label?: string;
  iconClassName: string;
}) {
  if (!val && !label) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] whitespace-nowrap" style={{ color: C.t3 }}>
      <Icon className={`${iconClassName} shrink-0 opacity-70`} style={{ color: C.t4 }} />
      {val && <span className="font-bold" style={{ color: C.t1 }}>{val}</span>}
      {label && <span className="font-medium">{label}</span>}
    </span>
  );
}

// ─── Spec row ───────────────────────────────────────────────────────────────
function SpecRow({ opp, size = "sm" }: { opp: NormalizedReconOpportunity; size?: "sm" | "md"; }) {
  const sizeDisplay = buildSizeDisplay(opp);
  const isMd = size === "md";
  const iconCls = isMd ? "h-[15px] w-[15px]" : "h-3.5 w-3.5";
  const gapCls = isMd ? "gap-x-5 gap-y-1.5" : "gap-x-4 gap-y-1.5";

  return (
    <div className={`flex flex-wrap items-center ${gapCls}`}>
      {opp.locationLabel && <SpecItem icon={MapPinned} label={opp.locationLabel} iconClassName={iconCls} />}
      {opp.propertyType && <SpecItem icon={Building2} label={opp.propertyType} iconClassName={iconCls} />}
      {opp.bedrooms != null && <SpecItem icon={Bed} val={opp.bedrooms} label="Beds" iconClassName={iconCls} />}
      {opp.bathrooms != null && <SpecItem icon={Bath} val={opp.bathrooms} label="Baths" iconClassName={iconCls} />}
      {sizeDisplay && <SpecItem icon={Maximize} label={sizeDisplay} iconClassName={iconCls} />}
      
      {opp.portal && (
        <span
          className="inline-flex items-center rounded border px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-widest leading-none shadow-sm ml-auto sm:ml-0"
          style={{
            color: C.t2,
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            borderColor: "rgba(255,255,255,0.15)",
          }}
        >
          {labelize(opp.portal)}
        </span>
      )}
    </div>
  );
}

// ─── Agent block ────────────────────────────────────────────────────────────
function AgentBlock({ opp, variant }: { opp: NormalizedReconOpportunity; variant: "featured" | "list"; }) {
  const name = opp.agentName ?? null;
  const agency = opp.agencyName ?? null;
  if (!name && !agency) return null;

  const primary = name ?? agency!;
  const secondary = name && agency ? agency : null;
  const initial = primary.charAt(0).toUpperCase();
  const isFeatured = variant === "featured";

  const avatarSize = isFeatured ? 30 : 26;
  const avatarFontSize = isFeatured ? 13 : 11;

  return (
    <div
      className="flex items-center gap-3 rounded-lg border shadow-sm w-fit max-w-full pr-4"
      style={{
        background: "rgba(0,0,0,0.2)",
        borderColor: C.borderSub,
        padding: isFeatured ? "8px 12px" : "6px 10px",
      }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-full font-bold shadow-inner"
        style={{
          width: avatarSize,
          height: avatarSize,
          fontSize: avatarFontSize,
          background: "linear-gradient(145deg, #10b981, #065f46)",
          color: "#fff",
          border: `1px solid rgba(255,255,255,0.1)`,
        }}
      >
        {initial}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold leading-tight" style={{ fontSize: isFeatured ? 13 : 12, color: C.t1 }}>
          {primary}
        </p>
        {secondary && (
          <p className="mt-0.5 truncate font-medium leading-tight" style={{ fontSize: isFeatured ? 11 : 10.5, color: C.t3 }}>
            {secondary}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center pl-2 border-l border-white/5 ml-1">
        {opp.hasPhone && (
          <Phone className="h-3.5 w-3.5" style={{ color: C.t3 }} />
        )}
      </div>
    </div>
  );
}

// ─── Price movement ─────────────────────────────────────────────────────────
function PriceMovement({ opp }: { opp: NormalizedReconOpportunity }) {
  const has = opp.oldPrice !== null || opp.newPrice !== null || opp.dropAmount !== null || opp.dropPct !== null;
  if (!has) return null;

  return (
    <div className="space-y-1.5 rounded-lg border p-3 shadow-inner" style={{ background: "rgba(0,0,0,0.2)", borderColor: C.borderSub }}>
      {opp.oldPrice !== null && (
        <div className="flex items-center justify-between text-[11px] font-medium">
          <span style={{ color: C.t4 }}>Previous</span>
          <span className="tabular-nums line-through opacity-50" style={{ color: C.t3 }}>
            {formatCurrency(opp.oldPrice, opp.currency)}
          </span>
        </div>
      )}
      {opp.newPrice !== null && (
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span style={{ color: C.t2 }}>Current</span>
          <span className="tabular-nums text-white">
            {formatCurrency(opp.newPrice, opp.currency)}
          </span>
        </div>
      )}
      {opp.dropAmount !== null && (
        <div className="flex items-center justify-between border-t pt-1.5 mt-1.5 text-[11.5px] font-bold" style={{ borderColor: C.borderSub }}>
          <span style={{ color: C.t2 }}>Movement</span>
          <span className="tabular-nums flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ color: C.rd, background: "rgba(244,63,94,0.1)" }}>
            <TrendingDown className="h-3 w-3" />
            {formatCurrency(opp.dropAmount, opp.currency)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── CTA block ──────────────────────────────────────────────────────────────
function CtaBlock({ opp, contact, compact }: { opp: NormalizedReconOpportunity; contact: { label: string; isUrlOnly: boolean }; compact?: boolean; }) {
  const ctaLabel = contact.isUrlOnly ? "View Source" : "Open Listing";
  const pyClass = compact ? "py-2" : "py-2.5";

  return (
    <div className="space-y-2 mt-auto">
      {opp.listingUrl ? (
        <Link
          href={opp.listingUrl}
          target="_blank"
          rel="noreferrer"
          className={`flex w-full items-center justify-center gap-1.5 rounded-lg ${pyClass} text-[13px] font-bold text-white transition-all hover:opacity-90 hover:-translate-y-px`}
          style={{ 
            background: "linear-gradient(180deg, #10b981 0%, #059669 100%)", 
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3), 0 2px 10px rgba(16,185,129,0.2)" 
          }}
        >
          {ctaLabel}
          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className={`flex w-full cursor-not-allowed items-center justify-center rounded-lg ${pyClass} text-[12px] font-bold`}
          style={{ background: "rgba(255,255,255,0.02)", color: C.t4, border: `1px solid ${C.borderSub}` }}
        >
          Link Unavailable
        </button>
      )}

      <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "rgba(0,0,0,0.2)", border: `1px solid ${C.borderSub}` }}>
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 shrink-0 opacity-70" style={{ color: C.t3 }} />
          <span className="text-[10px] font-bold" style={{ color: C.t2 }}>{contact.label}</span>
        </div>
        {opp.listingUrl && (
          <Link
            href={opp.listingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide transition-opacity hover:opacity-80"
            style={{ color: C.emHi }}
          >
            Source
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Signal header row ──────────────────────────────────────────────────────
function SignalHeaderRow({ opp, variant }: { opp: NormalizedReconOpportunity; variant: "featured" | "list"; }) {
  const dropPct = formatPercent(opp.dropPct);
  const isFeatured = variant === "featured";
  const maxBadges = isFeatured ? 3 : 2;
  const visibleBadges = opp.signalBadges.slice(0, maxBadges);
  const overflow = opp.signalBadges.length - visibleBadges.length;
  const badgeSize = isFeatured ? "md" : "sm";

  let safePriorityLabel = opp.priorityLabel;
  if (safePriorityLabel?.toLowerCase() === "stale") safePriorityLabel = "Aged Listing";

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
      {opp.rank != null && (
        <span
          className={`rounded px-1.5 py-[3px] text-[9px] font-black uppercase tabular-nums tracking-widest`}
          style={{
            color: isFeatured ? C.t1 : C.t2,
            background: isFeatured ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${isFeatured ? "rgba(52,211,153,0.4)" : C.borderSub}`,
          }}
        >
          {isFeatured ? `Top Signal #${opp.rank}` : `#${opp.rank}`}
        </span>
      )}

      {opp.score != null && (
        <span
          className={`rounded px-1.5 py-[3px] text-[9px] font-bold tabular-nums`}
          style={{ color: C.t2, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderSub}` }}
        >
          {isFeatured ? `Confidence Score ${opp.score}` : `Score ${opp.score}`}
        </span>
      )}

      {dropPct && (
        <span
          className={`inline-flex items-center gap-1 rounded px-1.5 py-[3px] text-[9px] font-bold`}
          style={{ color: C.rd, background: C.rdBg, border: `1px solid ${C.rdBdr}` }}
        >
          <TrendingDown className="h-2.5 w-2.5" />
          {dropPct} Drop
        </span>
      )}

      {isFeatured && safePriorityLabel && (
        <span
          className="rounded px-1.5 py-[3px] text-[9px] font-bold uppercase tracking-wider"
          style={{ color: C.t2, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderSub}` }}
        >
          {labelize(safePriorityLabel)}
        </span>
      )}

      {visibleBadges.map((b) => <SignalBadge key={b.label} badge={b} size={badgeSize} />)}
      
      {overflow > 0 && (
        <span className="text-[10px] font-bold" style={{ color: C.t3 }}>
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
          className="inline-flex items-center rounded border px-1.5 py-[3px] text-[9px] font-bold uppercase tracking-wider leading-none shadow-sm"
          style={{ color: C.t2, background: "rgba(255,255,255,0.04)", borderColor: C.borderSub }}
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
  const hasPriceMov = opp.oldPrice !== null || opp.newPrice !== null || opp.dropAmount !== null || opp.dropPct !== null;

  const toneConfig = {
    am: { color: C.am, bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
    em: { color: C.emHi, bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    rd: { color: C.rd, bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.2)" },
    neutral: { color: C.t1, bg: "rgba(255,255,255,0.03)", border: C.borderSub }
  };
  const curTone = toneConfig[insight.tone] || toneConfig.neutral;

  return (
    <article
      className="relative overflow-hidden rounded-[20px] border shadow-xl"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.9) 100%)",
        borderColor: "rgba(52,211,153,0.3)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top glowing edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-70" style={{ background: C.emHi, boxShadow: `0 0 20px ${C.emHi}` }} />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
        <div className="relative z-10 flex flex-col p-5 sm:p-7">
          <SignalHeaderRow opp={opp} variant="featured" />
          
          <div className="my-1.5">
            <MarketContextRow opp={opp} />
          </div>
          
          <h2 className="text-[20px] font-extrabold leading-[1.25] sm:text-[24px] text-white tracking-tight mt-1 mb-3">
            {title}
          </h2>

          <div className="border-y py-3 my-1" style={{ borderColor: C.borderSub }}>
            <SpecRow opp={opp} size="md" />
          </div>

          <div className="mt-3">
            <AgentBlock opp={opp} variant="featured" />
          </div>

          {/* Insight Alert Box */}
          <div
            className="flex items-center gap-2.5 rounded-lg px-4 py-3 border shadow-inner mt-4"
            style={{ background: curTone.bg, borderColor: curTone.border }}
          >
            <div className="h-2 w-2 rounded-full shrink-0" style={{ background: curTone.color, boxShadow: `0 0 8px ${curTone.color}` }} />
            <p className="text-[13px] font-bold tracking-wide" style={{ color: curTone.color }}>
              {insight.text}
            </p>
          </div>
        </div>

        <aside
          className="relative z-10 flex flex-col gap-4 border-t p-5 sm:p-7 lg:border-l lg:border-t-0 shadow-inner"
          style={{ background: "rgba(0,0,0,0.3)", borderColor: C.borderSub }}
        >
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest mb-1.5" style={{ color: C.t3 }}>
              {opp.priceLabel ?? "Advertised price"}
            </p>
            <p className="text-[28px] font-black tabular-nums leading-none text-white mb-4 tracking-tight sm:text-[32px]">
              {formatCurrency(opp.price, opp.currency)}
            </p>
            {hasPriceMov ? <PriceMovement opp={opp} /> : <RightSideContext opp={opp} />}
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
  const hasPriceMov = opp.oldPrice !== null || opp.newPrice !== null || opp.dropAmount !== null || opp.dropPct !== null;

  const toneConfig = {
    am: { color: C.am, border: C.am },
    em: { color: C.emHi, border: C.emHi },
    rd: { color: C.rd, border: C.rd },
    neutral: { color: C.t2, border: C.t4 }
  };
  const curTone = toneConfig[insight.tone] || toneConfig.neutral;

  return (
    <article
      className="group relative overflow-hidden rounded-[16px] border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.015)",
        borderColor: C.borderSub,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-[16px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at top right, ${curTone.color}0A, transparent 60%)` }}
      />

      {/* Subtle top border highlight on hover */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-50 transition-all duration-300" 
        style={{ background: curTone.color, boxShadow: `0 0 10px ${curTone.color}` }} 
      />

      <div className="grid gap-0 lg:grid-cols-[1fr_220px]">
        <div className="relative z-10 flex flex-col p-4 sm:p-5">
          <SignalHeaderRow opp={opp} variant="list" />
          
          <div className="my-1.5">
            <MarketContextRow opp={opp} />
          </div>
          
          <h3 className="line-clamp-1 text-[16px] font-extrabold sm:text-[18px] text-white tracking-tight mb-2.5">
            {title}
          </h3>

          <div className="mb-3">
            <SpecRow opp={opp} size="sm" />
          </div>
          
          <AgentBlock opp={opp} variant="list" />

          {/* Insight Line */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-3.5 w-1 rounded-full" style={{ background: curTone.border }} />
            <p className="text-[11.5px] font-bold tracking-wide" style={{ color: curTone.color }}>
              {insight.text}
            </p>
          </div>
        </div>

        <aside
          className="relative z-10 flex flex-col justify-between gap-4 border-t p-4 sm:p-5 lg:border-l lg:border-t-0"
          style={{ background: "rgba(0,0,0,0.2)", borderColor: C.borderSub }}
        >
          <div>
            <p className="text-[22px] font-black tabular-nums leading-none text-white mb-3 tracking-tighter sm:text-[24px]">
              {formatCurrency(opp.price, opp.currency)}
            </p>
            {hasPriceMov ? <PriceMovement opp={opp} /> : <RightSideContext opp={opp} />}
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