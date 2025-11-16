import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { BookingData } from "../BookingApp";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isWeekend, addDays, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DateTimeSelectionProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Créneaux disponibles par jour
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export const DateTimeSelection = ({ 
  bookingData, 
  updateBookingData, 
  onNext, 
  onPrev 
}: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.date
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    bookingData.time
  );
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [barberAbsences, setBarberAbsences] = useState<{[key: string]: string[]}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClosedDates();
  }, []);

  useEffect(() => {
    if (selectedDate && bookingData.barber) {
      fetchUnavailableSlots(selectedDate, bookingData.barber.id);
    }
  }, [selectedDate, bookingData.barber]);

  const fetchClosedDates = async () => {
    try {
      const { data, error } = await supabase
        .from("planning")
        .select("*");

      if (error) throw error;

      // Récupérer les jours fériés
      const holidays = (data || [])
        .filter((entry: any) => entry.type === 'holiday')
        .map((entry: any) => entry.date);
      
      setClosedDates(holidays);

      // Récupérer les absences de coiffeurs
      const absences: {[key: string]: string[]} = {};
      (data || [])
        .filter((entry: any) => entry.type === 'barber_absence')
        .forEach((entry: any) => {
          if (!absences[entry.barber_id]) {
            absences[entry.barber_id] = [];
          }
          absences[entry.barber_id].push(entry.date);
        });
      
      setBarberAbsences(absences);
    } catch (error: any) {
      console.error("Error fetching closed dates:", error);
    }
  };

  const fetchUnavailableSlots = async (date: Date, barberId: string) => {
    setLoading(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      
      // Récupérer toutes les réservations pour ce coiffeur à cette date
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("barber_id", barberId)
        .eq("booking_date", dateStr)
        .eq("status", "confirmed");

      if (error) {
        console.error("Error details:", error);
        // Ne pas bloquer si erreur de permissions
        setUnavailableSlots([]);
        return;
      }

      const bookedSlots = (data || []).map((booking: any) => booking.booking_time);
      setUnavailableSlots(bookedSlots);
    } catch (error: any) {
      console.error("Error fetching unavailable slots:", error);
      setUnavailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(undefined); // Reset time when date changes
      updateBookingData({ date, time: undefined });
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateBookingData({ time });
  };

  const isDateDisabled = (date: Date) => {
    // Vérifier si la date est dans le passé
    if (isBefore(date, startOfDay(new Date()))) return true;
    
    // Vérifier si c'est le week-end
    if (isWeekend(date)) return true;
    
    // Vérifier si c'est un jour férié
    const dateStr = format(date, "yyyy-MM-dd");
    if (closedDates.includes(dateStr)) return true;
    
    // Vérifier si le coiffeur est absent
    if (bookingData.barber && barberAbsences[bookingData.barber.id]) {
      if (barberAbsences[bookingData.barber.id].includes(dateStr)) return true;
    }
    
    return false;
  };

  const canProceed = selectedDate && selectedTime;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          Choisissez date et heure
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Sélectionnez votre créneau de rendez-vous (fermé le week-end)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Calendar */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Choisir une date</h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              locale={fr}
              fromDate={new Date()}
              toDate={addDays(new Date(), 60)}
              className="rounded-md border-0"
            />
          </div>
        </Card>

        {/* Time slots */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            Créneaux disponibles
            {selectedDate && (
              <Badge variant="outline" className="ml-2">
                {format(selectedDate, "EEEE d MMMM", { locale: fr })}
              </Badge>
            )}
          </h3>
          
          {selectedDate ? (
            loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement des disponibilités...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((time) => {
                  const isUnavailable = unavailableSlots.includes(time);
                  const isSelected = selectedTime === time;
                  
                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={isUnavailable}
                      onClick={() => handleTimeSelect(time)}
                      className={`h-12 ${
                        isSelected ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      {time}
                      {isUnavailable && (
                        <span className="block text-xs opacity-60 mt-1">
                          Réservé
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Sélectionnez d'abord une date</p>
            </div>
          )}
        </Card>
      </div>

      {selectedDate && selectedTime && (
        <Card className="p-4 bg-accent/10 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Rendez-vous confirmé</p>
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })} à {selectedTime}
              </p>
            </div>
            <Badge className="bg-accent text-accent-foreground">
              Disponible
            </Badge>
          </div>
        </Card>
      )}

      <div className="flex justify-between">
        <Button 
          onClick={onPrev}
          variant="outline"
          size="lg"
        >
          Retour
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="min-w-32"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};