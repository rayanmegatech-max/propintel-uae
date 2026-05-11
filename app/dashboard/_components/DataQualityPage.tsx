// app/dashboard/_components/DataQualityPage.tsx
"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck,
  Globe2,
  Layers,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { formatNumber } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type {
  ExportHealthDataResult,
  ExportHealthManifest,
} from "@/lib/data/exportHealth";

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  t1: "#ffffff",
  t2: "#e4e4e7",
  t3: "#a1a1aa",
  t4: "#71717a",
  em: "#10b981",
  emHi: "#34d399",
  cy: "#06b6d4",
  cyHi: "#22d3ee",
  am: "#fbbf24",
  amHi: "#fcd34d",
  rd: "#fb7185",
  rdHi: "#f43f5e",
  tl: "#14b8a6",
  tlHi: "#2dd4bf",
  border: "rgba(255,255,255,0.06)",
  borderSub: "rgba(255,255,255,0.04)",
} as const;

type DataQualityPageProps = {
  country: CountryConfig;
  data: ExportHealthDataResult;
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/Module5/gi, "Module 5")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatExportTimestamp(value?: string | null): string {
  if (!value) return "Freshness unknown";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.replace("T", " ").replace(/\.\d+/, "").replace("+00:00", " UTC");
  }
  return parsed.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function statusColor(status: ExportHealthManifest["status"]): { text: string; bg: string; border: string; icon: LucideIcon } {
  if (status === "ready") return { text: C.emHi, bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", icon: CheckCircle2 };
  if (status === "missing") return { text: C.amHi, bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", icon: AlertTriangle };
  return { text: C.rdHi, bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.2)", icon: XCircle };
}

function overallStatusLabel(status: ExportHealthDataResult["status"]): { label: string; color: string } {
  if (status === "ready") return { label: "Ready to Publish", color: C.emHi };
  if (status === "partial") return { label: "Partial — Attention Needed", color: C.amHi };
  return { label: "Not Ready — Issues Found", color: C.rdHi };
}

// ─── Background Grid Pattern ──────────────────────────────────────────────
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" style={{ zIndex: 0 }}>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dq-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dq-grid)" />
      </svg>
    </div>
  );
}

// ─── Components ─────────────────────────────────────────────────────────────

function SnapshotCard({
  title,
  description,
  value,
  icon,
  accentColor,
}: {
  title: string;
  description: string;
  value?: string | number;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div
      className="relative flex flex-col h-full rounded-[16px] border p-5"
      style={{
        background: "rgba(255, 255, 255, 0.015)",
        borderColor: C.borderSub,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3.5 mb-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-inner"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              borderColor: "rgba(255,255,255,0.1)",
              color: accentColor,
            }}
          >
            {icon}
          </div>
          {value !== undefined && (
            <span className="text-[18px] font-black tabular-nums tracking-tight text-white mt-1">
              {value}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold tracking-tight text-white mb-1">{title}</h3>
          <p className="text-[13px] leading-relaxed font-medium" style={{ color: C.t3 }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({
  title,
  purpose,
  icon,
  accentColor,
  children,
}: {
  title: string;
  purpose: string;
  icon: React.ReactNode;
  accentColor: string;
  children?: React.ReactNode;
}) {
  return (
    <article
      className="relative overflow-hidden rounded-[20px] border shadow-md"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,27,0.4) 0%, rgba(9,9,11,0.6) 100%)",
        borderColor: C.border,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full opacity-80" style={{ background: accentColor }} />
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-[0.06]" style={{ background: accentColor }} />

      <div className="relative z-10 p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10" style={{ color: accentColor }}>
            {icon}
          </div>
          <h2 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight text-white">
            {title}
          </h2>
        </div>

        <p className="text-[13.5px] leading-relaxed font-medium mb-5 pl-1" style={{ color: C.t2 }}>
          {purpose}
        </p>

        {children}
      </div>
    </article>
  );
}

function HealthSummaryCard({ manifest }: { manifest: ExportHealthManifest }) {
  const sc = statusColor(manifest.status);
  const StatusIcon = sc.icon;

  const safeVisible = manifest.safeRules.slice(0, 4);
  const safeExtra = manifest.safeRules.length - 4;

  const blockedVisible = manifest.blockedTables.slice(0, 4);
  const blockedExtra = manifest.blockedTables.length - 4;

  const isMissing = manifest.missingCount > 0;

  return (
    <div
      className="rounded-[16px] border p-5"
      style={{
        background: "rgba(255,255,255,0.015)",
        borderColor: C.borderSub,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]"
              style={{ color: sc.text, background: sc.bg, borderColor: sc.border }}
            >
              <StatusIcon className="h-3 w-3" />
              {manifest.status}
            </span>
          </div>
          <h3 className="text-[16px] font-bold tracking-tight text-white">{manifest.label}</h3>
          <p className="mt-1 text-[13px] font-medium leading-relaxed" style={{ color: C.t3 }}>{manifest.message}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4 mb-5">
        <div className="rounded-lg border p-3" style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.15)" }}>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.emHi }}>Ready Outputs</span>
          <p className="mt-0.5 text-[18px] font-black tabular-nums" style={{ color: C.emHi }}>
            {formatNumber(manifest.readyCount)} / {formatNumber(manifest.sourceCount)}
          </p>
        </div>
        <div 
          className="rounded-lg border p-3" 
          style={{ 
            background: isMissing ? "rgba(251,191,36,0.05)" : "rgba(255,255,255,0.02)", 
            borderColor: isMissing ? "rgba(251,191,36,0.15)" : C.borderSub 
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isMissing ? C.amHi : C.t4 }}>Missing Outputs</span>
          <p className="mt-0.5 text-[18px] font-black tabular-nums" style={{ color: isMissing ? C.amHi : C.t3 }}>
            {formatNumber(manifest.missingCount)}
          </p>
        </div>
        <div className="rounded-lg border p-3" style={{ background: "rgba(34,211,238,0.05)", borderColor: "rgba(34,211,238,0.15)" }}>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.cyHi }}>Exported Rows</span>
          <p className="mt-0.5 text-[18px] font-black tabular-nums" style={{ color: C.cyHi }}>
            {formatNumber(manifest.exportedRows)}
          </p>
        </div>
        <div className="rounded-lg border p-3" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.t4 }}>Latest Export</span>
          <p className="mt-0.5 text-[14px] font-bold text-white truncate" title={manifest.exportedAt || "Freshness unknown"}>
            {formatExportTimestamp(manifest.exportedAt)}
          </p>
        </div>
      </div>

      {/* Safety Rules & Guardrails */}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
          <div className="flex items-center gap-2 text-[12px] font-bold text-white mb-3">
            <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.emHi }} />
            Safety Rules
          </div>
          {manifest.safeRules.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {safeVisible.map((rule) => (
                <span
                  key={rule}
                  className="rounded-md border px-2 py-0.5 text-[10px] font-bold"
                  style={{ color: C.emHi, background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.15)" }}
                >
                  {formatLabel(rule)}
                </span>
              ))}
              {safeExtra > 0 && (
                <span
                  className="rounded-md border px-2 py-0.5 text-[10px] font-bold"
                  style={{ color: C.t3, background: "rgba(255,255,255,0.05)", borderColor: C.borderSub }}
                >
                  +{safeExtra} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-[12px] font-medium" style={{ color: C.t4 }}>No explicit safety rules found.</p>
          )}
        </div>

        <div className="rounded-lg border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
          <div className="flex items-center gap-2 text-[12px] font-bold text-white mb-3">
            <AlertTriangle className="h-3.5 w-3.5" style={{ color: C.amHi }} />
            Protected Internal Tables
          </div>
          {manifest.blockedTables.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {blockedVisible.map((table) => (
                <span
                  key={table}
                  className="rounded-md border px-2 py-0.5 text-[10px] font-bold"
                  style={{ color: C.amHi, background: "rgba(251,191,36,0.06)", borderColor: "rgba(251,191,36,0.15)" }}
                >
                  {table}
                </span>
              ))}
              {blockedExtra > 0 && (
                <span
                  className="rounded-md border px-2 py-0.5 text-[10px] font-bold"
                  style={{ color: C.t3, background: "rgba(255,255,255,0.05)", borderColor: C.borderSub }}
                >
                  +{blockedExtra} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-[12px] font-medium" style={{ color: C.t4 }}>No protected internal tables listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function DataQualityPage({ country, data }: DataQualityPageProps) {
  const totalSources = data.manifests.reduce((sum, m) => sum + m.sourceCount, 0);
  const totalReady = data.manifests.reduce((sum, m) => sum + m.readyCount, 0);
  const totalMissing = data.manifests.reduce((sum, m) => sum + m.missingCount, 0);
  const readyManifests = data.manifests.filter((m) => m.status === "ready").length;
  const overallStatus = overallStatusLabel(data.status);
  const hasIssues = totalMissing > 0 || readyManifests !== data.manifests.length;

  // Empty state
  if (data.manifests.length === 0) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        <section
          className="relative rounded-[28px] border overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.9) 100%)",
            borderColor: "rgba(255,255,255,0.06)",
            boxShadow: "0 24px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <GridPattern />
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
                style={{ color: C.tlHi, background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)" }}
              >
                <Database className="h-3.5 w-3.5" />
                Data Quality
              </span>
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
                style={{ color: C.t4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Internal Admin
              </span>
            </div>

            <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
              No export-health data available
            </h1>

            <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
              This workspace has no publish-health snapshot available.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                href={`${country.routeBase}/market-intelligence`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(180deg, #2dd4bf 0%, #14b8a6 100%)",
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(20,184,166,0.25)",
                }}
              >
                Market Intelligence
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href={`${country.routeBase}/recon`}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
                style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                Opportunities
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section
        className="relative rounded-[28px] border overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(24,24,27,0.7) 0%, rgba(9,9,11,0.9) 100%)",
          borderColor: "rgba(255,255,255,0.06)",
          boxShadow: "0 24px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        <GridPattern />
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.tlHi, background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)" }}
            >
              <Database className="h-3.5 w-3.5" />
              Data Quality
            </span>
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-4 py-1.5 shadow-sm"
              style={{ color: C.t4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Internal Admin
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 drop-shadow-sm">
            Is This Workspace Ready to Publish?
          </h1>

          <p className="max-w-2xl text-[16px] sm:text-[18px] leading-[1.6] font-medium" style={{ color: C.t2 }}>
            Review frontend data coverage, export freshness, missing outputs, and safety guardrails before exposing this workspace to users.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                document.getElementById("quality-checks")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[14px] font-bold text-black transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(180deg, #2dd4bf 0%, #14b8a6 100%)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 24px rgba(20,184,166,0.25)",
              }}
            >
              Review Health
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <Link
              href={`${country.routeBase}/market-intelligence`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Market Intelligence
            </Link>

            <Link
              href={`${country.routeBase}/activity-feed`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Recent Market Movement
            </Link>

            <Link
              href={`${country.routeBase}/recon`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold transition-all hover:bg-white/[0.08]"
              style={{ color: C.t1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Status Overview Cards ────────────────────────────────────── */}
      <section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            title="Publish Status"
            value={`${readyManifests}/${data.manifests.length}`}
            description={overallStatus.label}
            icon={<FileCheck className="h-5 w-5" />}
            accentColor={readyManifests === data.manifests.length ? C.emHi : C.amHi}
          />
          <SnapshotCard
            title="Export Manifests"
            value={formatNumber(data.manifests.length)}
            description="Frontend export manifests loaded."
            icon={<Database className="h-5 w-5" />}
            accentColor={C.cyHi}
          />
          <SnapshotCard
            title="Ready Outputs"
            value={`${formatNumber(totalReady)}/${formatNumber(totalSources)}`}
            description="Expected frontend outputs available."
            icon={<Layers className="h-5 w-5" />}
            accentColor={C.emHi}
          />
          <SnapshotCard
            title="Missing Outputs"
            value={formatNumber(totalMissing)}
            description={totalMissing > 0 ? "Outputs marked missing or unavailable." : "No missing outputs detected."}
            icon={<AlertTriangle className="h-5 w-5" />}
            accentColor={totalMissing > 0 ? C.rdHi : C.tlHi}
          />
        </div>
      </section>

      {/* ── 3. Workspace Health Summary ─────────────────────────────────── */}
      <section id="quality-checks" className="scroll-mt-10 space-y-4">
        <div className="mb-5 flex items-center gap-3 px-1 pt-2">
          <ShieldCheck className="h-5 w-5" style={{ color: C.t3 }} />
          <h2 className="text-[14px] font-bold uppercase tracking-[0.15em] text-white">
            Workspace Health Summary
          </h2>
        </div>

        <div className="space-y-4">
          {data.manifests.map((manifest) => (
            <HealthSummaryCard key={manifest.key} manifest={manifest} />
          ))}
        </div>
      </section>

      {/* ── 4. Attention Required ───────────────────────────────────────── */}
      <section className="space-y-4 pt-4">
        {hasIssues ? (
          <AdminPanel
            title="Attention Required"
            purpose="The following manifests are missing expected outputs or encountered errors. Review the missing keys below."
            icon={<AlertTriangle className="h-5 w-5" />}
            accentColor={C.rdHi}
          >
            <div className="space-y-3">
              {data.manifests
                .filter((m) => m.missingCount > 0 || m.status !== "ready")
                .map((m) => {
                  const missingKeys = m.outputs.filter((o) => o.exists === false).slice(0, 6).map(o => o.key);
                  return (
                    <div key={m.key} className="rounded-lg border p-4" style={{ background: "rgba(244,63,94,0.03)", borderColor: "rgba(244,63,94,0.12)" }}>
                      <h4 className="text-[14px] font-bold text-white mb-2">{m.label}</h4>
                      {missingKeys.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {missingKeys.map(k => (
                            <span key={k} className="rounded-md border px-2 py-0.5 text-[10px] font-bold" style={{ color: C.rdHi, background: "rgba(244,63,94,0.08)", borderColor: "rgba(244,63,94,0.2)" }}>
                              {formatLabel(k)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] font-medium" style={{ color: C.t4 }}>
                          Manifest status: {m.status}. {m.message}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </AdminPanel>
        ) : (
          <AdminPanel
            title="Frontend Exports Ready"
            purpose="All required frontend export manifests are present. Verify the latest pipeline run before production launch."
            icon={<CheckCircle2 className="h-5 w-5" />}
            accentColor={C.emHi}
          />
        )}
      </section>

      {/* ── 5. Frontend Safety Guardrails ───────────────────────────────── */}
      <section className="pt-4">
        <AdminPanel
          title="Frontend Safety Guardrails"
          purpose="Enforced constraints ensuring safe, compliant data exposure."
          icon={<ShieldCheck className="h-5 w-5" />}
          accentColor={C.tlHi}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.tlHi }} />
              <span className="text-[13px] font-medium" style={{ color: C.t2 }}>User-facing pages use dashboard-ready JSON only</span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.tlHi }} />
              <span className="text-[13px] font-medium" style={{ color: C.t2 }}>Raw/internal tables are blocked from UI</span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.tlHi }} />
              <span className="text-[13px] font-medium" style={{ color: C.t2 }}>Publish checks are advisory</span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: C.borderSub }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.tlHi }} />
              <span className="text-[13px] font-medium" style={{ color: C.t2 }}>Verify latest pipeline run before launch</span>
            </div>
          </div>
        </AdminPanel>
      </section>

      {/* ── 6. Trust Strip ──────────────────────────────────────────────── */}
      <section className="pt-4">
        <div
          className="flex flex-col sm:flex-row flex-wrap sm:items-center justify-between gap-4 rounded-[16px] border px-6 py-4 shadow-sm"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: C.borderSub,
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <Database className="h-3.5 w-3.5 opacity-70" style={{ color: C.t3 }} />
              Internal admin workspace
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t1 }}>
              <CheckCircle2 className="h-4 w-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ color: C.emHi }} />
              Publish checks are advisory
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide" style={{ color: C.t2 }}>
              <Globe2 className="h-3.5 w-3.5 opacity-70" style={{ color: C.t3 }} />
              Verify latest pipeline run before launch
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[12px] font-bold tracking-wide" style={{ color: C.t3 }}>
            <span className="uppercase tracking-widest text-[9px] text-zinc-300 bg-white/5 border border-white/10 px-2 py-1 rounded-md shadow-inner">
              {country.currency}
            </span>
            {country.label} Data Quality
          </div>
        </div>
      </section>
    </div>
  );
}