import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'DELETE') {
    return errorResponse(405, 'Method not allowed');
  }

  const { user, supabase, error: authError } = await getAuthUser(req);
  if (authError || !user) {
    return errorResponse(401, 'Unauthorized', 'AUTH_REQUIRED');
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return errorResponse(400, 'Evidence ID is required', 'VALIDATION');
  }

  try {
    // Fetch evidence to get storage path (RLS ensures only own claim's evidence)
    const { data: evidence, error: fetchError } = await supabase
      .from('evidence')
      .select('id, storage_path, claim_id')
      .eq('id', id)
      .single();

    if (fetchError || !evidence) {
      return errorResponse(404, 'Evidence not found', 'NOT_FOUND');
    }

    // Delete from storage
    if (evidence.storage_path) {
      await supabase.storage
        .from('evidence')
        .remove([evidence.storage_path]);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('evidence')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return errorResponse(500, deleteError.message, 'DB_ERROR');
    }

    return jsonResponse(null, 204);
  } catch (err) {
    console.error('evidence-delete error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
