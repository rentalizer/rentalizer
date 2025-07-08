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

    // Get actual events from the database that need reminders
    const { data: events, error: eventsError } = await supabaseClient
      .from('events')
      .select('*')
      .eq('event_date', tomorrow.toISOString().split('T')[0])
      .eq('remind_members', true);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      throw eventsError;
    }

    console.log(`Found ${events?.length || 0} events for tomorrow that need reminders`);

    if (!events || events.length === 0) {
      console.log("No events found for tomorrow that require reminders");
      return new Response(JSON.stringify({ 
        success: true, 
        eventsChecked: 0,
        remindersSent: 0,
        message: "No events requiring reminders found for tomorrow"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

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

    let remindersSent = 0;

    // Send reminders for each event
    for (const event of events) {
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
              eventDate: event.event_date,
              eventTime: event.event_time,
              eventDescription: event.description,
              zoomLink: event.zoom_link,
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

    console.log(`Event reminder check completed. Sent ${remindersSent} reminders.`);

    return new Response(JSON.stringify({ 
      success: true, 
      eventsChecked: events.length,
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