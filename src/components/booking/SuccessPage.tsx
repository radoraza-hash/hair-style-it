import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Calendar, Phone, Home } from "lucide-react";
import { SalonData } from "@/pages/SalonBooking";

interface SuccessPageProps {
  onNewBooking: () => void;
  salon: SalonData;
}

export const SuccessPage = ({ onNewBooking, salon }: SuccessPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-cream to-background flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl p-8 text-center shadow-soft">
        <div className="mb-6">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Votre rendez-vous est confirmé !
          </h1>
          <p className="text-lg text-muted-foreground">
            Nous avons hâte de vous accueillir chez {salon.name}
          </p>
        </div>

        <Card className="p-6 bg-accent/5 border-accent/20 mb-8">
          <h2 className="font-semibold mb-4 text-primary">Que faire maintenant ?</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Confirmation par SMS</p>
                <p className="text-sm text-muted-foreground">
                  Vous recevrez un SMS de confirmation avec tous les détails
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Rappel automatique</p>
                <p className="text-sm text-muted-foreground">
                  Nous vous enverrons un rappel la veille de votre rendez-vous
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Arrivée au salon</p>
                <p className="text-sm text-muted-foreground">
                  Merci d'arriver 5 minutes avant votre rendez-vous
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Une question ? Besoin de modifier votre rendez-vous ?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onNewBooking} variant="outline" size="lg" className="min-w-40">
              Nouveau rendez-vous
            </Button>
            {salon.phone && (
              <Button size="lg" className="min-w-40" onClick={() => window.location.href = `tel:${salon.phone}`}>
                Nous contacter
              </Button>
            )}
          </div>
          <Button variant="link" onClick={() => navigate("/")}>
            ← Retour à la liste des salons
          </Button>
        </div>

        {salon.address && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              📍 {salon.address}<br />
              {salon.phone && <>📞 {salon.phone}<br /></>}
              🕒 Ouvert du lundi au vendredi, 9h-18h
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
