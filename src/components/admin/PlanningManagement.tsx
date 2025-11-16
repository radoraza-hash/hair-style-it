import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PlanningEntry {
  id: string;
  date: string;
  description: string | null;
  type: 'holiday' | 'barber_absence';
  barber_id: string | null;
}

interface Barber {
  id: string;
  name: string;
}

export const PlanningManagement = () => {
  const [planningEntries, setPlanningEntries] = useState<PlanningEntry[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    type: "holiday" as 'holiday' | 'barber_absence',
    barber_id: "",
  });

  useEffect(() => {
    fetchPlanningEntries();
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from("barbers")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setBarbers(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des coiffeurs");
    }
  };

  const fetchPlanningEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("planning")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      setPlanningEntries((data || []) as PlanningEntry[]);
    } catch (error: any) {
      toast.error("Erreur lors du chargement du planning");
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

    if (formData.type === 'barber_absence' && !formData.barber_id) {
      toast.error("Veuillez sélectionner un coiffeur");
      return;
    }

    try {
      const { error } = await supabase.from("planning").insert({
        date: formData.date,
        description: formData.description || null,
        type: formData.type,
        barber_id: formData.type === 'barber_absence' ? formData.barber_id : null,
      });

      if (error) throw error;
      
      toast.success(formData.type === 'holiday' ? "Jour férié ajouté" : "Absence ajoutée");
      setFormData({ date: "", description: "", type: "holiday", barber_id: "" });
      setShowForm(false);
      fetchPlanningEntries();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette entrée ?")) return;

    try {
      const { error } = await supabase.from("planning").delete().eq("id", id);
      if (error) throw error;
      toast.success("Entrée supprimée");
      fetchPlanningEntries();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const getBarberName = (barberId: string | null) => {
    if (!barberId) return null;
    const barber = barbers.find(b => b.id === barberId);
    return barber?.name || "Coiffeur inconnu";
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Planning et absences</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une entrée
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'holiday' | 'barber_absence') => {
                  setFormData({ ...formData, type: value, barber_id: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="holiday">Jour férié / Fermeture salon</SelectItem>
                  <SelectItem value="barber_absence">Absence coiffeur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'barber_absence' && (
              <div>
                <Label htmlFor="barber">Coiffeur</Label>
                <Select
                  value={formData.barber_id}
                  onValueChange={(value) => setFormData({ ...formData, barber_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un coiffeur" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                placeholder="Ex: Jour de l'an, Congés, Maladie..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Ajouter</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ date: "", description: "", type: "holiday", barber_id: "" });
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {planningEntries.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Aucune entrée dans le planning
          </Card>
        ) : (
          planningEntries.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">
                      {format(new Date(entry.date), "EEEE d MMMM yyyy", { locale: fr })}
                    </div>
                    <div className="text-sm bg-accent/10 text-accent px-2 py-1 rounded">
                      {entry.type === 'holiday' ? 'Jour férié' : 'Absence'}
                    </div>
                  </div>
                  {entry.barber_id && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Coiffeur: {getBarberName(entry.barber_id)}
                    </div>
                  )}
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(entry.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};