import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const AdminSetupRole = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    assignAdminRole();
  }, []);

  const assignAdminRole = async () => {
    const userId = searchParams.get("user_id");
    
    if (!userId) {
      setStatus("error");
      toast.error("ID utilisateur manquant");
      return;
    }

    try {
      // Utiliser le service role pour insérer le rôle admin
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin"
        });

      if (error) {
        // Si l'erreur est due aux permissions RLS, on utilise une fonction SQL
        console.error("Erreur RLS:", error);
        toast.error("Veuillez contacter l'administrateur pour finaliser la configuration");
        setStatus("error");
        return;
      }

      setStatus("success");
      toast.success("Rôle admin assigné avec succès !");
      
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
      
    } catch (error: any) {
      console.error("Erreur:", error);
      setStatus("error");
      toast.error("Erreur lors de l'assignation du rôle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-cream to-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-bold mb-2">Configuration en cours...</h2>
              <p className="text-muted-foreground">Assignation du rôle administrateur</p>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Configuration terminée !</h2>
              <p className="text-muted-foreground">Redirection vers la page de connexion...</p>
            </>
          )}
          
          {status === "error" && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Erreur de configuration</h2>
              <p className="text-muted-foreground">Une erreur est survenue</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminSetupRole;
