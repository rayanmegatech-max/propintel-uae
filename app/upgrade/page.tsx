import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe2,
  Lock,
  Radar,
  ShieldCheck,
} from "lucide-react";

// ─── Design tokens ──────────────────────────────────────────────────────────
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
  am: "#fbbf24",
  amBg: "rgba(245,158,11,0.07)",
  amBorder: "rgba(245,158,11,0.14)",
} as const;

// ─── Content constants ──────────────────────────────────────────────────────

const ACCESS_CHECKS = [
  { icon: ShieldCheck, text: "Active subscription status" },
  { icon: Globe2, text: "Country entitlement: UAE, KSA, or GCC" },
  { icon: Building2, text: "Section access based on current tier" },
  { icon: Lock, text: "Admin-only controls" },
] as const;

const WHAT_IT_MEANS = [
  "Opportunities tier unlocks tactical deal signals.",
  "Market Command unlocks strategic market workspaces.",
  "GCC access unlocks UAE + KSA.",
  "Data Quality remains internal‑admin only.",
] as const;

export default function UpgradePage() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6"
      style={{ background: C.pageBg, color: C.t1 }}
    >
      {/* Background depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(16,185,129,0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          backgroundPosition: "center center",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl">
        {/* RASAD logo */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            aria-label="RASAD home"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl border shadow-lg shadow-emerald-500/10"
              style={{
                background: C.emBg,
                borderColor: C.borderStrong,
                color: C.emHi,
              }}
            >
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.22em] text-white">
                RASAD
              </p>
              <p className="text-[10px] font-medium" style={{ color: C.t3 }}>
                Real Estate Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Glass card */}
        <section
          className="rounded-2xl border p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
          style={{
            background: C.cardBg,
            borderColor: C.cardBorder,
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 25px 50px -12px rgba(0,0,0,0.5)",
          }}
        >
          {/* Access required badge */}
          <div
            className="mb-5 flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{
              background: C.amBg,
              borderColor: C.amBorder,
              color: C.am,
            }}
          >
            <Lock className="h-3.5 w-3.5" />
            Access required
          </div>

          {/* Headline & sub */}
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Access requires approval.
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: C.t2 }}>
            Your account is signed in, but this country, tier, or dashboard
            section is not enabled for your current RASAD access profile.
          </p>

          {/* Section 1: Access profile check */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-5 w-5" style={{ color: C.emHi }} />
              <h2 className="text-lg font-semibold text-white">Access profile check</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {ACCESS_CHECKS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3"
                  style={{
                    background: C.wellBg,
                    borderColor: C.border,
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: C.emHi }} />
                  <span className="text-sm" style={{ color: C.t2 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: What this means */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-5 w-5" style={{ color: C.emHi }} />
              <h2 className="text-lg font-semibold text-white">What this means</h2>
            </div>
            <ul className="space-y-3">
              {WHAT_IT_MEANS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: C.em }}
                  />
                  <span className="text-sm leading-6" style={{ color: C.t2 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Next action */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              style={{
                background: C.em,
                boxShadow: "0 4px 18px rgba(16,185,129,0.22)",
              }}
            >
              Return to dashboard
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition hover:opacity-80"
              style={{
                background: C.wellBg,
                borderColor: C.border,
                color: C.t2,
              }}
            >
              Sign in with another account
            </Link>
          </div>

          {/* Footer note */}
          <div
            className="mt-8 rounded-xl border px-4 py-3 text-xs leading-5"
            style={{
              background: C.amBg,
              borderColor: C.amBorder,
              color: C.t2,
            }}
          >
            RASAD is in private beta — access is manually provisioned. Billing
            and Stripe are intentionally not connected yet. This page is an
            access‑denied placeholder, not a public checkout.
          </div>
        </section>
      </div>
    </main>
  );
}