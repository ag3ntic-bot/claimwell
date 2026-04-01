import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse(405, 'Method not allowed');
  }

  try {
    const { supabase } = await getAuthUser(req);
    await supabase.auth.signOut();
    return jsonResponse(null, 204);
  } catch (err) {
    console.error('auth-logout error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
