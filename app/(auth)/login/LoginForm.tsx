"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Globe2,
  Lock,
  Radar,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  pageBg: "#09090b",
  cardBg: "rgba(17,17,19,0.7)",
  cardBorder: "rgba(255,255,255,0.08)",
  wellBg: "rgba(24,24,27,0.8)",
  border: "rgba(255,255,255,0.07)",
  borderStrong: "rgba(16,185,129,0.18)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  t4: "#3f3f46",
  em: "#10b981",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.07)",
  danger: "#f87171",
  dangerBg: "rgba(248,113,113,0.08)",
  dangerBorder: "rgba(248,113,113,0.18)",
  am: "#fbbf24",
  amBg: "rgba(245,158,11,0.07)",
  amBorder: "rgba(245,158,11,0.14)",
} as const;

// ─── Mini dashboard cards data ────────────────────────────────────────────────
const INTEL_CARDS = [
  {
    icon: Radar,
    label: "Opportunity Signals",
    bars: [40, 65, 35, 80],
    unit: "active signals",
    value: "24",
  },
  {
    icon: TrendingUp,
    label: "Market Pressure",
    bars: [55, 45, 70, 60],
    unit: "zones monitored",
    value: "17",
  },
  {
    icon: UserCheck,
    label: "Agency Movement",
    bars: [30, 50, 45, 55],
    unit: "agencies tracked",
    value: "9",
  },
  {
    icon: Globe2,
    label: "Country Access",
    bars: [75, 60, 85, 70],
    unit: "entitlements",
    value: "UAE + KSA",
  },
] as const;

// ─── Feature bullets ─────────────────────────────────────────────────────────
const FEATURES = [
  { icon: UserCheck, text: "Owner/direct and price-movement signals" },
  { icon: Globe2, text: "UAE + KSA country-aware dashboards" },
  { icon: TrendingUp, text: "Market pressure and competitor visibility" },
  { icon: Cpu, text: "Admin-gated data quality controls" },
] as const;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = useMemo(() => {
    const next = searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      return next;
    }
    return "/dashboard/uae/recon";
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 lg:px-8"
      style={{ background: C.pageBg, color: C.t1 }}
    >
      {/* Background depth */}
      {/* Radial emerald glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 30%, rgba(16,185,129,0.12) 0%, transparent 60%)",
        }}
      />
      {/* Subtle grid/map-line texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          backgroundPosition: "center center",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl">
        {/* Private-beta access strip (global) */}
        <div
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md"
          style={{
            background: C.amBg,
            borderColor: C.amBorder,
            color: C.am,
          }}
        >
          <Lock className="h-3.5 w-3.5" />
          Private beta access — approved accounts only
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left panel – brand & intelligence preview */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3 transition-opacity hover:opacity-80"
              aria-label="RASAD home"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg shadow-emerald-500/10"
                style={{
                  background: C.emBg,
                  borderColor: C.borderStrong,
                  color: C.emHi,
                }}
              >
                <Radar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-bold tracking-[0.22em] text-white">
                  RASAD
                </p>
                <p className="text-[11px] font-medium" style={{ color: C.t3 }}>
                  Real Estate Intelligence
                </p>
              </div>
            </Link>

            {/* Headline & description */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                Access the command layer behind UAE + KSA listings.
              </h1>
              <p className="text-base leading-relaxed" style={{ color: C.t2 }}>
                RASAD turns public listing activity into opportunity signals,
                market pressure, listing truth, and agency movement
                intelligence.
              </p>
            </div>

            {/* Mini intelligence cards */}
            <div className="grid grid-cols-2 gap-3">
              {INTEL_CARDS.map(({ icon: Icon, label, bars, unit, value }) => (
                <div
                  key={label}
                  className="rounded-xl border p-3 backdrop-blur-sm"
                  style={{
                    background: "rgba(17,17,19,0.45)",
                    borderColor: C.border,
                  }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" style={{ color: C.emHi }} />
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: C.t2 }}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="mb-2 flex h-5 items-end gap-0.5">
                    {bars.map((heightPercent, idx) => (
                      <div
                        key={idx}
                        className="w-full rounded-t-sm"
                        style={{
                          height: `${Math.max(heightPercent / 100 * 20, 4)}px`,
                          background: `linear-gradient(180deg, ${C.emHi} 0%, ${C.em} 100%)`,
                          opacity: 0.55,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: C.t1 }}
                    >
                      {value}
                    </span>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: C.t3 }}
                    >
                      {unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature bullets */}
            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ background: C.emBg }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: C.emHi }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: C.t2 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel – elevated glass login card */}
          <div className="flex items-center">
            <section
              className="w-full rounded-2xl border p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
              style={{
                background: C.cardBg,
                borderColor: C.cardBorder,
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 25px 50px -12px rgba(0,0,0,0.5)",
              }}
            >
              {/* Card status badge */}
              <div
                className="mb-5 flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em]"
                style={{
                  background: C.amBg,
                  borderColor: C.amBorder,
                  color: C.am,
                }}
              >
                <Lock className="h-3 w-3" />
                Private Market Intelligence
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Sign in to RASAD
                </h2>
                <p className="mt-1.5 text-sm" style={{ color: C.t3 }}>
                  Use your approved private-beta account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{ color: C.t4 }}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:font-medium focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
                    style={{
                      background: C.wellBg,
                      borderColor: C.border,
                      color: C.t1,
                    }}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{ color: C.t4 }}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:font-medium focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
                    style={{
                      background: C.wellBg,
                      borderColor: C.border,
                      color: C.t1,
                    }}
                    placeholder="Enter your password"
                  />
                </div>

                {errorMessage && (
                  <div
                    className="rounded-xl border px-4 py-3 text-sm"
                    style={{
                      background: C.dangerBg,
                      borderColor: C.dangerBorder,
                      color: C.danger,
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background: C.em,
                    boxShadow: "0 4px 18px rgba(16,185,129,0.25)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div
                className="mt-6 rounded-xl border px-4 py-3 text-xs leading-5"
                style={{
                  background: C.wellBg,
                  borderColor: C.border,
                  color: C.t2,
                }}
              >
                <CheckCircle2
                  className="mb-1 inline h-3.5 w-3.5"
                  style={{ color: C.em }}
                />{" "}
                Access is manually provisioned. Missing country or tier access
                redirects to the access page.
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}