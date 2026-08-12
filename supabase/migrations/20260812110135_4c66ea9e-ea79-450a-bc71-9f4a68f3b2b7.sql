CREATE TABLE public.user_manual_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  manual_id TEXT NOT NULL,
  section_id TEXT,
  read_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, manual_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_manual_progress TO authenticated;
GRANT ALL ON public.user_manual_progress TO service_role;

ALTER TABLE public.user_manual_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own manual progress"
ON public.user_manual_progress FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);