
-- Create a storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-videos', 'community-videos', true);

-- Create policies for the video bucket
CREATE POLICY "Allow uploads to community videos folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'community-videos'
  AND auth.uid() IS NOT NULL
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
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow updating community videos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'community-videos'
  AND auth.uid() IS NOT NULL
);
