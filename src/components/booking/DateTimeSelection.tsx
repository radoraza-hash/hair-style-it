import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { BookingData } from "../BookingApp";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, isWeekend, addDays, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

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
    return isBefore(date, startOfDay(new Date())) || isWeekend(date);
  };

  // Simulated unavailable slots - in a real app, this would come from the backend
  const getUnavailableSlots = (date: Date) => {
    // Example: some slots are already booked
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 1) { // Monday
      return ["10:00", "14:30", "16:00"];
    }
    return ["11:30", "15:30"];
  };

  const unavailableSlots = selectedDate ? getUnavailableSlots(selectedDate) : [];
  const canProceed = selectedDate && selectedTime;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-accent" />
          Choisissez date et heure
        </h2>
        <p className="text-muted-foreground mb-6">
          Sélectionnez votre créneau de rendez-vous (fermé le week-end)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Choisir une date</h3>
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
        </Card>

        {/* Time slots */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Créneaux disponibles
            {selectedDate && (
              <Badge variant="outline" className="ml-2">
                {format(selectedDate, "EEEE d MMMM", { locale: fr })}
              </Badge>
            )}
          </h3>
          
          {selectedDate ? (
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
                        Indisponible
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
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