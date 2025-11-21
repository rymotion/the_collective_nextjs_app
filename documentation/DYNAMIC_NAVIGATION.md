# Dynamic Navigation Bar

## Overview

The navigation bar dynamically adjusts its size based on scroll position and user interaction, providing an immersive experience while maintaining accessibility.

---

## Behavior

### At Top of Page (Default State)
- **Height**: 200px (expanded)
- **Logo**: Large (4xl)
- **Links**: Base size
- **Profile Avatar**: Large (48px)
- **Sign In Button**: Base size with larger padding

### When Scrolled Down
- **Height**: 80px (compact)
- **Logo**: Medium (2xl)
- **Links**: Small size
- **Profile Avatar**: Small (32px)
- **Sign In Button**: Smaller with compact padding

### On Hover (While Scrolled)
- Returns to expanded state (200px)
- All elements scale back to full size
- Smooth transition (300ms)

### On Scroll Up (Mobile)
- Automatically expands to 200px
- Detects scroll direction
- User-friendly mobile experience

---

## Technical Implementation

### State Management

```typescript
const [isScrolled, setIsScrolled] = useState(false);
const [isHovered, setIsHovered] = useState(false);
const [lastScrollY, setLastScrollY] = useState(0);
const [isScrollingUp, setIsScrollingUp] = useState(false);
```

### Scroll Detection

- Uses `requestAnimationFrame` for smooth performance
- Threshold: 50px scroll before triggering compact mode
- Passive event listeners for better performance
- Direction detection for mobile scroll-up behavior

### Expansion Logic

```typescript
const shouldExpand = !isScrolled || isHovered || isScrollingUp;
const navHeight = shouldExpand ? 'h-[200px]' : 'h-[80px]';
```

Navigation expands when:
1. User is at the top of the page (not scrolled)
2. User hovers over the navigation bar
3. User scrolls up (mobile-friendly)

---

## CSS Transitions

### Navigation Bar
```css
transition-all duration-300 ease-in-out
```

### Logo
```typescript
className={`transition-all duration-300 ${
  shouldExpand ? 'text-4xl' : 'text-2xl'
}`}
```

### Navigation Links
```typescript
className={`transition-all duration-300 ${
  shouldExpand ? 'text-base' : 'text-sm'
}`}
```

### Profile Avatar
```typescript
className={`transition-all duration-300 ${
  shouldExpand ? 'w-12 h-12' : 'w-8 h-8'
}`}
```

### Sign In Button
```typescript
className={`transition-all duration-300 ${
  shouldExpand ? 'text-base py-3 px-6' : 'text-sm py-2 px-4'
}`}
```

---

## Page Layout Adjustments

### Main Content Padding

```css
main {
  padding-top: 200px;
  transition: padding-top 0.3s ease-in-out;
}
```

This ensures content starts below the navigation when at the top of the page.

---

## Performance Optimizations

### 1. RequestAnimationFrame
Uses `requestAnimationFrame` for scroll handling to prevent layout thrashing:

```typescript
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Update state
      ticking = false;
    });
    ticking = true;
  }
};
```

### 2. Passive Event Listeners
Scroll events use passive listeners for better scroll performance:

```typescript
window.addEventListener('scroll', handleScroll, { passive: true });
```

### 3. CSS Transitions
Hardware-accelerated CSS transitions instead of JavaScript animations:
- `transition-all duration-300`
- Smooth 300ms easing

---

## User Experience

### Desktop Experience
1. **Initial Load**: Large, prominent navigation
2. **Scrolling Down**: Compact bar for more content space
3. **Hover**: Instant expansion for easy navigation
4. **Scrolling Back Up**: Manual hover required

### Mobile Experience
1. **Initial Load**: Large navigation
2. **Scrolling Down**: Compact for more screen space
3. **Scrolling Up**: Automatic expansion (no hover needed)
4. **Touch Interaction**: Responsive and smooth

---

## Accessibility

### Focus States
- All interactive elements maintain focus states
- Keyboard navigation works in both expanded and compact modes

### Screen Readers
- No layout shift affects screen reader navigation
- Semantic HTML structure preserved

### Motion Preferences
Consider adding motion preference detection:

```css
@media (prefers-reduced-motion: reduce) {
  nav {
    transition: none !important;
  }
}
```

---

## Browser Compatibility

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Mobile browsers (full support)

**Requirements:**
- CSS `transition-all`
- JavaScript `requestAnimationFrame`
- `onMouseEnter`/`onMouseLeave` events
- `window.scrollY` API

---

## Customization

### Adjusting Heights

To change the navigation heights, modify these values:

```typescript
// In Navigation.tsx
const navHeight = shouldExpand ? 'h-[200px]' : 'h-[80px]';

// In globals.css
main {
  padding-top: 200px; /* Match expanded height */
}
```

### Adjusting Scroll Threshold

```typescript
// In Navigation.tsx
setIsScrolled(currentScrollY > 50); // Change 50 to desired pixels
```

### Adjusting Transition Speed

```typescript
// Change duration-300 to duration-200, duration-500, etc.
className="transition-all duration-300"
```

---

## Testing Checklist

- [ ] Navigation expands at top of page
- [ ] Navigation compacts when scrolling down past 50px
- [ ] Navigation expands on hover when scrolled
- [ ] Navigation expands when scrolling up (mobile)
- [ ] Logo scales appropriately
- [ ] Links scale appropriately
- [ ] Profile avatar scales appropriately
- [ ] Sign in button scales appropriately
- [ ] Transitions are smooth (300ms)
- [ ] No layout shift or jank
- [ ] Works on mobile devices
- [ ] Works on desktop browsers
- [ ] Keyboard navigation works
- [ ] Content doesn't hide under navigation

---

## Known Limitations

### 1. Fixed Height
Navigation uses fixed pixel heights (200px/80px) rather than viewport-relative units. This ensures consistency across devices but may not scale perfectly on very small or large screens.

**Solution**: Adjust heights in media queries if needed.

### 2. Scroll Direction Detection Delay
There's a slight delay in detecting scroll direction change due to the need to compare previous scroll position.

**Impact**: Minimal, typically imperceptible to users.

### 3. Hover on Mobile
Touch devices don't have true "hover" support. The scroll-up detection compensates for this.

**Impact**: Mobile users rely on scroll-up gesture instead of hover.

---

## Future Enhancements

### Potential Improvements

1. **Blur Effect**: Add backdrop blur when compact
   ```css
   backdrop-filter: blur(10px);
   ```

2. **Hide on Scroll Down**: Completely hide navigation when scrolling down
   ```typescript
   const shouldHide = isScrolled && !isHovered && !isScrollingUp;
   ```

3. **Customize Per Page**: Different heights for different routes
   ```typescript
   const navHeight = pathname === '/' ? 'h-[200px]' : 'h-[150px]';
   ```

4. **Preferences**: User setting to always keep expanded
   ```typescript
   const userPreference = localStorage.getItem('nav-preference');
   ```

5. **Animation Variants**: Different animation styles
   - Slide from top
   - Fade in/out
   - Scale effect

---

## Troubleshooting

### Issue: Navigation jumps/flickers
**Solution**: Ensure all transitions use the same duration (300ms)

### Issue: Content hidden under navigation
**Solution**: Check `main { padding-top: 200px }` in globals.css

### Issue: Hover doesn't work on mobile
**Solution**: This is expected. Mobile users should scroll up to expand.

### Issue: Scroll detection not working
**Solution**: Check that scroll event listener is properly attached in useEffect

### Issue: Performance problems
**Solution**: Verify `requestAnimationFrame` is being used and passive listeners are enabled

---

## Code References

### Main Component
- `src/components/Navigation.tsx` - Navigation component with scroll logic

### Styles
- `src/app/globals.css` - Main content padding adjustments

### Lines of Interest
- Navigation.tsx:16-19 - State declarations
- Navigation.tsx:33-58 - Scroll detection logic
- Navigation.tsx:71-72 - Expansion logic
- Navigation.tsx:75-79 - Nav element with transitions
- globals.css:297-302 - Main content padding

---

## Summary

The dynamic navigation provides:
- ✅ Immersive full-height experience at page top
- ✅ Compact mode for maximum content space
- ✅ Smooth transitions (300ms)
- ✅ Hover expansion for easy access
- ✅ Scroll-up expansion for mobile users
- ✅ Performance optimized with RAF
- ✅ Accessible keyboard navigation
- ✅ Cross-browser compatible

**Result**: Professional, modern navigation that adapts to user behavior and device context.
