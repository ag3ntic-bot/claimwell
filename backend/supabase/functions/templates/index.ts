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
    const id = url.searchParams.get('id');

    if (id) {
      // GET /templates?id=xxx — single template
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return errorResponse(404, 'Template not found', 'NOT_FOUND');
      }

      return jsonResponse(toTemplate(data));
    }

    // GET /templates — list all
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('usage_count', { ascending: false });

    if (error) {
      return errorResponse(500, error.message, 'DB_ERROR');
    }

    return jsonResponse((data ?? []).map(toTemplate));
  } catch (err) {
    console.error('templates error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
