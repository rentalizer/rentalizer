
-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload community attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view community attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own community attachments" ON storage.objects;

-- Create more permissive policies that work in development and production
CREATE POLICY "Allow uploads to community attachments folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);

CREATE POLICY "Allow viewing community attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);

CREATE POLICY "Allow deleting community attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);

CREATE POLICY "Allow updating community attachments"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);
