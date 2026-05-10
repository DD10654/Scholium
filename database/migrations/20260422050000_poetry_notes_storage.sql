-- Storage bucket for PoetryNotes projects.
-- Each user's files live under: poetry-notes-projects/{user_id}/{project_id}.json
-- A lightweight index lives at: poetry-notes-projects/{user_id}/_index.json

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('poetry-notes-projects', 'poetry-notes-projects', false, 5242880) -- 5 MB limit
ON CONFLICT (id) DO NOTHING;

-- Users can do anything with their own folder (path prefix = their user ID).
CREATE POLICY "poetry-notes: user owns their files"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'poetry-notes-projects'
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
)
WITH CHECK (
  bucket_id = 'poetry-notes-projects'
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);
