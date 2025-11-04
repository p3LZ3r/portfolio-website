# Analysis: Defects and Integration Points for Animation Refactor

Summary:
This document summarises the problems found and the places to integrate the new View Transitions API.

Key defects observed
1. View Transitions not used
- The codebase relies on IntersectionObserver and CSS class toggles in [`src/utils/viewportAnimator.ts:1`](src/utils/viewportAnimator.ts:1) and never uses the new Page/View Transitions API.

2. Router-level transitions missing
- Routing is hash-based in [`src/main.ts:21`](src/main.ts:21) and updates currentRoute without coordinating a document-level view transition. No call to document.startViewTransition() exists.

3. Shadow DOM and Lit integration gaps
- Components are Lit elements with shadow DOM (`shadowDomStyles`), which prevents view-transition-name inherited from document. Need to expose transitionable elements by setting [view-transition-name] on light DOM or using ::part / adoptive strategies.

4. CSS lacks view-transition fallback styles
- [`src/styles/animations.css:1`](src/styles/animations.css:1) contains only classic transitions (opacity/transform). There are no rules using view-transition-name or view-transition-* properties for seamless transitions.

5. Duplicate responsibilities and naming collisions
- viewportAnimator currently applies classes like intersection-*, va-in-view and directly manipulates inline styles. This can conflict with View Transitions which animate computed layout; need clear separation between page-level transitions and scroll entrance animations.

6. Accessibility & reduced-motion handling
- Reduced motion is respected via media queries, but if using startViewTransition we must ensure reduced-motion bypass and provide non-animated fallback.

7. Stagger and SVG draw approaches incompatible with view transitions
- Stagger timing and SVG stroke-dashoffset animations are per-element timeline animations; view transitions are best for cross-page layout transitions. Keep those in the viewportAnimator as fallback or for intra-page micro-animations.

Integration points (where to change)
- Routing: [`src/main.ts:21`](src/main.ts:21) — call document.startViewTransition around route switch and render swap.
- Pages/components: [`src/pages/*.ts`](src/pages/AboutPage.ts:1) — add opt-in data attributes (data-view-transition="name") or programmatic API
- Viewport animator: [`src/utils/viewportAnimator.ts:1`](src/utils/viewportAnimator.ts:1) — refactor to avoid interfering with view-transition styles; provide API to pause/disable during a page transition
- Styles: [`src/styles/animations.css:1`](src/styles/animations.css:1) — add view-transition-name rules, view-transition-property fallbacks, and preserve existing class-based transitions for unsupported browsers
- Shadow DOM styles: [`src/styles/shadow-dom.css.ts:1`](src/styles/shadow-dom.css.ts:1) — ensure host-level attributes or part names are used to participate in view transitions

Recommended next steps (short)
1) Create OpenSpec proposal `openspec/changes/refactor-animation-system/proposal.md` describing goals and breaking changes.
2) Add design.md describing View Transitions usage, Shadow DOM strategies, and fallback plan.
3) Implement a minimal prototype in [`src/main.ts:1`](src/main.ts:1) that wraps the route change with document.startViewTransition and sets view-transition-name on the outgoing and incoming root containers.
4) Update CSS to support view-transition-name and keep intersection-based entrance animations as micro-animations.
5) Add opt-in attribute `data-view-transition` for components/pages; ensure Lit components expose transition targets via light DOM or ::part.

Notes and constraints
- View Transitions API is currently supported in Chromium-based browsers (Chrome, Edge). Firefox and Safari require graceful fallback; keep the IntersectionObserver system as the fallback for entrance animations.
- Keep accessibility: honor prefers-reduced-motion and make transitions non-blocking.
- Keep bundle size small: do not add heavy runtime dependencies.

Next action
Write the formal proposal and spec delta files and a design doc.