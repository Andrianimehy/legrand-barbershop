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

      // Réutiliser le paiement créé automatiquement par le trigger SQL.
      // Le statut est conservé : seul l'administrateur peut confirmer la réception.
      const { data: existingPayment, error: lookupError } = await supabase
        .from("payments")
        .select("id, status")
        .eq("reservation_id", reservation_id)
        .maybeSingle();

      if (lookupError) throw lookupError;

      let paymentId: string;
      let paymentStatus: string;

      if (existingPayment) {
        paymentId = existingPayment.id;
        paymentStatus = existingPayment.status;

        const { error: updateError } = await supabase
          .from("payments")
          .update({
            amount,
            phone_number,
            payment_method: "mvola",
            updated_at: new Date().toISOString(),
          })
          .eq("id", paymentId);

        if (updateError) throw updateError;
      } else {
        // Normalement le trigger a déjà créé la ligne. Ce fallback couvre
        // les cas où le trigger n'est pas installé. L'index unique protège
        // contre deux créations simultanées pour la même réservation.
        const { data: insertedPayment, error: insertError } = await supabase
          .from("payments")
          .insert({
            reservation_id,
            amount,
            phone_number,
            payment_method: "mvola",
            status: "pending",
          })
          .select("id, status")
          .single();

        if (insertError) {
          // Si un appel concurrent a créé la ligne entre-temps,
          // récupérer cette ligne au lieu de créer un doublon.
          if (insertError.code !== "23505") throw insertError;

          const { data: concurrentPayment, error: concurrentLookupError } = await supabase
            .from("payments")
            .select("id, status")
            .eq("reservation_id", reservation_id)
            .maybeSingle();

          if (concurrentLookupError) throw concurrentLookupError;
          if (!concurrentPayment) throw insertError;

          paymentId = concurrentPayment.id;
          paymentStatus = concurrentPayment.status;
        } else {
          paymentId = insertedPayment.id;
          paymentStatus = insertedPayment.status;
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment_id: paymentId,
          status: paymentStatus,
          message: `Paiement en attente de vérification manuelle. Après réception du transfert de ${amount} Ar sur MVola, l'administrateur pourra confirmer le paiement.`,
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
