import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Service", description: "Choisir le service" },
  { number: 2, title: "Coiffeur", description: "Sélectionner le coiffeur" },
  { number: 3, title: "Date & Heure", description: "Créneaux disponibles" },
  { number: 4, title: "Contact", description: "Vos informations" },
  { number: 5, title: "Récapitulatif", description: "Confirmer la réservation" },
];

export const BookingSteps = ({ currentStep }: BookingStepsProps) => {
  return (
    <div className="flex items-center justify-between mb-8 overflow-x-auto">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center min-w-0 flex-1">
          <div className="flex flex-col items-center min-w-0 flex-1">
            {/* Step circle */}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-all duration-300",
                currentStep > step.number
                  ? "bg-accent text-accent-foreground shadow-gold"
                  : currentStep === step.number
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            
            {/* Step text */}
            <div className="text-center min-w-0">
              <div
                className={cn(
                  "font-medium text-sm",
                  currentStep >= step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {step.description}
              </div>
            </div>
          </div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-8 md:w-16 mx-2 transition-colors duration-300",
                currentStep > step.number ? "bg-accent" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};