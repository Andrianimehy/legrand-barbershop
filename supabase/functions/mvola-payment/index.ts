import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === "POST") {
      const { reservation_id, amount, phone_number } = await req.json();

      if (!reservation_id || !amount || !phone_number) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: reservation_id, amount, phone_number" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if reservation exists
      const { data: reservation, error: resError } = await supabase
        .from("reservations")
        .select("id, full_name")
        .eq("id", reservation_id)
        .maybeSingle();

      if (resError || !reservation) {
        return new Response(
          JSON.stringify({ error: "Reservation not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          reservation_id,
          amount,
          phone_number,
          payment_method: "mvola",
          status: "processing",
        })
        .select()
        .single();

      if (paymentError) {
        throw paymentError;
      }

      // Simulate Mvola API call
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "pending",
          transaction_id: `MVOLA-${Date.now()}`,
        })
        .eq("id", payment.id);

      if (updateError) {
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment_id: payment.id,
          status: "pending",
          message: `Requête de paiement de ${amount} Ar envoyée à ${phone_number}. Veuillez confirmer sur votre téléphone Mvola.`,
          amount,
          phone_number: phone_number.replace(/\d(?=\d{2})/g, "*"),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "GET") {
      const url = new URL(req.url);
      const paymentId = url.searchParams.get("payment_id");

      if (!paymentId) {
        return new Response(
          JSON.stringify({ error: "Missing payment_id parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: payment, error } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .maybeSingle();

      if (error || !payment) {
        return new Response(
          JSON.stringify({ error: "Payment not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          payment_id: payment.id,
          status: payment.status,
          amount: payment.amount,
          payment_method: payment.payment_method,
          created_at: payment.created_at,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
