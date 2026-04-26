# Auth, Dynamic Checkout & DB Cart — Design Spec
**Date:** 2026-04-26  
**Project:** Bisāṭim (bisat-next)  
**Status:** Approved

---

## Overview

Replace the fully static storefront with a real authenticated experience. Customers must sign in (email/password or Google OAuth) before reaching checkout. Cart items are persisted to the database per user. Orders are saved on checkout submission. The Account page shows real data.

---

## Architecture

### Auth Provider
**Supabase Auth** — already installed (`@supabase/supabase-js ^2.100`). Add `@supabase/ssr` for server-side session support (middleware + server components). A new `AuthContext` wraps the app and exposes `user`, `session`, `loading`, and `signOut` to all client components.

### Session Strategy
- **Server:** `@supabase/ssr` `createServerClient` reads session from cookies in middleware and server components.
- **Client:** `AuthContext` subscribes to `supabase.auth.onAuthStateChange` so components react in real-time.
- **Middleware:** `src/middleware.ts` — refreshes the session cookie on every request. No route-blocking in middleware (blocking happens at the component level for flexibility).

---

## Auth Flow

1. Customer clicks **"Proceed to Checkout"** in the Cart.
2. If no session → **`AuthModal`** opens as a full-screen overlay (cart state is preserved in context).
3. Modal has two tabs: **Sign In** and **Register**, each with:
   - **"Continue with Google"** button (prominent, at the top)
   - Email + Password fields below
4. On success (any method) → modal closes, checkout resumes automatically.
5. If already signed in → goes straight to checkout, no interruption.
6. On register, a `profiles` row is created automatically via a Supabase database trigger.

---

## Database Schema

### `profiles` table
Created automatically on first sign-in via a `AFTER INSERT ON auth.users` trigger.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | = `auth.users.id`, primary key |
| `full_name` | `text` | from Google display name or registration form |
| `phone` | `text` | nullable, editable in Account settings |
| `avatar_url` | `text` | from Google picture or null |
| `created_at` | `timestamptz` | default `now()` |

### `carts` table
One row per user. Items stored as a JSONB array.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | primary key |
| `user_id` | `uuid` | FK → `auth.users.id`, unique |
| `items` | `jsonb` | array of `{ id, name, price, quantity, images, ... }` |
| `updated_at` | `timestamptz` | updated on every change |

### `orders` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | primary key, default `gen_random_uuid()` |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `items` | `jsonb` | snapshot of cart at time of order |
| `shipping_address` | `jsonb` | `{ firstName, lastName, address, city, country, ... }` |
| `total` | `numeric` | total in USD |
| `status` | `text` | `'processing'` | `'shipped'` | `'delivered'` |
| `created_at` | `timestamptz` | default `now()` |

**Row Level Security (RLS):**
- `profiles`: users can read/update their own row only.
- `carts`: users can read/update their own row only.
- `orders`: users can read their own rows; insert allowed; no update/delete from client.

---

## Cart Persistence (DB Sync)

### Behavior
- **On login:** fetch the saved cart from `carts` table. If the user had local items (added before logging in), merge them — local items take precedence for quantity conflicts.
- **On every cart change** (add, remove, update quantity): debounced upsert to `carts` table (300ms debounce to avoid hammering on rapid quantity changes).
- **On logout:** clear local cart state (DB cart remains saved for next login).
- **Unauthenticated users:** cart stays in `localStorage` exactly as today — no change to current behavior.

### CartContext changes
- Add `syncCart(user_id)` — loads DB cart and merges with local on login.
- Add `persistCart(items, user_id)` — debounced upsert called after every mutation.
- `AuthContext` calls `syncCart` on session change.

---

## Components & Files

| File | Action | Purpose |
|---|---|---|
| `src/lib/supabase-browser.ts` | **New** | Browser-side Supabase client using `@supabase/ssr` `createBrowserClient` |
| `src/lib/supabase-server.ts` | **New** | Server-side Supabase client for server components |
| `src/middleware.ts` | **New** | Session cookie refresh on every request |
| `src/context/AuthContext.tsx` | **New** | Global user/session state, `signOut`, Google sign-in helper |
| `src/components/AuthModal.tsx` | **New** | Sign In / Register modal with Google OAuth + email/password tabs |
| `src/app/auth/callback/route.ts` | **New** | OAuth callback route — exchanges code for session |
| `src/context/CartContext.tsx` | **Modify** | Add DB sync (load on login, debounced upsert on change) |
| `src/app/providers.tsx` | **Modify** | Wrap with `AuthProvider` |
| `src/views/Cart.tsx` | **Modify** | "Proceed to Checkout" opens `AuthModal` if no session |
| `src/views/Checkout.tsx` | **Modify** | Gate at top: redirect if no session. Pre-fill name/email from profile. Save order to DB on submit. |
| `src/views/Account.tsx` | **Modify** | Replace all dummy data with real session user + real orders from DB |
| `.env.example` | **Modify** | Add `NEXT_PUBLIC_SITE_URL` note for OAuth redirect |

---

## AuthModal Design

- Full-screen dark overlay, centered white card
- Two tabs: **Sign In** | **Create Account**
- Top of both tabs: `Continue with Google` button (black, Google icon)
- Divider: `— or —`
- Email + password fields
- Register tab adds: Full Name field
- Error states shown inline under the relevant field
- Loading spinner on the button during auth
- ESC key closes modal (and blocks checkout — user must auth)

---

## Account Page (Real Data)

Replace all `DUMMY_*` constants with live Supabase queries:
- **Name/avatar:** from `profiles` table (or `user.user_metadata` for Google users)
- **Orders:** `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`
- **Settings tab:** form saves back to `profiles` table
- **Sign out button** added to sidebar

---

## Checkout Changes

1. **Gate:** if `!user` → open `AuthModal`. Checkout form is not rendered until authenticated.
2. **Pre-fill:** populate `firstName`, `lastName`, `email` from `user.user_metadata` / `profiles` on mount.
3. **On submit:** insert row into `orders` table, then call `clearCart()` (which also clears DB cart), then navigate to `/order-confirmation`.

---

## Migration SQL

To be run once in Supabase SQL editor:

```sql
-- profiles
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Own profile" on profiles for all using (auth.uid() = id);

-- trigger: auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- carts
create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users on delete cascade,
  items jsonb default '[]',
  updated_at timestamptz default now()
);
alter table carts enable row level security;
create policy "Own cart" on carts for all using (auth.uid() = user_id);

-- orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  items jsonb not null,
  shipping_address jsonb not null,
  total numeric not null,
  status text not null default 'processing',
  created_at timestamptz default now()
);
alter table orders enable row level security;
create policy "Own orders read" on orders for select using (auth.uid() = user_id);
create policy "Own orders insert" on orders for insert with check (auth.uid() = user_id);
```

---

## Supabase Dashboard Config

Before running the app, the following must be set in the Supabase project dashboard:

1. **Google OAuth:** Authentication → Providers → Google → enable, add Client ID + Secret from Google Cloud Console
2. **Redirect URLs:** Authentication → URL Configuration → add `http://localhost:3000/auth/callback` (dev) and `https://bisat-store.com/auth/callback` (prod)
3. **Site URL:** set to `https://bisat-store.com`

---

## Out of Scope

- Password reset / "forgot password" flow (can be added later)
- Email verification enforcement (Supabase sends by default; we won't block the UI on it)
- Admin order management UI
- Stripe / real payment processing (checkout form stays as-is, order row captures intent)
