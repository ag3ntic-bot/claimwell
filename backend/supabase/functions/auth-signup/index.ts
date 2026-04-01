import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient as _createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { handleCors } from '../_shared/cors.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return errorResponse(405, 'Method not allowed');
  }

  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return errorResponse(400, 'Email and password are required', 'VALIDATION');
    }

    const supabase = _createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { auth: { persistSession: false } },
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name ?? '' } },
    });

    if (error) {
      return errorResponse(400, error.message, 'SIGNUP_FAILED');
    }

    if (!data.session) {
      // Email confirmation required
      return jsonResponse({ message: 'Check your email for confirmation link' }, 201);
    }

    return jsonResponse({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    }, 201);
  } catch (err) {
    console.error('auth-signup error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
