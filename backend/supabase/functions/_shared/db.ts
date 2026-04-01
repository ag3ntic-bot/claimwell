import { createClient as _createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

/**
 * Creates a Supabase client authenticated as the requesting user.
 * RLS policies are enforced based on the user's JWT.
 */
export function createClient(req: Request) {
  const authHeader = req.headers.get('Authorization') ?? '';
  return _createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
}

/**
 * Creates a Supabase client with service role privileges.
 * Bypasses RLS — use only for server-side operations (AI cache, budget logging).
 */
export function createServiceClient() {
  return _createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
