# Complete Supabase Setup Guide

This guide will walk you through setting up Supabase for The Collective application from scratch.

## Table of Contents
1. [Create Supabase Project](#1-create-supabase-project)
2. [Get Your API Credentials](#2-get-your-api-credentials)
3. [Configure Environment Variables](#3-configure-environment-variables)
4. [Run Database Migrations](#4-run-database-migrations)
5. [Verify Setup](#5-verify-setup)
6. [Test Authentication](#6-test-authentication)

---

## 1. Create Supabase Project

### Step 1.1: Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign in"**
3. Sign up with GitHub, Google, or email

### Step 1.2: Create a New Project
1. Click **"New Project"**
2. Select your organization (or create one)
3. Fill in the project details:
   - **Name**: `the-collective` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient to start
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

---

## 2. Get Your API Credentials

### Step 2.1: Navigate to Project Settings
1. In your Supabase dashboard, click **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu

### Step 2.2: Copy Your Credentials
You'll need two values:

**Project URL:**
```
https://your-project-id.supabase.co
```

**Anon/Public Key (anon key):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Important**: Never commit the `service_role` key to your repository! Only use the `anon` key in your frontend code.

---

## 3. Configure Environment Variables

### Step 3.1: Update Your .env File
Open your `.env` file in the project root and update these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-id` with your actual project ID
- `your-anon-key-here` with your actual anon key

### Step 3.2: Verify .env is in .gitignore
Check that `.gitignore` includes:
```
.env
.env.local
.env*.local
```

---

## 4. Run Database Migrations

### Step 4.1: Access SQL Editor
1. In Supabase Dashboard, click **SQL Editor** (code icon in sidebar)
2. Click **"New query"**

### Step 4.2: Run the Migration SQL

Copy and paste this complete SQL migration:

```sql
-- =====================================================
-- The Collective - Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles Table
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

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  synopsis text NOT NULL,
  genre text NOT NULL,
  image_url text,
  goal numeric NOT NULL CHECK (goal > 0),
  raised numeric DEFAULT 0 CHECK (raised >= 0),
  status text DEFAULT 'active' CHECK (status IN ('active', 'funded', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deadline timestamptz
);

-- Cast and Crew Table
CREATE TABLE IF NOT EXISTS cast_crew (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  type text NOT NULL CHECK (type IN ('cast', 'crew')),
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Accolades Table
CREATE TABLE IF NOT EXISTS accolades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  year text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Contributions Table
CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  message text,
  created_at timestamptz DEFAULT now()
);

-- Project Updates Table
CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_author ON projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_genre ON projects(genre);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cast_crew_project ON cast_crew(project_id);
CREATE INDEX IF NOT EXISTS idx_accolades_project ON accolades(project_id);
CREATE INDEX IF NOT EXISTS idx_contributions_project ON contributions(project_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_updates_project ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_project ON favorites(project_id);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_projects_search
  ON projects
  USING gin(to_tsvector('english', title || ' ' || synopsis));

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cast_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE accolades ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles viewable"
  ON profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Projects viewable by all"
  ON projects FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Owners update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Owners delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Cast/Crew Policies
CREATE POLICY "Cast crew viewable"
  ON cast_crew FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Owners manage cast crew"
  ON cast_crew FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = cast_crew.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Owners update cast crew"
  ON cast_crew FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = cast_crew.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Owners delete cast crew"
  ON cast_crew FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = cast_crew.project_id
      AND projects.author_id = auth.uid()
    )
  );

-- Accolades Policies
CREATE POLICY "Accolades viewable"
  ON accolades FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Owners manage accolades"
  ON accolades FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = accolades.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Owners update accolades"
  ON accolades FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = accolades.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Owners delete accolades"
  ON accolades FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = accolades.project_id
      AND projects.author_id = auth.uid()
    )
  );

-- Contributions Policies
CREATE POLICY "Contributions viewable"
  ON contributions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated create contributions"
  ON contributions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Project Updates Policies
CREATE POLICY "Updates viewable"
  ON project_updates FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Owners create updates"
  ON project_updates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Owners update updates"
  ON project_updates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
      AND projects.author_id = auth.uid()
    )
  );

CREATE POLICY "Owners delete updates"
  ON project_updates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
      AND projects.author_id = auth.uid()
    )
  );

-- Favorites Policies
CREATE POLICY "Users view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users remove favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update project raised amount
CREATE OR REPLACE FUNCTION update_project_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM contributions
    WHERE project_id = NEW.project_id
  )
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for raised amount
DROP TRIGGER IF EXISTS update_project_raised_on_contribution ON contributions;
CREATE TRIGGER update_project_raised_on_contribution
  AFTER INSERT ON contributions
  FOR EACH ROW
  EXECUTE FUNCTION update_project_raised_amount();
```

### Step 4.3: Execute the Migration
1. Click **"Run"** or press `Ctrl/Cmd + Enter`
2. Wait for "Success. No rows returned" message
3. Verify no errors in output

---

## 5. Verify Setup

### Step 5.1: Check Tables Were Created
1. In Supabase Dashboard, click **Table Editor** (table icon in sidebar)
2. You should see all 7 tables:
   - ✅ profiles
   - ✅ projects
   - ✅ cast_crew
   - ✅ accolades
   - ✅ contributions
   - ✅ project_updates
   - ✅ favorites

### Step 5.2: Verify RLS is Enabled
1. Click on any table (e.g., `projects`)
2. Look for **"RLS enabled"** badge at top
3. All tables should have RLS enabled

### Step 5.3: Check Authentication Settings
1. Go to **Authentication** → **Settings**
2. Verify **Email Auth** is enabled
3. Optional: Disable email confirmation for testing:
   - Scroll to **Email Auth**
   - Toggle **"Enable email confirmations"** OFF

---

## 6. Test Authentication

### Step 6.1: Test in Your Application
1. Start your application:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/signup`

3. Create a test account:
   ```
   Email: test@example.com
   Password: Test123456!
   ```

### Step 6.2: Verify User Was Created
1. In Supabase Dashboard, go to **Authentication** → **Users**
2. You should see your test user
3. Check **Table Editor** → **profiles**
4. A profile should have been auto-created for your user

### Step 6.3: Test Database Operations

Create a test file `test-db.ts`:

```typescript
import { ProjectsService } from '@/services/projects.service';
import { AuthService } from '@/services/auth.service';

// Test authentication
const testAuth = async () => {
  try {
    await AuthService.signIn({
      email: 'test@example.com',
      password: 'Test123456!'
    });
    console.log('✅ Authentication works!');
  } catch (error) {
    console.error('❌ Auth error:', error);
  }
};

// Test fetching projects
const testProjects = async () => {
  try {
    const { projects, total } = await ProjectsService.getAllProjects(10, 0);
    console.log('✅ Projects query works!', { total });
  } catch (error) {
    console.error('❌ Projects error:', error);
  }
};
```

---

## Troubleshooting

### Issue: "Invalid API key"
**Solution**:
- Double-check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`
- Make sure you copied the `anon` key, not the `service_role` key
- Restart your dev server after changing `.env`

### Issue: "relation does not exist"
**Solution**:
- Tables weren't created - re-run the migration SQL
- Check SQL Editor for any error messages

### Issue: "new row violates row-level security policy"
**Solution**:
- RLS policies might not be set correctly
- Re-run the migration SQL to recreate policies
- Make sure you're authenticated when trying to insert data

### Issue: "Failed to fetch"
**Solution**:
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify your Supabase project is running
- Check browser console for CORS errors

### Issue: Profile not auto-created on signup
**Solution**:
- Check that the `AuthService.signUp` method is being used
- Verify the profile creation logic in `SupabaseAuthContext.tsx`
- Manually create profile if needed

---

## Next Steps

### Optional: Add Sample Data
Run this SQL to add test projects:

```sql
-- Insert sample project (replace user_id with your test user's ID)
INSERT INTO projects (title, author_id, synopsis, genre, goal, image_url)
VALUES (
  'Sample Film Project',
  'your-user-id-here',
  'An amazing story about...',
  'Drama',
  50000,
  'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg'
);
```

### Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize confirmation and password reset emails
3. Add your branding

### Set Up Storage (For Images)
1. Go to **Storage** → **Create bucket**
2. Create buckets: `avatars`, `projects`, `cast-crew`
3. Set up policies for file uploads

---

## Summary Checklist

- [ ] Created Supabase project
- [ ] Copied API credentials to `.env`
- [ ] Ran database migration SQL
- [ ] Verified all 7 tables exist
- [ ] Confirmed RLS is enabled on all tables
- [ ] Tested user signup
- [ ] Verified profile auto-creation
- [ ] Tested database queries

---

## Support

If you encounter issues:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the troubleshooting section above
3. Check browser console for errors
4. Verify all environment variables are correct

Your Supabase backend is now ready! 🚀
