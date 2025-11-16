import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = "rado.raza@gmail.com";
    const password = "Codetux01";

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Erreur lors de la création du compte");
      }

      toast.success("Compte créé avec succès !");
      
      // Rediriger vers la page pour assigner le rôle admin
      setTimeout(() => {
        navigate("/admin/setup-role?user_id=" + data.user.id);
      }, 1000);
      
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-cream to-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Création compte admin</h1>
          <p className="text-muted-foreground mt-2">Configuration initiale</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label>Email</Label>
            <Input value="rado.raza@gmail.com" disabled />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input value="Codetux01" type="password" disabled />
          </div>
        </div>

        <Button onClick={handleSignup} className="w-full" disabled={loading}>
          {loading ? "Création..." : "Créer le compte admin"}
        </Button>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate("/")}>
            Retour à l'accueil
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSignup;
