import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BookingData, Service, Option } from "../BookingApp";
import { Scissors, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceSelectionProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  salonId: string;
}

export const ServiceSelection = ({ 
  bookingData, 
  updateBookingData, 
  onNext,
  salonId,
}: ServiceSelectionProps) => {
  const [mainServices, setMainServices] = useState<Service[]>([]);
  const [additionalOptions, setAdditionalOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | undefined>(
    bookingData.service
  );
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    bookingData.options
  );

  useEffect(() => {
    fetchServices();
  }, [salonId]);

  const fetchServices = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("services")
        .select("*")
        .eq("salon_id", salonId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      const allServices = (data || []) as any[];
      const services = allServices.filter(s => !s.is_option).map(s => ({
        id: s.id,
        name: s.name,
        price: Number(s.price),
        duration: s.duration,
      }));

      const options = allServices.filter(s => s.is_option).map(s => ({
        id: s.id,
        name: s.name,
        price: Number(s.price),
        duration: s.duration,
      }));

      setMainServices(services);
      setAdditionalOptions(options);
    } catch (error) {
      toast.error("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    updateBookingData({ service });
  };

  const handleOptionToggle = (option: Option, checked: boolean) => {
    const newOptions = checked
      ? [...selectedOptions, option]
      : selectedOptions.filter(o => o.id !== option.id);
    
    setSelectedOptions(newOptions);
    updateBookingData({ options: newOptions });
  };

  const totalDuration = (selectedService?.duration || 0) + 
    selectedOptions.reduce((sum, option) => sum + option.duration, 0);

  const canProceed = selectedService !== undefined;

  if (loading) {
    return <div className="text-center py-8">Chargement des services...</div>;
  }

  if (mainServices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun service disponible pour ce salon
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          Choisissez votre service principal
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Sélectionnez le service principal de votre visite (obligatoire)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {mainServices.map((service) => (
            <Card
              key={service.id}
              className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-soft ${
                selectedService?.id === service.id
                  ? "ring-2 ring-accent bg-accent/5"
                  : "hover:border-accent/50"
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <Badge variant="secondary" className="ml-2">
                  {service.price}€
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Durée : {service.duration} min
              </p>
            </Card>
          ))}
        </div>
      </div>

      {additionalOptions.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            Options supplémentaires
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
            Ajoutez des services complémentaires (facultatif)
          </p>
          
          <div className="space-y-2 sm:space-y-3">
            {additionalOptions.map((option) => (
              <Card key={option.id} className="p-3 sm:p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.some(o => o.id === option.id)}
                    onCheckedChange={(checked) => 
                      handleOptionToggle(option, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={option.id}
                      className="font-medium cursor-pointer"
                    >
                      {option.name}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Durée : {option.duration} min
                    </p>
                  </div>
                  <Badge variant="outline">+{option.price}€</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="p-4 bg-accent/10 border-accent/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Total</p>
            <p className="text-sm text-muted-foreground">
              Durée estimée : {totalDuration} min
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">
              {bookingData.totalPrice}€
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
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
