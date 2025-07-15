-- Debug the current RLS policies and fix the direct_messages table issues

-- First, let's check what's in the user_roles table for the current user
-- and ensure the policies are working correctly

-- Drop the problematic policies and recreate them with better logic
DROP POLICY IF EXISTS "Users can send messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can view their messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can update message read status" ON direct_messages;
DROP POLICY IF EXISTS "Admins can manage all messages" ON direct_messages;

-- Create simpler, more reliable policies
CREATE POLICY "Enable insert for authenticated users" 
ON direct_messages 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Enable select for message participants" 
ON direct_messages 
FOR SELECT 
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Enable update for recipients" 
ON direct_messages 
FOR UPDATE 
TO authenticated
USING (auth.uid() = recipient_id);

-- Separate admin policy for full access
CREATE POLICY "Enable all operations for admins" 
ON direct_messages 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Ensure the table has RLS enabled
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Also ensure realtime is enabled for this table
ALTER TABLE direct_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;