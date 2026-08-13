CREATE TABLE public.audit_item_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.audit_checklist_items(id) ON DELETE CASCADE,
  checklist_id UUID NOT NULL REFERENCES public.audit_checklists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX audit_item_attachments_checklist_idx ON public.audit_item_attachments(checklist_id);
CREATE INDEX audit_item_attachments_item_idx ON public.audit_item_attachments(item_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_item_attachments TO authenticated;
GRANT ALL ON public.audit_item_attachments TO service_role;

ALTER TABLE public.audit_item_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own audit attachments"
ON public.audit_item_attachments FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER audit_item_attachments_set_updated_at
BEFORE UPDATE ON public.audit_item_attachments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();