import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EventReminderRequest {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventDescription?: string;
  zoomLink?: string;
  location?: string;
  duration?: string;
  recipientEmail: string;
  recipientName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { 
      eventTitle, 
      eventDate, 
      eventTime, 
      eventDescription, 
      zoomLink, 
      location, 
      duration,
      recipientEmail,
      recipientName 
    }: EventReminderRequest = await req.json();

    console.log(`Sending event reminder to: ${recipientEmail} for event: ${eventTitle}`);

    // Format the event date nicely
    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #0891b2, #7c3aed); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Event Reminder</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">${eventTitle}</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #0891b2; font-weight: bold; margin-right: 10px;">📅</span>
              <span style="color: #374151; font-size: 16px;"><strong>Date:</strong> ${formattedDate}</span>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #0891b2; font-weight: bold; margin-right: 10px;">🕒</span>
              <span style="color: #374151; font-size: 16px;"><strong>Time:</strong> ${eventTime}${duration ? ` (${duration})` : ''}</span>
            </div>
            
            ${location ? `
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="color: #0891b2; font-weight: bold; margin-right: 10px;">📍</span>
                <span style="color: #374151; font-size: 16px;"><strong>Location:</strong> ${location}</span>
              </div>
            ` : ''}
          </div>
          
          ${eventDescription ? `
            <div style="margin: 20px 0;">
              <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">Description</h3>
              <p style="color: #6b7280; line-height: 1.6; margin: 0;">${eventDescription}</p>
            </div>
          ` : ''}
          
          ${zoomLink ? `
            <div style="background: #dbeafe; border: 1px solid #93c5fd; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #1e40af; margin: 0 0 10px 0; font-weight: bold;">Join the Event</p>
              <a href="${zoomLink}" style="color: #1d4ed8; text-decoration: none; word-break: break-all; font-family: monospace; background: white; padding: 8px; border-radius: 4px; display: inline-block;">${zoomLink}</a>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              This is a friendly reminder that your event is happening tomorrow!<br/>
              ${recipientName ? `Hi ${recipientName}, ` : ''}don't forget to join us.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              You're receiving this because you have event reminders enabled.<br/>
              Rental Arbitrage University Community
            </p>
          </div>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Events <events@rentalarbuniversity.com>",
      to: [recipientEmail],
      subject: `Reminder: ${eventTitle} - Tomorrow!`,
      html: htmlContent,
    });

    console.log("Event reminder sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-event-reminder function:", error);
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