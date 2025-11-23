/*
  # Pitch System Implementation
  
  1. New Tables
    - `work_requests` - Applications to work on projects
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references auth.users)
      - `role_type` (text, role selection)
      - `role_description` (text, optional)
      - `experience_years` (integer, optional)
      - `portfolio_url` (text, optional)
      - `availability` (text, when available)
      - `message` (text, application message)
      - `status` (text, pending/accepted/declined/withdrawn)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `comments` - Reddit-style comments
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references auth.users)
      - `parent_id` (uuid, references comments for threading)
      - `content` (text, comment content)
      - `upvotes` (integer)
      - `downvotes` (integer)
      - `score` (integer, computed column)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_edited` (boolean)
      - `is_deleted` (boolean)
    
    - `comment_votes` - Vote tracking
      - `id` (uuid, primary key)
      - `comment_id` (uuid, references comments)
      - `user_id` (uuid, references auth.users)
      - `vote_type` (text, upvote/downvote)
      - `created_at` (timestamptz)
  
  2. Changes to Projects Table
    - Add `is_pitch` (boolean, default true)
    - Add `pitch_status` (text, draft/published/funded/completed)
    - Add `external_sharing_enabled` (boolean)
    - Add `share_token` (text, unique token for external sharing)
    - Add `work_requests_enabled` (boolean)
  
  3. Security
    - Enable RLS on all new tables
    - Public read access for published pitches
    - Authenticated users can create work requests and comments
    - Users can manage their own content
    - Project owners can manage work requests
*/

-- Extend projects table with pitch-related columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'is_pitch'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_pitch BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'pitch_status'
  ) THEN
    ALTER TABLE projects ADD COLUMN pitch_status TEXT DEFAULT 'draft' 
    CHECK (pitch_status IN ('draft', 'published', 'funded', 'completed'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'external_sharing_enabled'
  ) THEN
    ALTER TABLE projects ADD COLUMN external_sharing_enabled BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'share_token'
  ) THEN
    ALTER TABLE projects ADD COLUMN share_token TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'work_requests_enabled'
  ) THEN
    ALTER TABLE projects ADD COLUMN work_requests_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Create work_requests table
CREATE TABLE IF NOT EXISTS work_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_type TEXT NOT NULL CHECK (role_type IN (
    'actor', 'director', 'producer', 'cinematographer', 'editor', 
    'writer', 'sound_designer', 'production_designer', 'costume_designer', 
    'makeup_artist', 'other'
  )),
  role_description TEXT,
  experience_years INTEGER,
  portfolio_url TEXT,
  availability TEXT CHECK (availability IN ('immediate', '1_month', '3_months', '6_months', 'flexible')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_work_requests_project_id ON work_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_work_requests_user_id ON work_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_work_requests_status ON work_requests(status);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  score INTEGER GENERATED ALWAYS AS (upvotes - downvotes) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_score ON comments(score DESC);

-- Create comment_votes table
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user_id ON comment_votes(user_id);

-- Enable RLS
ALTER TABLE work_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for work_requests
CREATE POLICY "Work requests are viewable by everyone"
  ON work_requests FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create work requests"
  ON work_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work requests"
  ON work_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Project owners can manage work requests"
  ON work_requests FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT author_id FROM projects WHERE id = project_id
    )
  );

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for comment_votes
CREATE POLICY "Comment votes are viewable by everyone"
  ON comment_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote on comments"
  ON comment_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON comment_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON comment_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update comment vote counts
CREATE OR REPLACE FUNCTION update_comment_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE comments SET upvotes = upvotes + 1 WHERE id = NEW.comment_id;
    ELSE
      UPDATE comments SET downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'upvote' AND NEW.vote_type = 'downvote' THEN
      UPDATE comments SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.comment_id;
    ELSIF OLD.vote_type = 'downvote' AND NEW.vote_type = 'upvote' THEN
      UPDATE comments SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE comments SET upvotes = upvotes - 1 WHERE id = OLD.comment_id;
    ELSE
      UPDATE comments SET downvotes = downvotes - 1 WHERE id = OLD.comment_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating comment vote counts
DROP TRIGGER IF EXISTS trigger_update_comment_votes ON comment_votes;
CREATE TRIGGER trigger_update_comment_votes
AFTER INSERT OR UPDATE OR DELETE ON comment_votes
FOR EACH ROW EXECUTE FUNCTION update_comment_votes();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_work_requests_updated_at ON work_requests;
CREATE TRIGGER update_work_requests_updated_at
BEFORE UPDATE ON work_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();