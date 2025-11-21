-- =====================================================
-- DROP EXISTING TABLES AND RECREATE WITH COMPLETE SCHEMA
-- =====================================================

-- Drop all existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS project_media CASCADE;
DROP TABLE IF EXISTS crew_invitations CASCADE;
DROP TABLE IF EXISTS project_updates CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS accolades CASCADE;
DROP TABLE IF EXISTS cast_crew CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_modified_at() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_project_code() CASCADE;

-- =====================================================
-- The Collective - Complete Database Schema
-- =====================================================
-- This script creates all tables with the complete schema
-- combining initial setup and V2 migration enhancements
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique project code
CREATE OR REPLACE FUNCTION generate_project_code()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := 'PRJ-';
  i integer;
  code_exists boolean;
  generated_code text;
BEGIN
  LOOP
    generated_code := result;

    -- Generate 8 random characters
    FOR i IN 1..8 LOOP
      generated_code := generated_code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);

      -- Add hyphen after 4th character for readability (PRJ-XXXX-XXXX)
      IF i = 4 THEN
        generated_code := generated_code || '-';
      END IF;
    END LOOP;

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM projects WHERE project_code = generated_code) INTO code_exists;

    -- If code doesn't exist, we found a unique one
    IF NOT code_exists THEN
      RETURN generated_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: profiles
-- =====================================================
-- User profile information linked to Supabase auth.users

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  imdb_profile_url text,
  imdb_synced boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: projects
-- =====================================================
-- Film projects seeking funding (includes draft functionality)
--
-- project_code: Unique human-readable identifier (e.g., PRJ-A7B2-K9M4)
--               Automatically generated on creation
--               Used for easy project identification and sharing

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_code text UNIQUE NOT NULL DEFAULT generate_project_code(),
  title text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  synopsis text NOT NULL,
  genre text NOT NULL,
  image_url text,
  goal numeric NOT NULL,
  raised numeric DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'funded', 'completed', 'cancelled')),
  is_published boolean DEFAULT false,
  country_of_origin text,
  funding_duration_days integer,
  deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  modified_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_author ON projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_genre ON projects(genre);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(project_code);

-- Trigger to auto-update updated_at and modified_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_modified_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: cast_crew
-- =====================================================
-- Cast and crew members for projects

CREATE TABLE IF NOT EXISTS cast_crew (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  type text NOT NULL CHECK (type IN ('cast', 'crew')),
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_cast_crew_project ON cast_crew(project_id);

-- =====================================================
-- TABLE: accolades
-- =====================================================
-- Awards and recognition for projects

CREATE TABLE IF NOT EXISTS accolades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  year text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_accolades_project ON accolades(project_id);

-- =====================================================
-- TABLE: contributions
-- =====================================================
-- User contributions to projects

CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contributions_project ON contributions(project_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user ON contributions(user_id);

-- =====================================================
-- TABLE: project_updates
-- =====================================================
-- Updates posted by project owners

CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_project_updates_project ON project_updates(project_id);

-- =====================================================
-- TABLE: favorites
-- =====================================================
-- User-saved favorite projects

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_project ON favorites(project_id);

-- =====================================================
-- TABLE: crew_invitations
-- =====================================================
-- Crew invitations for projects (V2 feature)

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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_crew_invitations_project ON crew_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_crew_invitations_email ON crew_invitations(email);

-- Trigger to auto-update modified_at
CREATE TRIGGER update_crew_invitations_modified_at
  BEFORE UPDATE ON crew_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cast_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE accolades ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_invitations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

CREATE POLICY "Profiles viewable by all"
  ON profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================

CREATE POLICY "Published projects viewable by all"
  ON projects FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Authors can view own drafts"
  ON projects FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- =====================================================
-- CAST_CREW POLICIES
-- =====================================================

CREATE POLICY "Cast/crew viewable by all"
  ON cast_crew FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = cast_crew.project_id
      AND projects.is_published = true
    )
  );

CREATE POLICY "Project owners can manage cast/crew"
  ON cast_crew FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = cast_crew.project_id
      AND projects.author_id = auth.uid()
    )
  );

-- =====================================================
-- ACCOLADES POLICIES
-- =====================================================

CREATE POLICY "Accolades viewable by all"
  ON accolades FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = accolades.project_id
      AND projects.is_published = true
    )
  );

CREATE POLICY "Project owners can manage accolades"
  ON accolades FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = accolades.project_id
      AND projects.author_id = auth.uid()
    )
  );

-- =====================================================
-- CONTRIBUTIONS POLICIES
-- =====================================================

CREATE POLICY "Contributions viewable by all"
  ON contributions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create contributions"
  ON contributions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PROJECT_UPDATES POLICIES
-- =====================================================

CREATE POLICY "Project updates viewable by all"
  ON project_updates FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
      AND projects.is_published = true
    )
  );

CREATE POLICY "Project owners can manage updates"
  ON project_updates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
      AND projects.author_id = auth.uid()
    )
  );

-- =====================================================
-- FAVORITES POLICIES
-- =====================================================

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- CREW_INVITATIONS POLICIES
-- =====================================================

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

-- =====================================================
-- FULL-TEXT SEARCH
-- =====================================================

-- Add full-text search index for projects
CREATE INDEX IF NOT EXISTS idx_projects_search
  ON projects USING gin(to_tsvector('english', title || ' ' || synopsis));

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
