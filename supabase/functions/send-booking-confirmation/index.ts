import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  barberName: string;
  totalPrice: number;
  options: Array<{ name: string; price: number }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerName,
      customerEmail,
      serviceName,
      bookingDate,
      bookingTime,
      barberName,
      totalPrice,
      options,
    }: BookingConfirmationRequest = await req.json();

    console.log("Sending booking confirmation to:", customerEmail);

    const optionsHtml = options && options.length > 0
      ? `<ul>${options.map(opt => `<li>${opt.name} (+${opt.price}€)</li>`).join('')}</ul>`
      : '';

    const emailResponse = await resend.emails.send({
      from: "Dev Booking <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "Confirmation de votre rendez-vous (TEST)",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Bonjour ${customerName || 'cher client'},</h1>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Votre rendez-vous est bien enregistré ! ✅ (TEST)
          </p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #666; font-size: 18px; margin-top: 0;">Détails de votre rendez-vous</h2>
            
            <p><strong>📅 Date :</strong> ${new Date(bookingDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>🕐 Heure :</strong> ${bookingTime}</p>
            <p><strong>✂️ Service :</strong> ${serviceName}</p>
            ${options && options.length > 0 ? `<p><strong>➕ Options :</strong></p>${optionsHtml}` : ''}
            <p><strong>👤 Coiffeur :</strong> ${barberName}</p>
            <p><strong>💰 Prix total :</strong> ${totalPrice}€</p>
          </div>

          <p style="font-size: 14px; color: #666;">
            Nous vous attendons avec plaisir ! Si vous avez besoin de modifier ou annuler votre rendez-vous, 
            n'hésitez pas à nous contacter.
          </p>

          <p style="margin-top: 30px; font-size: 14px; color: #999;">
            Ceci est un email de TEST via resend.dev<br>
            À bientôt,<br>
            L'équipe du salon
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending booking confirmation:", error);
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
