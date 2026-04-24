"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  TrendingDown,
  Clock,
  MapPin,
  Tag,
  ArrowDown,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
  type: string;
  location: string;
  price: string;
  time: string;
  beds: string;
}

interface PriceDrop {
  address: string;
  oldPrice: string;
  newPrice: string;
  drop: string;
  dropPct: string;
}

interface Delisted {
  address: string;
  price: string;
  status: "sold" | "withdrawn";
  beds: string;
}

// ─── Mock data — Today ────────────────────────────────────────────────────────

const TODAY = {
  newListings: [
    { type: "Apartment", location: "Dubai Marina, Marina Gate 2", price: "AED 1,850,000", time: "06:42 GST", beds: "2 BR" },
    { type: "Villa",     location: "Arabian Ranches 3, Sun",       price: "AED 3,400,000", time: "07:05 GST", beds: "4 BR" },
    { type: "Apartment", location: "JVC, Bloom Towers",             price: "AED 720,000",  time: "07:18 GST", beds: "1 BR" },
    { type: "Penthouse", location: "DIFC, Index Tower",             price: "AED 9,200,000", time: "07:31 GST", beds: "3 BR" },
  ] as Listing[],
  priceDrops: [
    { address: "Palm Jumeirah, Signature Villas",    oldPrice: "AED 18,500,000", newPrice: "AED 18,320,000", drop: "AED 180,000", dropPct: "−0.97%" },
    { address: "Downtown Dubai, Burj Vista T2",      oldPrice: "AED 2,650,000",  newPrice: "AED 2,555,000",  drop: "AED 95,000",  dropPct: "−3.58%" },
    { address: "JBR, Murjan Tower 3",                oldPrice: "AED 2,100,000",  newPrice: "AED 2,028,000",  drop: "AED 72,000",  dropPct: "−3.43%" },
  ] as PriceDrop[],
  delisted: [
    { address: "Business Bay, The Opus",      price: "AED 1,980,000", status: "sold",      beds: "2 BR" },
    { address: "Meydan, The Polo Residence",  price: "AED 4,200,000", status: "withdrawn", beds: "3 BR" },
  ] as Delisted[],
};

const YESTERDAY = {
  newListings: [
    { type: "Apartment", location: "Downtown Dubai, Vida Residences", price: "AED 2,100,000", time: "07:12 GST", beds: "2 BR" },
    { type: "Villa",     location: "Damac Hills, Villas Sector G",     price: "AED 2,750,000", time: "07:44 GST", beds: "3 BR" },
    { type: "Apartment", location: "Jumeirah Village Triangle",        price: "AED 640,000",   time: "08:01 GST", beds: "Studio" },
    { type: "Apartment", location: "Dubai Creek Harbour, The Cove",   price: "AED 1,620,000", time: "08:15 GST", beds: "2 BR" },
  ] as Listing[],
  priceDrops: [
    { address: "Dubai Hills, Elysian Mansions",  oldPrice: "AED 22,000,000", newPrice: "AED 21,500,000", drop: "AED 500,000", dropPct: "−2.27%" },
    { address: "Al Barsha, Manazel Al Safa",     oldPrice: "AED 1,400,000",  newPrice: "AED 1,350,000",  drop: "AED 50,000",  dropPct: "−3.57%" },
    { address: "Jumeirah Lake Towers, Goldcrest", oldPrice: "AED 1,200,000", newPrice: "AED 1,155,000",  drop: "AED 45,000",  dropPct: "−3.75%" },
  ] as PriceDrop[],
  delisted: [
    { address: "Palm Jumeirah, Garden Homes",  price: "AED 14,500,000", status: "sold",      beds: "4 BR" },
    { address: "City Walk, Building 19",       price: "AED 2,250,000",  status: "withdrawn", beds: "2 BR" },
  ] as Delisted[],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  count,
  iconColor,
  badgeColor,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  iconColor: string;
  badgeColor: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-3.5">
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconColor}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-white">{title}</span>
      <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}>
        {count}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MorningBriefPage() {
  const [tab, setTab] = useState<"today" | "yesterday">("today");
  const data = tab === "today" ? TODAY : YESTERDAY;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15">
              <Newspaper className="h-4 w-4 text-teal-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Morning Market Brief</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Daily market digest for Dubai, Abu Dhabi, and Sharjah.
          </p>
        </div>

        {/* Update note */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-500">
            Your brief updates every morning at <span className="font-semibold text-slate-400">8:00 AM GST</span>
          </span>
        </div>
      </div>

      {/* ── Tab switcher ── */}
      <div className="inline-flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
        {(["today", "yesterday"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-all duration-200",
              tab === t
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-300",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Sections — animate on tab switch ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          {/* ── A) New Listings ── */}
          <GlassCard>
            <SectionHeader
              icon={<Tag className="h-3.5 w-3.5 text-emerald-400" />}
              title="New Listings"
              count={data.newListings.length}
              iconColor="bg-emerald-500/15"
              badgeColor="bg-emerald-500/15 text-emerald-400"
            />
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
              {data.newListings.map((l, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                      {l.type}
                    </span>
                    <span className="text-[10px] text-slate-600">{l.time}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{l.location}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{l.price}</span>
                    <span className="text-[11px] text-slate-500">{l.beds}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ── B) Price Drops ── */}
          <GlassCard>
            <SectionHeader
              icon={<TrendingDown className="h-3.5 w-3.5 text-red-400" />}
              title="Price Drops"
              count={data.priceDrops.length}
              iconColor="bg-red-500/15"
              badgeColor="bg-red-500/15 text-red-400"
            />
            <div className="divide-y divide-white/[0.04]">
              {data.priceDrops.map((d, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-300">{d.address}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="text-slate-500 line-through">{d.oldPrice}</span>
                      <ArrowDown className="h-3 w-3 text-red-400" />
                      <span className="font-semibold text-white">{d.newPrice}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-sm font-bold text-red-400">{d.dropPct}</span>
                    <span className="text-[10px] text-slate-600">{d.drop}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ── C) Delisted / Sold ── */}
          <GlassCard>
            <SectionHeader
              icon={<XCircle className="h-3.5 w-3.5 text-slate-400" />}
              title="Delisted / Sold"
              count={data.delisted.length}
              iconColor="bg-white/[0.06]"
              badgeColor="bg-white/[0.06] text-slate-400"
            />
            <div className="divide-y divide-white/[0.04]">
              {data.delisted.map((d, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-300">{d.address}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {d.beds} · {d.price}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {d.status === "sold" ? (
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle className="h-3 w-3" />
                        Sold
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-slate-400">
                        <XCircle className="h-3 w-3" />
                        Withdrawn
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}