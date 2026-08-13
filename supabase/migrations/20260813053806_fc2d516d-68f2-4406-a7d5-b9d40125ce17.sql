ALTER TABLE public.audit_checklist_items
  ADD COLUMN IF NOT EXISTS gap text,
  ADD COLUMN IF NOT EXISTS action text,
  ADD COLUMN IF NOT EXISTS owner text,
  ADD COLUMN IF NOT EXISTS due_date date;