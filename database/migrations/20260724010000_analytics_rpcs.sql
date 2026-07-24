-- Admin analytics read RPCs (Phase 4 of reports/ANALYTICS_PLAN.md).
--
-- analytics_events has no SELECT policy, so it is unreadable with the anon/auth
-- key. All reads go through these SECURITY DEFINER functions, each gated by
-- _assert_admin() (fixed in 20260724000000). Aggregation happens in SQL so the
-- 1000-row PostgREST cap never applies. A "visitor" is coalesce(user_id, anon_id):
-- signed-in users by id, signed-out traffic by device id.

-- ── Per-app overview: DAU/WAU/MAU + period totals + signed-out share ────────────────
CREATE OR REPLACE FUNCTION public.admin_analytics_overview(p_days int DEFAULT 30)
RETURNS TABLE (
  app_key text,
  dau bigint,
  wau bigint,
  mau bigint,
  events bigint,
  sessions bigint,
  signed_out_pct numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();
  RETURN QUERY
  SELECT
    e.app_key,
    count(DISTINCT CASE WHEN e.occurred_at >= now() - interval '1 day'
          THEN coalesce(e.user_id::text, e.anon_id) END)::bigint,
    count(DISTINCT CASE WHEN e.occurred_at >= now() - interval '7 days'
          THEN coalesce(e.user_id::text, e.anon_id) END)::bigint,
    count(DISTINCT CASE WHEN e.occurred_at >= now() - interval '30 days'
          THEN coalesce(e.user_id::text, e.anon_id) END)::bigint,
    count(*) FILTER (WHERE e.occurred_at >= now() - make_interval(days => p_days))::bigint,
    count(DISTINCT e.session_id) FILTER (WHERE e.occurred_at >= now() - make_interval(days => p_days))::bigint,
    round(
      100.0 * count(*) FILTER (WHERE e.user_id IS NULL AND e.occurred_at >= now() - make_interval(days => p_days))
      / nullif(count(*) FILTER (WHERE e.occurred_at >= now() - make_interval(days => p_days)), 0),
      1
    )
  FROM public.analytics_events e
  WHERE e.occurred_at >= now() - make_interval(days => greatest(p_days, 30))
  GROUP BY e.app_key
  ORDER BY 4 DESC;  -- by MAU
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_analytics_overview(int) TO authenticated;

-- ── Top event names (optionally scoped to one app) ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_analytics_events(p_days int DEFAULT 30, p_app_key text DEFAULT NULL)
RETURNS TABLE (
  event_name text,
  events bigint,
  visitors bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();
  RETURN QUERY
  SELECT
    e.name,
    count(*)::bigint,
    count(DISTINCT coalesce(e.user_id::text, e.anon_id))::bigint
  FROM public.analytics_events e
  WHERE e.occurred_at >= now() - make_interval(days => p_days)
    AND (p_app_key IS NULL OR e.app_key = p_app_key)
  GROUP BY e.name
  ORDER BY 2 DESC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_analytics_events(int, text) TO authenticated;

-- ── Funnel: distinct visitors who performed each named step, in order ────────────────
-- Steps are counted independently (unordered), which is the drop-off shape you want
-- for a small ordered step list; ordinality preserves the given order for display.
CREATE OR REPLACE FUNCTION public.admin_analytics_funnel(p_app_key text, p_steps text[], p_days int DEFAULT 30)
RETURNS TABLE (
  step_index int,
  step_name text,
  visitors bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();
  RETURN QUERY
  SELECT
    s.ord::int,
    s.step,
    count(DISTINCT coalesce(e.user_id::text, e.anon_id))::bigint
  FROM unnest(p_steps) WITH ORDINALITY AS s(step, ord)
  LEFT JOIN public.analytics_events e
    ON e.name = s.step
   AND e.app_key = p_app_key
   AND e.occurred_at >= now() - make_interval(days => p_days)
  GROUP BY s.ord, s.step
  ORDER BY s.ord;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_analytics_funnel(text, text[], int) TO authenticated;

-- ── Weekly signup-cohort retention (signed-in users only) ───────────────────────────
CREATE OR REPLACE FUNCTION public.admin_analytics_retention(p_app_key text, p_weeks int DEFAULT 8)
RETURNS TABLE (
  cohort_week date,
  week_offset int,
  users bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();
  RETURN QUERY
  WITH cohorts AS (
    SELECT u.id, date_trunc('week', u.created_at)::date AS cohort_week
    FROM auth.users u
    WHERE u.created_at >= now() - make_interval(weeks => p_weeks)
  ),
  activity AS (
    SELECT DISTINCT e.user_id, date_trunc('week', e.occurred_at)::date AS active_week
    FROM public.analytics_events e
    WHERE e.user_id IS NOT NULL
      AND e.app_key = p_app_key
      AND e.occurred_at >= now() - make_interval(weeks => p_weeks)
  )
  SELECT
    c.cohort_week,
    ((a.active_week - c.cohort_week) / 7)::int,
    count(DISTINCT c.id)::bigint
  FROM cohorts c
  JOIN activity a ON a.user_id = c.id AND a.active_week >= c.cohort_week
  GROUP BY c.cohort_week, ((a.active_week - c.cohort_week) / 7)
  ORDER BY c.cohort_week, ((a.active_week - c.cohort_week) / 7);
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_analytics_retention(text, int) TO authenticated;
