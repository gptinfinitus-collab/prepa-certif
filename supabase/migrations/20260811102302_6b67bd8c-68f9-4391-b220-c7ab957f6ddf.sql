INSERT INTO public.certifications (code, name, family, description, chapters, has_curriculum, sort_order, is_custom)
SELECT
  'iso-19011',
  'ISO 19011',
  'Audit des systèmes de management',
  'Lignes directrices pour l''audit des systèmes de management : principes, programme d''audit, réalisation de l''audit et compétence des auditeurs.',
  '["4. Principes de l''audit","5. Management d''un programme d''audit","6. Réalisation d''un audit","7. Compétence et évaluation des auditeurs","Annexe A"]'::jsonb,
  false,
  15,
  false
WHERE NOT EXISTS (SELECT 1 FROM public.certifications WHERE code = 'iso-19011');