-- The previous "fix param order" migration created new functions with the same
-- names but different argument type orders, which Postgres treats as overloads
-- rather than replacements. Drop the original signatures so PostgREST has a
-- single candidate to resolve.

DROP FUNCTION IF EXISTS public.admin_set_disabled(text, text, boolean);
DROP FUNCTION IF EXISTS public.admin_save_chapter(text, text, text, text, text, text, text, int, jsonb);
