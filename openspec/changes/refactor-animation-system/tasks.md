# Implementation Tasks: Refactor Animation System to View Transitions

## 1. Core Infrastructure
- [ ] 1.1 Add feature detection utility for View Transitions API
  - Create `src/utils/viewTransitionSupport.ts` with `isViewTransitionSupported()` function
  - Check for `document.startViewTransition` existence
  - Include reduced motion preference check

- [ ] 1.2 Create view transition manager utility
  - Create `src/utils/viewTransitionManager.ts`
  - Implement `startPageTransition(callback: () => void)` function
  - Add pause/resume hooks for viewportAnimator integration
  - Handle errors and fallback gracefully

## 2. Update Main Application Router
- [ ] 2.1 Modify route change handling in `src/main.ts`
  - Import view transition manager
  - Wrap route updates with `startPageTransition()` when supported
  - Maintain current hash-based routing logic
  - Add error handling for transition failures

- [ ] 2.2 Add transition target detection
  - Scan for elements with `data-view-transition` attribute
  - Apply `view-transition-name` CSS property dynamically
  - Handle Shadow DOM elements via host or light DOM wrappers

## 3. Refactor Viewport Animation System
- [ ] 3.1 Add pause/resume API to `src/utils/viewportAnimator.ts`
  - Add `pause()` method to prevent new animations
  - Add `resume()` method to restore normal behavior
  - Add `isPaused` state tracking
  - Queue animations that occur during pause for later execution

- [ ] 3.2 Integrate with view transition manager
  - Call `pause()` when page transition starts
  - Call `resume()` when transition ends
  - Handle transition cancellation scenarios

- [ ] 3.3 Update initialization options
  - Add `pauseOnViewTransition?: boolean` option
  - Document new API surface
  - Maintain backward compatibility

## 4. Update CSS for View Transitions
- [ ] 4.1 Add view transition CSS rules to `src/styles/animations.css`
  - Add `::view-transition-old()` and `::view-transition-new()` pseudo-elements
  - Define transition durations and easing for page transitions
  - Add `view-transition-name` property mappings

- [ ] 4.2 Create fallback styles for unsupported browsers
  - Keep existing `intersection-*` classes as fallback
  - Add `@supports not (view-transition-name: *)` queries
  - Ensure graceful degradation

- [ ] 4.3 Add reduced motion overrides
  - Disable view transitions when `prefers-reduced-motion: reduce`
  - Maintain instant content visibility
  - Preserve accessibility compliance

## 5. Update Page Components
- [ ] 5.1 Add opt-in attributes to page roots
  - Update `src/pages/AboutPage.ts` with `data-view-transition="page-main"`
  - Update `src/pages/ProjectsPage.ts` with `data-view-transition="page-main"`
  - Update `src/pages/ContactPage.ts` with `data-view-transition="page-main"`

- [ ] 5.2 Handle Shadow DOM compatibility
  - Ensure transition targets are in light DOM or exposed via ::part
  - Add host-level attributes where needed
  - Test with Lit's rendering lifecycle

## 6. Component Integration
- [ ] 6.1 Update `src/components/ProjectCard.ts` for view transitions
  - Add optional `data-view-transition` support
  - Ensure card content can participate in transitions
  - Maintain existing micro-animations

- [ ] 6.2 Update other components as needed
  - Review `src/components/CallButton.ts` and `src/components/FormInput.ts`
  - Add transition support where beneficial
  - Preserve existing functionality

## 7. Testing and Verification
- [ ] 7.1 Create manual testing checklist
  - Test route transitions in Chrome/Edge (with View Transitions)
  - Test fallback behavior in Firefox/Safari
  - Verify reduced motion compliance
  - Check Shadow DOM component participation

- [ ] 7.2 Add automated tests where feasible
  - Unit tests for feature detection utilities
  - Integration tests for pause/resume API
  - Component rendering tests with transition attributes

- [ ] 7.3 Performance verification
  - Measure transition smoothness and duration
  - Check for layout thrashing during transitions
  - Verify memory usage with repeated transitions

## 8. Documentation and Migration
- [ ] 8.1 Update README.md with view transition documentation
  - Add View Transitions section to existing animation docs
  - Include migration guide for component authors
  - Provide code examples for common use cases

- [ ] 8.2 Update OpenSpec documentation
  - Finalize `openspec/changes/refactor-animation-system/design.md`
  - Ensure all requirements are traceable to implementation
  - Add architectural decision records

## 9. Final Verification
- [ ] 9.1 Cross-browser testing
  - Test in Chrome (latest) with View Transitions
  - Test in Edge (latest) with View Transitions
  - Test in Firefox (latest) with fallback
  - Test in Safari (latest) with fallback

- [ ] 9.2 Accessibility testing
  - Verify screen reader compatibility
  - Test keyboard navigation during transitions
  - Confirm reduced motion preferences are respected

- [ ] 9.3 Integration testing
  - Test all route combinations (about ↔ projects ↔ contact)
  - Verify component state preservation during transitions
  - Check error handling and recovery

## 10. Cleanup and Optimization
- [ ] 10.1 Remove unused code
  - Clean up any redundant animation logic
  - Remove deprecated CSS classes if applicable
  - Optimize bundle size impact

- [ ] 10.2 Final code review
  - Ensure TypeScript types are correct
  - Verify Biome linting compliance
  - Check for potential memory leaks

## Verification Steps
After completing each task group:
1. Run `npm run dev` and verify no console errors
2. Test basic functionality (navigation, animations)
3. Check that existing features still work
4. Verify new features work as expected
5. Test in multiple browsers when possible

## Success Criteria
- Route transitions work smoothly in Chrome/Edge using View Transitions API
- Fallback behavior works correctly in Firefox/Safari
- Existing scroll-triggered animations continue to work
- Reduced motion preferences are respected
- Component authors can easily opt-in to view transitions
- No performance regressions
- All accessibility requirements are met