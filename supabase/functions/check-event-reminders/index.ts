import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// This function should be called daily via cron to check for events happening in 24 hours
// and send reminder emails to members

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("Checking for events that need reminders...");

    // Calculate tomorrow's date range (24 hours from now)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set time ranges for tomorrow (start and end of day)
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);
    
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    console.log(`Looking for events between ${tomorrowStart.toISOString()} and ${tomorrowEnd.toISOString()}`);

    // For now, we'll use a mock events array since events are stored in localStorage
    // In a real implementation, you'd want to store events in the database
    // This is a simplified version that demonstrates how it would work

    // Get all active members who should receive reminders
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('user_id, display_name')
      .not('display_name', 'is', null);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    console.log(`Found ${profiles?.length || 0} members to potentially send reminders to`);

    // Get user emails from auth (this would need to be done by the service role)
    // Note: In a real implementation, you might want to store email preferences in profiles table
    
    // Mock event data for demonstration - in reality, you'd query your events table
    const mockEventsForTomorrow = [
      {
        id: "demo-event-1",
        title: "Weekly Live Training",
        date: tomorrow.toISOString().split('T')[0], // YYYY-MM-DD format
        time: "5:00 PM PST",
        duration: "1 hour",
        location: "Zoom",
        zoomLink: "https://us06web.zoom.us/j/84255424839?pwd=803338",
        description: "Join us for our weekly live training session where we discuss market trends and answer your questions.",
        remindMembers: true,
        attendees: "All members"
      }
    ];

    let remindersSent = 0;

    // Send reminders for each event that has remindMembers = true
    for (const event of mockEventsForTomorrow) {
      if (event.remindMembers) {
        console.log(`Processing reminders for event: ${event.title}`);
        
        // Send reminder to all members (or filter based on attendees field)
        for (const profile of profiles || []) {
          try {
            // Get user email from auth
            const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(profile.user_id);
            
            if (userError || !userData.user?.email) {
              console.log(`Could not get email for user ${profile.user_id}`);
              continue;
            }

            // Call the send-event-reminder function
            const reminderResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-event-reminder`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              },
              body: JSON.stringify({
                eventTitle: event.title,
                eventDate: event.date,
                eventTime: event.time,
                eventDescription: event.description,
                zoomLink: event.zoomLink,
                location: event.location,
                duration: event.duration,
                recipientEmail: userData.user.email,
                recipientName: profile.display_name
              })
            });

            if (reminderResponse.ok) {
              remindersSent++;
              console.log(`Reminder sent to ${userData.user.email} for event: ${event.title}`);
            } else {
              console.error(`Failed to send reminder to ${userData.user.email}`);
            }
          } catch (error) {
            console.error(`Error sending reminder to ${profile.user_id}:`, error);
          }
        }
      }
    }

    console.log(`Event reminder check completed. Sent ${remindersSent} reminders.`);

    return new Response(JSON.stringify({ 
      success: true, 
      eventsChecked: mockEventsForTomorrow.length,
      remindersSent: remindersSent,
      message: `Successfully sent ${remindersSent} event reminders`
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in check-event-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);