ALTER TABLE public.user_flashcard_progress
  ADD COLUMN IF NOT EXISTS user_answer text,
  ADD COLUMN IF NOT EXISTS evaluation_status text,
  ADD COLUMN IF NOT EXISTS evaluation_feedback text,
  ADD COLUMN IF NOT EXISTS evaluated_at timestamp with time zone;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_flashcard_progress TO authenticated;
GRANT ALL ON public.user_flashcard_progress TO service_role;

ALTER TABLE public.user_flashcard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own flashcard progress"
  ON public.user_flashcard_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);