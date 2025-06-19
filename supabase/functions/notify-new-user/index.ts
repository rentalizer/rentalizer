

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewUserNotification {
  user_email: string;
  user_id: string;
  signup_timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_email, user_id, signup_timestamp }: NewUserNotification = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Rentalizer <support@rentalarbuniversity.com>",
      to: ["support@rentalarbuniversity.com"],
      subject: "🎉 New User Signup - Rentalizer",
      html: `
        <h1>New User Signup Alert</h1>
        <p>A new user has signed up for Rentalizer!</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>User Details:</h3>
          <p><strong>Email:</strong> ${user_email}</p>
          <p><strong>User ID:</strong> ${user_id}</p>
          <p><strong>Signup Time:</strong> ${new Date(signup_timestamp).toLocaleString()}</p>
        </div>
        
        <p>The user has been added with a trial subscription status.</p>
        
        <p>Best regards,<br>Rentalizer System</p>
      `,
    });

    console.log("New user notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-new-user function:", error);
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

