import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookingData, Barber } from "../BookingApp";
import { User, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BarberSelectionProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const BarberSelection = ({ 
  bookingData, 
  updateBookingData, 
  onNext, 
  onPrev 
}: BarberSelectionProps) => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>(
    bookingData.barber
  );

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from("barbers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      setBarbers(data.map(b => ({
        id: b.id,
        name: b.name,
        avatar: b.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.name}`,
        specialties: b.specialties || []
      })));
    } catch (error: any) {
      toast.error("Erreur lors du chargement des coiffeurs");
    } finally {
      setLoading(false);
    }
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    updateBookingData({ barber });
  };

  const canProceed = selectedBarber !== undefined;

  if (loading) {
    return <div className="text-center py-8">Chargement des coiffeurs...</div>;
  }

  if (barbers.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Aucun coiffeur disponible</div>;
  }

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
                  <Avatar className="w-20 h-20 border-4 border-background shadow-soft">
                    <AvatarImage src={barber.avatar} alt={barber.name} />
                    <AvatarFallback>{barber.name[0]}</AvatarFallback>
                  </Avatar>
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