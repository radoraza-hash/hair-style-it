import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Scissors } from "lucide-react";

interface Salon {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
}

const Index = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("salons")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setSalons(data || []);
    } catch (error) {
      console.error("Error fetching salons:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-cream to-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-cream to-background">
      <div className="container mx-auto px-4 py-8 sm:py-16 max-w-5xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <Scissors className="w-4 h-4" />
            <span className="text-sm font-medium">Réservation en ligne</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3">
            Choisissez votre salon
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Sélectionnez votre salon de coiffure pour réserver un rendez-vous
          </p>
        </div>

        {salons.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center max-w-md mx-auto">
            <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucun salon disponible</h2>
            <p className="text-muted-foreground">
              Les salons seront bientôt disponibles. Revenez plus tard !
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {salons.map((salon) => (
              <Card
                key={salon.id}
                className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                onClick={() => navigate(`/salon/${salon.slug}`)}
              >
                <div className="h-40 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center relative overflow-hidden">
                  {salon.logo_url ? (
                    <img
                      src={salon.logo_url}
                      alt={salon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Scissors className="w-16 h-16 text-accent/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <h2 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                    {salon.name}
                  </h2>
                </div>

                <div className="p-4 space-y-3">
                  {salon.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {salon.description}
                    </p>
                  )}

                  <div className="space-y-1.5">
                    {salon.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{salon.address}</span>
                      </div>
                    )}
                    {salon.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{salon.phone}</span>
                      </div>
                    )}
                  </div>

                  <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
                    Réserver →
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
