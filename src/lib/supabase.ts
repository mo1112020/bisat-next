import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Development hack: Bypass SSL certificate verification for local environments
// specifically resolving "unable to verify the first certificate" on Mac/Proxies.
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  try {
    // Also try to bypass via the legacy https agent just in case a polyfill is used
    const https = require('https');
    if (https.globalAgent) {
      https.globalAgent.options.rejectUnauthorized = false;
    }
  } catch (e) {}
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Bisāṭ] Supabase env vars missing — check .env.local');
}

const globalForSupabase = globalThis as unknown as { supabase: SupabaseClient };

export const supabase =
  globalForSupabase.supabase ||
  createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
  );

if (process.env.NODE_ENV !== 'production') globalForSupabase.supabase = supabase;
