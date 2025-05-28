
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, message } = await req.json()
    
    console.log('📧 New contact message received:', {
      name,
      email,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    })

    // Send email notification using Resend
    const emailResponse = await resend.emails.send({
      from: "Rentalizer <notifications@istayusa.com>",
      to: ["rich@istayusa.com"],
      subject: `🔔 New Contact Message from ${name}`,
      html: `
        <h1>New Contact Message Received</h1>
        <p>You have received a new contact message through Rentalizer!</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Contact Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #0891b2;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <p style="margin-top: 30px; color: #666;">
          This notification was sent automatically from your Rentalizer contact form.
        </p>
      `,
    });

    console.log('📨 Email notification sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact notification sent successfully',
        emailId: emailResponse.data?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Error processing contact notification:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process contact notification',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
