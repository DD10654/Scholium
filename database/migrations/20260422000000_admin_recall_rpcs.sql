-- Admin RPCs for editing recall_chapters + recall_cards.
-- Gated to the admin email. Callable with the anon key once signed in.

CREATE OR REPLACE FUNCTION public._assert_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT au.email FROM auth.users au WHERE au.id = auth.uid())
     <> 'aaravagarwal.1511@gmail.com' THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
END;
$$;

-- Save a chapter and fully replace its cards in one call.
-- p_cards is a JSON array of {term, definition} objects, in order.
CREATE OR REPLACE FUNCTION public.admin_save_chapter(
  p_id           text,
  p_subject_id   text,
  p_subject_name text,
  p_subject_emoji text,
  p_section_id   text,
  p_section_name text,
  p_name         text,
  p_sort_order   int,
  p_cards        jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c jsonb;
  i int := 0;
BEGIN
  PERFORM public._assert_admin();

  INSERT INTO public.recall_chapters
    (id, subject_id, subject_name, subject_emoji, section_id, section_name, name, sort_order)
  VALUES
    (p_id, p_subject_id, p_subject_name, p_subject_emoji, p_section_id, p_section_name, p_name, p_sort_order)
  ON CONFLICT (id) DO UPDATE SET
    subject_id    = EXCLUDED.subject_id,
    subject_name  = EXCLUDED.subject_name,
    subject_emoji = EXCLUDED.subject_emoji,
    section_id    = EXCLUDED.section_id,
    section_name  = EXCLUDED.section_name,
    name          = EXCLUDED.name,
    sort_order    = EXCLUDED.sort_order;

  DELETE FROM public.recall_cards WHERE chapter_id = p_id;

  FOR c IN SELECT * FROM jsonb_array_elements(p_cards) LOOP
    INSERT INTO public.recall_cards (chapter_id, term, definition, sort_order)
    VALUES (p_id, c->>'term', c->>'definition', i);
    i := i + 1;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_chapter(p_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();
  DELETE FROM public.recall_chapters WHERE id = p_id;
END;
$$;

-- Rename a section across every chapter that uses it.
CREATE OR REPLACE FUNCTION public.admin_rename_section(
  p_section_id text,
  p_new_name   text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();
  UPDATE public.recall_chapters
     SET section_name = p_new_name
   WHERE section_id = p_section_id;
END;
$$;

-- Rename a subject (name/emoji) across every chapter.
CREATE OR REPLACE FUNCTION public.admin_rename_subject(
  p_subject_id text,
  p_new_name   text,
  p_new_emoji  text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._assert_admin();
  UPDATE public.recall_chapters
     SET subject_name  = p_new_name,
         subject_emoji = p_new_emoji
   WHERE subject_id = p_subject_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_save_chapter(text, text, text, text, text, text, text, int, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_chapter(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_rename_section(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_rename_subject(text, text, text) TO authenticated;
