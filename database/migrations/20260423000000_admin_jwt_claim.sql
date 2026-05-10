-- Replace hardcoded admin email with JWT app_metadata claim.
-- Prerequisite: set {"role": "admin"} in app_metadata for the admin user
-- via Supabase Dashboard → Authentication → Users → Edit User → app_metadata.

CREATE OR REPLACE FUNCTION public._assert_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
END;
$$;

-- Redefine get_user_stats to use _assert_admin() instead of its own inline check,
-- and preserve the exact return columns from the original migration.
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE (
  id uuid,
  email text,
  signed_up_at timestamptz,
  last_sign_in_at timestamptz,
  last_active_at timestamptz,
  recall_chapters bigint,
  recall_pass_sum bigint,
  language_rows bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();

  RETURN QUERY
  SELECT
    u.id,
    u.email::text,
    u.created_at,
    u.last_sign_in_at,
    NULLIF(
      GREATEST(
        COALESCE(MAX(rp.updated_at), 'epoch'::timestamptz),
        COALESCE(MAX(sp.updated_at), 'epoch'::timestamptz)
      ),
      'epoch'::timestamptz
    ) AS last_active_at,
    COUNT(DISTINCT rp.chapter_id)::bigint AS recall_chapters,
    COALESCE(SUM(rp.pass), 0)::bigint     AS recall_pass_sum,
    COUNT(DISTINCT sp.id)::bigint          AS language_rows
  FROM auth.users u
  LEFT JOIN public.recall_progress rp ON rp.user_id = u.id
  LEFT JOIN public.set_progress    sp ON sp.user_id = u.id
  GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at
  ORDER BY last_active_at DESC NULLS LAST;
END;
$$;
