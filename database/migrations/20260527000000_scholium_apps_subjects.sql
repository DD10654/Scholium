-- Add free-form subject tags to scholium_apps so each tool can advertise
-- what it covers (e.g. "IGCSE Biology", "French", "Math").
-- The scholium_apps table itself was created manually in Supabase before
-- migrations were tracked, so this is a forward-only ALTER.

alter table public.scholium_apps
  add column if not exists subjects text[] not null default '{}';
