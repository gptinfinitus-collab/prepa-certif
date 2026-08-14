CREATE TABLE public.standard_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
  title text NOT NULL,
  reference text,
  language text NOT NULL DEFAULT 'fr',
  storage_path text NOT NULL,
  library_document_id uuid,
  status text NOT NULL DEFAULT 'pending',
  error text,
  section_count integer NOT NULL DEFAULT 0,
  page_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, certification_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.standard_documents TO authenticated;
GRANT ALL ON public.standard_documents TO service_role;
ALTER TABLE public.standard_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their standard documents" ON public.standard_documents
  FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE TABLE public.standard_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.standard_documents(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  page integer NOT NULL DEFAULT 1,
  chapter text NOT NULL DEFAULT '',
  clause text,
  title text NOT NULL DEFAULT '',
  markdown text NOT NULL DEFAULT '',
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('french', coalesce(title, '') || ' ' || coalesce(markdown, ''))
  ) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.standard_sections TO authenticated;
GRANT ALL ON public.standard_sections TO service_role;
ALTER TABLE public.standard_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their standard sections" ON public.standard_sections
  FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE INDEX standard_sections_doc_order_idx ON public.standard_sections (document_id, order_index);
CREATE INDEX standard_sections_search_idx ON public.standard_sections USING gin (search_vector);

CREATE TABLE public.user_standard_progress (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES public.standard_documents(id) ON DELETE CASCADE,
  section_id uuid,
  read_ids text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, document_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_standard_progress TO authenticated;
GRANT ALL ON public.user_standard_progress TO service_role;
ALTER TABLE public.user_standard_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their standard progress" ON public.user_standard_progress
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.search_standard_sections(p_document_id uuid, p_query text)
RETURNS TABLE (id uuid, page integer, chapter text, title text, snippet text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id,
         s.page,
         s.chapter,
         s.title,
         ts_headline('french', s.markdown, websearch_to_tsquery('french', p_query),
           'MaxFragments=1,MaxWords=30,MinWords=12,StartSel=,StopSel=')
  FROM public.standard_sections s
  JOIN public.standard_documents d ON d.id = s.document_id
  WHERE s.document_id = p_document_id
    AND d.owner_id = auth.uid()
    AND s.search_vector @@ websearch_to_tsquery('french', p_query)
  ORDER BY ts_rank(s.search_vector, websearch_to_tsquery('french', p_query)) DESC
  LIMIT 40;
$$;

GRANT EXECUTE ON FUNCTION public.search_standard_sections(uuid, text) TO authenticated;