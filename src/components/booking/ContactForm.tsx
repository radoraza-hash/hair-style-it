import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookingData } from "../BookingApp";
import { Phone, User } from "lucide-react";

interface ContactFormProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ContactForm = ({ 
  bookingData, 
  updateBookingData, 
  onNext, 
  onPrev 
}: ContactFormProps) => {
  const [phone, setPhone] = useState(bookingData.phone);
  const [name, setName] = useState(bookingData.name || "");
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (phoneNumber: string) => {
    // French phone number validation (simple pattern)
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneError && value) {
      setPhoneError("");
    }
    updateBookingData({ phone: value });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    updateBookingData({ name: value });
  };

  const handleNext = () => {
    if (!phone.trim()) {
      setPhoneError("Le numéro de téléphone est obligatoire");
      return;
    }
    
    if (!validatePhone(phone)) {
      setPhoneError("Veuillez entrer un numéro de téléphone valide");
      return;
    }

    setPhoneError("");
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-accent" />
          Vos informations de contact
        </h2>
        <p className="text-muted-foreground mb-6">
          Renseignez vos coordonnées pour finaliser la réservation
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium">
            Nom (optionnel)
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="h-12"
          />
          <p className="text-sm text-muted-foreground">
            Pour personnaliser votre accueil
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-medium">
            Numéro de téléphone *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`h-12 pl-10 ${phoneError ? "border-destructive" : ""}`}
            />
          </div>
          {phoneError && (
            <p className="text-sm text-destructive">{phoneError}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Nous vous contacterons si nécessaire pour confirmer votre rendez-vous
          </p>
        </div>
      </Card>

      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Protection de vos données</p>
            <p>
              Vos informations personnelles sont utilisées uniquement pour la gestion 
              de votre rendez-vous et ne seront pas partagées avec des tiers.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button 
          onClick={onPrev}
          variant="outline"
          size="lg"
        >
          Retour
        </Button>
        <Button 
          onClick={handleNext}
          size="lg"
          className="min-w-32"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};