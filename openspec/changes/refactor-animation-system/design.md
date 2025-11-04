# Technical Design: View Transitions API Integration

## Context
This document outlines the technical approach for integrating the browser View Transitions API into the existing Lit-based portfolio application, while maintaining backward compatibility and accessibility.

## Goals / Non-Goals

### Goals
- Provide smooth, layout-aware page transitions using native View Transitions API
- Maintain existing scroll-triggered micro-animations for intra-page interactions
- Ensure graceful fallback for browsers without View Transitions support
- Respect user accessibility preferences (reduced motion)
- Provide simple opt-in mechanism for Lit components to participate in transitions
- Keep bundle size impact minimal

### Non-Goals
- Replace all existing animations with View Transitions (keep micro-animations)
- Implement complex custom transition sequences beyond what the API provides natively
- Add heavy runtime dependencies or polyfills
- Change the fundamental routing architecture (keep hash-based routing)

## Decisions

### 1. Feature Detection Strategy
**Decision**: Implement runtime feature detection with reduced motion check
```typescript
function isViewTransitionSupported(): boolean {
  return 'startViewTransition' in document && 
         !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

**Rationale**: 
- Avoids bundling polyfills unnecessarily
- Respects user accessibility preferences
- Provides clear fallback path

**Alternatives considered**:
- User agent detection (rejected: unreliable)
- Always call API with try/catch (rejected: less explicit)

### 2. View Transition Manager Architecture
**Decision**: Create a centralized manager utility that coordinates between routing, viewport animations, and component opt-ins

**Rationale**:
- Centralizes transition logic
- Provides clean API for other systems to hook into
- Handles edge cases and error recovery

**Alternatives considered**:
- Inline transition logic in main.ts (rejected: scattered concerns)
- Component-level transitions only (rejected: no coordination)

### 3. Shadow DOM Compatibility Strategy
**Decision**: Use light DOM wrapper elements with `data-view-transition` attributes as primary mechanism, with ::part as secondary option

**Rationale**:
- Light DOM elements work naturally with View Transitions API
- Maintains component encapsulation
- Provides fallback for components that can't expose light DOM

**Implementation**:
```typescript
// Primary: Light DOM wrapper
<div data-view-transition="page-main">
  <lit-component></lit-component>
</div>

// Secondary: ::part for components that can expose parts
<lit-component part="view-transition-target"></lit-component>
```

**Alternatives considered**:
- Host-level attributes only (rejected: limited flexibility)
- Require all components to expose light DOM (rejected: breaking change)

### 4. Pause/Resume Integration
**Decision**: Add pause/resume API to viewportAnimator to prevent conflicts during page transitions

**Rationale**:
- Prevents visual conflicts between page and micro-animations
- Maintains existing animation system for scroll interactions
- Simple to implement and test

**Alternatives considered**:
- Disable viewport animations entirely (rejected: loses functionality)
- Complex coordination system (rejected: over-engineering)

### 5. CSS Architecture
**Decision**: Layered CSS approach with View Transitions as enhancement

**Structure**:
```css
/* Base styles (always apply) */
.intersection-* { /* existing styles */ }

/* View Transition enhancement */
@supports (view-transition-name: *) {
  [data-view-transition] {
    view-transition-name: var(--view-transition-name, auto);
  }
  
  ::view-transition-old(*),
  ::view-transition-new(*) {
    /* Transition animation */
  }
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  /* Disable transitions */
}
```

**Rationale**:
- Progressive enhancement approach
- Clear separation of concerns
- Easy to maintain and debug

## Risks / Trade-offs

### Risk 1: Browser Support Fragmentation
**Risk**: View Transitions only supported in Chromium-based browsers
**Mitigation**: 
- Feature detection with graceful fallback
- Maintain existing CSS transitions as fallback
- Document supported browsers clearly

### Risk 2: Shadow DOM Complexity
**Risk**: Components with deep Shadow DOM may not participate cleanly
**Mitigation**:
- Provide multiple integration patterns (light DOM, ::part, host attributes)
- Clear documentation for component authors
- Helper utilities for common cases

### Risk 3: Performance Impact
**Risk**: Additional transition overhead on route changes
**Mitigation**:
- Use native browser optimizations
- Minimal JavaScript overhead
- Performance testing in implementation phase

### Risk 4: Accessibility Regression
**Risk**: New transitions could interfere with screen readers or cause motion sickness
**Mitigation**:
- Respect prefers-reduced-motion
- Test with screen readers
- Provide instant fallback option

## Migration Plan

### Phase 1: Infrastructure
1. Create feature detection utility
2. Implement view transition manager
3. Add pause/resume to viewportAnimator
4. Update CSS with view transition rules

### Phase 2: Integration
1. Update main.ts routing logic
2. Add opt-in attributes to page components
3. Test basic page transitions

### Phase 3: Component Support
1. Update components to support view transitions
2. Add helper utilities for common patterns
3. Document integration patterns

### Phase 4: Testing & Polish
1. Cross-browser testing
2. Accessibility verification
3. Performance optimization
4. Documentation updates

## Implementation Details

### View Transition Manager API
```typescript
interface ViewTransitionManager {
  startPageTransition(callback: () => void): Promise<void>;
  pauseAnimations(): void;
  resumeAnimations(): void;
  isTransitionActive(): boolean;
}
```

### Component Integration Patterns
```typescript
// Pattern 1: Light DOM wrapper
<div data-view-transition="page-main">
  <about-page></about-page>
</div>

// Pattern 2: Component with ::part
<about-page part="view-transition-target"></about-page>

// Pattern 3: Programmatic API
class AboutPage extends LitElement {
  static viewTransitionTarget = 'page-main';
}
```

### CSS Custom Properties
```css
:root {
  --view-transition-duration: 0.3s;
  --view-transition-easing: ease-out;
  --view-transition-name: auto;
}
```

## Open Questions

1. **Animation Duration**: Should page transitions use the same duration as micro-animations (600ms) or a shorter duration for better perceived performance?
2. **Transition Types**: Should we provide different transition types (slide, fade, zoom) or stick to a consistent default?
3. **Component Granularity**: At what level should components opt-in? Page-level only, or allow individual components to participate?
4. **Testing Strategy**: How much automated testing is feasible for browser-specific APIs?

## Performance Considerations

- Use `will-change` sparingly and only during active transitions
- Clean up event listeners and observers promptly
- Avoid layout thrashing during transition setup
- Test memory usage with repeated transitions
- Monitor main thread blocking during transitions

## Accessibility Considerations

- Honor `prefers-reduced-motion` at the feature detection level
- Ensure transitions don't interfere with screen reader navigation
- Provide skip mechanisms for users sensitive to motion
- Test with keyboard navigation during transitions
- Maintain focus management during route changes

## Browser Compatibility Matrix

| Browser | View Transitions | Fallback | Reduced Motion |
|---------|------------------|-----------|----------------|
| Chrome 111+ | ✅ Native | N/A | ✅ Respected |
| Edge 111+ | ✅ Native | N/A | ✅ Respected |
| Firefox | ❌ Not Supported | CSS Classes | ✅ Respected |
| Safari | ❌ Not Supported | CSS Classes | ✅ Respected |

## Success Metrics

- Page transitions complete within 300ms on supported browsers
- No visual glitches or layout shifts during transitions
- Fallback behavior is indistinguishable from current implementation
- Reduced motion preferences are consistently respected
- Bundle size increase is less than 2KB gzipped
- No performance regressions in existing animations