import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DMNotificationRequest {
  recipient_email: string;
  recipient_name: string;
  sender_name: string;
  message_preview: string;
  chat_url: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      recipient_email, 
      recipient_name, 
      sender_name, 
      message_preview, 
      chat_url 
    }: DMNotificationRequest = await req.json();

    console.log('Sending DM notification to:', recipient_email);

    const emailResponse = await resend.emails.send({
      from: "Rentalizer <notifications@resend.dev>",
      to: [recipient_email],
      subject: `New message from ${sender_name}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #0891b2, #7c3aed); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Message</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 16px;">
              Hi ${recipient_name},
            </p>
            
            <p style="font-size: 16px; color: #334155; margin-bottom: 16px;">
              You have a new message from <strong>${sender_name}</strong>:
            </p>
            
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #0891b2; margin: 16px 0;">
              <p style="font-style: italic; color: #64748b; margin: 0;">
                "${message_preview}"
              </p>
            </div>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${chat_url}" 
                 style="background: linear-gradient(135deg, #0891b2, #7c3aed); 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold;
                        display: inline-block;">
                View Message
              </a>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
              Best regards,<br>
              The Rentalizer Team
            </p>
          </div>
        </div>
      `,
    });

    console.log("DM notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-dm-notification function:", error);
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