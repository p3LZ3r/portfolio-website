# Proposal: Add Cal.com popup embed triggered by element click

Change-id: add-cal-popup-embed
Status: Draft
Author: Kilo Code
Date: 2025-11-05

## Why
This project is a personal portfolio used to schedule calls with potential clients. Currently there is no lightweight, accessible, and performant way for visitors to book a time slot from any page via a small CTA. Embedding a Cal.com modal (popup) that opens when a user clicks a designated element (button, link, or CTA) will improve conversion and streamline scheduling while preserving site performance and privacy.

Cal.com provides a modal/embed JavaScript SDK that supports:
- Element-triggered modal embeds (button with `data-cal-link` or `Cal.modal(...)`)
- Prerendering and preloading to speed perceived load times
- Namespaced embeds to avoid collisions
- Prefill and query-param forwarding for better UX

References:
- Cal.com embed docs: `/calcom/cal.com` (Context7)
- Example: `Cal.modal({ calLink: "organization/event-type" })`

## What changes
Add an OpenSpec change that documents and implements a non-breaking integration that:
1. Adds the Cal.com embed script to the site HTML (`index.html`) in a privacy-conscious way (defer / load on interaction when appropriate).
2. Exposes one or more element-level triggers (primary target: existing `CallButton` component at [`src/components/CallButton.ts`](src/components/CallButton.ts:1)) to open the Cal.com modal on click using either:
   - Declarative approach: add `data-cal-link="organization/event-type"` to the button element (leverages default embed behavior), or
   - Programmatic approach: call `Cal.modal({ calLink, config })` from the component click handler.
3. Implement optional prerendering for likely CTAs using `Cal('prerender', { calLink, type: 'modal' })` to improve perceived speed for users likely to click.
4. Add a small wrapper utility in the frontend to:
   - Initialize Cal in a named namespace when needed (`Cal("init", namespace, { calOrigin })`) and store any config (e.g., forwardQueryParams).
   - Provide a safe method to open modal and supply prefill (name/email) when available.
5. Add OpenSpec docs (spec delta, tasks, design) under `openspec/changes/add-cal-popup-embed/`.
6. Include testing checklist and manual integration steps to validate behavior across browsers and accessibility settings (`prefers-reduced-motion`).

## Scope
In-scope:
- Add proposal, spec delta, tasks, and design doc.
- Add embed script reference to `index.html`.
- Minimal code changes to `CallButton` and related pages where explicit CTA exists (Contact page).
- Prefill support for name/email where the site already captures them (e.g., contact form).
- Prerendering optimizations for primary CTA(s).

Out-of-scope:
- Full-featured Cal.com integration (server-side booking management, webhooks, deep CRM sync).
- Building a custom booking UI — we rely on Cal.com modal.
- Major layout or visual redesigns.

## Impact (files & systems)
- [`index.html`](index.html:1) — add Cal.com embed script and optional initialization snippet
- [`src/components/CallButton.ts`](src/components/CallButton.ts:1) — add element-click trigger (declarative `data-cal-link` and programmatic fallback)
- [`src/pages/ContactPage.ts`](src/pages/ContactPage.ts:1) — optionally wire contact form data to prefill the Cal.com modal
- New open-spec files:
  - `openspec/changes/add-cal-popup-embed/proposal.md` (this file)
  - `openspec/changes/add-cal-popup-embed/tasks.md`
  - `openspec/changes/add-cal-popup-embed/design.md`
  - `openspec/changes/add-cal-popup-embed/specs/scheduling/spec.md`
- Tests / manual checks (not automated initially) documented in `tasks.md`.

Non-functional impact:
- Slight increase in remote resource usage (Cal.com embed script) and network requests when prerendered.
- Performance mitigations: lazy / interaction-based loading, prerender only for prioritized CTAs.

## Privacy & Security considerations
- Avoid loading the embed script automatically for all visitors unless the CTA is likely to be used. Prefer deferred or on-interaction loading.
- Document that Cal.com may be hosted (cal.com) or self-hosted. For hosted usage, update README with implications for visitor data and cookies.
- Ensure no sensitive site data is leaked to third-party embeds unless explicitly intended; prefill only name/email with user consent or when data is already user-provided on the page.
- Add configuration to enable/disable forwarding of query params: `Cal.config.forwardQueryParams = true` only when safe.

## Design decisions (summary)
- Use the declarative `data-cal-link` attribute for the simplest integration: it allows embedding buttons without deep coupling to runtime.
- Provide a small JS utility wrapper for programmatic control (init, open modal, prerender) to encapsulate Cal.com behavior and to centralize prerender decisions and analytics hooks.
- Use Cal namespaces where multiple embeds or prerenders might be used to avoid collisions (e.g., `"portfolioMain"`).

## Rollout plan
1. Add openspec change files and draft implementations in a feature branch.
2. Add embed script to `index.html` with a small `init-cal.js` wrapper that sets Cal.config and provides a global `openCalModal(calLink, opts)` helper.
3. Update `CallButton` to set `data-cal-link` and provide a programmatic fallback that uses `openCalModal`.
4. Add prerender call for primary CTA on page load if allowed (or on first hover/pointerenter) using `Cal('prerender', ...)`.
5. Add manual test checklist and run through browsers (Chrome, Edge, Safari/Firefox fallback).
6. Run `openspec validate add-cal-popup-embed --strict` and fix any formatting or delta issues.
7. Open PR and request review; include screenshots and test steps.

## Testing and acceptance criteria
- When clicking the decorated CTA, a Cal.com modal opens and displays available time slots for the configured event type.
- If prerender is enabled for the CTA, modal opens faster and uses the prerendered iframe.
- Prefill data (name, email) appears in the modal when available from the page.
- Accessibility: keyboard focus moves into the modal, interaction is possible without a mouse, aria-labels exist on CTA.
- Respect `prefers-reduced-motion` and do not force heavy animations.
- No sensitive user data is forwarded unintentionally.

## Next steps
- Create spec delta at `openspec/changes/add-cal-popup-embed/specs/scheduling/spec.md`
- Create `tasks.md` with the implementation checklist
- Create `design.md` with detailed code snippets (init, prerender, namespace usage, prefill examples)
- Implement minimal changes in a feature branch and open PR
