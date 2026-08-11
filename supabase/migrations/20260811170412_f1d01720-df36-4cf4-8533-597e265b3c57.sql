CREATE TABLE public.cpd_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'Formation',
  hours numeric NOT NULL DEFAULT 0,
  reference text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cpd_entries TO authenticated;
GRANT ALL ON public.cpd_entries TO service_role;

ALTER TABLE public.cpd_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cpd_entries_select_own" ON public.cpd_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "cpd_entries_insert_own" ON public.cpd_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cpd_entries_update_own" ON public.cpd_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cpd_entries_delete_own" ON public.cpd_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX cpd_entries_user_date_idx ON public.cpd_entries (user_id, date DESC);

CREATE TRIGGER cpd_entries_updated_at BEFORE UPDATE ON public.cpd_entries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.cpd_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  annual_target_hours numeric NOT NULL DEFAULT 20,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cpd_settings TO authenticated;
GRANT ALL ON public.cpd_settings TO service_role;

ALTER TABLE public.cpd_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cpd_settings_select_own" ON public.cpd_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "cpd_settings_insert_own" ON public.cpd_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cpd_settings_update_own" ON public.cpd_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cpd_settings_delete_own" ON public.cpd_settings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER cpd_settings_updated_at BEFORE UPDATE ON public.cpd_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();