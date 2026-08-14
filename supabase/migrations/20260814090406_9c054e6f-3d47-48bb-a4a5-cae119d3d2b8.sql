CREATE POLICY "iso_library_official_read"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'iso-library' AND (storage.foldername(name))[1] = 'official');