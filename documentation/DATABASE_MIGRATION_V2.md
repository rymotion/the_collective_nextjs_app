# Database Migration V2 - Create Pitch Workflow

This migration adds support for draft projects and crew invitations.

## Run this SQL in Supabase SQL Editor

```sql
-- =====================================================
-- V2 Migration - Create Pitch Workflow
-- =====================================================

-- Add new columns to projects table for draft functionality
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS country_of_origin text,
ADD COLUMN IF NOT EXISTS funding_duration_days integer;

-- Update status check constraint to include 'draft'
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check
  CHECK (status IN ('draft', 'active', 'funded', 'completed', 'cancelled'));

-- Set default status to 'draft'
ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'draft';

-- Add modified_at column (created_at already exists)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS modified_at timestamptz DEFAULT now();

-- Create trigger to auto-update modified_at
DROP TRIGGER IF EXISTS update_projects_modified_at ON projects;
CREATE TRIGGER update_projects_modified_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create crew_invitations table
CREATE TABLE IF NOT EXISTS crew_invitations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  invited_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  modified_at timestamptz DEFAULT now()
);

-- Add index for crew invitations
CREATE INDEX IF NOT EXISTS idx_crew_invitations_project ON crew_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_crew_invitations_email ON crew_invitations(email);

-- Enable RLS on crew_invitations
ALTER TABLE crew_invitations ENABLE ROW LEVEL SECURITY;

-- Crew invitations policies
CREATE POLICY "Crew invitations viewable by project owner"
  ON crew_invitations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = crew_invitations.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can create invitations"
  ON crew_invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = invited_by AND
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = crew_invitations.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update invitations"
  ON crew_invitations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = crew_invitations.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete invitations"
  ON crew_invitations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = crew_invitations.project_id
      AND projects.author_id = auth.uid()
    )
  );

-- Update projects policies to handle drafts
DROP POLICY IF EXISTS "Projects viewable by all" ON projects;
CREATE POLICY "Published projects viewable by all"
  ON projects FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Authors can view own drafts"
  ON projects FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

-- Trigger for modified_at on crew_invitations
DROP TRIGGER IF EXISTS update_crew_invitations_modified_at ON crew_invitations;
CREATE TRIGGER update_crew_invitations_modified_at
  BEFORE UPDATE ON crew_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## New Fields Added

### Projects Table Updates:
- `is_published` (boolean) - Whether project is published or draft
- `country_of_origin` (text) - Country where film will be made
- `funding_duration_days` (integer) - How long funding period lasts
- `modified_at` (timestamptz) - Auto-updated on changes
- `status` - Now includes 'draft' option

### New Table: crew_invitations
- `id` (uuid) - Primary key
- `project_id` (uuid) - References projects
- `full_name` (text) - Full name of crew member
- `email` (text) - Email address
- `invited_by` (uuid) - User who sent invitation
- `status` (text) - 'pending', 'accepted', or 'declined'
- `created_at` (timestamptz) - When invitation was created
- `modified_at` (timestamptz) - Auto-updated on changes

## Security Notes

- Draft projects are only visible to their authors
- Published projects are visible to everyone
- Only project owners can manage crew invitations
- All changes auto-update modified_at timestamp
