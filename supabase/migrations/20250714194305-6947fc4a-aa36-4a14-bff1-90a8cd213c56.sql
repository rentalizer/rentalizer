
-- Drop the existing restrictive policies for community-videos bucket
DROP POLICY IF EXISTS "Allow uploads to community videos folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow viewing community videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow deleting community videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow updating community videos" ON storage.objects;

-- Create more permissive policies that work in development and production
CREATE POLICY "Allow uploads to community videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'community-videos'
);

CREATE POLICY "Allow viewing community videos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'community-videos'
);

CREATE POLICY "Allow deleting community videos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'community-videos'
);

CREATE POLICY "Allow updating community videos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'community-videos'
);
