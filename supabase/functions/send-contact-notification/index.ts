
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

    // For now, just log the contact message since Resend might need verification
    console.log('📋 Contact Details:')
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Message:', message)
    console.log('Received at:', new Date().toLocaleString())

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact message received successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Error processing contact message:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process contact message',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
