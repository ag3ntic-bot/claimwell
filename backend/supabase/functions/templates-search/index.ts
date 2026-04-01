import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';
import { toTemplate } from '../_shared/mappers.ts';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'GET') {
    return errorResponse(405, 'Method not allowed');
  }

  const { user, supabase, error: authError } = await getAuthUser(req);
  if (authError || !user) {
    return errorResponse(401, 'Unauthorized', 'AUTH_REQUIRED');
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q')?.trim();

    if (!query) {
      return jsonResponse([]);
    }

    // Full-text search on title, description, and tags
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .order('usage_count', { ascending: false })
      .limit(20);

    if (error) {
      return errorResponse(500, error.message, 'DB_ERROR');
    }

    return jsonResponse((data ?? []).map(toTemplate));
  } catch (err) {
    console.error('templates-search error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
