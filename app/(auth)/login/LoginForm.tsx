"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Lock, Radar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  danger: "#f87171",
  dangerBg: "rgba(248,113,113,0.08)",
  dangerBorder: "rgba(248,113,113,0.18)",
} as const;

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
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ background: C.pageBg, color: C.t1 }}
    >
      <div className="w-full max-w-md">
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
          className="rounded-2xl border p-6 shadow-2xl shadow-black/30"
          style={{
            background: C.cardBg,
            borderColor: C.border,
          }}
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{
              background: C.emBg,
              borderColor: C.borderStrong,
              color: C.emHi,
            }}
          >
            <Lock className="h-3.5 w-3.5" />
            Secure access
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sign in to RASAD
          </h1>

          <p className="mt-2 text-sm leading-6" style={{ color: C.t2 }}>
            Access the UAE and KSA intelligence dashboard using your approved
            account credentials.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: C.t3 }}
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
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-400/40"
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
                style={{ color: C.t3 }}
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
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-400/40"
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: C.em,
                boxShadow: "0 4px 18px rgba(16,185,129,0.22)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
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
            Access is manually provisioned during the private beta. If your
            account is inactive or missing country access, the dashboard will
            redirect you to the upgrade page.
          </div>
        </section>
      </div>
    </main>
  );
}