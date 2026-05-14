import "server-only";

const SUPABASE_CACHE_TTL_MS = 60_000;

type SupabaseCacheEntry = {
  expiresAt: number;
  rows: unknown[];
};

const supabaseRowsCache = new Map<string, SupabaseCacheEntry>();
const supabaseRowsInFlight = new Map<string, Promise<unknown[] | null>>();

function getSupabaseConfig(): { url: string; serviceRoleKey: string } | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

function getCacheKey(table: string, params: URLSearchParams): string {
  return `${table}?${params.toString()}`;
}

function getCachedRows(cacheKey: string): unknown[] | null {
  const entry = supabaseRowsCache.get(cacheKey);

  if (!entry) {
    return null;
  }

  if (Date.now() >= entry.expiresAt) {
    supabaseRowsCache.delete(cacheKey);
    return null;
  }

  return entry.rows;
}

function setCachedRows(cacheKey: string, rows: unknown[]): void {
  supabaseRowsCache.set(cacheKey, {
    expiresAt: Date.now() + SUPABASE_CACHE_TTL_MS,
    rows,
  });
}

export function isSupabaseServerConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export async function fetchSupabaseRows<T>(
  table: string,
  params: URLSearchParams
): Promise<T[] | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const cacheKey = getCacheKey(table, params);
  const cachedRows = getCachedRows(cacheKey);

  if (cachedRows) {
    return cachedRows as T[];
  }

  const inFlightRows = supabaseRowsInFlight.get(cacheKey);

  if (inFlightRows) {
    return (await inFlightRows) as T[] | null;
  }

  const requestPromise = (async (): Promise<unknown[] | null> => {
    try {
      const response = await fetch(
        `${config.url}/rest/v1/${table}?${params.toString()}`,
        {
          headers: {
            apikey: config.serviceRoleKey,
            Authorization: `Bearer ${config.serviceRoleKey}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return null;
      }

      const json = await response.json();

      if (!Array.isArray(json)) {
        return null;
      }

      setCachedRows(cacheKey, json);
      return json;
    } catch {
      return null;
    }
  })();

  supabaseRowsInFlight.set(cacheKey, requestPromise);

  try {
    return (await requestPromise) as T[] | null;
  } finally {
    supabaseRowsInFlight.delete(cacheKey);
  }
}
