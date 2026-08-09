ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_track text NOT NULL DEFAULT 'general';

CREATE TABLE public.user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
  track text NOT NULL DEFAULT 'general',
  module_id integer NOT NULL,
  sections_read text[] NOT NULL DEFAULT '{}',
  current_section text,
  quiz_submitted boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, certification_id, track, module_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_lesson_progress TO authenticated;
GRANT ALL ON public.user_lesson_progress TO service_role;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_lesson_progress_own" ON public.user_lesson_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_lesson_progress_updated_at BEFORE UPDATE ON public.user_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES public.certifications(id) ON DELETE CASCADE,
  module_id integer NOT NULL,
  section_id text,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, section_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_notes TO authenticated;
GRANT ALL ON public.user_notes TO service_role;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_notes_own" ON public.user_notes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_notes_updated_at BEFORE UPDATE ON public.user_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_flashcard_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES public.certifications(id) ON DELETE CASCADE,
  module_id integer NOT NULL,
  card_key text NOT NULL,
  status text NOT NULL DEFAULT 'again',
  review_count integer NOT NULL DEFAULT 0,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, card_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_flashcard_progress TO authenticated;
GRANT ALL ON public.user_flashcard_progress TO service_role;
ALTER TABLE public.user_flashcard_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_flashcard_progress_own" ON public.user_flashcard_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_flashcard_progress_updated_at BEFORE UPDATE ON public.user_flashcard_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_topic_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES public.certifications(id) ON DELETE CASCADE,
  track text NOT NULL DEFAULT 'general',
  topic text NOT NULL,
  correct integer NOT NULL DEFAULT 0,
  attempts integer NOT NULL DEFAULT 0,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, certification_id, track, topic)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_topic_mastery TO authenticated;
GRANT ALL ON public.user_topic_mastery TO service_role;
ALTER TABLE public.user_topic_mastery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_topic_mastery_own" ON public.user_topic_mastery FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_topic_mastery_updated_at BEFORE UPDATE ON public.user_topic_mastery
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();