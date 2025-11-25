-- Migration: add_project_updates_table
-- Description: Adds project_updates table and RLS policies for project announcements/updates

CREATE TABLE IF NOT EXISTS project_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_created_at ON project_updates(created_at DESC);

ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- Anyone can read published updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = current_schema()
      AND tablename = 'project_updates'
      AND policyname = 'Project updates are viewable by everyone'
  ) THEN
    CREATE POLICY "Project updates are viewable by everyone"
      ON project_updates FOR SELECT
      USING (is_published = true);
  END IF;
END $$;

-- Only project owner can create/update/delete updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = current_schema()
      AND tablename = 'project_updates'
      AND policyname = 'Project owners can manage updates'
  ) THEN
    CREATE POLICY "Project owners can manage updates"
      ON project_updates FOR INSERT, UPDATE, DELETE
      USING (
        auth.uid() IN (
          SELECT author_id FROM projects WHERE id = project_id
        )
      );
  END IF;
END $$;
