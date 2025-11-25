-- Migration: add_cast_crew_table
-- Description: Adds cast_crew table and RLS policies for project-level cast and crew

CREATE TABLE IF NOT EXISTS cast_crew (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cast', 'crew')),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cast_crew_project_id ON cast_crew(project_id);

ALTER TABLE cast_crew ENABLE ROW LEVEL SECURITY;

-- Anyone can read cast & crew
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = current_schema()
      AND tablename = 'cast_crew'
      AND policyname = 'Cast & crew are viewable by everyone'
  ) THEN
    CREATE POLICY "Cast & crew are viewable by everyone"
      ON cast_crew FOR SELECT
      USING (true);
  END IF;
END $$;

-- Only project owner can modify cast & crew
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = current_schema()
      AND tablename = 'cast_crew'
      AND policyname = 'Project owners can manage cast & crew'
  ) THEN
    CREATE POLICY "Project owners can manage cast & crew"
      ON cast_crew FOR INSERT, UPDATE, DELETE
      USING (
        auth.uid() IN (
          SELECT author_id FROM projects WHERE id = project_id
        )
      );
  END IF;
END $$;
