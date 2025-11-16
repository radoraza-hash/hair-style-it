import heroImage from "@/assets/salon-hero.jpg";
import logo from "@/assets/barbershop-logo.png";

export const BookingHeader = () => {
  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <img 
          src={logo} 
          alt="Logo Barbershop" 
          className="w-24 h-24 object-contain"
        />
      </div>
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <img 
          src={heroImage} 
          alt="Salon de coiffure professionnel" 
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent flex items-end">
          <div className="p-6 text-white w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Réservez votre rendez-vous
            </h1>
            <p className="text-lg opacity-90">
              Salon de coiffure professionnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};