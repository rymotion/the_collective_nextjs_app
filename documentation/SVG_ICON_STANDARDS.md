# SVG Icon Standards

## Overview

This document defines the standardized sizing and usage patterns for all SVG icons across The Collective application.

---

## Icon Size Standards

### 1. Form Field Decorations

**Size**: `w-5 h-5` (20px × 20px)

**Usage**: Icons that appear inside or alongside input fields as visual decorations.

**Examples**:
- Email icon in login/signup forms
- Lock icon for password fields
- Search icon in search bar
- User icon for display name

**Code Pattern**:
```tsx
<svg
  className="w-5 h-5 text-muted"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="currentColor"
>
  {/* SVG paths */}
</svg>
```

**Implementation**:
```tsx
// Inside Input component
<div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10" aria-hidden="true">
  <svg className="w-5 h-5">
    {/* Icon */}
  </svg>
</div>
```

---

### 2. Interactive Button Icons

**Size**: `w-5 h-5` (20px × 20px)

**Usage**: Icons inside buttons that perform actions.

**Examples**:
- Password visibility toggle (eye icons)
- Close buttons
- Navigation arrows
- Menu icons

**Code Pattern**:
```tsx
<button
  aria-label="Show password"
  className="..."
>
  <svg
    className="w-5 h-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    {/* SVG paths */}
  </svg>
</button>
```

**Note**: Button must have `aria-label`, SVG must have `aria-hidden="true"`.

---

### 3. Workflow Indicators

**Size**: `w-6 h-6` (24px × 24px)

**Usage**: Status indicators, step markers, checkmarks in larger UI elements.

**Examples**:
- Step completion checkmarks
- Progress indicators
- Status badges
- Feature icons in cards

**Code Pattern**:
```tsx
<button className="w-12 h-12 rounded-full">
  <svg
    className="w-6 h-6"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
  >
    <path d="M4.5 12.75l6 6 9-13.5" />
  </svg>
</button>
```

---

### 4. Empty State Decorations

**Size**: `w-16 h-16` to `w-24 h-24` (64px-96px)

**Usage**: Large decorative icons in empty states or placeholder sections.

**Examples**:
- "No projects yet" film reel icon
- "No results found" magnifying glass
- Feature showcase icons

**Code Pattern**:
```tsx
<svg
  className="w-20 h-20 mx-auto mb-6 text-muted opacity-50"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
>
  {/* SVG paths */}
</svg>
```

---

### 5. Loading Spinners

**Size**: Varies by context
- Small: `w-4 h-4` (inline with text)
- Medium: `w-5 h-5` (buttons)
- Large: `w-16 h-16` (full-page loading)

**Code Pattern**:
```tsx
<svg
  className="animate-spin w-5 h-5"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  aria-label="Loading"
>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>
```

---

### 6. Special Case: Dollar Sign

**Size**: Matches input text size

**Usage**: Currency symbol in amount input fields.

**Code Pattern**:
```tsx
<div className="relative">
  <span
    className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted pointer-events-none"
    aria-hidden="true"
  >
    $
  </span>
  <input
    type="number"
    className="w-full pl-12 pr-4 py-4 text-2xl font-bold"
    aria-label="Contribution amount in USD"
  />
</div>
```

**Note**: Text decoration should match input's `text-*` class.

---

## Accessibility Requirements

### 1. Decorative Icons

Must include `aria-hidden="true"`:

```tsx
<svg className="w-5 h-5" aria-hidden="true">
  {/* Icon */}
</svg>
```

**Why**: Screen readers should ignore purely visual decorations.

---

### 2. Interactive Icons

Button must have descriptive `aria-label`:

```tsx
<button aria-label="Close dialog">
  <svg className="w-5 h-5" aria-hidden="true">
    {/* X icon */}
  </svg>
</button>
```

**Why**: Screen readers need text description of button action.

---

### 3. Input Fields with Icons

Input should have `aria-label` or visible label:

```tsx
<label htmlFor="email">Email Address</label>
<div className="relative">
  <svg className="absolute" aria-hidden="true">
    {/* Envelope icon */}
  </svg>
  <input id="email" type="email" />
</div>
```

**Why**: Icon is decoration; label provides the meaning.

---

## CSS Classes Reference

### Positioning

```css
/* Absolute positioning for input icons */
.absolute .left-4 .top-1/2 .-translate-y-1/2

/* Prevent interaction */
.pointer-events-none

/* Prevent wrapping/shrinking */
.shrink-0
```

### Colors

```css
/* Standard icon color */
.text-muted

/* Hover states for interactive icons */
.hover:text-foreground
.hover:text-primary

/* Primary colored icons */
.text-primary

/* Error state icons */
.text-red-500
```

### Stroke Width

```css
/* Form icons - lighter */
strokeWidth={2}

/* Workflow icons - medium */
strokeWidth={2.5}

/* Emphasis icons - bold */
strokeWidth={3}

/* Empty state icons - light */
strokeWidth={1.5}
```

---

## Component-Specific Standards

### Input Component

**Icon Size**: `w-5 h-5`
**Icon Position**: Left side, 16px from edge
**Input Padding**: `pl-12` when icon present

```tsx
<Input
  icon={
    <svg className="w-5 h-5" aria-hidden="true">
      {/* Icon */}
    </svg>
  }
/>
```

---

### Search Bar

**Icon Size**: `w-5 h-5`
**Container**: Flex layout with gap
**Icon**: Non-shrinking decoration

```tsx
<div className="flex items-center gap-4">
  <svg className="w-5 h-5 shrink-0" aria-hidden="true">
    {/* Search icon */}
  </svg>
  <input className="flex-1" aria-label="Search projects" />
</div>
```

---

### Password Toggle

**Icon Size**: `w-5 h-5`
**Position**: Right side, absolute
**Button**: Has aria-label

```tsx
<button
  aria-label={showPassword ? "Hide password" : "Show password"}
  className="absolute right-4 top-1/2 -translate-y-1/2"
>
  <svg className="w-5 h-5" aria-hidden="true">
    {/* Eye icon */}
  </svg>
</button>
```

---

### Amount Input

**Decoration**: Dollar sign (text, not SVG)
**Size**: Matches input text size
**Position**: Left side, absolute

```tsx
<span
  className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted pointer-events-none"
  aria-hidden="true"
>
  $
</span>
<input
  type="number"
  className="pl-12 text-2xl font-bold"
  aria-label="Contribution amount in USD"
/>
```

---

## Quick Reference Table

| Context | Size | Stroke | Classes | Aria |
|---------|------|--------|---------|------|
| Form field icon | `w-5 h-5` | `2` | `text-muted pointer-events-none` | `aria-hidden="true"` |
| Button icon | `w-5 h-5` | `2` | `text-muted hover:text-foreground` | Button: `aria-label` |
| Search icon | `w-5 h-5` | `2` | `text-muted shrink-0` | `aria-hidden="true"` |
| Password toggle | `w-5 h-5` | `2` | `text-muted hover:text-foreground` | Button: `aria-label` |
| Step indicator | `w-6 h-6` | `3` | Varies by state | Context-dependent |
| Empty state | `w-20 h-20` | `1.5` | `text-muted opacity-50` | `aria-hidden="true"` |
| Loading spinner | `w-5 h-5` | `4` | `animate-spin` | `aria-label="Loading"` |

---

## Implementation Checklist

When adding a new SVG icon:

- [ ] Choose correct size based on context
- [ ] Set appropriate `strokeWidth`
- [ ] Add `aria-hidden="true"` if decorative
- [ ] Add `aria-label` to parent button if interactive
- [ ] Use `pointer-events-none` for decorations
- [ ] Use `shrink-0` in flex containers
- [ ] Apply consistent color classes
- [ ] Include proper positioning classes
- [ ] Test keyboard navigation
- [ ] Test screen reader announcement

---

## Examples from Codebase

### ✅ Good Examples

**Form Field Icon**:
```tsx
// src/components/Input.tsx
<div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10" aria-hidden="true">
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    {/* Email icon */}
  </svg>
</div>
```

**Search Bar**:
```tsx
// src/app/[locale]/search/page.tsx
<div className="flex items-center gap-4">
  <svg className="w-5 h-5 text-muted shrink-0" aria-hidden="true">
    {/* Search icon */}
  </svg>
  <input className="flex-1" aria-label="Search projects" />
</div>
```

**Password Toggle**:
```tsx
// src/components/Input.tsx
<button
  aria-label={showPassword ? "Hide password" : "Show password"}
  className="absolute right-4 top-1/2 -translate-y-1/2"
>
  <svg className="w-5 h-5" aria-hidden="true">
    {/* Eye icon */}
  </svg>
</button>
```

---

## Testing

### Visual Testing

1. **Proportions**: Icon should be visually balanced with text
2. **Alignment**: Icon should vertically center with input field
3. **Spacing**: Adequate gap between icon and text
4. **States**: Icon color should change with focus/hover states

### Accessibility Testing

1. **Screen Reader**: Icon should not be announced if decorative
2. **Keyboard Navigation**: Tab should skip decorative icons
3. **Focus Order**: Interactive icons should have logical tab order
4. **Labels**: All interactive elements should have text labels

---

## Migration Notes

### Changes Applied

1. **Search Page**: Changed from `w-6 h-6` to `w-5 h-5`
2. **Input Component**: Added `aria-hidden="true"` to icon wrapper
3. **Password Toggle**: Added `aria-label` to button, `aria-hidden` to SVG
4. **Fund Page**: Added `pointer-events-none` and `aria-hidden` to dollar sign

### Files Updated

- `/app/[locale]/search/page.tsx`
- `/components/Input.tsx`
- `/app/[locale]/fund/[id]/page.tsx`

---

## Summary

**Standard Form Icon Sizing**: `w-5 h-5` (20px)

**Key Principles**:
- ✅ Consistent sizing based on context
- ✅ Proper accessibility attributes
- ✅ Visual balance with surrounding elements
- ✅ Clear separation between decorative and functional
- ✅ Responsive stroke weights for readability

**Result**: Professional, accessible, and visually consistent icon system throughout The Collective application!
