-- Renommer la table holidays en planning et ajouter le support pour les absences de coiffeurs
ALTER TABLE public.holidays RENAME TO planning;

-- Ajouter une colonne pour spécifier le type (jour férié ou absence coiffeur)
ALTER TABLE public.planning ADD COLUMN type text NOT NULL DEFAULT 'holiday' CHECK (type IN ('holiday', 'barber_absence'));

-- Ajouter une colonne pour le coiffeur (null pour les jours fériés)
ALTER TABLE public.planning ADD COLUMN barber_id uuid REFERENCES public.barbers(id) ON DELETE CASCADE;

-- Ajouter une contrainte: si type = 'barber_absence', barber_id doit être renseigné
ALTER TABLE public.planning ADD CONSTRAINT planning_barber_check 
  CHECK (
    (type = 'holiday' AND barber_id IS NULL) OR 
    (type = 'barber_absence' AND barber_id IS NOT NULL)
  );

-- Recréer les policies avec le nouveau nom de table
DROP POLICY IF EXISTS "Admins can manage holidays" ON public.planning;
DROP POLICY IF EXISTS "Anyone can view holidays" ON public.planning;

CREATE POLICY "Admins can manage planning"
ON public.planning
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view planning"
ON public.planning
FOR SELECT
TO anon, authenticated
USING (true);