import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { getAuthUser } from '../_shared/auth.ts';
import { jsonResponse, errorResponse } from '../_shared/response.ts';
import { toEvidence } from '../_shared/mappers.ts';

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

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
    // Verify claim ownership
    const { data: claim } = await supabase
      .from('claims')
      .select('id')
      .eq('id', claimId)
      .eq('user_id', user.id)
      .single();

    if (!claim) {
      return errorResponse(404, 'Claim not found', 'NOT_FOUND');
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .eq('claim_id', claimId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        return errorResponse(500, error.message, 'DB_ERROR');
      }

      // Generate signed URLs for each piece of evidence
      const evidenceWithUrls = await Promise.all(
        (data ?? []).map(async (row: Record<string, unknown>) => {
          let signedUri: string | undefined;
          let signedThumbnail: string | undefined;

          if (row.storage_path) {
            const { data: urlData } = await supabase.storage
              .from('evidence')
              .createSignedUrl(row.storage_path as string, 3600);
            signedUri = urlData?.signedUrl;
          }

          if (row.thumbnail_path) {
            const { data: thumbData } = await supabase.storage
              .from('evidence')
              .createSignedUrl(row.thumbnail_path as string, 3600);
            signedThumbnail = thumbData?.signedUrl;
          }

          return toEvidence(row, signedUri, signedThumbnail);
        }),
      );

      return jsonResponse(evidenceWithUrls);
    }

    if (req.method === 'POST') {
      // Handle multipart file upload
      const contentType = req.headers.get('content-type') ?? '';

      if (!contentType.includes('multipart/form-data')) {
        return errorResponse(400, 'Content-Type must be multipart/form-data', 'VALIDATION');
      }

      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return errorResponse(400, 'File is required', 'VALIDATION');
      }

      // Generate storage path
      const ext = file.name.split('.').pop() ?? 'bin';
      const storagePath = `${user.id}/${claimId}/${crypto.randomUUID()}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return errorResponse(500, uploadError.message, 'UPLOAD_ERROR');
      }

      // Determine evidence type from MIME
      let evidenceType = 'document';
      if (file.type.startsWith('image/')) evidenceType = 'photo';
      else if (file.type === 'application/pdf') evidenceType = 'pdf';
      else if (file.type.includes('email') || file.type === 'message/rfc822') evidenceType = 'email';

      // Insert evidence record
      const { data: evidence, error: insertError } = await supabase
        .from('evidence')
        .insert({
          claim_id: claimId,
          type: evidenceType,
          title: file.name,
          file_name: file.name,
          storage_path: storagePath,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single();

      if (insertError) {
        return errorResponse(500, insertError.message, 'DB_ERROR');
      }

      // Create timeline event
      await supabase.from('timeline_events').insert({
        claim_id: claimId,
        type: 'evidence_uploaded',
        title: 'Evidence uploaded',
        description: `File "${file.name}" uploaded`,
      });

      // Generate signed URL for response
      const { data: urlData } = await supabase.storage
        .from('evidence')
        .createSignedUrl(storagePath, 3600);

      return jsonResponse(toEvidence(evidence, urlData?.signedUrl), 201);
    }

    return errorResponse(405, 'Method not allowed');
  } catch (err) {
    console.error('claims-evidence error:', err);
    return errorResponse(500, 'Internal server error', 'INTERNAL');
  }
});
