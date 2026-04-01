import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, paginatedResponse } from '../_shared/response.ts';
import { toClaim, toClaimRow } from '../_shared/mappers.ts';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const { user, supabase, error: authError } = await getAuthUser(req);
  if (authError || !user) {
    return errorResponse(401, 'Unauthorized', 'AUTH_REQUIRED');
  }

  try {
    if (req.method === 'GET') {
      // GET /claims — list user's claims
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') ?? '1', 10);
      const pageSize = parseInt(url.searchParams.get('pageSize') ?? '50', 10);
      const status = url.searchParams.get('status');

      let query = supabase
        .from('claims')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      query = query.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        return errorResponse(500, error.message, 'DB_ERROR');
      }

      return paginatedResponse(
        (data ?? []).map(toClaim),
        count ?? 0,
        page,
        pageSize,
      );
    }

    if (req.method === 'POST') {
      // POST /claims — create new claim
      const body = await req.json();

      if (!body.title || !body.category || !body.companyName || body.amountClaimed == null) {
        return errorResponse(400, 'Missing required fields: title, category, companyName, amountClaimed', 'VALIDATION');
      }

      const row = toClaimRow(body, user.id);

      const { data, error } = await supabase
        .from('claims')
        .insert(row)
        .select()
        .single();

      if (error) {
        return errorResponse(500, error.message, 'DB_ERROR');
      }

      // Create initial timeline event
      await supabase.from('timeline_events').insert({
        claim_id: data.id,
        type: 'claim_created',
        title: 'Claim created',
        description: `Claim "${body.title}" submitted against ${body.companyName}`,
      });

      return jsonResponse(toClaim(data), 201);
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    console.error('claims error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
