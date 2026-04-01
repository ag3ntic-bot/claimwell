import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';
import { toUser } from '../_shared/mappers.ts';

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
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        return errorResponse(404, 'Profile not found', 'NOT_FOUND');
      }

      return jsonResponse(toUser(data));
    }

    if (req.method === 'PATCH') {
      const body = await req.json();
      const updates: Record<string, unknown> = {};

      if (body.name !== undefined) updates.name = body.name;
      if (body.email !== undefined) updates.email = body.email;
      if (body.avatarUri !== undefined) updates.avatar_uri = body.avatarUri;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error || !data) {
        return errorResponse(500, 'Failed to update profile', 'DB_ERROR');
      }

      return jsonResponse(toUser(data));
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    console.error('user-profile error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
