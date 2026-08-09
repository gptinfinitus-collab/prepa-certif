CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  family text,
  description text,
  chapters jsonb NOT NULL DEFAULT '[]'::jsonb,
  has_curriculum boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 100,
  is_custom boolean NOT NULL DEFAULT false,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX certifications_catalog_code_key ON public.certifications (code) WHERE owner_id IS NULL;
CREATE UNIQUE INDEX certifications_owner_code_key ON public.certifications (owner_id, code) WHERE owner_id IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY certifications_read_catalog ON public.certifications
  FOR SELECT TO authenticated
  USING (owner_id IS NULL OR owner_id = auth.uid());

CREATE POLICY certifications_insert_own ON public.certifications
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND is_custom = true);

CREATE POLICY certifications_update_own ON public.certifications
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY certifications_delete_own ON public.certifications
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

CREATE TRIGGER certifications_updated_at BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, certification_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_certifications TO authenticated;
GRANT ALL ON public.user_certifications TO service_role;

ALTER TABLE public.user_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_certifications_own ON public.user_certifications
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER user_certifications_updated_at BEFORE UPDATE ON public.user_certifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.certifications (code, name, family, description, has_curriculum, sort_order, chapters) VALUES
('iso-45001', 'ISO 45001:2018', 'Santé et sécurité au travail', 'Systèmes de management de la santé et de la sécurité au travail — audit et certification IRCA.', true, 10, '["4. Contexte de l''organisme","5. Leadership et participation des travailleurs","6. Planification","7. Support","8. Réalisation des activités opérationnelles","9. Évaluation des performances","10. Amélioration"]'::jsonb),
('iso-9001', 'ISO 9001:2015', 'Qualité', 'Systèmes de management de la qualité — exigences.', false, 20, '["4. Contexte de l''organisme","5. Leadership","6. Planification","7. Support","8. Réalisation des activités opérationnelles","9. Évaluation des performances","10. Amélioration"]'::jsonb),
('iso-14001', 'ISO 14001:2015', 'Environnement', 'Systèmes de management environnemental — exigences.', false, 30, '["4. Contexte de l''organisme","5. Leadership","6. Planification","7. Support","8. Réalisation des activités opérationnelles","9. Évaluation des performances","10. Amélioration"]'::jsonb),
('iso-27001', 'ISO/IEC 27001:2022', 'Sécurité de l''information', 'Systèmes de management de la sécurité de l''information.', false, 40, '["4. Contexte de l''organisme","5. Leadership","6. Planification","7. Support","8. Fonctionnement","9. Évaluation des performances","10. Amélioration","Annexe A. Mesures de sécurité"]'::jsonb),
('iso-22000', 'ISO 22000:2018', 'Sécurité des denrées alimentaires', 'Systèmes de management de la sécurité des denrées alimentaires.', false, 50, '["4. Contexte de l''organisme","5. Leadership","6. Planification","7. Support","8. Réalisation des activités opérationnelles","9. Évaluation des performances","10. Amélioration"]'::jsonb),
('iso-50001', 'ISO 50001:2018', 'Énergie', 'Systèmes de management de l''énergie.', false, 60, '["4. Contexte de l''organisme","5. Leadership","6. Planification","7. Support","8. Réalisation des activités opérationnelles","9. Évaluation des performances","10. Amélioration"]'::jsonb),
('iso-13485', 'ISO 13485:2016', 'Dispositifs médicaux', 'Systèmes de management de la qualité pour les dispositifs médicaux.', false, 70, '["4. Système de management de la qualité","5. Responsabilité de la direction","6. Management des ressources","7. Réalisation du produit","8. Mesure, analyse et amélioration"]'::jsonb),
('iso-22301', 'ISO 22301:2019', 'Continuité d''activité', 'Systèmes de management de la continuité d''activité.', false, 80, '["4. Contexte de l''organisme","5. Leadership","6. Planification","7. Support","8. Réalisation des activités opérationnelles","9. Évaluation des performances","10. Amélioration"]'::jsonb),
('iso-37001', 'ISO 37001:2016', 'Anti-corruption', 'Systèmes de management anti-corruption.', false, 90, '["4. Contexte de l''organisme","5. Leadership","6. Planification","7. Support","8. Réalisation des activités opérationnelles","9. Évaluation des performances","10. Amélioration"]'::jsonb);

ALTER TABLE public.study_plans ADD COLUMN certification_id uuid REFERENCES public.certifications(id) ON DELETE CASCADE;
ALTER TABLE public.module_progress ADD COLUMN certification_id uuid REFERENCES public.certifications(id) ON DELETE CASCADE;

UPDATE public.study_plans SET certification_id = (SELECT id FROM public.certifications WHERE code = 'iso-45001' AND owner_id IS NULL) WHERE certification_id IS NULL;
UPDATE public.module_progress SET certification_id = (SELECT id FROM public.certifications WHERE code = 'iso-45001' AND owner_id IS NULL) WHERE certification_id IS NULL;

INSERT INTO public.user_certifications (user_id, certification_id, is_active)
SELECT DISTINCT p.id, (SELECT id FROM public.certifications WHERE code = 'iso-45001' AND owner_id IS NULL), true
FROM public.profiles p
ON CONFLICT (user_id, certification_id) DO NOTHING;

ALTER TABLE public.study_plans ALTER COLUMN certification_id SET NOT NULL;
ALTER TABLE public.module_progress ALTER COLUMN certification_id SET NOT NULL;

ALTER TABLE public.study_plans DROP CONSTRAINT study_plans_pkey;
ALTER TABLE public.study_plans ADD PRIMARY KEY (user_id, certification_id);

ALTER TABLE public.module_progress DROP CONSTRAINT module_progress_user_id_module_id_key;
ALTER TABLE public.module_progress ADD CONSTRAINT module_progress_user_cert_module_key UNIQUE (user_id, certification_id, module_id);

CREATE INDEX user_certifications_user_idx ON public.user_certifications (user_id);
CREATE UNIQUE INDEX user_certifications_one_active ON public.user_certifications (user_id) WHERE is_active;