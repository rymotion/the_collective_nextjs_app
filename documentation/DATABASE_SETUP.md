# Database Setup Guide

## Overview

This application uses **Supabase** as the backend database and authentication system. The database schema is fully designed and ready for implementation.

## Database Schema

### Tables

#### 1. **profiles**
User profile information linked to Supabase auth.users
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique, not null)
- `display_name` (text)
- `avatar_url` (text)
- `bio` (text)
- `imdb_profile_url` (text)
- `imdb_synced` (boolean, default false)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### 2. **projects**
Film projects seeking funding
- `id` (uuid, primary key)
- `title` (text, not null)
- `author_id` (uuid, references profiles)
- `synopsis` (text, not null)
- `genre` (text, not null)
- `image_url` (text)
- `goal` (numeric, not null)
- `raised` (numeric, default 0)
- `status` ('active' | 'funded' | 'completed' | 'cancelled')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `deadline` (timestamptz)

#### 3. **cast_crew**
Cast and crew members for projects
- `id` (uuid, primary key)
- `project_id` (uuid, references projects)
- `name` (text, not null)
- `role` (text, not null)
- `type` ('cast' | 'crew')
- `image_url` (text)
- `created_at` (timestamptz)

#### 4. **accolades**
Awards and recognition for projects
- `id` (uuid, primary key)
- `project_id` (uuid, references projects)
- `title` (text, not null)
- `year` (text, not null)
- `created_at` (timestamptz)

#### 5. **contributions**
User contributions to projects
- `id` (uuid, primary key)
- `project_id` (uuid, references projects)
- `user_id` (uuid, references profiles)
- `amount` (numeric, not null)
- `message` (text)
- `created_at` (timestamptz)

#### 6. **project_updates**
Updates posted by project owners
- `id` (uuid, primary key)
- `project_id` (uuid, references projects)
- `title` (text, not null)
- `content` (text, not null)
- `created_at` (timestamptz)

#### 7. **favorites**
User-saved favorite projects
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `project_id` (uuid, references projects)
- `created_at` (timestamptz)
- Unique constraint on (user_id, project_id)

## Row Level Security (RLS)

All tables have Row Level Security enabled with the following policies:

### Public Access
- Projects, cast/crew, accolades, contributions, and updates are viewable by everyone (authenticated and anonymous users)

### User-Specific Access
- Users can create and update their own profiles
- Users can only view their own favorites
- Users can create contributions for any project

### Project Owner Permissions
- Project owners can create, update, and delete their own projects
- Project owners can manage cast/crew, accolades, and updates for their projects

## Services

The application includes comprehensive service layers for all database operations:

### ProfilesService (`src/services/profiles.service.ts`)
- `getProfile(userId)` - Get user profile
- `createProfile(profile)` - Create new profile
- `updateProfile(userId, updates)` - Update profile
- `getAllProfiles(limit, offset)` - Get all profiles

### ProjectsService (`src/services/projects.service.ts`)
- `getAllProjects(limit, offset, genre?, status?)` - Get all projects with filtering
- `getProject(projectId)` - Get single project with details
- `createProject(project)` - Create new project
- `updateProject(projectId, updates)` - Update project
- `deleteProject(projectId)` - Delete project
- `searchProjects(query)` - Search projects by title, synopsis, or genre
- `getProjectsByAuthor(authorId)` - Get projects by author

### ContributionsService (`src/services/contributions.service.ts`)
- `createContribution(contribution)` - Create new contribution
- `getProjectContributions(projectId)` - Get contributions for a project
- `getUserContributions(userId)` - Get user's contributions
- `getTotalContributed(userId)` - Get total amount contributed by user

### FavoritesService (`src/services/favorites.service.ts`)
- `addFavorite(userId, projectId)` - Add project to favorites
- `removeFavorite(userId, projectId)` - Remove from favorites
- `getUserFavorites(userId)` - Get user's favorite projects
- `isFavorite(userId, projectId)` - Check if project is favorited

### AuthService (`src/services/auth.service.ts`)
- `signUp(data)` - Register new user
- `signIn(data)` - Sign in user
- `signOut()` - Sign out user
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword)` - Update user password
- `getCurrentUser()` - Get current authenticated user
- `getCurrentSession()` - Get current session
- `onAuthStateChange(callback)` - Listen to auth state changes

## Authentication Context

The application includes a Supabase authentication context (`src/context/SupabaseAuthContext.tsx`) that provides:

- User state management
- Profile synchronization
- Authentication methods (sign in, sign up, sign out)
- Profile management

### Usage Example

```typescript
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

function MyComponent() {
  const { user, profile, isAuthenticated, signIn, signOut } = useSupabaseAuth();

  // Use auth state and methods
}
```

## Setup Instructions

### 1. Database Migration

You'll need to run the SQL schema in your Supabase project dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the SQL schema from the design documents
4. Execute the SQL to create all tables, indexes, RLS policies, and triggers

### 2. Environment Variables

The required environment variables are already set in `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Testing

After setting up the database:

1. Test user registration and authentication
2. Create test projects
3. Test contributions and favorites
4. Verify RLS policies are working correctly

## Features

- **Full CRUD Operations**: Complete create, read, update, delete functionality for all entities
- **Row Level Security**: Comprehensive security policies to protect user data
- **Real-time Updates**: Auto-updating timestamps and project funding amounts
- **Search & Filter**: Full-text search and genre filtering
- **User Authentication**: Supabase auth with email/password
- **Profile Management**: User profiles with IMDb integration support
- **Project Management**: Complete project lifecycle management
- **Contribution Tracking**: Track and display project contributions
- **Favorites System**: Users can save favorite projects

## Performance Optimizations

- Indexed foreign keys for fast joins
- Full-text search index on project titles and synopses
- Efficient queries with proper select statements
- Pagination support for large datasets

## Security

- Row Level Security on all tables
- Authentication required for sensitive operations
- Data validation at the service layer
- Secure password handling via Supabase Auth
- CORS policies properly configured
