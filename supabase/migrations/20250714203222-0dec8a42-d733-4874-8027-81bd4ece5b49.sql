
-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('community-photos', 'community-photos', true);

-- Create storage policy for photo uploads
CREATE POLICY "Anyone can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'community-photos');

CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'community-photos');

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'community-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
