
-- Drop existing policies that aren't working correctly
DROP POLICY IF EXISTS "Authenticated users can upload community attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view community attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own community attachments" ON storage.objects;

-- Create correct policies using auth.uid() instead of auth.role()
CREATE POLICY "Authenticated users can upload community attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);

CREATE POLICY "Authenticated users can view community attachments"
ON storage.objects
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);

CREATE POLICY "Users can delete their own community attachments"
ON storage.objects
FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND bucket_id = 'course-materials' 
  AND (storage.foldername(name))[1] = 'community-attachments'
);
