CREATE TABLE public.audit_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid REFERENCES public.certifications(id) ON DELETE SET NULL,
  template_id text,
  title text NOT NULL,
  audited_entity text,
  scope text,
  auditor text,
  audit_date date,
  status text NOT NULL DEFAULT 'in_progress',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_checklists TO authenticated;
GRANT ALL ON public.audit_checklists TO service_role;

ALTER TABLE public.audit_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own audit checklists"
ON public.audit_checklists FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.audit_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id uuid NOT NULL REFERENCES public.audit_checklists(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter text NOT NULL DEFAULT '',
  clause text,
  requirement text NOT NULL,
  guidance text,
  position integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  evidence text,
  finding text,
  auditee text,
  is_custom boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_checklist_items TO authenticated;
GRANT ALL ON public.audit_checklist_items TO service_role;

ALTER TABLE public.audit_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own audit checklist items"
ON public.audit_checklist_items FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX audit_checklists_user_idx ON public.audit_checklists (user_id, updated_at DESC);
CREATE INDEX audit_checklist_items_list_idx ON public.audit_checklist_items (checklist_id, position);

CREATE TRIGGER audit_checklists_set_updated_at
BEFORE UPDATE ON public.audit_checklists
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER audit_checklist_items_set_updated_at
BEFORE UPDATE ON public.audit_checklist_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();