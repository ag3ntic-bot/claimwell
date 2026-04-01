import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';
import { toSettings, toSettingsRow } from '../_shared/mappers.ts';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const { user, supabase, error: authError } = await getAuthUser(req);
  if (authError || !user) {
    return errorResponse(401, 'Unauthorized', 'AUTH_REQUIRED');
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        return errorResponse(404, 'Settings not found', 'NOT_FOUND');
      }

      return jsonResponse(toSettings(data));
    }

    if (req.method === 'PATCH') {
      const body = await req.json();
      const updates = toSettingsRow(body);

      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error || !data) {
        return errorResponse(500, 'Failed to update settings', 'DB_ERROR');
      }

      return jsonResponse(toSettings(data));
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    console.error('user-settings error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
