-- Enable the pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job to automatically aggregate news every hour
-- This will call the aggregate-news edge function every hour
SELECT cron.schedule(
  'auto-news-aggregation',
  '0 * * * *', -- Run every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://bmemylmcbmrieheutktb.supabase.co/functions/v1/aggregate-news',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZW15bG1jYm1yaWVoZXV0a3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTc3NTcsImV4cCI6MjA2NDAzMzc1N30.HNxI8Os1UggwawOzRNV7kjPPDOj9xmfAYtDsfiQdLEM"}'::jsonb,
        body:=concat('{"scheduled": true, "time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);