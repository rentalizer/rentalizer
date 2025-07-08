-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to check for event reminders daily at 9:00 AM
SELECT cron.schedule(
  'check-event-reminders-daily',
  '0 9 * * *', -- Daily at 9:00 AM
  $$
  SELECT
    net.http_post(
        url:='https://bmemylmcbmrieheukktb.supabase.co/functions/v1/check-event-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZW15bG1jYm1yaWVoZXV0a3RiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ1Nzc1NywiZXhwIjoyMDY0MDMzNzU3fQ.CCTJ0r-p5W1xJQh1qKMbOhOb8v0zYH8z4sE6x-ITAU8"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Update the check-event-reminders function to query actual events from database instead of mock data
-- First, let's also update the function to work with real events from the events table