# Agentic Recreation Prompt

This file contains a comprehensive prompt designed to be fed into another AI language model (or autonomous coding agent) to completely recreate "The Collective" (also known as Cinebayan) Next.js application, including its specific configurations, data states, and UI systems.

---

## 🤖 Copy and Paste the Following Prompt to Your AI Agent:

```md
Act as an expert Full-Stack Next.js Developer. Your task is to recreate "The Collective" (also known as Cinebayan), a premium crowdfunding platform for independent filmmakers. The application is Netflix/IMDb inspired, featuring a dark, cinematic theme with glassmorphism and smooth animations.

### 1. Technology Stack & Versions
You must configure the following exact dependencies to ensure compatibility:
- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.0, React DOM 19.2.0
- **Styling**: Tailwind CSS 3.4.17 + PostCSS 8 + Vanilla Custom CSS with 8px-based spacing variables
- **Animations**: Framer Motion 11.18.2
- **Carousel**: Embla Carousel React 8.6.0
- **Backend & Auth**: Supabase SSR 0.7.0 & Supabase JS 2.84.0
- **Localization**: next-intl 4.5.5
- **Testing**: Jest 30.2.0 + React Testing Library 16.3.0
- **Language**: TypeScript 5+

### 2. Environment & Mock Data States (Special Statuses)
Implement a robust script setup in `package.json` to handle different environments and mock data states via `APP_ENV` and `MOCK_DATA_STATE`.
- `dev` - Normal development (`next dev`)
- `dev:empty` - `MOCK_DATA_STATE=empty` (Shows beautiful empty state UI: "Pitch Your Screenplay")
- `dev:populated` - `MOCK_DATA_STATE=populated` (Loads realistic mock projects)
- `dev:pitch` - `MOCK_DATA_STATE=pitch-focused` (Focuses UI on the pitch-creation workflow)
- `qa`, `qa:empty`, `qa:populated`, `qa:pitch` - Same functionality as `dev` but sets `APP_ENV=qa`

### 3. Database Schema & Service Layer
The application uses 8 Supabase tables with Row Level Security (RLS). You must create a generic Service Layer pattern using TypeScript classes with static methods:
- **profiles**: User management (managed via `ProfilesService` and `AuthService`)
- **projects**: The core entity. Has fields for `is_published`, `status` ('draft', 'active', 'funded', 'completed', 'cancelled'). Managed via `ProjectsService`
- **cast_crew**: Associated with projects
- **accolades**: Awards and recognition for projects
- **contributions**: Funding tracking (`ContributionsService`)
- **project_updates**: News/updates
- **favorites**: User saves (`FavoritesService`)
- **crew_invitations**: Invite logic with 'pending', 'accepted', 'declined' statuses (`CrewInvitationsService`)

### 4. Core Workflows to Implement
- **Authentication**: Email/Password via Supabase. Implement a `SupabaseAuthContext`.
- **Create Pitch Workflow**: A 5-step form (Title/Genre -> Synopsis -> Country -> Funding Goal -> Crew Invites). Supports saving as 'draft' or 'published' status.
- **Empty State**: If no projects exist, show an empty state UI: a cinematic 3-card showcase and a CTA to create a pitch.

### 5. UI & Design System (Master UI)
- **Colors**: Deep black background (`#0a0a0a`), Primary Red (`#E50914`), Secondary Blue (`#00d4ff`), Accent Gold (`#f5c518`), Glass (`rgba(255, 255, 255, 0.05)`).
- **Typography**: Geist Sans font. Tight tracking on headings (-0.03em on Display).
- **Layout**: 8px spacing system variables (`--spacing-1` to `--spacing-16`). CSS grid system with responsive prefixes (`sm-`, `md-`, `lg-`, `xl-`, `2xl-`).
- **Components to Build**: 
  - Dynamic Glassmorphism Navbar (expands to 200px, collapses to 80px).
  - Modern Floating Label Inputs (Text, Select, Textarea) with validation boundaries and character counters.
  - Project Cards with 2:3 aspect ratio, gradient overlays, transparent badging, and animated progress bars.
  - Marquee Hero Carousel with 3D offset effects using Embla.
- **Design Rule**: NO default browser inputs. ALL components must feel premium, responsive, and cinematic.

### Instructions:
Begin by initializing the Next.js project and defining the `package.json` with the exact versions and special mock status scripts. Next, establish the UI token variables (CSS) and the Supabase Service Layer architecture. Following the architecture setup, implement the authentication flows and the primary application routing. Finally, implement the specific React components and styles outlined above.
```
