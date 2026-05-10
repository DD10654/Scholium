-- Drop RLS policies that reference user_id or has_role
DROP POLICY IF EXISTS "Admins and owners can create sets" ON public.vocabulary_sets;
DROP POLICY IF EXISTS "Admins and owners can delete sets" ON public.vocabulary_sets;
DROP POLICY IF EXISTS "Admins and owners can update sets" ON public.vocabulary_sets;
DROP POLICY IF EXISTS "Users can create their own progress" ON public.set_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.set_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.set_progress;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.set_progress;
DROP POLICY IF EXISTS "Anyone can view folders" ON public.folders;
DROP POLICY IF EXISTS "Users can create their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Drop the folders table
DROP TABLE IF EXISTS public.folders CASCADE;

-- Drop the user_roles table
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop the has_role function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Remove user_id and folder_id columns from vocabulary_sets
ALTER TABLE public.vocabulary_sets DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.vocabulary_sets DROP COLUMN IF EXISTS folder_id;

-- Remove user_id column from set_progress
ALTER TABLE public.set_progress DROP COLUMN IF EXISTS user_id;

-- Drop the app_role enum type
DROP TYPE IF EXISTS public.app_role;

-- Create simple open RLS policies for vocabulary_sets
CREATE POLICY "Anyone can create vocabulary sets"
ON public.vocabulary_sets FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update vocabulary sets"
ON public.vocabulary_sets FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete vocabulary sets"
ON public.vocabulary_sets FOR DELETE
USING (true);

-- Create simple open RLS policies for set_progress
CREATE POLICY "Anyone can view progress"
ON public.set_progress FOR SELECT
USING (true);

CREATE POLICY "Anyone can create progress"
ON public.set_progress FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update progress"
ON public.set_progress FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete progress"
ON public.set_progress FOR DELETE
USING (true);