-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', false);

-- Create storage policies for admin uploads
CREATE POLICY "Admins can upload course materials" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'course-materials' AND auth.uid() IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
));

CREATE POLICY "Admins can view course materials" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'course-materials' AND auth.uid() IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
));

CREATE POLICY "Admins can delete course materials" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'course-materials' AND auth.uid() IN (
  SELECT user_id FROM user_roles WHERE role = 'admin'
));