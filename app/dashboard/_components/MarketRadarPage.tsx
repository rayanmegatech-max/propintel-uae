"use client";

import Link from "next/link";
import { Activity, ArrowRight, Building2, Globe2, MapPinned } from "lucide-react";
import { type CountryConfig } from "@/lib/countries/countryConfig";

const C = {
  cardBg: "#111113",
  border: "rgba(255,255,255,0.07)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#71717a",
  cyHi: "#22d3ee",
  cyBg: "rgba(34,211,238,0.07)",
  cyBdr: "rgba(34,211,238,0.16)",
};

export default function MarketRadarPage({ country }: { country: CountryConfig }) {
  const isBuildingsDisabled = !!country.disabledSections?.["buildings"];

  const links = [
    {
      slug: "activity-feed",
      label: "Activity Feed",
      desc: "Daily market movement, recon opportunities, and repricing events.",
      icon: <Globe2 className="h-5 w-5" />,
    },
    {
      slug: "inventory-pressure",
      label: "Inventory Pressure",
      desc: "Identify macro locations with rising pressure and opportunity density.",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      slug: "buildings",
      label: "Building Intelligence",
      desc: isBuildingsDisabled
        ? country.disabledSections?.["buildings"]
        : "Asset-level intelligence tracking supply and dominance per project.",
      icon: <Building2 className="h-5 w-5" />,
      disabled: isBuildingsDisabled,
    },
    {
      slug: "communities",
      label: "Community Intelligence",
      desc: "Track inventory, agency presence, and price drops by community or district.",
      icon: <MapPinned className="h-5 w-5" />,
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
            style={{ background: C.cyBg, borderColor: C.cyBdr, color: C.cyHi }}
          >
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold tracking-tight" style={{ color: C.t1 }}>
              Market Radar
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
            style={{
              background: item.disabled ? "rgba(255,255,255,0.01)" : C.cardBg,
              borderColor: C.border,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: C.border,
                  color: item.disabled ? C.t3 : C.t1,
                }}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3
                  className="text-[15px] font-semibold flex items-center gap-2"
                  style={{ color: item.disabled ? C.t3 : C.t1 }}
                >
                  {item.label}
                  {item.disabled && (
                    <span className="text-[9px] uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Limited
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: C.t3 }}>
                  {item.desc}
                </p>
              </div>
            </div>
            <div
              className="mt-auto flex items-center gap-1.5 pt-4 text-[12px] font-medium transition-transform group-hover:translate-x-0.5"
              style={{ color: C.cyHi }}
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