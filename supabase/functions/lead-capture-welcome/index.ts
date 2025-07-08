import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone } = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Richie AI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Ask Richie AI - Your 10 Free Questions Await!",
      html: `
        <h1>Welcome ${name}!</h1>
        <p>You now have access to Ask Richie AI with <strong>10 free questions</strong> about rental arbitrage.</p>
        <p>Richie is our AI expert trained on real rental arbitrage knowledge to help you succeed.</p>
        <p>Start asking your questions and get expert guidance on:</p>
        <ul>
          <li>Market analysis and selection</li>
          <li>Property sourcing strategies</li>
          <li>Profit calculations</li>
          <li>Lease negotiations</li>
          <li>Scaling your business</li>
        </ul>
        <p>Best regards,<br>The Rentalizer Team</p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});