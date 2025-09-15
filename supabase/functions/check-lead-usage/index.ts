import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { leadCaptureId } = await req.json();

    if (!leadCaptureId) {
      throw new Error('Lead capture ID is required');
    }

    // Use service role to securely check lead usage without exposing data
    const { data: lead, error } = await supabase
      .from('lead_captures')
      .select('total_questions_asked')
      .eq('id', leadCaptureId)
      .single();

    if (error) throw error;

    const remaining = Math.max(0, 10 - (lead?.total_questions_asked || 0));

    return new Response(
      JSON.stringify({ remaining }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error checking lead usage:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});