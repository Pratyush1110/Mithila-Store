// lib/supabase.ts
// Singleton Supabase clients — one for browser, one for server (service role)
// Free-tier safe: no pooler, no realtime subscriptions kept open

import { createClient } from '@supabase/supabase-js';

const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── Browser / client-side (anon key, RLS enforced) ──────────
export const supabase = createClient(supabaseUrl, supabaseAnon);

// ── Server-side only (service role, bypasses RLS) ───────────
// NEVER import this in client components.
export const supabaseAdmin = createClient(supabaseUrl, supabaseService, {
  auth: { persistSession: false },
});
