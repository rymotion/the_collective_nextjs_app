# Project Code Feature

## Overview

Every project in The Collective now receives a unique, human-readable identification code when created. This provides an easy way to reference and share projects.

---

## Feature Details

### Project Code Format

```
PRJ-XXXX-XXXX
```

**Example**: `PRJ-A7B2-K9M4`

**Structure**:
- **Prefix**: `PRJ-` (indicates it's a project)
- **First Segment**: 4 random alphanumeric characters
- **Hyphen**: `-` (for readability)
- **Second Segment**: 4 random alphanumeric characters

**Character Set**: `A-Z` and `0-9` (36 possible characters)

**Total Combinations**: 36^8 = 2,821,109,907,456 unique codes

---

## Implementation

### Database Schema

#### New Column: `project_code`

Added to the `projects` table:

```sql
project_code text UNIQUE NOT NULL DEFAULT generate_project_code()
```

**Properties**:
- **Type**: `text`
- **Unique**: Yes (enforced by database constraint)
- **Not Null**: Yes (every project must have a code)
- **Default**: Auto-generated using `generate_project_code()` function
- **Indexed**: Yes (for fast lookups)

### Code Generation Function

```sql
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
```

**How it works**:
1. Starts with prefix `PRJ-`
2. Generates 8 random alphanumeric characters
3. Inserts hyphen after 4th character
4. Checks database for collisions
5. Returns unique code (loops until unique)

---

## Use Cases

### 1. Project Identification

Users can easily reference projects:

```
"Check out my project: PRJ-A7B2-K9M4"
```

Instead of:

```
"Check out my project: a6f3e8c2-4b9d-4e3a-9f2b-1c8d7e6f5a4b"
```

### 2. Sharing Links

Create memorable project URLs:

```
thecollective.com/p/PRJ-A7B2-K9M4
```

### 3. Search & Filter

Search projects by code:

```sql
SELECT * FROM projects WHERE project_code = 'PRJ-A7B2-K9M4';
```

### 4. Support & Administration

Customer support can easily identify projects:

```
User: "I need help with project PRJ-A7B2-K9M4"
Support: [Quick lookup] "Yes, I see your project 'The Last Horizon'"
```

### 5. Analytics & Reporting

Track projects using codes instead of UUIDs in reports and dashboards.

---

## API Integration

### TypeScript/JavaScript

Update project interfaces to include the code:

```typescript
interface Project {
  id: string;              // UUID (internal)
  project_code: string;    // Human-readable (public)
  title: string;
  // ... other fields
}
```

### Service Layer

```typescript
// Get project by code
async function getProjectByCode(code: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_code', code)
    .maybeSingle();

  return data;
}

// Display code in UI
function ProjectCard({ project }) {
  return (
    <div>
      <h2>{project.title}</h2>
      <span className="project-code">{project.project_code}</span>
    </div>
  );
}
```

---

## Migration SQL

To apply this feature to an existing database:

```sql
/*
  # Add Unique Project Code Identification

  1. New Features
    - Adds `project_code` column to projects table
    - Creates function to generate unique project codes
    - Format: PRJ-XXXX-XXXX (e.g., PRJ-A7B2-K9M4)

  2. Changes
    - projects table
      - `project_code` (text, unique, auto-generated)

  3. Indexing
    - Add index on project_code for fast lookups

  4. Purpose
    - Provides human-readable project identifiers
    - Easy to share and reference projects
    - Alternative to UUID for public-facing identification
    - Maintains uniqueness across all projects
*/

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

-- Add project_code column to projects table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'project_code'
  ) THEN
    ALTER TABLE projects ADD COLUMN project_code text UNIQUE NOT NULL DEFAULT generate_project_code();
  END IF;
END $$;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(project_code);

-- Add comment explaining the column
COMMENT ON COLUMN projects.project_code IS 'Unique human-readable identifier (e.g., PRJ-A7B2-K9M4). Automatically generated on creation. Used for easy project identification and sharing.';
```

---

## Security Considerations

### Not a Security Feature

**Important**: Project codes are NOT meant for security or authentication.

- ❌ Don't use codes for access control
- ❌ Don't assume codes are secret
- ✅ Use UUIDs for internal references
- ✅ Use codes for user-facing identification
- ✅ Apply RLS policies based on UUID, not code

### Public vs Private

- **Public Projects**: Code can be shared freely
- **Draft Projects**: Code exists but project is not publicly accessible
- **Access Control**: Always based on RLS policies, not code knowledge

---

## UI/UX Recommendations

### Display Locations

**Project Card**:
```
┌─────────────────────────┐
│ The Last Horizon        │
│ PRJ-A7B2-K9M4          │
│ by Alice Director       │
└─────────────────────────┘
```

**Project Details Header**:
```
The Last Horizon
PRJ-A7B2-K9M4 | Sci-Fi | Active
```

**Share Dialog**:
```
Share this project:
https://thecollective.com/p/PRJ-A7B2-K9M4

[Copy Link]
```

**Dashboard**:
```
Your Projects
─────────────
The Last Horizon (PRJ-A7B2-K9M4)
Echoes of Silence (PRJ-K3M9-L7P2)
```

### Copy-to-Clipboard

```typescript
function CopyProjectCode({ code }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Project code copied!');
  };

  return (
    <button onClick={handleCopy} className="copy-btn">
      {code}
      <CopyIcon />
    </button>
  );
}
```

---

## Testing

### Unit Tests

```typescript
describe('Project Code Generation', () => {
  it('should generate code with correct format', () => {
    const code = generateProjectCode();
    expect(code).toMatch(/^PRJ-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it('should generate unique codes', () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateProjectCode());
    }
    expect(codes.size).toBe(1000);
  });

  it('should use only uppercase letters and numbers', () => {
    const code = generateProjectCode();
    const chars = code.replace(/PRJ-|-/g, '');
    expect(chars).toMatch(/^[A-Z0-9]+$/);
  });
});
```

### Database Tests

```sql
-- Test code uniqueness constraint
INSERT INTO projects (title, author_id, synopsis, genre, goal, project_code)
VALUES ('Test', 'uuid', 'test', 'Action', 1000, 'PRJ-TEST-0001');

-- Should fail (duplicate code)
INSERT INTO projects (title, author_id, synopsis, genre, goal, project_code)
VALUES ('Test 2', 'uuid', 'test', 'Action', 1000, 'PRJ-TEST-0001');

-- Test auto-generation
INSERT INTO projects (title, author_id, synopsis, genre, goal)
VALUES ('Test 3', 'uuid', 'test', 'Action', 1000);
-- Should auto-generate unique code

SELECT project_code FROM projects WHERE title = 'Test 3';
-- Should return PRJ-XXXX-XXXX format
```

---

## Performance

### Index Performance

With index on `project_code`:

```sql
EXPLAIN ANALYZE
SELECT * FROM projects WHERE project_code = 'PRJ-A7B2-K9M4';
```

**Expected**: Index scan, O(log n) time complexity

### Generation Performance

- **Average**: < 1ms per code
- **Worst Case**: Increases as table fills (collision checks)
- **Optimization**: Function uses loop until unique found
- **Scalability**: 2.8 trillion possible codes

---

## Future Enhancements

### 1. Custom Prefixes

Allow different entity types:

```
PRJ-XXXX-XXXX  (Projects)
USR-XXXX-XXXX  (Users)
TXN-XXXX-XXXX  (Transactions)
```

### 2. Vanity Codes

Allow creators to customize their code:

```
PRJ-CUST-OM01
```

### 3. QR Codes

Generate QR codes from project codes for physical marketing:

```
[QR Code] → thecollective.com/p/PRJ-A7B2-K9M4
```

### 4. Short URLs

Create even shorter redirects:

```
tc.gg/A7B2K9M4 → thecollective.com/p/PRJ-A7B2-K9M4
```

---

## Summary

The project code feature provides:

- ✅ **Human-Readable**: Easy to remember and share
- ✅ **Unique**: Enforced by database constraint
- ✅ **Automatic**: Generated on project creation
- ✅ **Scalable**: 2.8 trillion possible codes
- ✅ **Indexed**: Fast lookups and searches
- ✅ **Format**: Consistent PRJ-XXXX-XXXX pattern

**Result**: Professional project identification system that enhances user experience and simplifies project referencing across the platform!
