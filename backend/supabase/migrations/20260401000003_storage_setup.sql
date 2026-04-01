-- ============================================================================
-- Claimwell: Storage Bucket Setup
-- ============================================================================

-- Create evidence bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  false,
  52428800,  -- 50MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/heic',
    'application/pdf',
    'text/plain', 'text/html',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
);

-- Storage RLS: users can upload to their own folder
CREATE POLICY "Users can upload evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Storage RLS: users can read from their own folder
CREATE POLICY "Users can read own evidence"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Storage RLS: users can delete from their own folder
CREATE POLICY "Users can delete own evidence"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );
