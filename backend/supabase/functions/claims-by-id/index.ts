import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';
import { toClaim } from '../_shared/mappers.ts';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const { user, supabase, error: authError } = await getAuthUser(req);
  if (authError || !user) {
    return errorResponse(401, 'Unauthorized', 'AUTH_REQUIRED');
  }

  // Extract claim ID from URL path: /claims-by-id?id=xxx or /claims-by-id/xxx
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? url.pathname.split('/').pop();

  if (!id) {
    return errorResponse(400, 'Claim ID is required', 'VALIDATION');
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        return errorResponse(404, 'Claim not found', 'NOT_FOUND');
      }

      return jsonResponse(toClaim(data));
    }

    if (req.method === 'PATCH') {
      const body = await req.json();
      const updates: Record<string, unknown> = {};

      if (body.title !== undefined) updates.title = body.title;
      if (body.category !== undefined) updates.category = body.category;
      if (body.companyName !== undefined) updates.company_name = body.companyName;
      if (body.description !== undefined) updates.description = body.description;
      if (body.amountClaimed !== undefined) updates.amount_claimed = body.amountClaimed;
      if (body.status !== undefined) updates.status = body.status;
      if (body.policyNumber !== undefined) updates.policy_number = body.policyNumber;
      if (body.serialNumber !== undefined) updates.serial_number = body.serialNumber;

      const { data, error } = await supabase
        .from('claims')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error || !data) {
        return errorResponse(404, 'Claim not found or update failed', 'NOT_FOUND');
      }

      return jsonResponse(toClaim(data));
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    console.error('claims-by-id error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
