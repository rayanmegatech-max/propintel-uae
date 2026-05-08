// app/dashboard/_components/ReconPageHero.tsx

type ReconPageHeroProps = {
  countryLabel: string;
  countryCode: "UAE" | "KSA";
  currency: "AED" | "SAR";
  exportedAt: string;
  title: string;
  description: string;
  primaryTableText: string;
  marketScopeText: string;
};

function compactDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function timeSince(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "< 1h ago";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const C = {
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.06)",
  emBdr: "rgba(16,185,129,0.18)",
  border: "rgba(255,255,255,0.07)",
} as const;

export default function ReconPageHero({
  countryCode,
  currency,
  exportedAt,
  title,
  description,
}: ReconPageHeroProps) {
  const ago = timeSince(exportedAt);

  return (
    <header className="relative">
      {/* Subtle gradient accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.35) 30%, rgba(52,211,153,0.12) 70%, transparent 100%)",
        }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {/* Left: title cluster */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[9px] font-black uppercase tracking-[0.16em]"
              style={{
                color: C.emHi,
                background: C.emBg,
                border: `1px solid ${C.emBdr}`,
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background: C.emHi,
                  boxShadow: "0 0 6px rgba(52,211,153,0.6)",
                }}
              />
              {countryCode} Recon
            </span>
            <span
              className="rounded-md px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.12em]"
              style={{
                color: C.t4,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.border}`,
              }}
            >
              {currency}
            </span>
          </div>

          <h1
            className="text-[20px] font-bold tracking-tight sm:text-[24px]"
            style={{ color: C.t1, letterSpacing: "-0.025em" }}
          >
            {title}
          </h1>
          <p
            className="mt-0.5 max-w-2xl text-[13px] leading-relaxed"
            style={{ color: C.t3 }}
          >
            {description}
          </p>
        </div>

        {/* Right: freshness */}
        <div className="flex items-center gap-3 sm:self-end">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${C.border}`,
            }}
          >
            <span
              className="inline-block h-[5px] w-[5px] rounded-full"
              style={{
                background: "#10b981",
                boxShadow: "0 0 8px rgba(16,185,129,0.5)",
              }}
            />
            <span className="text-[11px] font-medium" style={{ color: C.t2 }}>
              {compactDate(exportedAt)}
            </span>
            {ago && (
              <span className="text-[10px]" style={{ color: C.t4 }}>
                {ago}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
