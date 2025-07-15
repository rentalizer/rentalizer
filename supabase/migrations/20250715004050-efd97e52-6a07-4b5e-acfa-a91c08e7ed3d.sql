-- Fix RLS policies for direct_messages table to allow proper message sending

-- Drop existing policies
DROP POLICY IF EXISTS "Users can send messages to anyone" ON direct_messages;
DROP POLICY IF EXISTS "Users can view their conversations" ON direct_messages;
DROP POLICY IF EXISTS "Users can update read status of messages sent to them" ON direct_messages;
DROP POLICY IF EXISTS "Admins can delete direct messages" ON direct_messages;

-- Create new, more permissive policies that work properly
CREATE POLICY "Users can send messages" 
ON direct_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their messages" 
ON direct_messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can update message read status" 
ON direct_messages 
FOR UPDATE 
USING (auth.uid() = recipient_id);

CREATE POLICY "Admins can manage all messages" 
ON direct_messages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);