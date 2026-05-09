"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck } from "lucide-react";
import { type CountryConfig } from "@/lib/countries/countryConfig";

const C = {
  cardBg: "#111113",
  border: "rgba(255,255,255,0.07)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  am: "#fbbf24",
  amBg: "rgba(245,158,11,0.07)",
  amBdr: "rgba(245,158,11,0.15)",
};

export default function CompetitorRadarPage({ country }: { country: CountryConfig }) {
  const links = [
    {
      slug: "market-dominance",
      label: "Market Dominance",
      desc: "Analyze visible agency listing share, territory concentration, and fragmented markets.",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      slug: "agency-profiles",
      label: "Agency Profiles",
      desc: "Deep-dive into specific agency listing portfolios, mix, and apparent footprint.",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div
        className="rounded-2xl border p-8"
        style={{ background: C.cardBg, borderColor: C.border }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border"
            style={{ background: C.amBg, borderColor: C.amBdr, color: C.am }}
          >
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold tracking-tight" style={{ color: C.t1 }}>
              Competitor Radar
            </h1>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md mt-1 inline-block"
              style={{ background: "rgba(255,255,255,0.06)", color: C.t2 }}
            >
              Combined Workspace Preview
            </span>
          </div>
        </div>

        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.t2 }}>
          Use the focused modules below while this workspace is being consolidated.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <Link
            key={item.slug}
            href={`${country.routeBase}/${item.slug}`}
            className="group relative flex flex-col rounded-xl border p-5 transition-colors duration-200 hover:bg-white/[0.02]"
            style={{ background: C.cardBg, borderColor: C.border }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: C.border, color: C.t1 }}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold" style={{ color: C.t1 }}>
                  {item.label}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: C.t3 }}>
                  {item.desc}
                </p>
              </div>
            </div>
            <div
              className="mt-auto flex items-center gap-1.5 pt-4 text-[12px] font-medium transition-transform group-hover:translate-x-0.5"
              style={{ color: C.am }}
            >
              Open {item.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}