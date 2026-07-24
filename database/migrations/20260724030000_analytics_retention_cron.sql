-- Retention (Phase 5 of reports/ANALYTICS_PLAN.md): prune raw analytics events
-- older than 180 days, daily, in-DB via pg_cron. No new secret and no serverless
-- function (unlike mock-space's prune-papers cron). Any daily rollups added later
-- are kept indefinitely; only the raw events table is pruned.
--
-- 180 days is the retention constant from the plan. pg_cron was enabled for this
-- project; CREATE EXTENSION is idempotent so this migration is self-contained.

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Idempotent (re)scheduling: drop any prior job of this name first.
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'prune-analytics-events';

SELECT cron.schedule(
  'prune-analytics-events',
  '17 4 * * *',  -- daily at 04:17 UTC, off the top of the hour
  $$DELETE FROM public.analytics_events WHERE occurred_at < now() - interval '180 days'$$
);
