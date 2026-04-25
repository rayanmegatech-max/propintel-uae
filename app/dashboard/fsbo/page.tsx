"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  MapPin,
  Phone,
  Search,
  ChevronDown,
  BedDouble,
  Bath,
  Ruler,
  Clock,
  AtSign,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contact {
  name: string;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
}

interface FsboListing {
  id: number;
  type: string;
  title: string;
  address: string;
  price: string;
  beds: number;
  baths: number;
  size: string;
  daysListed: number;
  reestimateValue: string;
  marketDelta: string;
  deltaPositive: boolean; // true = below market (good buy = green)
  contact: Contact;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const FSBO_LISTINGS: FsboListing[] = [
  {
    id: 1,
    type: "Apartment",
    title: "Spacious 2BR with Marina View",
    address: "Marina Gate 2, Dubai Marina",
    price: "AED 1,850,000",
    beds: 2, baths: 2, size: "1,240 sqft",
    daysListed: 3,
    reestimateValue: "AED 1,720,000",
    marketDelta: "+7.6% above market",
    deltaPositive: false,
    contact: { name: "Abdul Rahman", whatsapp: "+971501234567", phone: "+971501234568", email: "abdul.r@email.com" },
  },
  {
    id: 2,
    type: "Villa",
    title: "Corner Unit — Arabian Ranches",
    address: "Arabian Ranches 3, Sun",
    price: "AED 3,200,000",
    beds: 4, baths: 3, size: "2,800 sqft",
    daysListed: 1,
    reestimateValue: "AED 3,500,000",
    marketDelta: "−8.6% below market",
    deltaPositive: true,
    contact: { name: "Mariam Al-Hashemi", whatsapp: "+971505678901", phone: "+971505678902", email: null },
  },
  {
    id: 3,
    type: "Townhouse",
    title: "End Unit — JVC District",
    address: "Bloom Gardens, JVC",
    price: "AED 2,100,000",
    beds: 3, baths: 3, size: "1,950 sqft",
    daysListed: 5,
    reestimateValue: "AED 2,050,000",
    marketDelta: "+2.4% above market",
    deltaPositive: false,
    contact: { name: "Rashid K.", whatsapp: "+971523456789", phone: null, email: "rashid.k@email.com" },
  },
  {
    id: 4,
    type: "Apartment",
    title: "High Floor — DIFC Skyline",
    address: "Index Tower, DIFC",
    price: "AED 1,120,000",
    beds: 1, baths: 1, size: "780 sqft",
    daysListed: 2,
    reestimateValue: "AED 1,050,000",
    marketDelta: "+6.7% above market",
    deltaPositive: false,
    contact: { name: "Layla N.", whatsapp: "+971545678123", phone: "+971545678124", email: "layla.n@email.com" },
  },
  {
    id: 5,
    type: "Apartment",
    title: "Palm Jumeirah Beach Access",
    address: "Oceana Residences, Palm Jumeirah",
    price: "AED 4,500,000",
    beds: 3, baths: 4, size: "2,100 sqft",
    daysListed: 7,
    reestimateValue: "AED 5,200,000",
    marketDelta: "−13.5% below market",
    deltaPositive: true,
    contact: { name: "Omar S.", whatsapp: null, phone: "+971564321987", email: "omar.s@propertyowner.ae" },
  },
];

const PROPERTY_TYPES = ["All", "Apartment", "Villa", "Townhouse"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildWhatsAppUrl(listing: FsboListing): string {
  const num = listing.contact.whatsapp?.replace(/\+/g, "") ?? "";
  const text = encodeURIComponent(
    `Hi ${listing.contact.name}, I saw your ${listing.title} listed for ${listing.price} in ${listing.address}. I'm a UAE agent and may have a qualified buyer. Are you available to discuss?`
  );
  return `https://wa.me/${num}?text=${text}`;
}

function typeBadgeColor(type: string): string {
  switch (type) {
    case "Villa":      return "border-purple-500/30 bg-purple-500/10 text-purple-400";
    case "Townhouse":  return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    default:           return "border-teal-500/30 bg-teal-500/10 text-teal-400";
  }
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function FsboCard({ listing, index }: { listing: FsboListing; index: number }) {
  const { contact } = listing;

  const deltaClass = listing.deltaPositive
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : "bg-amber-500/10 text-amber-400 border-amber-500/20";

  // Priority: WhatsApp → Phone → Email
  const hasWhatsApp = Boolean(contact.whatsapp);
  const hasPhone    = Boolean(contact.phone);
  const hasEmail    = Boolean(contact.email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.07 * index, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5 transition hover:border-white/[0.14] hover:bg-white/[0.065]"
    >
      {/* Top row: type badge + days listed */}
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeBadgeColor(listing.type)}`}>
          {listing.type}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <Clock className="h-3 w-3" />
          {listing.daysListed === 1 ? "1 day ago" : `${listing.daysListed} days ago`}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-sm font-semibold text-white leading-snug">
        {listing.title}
      </h3>

      {/* Address */}
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
        <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
        <span className="truncate">{listing.address}</span>
      </div>

      {/* Price */}
      <p className="mt-3 text-lg font-black text-white">{listing.price}</p>

      {/* Specs row */}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <BedDouble className="h-3 w-3" /> {listing.beds} Bed
        </span>
        <span className="flex items-center gap-1">
          <Bath className="h-3 w-3" /> {listing.baths} Bath
        </span>
        <span className="flex items-center gap-1">
          <Ruler className="h-3 w-3" /> {listing.size}
        </span>
      </div>

      {/* Market delta + ReEstimate */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-md border px-2.5 py-1 text-[11px] font-bold ${deltaClass}`}>
          {listing.marketDelta}
        </span>
        <span className="text-[11px] text-slate-500">
          ReEstimate™ {listing.reestimateValue}
        </span>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-white/[0.06]" />

      {/* Contact buttons */}
      <div className="flex flex-wrap gap-2">
        {/* WhatsApp — primary if available */}
        {hasWhatsApp && (
          <a
            href={buildWhatsAppUrl(listing)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 py-2 text-[12px] font-bold text-[#25D366] transition hover:bg-[#25D366]/25"
          >
            {/* WhatsApp SVG mark — safe, not a lucide import */}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.107.549 4.09 1.508 5.815L.057 23.876a.75.75 0 0 0 .921.921l6.061-1.451A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.73 9.73 0 0 1-4.976-1.37l-.356-.214-3.697.885.899-3.592-.234-.372A9.725 9.725 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
            </svg>
            WhatsApp
          </a>
        )}

        {/* Phone */}
        {hasPhone && (
          <a
            href={`tel:${contact.phone}`}
            className={`flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 py-2 text-[12px] font-bold text-blue-400 transition hover:bg-blue-500/20 ${hasWhatsApp ? "px-4" : "flex-1"}`}
          >
            <Phone className="h-3.5 w-3.5" />
            {!hasWhatsApp && "Call"}
          </a>
        )}

        {/* Email — only show when it's the best available option OR as supplement */}
        {hasEmail && (
          <a
            href={`mailto:${contact.email}`}
            className={`flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-[12px] font-bold text-slate-400 transition hover:bg-white/[0.08] hover:text-white ${!hasWhatsApp && !hasPhone ? "flex-1" : "px-4"}`}
          >
            <AtSign className="h-3.5 w-3.5" />
            {!hasWhatsApp && !hasPhone && "Email"}
          </a>
        )}

        {/* Fallback: nothing contactable */}
        {!hasWhatsApp && !hasPhone && !hasEmail && (
          <span className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2 text-center text-[12px] text-slate-600">
            No contact details
          </span>
        )}
      </div>

      {/* Contact name */}
      <p className="mt-2.5 text-[11px] text-slate-500">
        Owner: <span className="text-slate-400">{contact.name}</span>
      </p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FsboPage() {
  const [communityFilter, setCommunityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = useMemo(() => {
    return FSBO_LISTINGS.filter((l) => {
      const matchType = typeFilter === "All" || l.type === typeFilter;
      const matchComm =
        communityFilter.trim() === "" ||
        l.address.toLowerCase().includes(communityFilter.toLowerCase()) ||
        l.type.toLowerCase().includes(communityFilter.toLowerCase()) ||
        l.title.toLowerCase().includes(communityFilter.toLowerCase());
      return matchType && matchComm;
    });
  }, [communityFilter, typeFilter]);

  const contactable = FSBO_LISTINGS.filter(
    (l) => l.contact.whatsapp || l.contact.phone || l.contact.email
  ).length;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
          <UserPlus className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">FSBO Lead Magnet</h1>
          <p className="text-sm text-slate-400">
            Intercept private sellers before your competition. Beat every other agent to the mandate.
          </p>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Today's FSBO Leads", value: "12", color: "text-white",         bg: "bg-white/[0.04]  border-white/[0.08]"  },
          { label: "Contactable",         value: `${contactable}`,  color: "text-emerald-400", bg: "bg-emerald-500/[0.07] border-emerald-500/20" },
          { label: "Already Claimed",     value: "1",  color: "text-red-400",      bg: "bg-red-500/[0.07]    border-red-500/20"     },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border p-5 backdrop-blur-xl ${s.bg}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {s.label}
            </p>
            <p className={`mt-2 text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Community search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={communityFilter}
              onChange={(e) => setCommunityFilter(e.target.value)}
              placeholder="Filter by community, building, or keyword…"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* Property type dropdown */}
          <div className="relative sm:w-44">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Result count */}
          <span className="shrink-0 text-[12px] text-slate-500">
            {filtered.length} of {FSBO_LISTINGS.length} shown
          </span>
        </div>
      </div>

      {/* ── FSBO Cards grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((listing, idx) => (
            <FsboCard key={listing.id} listing={listing} index={idx} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] py-16 text-center backdrop-blur-xl">
          <p className="text-sm text-slate-400">No FSBO listings match your filters.</p>
          <button
            onClick={() => { setCommunityFilter(""); setTypeFilter("All"); }}
            className="mt-3 text-xs text-emerald-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <p className="text-[11px] leading-relaxed text-slate-500">
          FSBO data sourced from public portal listings. Contact details are publicly
          displayed by owners on listing platforms. Always respect privacy preferences.
        </p>
      </div>

    </div>
  );
}