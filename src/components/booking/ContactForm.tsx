import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookingData } from "../BookingApp";
import { Phone, User, Mail } from "lucide-react";
import { z } from "zod";

interface ContactFormProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const contactSchema = z.object({
  phone: z.string().min(10, "Numéro de téléphone invalide").max(15, "Numéro de téléphone trop long"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  name: z.string().max(100, "Nom trop long").optional(),
});

export const ContactForm = ({ 
  bookingData, 
  updateBookingData, 
  onNext, 
  onPrev 
}: ContactFormProps) => {
  const [phone, setPhone] = useState(bookingData.phone);
  const [email, setEmail] = useState(bookingData.email || "");
  const [name, setName] = useState(bookingData.name || "");
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});

  const handleNext = () => {
    const validation = contactSchema.safeParse({ phone, email, name });
    
    if (!validation.success) {
      const newErrors: { phone?: string; email?: string } = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) newErrors[err.path[0] as keyof typeof newErrors] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
          <Label htmlFor="name">Nom (optionnel)</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => { setName(e.target.value); updateBookingData({ name: e.target.value }); }}
            placeholder="Votre nom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optionnel)</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); updateBookingData({ email: e.target.value }); }}
              placeholder="votre@email.com"
              className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Numéro de téléphone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); updateBookingData({ phone: e.target.value }); }}
              placeholder="06 12 34 56 78"
              className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
            />
          </div>
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </Card>

      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Protection de vos données</p>
            <p>
              Vos informations personnelles sont sécurisées et ne seront utilisées
              que pour gérer votre rendez-vous.
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
