-- Index of past-paper PDF files, used to list the papers tree in the browser
-- after the bytes move from Supabase Storage to Cloudflare R2. R2 has no
-- client-safe listing, so the subject/component/file structure lives here and
-- R2 only serves the bytes by public URL.
--
-- One row per PDF. Path in R2 mirrors Supabase: `<subject>/<component>/<file_name>`.
-- Populate with `pnpm index:papers` (apps/past-papers/scripts/build-paper-index.js).

CREATE TABLE IF NOT EXISTS paper_files (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject     text NOT NULL,
  component   text NOT NULL,
  file_name   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subject, component, file_name)
);

CREATE INDEX IF NOT EXISTS idx_paper_files_subject ON paper_files(subject);
CREATE INDEX IF NOT EXISTS idx_paper_files_subject_component ON paper_files(subject, component);

-- Enable Row Level Security
ALTER TABLE paper_files ENABLE ROW LEVEL SECURITY;

-- Public read access (mirrors the public `papers` bucket it replaces)
CREATE POLICY "Enable read access for all users" ON paper_files
  FOR SELECT USING (true);

-- Grant permissions (writes happen via the service role, which bypasses RLS)
GRANT SELECT ON paper_files TO anon, authenticated;
