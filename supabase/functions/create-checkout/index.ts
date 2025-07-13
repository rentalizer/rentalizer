
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { plan, billing } = await req.json();
    logStep("Request data received", { plan, billing });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("Creating new customer");
    }

    // Define pricing based on plan and billing cycle
    const pricing = {
      essentials: {
        monthly: 195000, // $1,950 in cents
        yearly: 395000,  // $3,950 in cents
      },
      complete: {
        monthly: 295000, // $2,950 in cents
        yearly: 595000,  // $5,950 in cents
      },
      property_basic: {
        monthly: 2900,   // $29 in cents
        yearly: 29000,   // $290 in cents (annual discount)
      },
      property_premium: {
        monthly: 7900,   // $79 in cents
        yearly: 79000,   // $790 in cents (annual discount)
      },
      property_enterprise: {
        monthly: 19900,  // $199 in cents
        yearly: 199000,  // $1,990 in cents (annual discount)
      }
    };

    const planNames = {
      essentials: "Market Insights + Calculator",
      complete: "All-In-One System",
      property_basic: "Property Management Basic",
      property_premium: "Property Management Premium",
      property_enterprise: "Property Management Enterprise"
    };

    const amount = pricing[plan][billing];
    const planName = planNames[plan];
    const interval = billing === 'monthly' ? 'month' : 'year';

    logStep("Pricing calculated", { plan, billing, amount, planName, interval });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: planName,
              description: plan === 'essentials' 
                ? "AI-powered market research and rental arbitrage calculator"
                : plan === 'complete'
                ? "Complete rental arbitrage system with acquisitions and property management"
                : plan === 'property_basic'
                ? "Basic property tracking and rent collection tools"
                : plan === 'property_premium'
                ? "Advanced analytics and automated workflows for growing portfolios"
                : "Custom integrations and unlimited properties for large portfolios"
            },
            unit_amount: amount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        user_id: user.id,
        user_email: user.email,
        plan: plan,
        billing: billing
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
