import type { ReconCurrency } from "./types";

export function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function asString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function asBooleanSignal(value: unknown): boolean {
  return value === 1 || value === true || value === "1" || value === "true";
}

export function labelize(value: string | null | undefined): string {
  if (!value) {
    return "Unknown";
  }

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCurrency(
  value: number | null | undefined,
  currency: ReconCurrency
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Price unavailable";
  }

  if (value >= 1_000_000) {
    return `${currency} ${(value / 1_000_000).toFixed(
      value >= 10_000_000 ? 0 : 2
    )}M`;
  }

  return `${currency} ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatPercent(value: number | null | undefined): string | null {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  return `${value.toFixed(1)}%`;
}

export function safeStringFromAny(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}