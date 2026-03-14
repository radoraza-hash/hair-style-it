import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface SalonSettingsProps {
  salonId: string | null;
  onSalonCreated: (id: string) => void;
}

export const SalonSettings = ({ salonId, onSalonCreated }: SalonSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    address: "",
    phone: "",
    logo_url: "",
  });

  useEffect(() => {
    if (salonId) fetchSalon();
  }, [salonId]);

  const fetchSalon = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("salons")
        .select("*")
        .eq("id", salonId)
        .single();
      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          address: data.address || "",
          phone: data.phone || "",
          logo_url: data.logo_url || "",
        });
      }
    } catch { toast.error("Erreur lors du chargement du salon"); }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Le nom est requis"); return; }

    const slug = formData.slug || generateSlug(formData.name);
    setLoading(true);

    try {
      if (salonId) {
        const { error } = await (supabase as any).from("salons").update({
          name: formData.name,
          slug,
          description: formData.description || null,
          address: formData.address || null,
          phone: formData.phone || null,
          logo_url: formData.logo_url || null,
        }).eq("id", salonId);
        if (error) throw error;
        toast.success("Salon mis à jour");
      } else {
        // Create salon
        const { data, error } = await (supabase as any).from("salons").insert({
          name: formData.name,
          slug,
          description: formData.description || null,
          address: formData.address || null,
          phone: formData.phone || null,
          logo_url: formData.logo_url || null,
        }).select().single();
        if (error) throw error;

        // Link admin to salon
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_roles").update({ salon_id: data.id } as any).eq("user_id", user.id).eq("role", "admin");
        }

        toast.success("Salon créé avec succès !");
        onSalonCreated(data.id);
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{salonId ? "Paramètres du salon" : "Créer votre salon"}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <Label>Nom du salon *</Label>
          <Input value={formData.name} onChange={(e) => {
            const name = e.target.value;
            setFormData({ ...formData, name, slug: generateSlug(name) });
          }} placeholder="Ex: Coiffeur Sahara" required />
        </div>

        <div>
          <Label>Slug (URL)</Label>
          <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="coiffeur-sahara" />
          <p className="text-xs text-muted-foreground mt-1">L'URL sera : /salon/{formData.slug || "..."}</p>
        </div>

        <div>
          <Label>Description</Label>
          <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Salon de coiffure professionnel..." />
        </div>

        <div>
          <Label>Adresse</Label>
          <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Rue de la Beauté, 75001 Paris" />
        </div>

        <div>
          <Label>Téléphone</Label>
          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="01 23 45 67 89" />
        </div>

        <div>
          <Label>URL du logo (optionnel)</Label>
          <Input value={formData.logo_url} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} placeholder="https://..." />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : salonId ? "Enregistrer" : "Créer le salon"}
        </Button>
      </form>
    </div>
  );
};
