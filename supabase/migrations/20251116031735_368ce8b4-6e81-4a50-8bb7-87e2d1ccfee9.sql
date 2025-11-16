-- Create a policy to allow inserting admin roles during initial setup
CREATE POLICY "Allow insert admin role for new users"
ON public.user_roles
FOR INSERT
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  )
  OR auth.uid() = user_id
);