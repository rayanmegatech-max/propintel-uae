-- =============================================================================
-- RASAD — GCC Real Estate Intelligence
-- Phase 6A: Auth, Entitlements, and Subscription Schema
--
-- This migration adds the foundational tables for user access control,
-- subscription tracking, and country entitlements.
--
-- Included:
--   - public.user_profiles
--   - public.user_subscriptions
--   - public.user_entitlements
--   - public.subscription_events
--   - RLS self-read policies
--
-- Excluded:
--   - Anonymous read access
--   - User-mutation policies for sensitive fields
--   - Dashboard delivery table modifications
-- =============================================================================

-- =============================================================================
-- Helper Function: Auto-update updated_at timestamp
-- =============================================================================

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =============================================================================
-- TABLE 1: public.user_profiles
-- Links Supabase Auth user ID to RASAD app profile and role.
-- =============================================================================

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'inactive'
    check (role in ('admin', 'subscriber', 'trial', 'inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists user_profiles_role_idx
on public.user_profiles (role);

drop trigger if exists update_user_profiles_updated_at on public.user_profiles;

create trigger update_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.update_updated_at_column();

alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;

create policy "Users can read own profile"
on public.user_profiles
for select
to authenticated
using (auth.uid() = id);

-- =============================================================================
-- TABLE 2: public.user_subscriptions
-- Stores subscription state, tier, and billing external IDs.
-- =============================================================================

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'opportunities', 'market_command', 'gcc', 'admin')),
  status text not null default 'inactive'
    check (status in ('active', 'trialing', 'inactive', 'past_due', 'cancelled')),
  trial_expires_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists user_subscriptions_user_id_idx
on public.user_subscriptions (user_id);

create index if not exists user_subscriptions_status_idx
on public.user_subscriptions (status);

create index if not exists user_subscriptions_tier_idx
on public.user_subscriptions (subscription_tier);

drop trigger if exists update_user_subscriptions_updated_at on public.user_subscriptions;

create trigger update_user_subscriptions_updated_at
before update on public.user_subscriptions
for each row
execute function public.update_updated_at_column();

alter table public.user_subscriptions enable row level security;

drop policy if exists "Users can read own subscriptions" on public.user_subscriptions;

create policy "Users can read own subscriptions"
on public.user_subscriptions
for select
to authenticated
using (auth.uid() = user_id);

-- =============================================================================
-- TABLE 3: public.user_entitlements
-- Granular access control for regional dashboard access.
-- =============================================================================

create table if not exists public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country text not null check (country in ('uae', 'ksa', 'gcc')),
  is_active boolean not null default true,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Prevent duplicate active country rows for the same user.
create unique index if not exists user_entitlements_active_unique_idx
on public.user_entitlements (user_id, country)
where (is_active = true);

create index if not exists user_entitlements_user_id_idx
on public.user_entitlements (user_id);

create index if not exists user_entitlements_country_idx
on public.user_entitlements (country);

create index if not exists user_entitlements_active_lookup_idx
on public.user_entitlements (user_id, country, is_active);

drop trigger if exists update_user_entitlements_updated_at on public.user_entitlements;

create trigger update_user_entitlements_updated_at
before update on public.user_entitlements
for each row
execute function public.update_updated_at_column();

alter table public.user_entitlements enable row level security;

drop policy if exists "Users can read own entitlements" on public.user_entitlements;

create policy "Users can read own entitlements"
on public.user_entitlements
for select
to authenticated
using (auth.uid() = user_id);

-- =============================================================================
-- TABLE 4: public.subscription_events
-- Secure audit trail for billing and access-control state changes.
-- =============================================================================

create table if not exists public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  event_source text not null default 'manual'
    check (event_source in ('manual', 'stripe', 'system')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists subscription_events_user_id_idx
on public.subscription_events (user_id);

create index if not exists subscription_events_created_at_idx
on public.subscription_events (created_at desc);

alter table public.subscription_events enable row level security;

-- No subscriber read policy is provided by design.
-- Only admin/server-side/service-role paths should access this audit log.
