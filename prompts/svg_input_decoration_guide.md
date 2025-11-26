# SVG Input Decoration Guide

## Objective
Create modern, accessible, and visually appealing input fields using SVG elements as functional and decorative enhancements.

## Design Philosophy
- **Material Design Inspired**: Use clean lines, meaningful iconography, and clear state transitions.
- **Functional Decoration**: Icons should indicate the input's purpose (e.g., email envelope, password lock) or status (e.g., checkmark for success, exclamation for error).
- **Interactive**: SVGs should respond to user interaction (focus, hover, filled states).

## Implementation Patterns

### 1. Leading Icon (Left-aligned)
Used to visually identify the input type.
- **Position**: Absolute positioning inside a relative container.
- **Spacing**: `pl-10` or `pl-11` on the input to prevent text overlap.
- **Color**: `text-muted` by default, `text-primary` on focus.

```tsx
<div className="relative">
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary">
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {/* Icon Path */}
    </svg>
  </div>
  <input className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20" />
</div>
```

### 2. Trailing Icon (Right-aligned)
Used for actions (clear input, toggle password visibility) or validation status.
- **Position**: Absolute positioning on the right.
- **Interaction**: Often clickable (buttons).

```tsx
<div className="relative">
  <input className="w-full pl-4 pr-10 py-2 border rounded-lg" />
  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {/* Icon Path */}
    </svg>
  </button>
</div>
```

### 3. Decorative Backgrounds
Subtle SVG patterns to add depth or branding.
- **Usage**: Use as a `background-image` or a layered absolute div behind the input.
- **Style**: Low opacity, abstract shapes.

## Best Practices
- **Size**: Standardize icons to `w-5 h-5` (20px) or `w-4 h-4` (16px).
- **Accessibility**:
  - Decorative icons: `aria-hidden="true"`
  - Interactive icons: Use `<button>` with `aria-label`.
- **Consistency**: Use a consistent icon set (e.g., Heroicons, Material Icons).

## Example Scenarios

### Search Bar
- **Icon**: Magnifying glass (Leading).
- **Action**: "X" to clear text (Trailing, appears when text exists).

### Login Form
- **Email**: Envelope icon.
- **Password**: Lock icon + Eye icon (toggle visibility).

### Credit Card Input
- **Icon**: Dynamic card brand icon (Visa, Mastercard) based on input.
- **Decoration**: Lock icon to indicate security.
