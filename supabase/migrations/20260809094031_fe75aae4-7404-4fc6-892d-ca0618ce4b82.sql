CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES public.certifications(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'Nouvelle conversation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own chat threads" ON public.chat_threads
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER chat_threads_updated_at
  BEFORE UPDATE ON public.chat_threads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX chat_threads_user_updated_idx ON public.chat_threads (user_id, updated_at DESC);

ALTER TABLE public.ai_messages
  ADD COLUMN thread_id uuid REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  ADD COLUMN sources jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX ai_messages_thread_idx ON public.ai_messages (thread_id, created_at);