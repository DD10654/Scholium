-- SECURITY FIX: close the anonymous bypass in _assert_admin().
--
-- The live definition gates on `email <> 'admin@…'`. For an anonymous caller
-- auth.uid() is NULL, so the subquery returns no row → NULL, and `NULL <> 'admin'`
-- evaluates to NULL (not TRUE). The `IF NULL THEN` branch is not taken, so the
-- guard PASSES — every admin_* RPC and get_user_stats is callable with just the
-- anon key. (A JWT-app_metadata version exists in 20260423000000 but is NOT the
-- live definition; the remote drifted back to the email form.)
--
-- Fix: `IS DISTINCT FROM` treats NULL as a real inequality — NULL IS DISTINCT FROM
-- 'admin' is TRUE, so anonymous/other callers now raise. Non-breaking for the real
-- admin, whose email matches → IS DISTINCT FROM is FALSE → guard passes exactly as
-- before. All existing admin_* RPCs that call this are retroactively secured.

CREATE OR REPLACE FUNCTION public._assert_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
     IS DISTINCT FROM 'aaravagarwal.1511@gmail.com' THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
END;
$$;
