import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { BarbersManagement } from "@/components/admin/BarbersManagement";
import { PlanningManagement } from "@/components/admin/PlanningManagement";
import { ServicesManagement } from "@/components/admin/ServicesManagement";
import { SalonSettings } from "@/components/admin/SalonSettings";
import { LogOut, Calendar, Users, Scissors, Settings } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salonId, setSalonId] = useState<string | null>(null);
  const [salonName, setSalonName] = useState<string>("");

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role, salon_id")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (error || !roleData) {
        toast.error("Accès non autorisé");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      
      const userSalonId = (roleData as any).salon_id;
      if (userSalonId) {
        setSalonId(userSalonId);
        // Fetch salon name
        const { data: salonData } = await (supabase as any)
          .from("salons")
          .select("name")
          .eq("id", userSalonId)
          .single();
        if (salonData) setSalonName(salonData.name);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-cream to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-cream to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administration</h1>
            <p className="text-muted-foreground mt-1">
              {salonName ? `Gestion de ${salonName}` : "Gestion du salon de coiffure"}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {!salonId ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Aucun salon associé</h2>
            <p className="text-muted-foreground mb-4">
              Votre compte admin n'est pas encore associé à un salon. Créez votre salon pour commencer.
            </p>
            <SalonSettings salonId={null} onSalonCreated={(id) => {
              setSalonId(id);
              window.location.reload();
            }} />
          </Card>
        ) : (
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="bookings">
                <Calendar className="w-4 h-4 mr-2" />
                Réservations
              </TabsTrigger>
              <TabsTrigger value="barbers">
                <Users className="w-4 h-4 mr-2" />
                Coiffeurs
              </TabsTrigger>
              <TabsTrigger value="services">
                <Scissors className="w-4 h-4 mr-2" />
                Services
              </TabsTrigger>
              <TabsTrigger value="planning">
                <Calendar className="w-4 h-4 mr-2" />
                Planning
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Salon
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card className="p-6">
                <BookingsTable salonId={salonId} />
              </Card>
            </TabsContent>

            <TabsContent value="barbers">
              <Card className="p-6">
                <BarbersManagement salonId={salonId} />
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card className="p-6">
                <ServicesManagement salonId={salonId} />
              </Card>
            </TabsContent>

            <TabsContent value="planning">
              <Card className="p-6">
                <PlanningManagement salonId={salonId} />
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6">
                <SalonSettings salonId={salonId} onSalonCreated={() => {}} />
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;
