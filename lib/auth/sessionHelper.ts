import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "subscriber" | "trial" | "inactive";

export type SubscriptionTier =
  | "free"
  | "opportunities"
  | "market_command"
  | "gcc"
  | "admin";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "inactive"
  | "past_due"
  | "cancelled";

export type CountryEntitlement = "uae" | "ksa" | "gcc";

export type UserAccess = {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: AppRole;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  trialExpiresAt: string | null;
  countries: CountryEntitlement[];
};

export const anonymousAccess: UserAccess = {
  isAuthenticated: false,
  userId: null,
  email: null,
  role: "inactive",
  subscriptionTier: "free",
  subscriptionStatus: "inactive",
  trialExpiresAt: null,
  countries: [],
};

const VALID_ROLES = new Set<AppRole>([
  "admin",
  "subscriber",
  "trial",
  "inactive",
]);

const VALID_TIERS = new Set<SubscriptionTier>([
  "free",
  "opportunities",
  "market_command",
  "gcc",
  "admin",
]);

const VALID_STATUSES = new Set<SubscriptionStatus>([
  "active",
  "trialing",
  "inactive",
  "past_due",
  "cancelled",
]);

const VALID_COUNTRIES = new Set<CountryEntitlement>(["uae", "ksa", "gcc"]);

function normalizeRole(value: unknown): AppRole {
  return typeof value === "string" && VALID_ROLES.has(value as AppRole)
    ? (value as AppRole)
    : "inactive";
}

function normalizeTier(value: unknown): SubscriptionTier {
  return typeof value === "string" && VALID_TIERS.has(value as SubscriptionTier)
    ? (value as SubscriptionTier)
    : "free";
}

function normalizeStatus(value: unknown): SubscriptionStatus {
  return typeof value === "string" &&
    VALID_STATUSES.has(value as SubscriptionStatus)
    ? (value as SubscriptionStatus)
    : "inactive";
}

function normalizeCountry(value: unknown): CountryEntitlement | null {
  return typeof value === "string" &&
    VALID_COUNTRIES.has(value as CountryEntitlement)
    ? (value as CountryEntitlement)
    : null;
}

function failClosedAuthenticatedAccess(userId: string, email: string | null): UserAccess {
  return {
    ...anonymousAccess,
    isAuthenticated: true,
    userId,
    email,
  };
}

export async function getCurrentUserAccess(): Promise<UserAccess> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return anonymousAccess;
  }

  const userId = user.id;
  const email = user.email ?? null;

  try {
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("role, email")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      return failClosedAuthenticatedAccess(userId, email);
    }

    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .select("subscription_tier, status, trial_expires_at")
      .eq("user_id", userId);

    if (subscriptionError) {
      return failClosedAuthenticatedAccess(userId, email);
    }

    const { data: entitlementData, error: entitlementError } = await supabase
      .from("user_entitlements")
      .select("country")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (entitlementError) {
      return failClosedAuthenticatedAccess(userId, email);
    }

    const activeSubscription =
      subscriptionData?.find((subscription) => subscription.status === "active") ??
      subscriptionData?.find((subscription) => subscription.status === "trialing") ??
      subscriptionData?.[0] ??
      null;

    const countries = Array.from(
      new Set(
        (entitlementData ?? [])
          .map((entitlement) => normalizeCountry(entitlement.country))
          .filter((country): country is CountryEntitlement => country !== null)
      )
    );

    return {
      isAuthenticated: true,
      userId,
      email: email || profileData?.email || null,
      role: normalizeRole(profileData?.role),
      subscriptionTier: normalizeTier(activeSubscription?.subscription_tier),
      subscriptionStatus: normalizeStatus(activeSubscription?.status),
      trialExpiresAt: activeSubscription?.trial_expires_at ?? null,
      countries,
    };
  } catch {
    return failClosedAuthenticatedAccess(userId, email);
  }
}