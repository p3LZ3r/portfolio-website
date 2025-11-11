# Spec Delta: Add Cal.com popup embed (scheduling)
Change-id: add-cal-popup-embed
Capability: scheduling

## ADDED Requirements

### Requirement: Cal.com modal embed trigger
The system SHALL allow opening a Cal.com booking modal when a visitor activates a designated element (button, link, or CTA).

Acceptance criteria:
- A declarative integration using `data-cal-link` on an element is supported and opens the modal.
- A programmatic integration via `Cal.modal({ calLink, config })` is supported.
- Primary CTA integration point is the existing call button at [`src/components/CallButton.ts`](src/components/CallButton.ts:1).

#### Scenario: Declarative CTA opens Cal.com modal
- GIVEN the page includes the Cal.com embed script (referenced in [`index.html`](index.html:1))
- AND a button exists with `data-cal-link="organization/event-type"`
- WHEN the user clicks the button
- THEN the Cal.com modal opens and displays available slots for the configured event type
- AND focus moves into the modal and keyboard navigation works

#### Scenario: Programmatic fallback opens Cal.com modal
- GIVEN the Cal SDK is initialized in a namespace
- WHEN the button click handler calls `Cal.modal({ calLink, config })` or uses the wrapper `openCalModal(calLink, opts)`
- THEN the modal opens with the same behavior as the declarative approach

### Requirement: Prerendering and preload
The system SHALL support prerendering or preloading of Cal.com booking pages for prioritized CTAs to improve perceived performance.

Acceptance criteria:
- Developers can call `Cal('prerender', { calLink, type: 'modal' })` or use namespaced `Cal.ns.<namespace>('prerender', ...)`.
- Prerendering may be triggered on page load for opted-in CTAs or deferred to first hover/pointerenter.

#### Scenario: Prerender used for primary CTA
- GIVEN a primary CTA is marked for prerender
- WHEN the prerender logic runs (on load or on hover)
- THEN a hidden iframe is prepared so that opening the modal is faster

### Requirement: Prefill and query parameter forwarding
The system SHALL support passing known visitor data (name, email) into the Cal.com modal only when consent or existing data is available.

Acceptance criteria:
- Prefill is applied via `Cal.inline` config or query params in `data-cal-link`.
- `Cal.config.forwardQueryParams = true` may be enabled when safe.

#### Scenario: Prefill from contact page
- GIVEN the contact page has user-supplied name and email fields
- WHEN the CTA is clicked
- THEN the Cal.com modal opens with name and email prefilled

### Requirement: Accessibility and reduced motion
The system SHALL ensure the modal is accessible and respect user preferences for reduced motion.

Acceptance criteria:
- Focus management enters modal and returns to trigger element on close.
- The integration respects `prefers-reduced-motion` and avoids non-essential animations.

#### Scenario: Keyboard and reduced motion
- GIVEN a keyboard-only user activates the CTA
- WHEN the modal opens
- THEN keyboard navigation works and animations are reduced per user settings

### Requirement: Privacy and load strategy
The system SHALL document privacy implications and prefer deferred loading unless opted-in.

Acceptance criteria:
- The embed script is added with defer or loaded on interaction.
- Prefill forwarding is opt-in and documented in README.

#### Scenario: Deferred script loading
- GIVEN hosted Cal.com is used and project has privacy concerns
- WHEN the page loads
- THEN the Cal.com script is not requested until the user hovers or clicks the CTA (or until the site opts into eager loading)

## Notes
- Implementation details and tasks are described in [`openspec/changes/add-cal-popup-embed/tasks.md`](openspec/changes/add-cal-popup-embed/tasks.md:1) and [`openspec/changes/add-cal-popup-embed/design.md`](openspec/changes/add-cal-popup-embed/design.md:1).