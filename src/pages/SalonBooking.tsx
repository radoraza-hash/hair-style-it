import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BookingApp from "@/components/BookingApp";

export interface SalonData {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  primary_color: string | null;
}

const SalonBooking = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [salon, setSalon] = useState<SalonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchSalon(slug);
  }, [slug]);

  const fetchSalon = async (salonSlug: string) => {
    try {
      const { data, error } = await supabase
        .from("salons")
        .select("*")
        .eq("slug", salonSlug)
        .single();

      if (error || !data) {
        navigate("/");
        return;
      }

      setSalon(data);
    } catch {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-cream to-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!salon) return null;

  return <BookingApp salon={salon} />;
};

export default SalonBooking;
