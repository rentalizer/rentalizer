-- Fix RLS policies for user_api_keys table to allow DELETE operations
-- and ensure proper authentication handling

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can view own API keys" ON public.user_api_keys;

-- Create improved policies with better error handling
CREATE POLICY "Users can manage their own API keys - insert"
ON public.user_api_keys
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own API keys - select"
ON public.user_api_keys
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own API keys - update"
ON public.user_api_keys
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own API keys - delete"
ON public.user_api_keys
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);