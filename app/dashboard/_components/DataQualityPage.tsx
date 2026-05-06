import {
  BadgeCheck,
  CheckCircle2,
  Database,
  FileJson,
  ShieldCheck,
  Table2,
  TriangleAlert,
} from "lucide-react";
import ReconMetricCard from "./ReconMetricCard";
import { formatNumber } from "@/lib/recon/formatters";
import type { CountryConfig } from "@/lib/countries/countryConfig";
import type {
  ExportHealthDataResult,
  ExportHealthManifest,
} from "@/lib/data/exportHealth";
import type { ReconMetric } from "@/lib/recon/types";

type DataQualityPageProps = {
  country: CountryConfig;
  data: ExportHealthDataResult;
};

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusTone(status: ExportHealthManifest["status"]) {
  if (status === "ready") return "text-emerald-200 bg-emerald-400/10 border-emerald-400/20";
  if (status === "missing") return "text-amber-200 bg-amber-400/10 border-amber-400/20";
  return "text-red-200 bg-red-400/10 border-red-400/20";
}

function ManifestCard({ manifest }: { manifest: ExportHealthManifest }) {
  const topOutputs = manifest.outputs.slice(0, 10);

  return (
    <article className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div
            className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${statusTone(
              manifest.status
            )}`}
          >
            {manifest.status === "ready" ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <TriangleAlert className="h-3.5 w-3.5" />
            )}
            {manifest.status}
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            {manifest.label}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {manifest.message}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-950/45 p-3 text-xs text-slate-400 sm:min-w-64">
          <div className="mb-2 font-bold text-white">Manifest path</div>
          <code className="break-all text-[11px] text-slate-400">
            {manifest.path}
          </code>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.08] bg-slate-950/35 p-3">
          <div className="text-xs text-slate-500">Sources</div>
          <div className="mt-1 text-2xl font-black text-white">
            {formatNumber(manifest.sourceCount)}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-3">
          <div className="text-xs text-emerald-100/70">Ready</div>
          <div className="mt-1 text-2xl font-black text-emerald-100">
            {formatNumber(manifest.readyCount)}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-3">
          <div className="text-xs text-amber-100/70">Missing</div>
          <div className="mt-1 text-2xl font-black text-amber-100">
            {formatNumber(manifest.missingCount)}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-3">
          <div className="text-xs text-cyan-100/70">Exported rows</div>
          <div className="mt-1 text-2xl font-black text-cyan-100">
            {formatNumber(manifest.exportedRows)}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-slate-950/35 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Frontend safety
          </div>

          {manifest.safeRules.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {manifest.safeRules.slice(0, 8).map((rule) => (
                <span
                  key={rule}
                  className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1 text-xs text-emerald-100"
                >
                  {formatLabel(rule)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-500">
              No explicit frontend safety rules were found in this manifest.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-950/35 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
            <TriangleAlert className="h-4 w-4 text-amber-300" />
            Internal-only table guardrail
          </div>

          {manifest.blockedTables.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {manifest.blockedTables.slice(0, 10).map((table) => (
                <span
                  key={table}
                  className="rounded-full border border-amber-400/15 bg-amber-400/[0.06] px-3 py-1 text-xs text-amber-100"
                >
                  {table}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-500">
              No internal-only table list was found in this manifest.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.08] bg-slate-950/35 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
          <Table2 className="h-4 w-4 text-cyan-300" />
          Export outputs
        </div>

        {topOutputs.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className="grid grid-cols-[1.1fr_1.3fr_0.6fr_0.6fr] gap-3 border-b border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              <div>Key</div>
              <div>Table / output</div>
              <div>Total</div>
              <div>Exported</div>
            </div>

            {topOutputs.map((output) => (
              <div
                key={output.key}
                className="grid grid-cols-[1.1fr_1.3fr_0.6fr_0.6fr] gap-3 border-b border-white/[0.06] px-3 py-2 text-xs text-slate-400 last:border-b-0"
              >
                <div className="font-semibold text-slate-200">
                  {formatLabel(output.key)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-slate-300">
                    {output.table ?? "No table in manifest"}
                  </div>
                  {output.output ? (
                    <div className="truncate text-[11px] text-slate-600">
                      {output.output}
                    </div>
                  ) : null}
                </div>
                <div>{formatNumber(output.totalRowsAvailable ?? 0)}</div>
                <div>{formatNumber(output.exportedRows ?? 0)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            No export outputs were discovered in this manifest.
          </p>
        )}
      </div>
    </article>
  );
}

export default function DataQualityPage({ country, data }: DataQualityPageProps) {
  const totalSources = data.manifests.reduce(
    (sum, manifest) => sum + manifest.sourceCount,
    0
  );

  const totalExportedRows = data.manifests.reduce(
    (sum, manifest) => sum + manifest.exportedRows,
    0
  );

  const totalMissing = data.manifests.reduce(
    (sum, manifest) => sum + manifest.missingCount,
    0
  );

  const readyManifests = data.manifests.filter(
    (manifest) => manifest.status === "ready"
  ).length;

  const metrics: ReconMetric[] = [
    {
      label: "Manifests ready",
      value: `${readyManifests}/${data.manifests.length}`,
      description: "Frontend export manifest files loaded successfully.",
      tone: readyManifests === data.manifests.length ? "emerald" : "amber",
    },
    {
      label: "Export sources",
      value: formatNumber(totalSources),
      description: "Export groups discovered across Recon and Module 5 manifests.",
      tone: "cyan",
    },
    {
      label: "Exported rows",
      value: formatNumber(totalExportedRows),
      description: "Total frontend JSON rows reported by manifests.",
      tone: "teal",
    },
    {
      label: "Missing sources",
      value: formatNumber(totalMissing),
      description: "Manifest outputs marked missing or unavailable.",
      tone: totalMissing > 0 ? "red" : "slate",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_34%),rgba(255,255,255,0.04)] shadow-[0_24px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/35 to-transparent" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_390px]">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-teal-200">
                <FileJson className="h-3.5 w-3.5" />
                {country.label} Data Quality
              </span>

              <span className="rounded-full border border-white/[0.08] bg-slate-950/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Frontend export health
              </span>
            </div>

            <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Export Health & Product Safety
            </h1>

            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
              Internal dashboard-safe export health view for {country.label}.
              This page reads only frontend manifest JSON files. It does not
              expose raw evidence tables, raw price-history events, raw engine
              tables, Supabase state, auth state, billing, or payment logic.
            </p>
          </div>

          <aside className="rounded-[1.7rem] border border-teal-400/20 bg-teal-400/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-teal-50">
                  Manifest-only inspection
                </h2>
                <p className="mt-2 text-sm leading-6 text-teal-100/75">
                  This page summarizes export readiness from product-safe JSON
                  manifests. It is designed for internal QA and launch checks.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                `Country: ${country.label}`,
                `Status: ${data.status}`,
                `Manifest count: ${data.manifests.length.toLocaleString("en-US")}`,
                `Export groups: ${totalSources.toLocaleString("en-US")}`,
                `Missing outputs: ${totalMissing.toLocaleString("en-US")}`,
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-slate-950/35 px-3 py-2 text-xs leading-5 text-teal-50/90"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <ReconMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Frontend-ready only
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This page validates the JSON files that the frontend can safely
            consume. It does not inspect SQLite directly.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Raw tables protected
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Internal price-event, evidence, and raw engine tables remain outside
            the user-facing product layer.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <TriangleAlert className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Launch QA helper
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Use this page after local export runs to confirm the frontend has
            Recon and Module 5 data available for both countries.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {data.manifests.map((manifest) => (
          <ManifestCard key={manifest.key} manifest={manifest} />
        ))}
      </section>
    </div>
  );
}