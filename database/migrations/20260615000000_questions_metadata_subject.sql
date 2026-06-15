-- Add a subject dimension to questions_metadata (the per-question crop dataset
-- behind /generate). Until now every row was International Mathematics (0607);
-- this tags them so other subjects (e.g. 0606 Additional Mathematics) can be
-- added, and repoints the primary key to (subject, id) so the same question id
-- (e.g. "P2-Q001") can exist for more than one subject.

-- 1. Add the column nullable, backfill existing rows, then enforce NOT NULL
--    (a straight NOT NULL add would fail against existing rows).
ALTER TABLE questions_metadata ADD COLUMN IF NOT EXISTS subject text;

UPDATE questions_metadata SET subject = '0607' WHERE subject IS NULL;

ALTER TABLE questions_metadata ALTER COLUMN subject SET NOT NULL;

-- 2. Repoint the primary key from (id) to (subject, id). Drop whatever the
--    existing PK is named (robust to the auto-generated name).
DO $$
DECLARE pk_name text;
BEGIN
  SELECT conname INTO pk_name
  FROM pg_constraint
  WHERE conrelid = 'questions_metadata'::regclass AND contype = 'p';
  IF pk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE questions_metadata DROP CONSTRAINT %I', pk_name);
  END IF;
END $$;

ALTER TABLE questions_metadata ADD PRIMARY KEY (subject, id);

-- The composite PK is keyed on subject first, so it also serves subject-only
-- and subject+id lookups; no separate subject index needed.
