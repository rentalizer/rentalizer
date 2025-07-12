-- Enhanced schema for the new Guidebook system

-- Extend guidebooks table with new fields for the enhanced system
ALTER TABLE guidebooks ADD COLUMN IF NOT EXISTS guest_link_slug TEXT UNIQUE;
ALTER TABLE guidebooks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE guidebooks ADD COLUMN IF NOT EXISTS property_type TEXT;
ALTER TABLE guidebooks ADD COLUMN IF NOT EXISTS check_in_time TEXT;
ALTER TABLE guidebooks ADD COLUMN IF NOT EXISTS check_out_time TEXT;
ALTER TABLE guidebooks ADD COLUMN IF NOT EXISTS wifi_name TEXT;
ALTER TABLE guidebooks ADD COLUMN IF NOT EXISTS wifi_password TEXT;

-- Update guidebook_sections to include more metadata
ALTER TABLE guidebook_sections ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE guidebook_sections ADD COLUMN IF NOT EXISTS is_collapsible BOOLEAN DEFAULT true;
ALTER TABLE guidebook_sections ADD COLUMN IF NOT EXISTS is_expanded_default BOOLEAN DEFAULT false;

-- Enhanced guidebook_cards table with more card types and features
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS card_subtype TEXT; -- 'recommendation', 'upsell', 'booking', 'info'
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS price_cents INTEGER;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS button_color TEXT;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS location_distance TEXT;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS category TEXT; -- 'restaurant', 'attraction', 'service', etc.
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1);
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS video_type TEXT; -- 'youtube', 'vimeo', 'direct'
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false;
ALTER TABLE guidebook_cards ADD COLUMN IF NOT EXISTS template_category TEXT;

-- Create card templates table for reusable cards
CREATE TABLE IF NOT EXISTS card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  card_type TEXT NOT NULL DEFAULT 'text',
  card_subtype TEXT,
  media_url TEXT,
  video_url TEXT,
  video_type TEXT,
  button_text TEXT,
  button_color TEXT,
  external_url TEXT,
  category TEXT,
  template_category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on card_templates
ALTER TABLE card_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for card templates
CREATE POLICY "Users can manage their own card templates" ON card_templates
FOR ALL
USING (
  user_id = '00000000-0000-0000-0000-000000000001'::uuid OR 
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
)
WITH CHECK (
  user_id = '00000000-0000-0000-0000-000000000001'::uuid OR 
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- Create marketplace orders table for upsell tracking
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guidebook_id UUID NOT NULL REFERENCES guidebooks(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES guidebook_cards(id) ON DELETE CASCADE,
  guest_email TEXT,
  guest_name TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on marketplace_orders
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Create policy for marketplace orders (viewable by guidebook owner)
CREATE POLICY "Guidebook owners can view marketplace orders" ON marketplace_orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM guidebooks 
    WHERE guidebooks.id = marketplace_orders.guidebook_id 
    AND (
      guidebooks.user_id = '00000000-0000-0000-0000-000000000001'::uuid OR 
      (auth.uid() IS NOT NULL AND guidebooks.user_id = auth.uid())
    )
  )
);

-- Allow system to insert orders
CREATE POLICY "System can insert marketplace orders" ON marketplace_orders
FOR INSERT
WITH CHECK (true);

-- Generate unique guest link slugs for existing guidebooks
UPDATE guidebooks 
SET guest_link_slug = CONCAT('guide-', SUBSTRING(id::text, 1, 8))
WHERE guest_link_slug IS NULL;