import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Edit, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  is_option: boolean;
  is_active: boolean;
  sort_order: number;
}

interface ServicesManagementProps {
  salonId: string;
}

export const ServicesManagement = ({ salonId }: ServicesManagementProps) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    is_option: false,
  });

  useEffect(() => { fetchServices(); }, [salonId]);

  const fetchServices = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("services")
        .select("*")
        .eq("salon_id", salonId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setServices(data || []);
    } catch { toast.error("Erreur lors du chargement des services"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Le nom est requis"); return; }
    if (!formData.price || !formData.duration) { toast.error("Prix et durée requis"); return; }

    try {
      if (editingService) {
        const { error } = await (supabase as any).from("services").update({
          name: formData.name,
          price: Number(formData.price),
          duration: Number(formData.duration),
          is_option: formData.is_option,
        }).eq("id", editingService.id);
        if (error) throw error;
        toast.success("Service modifié");
      } else {
        const { error } = await (supabase as any).from("services").insert({
          name: formData.name,
          price: Number(formData.price),
          duration: Number(formData.duration),
          is_option: formData.is_option,
          salon_id: salonId,
          sort_order: services.length,
        });
        if (error) throw error;
        toast.success("Service ajouté");
      }
      setFormData({ name: "", price: "", duration: "", is_option: false });
      setShowForm(false);
      setEditingService(null);
      fetchServices();
    } catch { toast.error("Erreur lors de l'enregistrement"); }
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: String(service.price),
      duration: String(service.duration),
      is_option: service.is_option,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return;
    try {
      const { error } = await (supabase as any).from("services").delete().eq("id", id);
      if (error) throw error;
      toast.success("Service supprimé");
      fetchServices();
    } catch { toast.error("Erreur lors de la suppression"); }
  };

  const toggleActive = async (service: ServiceItem) => {
    try {
      const { error } = await (supabase as any).from("services").update({ is_active: !service.is_active }).eq("id", service.id);
      if (error) throw error;
      toast.success(service.is_active ? "Service désactivé" : "Service activé");
      fetchServices();
    } catch { toast.error("Erreur lors de la modification"); }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  const mainServices = services.filter(s => !s.is_option);
  const options = services.filter(s => s.is_option);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des services</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingService(null); setFormData({ name: "", price: "", duration: "", is_option: false }); }}>
          <Plus className="w-4 h-4 mr-2" />Ajouter un service
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Nom du service</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Coupe homme" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Prix (€)</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="15" required /></div>
              <div><Label>Durée (min)</Label><Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="30" required /></div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_option" checked={formData.is_option} onCheckedChange={(checked) => setFormData({ ...formData, is_option: checked })} />
              <Label htmlFor="is_option">C'est une option supplémentaire (pas un service principal)</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingService ? "Modifier" : "Ajouter"}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingService(null); }}>Annuler</Button>
            </div>
          </form>
        </Card>
      )}

      {mainServices.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Services principaux</h3>
          <div className="space-y-2">
            {mainServices.map((service) => (
              <ServiceRow key={service.id} service={service} onEdit={handleEdit} onDelete={handleDelete} onToggle={toggleActive} />
            ))}
          </div>
        </div>
      )}

      {options.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Options supplémentaires</h3>
          <div className="space-y-2">
            {options.map((service) => (
              <ServiceRow key={service.id} service={service} onEdit={handleEdit} onDelete={handleDelete} onToggle={toggleActive} />
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          Aucun service configuré. Ajoutez vos services pour que les clients puissent réserver.
        </Card>
      )}
    </div>
  );
};

const ServiceRow = ({ service, onEdit, onDelete, onToggle }: {
  service: ServiceItem;
  onEdit: (s: ServiceItem) => void;
  onDelete: (id: string) => void;
  onToggle: (s: ServiceItem) => void;
}) => (
  <Card className={`p-4 ${!service.is_active ? "opacity-50" : ""}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{service.name}</h4>
          <Badge variant="secondary">{service.price}€</Badge>
          <Badge variant="outline">{service.duration} min</Badge>
          {!service.is_active && <Badge variant="secondary">Inactif</Badge>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(service)}><Edit className="w-3 h-3" /></Button>
        <Button size="sm" variant="outline" onClick={() => onToggle(service)}>{service.is_active ? "Désactiver" : "Activer"}</Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(service.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
      </div>
    </div>
  </Card>
);
