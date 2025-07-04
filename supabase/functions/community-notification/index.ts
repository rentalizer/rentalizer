import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'post' | 'comment';
  authorName: string;
  authorEmail?: string;
  content: string;
  postTitle?: string;
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
    const { type, authorName, authorEmail, content, postTitle }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification for user: ${authorName}`);

    const subject = type === 'post' 
      ? `New Community Post from ${authorName}`
      : `New Comment from ${authorName}`;

    const htmlContent = type === 'post'
      ? `
        <h2>New Community Post</h2>
        <p><strong>Author:</strong> ${authorName}</p>
        ${authorEmail ? `<p><strong>Email:</strong> ${authorEmail}</p>` : ''}
        <p><strong>Content:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${content}
        </div>
        <p>Visit the community to view the full post and engage with members.</p>
      `
      : `
        <h2>New Comment</h2>
        <p><strong>Author:</strong> ${authorName}</p>
        ${authorEmail ? `<p><strong>Email:</strong> ${authorEmail}</p>` : ''}
        <p><strong>Post:</strong> ${postTitle}</p>
        <p><strong>Comment:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${content}
        </div>
        <p>Visit the community to view the full conversation.</p>
      `;

    const emailResponse = await resend.emails.send({
      from: "Community Notifications <notifications@rentalarbuniversity.com>",
      to: ["support@rentalarbuniversity.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in community-notification function:", error);
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