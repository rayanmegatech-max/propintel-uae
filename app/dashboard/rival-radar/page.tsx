"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair,
  Search,
  X,
  PlusCircle,
  TrendingDown,
  XCircle,
  MapPin,
  AlertTriangle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityType = "new_listing" | "price_drop" | "delisted" | "territory_shift";

interface Rival {
  id: number;
  name: string;
  agency: string;
  initials: string;
}

interface Activity {
  id: number;
  time: string;
  rival: string;
  agency: string;
  type: ActivityType;
  desc: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ALL_RIVALS: Rival[] = [
  { id: 1,  name: "Hassan M.",  agency: "Al Nour Real Estate",    initials: "HM" },
  { id: 2,  name: "Sara K.",    agency: "Prestige Realty Group",  initials: "SK" },
  { id: 3,  name: "Rami F.",    agency: "GoldKey Properties",     initials: "RF" },
  { id: 4,  name: "Tariq B.",   agency: "NextMove UAE",           initials: "TB" },
  { id: 5,  name: "Layla N.",   agency: "Al Nour Real Estate",    initials: "LN" },
  { id: 6,  name: "Amira S.",   agency: "Prestige Realty Group",  initials: "AS" },
  { id: 7,  name: "Omar H.",    agency: "GoldKey Properties",     initials: "OH" },
  { id: 8,  name: "Nadia R.",   agency: "NextMove UAE",           initials: "NR" },
  { id: 9,  name: "Khalid W.",  agency: "Luxury Homes Dubai",     initials: "KW" },
  { id: 10, name: "Dina E.",    agency: "Prime Properties UAE",   initials: "DE" },
];

const INITIAL_WATCHLIST_IDS = [1, 2, 3];

const MOCK_ACTIVITY: Activity[] = [
  { id: 1,  time: "14m ago", rival: "Hassan M.", agency: "Al Nour Real Estate",   type: "new_listing",    desc: "Listed 2BR in Dubai Marina, Marina Gate 2 for AED 1,850,000" },
  { id: 2,  time: "31m ago", rival: "Sara K.",   agency: "Prestige Realty Group", type: "price_drop",     desc: "Dropped 3BR in Palm Jumeirah from AED 18.5M to AED 18.32M (−AED 180K)" },
  { id: 3,  time: "1h ago",  rival: "Tariq B.",  agency: "NextMove UAE",          type: "territory_shift",desc: "Entered Jumeirah Village Circle for the first time in 60 days" },
  { id: 4,  time: "2h ago",  rival: "Layla N.",  agency: "Al Nour Real Estate",   type: "delisted",       desc: "Removed 1BR in DIFC, Index Tower from all portals" },
  { id: 5,  time: "3h ago",  rival: "Rami F.",   agency: "GoldKey Properties",    type: "new_listing",    desc: "Listed Studio in JVC, Bloom Towers for AED 620,000" },
  { id: 6,  time: "4h ago",  rival: "Amira S.",  agency: "Prestige Realty Group", type: "price_drop",     desc: "Dropped 1BR in Dubai Hills from AED 1.2M to AED 1.15M (−AED 50K)" },
  { id: 7,  time: "5h ago",  rival: "Omar H.",   agency: "GoldKey Properties",    type: "new_listing",    desc: "Listed 4BR Villa in Arabian Ranches for AED 3.4M" },
  { id: 8,  time: "6h ago",  rival: "Nadia R.",  agency: "NextMove UAE",          type: "territory_shift",desc: "Expanded into Business Bay — now active in 4 communities" },
  { id: 9,  time: "7h ago",  rival: "Hassan M.", agency: "Al Nour Real Estate",   type: "price_drop",     desc: "Dropped 2BR in JLT from AED 1.4M to AED 1.32M (−AED 80K)" },
  { id: 10, time: "8h ago",  rival: "Sara K.",   agency: "Prestige Realty Group", type: "new_listing",    desc: "Listed 3BR Townhouse in Damac Hills for AED 2.75M" },
];

// ─── Activity type config ─────────────────────────────────────────────────────

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { label: string; Icon: React.ElementType; iconClass: string; dotClass: string; pillClass: string }
> = {
  new_listing: {
    label: "New Listing",
    Icon: PlusCircle,
    iconClass: "text-emerald-400",
    dotClass: "bg-emerald-400",
    pillClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  price_drop: {
    label: "Price Drop",
    Icon: TrendingDown,
    iconClass: "text-red-400",
    dotClass: "bg-red-400",
    pillClass: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  delisted: {
    label: "Delisted",
    Icon: XCircle,
    iconClass: "text-slate-400",
    dotClass: "bg-slate-400",
    pillClass: "border-white/[0.1] bg-white/[0.05] text-slate-400",
  },
  territory_shift: {
    label: "Territory Shift",
    Icon: MapPin,
    iconClass: "text-blue-400",
    dotClass: "bg-blue-400",
    pillClass: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
};

// ─── Avatar initials colour palette (cycled by rival id) ─────────────────────

const AVATAR_COLORS = [
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-red-500 to-rose-600",
];

function avatarGradient(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RivalAvatar({ rival }: { rival: Rival }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(rival.id)} text-[11px] font-bold text-white`}
    >
      {rival.initials}
    </div>
  );
}

function ActivityRow({ entry, index }: { entry: Activity; index: number }) {
  const cfg = ACTIVITY_CONFIG[entry.type];
  const Icon = cfg.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.055 * index, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-4 border-b border-white/[0.05] px-5 py-4 last:border-0 transition-colors hover:bg-white/[0.02]"
    >
      {/* Activity icon */}
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] ${cfg.iconClass}`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        {/* Top row: rival + type badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-white">{entry.rival}</span>
          <span className="text-[11px] text-slate-500">·</span>
          <span className="text-[11px] text-slate-500">{entry.agency}</span>
          <span
            className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-bold ${cfg.pillClass}`}
          >
            {cfg.label}
          </span>
        </div>
        {/* Description */}
        <p className="mt-1 text-sm leading-snug text-slate-400">{entry.desc}</p>
      </div>

      {/* Timestamp */}
      <span className="shrink-0 text-[11px] text-slate-600">{entry.time}</span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RivalRadarPage() {
  const [watchlistIds, setWatchlistIds] = useState<number[]>(INITIAL_WATCHLIST_IDS);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const watchlist = useMemo(
    () => ALL_RIVALS.filter((r) => watchlistIds.includes(r.id)),
    [watchlistIds]
  );

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return ALL_RIVALS.filter(
      (r) =>
        !watchlistIds.includes(r.id) &&
        (r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.agency.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 6);
  }, [query, watchlistIds]);

  function addRival(rival: Rival) {
    if (watchlistIds.length >= 10) return;
    setWatchlistIds((prev) => [...prev, rival.id]);
    setQuery("");
    setDropdownOpen(false);
  }

  function removeRival(id: number) {
    setWatchlistIds((prev) => prev.filter((rid) => rid !== id));
  }

  const filteredActivity = useMemo(() => {
    if (typeFilter === "all") return MOCK_ACTIVITY;
    return MOCK_ACTIVITY.filter((a) => a.type === typeFilter);
  }, [typeFilter]);

  const newListingsCount = MOCK_ACTIVITY.filter((a) => a.type === "new_listing").length;
  const priceDropsCount  = MOCK_ACTIVITY.filter((a) => a.type === "price_drop").length;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
          <Crosshair className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Rival Radar</h1>
          <p className="text-sm text-slate-400">
            Live competitor intelligence feed. Every new listing, price drop, and territory move by your tracked rivals.
          </p>
        </div>
      </div>

      {/* ── Rival search + watchlist ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-white">Watchlist</h2>
          <span className="text-[11px] text-slate-500">
            {watchlist.length} / 10 rivals tracked
          </span>
        </div>

        {/* Watchlist pills */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {watchlist.map((rival) => (
              <motion.div
                key={rival.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] py-1.5 pl-2 pr-3"
              >
                <RivalAvatar rival={rival} />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold leading-tight text-white">{rival.name}</p>
                  <p className="truncate text-[10px] text-slate-500">{rival.agency}</p>
                </div>
                <button
                  onClick={() => removeRival(rival.id)}
                  aria-label={`Remove ${rival.name}`}
                  className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add rival input */}
          {watchlist.length < 10 && (
            <div className="relative">
              <div className="flex items-center gap-2 rounded-full border border-dashed border-white/[0.15] bg-transparent px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-slate-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setDropdownOpen(e.target.value.trim().length > 0);
                  }}
                  onFocus={() => query.trim() && setDropdownOpen(true)}
                  placeholder="Add agent or agency…"
                  className="w-48 bg-transparent text-[12px] text-white placeholder-slate-600 outline-none"
                />
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {dropdownOpen && suggestions.length > 0 && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-white/[0.1] bg-slate-900/95 shadow-2xl backdrop-blur-xl"
                  >
                    {suggestions.map((rival) => (
                      <button
                        key={rival.id}
                        onClick={() => addRival(rival)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/[0.07]"
                      >
                        <RivalAvatar rival={rival} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white">{rival.name}</p>
                          <p className="truncate text-[11px] text-slate-500">{rival.agency}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
                {dropdownOpen && suggestions.length === 0 && query.trim() && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-white/[0.1] bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-xl"
                  >
                    <p className="text-[12px] text-slate-500">No rivals found for "{query}".</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Rivals Tracked",       value: watchlist.length,  color: "text-white",         border: "border-white/[0.08]", bg: "bg-white/[0.04]" },
          { label: "New Listings Today",   value: newListingsCount,  color: "text-emerald-400",   border: "border-emerald-500/20", bg: "bg-emerald-500/[0.07]" },
          { label: "Price Drops Detected", value: priceDropsCount,   color: "text-red-400",       border: "border-red-500/20",    bg: "bg-red-500/[0.07]"    },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border p-5 backdrop-blur-xl ${s.border} ${s.bg}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {s.label}
            </p>
            <p className={`mt-2 text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Activity feed ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">

        {/* Feed header + type filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-sm font-semibold text-white">Activity Feed</h2>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "new_listing", "price_drop", "territory_shift", "delisted"] as const).map(
              (t) => {
                const isAll = t === "all";
                const cfg = isAll ? null : ACTIVITY_CONFIG[t];
                const active = typeFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={[
                      "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition",
                      active
                        ? isAll
                          ? "bg-white/10 text-white"
                          : `border ${cfg!.pillClass}`
                        : "text-slate-500 hover:text-slate-300",
                    ].join(" ")}
                  >
                    {isAll ? "All" : cfg!.label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Feed entries */}
        <div>
          <AnimatePresence mode="wait">
            {filteredActivity.length > 0 ? (
              <motion.div key={typeFilter}>
                {filteredActivity.map((entry, idx) => (
                  <ActivityRow key={entry.id} entry={entry} index={idx} />
                ))}
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-5 py-8 text-center text-sm text-slate-500"
              >
                No activity of this type yet.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
        <p className="text-[11px] leading-relaxed text-slate-500">
          Rival Radar data refreshes every 6 hours. Based on cross-portal listing snapshots.
          No private CRM data is accessed.
        </p>
      </div>

    </div>
  );
}