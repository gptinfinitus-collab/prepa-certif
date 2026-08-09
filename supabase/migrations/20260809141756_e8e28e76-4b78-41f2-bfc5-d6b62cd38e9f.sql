CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "user_roles_read_own" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS disabled_at TIMESTAMPTZ;

CREATE POLICY "profiles_super_admin_read" ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::public.app_role FROM auth.users WHERE lower(email) = 'gptinfinitus@gmail.com'
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.bootstrap_super_admin() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'gptinfinitus@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_bootstrap_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.bootstrap_super_admin();