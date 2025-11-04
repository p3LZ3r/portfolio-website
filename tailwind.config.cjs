/**
 * Canonical Tailwind CSS v4 Configuration
 *
 * This configuration maps the project's existing design tokens from the style audit
 * to Tailwind's theme system, enabling JIT/content mode with proper dark mode support.
 *
 * Design Token Mappings (from STYLE_AUDIT_REPORT.md):
 *
 * Colors:
 *   --color-text-primary: #f5f5f5 -> theme.colors.text.primary
 *   --color-text-secondary: #1e1e1e -> theme.colors.text.secondary
 *   --color-text-muted: #b3b3b3 -> theme.colors.muted
 *   --color-bg-primary: #2c2c2c -> theme.colors.primary
 *   --color-bg-secondary: rgba(255, 255, 255, 0.25) -> theme.colors.bgSecondary
 *   --color-accent: #2c2c2c -> theme.colors.accent
 *   --color-accent-hover: rgba(140, 140, 140, 0.25) -> theme.colors.accentHover
 *
 * Typography:
 *   --font-family-primary: "heading", serif -> theme.fontFamily.heading
 *   --font-family-secondary: "body", sans-serif -> theme.fontFamily.body
 *
 * Spacing:
 *   --spacing-xs: 8px -> theme.spacing.xs (0.5rem)
 *   --spacing-sm: 16px -> theme.spacing.sm (1rem)
 *   --spacing-md: 24px -> theme.spacing.md (1.5rem)
 *   --spacing-lg: 32px -> theme.spacing.lg (2rem)
 *   --spacing-xl: 48px -> theme.spacing.xl (3rem)
 *
 * Border Radius:
 *   --border-radius-sm: 16px -> theme.borderRadius.md (1rem)
 *   --border-radius-lg: 24px -> theme.borderRadius.lg (1.5rem)
 *   --border-radius-full: 100px -> theme.borderRadius.full
 *
 * Shadows:
 *   --shadow-primary -> theme.boxShadow.primary
 *   --shadow-inset -> theme.boxShadow.inset
 *
 * Transitions:
 *   --transition-fast: 0.2s -> theme.transitionDuration.fast
 *   --transition-normal: 0.3s -> theme.transitionDuration.normal
 *
 * Migration Reference: TAILWIND_MIGRATION_REPORT.md
 */

"use strict";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "index.html",
    "src/**/*.{ts,tsx,js,jsx,html}",
    "public/**/*.{html,js}",
    // Enable Shadow DOM content scanning
    // Include shadow DOM template content patterns
  ],
  // Enable Shadow DOM support
  experimental: {
    optimizeUniversalDefaults: true,
  },
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom project colors mapped to CSS variables
        text: {
          primary: "#f5f5f5", // var(--color-text-primary)
          secondary: "#1e1e1e", // var(--color-text-secondary)
        },
        muted: "#b3b3b3", // var(--color-text-muted)
        primary: "#2c2c2c", // var(--color-bg-primary)
        "bg-secondary": "rgba(255, 255, 255, 0.25)", // var(--color-bg-secondary)
        accent: "#2c2c2c", // var(--color-accent)
        "accent-hover": "rgba(140, 140, 140, 0.25)", // var(--color-accent-hover)
      },
      fontFamily: {
        heading: ["heading", "serif"],
        body: ["body", "system-ui", "sans-serif"],
      },
      spacing: {
        xs: "0.5rem", // 8px
        sm: "1rem", // 16px
        md: "1.5rem", // 24px
        lg: "2rem", // 32px
        xl: "3rem", // 48px
      },
      borderRadius: {
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        full: "100px",
      },
      boxShadow: {
        primary:
          "0px 1px 8px 0px rgba(0, 0, 0, 0.1), 0px 0px 2px 0px rgba(0, 0, 0, 0.1)",
        inset:
          "inset 0px 0px 8px 0px rgba(242, 242, 242, 1), inset 0px 0px 0px 1px rgba(166, 166, 166, 1), inset -2px -2px 0.5px -2px rgba(38, 38, 38, 1), inset 2px 2px 0.5px -2px rgba(38, 38, 38, 1), inset 3px 3px 0.5px -3.5px rgba(255, 255, 255, 1)",
      },
      transitionDuration: {
        fast: "0.2s",
        normal: "0.3s",
      },
      transitionTimingFunction: {
        ease: "ease",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    ({ addUtilities }) => {
      const newUtilities = {
        ".border-squircle": {
          "corner-shape": "squircle",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
