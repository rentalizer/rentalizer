
-- Update storage policies to allow authenticated users to upload community attachments
CREATE POLICY "Authenticated users can upload community attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' 
  AND bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);

CREATE POLICY "Authenticated users can view community attachments"
ON storage.objects
FOR SELECT
USING (
  auth.role() = 'authenticated' 
  AND bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);

CREATE POLICY "Users can delete their own community attachments"
ON storage.objects
FOR DELETE
USING (
  auth.role() = 'authenticated' 
  AND bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);
