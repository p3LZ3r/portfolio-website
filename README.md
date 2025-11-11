# Portfolio Website

A single-page portfolio for Torsten Linnecke, built with Lit, Vite and the Tailwind CSS v4 tooling. The site ships with an accessible hash-based router, reusable components, and polished glassmorphism styling that can be deployed statically.

## Tech stack

- [Lit](https://lit.dev/) custom elements written in TypeScript
- [Vite](https://vite.dev/) (Rolldown edition) for bundling and dev server
- Tailwind CSS v4 via the `@tailwindcss/vite` plugin and CSS-first utilities
- Mailto workflow for contact requests with form validation
- Cal.com embed for scheduling calls

## Getting started

```bash
npm install
npm run dev    # start local dev server on http://localhost:5173
npm run build  # type-check and create a production build in dist/
npm run preview
```

## Project layout

```
src/
 ├─ components/      # Reusable Lit components (call button, inputs, project card)
 ├─ pages/           # Route-level views (about, projects, contact)
 ├─ styles/          # Tailwind entry point and Shadow DOM helper
 └─ main.ts          # <portfolio-app> root element and router
assets/              # Images, logos and custom fonts
public/              # Static assets copied as-is
```

## Configuration & content

- **Call-to-action** – `src/components/CallButton.ts` exposes `href`, `label` and `new-tab` attributes. Update the default URL if the Cal.com slug changes.
- **Contact email** – `src/pages/ContactPage.ts` sends validated submissions to `contact@torsten-linnecke.de` via a `mailto:` link. Replace `contactEmail` if another inbox should receive leads.
- **Projects** – Adjust the placeholder portfolio entries inside `src/pages/ProjectsPage.ts` to match real client work.
- **Brand assets** – Fonts and logos live in `assets/`; swap files while keeping names to avoid code changes.

## Accessibility & quality

- Skip navigation support is enabled (`Tab` from the top of the page).
- Form inputs provide inline validation messages and announce status updates via `aria-live`.
- Hash routes fall back to the About section when an unknown fragment is supplied.
- Custom scrollbar styling works across Chromium, Firefox and Safari without relying on external plugins.

## Deployment

The site is fully static. Run `npm run build` and deploy the generated `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).
