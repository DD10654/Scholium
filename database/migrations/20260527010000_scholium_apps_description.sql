-- Add an optional short description for each tool in the suite.
-- Displayed on the homepage app card and on the tool's own landing header.
-- The scholium_apps table itself was created manually in Supabase before
-- migrations were tracked, so this is a forward-only ALTER.

alter table public.scholium_apps
  add column if not exists description text;
