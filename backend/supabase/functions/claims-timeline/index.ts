import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';
import { toTimelineEvent } from '../_shared/mappers.ts';

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

  const url = new URL(req.url);
  const claimId = url.searchParams.get('claimId');

  if (!claimId) {
    return errorResponse(400, 'claimId query parameter is required', 'VALIDATION');
  }

  try {
    // Verify claim ownership via RLS
    const { data: claim } = await supabase
      .from('claims')
      .select('id')
      .eq('id', claimId)
      .eq('user_id', user.id)
      .single();

    if (!claim) {
      return errorResponse(404, 'Claim not found', 'NOT_FOUND');
    }

    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('claim_id', claimId)
      .order('date', { ascending: false });

    if (error) {
      return errorResponse(500, error.message, 'DB_ERROR');
    }

    return jsonResponse((data ?? []).map(toTimelineEvent));
  } catch (err) {
    console.error('claims-timeline error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
