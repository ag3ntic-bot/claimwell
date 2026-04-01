import { createClient } from './db.ts';

interface AuthResult {
  user: { id: string; email?: string } | null;
  supabase: ReturnType<typeof createClient>;
  error: string | null;
}

/**
 * Extracts the Bearer token from the request, verifies it via Supabase Auth,
 * and returns the authenticated user + an RLS-scoped Supabase client.
 */
export async function getAuthUser(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      user: null,
      supabase: createClient(req),
      error: 'Missing or invalid Authorization header',
    };
  }

  const supabase = createClient(req);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, supabase, error: error?.message ?? 'Invalid token' };
  }

  return { user, supabase, error: null };
}
