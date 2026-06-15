-- Per-app capability tags surfaced on the homepage cards:
--   has_demo  → the tool offers a no-signup interactive trial at <url>/demo ("Try it free")
--   no_login  → the tool itself can be used without an account ("No login required")
-- The scholium_apps table was created manually in Supabase before migrations
-- were tracked, so this is a forward-only ALTER.

alter table public.scholium_apps
  add column if not exists has_demo boolean not null default false,
  add column if not exists no_login boolean not null default false;

-- Tools with a no-signup interactive trial.
update public.scholium_apps
  set has_demo = true
  where id in ('language-hub', 'recall-app', 'poetry-notes')
     or title ilike '%lang%'
     or title ilike '%recall%'
     or title ilike '%poetry%';

-- Past Papers can be browsed without an account.
update public.scholium_apps
  set no_login = true
  where id = 'past-papers'
     or title ilike '%past paper%';
