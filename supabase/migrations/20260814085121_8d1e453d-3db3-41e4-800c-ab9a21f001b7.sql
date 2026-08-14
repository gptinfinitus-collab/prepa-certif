REVOKE EXECUTE ON FUNCTION public.search_standard_sections(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.search_standard_sections(uuid, text) TO authenticated;