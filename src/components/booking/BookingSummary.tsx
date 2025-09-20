import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingData } from "../BookingApp";
import { Calendar, Clock, User, Phone, Scissors, Check } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingSummaryProps {
  bookingData: BookingData;
  onConfirm: () => void;
  onPrev: () => void;
}

export const BookingSummary = ({ 
  bookingData, 
  onConfirm, 
  onPrev 
}: BookingSummaryProps) => {
  const totalDuration = (bookingData.service?.duration || 0) + 
    bookingData.options.reduce((sum, option) => sum + option.duration, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Check className="w-6 h-6 text-accent" />
          Récapitulatif de votre réservation
        </h2>
        <p className="text-muted-foreground mb-6">
          Vérifiez les détails de votre rendez-vous avant de confirmer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-accent" />
            Services choisis
          </h3>
          
          <div className="space-y-4">
            {bookingData.service && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{bookingData.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingData.service.duration} min
                  </p>
                </div>
                <Badge variant="secondary">
                  {bookingData.service.price}€
                </Badge>
              </div>
            )}
            
            {bookingData.options.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Options :</p>
                  {bookingData.options.map((option) => (
                    <div key={option.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-muted-foreground">
                          +{option.duration} min
                        </p>
                      </div>
                      <Badge variant="outline">
                        +{option.price}€
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <Separator />
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span className="text-accent">{bookingData.totalPrice}€</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Durée totale estimée : {totalDuration} min
            </p>
          </div>
        </Card>

        {/* Appointment details */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Détails du rendez-vous</h3>
          
          <div className="space-y-4">
            {bookingData.barber && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Coiffeur</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingData.barber.name}
                  </p>
                </div>
              </div>
            )}
            
            {bookingData.date && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(bookingData.date, "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            )}
            
            {bookingData.time && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Heure</p>
                  <p className="text-sm text-muted-foreground">
                    {bookingData.time}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">
                  {bookingData.name && `${bookingData.name} - `}
                  {bookingData.phone}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-accent/10 border-accent/20">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
          <div className="text-sm">
            <p className="font-medium mb-1">Conditions de réservation</p>
            <p className="text-muted-foreground">
              Merci d'arriver 5 minutes avant votre rendez-vous. 
              En cas d'empêchement, veuillez nous prévenir au moins 2 heures à l'avance.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button 
          onClick={onPrev}
          variant="outline"
          size="lg"
        >
          Modifier
        </Button>
        <Button 
          onClick={onConfirm}
          size="lg"
          className="min-w-40 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Confirmer la réservation
        </Button>
      </div>
    </div>
  );
};