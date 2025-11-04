# Proposal: Refactor animation system to View Transitions

## Why
- The current animation system relies on IntersectionObserver and CSS class toggles and does not leverage the browser View Transitions API. Route changes do not produce page-level transitions and there are integration gaps with Lit/shadow DOM components. Using the native View Transitions API will provide smoother, layout-aware transitions for route changes and reduce custom animation complexity.

## What changes
- Add page-level transitions using the View Transitions API (`document.startViewTransition`) for route changes.
- Provide an opt-in attribute `data-view-transition="name"` and a small component API so components can expose transition targets.
- Refactor `src/utils/viewportAnimator.ts` to remain responsible for scroll-triggered micro-animations only and to avoid conflicting with page transitions.
- Update CSS to declare `view-transition-name` / `view-transition-*` rules while keeping existing `intersection-*` class fallbacks for unsupported browsers.
- Implement Shadow DOM strategies (host-level attribute, ::part, or light-DOM wrapper) so Lit components can participate in view transitions.
- Add graceful fallback: when View Transitions are unavailable or `prefers-reduced-motion` is enabled, fall back to current behavior.
- Add tests, documentation, and migration notes under `openspec/changes/refactor-animation-system/`.

## Breaking changes
- Components that should participate in page transitions must opt-in (e.g., add `data-view-transition`) or implement a small API; some CSS selectors may need updates.
- Runtime behavior for route changes will change for browsers with View Transitions support; feature detection must be used to prevent regressions.

## Impact (files & systems)
- [`src/main.ts:1`] — route change wrapper and bootstrapping
- [`src/utils/viewportAnimator.ts:1`] — refactor responsibilities and add pause/resume hooks
- [`src/styles/animations.css:1`] — add view-transition rules and fallbacks
- [`src/styles/shadow-dom.css.ts:1`] — expose host/part strategies
- [`src/pages/*.ts:1`] — add opt-in attributes or host wrappers (e.g., AboutPage, ProjectsPage, ContactPage)
- openspec changes under `openspec/changes/refactor-animation-system/` for proposal, specs, tasks, and design docs

## Design summary
- On route change, call `document.startViewTransition(() => { /* update route state */ })` when available.
- Before the transition, mark outgoing/incoming elements with `view-transition-name: "<name>"` (or `data-view-transition`) so the browser can map elements and animate between their layouts.
- For Lit components using Shadow DOM, expose a light-DOM wrapper element with the `data-view-transition` attribute or use ::part with `view-transition-name` to participate.
- Keep `viewportAnimator` running for scroll entrances; provide an API to temporarily pause animations during an ongoing view transition to avoid visual conflicts.

## Migration steps
1. Add `data-view-transition="page-main"` to page root containers in `src/pages/*`.
2. Update `src/main.ts` to wrap route updates with `startViewTransition`, guarded by feature detection and reduced-motion check.
3. Update `src/utils/viewportAnimator.ts` to implement a `pause()` / `resume()` API and skip adding `va-in-view` classes while paused.
4. Add view-transition CSS rules in `src/styles/animations.css` and keep existing `intersection-*` classes as fallback.
5. Update components that want to participate to expose transition targets (host attribute, light-DOM wrapper, or ::part).

## Accessibility & fallback
- Respect `prefers-reduced-motion` — do not initiate view transitions if the user prefers reduced motion.
- If `document.startViewTransition` is not available, fall back to the existing class-based transitions implemented by `viewportAnimator`.

## Acceptance criteria / Testing
- Route changes produce smooth transitions in Chromium-based browsers with mapped element transitions.
- Non-supporting browsers see the existing behavior with no regressions.
- Reduced motion setting disables animated transitions.
- Staggered micro-animations continue to work for intra-page behavior.
- Lit components can opt-in to participate in view transitions without breaking Shadow DOM encapsulation.

## Next steps
- Create `design.md`, `tasks.md`, and spec delta files under `openspec/changes/refactor-animation-system/`.
- Prototype a minimal `src/main.ts` integration that wraps route updates with `startViewTransition`.
- Update CSS and `viewportAnimator` as described and provide migration examples for components.

## References
- View Transitions API overview: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
- Code locations to review: [`src/main.ts:1`], [`src/utils/viewportAnimator.ts:1`], [`src/styles/animations.css:1`]