# Create Pitch Workflow Documentation

## Overview

The "Create Pitch" workflow allows authenticated users to create and publish film project pitches with a multi-step form process. Users can save drafts, invite crew members, and publish their projects to the platform.

## Features

### 1. Authentication Guard
- Only authenticated users can access the create pitch workflow
- Unauthenticated users are redirected to sign-in page
- After sign-in, users are redirected back to create pitch

### 2. Multi-Step Form Process

#### Step 1: Film Title & Genre
- **Title**: Enter the film's title (required)
- **Genre**: Select from predefined list (Action, Drama, Sci-Fi, etc.)

#### Step 2: Story Summary
- **Synopsis**: Multi-line text area for overall film summary (required)
- **Beginning**: Describe what happens at the start
- **Middle**: Describe the middle section
- **End**: Describe the conclusion

#### Step 3: Country of Origin
- **Country**: Dropdown menu with major film-producing countries (required)
- Determines where the film will be made

#### Step 4: Funding Setup
- **Funding Goal**: Amount in USD (required)
- **Funding Duration**: Number of days for campaign (1-365 days)
- Calculates deadline automatically on publish

#### Step 5: Crew Invitations
- **Add Crew Members**: Optional step
- Enter full name and email for each crew member
- Can add multiple crew members
- Can remove crew members before publishing

### 3. Draft & Publish Modes

#### Save as Draft
- Available at any step
- Saves project with `is_published = false`
- Project only visible to author
- Can continue editing later
- Auto-updates `modified_at` timestamp

#### Publish Project
- Only available at step 5
- Sets `is_published = true`
- Changes status to 'active'
- Calculates and sets deadline
- Sends crew invitations
- Makes project publicly visible
- Redirects to project page

## Database Schema

### Updated `projects` Table

New columns added:
```sql
is_published boolean DEFAULT false
country_of_origin text
funding_duration_days integer
modified_at timestamptz DEFAULT now()
status ('draft' | 'active' | 'funded' | 'completed' | 'cancelled')
```

### New `crew_invitations` Table

```sql
CREATE TABLE crew_invitations (
  id uuid PRIMARY KEY
  project_id uuid REFERENCES projects(id)
  full_name text NOT NULL
  email text NOT NULL
  invited_by uuid REFERENCES profiles(id)
  status ('pending' | 'accepted' | 'declined')
  created_at timestamptz
  modified_at timestamptz
)
```

## Row Level Security

### Projects
- **Published projects**: Viewable by everyone (authenticated and anonymous)
- **Draft projects**: Only viewable by author

### Crew Invitations
- **View**: Only project owner can see invitations
- **Create/Update/Delete**: Only project owner
- **Invited by**: Must match authenticated user

## Empty State

When no projects exist in the database:
- Shows "No Projects Yet" message
- Displays "Pitch Your Screenplay" button
- Shows three feature cards explaining the process
- Button redirects to create-pitch or sign-in based on auth status

## User Flow

### For Unauthenticated Users
1. Visit homepage with no projects
2. Click "Pitch Your Screenplay"
3. Redirected to sign-in page
4. After sign-in, redirected to create-pitch
5. Complete multi-step form
6. Publish project

### For Authenticated Users
1. Visit homepage with no projects
2. Click "Pitch Your Screenplay"
3. Directed to create-pitch immediately
4. Complete multi-step form
5. Can save draft at any time
6. Publish when ready

## API Services

### CrewInvitationsService

```typescript
// Create single invitation
await CrewInvitationsService.createInvitation({
  project_id: 'uuid',
  full_name: 'John Doe',
  email: 'john@example.com',
  invited_by: 'user-uuid'
});

// Bulk create invitations
await CrewInvitationsService.bulkCreateInvitations(
  projectId,
  userId,
  [
    { full_name: 'Jane Smith', email: 'jane@example.com' },
    { full_name: 'Bob Johnson', email: 'bob@example.com' }
  ]
);

// Get project invitations
const invitations = await CrewInvitationsService.getProjectInvitations(projectId);

// Update invitation status
await CrewInvitationsService.updateInvitationStatus(invitationId, 'accepted');
```

### ProjectsService Updates

Now supports draft/published workflow:

```typescript
// Create draft project
const draft = await ProjectsService.createProject({
  title: 'My Film',
  synopsis: 'Story...',
  genre: 'Drama',
  goal: 50000,
  is_published: false  // Draft
});

// Publish draft
await ProjectsService.updateProject(draftId, {
  is_published: true,
  status: 'active',
  deadline: calculatedDeadline
});
```

## Component Structure

```
/app/[locale]/create-pitch/page.tsx
  - Multi-step form component
  - Authentication guard
  - State management
  - Draft/Publish logic

/components/EmptyProjectsState.tsx
  - Empty state UI
  - Auth-aware CTA button
  - Feature showcase

/services/crew-invitations.service.ts
  - CRUD operations for invitations
  - Bulk invitation creation

/lib/supabase.ts
  - Updated TypeScript types
  - New crew_invitations table type
```

## Form Validation

### Step 1
- Title must not be empty
- Genre should be selected (optional)

### Step 2
- Synopsis must not be empty
- Beginning/Middle/End are optional but recommended

### Step 3
- Country of origin must be selected

### Step 4
- Funding goal must be greater than 0
- Funding duration must be between 1-365 days

### Step 5
- Crew members are optional
- If added, both name and email are required
- Invalid entries are filtered out before saving

## Navigation & Progress

### Step Indicator
- 5 numbered circles showing progress
- Active step highlighted in primary color
- Completed steps connected with colored line
- Can navigate forward when step is valid
- Can navigate backward at any time

### Buttons
- **Previous**: Go to previous step (disabled on step 1)
- **Next**: Go to next step (disabled if current step invalid)
- **Save as Draft**: Available at all steps
- **Publish Project**: Only shown on step 5

## Error Handling

### Authentication Errors
- User not authenticated → Redirect to sign-in
- Session expired → Redirect to sign-in with return URL

### Form Submission Errors
- Display alert with error message
- Keep form data intact
- Allow user to retry
- Log error to console for debugging

### Database Errors
- Network errors caught and displayed
- RLS policy violations handled gracefully
- Validation errors shown to user

## Future Enhancements

### Potential Additions
1. Image upload for project thumbnail
2. Video pitch upload
3. Budget breakdown sections
4. Production timeline
5. Cast & crew roles specification
6. Draft auto-save every X seconds
7. Email notifications to invited crew
8. Crew member response tracking
9. Project preview before publish
10. Social media sharing after publish

## Testing Checklist

- [ ] Empty state shows when no projects
- [ ] Button redirects unauthenticated users to sign-in
- [ ] Sign-in redirect works correctly
- [ ] All 5 steps render correctly
- [ ] Form validation works on each step
- [ ] Draft save functionality works
- [ ] Modified_at updates on changes
- [ ] Crew member add/remove works
- [ ] Publish creates project correctly
- [ ] Crew invitations are created
- [ ] Redirect to project page works
- [ ] Draft projects not visible publicly
- [ ] Published projects visible to all

## Migration Instructions

### Step 1: Run Migration V2
Execute the SQL in `DATABASE_MIGRATION_V2.md` in Supabase SQL Editor

### Step 2: Verify Tables
Check that:
- `projects` table has new columns
- `crew_invitations` table exists
- RLS policies are active

### Step 3: Test Workflow
1. Sign in to the application
2. Navigate to create-pitch
3. Complete all steps
4. Save as draft
5. Publish project
6. Verify project appears

### Step 4: Verify Security
- Try accessing draft as different user (should fail)
- Try accessing published project anonymously (should work)
- Try creating crew invitation without ownership (should fail)

## Troubleshooting

### "Cannot access create-pitch"
- Check user is authenticated
- Verify session is valid
- Check browser console for errors

### "Failed to save draft"
- Check Supabase connection
- Verify RLS policies are correct
- Check user has author_id set

### "Crew invitations not created"
- Verify crew_invitations table exists
- Check RLS policies
- Ensure email format is valid

### "Project not visible after publish"
- Check is_published is set to true
- Verify status is 'active'
- Check RLS SELECT policy
