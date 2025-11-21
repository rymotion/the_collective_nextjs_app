# Workflow Pattern Documentation

## Workflow Definition

**A workflow is a shared state and state tracker that has a series of segmented screens or widgets with certain specified steps needed to be completed unless stated as optional.**

---

## Core Workflow Principles

### 1. Shared State
- All workflow data is stored in a centralized state
- State persists across steps
- State can be saved as draft at any point
- State is recoverable if user leaves and returns

### 2. State Tracker
- Visual progress indicator showing completed steps
- Clear indication of current step
- Ability to navigate to completed steps
- Real-time progress counter (e.g., "3/5 Steps Completed")

### 3. Segmented Screens
- Each step is a distinct screen/widget
- One focus area per step
- Clear transitions between steps
- Consistent layout across all steps

### 4. Required vs Optional Steps
- Required steps marked with visual indicator (*)
- Optional steps clearly labeled
- Cannot skip required steps
- Can skip or return to optional steps

---

## Implemented Workflows

### 1. Create Pitch Workflow

**Location**: `/create-pitch`

**Purpose**: Guide filmmakers through creating a project pitch

**Steps**:
1. **Film Title & Genre** (Required)
2. **Story Synopsis** (Required)
3. **Country of Origin** (Required)
4. **Funding Goal** (Required)
5. **Crew Invitations** (Optional)

#### Workflow Features

**Shared State**:
```typescript
interface PitchFormData {
  title: string;
  synopsis: string;
  beginning: string;
  middle: string;
  end: string;
  country_of_origin: string;
  goal: number;
  funding_duration_days: number;
  genre: string;
}
```

**State Tracker**:
- Progress panel showing "X/5 Steps Completed"
- Visual step indicators with checkmarks
- Green progress bar connecting completed steps
- Draft save status indicator

**Step Navigation**:
- Click completed steps to return
- Current step highlighted with ring
- Locked steps shown as disabled
- Forward navigation only with valid data

**Required vs Optional**:
- Steps 1-4: Required (marked with red *)
- Step 5: Optional (labeled "Crew (Optional)")

#### Visual State Indicators

**Step States**:
```
Not Started    → Gray circle with step number
Current        → Red circle with ring, step number
Completed      → Green circle with checkmark
Locked         → Gray circle, disabled, opacity 50%
```

**Progress Bars**:
```
Not Completed  → Gray bar
Completed      → Green bar
```

**Step Labels**:
```
Current Step   → Primary color, bold
Other Steps    → Muted color
Required       → Red asterisk (*)
Optional       → "(Optional)" suffix
```

---

### 2. Funding Workflow

**Location**: `/fund/[id]`

**Purpose**: Guide users through contributing to a project

**Steps**:
1. **Authentication Check** (Required - automatic)
2. **Contribution Form** (Required)
   - Amount selection
   - Optional message
3. **Confirmation** (automatic)

#### Workflow Features

**Shared State**:
```typescript
interface FundingState {
  projectId: string;
  amount: string;
  message: string;
  isSubmitting: boolean;
}
```

**State Tracker**:
- Single-page workflow
- Form validation as state tracker
- Submit button enabled/disabled as progress indicator
- Loading states during processing

**Step Flow**:
```
Entry → Auth Check → Funding Form → Processing → Confirmation
```

**Required vs Optional**:
- Amount: Required (validated)
- Message: Optional (500 char limit)

---

## Workflow Implementation Pattern

### Step 1: Define Workflow State

```typescript
// Define all data collected across workflow
interface WorkflowData {
  field1: string;
  field2: number;
  // ... all fields
}

// Track step completion
const [currentStep, setCurrentStep] = useState(1);
const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
const [formData, setFormData] = useState<WorkflowData>(initialState);
```

### Step 2: Implement State Tracker UI

```tsx
// Progress Panel
<div className="glass-panel p-6 mb-8 border-2 border-primary/30">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-bold">Workflow Progress</h3>
      <p className="text-sm text-muted">
        Complete all required steps
      </p>
    </div>
    <div className="text-right">
      <div className="text-3xl font-bold text-primary">
        {completedSteps.size}/{totalSteps}
      </div>
      <div className="text-xs text-muted">Steps Completed</div>
    </div>
  </div>
</div>

// Step Indicators
<div className="flex items-center justify-between">
  {steps.map((step) => (
    <StepIndicator
      key={step}
      number={step}
      isCompleted={completedSteps.has(step)}
      isCurrent={step === currentStep}
      isClickable={canNavigateToStep(step)}
      onClick={() => goToStep(step)}
    />
  ))}
</div>
```

### Step 3: Create Segmented Screens

```tsx
<div className="glass-panel p-8">
  {currentStep === 1 && <Step1Content />}
  {currentStep === 2 && <Step2Content />}
  {currentStep === 3 && <Step3Content />}
  // ... more steps
</div>
```

### Step 4: Implement Navigation Logic

```typescript
const nextStep = () => {
  if (currentStep < totalSteps) {
    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    setCurrentStep(currentStep + 1);
  }
};

const prevStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};

const goToStep = (step: number) => {
  // Only allow navigation to current, previous, or completed steps
  if (step <= currentStep || completedSteps.has(step - 1)) {
    setCurrentStep(step);
  }
};

const canProceed = () => {
  // Validate current step data
  return validateStep(currentStep, formData);
};
```

### Step 5: Mark Required vs Optional

```typescript
const isStepRequired = (step: number) => {
  // Define which steps are optional
  return ![optionalStepNumbers].includes(step);
};

// In UI
<span>
  Step {step} {isStepRequired(step) && <span className="text-red-500">*</span>}
</span>
```

### Step 6: Implement Draft Saving

```typescript
const saveDraft = async () => {
  try {
    setSubmitting(true);

    if (draftId) {
      await updateDraft(draftId, formData);
    } else {
      const draft = await createDraft(formData);
      setDraftId(draft.id);
    }

    showSuccessMessage('Draft saved');
  } catch (error) {
    showErrorMessage('Failed to save draft');
  } finally {
    setSubmitting(false);
  }
};
```

---

## Visual Design Requirements

### Progress Panel
- Border with primary color accent
- Large progress number (3xl font)
- Description text
- Draft save indicator (when applicable)

### Step Indicators
- Circular buttons (48px diameter)
- Three states: incomplete, current, completed
- Checkmark icon for completed steps
- Ring effect for current step
- Hover effects for clickable steps

### Progress Bars
- Connect step indicators
- Change color when step completed
- Smooth transitions

### Step Labels
- Below step indicators
- Current step highlighted
- Required marker (red asterisk)
- Optional label for optional steps

### Navigation Buttons
- Previous button (left)
- Next/Submit button (right)
- Save Draft button (center/right)
- Disabled states for invalid data

---

## Validation Rules

### Per-Step Validation

```typescript
const validateStep = (step: number, data: WorkflowData) => {
  switch (step) {
    case 1:
      return data.requiredField1.trim().length > 0;
    case 2:
      return data.requiredField2 > 0;
    case 3:
      return data.requiredField3 !== '';
    case 4:
      return true; // Optional step
    default:
      return false;
  }
};
```

### Form-Level Validation

```typescript
const canPublish = () => {
  // All required steps must be completed
  const requiredSteps = [1, 2, 3]; // Not including optional step 4
  return requiredSteps.every(step => completedSteps.has(step));
};
```

---

## User Experience Patterns

### 1. Linear Progression
- Users move through steps in order
- Cannot skip ahead to locked steps
- Can return to previous/completed steps

### 2. Visual Feedback
- Immediate validation on field blur
- Real-time character counters
- Progress updates after each step
- Success/error messages

### 3. Draft Persistence
- Auto-save on step completion (optional)
- Manual "Save Draft" button
- Visual confirmation when saved
- Draft ID stored for updates

### 4. State Recovery
- Load existing draft on page load
- Restore form data
- Restore completed steps
- Allow continuation from last step

### 5. Completion Clarity
- Clear indication of required vs optional
- Progress counter shows what's left
- Publish button only enabled when ready
- Final confirmation before submission

---

## Accessibility

### Keyboard Navigation
- Tab through form fields
- Enter to proceed to next step
- Arrow keys for step navigation
- Escape to cancel/go back

### Screen Readers
- Announce current step
- Announce step completion
- Announce progress updates
- Read required vs optional labels

### Focus Management
- Focus first field on step change
- Maintain focus after actions
- Clear focus indicators
- No keyboard traps

---

## Mobile Considerations

### Responsive Step Indicators
```css
/* Desktop: Horizontal */
.step-indicators {
  flex-direction: row;
}

/* Mobile: Vertical or compact */
@media (max-width: 768px) {
  .step-indicators {
    flex-direction: column;
    /* OR */
    scale: 0.8;
  }
}
```

### Touch-Friendly Targets
- Minimum 48x48px tap targets
- Adequate spacing between elements
- Larger buttons on mobile
- Swipe gestures for navigation (optional)

---

## Error Handling

### Validation Errors
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validateField = (field: string, value: any) => {
  if (!isValid(value)) {
    setErrors(prev => ({
      ...prev,
      [field]: 'Error message'
    }));
    return false;
  }

  setErrors(prev => {
    const newErrors = { ...prev };
    delete newErrors[field];
    return newErrors;
  });
  return true;
};
```

### Submission Errors
```typescript
try {
  await submitWorkflow(formData);
  showSuccess('Published successfully');
  router.push('/success-page');
} catch (error) {
  showError('Failed to publish. Please try again.');
  // Keep user on current step
  // Allow retry
}
```

---

## Testing Checklist

### Workflow State
- [ ] State persists between steps
- [ ] Draft saves correctly
- [ ] Draft loads on return
- [ ] State updates are immediate

### Step Navigation
- [ ] Can proceed with valid data
- [ ] Cannot proceed with invalid data
- [ ] Can go back to previous steps
- [ ] Can click completed steps
- [ ] Cannot click locked steps

### Visual Indicators
- [ ] Step numbers display correctly
- [ ] Checkmarks show on completion
- [ ] Progress bar updates
- [ ] Current step highlighted
- [ ] Required markers visible

### Validation
- [ ] Required fields enforced
- [ ] Optional fields skippable
- [ ] Error messages clear
- [ ] Real-time validation works

### Submission
- [ ] Draft saves successfully
- [ ] Publish requires all required steps
- [ ] Loading states show
- [ ] Success confirmation displays
- [ ] Redirect after success

---

## Code Examples

### Complete Workflow Component Structure

```typescript
export default function WorkflowPage() {
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<WorkflowData>(initialState);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Navigation
  const nextStep = () => { /* ... */ };
  const prevStep = () => { /* ... */ };
  const goToStep = (step: number) => { /* ... */ };

  // Validation
  const canProceed = () => { /* ... */ };
  const isStepRequired = (step: number) => { /* ... */ };

  // Actions
  const saveDraft = async () => { /* ... */ };
  const publish = async () => { /* ... */ };

  return (
    <div className="page-content">
      <div className="container-narrow">
        {/* Progress Panel */}
        <ProgressPanel
          completed={completedSteps.size}
          total={totalSteps}
          draftSaved={!!draftId}
        />

        {/* Step Indicators */}
        <StepIndicators
          steps={[1, 2, 3, 4, 5]}
          current={currentStep}
          completed={completedSteps}
          onStepClick={goToStep}
          labels={stepLabels}
          required={[1, 2, 3, 4]}
        />

        {/* Step Content */}
        <StepContent
          step={currentStep}
          data={formData}
          onChange={setFormData}
          errors={errors}
        />

        {/* Navigation */}
        <NavigationButtons
          onPrevious={prevStep}
          onNext={nextStep}
          onSaveDraft={saveDraft}
          onPublish={publish}
          canProceed={canProceed()}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === totalSteps}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
```

---

## Summary

Workflows in The Collective follow a consistent pattern:

1. ✅ **Shared State** - Centralized data management
2. ✅ **State Tracker** - Visual progress indicators
3. ✅ **Segmented Screens** - One focus per step
4. ✅ **Required/Optional** - Clear step requirements
5. ✅ **Draft Saving** - Progress persistence
6. ✅ **Navigation** - Flexible step movement
7. ✅ **Validation** - Per-step and form-level
8. ✅ **Visual Feedback** - Immediate user feedback
9. ✅ **Accessibility** - Keyboard and screen reader support
10. ✅ **Mobile-Friendly** - Responsive design

**Result**: Professional, user-friendly workflows that guide users through complex multi-step processes with clarity and confidence.
