-- Storage bucket for Scholium app screenshots displayed on scholium-home.
-- Layout: one PNG per app, named `<app-id>.png` (e.g. recall-app.png).
-- Public read so the landing page can render them without auth; writes are
-- admin-only via the Supabase dashboard / service role.

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('app-screenshots', 'app-screenshots', true, 5242880) -- 5 MB per file
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "app-screenshots: public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'app-screenshots');
