import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Holiday {
  id: string;
  date: string;
  description: string | null;
}

export const HolidaysManagement = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const { data, error } = await supabase
        .from("holidays")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      setHolidays(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des jours fériés");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date) {
      toast.error("La date est requise");
      return;
    }

    try {
      const { error } = await supabase.from("holidays").insert({
        date: formData.date,
        description: formData.description || null,
      });

      if (error) throw error;
      
      toast.success("Jour férié ajouté");
      setFormData({ date: "", description: "" });
      setShowForm(false);
      fetchHolidays();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce jour férié ?")) return;

    try {
      const { error } = await supabase.from("holidays").delete().eq("id", id);
      if (error) throw error;
      toast.success("Jour férié supprimé");
      fetchHolidays();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Jours fériés et fermetures</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un jour férié
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optionnel)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Jour de l'an, Fermeture annuelle..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Ajouter</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ date: "", description: "" });
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {holidays.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun jour férié configuré
          </div>
        ) : (
          holidays.map((holiday) => (
            <Card key={holiday.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {format(new Date(holiday.date), "EEEE dd MMMM yyyy", { locale: fr })}
                </p>
                {holiday.description && (
                  <p className="text-sm text-muted-foreground">{holiday.description}</p>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(holiday.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
