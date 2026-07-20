-- Remove the "marks" concept from Two-Sider essays entirely.
--
-- Essays no longer carry a marks value in RecallApp or the admin dashboard, so
-- the column and the p_marks parameter of admin_save_two_sider are dropped.
-- 20260718010000 (the essay migration) has been rewritten to never add marks;
-- this forward migration brings any database that already applied the original
-- (with-marks) version into line. Every step is idempotent, so a fresh
-- `db reset` (which applies the marks-free 20260718010000 first) runs it as a
-- harmless no-op.

-- Old signature carried p_marks int as the 5th argument — drop it before the
-- column so nothing still references marks.
DROP FUNCTION IF EXISTS public.admin_save_two_sider(text, text, text, text, int, text, text, int, jsonb, jsonb);

ALTER TABLE public.recall_two_siders DROP COLUMN IF EXISTS marks;

-- Recreate without p_marks / the marks column.
CREATE OR REPLACE FUNCTION public.admin_save_two_sider(
  p_id            text,
  p_subject       text,
  p_emoji         text,
  p_question      text,
  p_for_label     text,
  p_against_label text,
  p_sort_order    int,
  p_for           jsonb,
  p_against       jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pt jsonb;
  i  int;
BEGIN
  PERFORM public._assert_admin();

  INSERT INTO public.recall_two_siders
    (id, subject, emoji, question, for_label, against_label, sort_order)
  VALUES
    (p_id, p_subject, p_emoji, p_question, p_for_label, p_against_label, p_sort_order)
  ON CONFLICT (id) DO UPDATE SET
    subject       = EXCLUDED.subject,
    emoji         = EXCLUDED.emoji,
    question      = EXCLUDED.question,
    for_label     = EXCLUDED.for_label,
    against_label = EXCLUDED.against_label,
    sort_order    = EXCLUDED.sort_order;

  DELETE FROM public.recall_two_sider_points WHERE two_sider_id = p_id;

  i := 0;
  FOR pt IN SELECT * FROM jsonb_array_elements(p_for) LOOP
    INSERT INTO public.recall_two_sider_points (two_sider_id, side, keyword, point, sort_order)
    VALUES (p_id, 'for', pt->>'keyword', pt->>'point', i);
    i := i + 1;
  END LOOP;

  i := 0;
  FOR pt IN SELECT * FROM jsonb_array_elements(p_against) LOOP
    INSERT INTO public.recall_two_sider_points (two_sider_id, side, keyword, point, sort_order)
    VALUES (p_id, 'against', pt->>'keyword', pt->>'point', i);
    i := i + 1;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_save_two_sider(text, text, text, text, text, text, int, jsonb, jsonb) TO authenticated;
