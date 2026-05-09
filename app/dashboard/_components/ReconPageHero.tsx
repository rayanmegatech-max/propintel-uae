// app/dashboard/_components/ReconPageHero.tsx
import { Radar } from "lucide-react";

type ReconPageHeroProps = {
  countryLabel: string;
  countryCode: "UAE" | "KSA";
  currency: "AED" | "SAR";
  exportedAt: string;
  title: string;
  description: string;
  primaryTableText: string; // Kept for prop compatibility, unused in UI
  marketScopeText: string;  // Kept for prop compatibility, unused in UI
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
  t1: "#ffffff",
  t2: "#a1a1aa",
  t3: "#71717a",
  emHi: "#34d399",
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
    <header 
      className="relative overflow-hidden rounded-[24px] border p-8 sm:p-10"
      style={{
        background: "linear-gradient(180deg, rgba(24,24,27,0.6) 0%, rgba(9,9,11,0.8) 100%)",
        borderColor: "rgba(255,255,255,0.06)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        {/* Left: title cluster */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                color: C.emHi,
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <Radar className="h-3 w-3" />
              {countryCode} Workspace
            </span>
            <span
              className="rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{
                color: C.t2,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {currency}
            </span>
          </div>

          <h1 className="text-[32px] sm:text-[42px] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-500 mb-2">
            {title}
          </h1>
          <p className="max-w-2xl text-[14px] sm:text-[16px] leading-relaxed font-medium" style={{ color: C.t2 }}>
            {description}
          </p>
        </div>

        {/* Right: freshness */}
        <div className="flex items-center gap-3 sm:self-end">
          <div
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 shadow-sm"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)"
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full animate-pulse"
              style={{
                background: "#10b981",
                boxShadow: "0 0 10px rgba(16,185,129,0.6)",
              }}
            />
            <div className="flex flex-col">
              <span className="text-[12px] font-bold tracking-wide" style={{ color: C.t1 }}>
                Live Signals
              </span>
              <span className="text-[10px] font-medium mt-0.5" style={{ color: C.t3 }}>
                Updated {compactDate(exportedAt)} {ago && `(${ago})`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}