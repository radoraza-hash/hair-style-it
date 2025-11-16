import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const saveBooking = async (bookingData: any) => {
  if (!bookingData.service || !bookingData.barber || !bookingData.date || !bookingData.time || !bookingData.phone) {
    throw new Error("Données de réservation incomplètes");
  }

  const { error } = await supabase.from("bookings").insert({
    customer_name: bookingData.name || null,
    customer_email: bookingData.email || null,
    customer_phone: bookingData.phone,
    barber_id: bookingData.barber.id,
    service_name: bookingData.service.name,
    service_price: bookingData.service.price,
    options: bookingData.options,
    total_price: bookingData.totalPrice,
    booking_date: format(bookingData.date, "yyyy-MM-dd"),
    booking_time: bookingData.time,
    status: "confirmed",
  });

  if (error) throw error;
  
  // Envoyer l'email de confirmation si l'email est fourni
  if (bookingData.email) {
    try {
      await supabase.functions.invoke("send-booking-confirmation", {
        body: {
          customerName: bookingData.name || "Client",
          customerEmail: bookingData.email,
          serviceName: bookingData.service.name,
          bookingDate: format(bookingData.date, "yyyy-MM-dd"),
          bookingTime: bookingData.time,
          barberName: bookingData.barber.name,
          totalPrice: bookingData.totalPrice,
          options: bookingData.options,
        },
      });
      console.log("Email de confirmation envoyé");
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // On ne bloque pas la réservation si l'email échoue
    }
  }
  
  return { success: true };
};

