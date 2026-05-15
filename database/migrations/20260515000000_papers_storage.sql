-- Storage bucket for the PastPapers app.
-- Layout inside the bucket:
--   {Subject}/{Component}/{n}-{Name}-{QP|MS}.pdf
-- Example:
--   IGCSE Math/Paper 2/3-Algebra-QP.pdf
--   IGCSE Math/Paper 2/3-Algebra-MS.pdf
-- Anyone (including anonymous visitors) can list and read; writes are admin-only via the Supabase dashboard / service role.

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('papers', 'papers', true, 52428800) -- 50 MB per file
ON CONFLICT (id) DO NOTHING;

-- Public read of every object in the bucket.
CREATE POLICY "papers: public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'papers');
