import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Lock,
  Mail,
  MapPinned,
  Radar,
  ShieldCheck,
} from "lucide-react";

const C = {
  pageBg: "#09090b",
  cardBg: "#111113",
  wellBg: "#18181b",
  border: "rgba(255,255,255,0.07)",
  borderStrong: "rgba(16,185,129,0.18)",
  t1: "#f4f4f5",
  t2: "#a1a1aa",
  t3: "#52525b",
  em: "#10b981",
  emHi: "#34d399",
  emBg: "rgba(16,185,129,0.07)",
  am: "#fbbf24",
  amBg: "rgba(245,158,11,0.07)",
  amBdr: "rgba(245,158,11,0.14)",
} as const;

const ACCESS_CHECKS = [
  "Active subscription status",
  "Country entitlement: UAE, KSA, or GCC",
  "Section access based on current tier",
];

export default function UpgradePage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ background: C.pageBg, color: C.t1 }}
    >
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="RASAD home"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl border"
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
              <p className="text-xs" style={{ color: C.t3 }}>
                Real Estate Intelligence
              </p>
            </div>
          </Link>
        </div>

        <section
          className="overflow-hidden rounded-2xl border shadow-2xl shadow-black/30"
          style={{
            background: C.cardBg,
            borderColor: C.border,
          }}
        >
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8">
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  background: C.amBg,
                  borderColor: C.amBdr,
                  color: C.am,
                }}
              >
                <Lock className="h-3.5 w-3.5" />
                Access required
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                This dashboard section needs approval.
              </h1>

              <p className="mt-3 text-sm leading-6" style={{ color: C.t2 }}>
                Your account is signed in, but the requested country, tier, or
                dashboard section is not currently enabled for your subscription.
                RASAD is still in private beta, so access is manually provisioned.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div
                  className="rounded-xl border p-4"
                  style={{ background: C.wellBg, borderColor: C.border }}
                >
                  <Building2 className="mb-3 h-5 w-5" style={{ color: C.emHi }} />
                  <p className="text-sm font-semibold text-white">UAE</p>
                  <p className="mt-1 text-xs leading-5" style={{ color: C.t3 }}>
                    UAE dashboard entitlement may be required.
                  </p>
                </div>

                <div
                  className="rounded-xl border p-4"
                  style={{ background: C.wellBg, borderColor: C.border }}
                >
                  <MapPinned className="mb-3 h-5 w-5" style={{ color: C.emHi }} />
                  <p className="text-sm font-semibold text-white">KSA</p>
                  <p className="mt-1 text-xs leading-5" style={{ color: C.t3 }}>
                    KSA dashboard entitlement may be required.
                  </p>
                </div>

                <div
                  className="rounded-xl border p-4"
                  style={{ background: C.wellBg, borderColor: C.border }}
                >
                  <ShieldCheck
                    className="mb-3 h-5 w-5"
                    style={{ color: C.emHi }}
                  />
                  <p className="text-sm font-semibold text-white">Tier</p>
                  <p className="mt-1 text-xs leading-5" style={{ color: C.t3 }}>
                    Tactical or market-command access may be required.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
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
            </div>

            <aside
              className="border-t p-6 sm:p-8 lg:border-l lg:border-t-0"
              style={{
                background: "#0c0c0e",
                borderColor: C.border,
              }}
            >
              <div
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border"
                style={{
                  background: C.emBg,
                  borderColor: C.borderStrong,
                  color: C.emHi,
                }}
              >
                <Mail className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-bold text-white">
                Private beta provisioning
              </h2>

              <p className="mt-2 text-sm leading-6" style={{ color: C.t2 }}>
                To activate or expand your access, ask the RASAD operator to
                update your subscription tier and country entitlements in
                Supabase.
              </p>

              <div className="mt-6 space-y-3">
                {ACCESS_CHECKS.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border px-4 py-3"
                    style={{ background: C.wellBg, borderColor: C.border }}
                  >
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: C.em }}
                    />
                    <p className="text-xs leading-5" style={{ color: C.t2 }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 rounded-xl border px-4 py-3 text-xs leading-5"
                style={{
                  background: C.amBg,
                  borderColor: C.amBdr,
                  color: C.t2,
                }}
              >
                Billing and Stripe are intentionally not connected yet. This page
                is only an access-denied / upgrade-required placeholder for the
                manual private beta phase.
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}