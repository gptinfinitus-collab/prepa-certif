CREATE POLICY "Users read their own audit evidence"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'audit-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users upload their own audit evidence"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'audit-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update their own audit evidence"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'audit-evidence' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'audit-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete their own audit evidence"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'audit-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);