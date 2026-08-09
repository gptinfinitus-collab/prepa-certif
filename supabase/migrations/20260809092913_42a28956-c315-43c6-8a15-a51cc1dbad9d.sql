CREATE TABLE public.quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  certification_id uuid REFERENCES public.certifications ON DELETE SET NULL,
  scope text NOT NULL DEFAULT 'general',
  topic text,
  mode text NOT NULL DEFAULT 'qcm',
  difficulty text NOT NULL DEFAULT 'standard',
  total integer NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  score integer NOT NULL DEFAULT 0,
  source_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.quiz_sessions ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  chapter text,
  clause text,
  question text NOT NULL,
  choices jsonb,
  expected text,
  explanation text,
  user_answer text,
  is_correct boolean NOT NULL DEFAULT false,
  score integer NOT NULL DEFAULT 0,
  feedback text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX quiz_sessions_user_cert_idx ON public.quiz_sessions (user_id, certification_id, created_at DESC);
CREATE INDEX quiz_answers_session_idx ON public.quiz_answers (session_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_sessions TO authenticated;
GRANT ALL ON public.quiz_sessions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_answers TO authenticated;
GRANT ALL ON public.quiz_answers TO service_role;

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their quiz sessions" ON public.quiz_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage their quiz answers" ON public.quiz_answers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);