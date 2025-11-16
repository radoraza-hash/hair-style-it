-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create a new permissive policy that allows unauthenticated users to insert bookings
CREATE POLICY "Public can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);