# Funding Workflow Documentation

## Overview

The funding workflow is a multi-stage process that guides users through contributing to film projects, with authentication checks and project summary displays.

---

## Workflow Concept

**Definition**: A workflow is a shared state and state tracker that has a series of segmented screens or widgets with certain specified steps needed to be completed unless stated as optional.

The funding workflow consists of:
1. **Entry Point** - "Fund This Project" button
2. **Authentication Gate** - Sign in/register if not authenticated
3. **Funding Screen** - Contribution form with project summary
4. **Confirmation** - Success message and redirect

---

## User Flows

### Authenticated User Flow

```
1. User clicks "Fund This Project" button
   ↓
2. Redirected to /fund/[project-id]
   ↓
3. See funding form with:
   - Amount input
   - Quick amount buttons ($10, $25, $50, etc.)
   - Optional message
   - Project summary sidebar
   ↓
4. Submit contribution
   ↓
5. Success confirmation
   ↓
6. Redirect back to project page
```

### Unauthenticated User Flow

```
1. User clicks "Fund This Project" button
   ↓
2. Redirected to /auth/signin?redirect=/fund/[project-id]
   ↓
3. User signs in or creates account
   ↓
4. Automatically redirected to /fund/[project-id]
   ↓
5. See funding form (same as authenticated flow)
   ↓
6. Complete funding process
```

---

## Components

### 1. FundButton Component

**Location**: `src/components/FundButton.tsx`

**Purpose**: Smart button that handles authentication checks and routing

**Props**:
- `projectId` (string, required) - ID of the project to fund
- `className` (string, optional) - Additional CSS classes

**Behavior**:
- **If authenticated**: Routes to `/fund/[projectId]`
- **If not authenticated**: Routes to `/auth/signin?redirect=/fund/[projectId]`
- **While loading**: Shows disabled state with loading text

**Usage**:
```tsx
import FundButton from '@/components/FundButton';

<FundButton projectId="project-123" />
```

---

## Pages

### Funding Workflow Page

**Location**: `src/app/[locale]/fund/[id]/page.tsx`

**Route**: `/[locale]/fund/[id]`

**Authentication**: Required (redirects to sign-in if not authenticated)

#### Layout Structure

**Two-Column Layout**:

**Left Column (2/3 width)**:
- Page header with back button
- Contribution form:
  - Amount input (with $ prefix)
  - Quick amount buttons
  - Optional message textarea
  - Submit button
- Security notice

**Right Column (1/3 width - Sticky)**:
- Project poster image
- Project title
- Director/creator name
- Genre badge
- Synopsis preview (truncated)
- Funding statistics:
  - Amount raised
  - Funding goal
  - Progress percentage
  - Progress bar

#### Form Fields

**Amount Input**:
- Type: Number
- Min: $1.00
- Step: 0.01
- Required: Yes
- Format: USD currency
- Quick select: $10, $25, $50, $100, $250, $500

**Message Input**:
- Type: Textarea
- Max length: 500 characters
- Required: No
- Character counter displayed

#### Form Validation

- Amount must be greater than $0
- Amount must be at least $1.00
- Message limited to 500 characters
- Form cannot be submitted while processing

#### States

**Loading State**:
- Shows spinner
- Displays while checking authentication
- Displays while loading project data

**Submitting State**:
- Disables submit button
- Shows spinner in button
- Changes button text to "Processing..."

**Success State**:
- Shows alert with contribution amount
- Redirects to project page

**Error State**:
- Shows alert with error message
- Allows retry

---

## Project Integration

### Project Details Page Update

**File**: `src/app/[locale]/projects/[id]/page.tsx`

**Change**: Replaced static button with `FundButton` component

**Before**:
```tsx
<button className="btn btn-primary w-full text-xl py-4">
  Fund This Project
</button>
```

**After**:
```tsx
<FundButton projectId={id} />
```

---

## Workflow States

### State 1: Button Click (Entry Point)
- **Location**: Any page with FundButton
- **User Action**: Click "Fund This Project"
- **System Action**: Check authentication status
- **Next State**: Authentication check

### State 2: Authentication Check
- **Condition**: User authenticated?
  - **Yes** → State 3 (Funding Screen)
  - **No** → State 2a (Sign In)

### State 2a: Sign In (Authentication Gate)
- **Location**: `/auth/signin?redirect=/fund/[id]`
- **User Action**: Sign in or create account
- **System Action**: Authenticate user, store redirect URL
- **Next State**: State 3 (Funding Screen)

### State 3: Funding Screen (Main Workflow)
- **Location**: `/fund/[id]`
- **Requirements**: Must be authenticated
- **Display**:
  - Funding form (left)
  - Project summary (right)
- **User Actions**:
  - Enter amount (required)
  - Select quick amount (optional)
  - Add message (optional)
  - Submit contribution
- **Next State**: State 4 (Processing)

### State 4: Processing
- **Display**: Loading spinner in submit button
- **System Action**: Process contribution (simulated)
- **Duration**: ~1.5 seconds
- **Next State**: State 5 (Confirmation)

### State 5: Confirmation
- **Display**: Success alert
- **System Action**: Redirect to project page
- **User sees**: "Successfully pledged $X to [Project Title]!"

---

## Security & Validation

### Authentication Guards

**Client-Side**:
```typescript
useEffect(() => {
  if (!loading && !isAuthenticated) {
    router.push(`/auth/signin?redirect=/fund/${projectId}`);
  }
}, [isAuthenticated, loading, router, projectId]);
```

**Rendering**:
- Shows loading spinner while checking auth
- Returns null if not authenticated (during redirect)
- Only renders form once authenticated

### Form Validation

**Amount Validation**:
- Must be a number
- Must be ≥ $1.00
- Validated on submit

**Message Validation**:
- Max 500 characters
- Character counter updates in real-time
- Non-blocking (optional field)

### Data Validation

**Project Validation**:
- Project must exist
- Redirects to home if project not found
- Shows loading while fetching project data

---

## User Experience

### Visual Feedback

**Button States**:
```
Default     → Primary color, shadow
Hover       → Increased shadow
Disabled    → Reduced opacity, no pointer
Loading     → Spinner, "Loading..." text
Submitting  → Spinner, "Processing..." text
```

**Form States**:
```
Empty    → Placeholder text
Focus    → Border color changes to primary
Valid    → Can submit
Invalid  → Submit button disabled
```

### Responsive Design

**Mobile (< 1024px)**:
- Single column layout
- Project summary above form
- Full-width inputs and buttons

**Desktop (≥ 1024px)**:
- Two-column layout
- Sticky project summary sidebar
- Wider form inputs

### Accessibility

**Keyboard Navigation**:
- Tab through all form fields
- Enter to submit form
- Escape to blur focused input

**Screen Readers**:
- Form labels properly associated
- Button states announced
- Error messages read aloud

**Focus States**:
- Visible focus indicators
- Logical tab order
- No keyboard traps

---

## Integration Points

### Authentication Context

Uses `useSupabaseAuth` hook:
```typescript
const { isAuthenticated, user, loading } = useSupabaseAuth();
```

**Required fields**:
- `isAuthenticated` - Boolean auth status
- `user` - Current user object
- `loading` - Loading state

### Router

Uses Next.js `useRouter` for navigation:
```typescript
router.push(url);      // Navigate to URL
router.back();         // Go back to previous page
```

### Project Data

Uses `getProject` function from mock data:
```typescript
const project = await getProject(projectId);
```

**Returns**:
- Project object with all details
- null if project not found

---

## Future Enhancements

### Planned Features

1. **Payment Integration**
   - Stripe integration
   - Real payment processing
   - Receipt generation

2. **Reward Tiers**
   - Define reward levels
   - Select reward when funding
   - Reward fulfillment tracking

3. **Recurring Contributions**
   - Monthly subscriptions
   - Automatic payments
   - Subscription management

4. **Social Sharing**
   - Share contribution on social media
   - Encourage friends to contribute
   - Viral growth features

5. **Contribution History**
   - View past contributions
   - Download receipts
   - Track project updates

6. **Anonymous Contributions**
   - Option to hide name
   - Private contributions
   - Display "Anonymous" in backers list

7. **Contribution Editing**
   - Increase contribution amount
   - Update message
   - Cancel within time window

---

## Error Handling

### Common Errors

**Authentication Failed**:
```typescript
if (!isAuthenticated) {
  router.push(`/auth/signin?redirect=/fund/${projectId}`);
}
```

**Project Not Found**:
```typescript
if (!project) {
  router.push('/');
}
```

**Invalid Amount**:
```typescript
if (!amount || parseFloat(amount) <= 0) {
  alert("Please enter a valid amount");
  return;
}
```

**Submission Failed**:
```typescript
try {
  // Submit logic
} catch (error) {
  alert("Failed to process contribution. Please try again.");
}
```

---

## Testing Checklist

### Authenticated User Tests
- [ ] Click "Fund This Project" button
- [ ] Redirected to `/fund/[id]`
- [ ] Form displays correctly
- [ ] Project summary displays
- [ ] Can enter amount
- [ ] Can select quick amount
- [ ] Can add optional message
- [ ] Submit button enables/disables correctly
- [ ] Submission shows loading state
- [ ] Success message displays
- [ ] Redirected to project page

### Unauthenticated User Tests
- [ ] Click "Fund This Project" button
- [ ] Redirected to sign-in page
- [ ] Redirect URL includes `/fund/[id]`
- [ ] Sign in successfully
- [ ] Automatically redirected to funding page
- [ ] Can complete funding process

### Form Validation Tests
- [ ] Cannot submit with $0 amount
- [ ] Cannot submit with negative amount
- [ ] Can submit with valid amount
- [ ] Message character counter works
- [ ] Cannot exceed 500 characters
- [ ] Quick amount buttons work
- [ ] Form clears after submission

### Error Handling Tests
- [ ] Handle invalid project ID
- [ ] Handle network errors
- [ ] Handle submission errors
- [ ] Show appropriate error messages

### Responsive Design Tests
- [ ] Mobile layout correct
- [ ] Tablet layout correct
- [ ] Desktop layout correct
- [ ] Sticky sidebar works
- [ ] All breakpoints functional

---

## Code References

### Files Created
- `src/components/FundButton.tsx` - Smart funding button
- `src/app/[locale]/fund/[id]/page.tsx` - Funding workflow page

### Files Modified
- `src/app/[locale]/projects/[id]/page.tsx` - Added FundButton

### Key Functions
- `FundButton.handleFundClick()` - Routing logic
- `FundProjectPage.handleSubmit()` - Form submission
- `FundProjectPage useEffect hooks` - Auth and data loading

---

## Summary

The funding workflow provides:
- ✅ Authentication-gated access
- ✅ Seamless redirect flow
- ✅ Project summary display
- ✅ Flexible contribution amounts
- ✅ Optional supporter messages
- ✅ Loading and error states
- ✅ Mobile-responsive design
- ✅ Accessible form controls

**Result**: Professional crowdfunding experience that guides users from discovery to contribution with minimal friction.
