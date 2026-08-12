ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'fr';
ALTER TABLE public.profiles ADD CONSTRAINT profiles_locale_check CHECK (locale IN ('fr','en'));