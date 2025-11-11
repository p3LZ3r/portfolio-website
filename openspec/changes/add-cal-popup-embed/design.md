# Design: Cal.com popup embed integration

Change-id: add-cal-popup-embed
Owner: Kilo Code
Date: 2025-11-05

Purpose
- Provide a small, maintainable wrapper around the Cal.com embed SDK so CTAs (element clicks) open a booking modal quickly, safely, and accessibly.
- Optimize perceived performance via prerendering and deferred loading.
- Keep privacy choices explicit and documented.

Files introduced
- [`openspec/changes/add-cal-popup-embed/design.md`](openspec/changes/add-cal-popup-embed/design.md:1)
- New runtime helper: [`src/utils/cal.ts`](src/utils/cal.ts:1)
- Small index integration: modify [`index.html`](index.html:1)
- Component hook: update [`src/components/CallButton.ts`](src/components/CallButton.ts:1)
- Optional wiring: [`src/pages/ContactPage.ts`](src/pages/ContactPage.ts:1) for prefill

Design summary
1. Load strategy
   - Default: defer SDK load until user interaction (pointerenter or click) on designated CTA.
   - Optional: site config can opt-in to eager loading for prerendering of primary CTA(s).
   - Implementation: add a tiny inline loader in [`index.html`](index.html:1) that attaches pointerenter and click listeners to elements with `data-cal-link` and then injects the remote script.

2. Namespaced initialization
   - Use a namespace so multiple embeds/prerenders do not collide.
   - Expose a minimal wrapper API in [`src/utils/cal.ts`](src/utils/cal.ts:1):
     - [`initCal(namespace, options)`](src/utils/cal.ts:9)
     - [`openCalModal(calLink, opts)`](src/utils/cal.ts:14)
     - [`prerenderCal(calLink, opts)`](src/utils/cal.ts:22)
     - [`setForwardQueryParams(flag)`](src/utils/cal.ts:28)
   - The wrapper will ensure idempotent init and queue calls until the SDK is ready.

3. Prefill behavior
   - Only prefill name/email when the page has explicit user-provided values (e.g., Contact page form state) and user intent is clear (clicked CTA or explicit consent).
   - Example flow: [`src/pages/ContactPage.ts`](src/pages/ContactPage.ts:1) collects form state; when the `call-button` is clicked, the component reads `formData.name` and `formData.email` and passes them to the wrapper `openCalModal` as `config.prefill`.

4. Prerender strategy
   - Use `Cal('prerender', { calLink, type: 'modal' })` for primary CTAs when either:
     - Site is configured for eager prerendering, or
     - User performs a low-cost intent signal (pointerenter for >150ms).
   - Prerendering should be namespaced: `Cal.ns[namespace]('prerender', {...})`.
   - Provide toggles in wrapper to control prerender timing and thresholds.

5. Accessibility
   - CTA must be keyboard-focusable and have an `aria-label`. See [`src/components/CallButton.ts`](src/components/CallButton.ts:1).
   - After opening, focus must move into the Cal.com modal automatically; on close, focus should return to trigger.
   - Respect `prefers-reduced-motion`; if set, avoid forcing prerendered skeleton animations and ensure the modal respects user's reduced motion.

6. Privacy
   - The embed script will not be loaded until interaction unless explicitly enabled.
   - Document behavior in README and in `openspec/changes/add-cal-popup-embed/design.md` with guidance for hosted vs self-hosted Cal.com usage and cookie/consent implications.
   - Forward query params only when `setForwardQueryParams(true)` is invoked by site config.

Developer API (wrapper)
- File: [`src/utils/cal.ts`](src/utils/cal.ts:1)

Key exported functions (conceptual)
- [`initCal(namespace: string, opts?: { calOrigin?: string, forwardQueryParams?: boolean })`](src/utils/cal.ts:9)
- [`openCalModal(calLink: string, opts?: { config?: Record<string, any>, prefill?: { name?: string, email?: string } })`](src/utils/cal.ts:14)
- [`prerenderCal(calLink: string, opts?: { pageType?: string })`](src/utils/cal.ts:22)
- [`setForwardQueryParams(flag: boolean)`](src/utils/cal.ts:28)

Example wrapper behavior (pseudocode)
- The wrapper will:
  - Create a small promise-based ready-state (sdkReady).
  - If SDK not loaded, inject script and resolve sdkReady when global `Cal` is present.
  - Provide `openCalModal` which awaits sdkReady, ensures `init` was called for the namespace, and calls `Cal.modal({ calLink, config })` or `Cal.ns[namespace]('modal', { calLink, config })`.

Integration examples

1) index.html loader snippet
- Update [`index.html`](index.html:1) to include a deferred loader script. Example idea:

```html
<!-- loader placed near end of body -->
<script>
  // Lightweight loader: injects Cal embed only on intent
  (function() {
    const SDK_SRC = "https://cdn.cal.com/embed/cal.min.js";
    let loaded = false;
    function loadSDK() {
      if (loaded) return;
      loaded = true;
      const s = document.createElement("script");
      s.src = SDK_SRC;
      s.defer = true;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    }
    // Attach event handlers to any element that has data-cal-link
    document.addEventListener("pointerenter", function onPointer(e){
      const el = e.target.closest && e.target.closest('[data-cal-link]');
      if (el) {
        // small delay to avoid accidental hover; load immediately if sustained
        loadSDK();
      }
    }, { capture: true, passive: true });
    document.addEventListener("click", function onClick(e){
      const el = e.target.closest && e.target.closest('[data-cal-link]');
      if (el) {
        loadSDK();
      }
    }, { capture: true });
  })();
</script>
```

2) Component usage
- The existing [`src/components/CallButton.ts`](src/components/CallButton.ts:1) already contains `data-cal-link` and `data-cal-namespace` attributes. The design recommends:
  - Keep the `data-cal-link` attribute for declarative behavior (Cal SDK will pick it up automatically when loaded).
  - Add a programmatic fallback in the component to call [`openCalModal()`](src/utils/cal.ts:14) when the SDK hasn't attached declarative listeners yet.

3) Prefill from Contact page
- In [`src/pages/ContactPage.ts`](src/pages/ContactPage.ts:1), when wiring the CTA click:
  - Collect `this.formData.name` and `this.formData.email`.
  - Call `openCalModal("tlinnecke/45min", { prefill: { name, email } })`.

Testing checklist (developer)
- Manual test across Chrome, Edge, Firefox, and Safari:
  - CTA with `data-cal-link` opens modal on click.
  - Programmatic `openCalModal` opens modal when invoked.
  - Prerendered iframe reduces time-to-interaction when prerender is used.
  - Prefill values appear when provided.
  - Keyboard-only navigation opens modal and focus is trapped inside as expected; on close, focus returns to trigger.
  - `prefers-reduced-motion` reduces animations; test with OS setting.
  - Confirm embed script is not requested until pointerenter or click, when deferred-loading is configured.

Analytics and instrumentation
- The wrapper will emit custom DOM events for analytics:
  - `cal:open` (detail: { calLink, namespace, method })
  - `cal:prerender` (detail: { calLink, namespace })
  - `cal:prefill` (detail: { namePresent, emailPresent })
- These events let opt-in analytics systems capture funnel progress without coupling to a specific analytics provider.

Open questions for reviewers
- Default prerender policy: eager for primary CTA vs hover-based?
- Hosted cal.com vs self-hosted calOrigin recommendation for privacy-sensitive contexts.
- Whether we should centralize event debounce thresholds (pointerenter delay) in a site config.

Next steps
- Implement wrapper at [`src/utils/cal.ts`](src/utils/cal.ts:1) and update [`src/components/CallButton.ts`](src/components/CallButton.ts:1) with a programmatic fallback.
- Add README section outlining privacy tradeoffs and how to self-host.
- Run `openspec validate add-cal-popup-embed --strict` and open a PR.
