import { promises as fs } from "fs";
import path from "path";
import type { CountrySlug } from "@/lib/countries/countryConfig";

type UnknownRecord = Record<string, unknown>;

export type ExportHealthManifestStatus = "ready" | "missing" | "error";

export type ExportHealthManifest = {
  key: "recon" | "module5";
  label: string;
  status: ExportHealthManifestStatus;
  path: string;
  message: string;
  exportedAt: string | null;
  exportName: string | null;
  country: string | null;
  sourceCount: number;
  readyCount: number;
  missingCount: number;
  totalRowsAvailable: number;
  exportedRows: number;
  safeRules: string[];
  blockedTables: string[];
  outputs: Array<{
    key: string;
    output: string | null;
    table: string | null;
    exists: boolean | null;
    totalRowsAvailable: number | null;
    exportedRows: number | null;
  }>;
};

export type ExportHealthDataResult = {
  status: "ready" | "partial" | "error";
  message: string;
  country: CountrySlug;
  manifests: ExportHealthManifest[];
};

const MANIFESTS: Record<
  CountrySlug,
  Array<{
    key: "recon" | "module5";
    label: string;
    filePath: string;
  }>
> = {
  uae: [
    {
      key: "recon",
      label: "Recon Hub frontend export",
      filePath: path.join(
        process.cwd(),
        "exports",
        "frontend",
        "uae",
        "recon_manifest.json"
      ),
    },
    {
      key: "module5",
      label: "Module 5 frontend export",
      filePath: path.join(
        process.cwd(),
        "exports",
        "frontend",
        "uae",
        "module5_manifest.json"
      ),
    },
  ],
  ksa: [
    {
      key: "recon",
      label: "Recon Hub frontend export",
      filePath: path.join(
        process.cwd(),
        "exports",
        "frontend",
        "ksa",
        "recon_manifest.json"
      ),
    },
    {
      key: "module5",
      label: "Module 5 frontend export",
      filePath: path.join(
        process.cwd(),
        "exports",
        "frontend",
        "ksa",
        "module5_manifest.json"
      ),
    },
  ],
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  return null;
}

function extractSafeRules(value: unknown): string[] {
  if (!isRecord(value)) return [];

  return Object.entries(value)
    .filter(([, ruleValue]) => ruleValue === true)
    .map(([ruleKey]) =>
      ruleKey
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    );
}

function extractBlockedTables(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => asString(item))
    .filter((item): item is string => item !== null);
}

function extractOutputs(manifest: UnknownRecord): ExportHealthManifest["outputs"] {
  const exportsRecord = isRecord(manifest.exports) ? manifest.exports : null;

  if (exportsRecord) {
    return Object.entries(exportsRecord).map(([key, rawValue]) => {
      const value = isRecord(rawValue) ? rawValue : {};

      return {
        key,
        output: asString(value.output),
        table: asString(value.table) ?? asString(value.source_table),
        exists: asBoolean(value.exists),
        totalRowsAvailable:
          asNumber(value.total_rows_available) ??
          asNumber(value.totalRowsAvailable),
        exportedRows:
          asNumber(value.exported_rows) ?? asNumber(value.exportedRows),
      };
    });
  }

  const outputsRecord = isRecord(manifest.outputs) ? manifest.outputs : null;

  if (outputsRecord) {
    return Object.entries(outputsRecord).map(([key, rawValue]) => ({
      key,
      output: asString(rawValue),
      table: null,
      exists: null,
      totalRowsAvailable: null,
      exportedRows: null,
    }));
  }

  return [];
}

function summarizeManifest(
  key: "recon" | "module5",
  label: string,
  filePath: string,
  manifest: UnknownRecord
): ExportHealthManifest {
  const outputs = extractOutputs(manifest);

  const readyCount = outputs.filter((item) => item.exists !== false).length;
  const missingCount = outputs.filter((item) => item.exists === false).length;

  const totalRowsAvailable = outputs.reduce(
    (sum, item) => sum + (item.totalRowsAvailable ?? 0),
    0
  );

  const exportedRows = outputs.reduce(
    (sum, item) => sum + (item.exportedRows ?? 0),
    0
  );

  return {
    key,
    label,
    status: "ready",
    path: path.relative(process.cwd(), filePath),
    message: "Manifest loaded successfully.",
    exportedAt:
      asString(manifest.exported_at) ??
      asString(manifest.generated_at) ??
      asString(manifest.built_at),
    exportName:
      asString(manifest.export_name) ??
      asString(manifest.name) ??
      asString(manifest.exportKey),
    country: asString(manifest.country),
    sourceCount: outputs.length,
    readyCount,
    missingCount,
    totalRowsAvailable,
    exportedRows,
    safeRules: extractSafeRules(manifest.frontend_rules),
    blockedTables: extractBlockedTables(manifest.do_not_expose_directly),
    outputs,
  };
}

async function readManifest(
  key: "recon" | "module5",
  label: string,
  filePath: string
): Promise<ExportHealthManifest> {
  const relativePath = path.relative(process.cwd(), filePath);

  if (!(await fileExists(filePath))) {
    return {
      key,
      label,
      status: "missing",
      path: relativePath,
      message: "Manifest file is missing.",
      exportedAt: null,
      exportName: null,
      country: null,
      sourceCount: 0,
      readyCount: 0,
      missingCount: 1,
      totalRowsAvailable: 0,
      exportedRows: 0,
      safeRules: [],
      blockedTables: [],
      outputs: [],
    };
  }

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;

    if (!isRecord(parsed)) {
      throw new Error("Manifest JSON root is not an object.");
    }

    return summarizeManifest(key, label, filePath, parsed);
  } catch (error) {
    return {
      key,
      label,
      status: "error",
      path: relativePath,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error while reading manifest.",
      exportedAt: null,
      exportName: null,
      country: null,
      sourceCount: 0,
      readyCount: 0,
      missingCount: 1,
      totalRowsAvailable: 0,
      exportedRows: 0,
      safeRules: [],
      blockedTables: [],
      outputs: [],
    };
  }
}

export async function getExportHealthData(
  country: CountrySlug
): Promise<ExportHealthDataResult> {
  const configs = MANIFESTS[country];

  const manifests = await Promise.all(
    configs.map((config) =>
      readManifest(config.key, config.label, config.filePath)
    )
  );

  const hasError = manifests.some((manifest) => manifest.status === "error");
  const hasMissing = manifests.some((manifest) => manifest.status === "missing");

  return {
    status: hasError ? "error" : hasMissing ? "partial" : "ready",
    message: hasError
      ? "One or more frontend export manifests could not be read."
      : hasMissing
        ? "One or more frontend export manifests are missing."
        : "Frontend export manifests loaded successfully.",
    country,
    manifests,
  };
}