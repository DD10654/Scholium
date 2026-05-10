-- Add an explicit sort order for sections (separate from chapter sort_order).
-- Chapters within a section keep their own sort_order.

ALTER TABLE public.recall_chapters
  ADD COLUMN IF NOT EXISTS section_sort_order INTEGER NOT NULL DEFAULT 0;

-- Initialise: assign each distinct section a sort order based on its first
-- appearance in the existing data (which has no explicit ordering).
DO $$
DECLARE
  r RECORD;
  i INT := 0;
BEGIN
  FOR r IN
    SELECT DISTINCT ON (subject_id, section_id) subject_id, section_id
    FROM public.recall_chapters
    ORDER BY subject_id, section_id, sort_order ASC
  LOOP
    UPDATE public.recall_chapters
       SET section_sort_order = i
     WHERE subject_id = r.subject_id AND section_id = r.section_id;
    i := i + 1;
  END LOOP;
END;
$$;

-- Swap section_sort_order between two sections (called by AdminDashboard up/down).
-- Params must be alphabetical: p_section_id_a, p_section_id_b
CREATE OR REPLACE FUNCTION public.admin_swap_section_order(
  p_section_id_a text,
  p_section_id_b text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ord_a INT;
  ord_b INT;
BEGIN
  PERFORM public._assert_admin();
  SELECT section_sort_order INTO ord_a FROM public.recall_chapters
   WHERE section_id = p_section_id_a LIMIT 1;
  SELECT section_sort_order INTO ord_b FROM public.recall_chapters
   WHERE section_id = p_section_id_b LIMIT 1;
  UPDATE public.recall_chapters SET section_sort_order = ord_b WHERE section_id = p_section_id_a;
  UPDATE public.recall_chapters SET section_sort_order = ord_a WHERE section_id = p_section_id_b;
END;
$$;

-- Swap sort_order between two chapters.
-- Params alphabetical: p_id_a, p_id_b
CREATE OR REPLACE FUNCTION public.admin_swap_chapter_order(
  p_id_a text,
  p_id_b text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ord_a INT;
  ord_b INT;
BEGIN
  PERFORM public._assert_admin();
  SELECT sort_order INTO ord_a FROM public.recall_chapters WHERE id = p_id_a;
  SELECT sort_order INTO ord_b FROM public.recall_chapters WHERE id = p_id_b;
  UPDATE public.recall_chapters SET sort_order = ord_b WHERE id = p_id_a;
  UPDATE public.recall_chapters SET sort_order = ord_a WHERE id = p_id_b;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_swap_section_order(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_swap_chapter_order(text, text) TO authenticated;
