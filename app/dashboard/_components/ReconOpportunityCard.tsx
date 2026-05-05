import Link from "next/link";
import { ExternalLink, MapPinned, Phone } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent, labelize } from "@/lib/recon/formatters";
import type {
  NormalizedReconOpportunity,
  ReconSignalBadge,
} from "@/lib/recon/types";

const BADGE_TONE_CLASS_MAP: Record<
  NonNullable<ReconSignalBadge["tone"]>,
  string
> = {
  emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  red: "border-red-400/20 bg-red-400/10 text-red-300",
  slate: "border-white/[0.08] bg-slate-950/60 text-slate-300",
  teal: "border-teal-400/20 bg-teal-400/10 text-teal-200",
};

function SignalBadge({ badge }: { badge: ReconSignalBadge }) {
  const tone = badge.tone ?? "slate";
  const toneClasses = BADGE_TONE_CLASS_MAP[tone];

  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses,
      ].join(" ")}
    >
      {badge.label}
    </span>
  );
}

export default function ReconOpportunityCard({
  opportunity,
}: {
  opportunity: NormalizedReconOpportunity;
}) {
  const dropPct = formatPercent(opportunity.dropPct);

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-emerald-400/25 hover:bg-white/[0.06]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              #{opportunity.rank ?? "—"}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              {labelize(opportunity.priorityLabel)}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Score {opportunity.score ?? "—"}
            </span>

            {dropPct && (
              <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                Drop {dropPct}
              </span>
            )}
          </div>

          <h2 className="line-clamp-2 text-base font-semibold text-white">
            {opportunity.title}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
            {opportunity.subtitle}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              <MapPinned className="h-3.5 w-3.5 text-slate-500" />
              {opportunity.locationLabel}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {labelize(opportunity.sourceCategory)}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {labelize(opportunity.portal)}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              {opportunity.propertyType || "Property type unavailable"}
            </span>
          </div>

          {opportunity.signalBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.signalBadges.map((badge) => (
                <SignalBadge key={badge.label} badge={badge} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full rounded-2xl border border-white/[0.08] bg-slate-950/60 p-4 xl:w-72">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {opportunity.priceLabel}
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {formatCurrency(opportunity.price, opportunity.currency)}
          </p>

          {(opportunity.oldPrice ||
            opportunity.newPrice ||
            opportunity.dropAmount) && (
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              {opportunity.oldPrice ? (
                <p>
                  Old:{" "}
                  {formatCurrency(opportunity.oldPrice, opportunity.currency)}
                </p>
              ) : null}

              {opportunity.newPrice ? (
                <p>
                  New:{" "}
                  {formatCurrency(opportunity.newPrice, opportunity.currency)}
                </p>
              ) : null}

              {opportunity.dropAmount ? (
                <p className="text-red-300">
                  Drop:{" "}
                  {formatCurrency(opportunity.dropAmount, opportunity.currency)}
                </p>
              ) : null}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2">
              <p className="text-slate-500">Beds</p>
              <p className="mt-1 font-semibold text-slate-200">
                {opportunity.bedrooms ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2">
              <p className="text-slate-500">Size</p>
              <p className="mt-1 font-semibold text-slate-200">
                {opportunity.sizeLabel ||
                  (opportunity.sizeValue
                    ? formatNumber(opportunity.sizeValue)
                    : "—")}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {opportunity.listingUrl ? (
              <Link
                href={opportunity.listingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                {opportunity.ctaLabel}
                <ExternalLink className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-slate-500"
              >
                Listing unavailable
              </button>
            )}

            <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {opportunity.hasPhone
                  ? "Phone"
                  : opportunity.hasWhatsapp
                    ? "WhatsApp"
                    : "URL lead"}
              </span>

              <span>{opportunity.agencyName || "Agency unavailable"}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}