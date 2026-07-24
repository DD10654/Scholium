-- SECURITY FIX: get_user_stats() has its OWN inline `email <> 'admin'` check
-- (not a call to _assert_admin), so fixing _assert_admin in 20260724000000 did not
-- cover it — the same anonymous NULL bypass still leaked every user's email and
-- activity to anyone with the anon key. (An intended 20260423000000 redefinition
-- routing it through _assert_admin did not stick on the remote — drift.)
--
-- Redefine it identically except the inline guard is replaced by the now-fixed
-- _assert_admin(). Return columns and body are otherwise unchanged.

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
