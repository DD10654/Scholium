-- Tracks disabled subjects and sections for RecallApp.
-- Public SELECT so the app can filter them out. Admin-only writes via RPC.

CREATE TABLE IF NOT EXISTS public.recall_disabled (
  entity_id   text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('subject', 'section')),
  PRIMARY KEY (entity_id, entity_type)
);

ALTER TABLE public.recall_disabled ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recall_disabled: public read"
  ON public.recall_disabled FOR SELECT USING (true);

-- No direct-write policies — all writes go through the admin RPC below.

CREATE OR REPLACE FUNCTION public.admin_set_disabled(
  p_entity_id   text,
  p_entity_type text,
  p_disabled    boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();
  IF p_disabled THEN
    INSERT INTO public.recall_disabled (entity_id, entity_type)
    VALUES (p_entity_id, p_entity_type)
    ON CONFLICT DO NOTHING;
  ELSE
    DELETE FROM public.recall_disabled
    WHERE entity_id = p_entity_id AND entity_type = p_entity_type;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_set_disabled(text, text, boolean) TO authenticated;
