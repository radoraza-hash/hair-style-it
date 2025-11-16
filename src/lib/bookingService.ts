import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const saveBooking = async (bookingData: any) => {
  if (!bookingData.service || !bookingData.barber || !bookingData.date || !bookingData.time || !bookingData.phone) {
    throw new Error("Données de réservation incomplètes");
  }

  const { data, error } = await supabase.from("bookings").insert({
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
  }).select().single();

  if (error) throw error;
  return data;
};
