-- User statistics for RecallApp + LanguageHub (shared Supabase project)
-- Run these in the Supabase SQL editor (has access to auth.users).

-- 1) Total number of users
SELECT COUNT(*) AS total_users FROM auth.users;

-- 2) Last time each user used the app (most recent activity across both apps)
SELECT
  u.id,
  u.email,
  u.created_at AS signed_up_at,
  u.last_sign_in_at,
  GREATEST(
    COALESCE(MAX(rp.updated_at), 'epoch'::timestamptz),
    COALESCE(MAX(sp.updated_at), 'epoch'::timestamptz),
    COALESCE(u.last_sign_in_at, 'epoch'::timestamptz)
  ) AS last_active_at
FROM auth.users u
LEFT JOIN public.recall_progress rp ON rp.user_id = u.id
LEFT JOIN public.set_progress sp ON sp.user_id = u.id
GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at
ORDER BY last_active_at DESC;

-- 3) Activity per user: rows written across recall + language progress tables
SELECT
  u.id,
  u.email,
  COUNT(DISTINCT rp.chapter_id) AS recall_chapters_touched,
  COALESCE(SUM(rp.pass), 0) AS recall_pass_sum,
  COUNT(DISTINCT sp.id) AS language_sets_touched
FROM auth.users u
LEFT JOIN public.recall_progress rp ON rp.user_id = u.id
LEFT JOIN public.set_progress sp ON sp.user_id = u.id
GROUP BY u.id, u.email
ORDER BY recall_chapters_touched DESC, language_sets_touched DESC;
