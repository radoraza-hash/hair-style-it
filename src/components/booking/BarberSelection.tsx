import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingData, Barber } from "../BookingApp";
import { User, Star } from "lucide-react";

interface BarberSelectionProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const barbers: Barber[] = [
  {
    id: "rado",
    name: "Rado",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialties: ["Coupe moderne", "Barbe", "Défrisage"]
  },
  {
    id: "raza",
    name: "Raza",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    specialties: ["Coupe classique", "Lissage", "Brushing"]
  },
  {
    id: "daynko",
    name: "Daynko",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    specialties: ["Coupe enfant", "Coupe + barbe", "Style créatif"]
  }
];

export const BarberSelection = ({ 
  bookingData, 
  updateBookingData, 
  onNext, 
  onPrev 
}: BarberSelectionProps) => {
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>(
    bookingData.barber
  );

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    updateBookingData({ barber });
  };

  const canProceed = selectedBarber !== undefined;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-accent" />
          Choisissez votre coiffeur
        </h2>
        <p className="text-muted-foreground mb-6">
          Sélectionnez le coiffeur qui s'occupera de vous
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <Card
              key={barber.id}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-soft text-center ${
                selectedBarber?.id === barber.id
                  ? "ring-2 ring-accent bg-accent/5"
                  : "hover:border-accent/50"
              }`}
              onClick={() => handleBarberSelect(barber)}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-soft"
                  />
                  {selectedBarber?.id === barber.id && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">{barber.name}</h3>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {barber.specialties.map((specialty, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

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