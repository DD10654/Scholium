-- Concurrent-session kicking (anti account-sharing).
--
-- Each browser generates a stable per-origin device id. On sign-in a device
-- "claims" the active-session slot for (user_id, app_key) by upserting its id.
-- Every device subscribes to Realtime changes on its own row: when the stored
-- token changes to a different device's id, the losing device signs itself out.
--
-- Scoped by app_key (not just user_id) on purpose: the suite's apps are separate
-- origins, so their auth sessions and localStorage are NOT shared. A single user
-- legitimately using two apps at once must not kick themselves — only a second
-- device on the SAME app should.

CREATE TABLE public.active_sessions (
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_key       TEXT NOT NULL,
  session_token TEXT NOT NULL,
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, app_key)
);

-- ── RLS: a user may only read/write their own session rows ──────────────────────
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "active_sessions: user select"
  ON public.active_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "active_sessions: user insert"
  ON public.active_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "active_sessions: user update"
  ON public.active_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "active_sessions: user delete"
  ON public.active_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ── Realtime ────────────────────────────────────────────────────────────────────
-- Publish row changes so the losing device is kicked immediately. Realtime honours
-- the SELECT policy above, so each user only ever receives their own rows.
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_sessions;
