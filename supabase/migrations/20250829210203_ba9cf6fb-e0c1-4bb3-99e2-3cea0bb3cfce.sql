-- Fix critical security vulnerability in guidebooks table
-- Issue: Unpublished property details (addresses, WiFi, check-in procedures) accessible to anyone
-- Solution: Ensure strict separation between public and private guidebook access

-- Drop existing policies to rebuild them securely
DROP POLICY IF EXISTS "Published guidebooks are publicly viewable" ON public.guidebooks;
DROP POLICY IF EXISTS "Users can manage their own guidebooks" ON public.guidebooks;

-- Create secure public SELECT policy - ONLY for published guidebooks
CREATE POLICY "public_can_view_published_guidebooks" ON public.guidebooks
FOR SELECT 
USING (is_published = true);

-- Create separate policies for authenticated users to manage their own guidebooks
CREATE POLICY "owners_can_view_own_guidebooks" ON public.guidebooks
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "owners_can_insert_guidebooks" ON public.guidebooks
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "owners_can_update_own_guidebooks" ON public.guidebooks
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "owners_can_delete_own_guidebooks" ON public.guidebooks
FOR DELETE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Admin override policies for system/admin operations
CREATE POLICY "admins_can_manage_all_guidebooks" ON public.guidebooks
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());