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
    <div className="mb-8">
      {/* Desktop version */}
      <div className="hidden md:flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  currentStep > step.number
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground shadow-xl scale-110 ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    currentStep === step.number
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-1 flex-1 transition-all duration-300 mx-2",
                  currentStep > step.number
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile version - compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  currentStep > step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4 transition-all",
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-primary">
            {steps[currentStep - 1].title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>
    </div>
  );
};