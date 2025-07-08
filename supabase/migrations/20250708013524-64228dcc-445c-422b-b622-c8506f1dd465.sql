-- Insert some sample news items to test the scrolling functionality
INSERT INTO public.news_items (
  source, title, url, summary, published_at, tags, status, admin_submitted
) VALUES 
(
  'AirDNA',
  'Short-Term Rental Demand Surges 25% in Q4 2024',
  'https://www.airdna.co/blog/str-demand-q4-2024',
  'New data shows unprecedented growth in short-term rental bookings across major markets, driven by remote work trends and holiday travel.',
  NOW() - INTERVAL '2 hours',
  ARRAY['Market Trends', 'Analytics'],
  'published',
  true
),
(
  'Hospitable',
  'New AI-Powered Guest Communication Features Released',
  'https://www.hospitable.com/blog/ai-guest-communication',
  'Revolutionary AI tools now help hosts respond to guest inquiries 3x faster with personalized, contextual messaging.',
  NOW() - INTERVAL '4 hours',
  ARRAY['Tech Updates', 'Software'],
  'published',
  true
),
(
  'VRM Intel',
  'Regulatory Changes Impact STR Operations in 15 Cities',
  'https://vrmintel.com/regulatory-updates-2024',
  'Local governments implement new licensing requirements and occupancy limits affecting thousands of rental properties.',
  NOW() - INTERVAL '6 hours',
  ARRAY['Regulations', 'Legal'],
  'published',
  true
),
(
  'PriceLabs',
  'Dynamic Pricing Strategies Boost Revenue by 18%',
  'https://pricelabs.co/revenue-optimization-guide',
  'Latest research reveals how smart pricing algorithms are helping hosts maximize earnings in competitive markets.',
  NOW() - INTERVAL '8 hours',
  ARRAY['Pricing', 'Analytics'],
  'published',
  true
),
(
  'BiggerPockets',
  'STR Investment Guide: Finding Your First Rental Property',
  'https://biggerpockets.com/str-investment-guide-2024',
  'Comprehensive guide covering market analysis, financing options, and due diligence for new short-term rental investors.',
  NOW() - INTERVAL '12 hours',
  ARRAY['Investment', 'Education'],
  'published',
  true
),
(
  'Guesty',
  'Multi-Channel Distribution Increases Bookings by 35%',
  'https://guesty.com/multi-channel-distribution',
  'Property managers using multiple booking platforms see significant increase in occupancy rates and revenue.',
  NOW() - INTERVAL '1 day',
  ARRAY['Operations', 'Software'],
  'published',
  true
),
(
  'Skift',
  'Travel Industry Outlook: STR Growth Continues in 2025',
  'https://skift.com/str-outlook-2025',
  'Industry experts predict continued expansion of short-term rental sector despite economic uncertainties.',
  NOW() - INTERVAL '1 day 4 hours',
  ARRAY['Industry News', 'Market Trends'],
  'published',
  true
),
(
  'Wheelhouse',
  'Seasonal Pricing Optimization for Maximum ROI',
  'https://wheelhouse.com/seasonal-pricing-2024',
  'Data-driven insights on adjusting rental rates throughout the year to capture peak demand periods.',
  NOW() - INTERVAL '1 day 8 hours',
  ARRAY['Pricing', 'Analytics'],
  'published',
  true
);