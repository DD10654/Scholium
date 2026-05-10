-- Admin stats RPC. Gated to a fixed admin email; callable with the anon key once signed in.

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
  IF (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
     <> 'aaravagarwal.1511@gmail.com' THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::text,
    u.created_at,
    u.last_sign_in_at,
    -- Based on real app-usage signals (progress writes). NULL if the user has
    -- signed up but never touched any data.
    NULLIF(
      GREATEST(
        COALESCE(MAX(rp.updated_at), 'epoch'::timestamptz),
        COALESCE(MAX(sp.updated_at), 'epoch'::timestamptz)
      ),
      'epoch'::timestamptz
    ) AS last_active_at,
    COUNT(DISTINCT rp.chapter_id)::bigint AS recall_chapters,
    COALESCE(SUM(rp.pass), 0)::bigint AS recall_pass_sum,
    COUNT(DISTINCT sp.id)::bigint AS language_rows
  FROM auth.users u
  LEFT JOIN public.recall_progress rp ON rp.user_id = u.id
  LEFT JOIN public.set_progress sp ON sp.user_id = u.id
  GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at
  ORDER BY last_active_at DESC NULLS LAST;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_stats() TO authenticated;
