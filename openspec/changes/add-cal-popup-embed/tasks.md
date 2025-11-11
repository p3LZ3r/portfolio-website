# Tasks: Implement Cal.com popup embed
Change-id: add-cal-popup-embed
Owner: Kilo Code
Date: 2025-11-05

## Implementation checklist
- [ ] Add Cal.com embed script to [`index.html`](index.html:1) using deferred or interaction-based loading and document the choice in README.
- [ ] Create a small frontend wrapper at [`src/utils/cal.ts`](src/utils/cal.ts:1) that:
    - initializes Cal in a namespace (see [`javascript.declaration()`](src/utils/cal.ts:9))
    - exposes openCalModal(calLink, opts) (see [`javascript.declaration()`](src/utils/cal.ts:10))
    - exposes prerender(calLink, opts) and setForwardQueryParams(flag) (see [`javascript.declaration()`](src/utils/cal.ts:11))
- [ ] Update [`src/components/CallButton.ts`](src/components/CallButton.ts:1) to:
    - support declarative [`html.attribute()`](src/components/CallButton.ts:13) on the button
    - call [`javascript.declaration()`](src/components/CallButton.ts:14) programmatically as a fallback if SDK not loaded
    - ensure aria-label and keyboard handlers are present (see [`javascript.declaration()`](src/components/CallButton.ts:15))
- [ ] Wire contact page at [`src/pages/ContactPage.ts`](src/pages/ContactPage.ts:1) to pass prefill data (name/email) to [`javascript.declaration()`](src/pages/ContactPage.ts:16) when available and consented
- [ ] Implement prerender strategy:
    - [ ] Add prerender call for primary CTA on pointerenter/hover in [`src/utils/cal.ts`](src/utils/cal.ts:1)
    - [ ] Optionally trigger prerender on page load for opted-in CTAs (controlled by config)
- [ ] Add config and privacy docs:
    - [ ] Add README section describing hosted vs self-hosted Cal.com, privacy implications, and opt-in settings
    - [ ] Document environment variables or calOrigin config in [`openspec/changes/add-cal-popup-embed/design.md`](openspec/changes/add-cal-popup-embed/design.md:1)
- [ ] Add tests and manual verification checklist (modal opens, prerender used, prefill, reduced motion)
- [ ] Run `openspec validate add-cal-popup-embed --strict` and correct any spec formatting issues
- [ ] Open PR with changes and include screenshots and test steps

## Notes
- Prefer lazy loading the embed script: load on pointerenter/click unless site opts into eager loading.
- Use Cal namespace [`javascript.declaration()`](openspec/changes/add-cal-popup-embed/design.md:29) by default to avoid collisions.
- Keep wrapper small and free of analytics; expose hooks for analytics events.