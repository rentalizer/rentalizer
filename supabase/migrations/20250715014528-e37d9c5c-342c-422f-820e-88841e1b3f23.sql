-- Fix the RLS policies for direct_messages table

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