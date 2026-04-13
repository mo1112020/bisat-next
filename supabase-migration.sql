-- ─────────────────────────────────────────────────────────────────────────────
-- Bisāṭ — missing tables migration
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. categories
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  badge       text not null default '',
  image_url   text not null default '',
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Seed with the four standard categories
insert into public.categories (name, slug, badge, sort_order) values
  ('Handmade', 'handmade', 'Artisanal', 1),
  ('Vintage',  'vintage',  'Authentic', 2),
  ('Machine',  'machine',  'Modern',    3),
  ('Kilim',    'kilim',    'Heritage',  4)
on conflict (slug) do nothing;

-- Allow public read, restrict writes to authenticated (service role handles admin writes)
alter table public.categories enable row level security;
create policy "public read categories"
  on public.categories for select using (true);
create policy "service role all categories"
  on public.categories for all using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────────────────────

-- 2. room_types
create table if not exists public.room_types (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.room_types (name, sort_order) values
  ('Living Room', 1),
  ('Bedroom',     2),
  ('Dining Room', 3),
  ('Hallway',     4),
  ('Office',      5)
on conflict (name) do nothing;

alter table public.room_types enable row level security;
create policy "public read room_types"
  on public.room_types for select using (true);
create policy "service role all room_types"
  on public.room_types for all using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────────────────────

-- 3. size_categories
create table if not exists public.size_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.size_categories (name, sort_order) values
  ('Small',  1),
  ('Medium', 2),
  ('Large',  3),
  ('Runner', 4)
on conflict (name) do nothing;

alter table public.size_categories enable row level security;
create policy "public read size_categories"
  on public.size_categories for select using (true);
create policy "service role all size_categories"
  on public.size_categories for all using (auth.role() = 'service_role');
