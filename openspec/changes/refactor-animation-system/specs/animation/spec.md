## ADDED Requirements

### Requirement: Page-level transitions using the View Transitions API
The application SHALL leverage the browser View Transitions API (document.startViewTransition) to provide layout-aware page/route transitions for route changes when the browser supports it and when the user does not prefer reduced motion.

#### Scenario: Smooth route transition (Chromium)
- **WHEN** the user navigates between routes (hash change) and the browser exposes `document.startViewTransition` and `prefers-reduced-motion: no`
- **THEN** the app SHALL call `document.startViewTransition(() => { /* perform route update */ })` around the route state update
- **AND** elements or components opt-in with `data-view-transition="<name>"` (default `page-main`) SHALL be assigned `view-transition-name: <name>` so the browser may map same-named elements between old and new views
- **AND** the transition SHALL aim for a default duration target of 300ms (perceptual target)

#### Scenario: Feature-detection fallback (non-supporting browsers)
- **WHEN** `document.startViewTransition` is not available or the user has `prefers-reduced-motion: reduce`
- **THEN** the application SHALL fall back to the existing IntersectionObserver + CSS class–driven animations without runtime errors or blocking behavior

### Requirement: Opt-in attribute and default name
The primary opt-in mechanism SHALL be the DOM attribute `data-view-transition="<name>"`. If no name is provided, the runtime SHALL use the default transition name `page-main`.

#### Scenario: Default name applied
- **WHEN** a page root is rendered with `data-view-transition` (no value) or `data-view-transition="page-main"`
- **THEN** the runtime SHALL treat the element's view-transition-name as `page-main`

### Requirement: Opt-in transition targets for Lit/web components
Components and page root containers SHALL be able to opt into participating in view transitions via the `data-view-transition` attribute or programmatic API.

#### Scenario: Lit component exposes target via attribute
- **WHEN** a Lit page component contains a root element with `data-view-transition="page-main"`
- **THEN** during a view transition the runtime SHALL ensure that this element has `view-transition-name: page-main` applied in a way compatible with Shadow DOM constraints (via light DOM wrapper, host attribute, or ::part)

### Requirement: Separation of concerns — viewportAnimator is micro-animation only and auto-pauses
The existing viewport animation system SHALL be refactored to focus exclusively on scroll/viewport-triggered micro animations (entrance, stagger, draw) and SHALL auto-pause during page-level transitions when initialized with `pauseOnViewTransition: true`. The runtime default SHALL enable `pauseOnViewTransition`.

#### Scenario: Auto-pause during page transition
- **WHEN** a page-level view transition is active
- **THEN** viewportAnimator SHALL automatically pause (stop adding `va-in-view` classes and inline animation updates) if initialized with `pauseOnViewTransition: true`
- **AND** AFTER the transition completes, viewportAnimator SHALL resume and trigger animations for elements that became visible while paused, unless they are explicitly marked `data-animate-once="true"`

### Requirement: Shadow DOM compatibility strategy
The system SHALL provide documented approaches for Lit and other web components to participate in view transitions:
- Prefer light-DOM wrapper elements for page-level targets
- Provide guidance about using ::part selectors and exposing a stable part name (e.g., part="view-transition-target")
- Provide a small helper utility to set view-transition-name on an element returned from a component when needed

#### Scenario: Component with shadow DOM uses ::part
- **WHEN** a component author exposes an element with `part="view-transition-target"`
- **THEN** the design SHALL document how to apply `view-transition-name` to the exposed part via the host or a light DOM wrapper so the browser can use it during transitions

### Requirement: Accessibility and reduced motion
The system SHALL respect the user's `prefers-reduced-motion` preference:
- If user prefers reduced motion, view transitions SHALL NOT be initiated
- CSS fallbacks SHALL present content instantly (no transforms) when reduced motion is requested

#### Scenario: Reduced motion enabled
- **WHEN** `prefers-reduced-motion: reduce` is active in the UA
- **THEN** the application SHALL not call `document.startViewTransition` or shall call it only with no visual animation (immediate state change)
- **AND** viewportAnimator SHALL disable transitions and make elements visible without animated transforms

### Requirement: Maintain existing micro-animation behaviors
For browsers that do not support view transitions, or for intra-page micro-interactions (stagger, draw), the system SHALL retain and maintain the existing CSS + IntersectionObserver behavior as a fallback.

#### Scenario: Staggered list on page
- **WHEN** the user scrolls a staggered list into view or content is dynamically inserted
- **THEN** the viewportAnimator SHALL trigger `va-in-view` classes for children with staggered delays as currently implemented, unless paused due to a page-level transition

### Requirement: Testing and documentation
The change SHALL include:
- Manual testing checklist for route transitions and fallbacks (Chrome, Edge, Firefox, Safari)
- Unit/integration tests for feature detection and pause/resume APIs
- Migration guidance and examples for component authors

#### Scenario: Manual cross-browser verification
- **WHEN** a developer follows the testing checklist
- **THEN** they SHALL be able to verify view transitions on Chromium and fallback behaviors on other browsers, and confirm reduced-motion compliance

## MODIFIED Requirements

### Requirement: Init entrypoints and API surface
- The exported API `initViewportAnimations(root, options)` SHALL remain but SHALL include optional hooks `pauseOnViewTransition?: boolean` (default true) and SHALL document how to call `pause()`/`resume()` programmatically or via the runtime when a page-level transition starts.

#### Scenario: init with pause behavior
- **WHEN** the app calls `initViewportAnimations(document, { pauseOnViewTransition: true })`
- **THEN** the system SHALL automatically pause viewport micro-animations during any detected page-level view transition when requested by the runtime

### Requirement: CSS updates to include view transition fallbacks
- The `src/styles/animations.css` file SHALL be extended with `view-transition-name` rules and `view-transition-*` property fallbacks while preserving existing `intersection-*` class styles for non-supporting browsers.

#### Scenario: CSS fallback behavior
- **WHEN** the UA supports view transitions
- **THEN** components with `data-view-transition` SHALL be visually transitioned by the browser based on `view-transition-name` mapping and the runtime default 300ms target
- **WHEN** the UA does not support view transitions
- **THEN** the `intersection-*` classes and `va-in-view` toggles SHALL remain the visual mechanism

## Notes
- Implementation SHALL be backward compatible by default; components must explicitly opt-in to participate in page transitions.
- The change is scoped to front-end runtime and docs; no server-side changes are required though SSR-safe guard clauses MUST remain.
- Key implementation files to modify include: [`src/main.ts:1`](src/main.ts:1), [`src/utils/viewportAnimator.ts:1`](src/utils/viewportAnimator.ts:1), [`src/styles/animations.css:1`](src/styles/animations.css:1).

## Acceptance criteria (summary)
- Route transitions work smoothly in Chrome/Edge using View Transitions API with `data-view-transition="page-main"` enabled and a target duration of ~300ms.
- Fallback behavior works correctly in Firefox/Safari.
- Reduced motion preference is respected.
- viewportAnimator automatically pauses and resumes during transitions when `pauseOnViewTransition` is enabled.