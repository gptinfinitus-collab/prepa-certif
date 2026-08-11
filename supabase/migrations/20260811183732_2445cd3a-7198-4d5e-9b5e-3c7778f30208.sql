CREATE TABLE public.user_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  category text NOT NULL DEFAULT 'Autre',
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_links TO authenticated;
GRANT ALL ON public.user_links TO service_role;

ALTER TABLE public.user_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own links" ON public.user_links FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own links" ON public.user_links FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own links" ON public.user_links FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own links" ON public.user_links FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX user_links_user_id_idx ON public.user_links (user_id);

CREATE TRIGGER set_user_links_updated_at
BEFORE UPDATE ON public.user_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();