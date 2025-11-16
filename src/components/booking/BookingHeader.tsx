import heroImage from "@/assets/salon-hero.jpg";

export const BookingHeader = () => {
  return (
    <div className="text-center">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-8">
        <img 
          src={heroImage} 
          alt="Salon de coiffure professionnel" 
          className="w-full h-40 sm:h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent flex items-end">
          <div className="p-4 sm:p-6 text-white w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
              Réservez votre rendez-vous
            </h1>
            <p className="text-base sm:text-lg opacity-90">
              Salon de coiffure professionnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};