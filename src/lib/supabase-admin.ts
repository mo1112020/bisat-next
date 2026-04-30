import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// Singleton admin client — bypasses RLS, server-side only.
// Never import this in client components.
const globalForAdmin = globalThis as unknown as { supabaseAdmin: ReturnType<typeof createClient> };

export const supabaseAdmin =
  globalForAdmin.supabaseAdmin ||
  createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    serviceRoleKey || 'placeholder',
    { auth: { persistSession: false } },
  );

if (process.env.NODE_ENV !== 'production') globalForAdmin.supabaseAdmin = supabaseAdmin;
