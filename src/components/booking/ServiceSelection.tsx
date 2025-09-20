import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BookingData, Service, Option } from "../BookingApp";
import { Scissors, Sparkles } from "lucide-react";

interface ServiceSelectionProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
}

const mainServices: Service[] = [
  { id: "coupe-enfant", name: "Coupe Enfant", price: 10, duration: 30 },
  { id: "coupe-homme", name: "Coupe simple homme", price: 15, duration: 45 },
  { id: "coupe-barbe", name: "Coupe + barbe", price: 20, duration: 60 },
  { id: "barbe-seule", name: "Barbe uniquement", price: 15, duration: 30 },
];

const additionalOptions: Option[] = [
  { id: "defrisage", name: "Défrisage", price: 15, duration: 45 },
  { id: "lissage", name: "Lissage brésilien", price: 30, duration: 90 },
  { id: "brushing", name: "Brushing", price: 10, duration: 20 },
];

export const ServiceSelection = ({ 
  bookingData, 
  updateBookingData, 
  onNext 
}: ServiceSelectionProps) => {
  const [selectedService, setSelectedService] = useState<Service | undefined>(
    bookingData.service
  );
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    bookingData.options
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Scissors className="w-6 h-6 text-accent" />
          Choisissez votre service principal
        </h2>
        <p className="text-muted-foreground mb-6">
          Sélectionnez le service principal de votre visite (obligatoire)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainServices.map((service) => (
            <Card
              key={service.id}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-soft ${
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

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Options supplémentaires
        </h3>
        <p className="text-muted-foreground mb-4">
          Ajoutez des services complémentaires (facultatif)
        </p>
        
        <div className="space-y-3">
          {additionalOptions.map((option) => (
            <Card key={option.id} className="p-4">
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