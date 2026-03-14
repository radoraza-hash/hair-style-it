import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SalonData } from "@/pages/SalonBooking";
import heroImage from "@/assets/salon-hero.jpg";

interface BookingHeaderProps {
  salon: SalonData;
}

export const BookingHeader = ({ salon }: BookingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <div className="flex justify-start mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Autres salons
        </Button>
      </div>
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-8">
        <img 
          src={salon.logo_url || heroImage} 
          alt={salon.name} 
          className="w-full h-40 sm:h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent flex items-end">
          <div className="p-4 sm:p-6 text-white w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
              {salon.name}
            </h1>
            <p className="text-base sm:text-lg opacity-90">
              {salon.description || "Réservez votre rendez-vous"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
