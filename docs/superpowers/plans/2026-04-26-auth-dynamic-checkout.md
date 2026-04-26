# Auth, Dynamic Checkout & DB Cart — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase Auth (email/password + Google OAuth) with a checkout gate modal, DB-synced cart, real orders saved on checkout, and a live Account page.

**Architecture:** Supabase Auth handles sessions via `@supabase/ssr` cookies. An `AuthContext` broadcasts user state. `CartContext` subscribes to auth state independently and syncs to a `carts` table. Checkout requires login; orders are inserted into an `orders` table on submit.

**Tech Stack:** Next.js 16, Supabase JS v2, `@supabase/ssr`, Motion (framer), TypeScript, Tailwind CSS

---

## Pre-flight: Run Migration SQL

Before any code changes, run this SQL in the **Supabase Dashboard → SQL Editor**:

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
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
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

Also configure in **Supabase Dashboard**:
- Authentication → Providers → Google → Enable, paste Client ID + Secret
- Authentication → URL Configuration → add `http://localhost:3000/auth/callback` and `https://bisat-store.com/auth/callback`
- Authentication → URL Configuration → Site URL = `https://bisat-store.com`

---

## Task 1: Install @supabase/ssr

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env.example`

- [ ] **Step 1: Install the package**

```bash
cd /Users/mohamedsaad/Desktop/My\ projects/bisatim/bisat-next
npm install @supabase/ssr
```

Expected: package installs, `package.json` shows `"@supabase/ssr"` in dependencies.

- [ ] **Step 2: Add env var note to .env.example**

In `.env.example`, the existing `NEXT_PUBLIC_SITE_URL` line is already there. Confirm it reads:
```
NEXT_PUBLIC_SITE_URL="https://bisat-store.com"
```
This is used as the OAuth redirect base URL in production.

- [ ] **Step 3: Verify TypeScript still compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @supabase/ssr for cookie-based auth sessions"
```

---

## Task 2: Create supabase-browser.ts

**Files:**
- Create: `src/lib/supabase-browser.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr';

export const createSupabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase-browser.ts
git commit -m "feat: add browser Supabase client using @supabase/ssr"
```

---

## Task 3: Create middleware.ts

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session cookie — must not be removed
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add Next.js middleware to refresh Supabase session cookies"
```

---

## Task 4: Create AuthContext.tsx

**Files:**
- Create: `src/context/AuthContext.tsx`

- [ ] **Step 1: Create the file**

```typescript
// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '../lib/supabase-browser';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async (redirectPath = '/checkout') => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
      },
    });
  };

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error?.message ?? null };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInWithGoogle, signInWithEmail, signUpWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/context/AuthContext.tsx
git commit -m "feat: add AuthContext with Supabase email/password and Google OAuth"
```

---

## Task 5: Create /auth/callback route

**Files:**
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /Users/mohamedsaad/Desktop/My\ projects/bisatim/bisat-next/src/app/auth/callback
```

```typescript
// src/app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/checkout';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/cart?auth_error=true`);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/auth/callback/route.ts
git commit -m "feat: add /auth/callback route to exchange Google OAuth code for session"
```

---

## Task 6: Create AuthModal.tsx

**Files:**
- Create: `src/components/AuthModal.tsx`

- [ ] **Step 1: Create the file**

```typescript
// src/components/AuthModal.tsx
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  onClose: () => void;
  redirectTo?: string;
}

type Tab = 'signin' | 'register';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const inputCls = 'w-full border border-bisat-black/[0.1] bg-[#fafafa] py-3.5 pl-10 pr-4 text-[13px] text-bisat-black placeholder:text-bisat-black/30 focus:border-bisat-black/30 focus:outline-none transition-colors';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, redirectTo = '/checkout' }) => {
  const [tab, setTab] = useState<Tab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signInWithGoogle(redirectTo);
    // Browser will navigate to /auth/callback — no need to setLoading(false)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    let result: { error: string | null };

    if (tab === 'signin') {
      result = await signInWithEmail(form.email, form.password);
    } else {
      if (!form.fullName.trim()) {
        setError('Please enter your full name.');
        setLoading(false);
        return;
      }
      result = await signUpWithEmail(form.email, form.password, form.fullName);
      if (!result.error) {
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setTab('signin');
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
      router.push(redirectTo);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="w-full max-w-[420px] bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-bisat-black/[0.07] px-8 py-6">
            <h2 className="font-rh text-[1.5rem] font-light text-bisat-black">
              {tab === 'signin' ? 'Sign in to continue' : 'Create your account'}
            </h2>
            <button onClick={onClose} className="text-bisat-black/35 transition-colors hover:text-bisat-black">
              <X size={18} />
            </button>
          </div>

          <div className="px-8 py-7">
            {/* Tabs */}
            <div className="mb-7 flex border-b border-bisat-black/[0.07]">
              {(['signin', 'register'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null); setSuccess(null); }}
                  className={`mr-8 pb-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                    tab === t
                      ? '-mb-px border-b-2 border-bisat-black text-bisat-black'
                      : 'text-bisat-black/35 hover:text-bisat-black'
                  }`}
                >
                  {t === 'signin' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="mb-5 flex w-full items-center justify-center gap-3 border border-bisat-black/[0.12] bg-white py-3 text-[12px] font-medium text-bisat-black transition-colors hover:bg-[#f7f5f2] disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-bisat-black/[0.07]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-bisat-black/30">or</span>
              <div className="h-px flex-1 bg-bisat-black/[0.07]" />
            </div>

            {/* Success message */}
            {success && (
              <p className="mb-4 rounded bg-green-50 px-4 py-3 text-[12px] text-green-700">{success}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === 'register' && (
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-bisat-black/25" />
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={handleField}
                    required
                    className={inputCls}
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-bisat-black/25" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleField}
                  required
                  className={inputCls}
                />
              </div>

              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-bisat-black/25" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleField}
                  required
                  minLength={6}
                  className="w-full border border-bisat-black/[0.1] bg-[#fafafa] py-3.5 pl-10 pr-10 text-[13px] text-bisat-black placeholder:text-bisat-black/30 focus:border-bisat-black/30 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bisat-black/25 transition-colors hover:text-bisat-black"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {error && (
                <p className="text-[11px] text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 bg-bisat-black py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-bisat-charcoal disabled:opacity-60"
              >
                {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AuthModal.tsx
git commit -m "feat: add AuthModal with Google OAuth, email/password sign in and register tabs"
```

---

## Task 7: Update providers.tsx — wrap with AuthProvider

**Files:**
- Modify: `src/app/providers.tsx`

- [ ] **Step 1: Replace the file contents**

```typescript
// src/app/providers.tsx
'use client';

import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import { RecentlyViewedProvider } from '../context/RecentlyViewedContext';
import { WishlistProvider } from '../context/WishlistContext';
import { AuthProvider } from '../context/AuthContext';
import '../i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <RecentlyViewedProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </RecentlyViewedProvider>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/providers.tsx
git commit -m "feat: wrap app with AuthProvider"
```

---

## Task 8: Update CartContext.tsx — DB sync

**Files:**
- Modify: `src/context/CartContext.tsx`

- [ ] **Step 1: Replace the file with DB-synced version**

```typescript
// src/context/CartContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product } from '../data/products';
import { createSupabaseBrowser } from '../lib/supabase-browser';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEBOUNCE_MS = 400;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingFromDb = useRef(false);
  const supabase = createSupabaseBrowser();

  const loadCartFromDb = useCallback(async (uid: string) => {
    isLoadingFromDb.current = true;
    const { data } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', uid)
      .maybeSingle();

    if (data?.items) {
      const dbItems = data.items as CartItem[];
      setCart(prev => {
        if (prev.length === 0) return dbItems;
        // Merge: local items take precedence for quantity
        const merged = [...dbItems];
        for (const localItem of prev) {
          const idx = merged.findIndex(i => i.id === localItem.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], quantity: localItem.quantity };
          } else {
            merged.push(localItem);
          }
        }
        return merged;
      });
    }
    // Allow next render cycle before re-enabling persist
    setTimeout(() => { isLoadingFromDb.current = false; }, 50);
  }, []);

  // Subscribe to auth state to sync cart
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) loadCartFromDb(uid);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        await loadCartFromDb(uid);
      } else {
        setCart([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadCartFromDb]);

  const persistToDb = useCallback((items: CartItem[], uid: string) => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      supabase.from('carts').upsert(
        { user_id: uid, items, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      ).then(() => {});
    }, DEBOUNCE_MS);
  }, []);

  // Persist on every cart change (skip initial DB load)
  useEffect(() => {
    if (isLoadingFromDb.current) return;
    if (userId) persistToDb(cart, userId);
  }, [cart, userId, persistToDb]);

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === productId);
      if (!item) return prev;
      if (quantity <= 0) return prev.filter(i => i.id !== productId);
      const newQuantity = Math.min(quantity, item.stock);
      return prev.map(i => i.id === productId ? { ...i, quantity: newQuantity } : i);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    if (userId) {
      supabase.from('carts').upsert(
        { user_id: userId, items: [], updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      ).then(() => {});
    }
  }, [userId]);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/context/CartContext.tsx
git commit -m "feat: sync cart to Supabase DB on login and persist on every change"
```

---

## Task 9: Update Cart.tsx — auth gate on checkout button

**Files:**
- Modify: `src/views/Cart.tsx`

- [ ] **Step 1: Add imports at top of file**

Add to the existing import block at the top of `src/views/Cart.tsx`:

```typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
```

- [ ] **Step 2: Add hooks inside the Cart component, after existing hooks**

Inside the `Cart` component function body (after the existing `useCart` and `useLanguage` lines):

```typescript
const { user } = useAuth();
const router = useRouter();
const [showAuthModal, setShowAuthModal] = useState(false);
```

- [ ] **Step 3: Replace the checkout Link with an auth-aware button**

Find and replace:

```typescript
// REMOVE this:
<Link
  href="/checkout"
  className="w-full bg-bisat-black text-white py-4 text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-bisat-charcoal transition-colors flex items-center justify-center gap-2 group"
>
  {t('cart.checkout')}
  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
</Link>
```

```typescript
// ADD this:
<button
  onClick={() => { user ? router.push('/checkout') : setShowAuthModal(true); }}
  className="w-full bg-bisat-black text-white py-4 text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-bisat-charcoal transition-colors flex items-center justify-center gap-2 group"
>
  {t('cart.checkout')}
  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
</button>
```

- [ ] **Step 4: Add AuthModal at bottom of the return statement**

Add just before the final closing `</div>` of the Cart component return:

```typescript
{showAuthModal && (
  <AuthModal onClose={() => setShowAuthModal(false)} redirectTo="/checkout" />
)}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/views/Cart.tsx
git commit -m "feat: gate checkout behind auth — show AuthModal if user is not signed in"
```

---

## Task 10: Update Checkout.tsx — auth gate, pre-fill, save order

**Files:**
- Modify: `src/views/Checkout.tsx`

- [ ] **Step 1: Add imports**

Add to existing imports at the top of `src/views/Checkout.tsx`:

```typescript
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createSupabaseBrowser } from '../lib/supabase-browser';
```

- [ ] **Step 2: Add auth hook and redirect inside Checkout component**

Add directly after `const router = useRouter();`:

```typescript
const { user, loading: authLoading } = useAuth();

// Redirect to cart if user reaches checkout without auth
useEffect(() => {
  if (!authLoading && !user) {
    router.replace('/cart');
  }
}, [user, authLoading, router]);

// Pre-fill name and email from user profile
useEffect(() => {
  if (!user) return;
  const displayName: string = (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string) ?? '';
  const parts = displayName.trim().split(' ');
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ');
  setShipping(prev => ({
    ...prev,
    firstName: prev.firstName || firstName,
    lastName: prev.lastName || lastName,
    email: prev.email || (user.email ?? ''),
  }));
}, [user]);
```

- [ ] **Step 3: Replace handlePaymentSubmit to save the order to DB**

Find and replace the existing `handlePaymentSubmit`:

```typescript
// REMOVE:
const handlePaymentSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsPlacing(true);
  setTimeout(() => {
    clearCart();
    router.push('/order-confirmation');
  }, 1200);
};
```

```typescript
// ADD:
const handlePaymentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;
  setIsPlacing(true);

  const supabase = createSupabaseBrowser();
  await supabase.from('orders').insert({
    user_id: user.id,
    items: cart,
    shipping_address: shipping,
    total: totalPrice,
    status: 'processing',
  });

  clearCart();
  router.push('/order-confirmation');
};
```

- [ ] **Step 4: Add loading guard at top of return**

Add just after the opening of the `Checkout` component return, before the existing `<div>`:

```typescript
if (authLoading || !user) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-bisat-black/20 border-t-bisat-black" />
    </div>
  );
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/views/Checkout.tsx
git commit -m "feat: add auth gate to checkout, pre-fill from profile, save order to DB"
```

---

## Task 11: Update Account.tsx — real data

**Files:**
- Modify: `src/views/Account.tsx`

- [ ] **Step 1: Replace the full file**

```typescript
// src/views/Account.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, Settings, MapPin, Mail, Phone, ArrowRight, CheckCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Meta } from '../components/Meta';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { createSupabaseBrowser } from '../lib/supabase-browser';

interface Order {
  id: string;
  created_at: string;
  status: 'processing' | 'shipped' | 'delivered';
  total: number;
  items: Array<{ name: string }>;
}

interface Profile {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  shipped:    'bg-blue-50 text-blue-700 border-blue-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
};

const TABS = ['Overview', 'Orders', 'Settings'] as const;
type Tab = typeof TABS[number];

export const Account = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile>({ full_name: null, phone: null, avatar_url: null });
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/cart');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    // Load profile
    supabase.from('profiles').select('full_name, phone, avatar_url').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setProfileForm({ full_name: data.full_name ?? '', phone: data.phone ?? '' });
        }
      });
    // Load orders
    supabase.from('orders').select('id, created_at, status, total, items').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({
      full_name: profileForm.full_name,
      phone: profileForm.phone,
    }).eq('id', user.id);
    setProfile(prev => ({ ...prev, ...profileForm }));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-bisat-black/20 border-t-bisat-black" />
      </div>
    );
  }

  const displayName = profile.full_name
    || (user.user_metadata?.full_name as string)
    || (user.user_metadata?.name as string)
    || user.email
    || 'My Account';

  const memberSince = new Date(user.created_at).getFullYear().toString();

  return (
    <div className="pb-16 bg-[#f7f5f2] min-h-screen">
      <Meta title="My Account" description="Manage your Bisatim account, orders, and preferences." />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader badge="My Account" title={`Welcome back, ${displayName.split(' ')[0]}`} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-bisat-black/[0.07] p-8 text-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-20 h-20 bg-bisat-black flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-bisat-cream" strokeWidth={1.5} />
                </div>
              )}
              <h3 className="font-sans text-lg">{displayName}</h3>
              <p className="text-xs text-bisat-black/40 mt-1">Member since {memberSince}</p>
            </div>

            <div className="bg-white border border-bisat-black/[0.07] p-2">
              {TABS.map((tab) => {
                const icons: Record<Tab, React.ElementType> = { Overview: User, Orders: Package, Settings: Settings };
                const Icon = icons[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                      activeTab === tab
                        ? 'bg-bisat-black text-white'
                        : 'text-bisat-black/45 hover:text-bisat-black hover:bg-[#f7f5f2]/50'
                    }`}
                  >
                    <Icon size={15} />
                    {tab}
                  </button>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-bisat-black/45 hover:text-red-600 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview */}
              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Total Orders', value: orders.length.toString(), icon: Package },
                      { label: 'Wishlist Items', value: '—', icon: Heart },
                      { label: 'Member Since', value: memberSince, icon: CheckCircle },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-white border border-bisat-black/[0.07] p-8">
                        <Icon size={20} className="text-bisat-gold mb-4" />
                        <p className="text-3xl font-sans mb-1">{value}</p>
                        <p className="text-xs text-bisat-black/40 uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>

                  {orders[0] && (
                    <div className="bg-white border border-bisat-black/[0.07] p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-sans text-xl">Recent Order</h3>
                        <button onClick={() => setActiveTab('Orders')} className="text-xs uppercase tracking-widest font-bold text-bisat-gold flex items-center gap-2 hover:gap-3 transition-all">
                          View All <ArrowRight size={14} />
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-bisat-black/40 uppercase tracking-widest mb-1">#{orders[0].id.slice(0, 8).toUpperCase()}</p>
                          <p className="font-sans">{(orders[0].items as Array<{ name: string }>).map(i => i.name).join(', ')}</p>
                          <p className="text-xs text-bisat-black/40 mt-1">{new Date(orders[0].created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[orders[0].status]}`}>
                            {orders[0].status}
                          </span>
                          <Link href="/track-order" className="text-xs uppercase tracking-widest font-bold text-bisat-black/50 hover:text-bisat-black transition-colors flex items-center gap-1">
                            Track <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/wishlist" className="bg-white border border-bisat-black/[0.07] p-8 flex items-center justify-between group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <Heart size={20} className="text-bisat-gold" />
                        <span className="font-bold text-sm uppercase tracking-widest">My Wishlist</span>
                      </div>
                      <ArrowRight size={16} className="text-bisat-black/20 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/track-order" className="bg-white border border-bisat-black/[0.07] p-8 flex items-center justify-between group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <Package size={20} className="text-bisat-gold" />
                        <span className="font-bold text-sm uppercase tracking-widest">Track Order</span>
                      </div>
                      <ArrowRight size={16} className="text-bisat-black/20 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Orders */}
              {activeTab === 'Orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="bg-white border border-bisat-black/[0.07] p-12 text-center">
                      <Package size={32} className="text-bisat-black/15 mx-auto mb-4" strokeWidth={1} />
                      <p className="text-bisat-black/45 text-sm">No orders yet.</p>
                    </div>
                  ) : orders.map((order) => (
                    <div key={order.id} className="bg-white border border-bisat-black/[0.07] p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-bisat-black/40 uppercase tracking-widest mb-1">#{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="font-sans text-lg">{(order.items as Array<{ name: string }>).map(i => i.name).join(', ')}</p>
                          <p className="text-sm text-bisat-black/60 mt-1">${order.total.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[order.status] ?? ''}`}>
                            {order.status}
                          </span>
                          <Link href="/track-order" className="text-xs uppercase tracking-widest font-bold text-bisat-black/50 hover:text-bisat-black transition-colors flex items-center gap-1">
                            Track <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Settings */}
              {activeTab === 'Settings' && (
                <div className="space-y-4">
                  <div className="bg-white border border-bisat-black/[0.07] p-8">
                    <h3 className="font-sans text-xl mb-6">Personal Information</h3>
                    <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 block mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.full_name}
                          onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))}
                          className="w-full bg-[#f7f5f2]/50 border border-bisat-black/[0.07] px-4 py-3 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 block mb-2">Email</label>
                        <input
                          type="email"
                          value={user.email ?? ''}
                          disabled
                          className="w-full bg-[#f7f5f2]/50 border border-bisat-black/[0.07] px-4 py-3 text-sm text-bisat-black/40 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 block mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                          className="w-full bg-[#f7f5f2]/50 border border-bisat-black/[0.07] px-4 py-3 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-bisat-black text-bisat-cream px-8 py-3 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-bisat-charcoal transition-colors disabled:opacity-60"
                        >
                          {saving ? 'Saving…' : saveSuccess ? 'Saved ✓' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/views/Account.tsx
git commit -m "feat: replace dummy Account data with live Supabase profile and orders"
```

---

## Task 12: Final build verification

- [ ] **Step 1: Run full build**

```bash
cd /Users/mohamedsaad/Desktop/My\ projects/bisatim/bisat-next
npx next build
```

Expected: build completes without errors.

- [ ] **Step 2: Commit any fixes if needed, then tag**

```bash
git add -A
git commit -m "feat: complete auth system — Google OAuth, email/password, DB cart, live account"
```

---

## Manual Smoke Test Checklist

After deploying / running dev server:

1. Go to `/cart`, add a product, click "Proceed to Checkout" → AuthModal should appear
2. Register with email → should see "Check your email" message
3. Sign in with that email → modal closes, redirected to `/checkout`
4. Checkout form should pre-fill first/last name and email from profile
5. Submit order → redirected to `/order-confirmation`
6. Go to `/account` → should show real name, real order in Orders tab
7. Log out → redirected to `/`, cart cleared
8. Sign in with Google → should redirect through `/auth/callback` → `/checkout`
9. Open incognito, navigate directly to `/checkout` → should redirect to `/cart`
10. Add items to cart on device A, sign in on device B → cart should appear (DB sync)
