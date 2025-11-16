-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create barbers table
CREATE TABLE public.barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar TEXT,
  specialties TEXT[] DEFAULT '{}',
  working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "18:00"}, "tuesday": {"start": "09:00", "end": "18:00"}, "wednesday": {"start": "09:00", "end": "18:00"}, "thursday": {"start": "09:00", "end": "18:00"}, "friday": {"start": "09:00", "end": "18:00"}, "saturday": {"start": "09:00", "end": "14:00"}, "sunday": null}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on barbers
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

-- RLS policies for barbers
CREATE POLICY "Anyone can view active barbers"
ON public.barbers FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage barbers"
ON public.barbers FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  service_price NUMERIC NOT NULL,
  options JSONB DEFAULT '[]',
  total_price NUMERIC NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for bookings
CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
ON public.bookings FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
ON public.bookings FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create holidays table for managing closed dates
CREATE TABLE public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on holidays
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view holidays"
ON public.holidays FOR SELECT
USING (true);

CREATE POLICY "Admins can manage holidays"
ON public.holidays FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default barbers
INSERT INTO public.barbers (name, avatar, specialties) VALUES
('Rado', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rado', ARRAY['Coupe homme', 'Barbe', 'Défrisage']),
('Raza', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raza', ARRAY['Coupe enfant', 'Brushing', 'Lissage brésilien']),
('Daynko', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daynko', ARRAY['Coupe + barbe', 'Barbe uniquement']);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_barbers_updated_at
BEFORE UPDATE ON public.barbers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();