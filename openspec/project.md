# Project Context

## Purpose
This repository is a personal portfolio site that showcases web development, digital design, and process automation work. The site emphasizes performance, accessibility, and visual fidelity while serving as a living demo of modern frontend patterns (Lit web components, Vite, Tailwind). It also documents project examples that include SEO, WordPress, and WooCommerce integrations.

## Tech Stack
- TypeScript (~5.9)
- Lit (Web Components)
- Vite (dev server and bundler)
- Tailwind CSS v4
- Biome (linting/formatting)
- Ultracite (style tooling)
- Development tooling: npm scripts (dev, build, preview)

## Project Conventions

### Code Style
- Follow Biome rules as the canonical linter/formatter configuration (see [`biome.jsonc`](biome.jsonc:1)).
- TypeScript: prefer strict typing, use modern TS (~5.9) features and type aliases where appropriate.
- Formatting: use Biome for formatting.
- Naming:
  - Files: kebab-case for filesystem names (e.g., components, pages).
  - Components: PascalCase (e.g., ProjectCard).
  - Variables, functions: camelCase.
  - Types / interfaces: PascalCase with "Props" or "Data" suffix where relevant.
- No console statements in production code; use structured logging for debugging.

### Architecture Patterns
- Component-driven architecture using Lit web components located under [`src/components`](src/components:1).
- Single-page app scaffolded with Vite and a small router-less collection of pages under [`src/pages`](src/pages:1).
- Styling: hybrid approach — global design tokens and custom CSS live in `src/styles`, Tailwind utilities available via `src/styles/tailwind.css`.
- Design tokens (CSS variables) are preserved and mapped into Tailwind theme for runtime theming.
- Keep components small, focused, and renderable with SSR-friendly markup where possible.

### Testing Strategy
- Current repo has no test suite. Recommended additions:
  - Unit tests: Vitest (fast unit test runner for Vite) or Jest with jsdom for component logic.
  - Integration / E2E: Playwright for end-to-end flows and cross-browser checks.
  - Visual regression: Percy or Playwright snapshots (or Storybook + Chromatic) to catch styling regressions during Tailwind migration.
  - Accessibility: axe-core checks in CI for critical pages.
- Tests should run in CI with caching and fail on regressions.

### Git Workflow
- Branching:
  - Use feature/* branches for new work (e.g., feature/tailwind-migration).
  - Create pull requests into main for code review; protect main with required CI checks.
- Commits:
  - Follow Conventional Commits (feat:, fix:, chore:, refactor:, docs:, test:).
  - Keep commits small and focused; link to issue/PR when appropriate.
- Releases:
  - Use semantic versioning for published packages. For this portfolio site, tag major releases in git (optional).

## Domain Context
- This project is a personal portfolio website for showcasing consulting and development work in web development, digital design, SEO, WordPress/WooCommerce, and process automation.
- Content is primarily static pages with interactive components; SEO and performance are priorities.
- Visual fidelity is preserved during style changes.

## Important Constraints
- Accessibility: maintain semantic HTML, keyboard navigation, and ARIA where needed.
- Performance: keep bundle size small; Tailwind config should purge unused utilities.
- Fonts: load local fonts responsibly (see `src/assets/fonts`).
- No backend services expected; site is static and can be deployed to static hosting (Netlify, Vercel, GitHub Pages).

## External Dependencies
- Core runtime:
  - lit
  - tailwindcss@^4.1.16
  - @tailwindcss/forms, @tailwindcss/typography
- Build / dev:
  - vite (rolldown-vite override)
  - typescript (~5.9.3)
- Tooling:
  - @biomejs/biome (linting/formatting)
  - Ultracite (style linting/reporting)
- Optional integrations:
  - Visual tests (Percy, Chromatic) and CI (GitHub Actions)

Notes: Keep this file updated as the project evolves; use [`openspec/changes/`](openspec/changes/:1) for proposed changes that affect architecture or conventions.