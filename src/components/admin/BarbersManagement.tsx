import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Barber {
  id: string;
  name: string;
  avatar: string | null;
  specialties: string[];
  is_active: boolean;
}

export const BarbersManagement = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    specialties: "",
  });

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from("barbers")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setBarbers(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des coiffeurs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }

    const specialtiesArray = formData.specialties
      .split(",")
      .map(s => s.trim())
      .filter(s => s);

    try {
      if (editingBarber) {
        const { error } = await supabase
          .from("barbers")
          .update({
            name: formData.name,
            avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
            specialties: specialtiesArray,
          })
          .eq("id", editingBarber.id);

        if (error) throw error;
        toast.success("Coiffeur modifié");
      } else {
        const { error } = await supabase.from("barbers").insert({
          name: formData.name,
          avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
          specialties: specialtiesArray,
        });

        if (error) throw error;
        toast.success("Coiffeur ajouté");
      }

      setFormData({ name: "", avatar: "", specialties: "" });
      setShowForm(false);
      setEditingBarber(null);
      fetchBarbers();
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (barber: Barber) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.name,
      avatar: barber.avatar || "",
      specialties: barber.specialties.join(", "),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce coiffeur ?")) return;

    try {
      const { error } = await supabase.from("barbers").delete().eq("id", id);
      if (error) throw error;
      toast.success("Coiffeur supprimé");
      fetchBarbers();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const toggleActive = async (barber: Barber) => {
    try {
      const { error } = await supabase
        .from("barbers")
        .update({ is_active: !barber.is_active })
        .eq("id", barber.id);

      if (error) throw error;
      toast.success(barber.is_active ? "Coiffeur désactivé" : "Coiffeur activé");
      fetchBarbers();
    } catch (error: any) {
      toast.error("Erreur lors de la modification");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des coiffeurs</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un coiffeur
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du coiffeur"
                required
              />
            </div>

            <div>
              <Label htmlFor="avatar">URL de l'avatar (optionnel)</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                placeholder="Coupe homme, Barbe, Défrisage"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingBarber ? "Modifier" : "Ajouter"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingBarber(null);
                  setFormData({ name: "", avatar: "", specialties: "" });
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => (
          <Card key={barber.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={barber.avatar || undefined} />
                <AvatarFallback>{barber.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{barber.name}</h3>
                  <Badge variant={barber.is_active ? "default" : "secondary"}>
                    {barber.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {barber.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(barber)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(barber)}
                  >
                    {barber.is_active ? "Désactiver" : "Activer"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(barber.id)}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
