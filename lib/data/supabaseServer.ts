import "server-only";

function getSupabaseConfig(): { url: string; serviceRoleKey: string } | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
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

    return json as T[];
  } catch {
    return null;
  }
}
