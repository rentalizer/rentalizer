
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  user_email: string;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_email, user_id }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Rentalizer <support@rentalarbuniversity.com>",
      to: [user_email],
      subject: "Welcome to Rentalizer! Your Trial Access is Ready",
      html: `
        <h1>Welcome to Rentalizer!</h1>
        <p>Thank you for signing up for Rentalizer - your AI-powered rental arbitrage system.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0891b2;">
          <h3 style="color: #0891b2; margin: 0 0 10px 0;">🎉 Your Trial Access is Now Active!</h3>
          <p style="margin: 0;">You now have trial access to our market intelligence tools and property calculator.</p>
        </div>
        
        <h3>What you can do with your trial access:</h3>
        <ul>
          <li>🔍 Access market intelligence data</li>
          <li>📊 Use our property calculator</li>
          <li>📈 Analyze live Airbnb revenue data</li>
          <li>💰 Calculate ROI & cash flow</li>
        </ul>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Ready to get started?</h3>
          <p><a href="https://inspiring-genie-a1691.lovable.app/market-analysis" style="color: #0891b2; text-decoration: none;">🚀 Start analyzing properties now</a></p>
          <p><a href="https://inspiring-genie-a1691.lovable.app/pricing" style="color: #0891b2; text-decoration: none;">💎 Upgrade to unlock all features</a></p>
        </div>
        
        <p>If you have any questions or need help getting started, don't hesitate to reach out to us.</p>
        
        <p>Best regards,<br>The Rentalizer Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This email was sent because you created an account at Rentalizer. 
          If you didn't create this account, please ignore this email.
        </p>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
