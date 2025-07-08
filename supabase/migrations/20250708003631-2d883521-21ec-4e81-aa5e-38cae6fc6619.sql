-- Update RLS policies to allow bidirectional messaging between all users
DROP POLICY IF EXISTS "Users can send messages to admins" ON direct_messages;
DROP POLICY IF EXISTS "Admins can view messages sent to them" ON direct_messages;
DROP POLICY IF EXISTS "Users can view their sent messages" ON direct_messages;

-- Create new policies for bidirectional messaging
CREATE POLICY "Users can send messages to anyone" 
ON direct_messages 
FOR INSERT 
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can view their conversations" 
ON direct_messages 
FOR SELECT 
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can update read status of messages sent to them" 
ON direct_messages 
FOR UPDATE 
USING (recipient_id = auth.uid());

-- Create trigger to update read_at timestamp
CREATE OR REPLACE FUNCTION public.update_message_read_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read_at IS NOT NULL AND OLD.read_at IS NULL THEN
    NEW.read_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_message_read_status_trigger
  BEFORE UPDATE ON direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_read_status();

-- Enable realtime for direct messages
ALTER TABLE direct_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;