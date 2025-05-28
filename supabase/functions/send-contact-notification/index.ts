
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    // Here you would typically send an email notification
    // For now, we'll just log it to the function logs
    // You can add email service integration later (SendGrid, Resend, etc.)
    
    console.log('📋 Contact Details:')
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Message:', message)
    console.log('Received at:', new Date().toLocaleString())

    // TODO: Add email notification service here
    // Example with SendGrid or Resend:
    // await sendEmail({
    //   to: 'support@istayusa.com',
    //   subject: `New Contact Message from ${name}`,
    //   html: `
    //     <h3>New Contact Message</h3>
    //     <p><strong>From:</strong> ${name} (${email})</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //     <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
    //   `
    // })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact notification processed successfully' 
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
        error: 'Failed to process contact notification' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
