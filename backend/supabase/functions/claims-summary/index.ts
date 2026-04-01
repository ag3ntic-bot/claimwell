import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';

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
    // Active claims count
    const { count: activeClaims } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('status', 'in', '("resolved","archived")');

    // Money at stake (sum of amount_claimed for active claims)
    const { data: stakeData } = await supabase
      .from('claims')
      .select('amount_claimed')
      .eq('user_id', user.id)
      .not('status', 'in', '("resolved","archived")');

    const moneyAtStake = (stakeData ?? []).reduce(
      (sum: number, r: { amount_claimed: string }) => sum + Number(r.amount_claimed),
      0,
    );

    // Total recovered (sum of amount_recovered for resolved claims)
    const { data: recoveredData } = await supabase
      .from('claims')
      .select('amount_recovered')
      .eq('user_id', user.id)
      .eq('status', 'resolved')
      .not('amount_recovered', 'is', null);

    const totalRecovered = (recoveredData ?? []).reduce(
      (sum: number, r: { amount_recovered: string }) => sum + Number(r.amount_recovered),
      0,
    );

    return jsonResponse({
      activeClaims: activeClaims ?? 0,
      moneyAtStake,
      totalRecovered,
    });
  } catch (err) {
    console.error('claims-summary error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
