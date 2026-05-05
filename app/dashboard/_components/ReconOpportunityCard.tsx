import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  MapPinned,
  Phone,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  labelize,
} from "@/lib/recon/formatters";
import type {
  NormalizedReconOpportunity,
  ReconSignalBadge,
} from "@/lib/recon/types";

const BADGE_TONE_CLASS_MAP: Record<
  NonNullable<ReconSignalBadge["tone"]>,
  string
> = {
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  red: "border-red-400/25 bg-red-400/10 text-red-200",
  slate: "border-white/[0.08] bg-slate-950/70 text-slate-300",
  teal: "border-teal-400/25 bg-teal-400/10 text-teal-200",
};

function SignalBadge({ badge }: { badge: ReconSignalBadge }) {
  const tone = badge.tone ?? "slate";
  const toneClasses = BADGE_TONE_CLASS_MAP[tone];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        toneClasses,
      ].join(" ")}
    >
      {badge.label}
    </span>
  );
}

function SmallStat({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-200">
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function ReconOpportunityCard({
  opportunity,
}: {
  opportunity: NormalizedReconOpportunity;
}) {
  const dropPct = formatPercent(opportunity.dropPct);
  const contactLabel = opportunity.hasPhone
    ? "Phone"
    : opportunity.hasWhatsapp
      ? "WhatsApp"
      : opportunity.hasEmail
        ? "Email"
        : "URL lead";

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_34%),rgba(255,255,255,0.035)] shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-emerald-400/30 hover:bg-white/[0.055]">
      <div className="grid gap-0 xl:grid-cols-[1fr_320px]">
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
              Rank #{opportunity.rank ?? "—"}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
              {labelize(opportunity.priorityLabel)}
            </span>

            <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">
              Score {opportunity.score ?? "—"}
            </span>

            {dropPct ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-red-400/25 bg-red-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-200">
                <TrendingDown className="h-3 w-3" />
                Drop {dropPct}
              </span>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="min-w-0">
              <h2 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-white">
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

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  {opportunity.propertyType || "Property type unavailable"}
                </span>

                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
                  {labelize(opportunity.portal)}
                </span>

                <span className="rounded-full border border-white/[0.08] bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
                  {labelize(opportunity.sourceCategory)}
                </span>
              </div>

              {opportunity.signalBadges.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {opportunity.signalBadges.map((badge) => (
                    <SignalBadge key={badge.label} badge={badge} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-slate-950/50 px-3 py-1 text-xs text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Product-safe listing signal
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              <SmallStat label="Beds" value={opportunity.bedrooms} />
              <SmallStat
                label="Size"
                value={
                  opportunity.sizeLabel ||
                  (opportunity.sizeValue
                    ? formatNumber(opportunity.sizeValue)
                    : null)
                }
              />
              <SmallStat label="Agent" value={opportunity.agentName} />
              <SmallStat label="Agency" value={opportunity.agencyName} />
            </div>
          </div>
        </div>

        <aside className="border-t border-white/[0.08] bg-slate-950/55 p-5 xl:border-l xl:border-t-0">
          <div className="flex h-full flex-col justify-between gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                {opportunity.priceLabel}
              </p>

              <p className="mt-2 text-2xl font-black tracking-tight text-white">
                {formatCurrency(opportunity.price, opportunity.currency)}
              </p>

              {(opportunity.oldPrice ||
                opportunity.newPrice ||
                opportunity.dropAmount) && (
                <div className="mt-4 space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 text-xs text-slate-400">
                  {opportunity.oldPrice ? (
                    <div className="flex items-center justify-between gap-3">
                      <span>Old</span>
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(
                          opportunity.oldPrice,
                          opportunity.currency
                        )}
                      </span>
                    </div>
                  ) : null}

                  {opportunity.newPrice ? (
                    <div className="flex items-center justify-between gap-3">
                      <span>New</span>
                      <span className="font-semibold text-emerald-200">
                        {formatCurrency(
                          opportunity.newPrice,
                          opportunity.currency
                        )}
                      </span>
                    </div>
                  ) : null}

                  {opportunity.dropAmount ? (
                    <div className="flex items-center justify-between gap-3">
                      <span>Drop</span>
                      <span className="font-semibold text-red-200">
                        {formatCurrency(
                          opportunity.dropAmount,
                          opportunity.currency
                        )}
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {opportunity.listingUrl ? (
                <Link
                  href={opportunity.listingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(16,185,129,0.20)] transition hover:bg-emerald-400"
                >
                  {opportunity.ctaLabel}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-black text-slate-500"
                >
                  Listing unavailable
                </button>
              )}

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                  {contactLabel}
                </span>

                {opportunity.listingUrl ? (
                  <Link
                    href={opportunity.listingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    Source
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span className="text-slate-600">No URL</span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}