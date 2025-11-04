# Portfolio Website

A modern, responsive portfolio website built with LitElement and TypeScript.

## Viewport Animation System

This project includes a custom viewport animation system that provides smooth, performant animations when elements enter the viewport.

### Configuration

The animation system is initialized in `src/main.ts` with the following default options:

```typescript
const viewportAnimations = initViewportAnimations(this.shadowRoot || document, {
  rootMargin: "0px 0px -8% 0px",  // Elements start animating when 8% from the bottom
  threshold: [0, 0.08, 0.2, 0.5],   // Multiple thresholds for fine-tuned control
  defaultDuration: 600,               // Default animation duration in ms
  defaultStagger: 60,                 // Default stagger delay between children in ms
});
```

### Usage

#### Automatic Detection

Elements are automatically detected for animation based on:

1. **Class prefix**: Elements with classes starting with `intersection-`
2. **Data attributes**: Elements with `data-viewport-animate` or `data-animate`

#### Semantic Type Mappings

The system automatically applies appropriate animations based on element types:

- **Buttons and button-like elements** (`.btn`, `a[role="button"]`): `slide-up` with slight scale
- **Headings** (`h1`-`h6`): Subtle `slide-up`
- **Paragraphs** (`p`): `fade-in` with small translateY
- **Images** (`img`, `picture`): `zoom` (fade-in with scale)
- **Cards** (`.card`, `.project-card`): `fade-in`
- **SVGs**: `draw` (stroke animation) or `fade-in` fallback
- **Form elements**: `fade-in` only (no transforms to prevent focus jumps)

#### Manual Control

You can override the automatic behavior with data attributes:

```html
<!-- Force a specific animation type -->
<div data-animate="zoom">Content</div>

<!-- Custom delay (ms) -->
<div data-animate-delay="300">Content</div>

<!-- Custom duration (ms) -->
<div data-animate-duration="800">Content</div>

<!-- Repeat animation (default is once) -->
<div data-animate-once="false">Content</div>

<!-- Disable animation -->
<div data-animate="none">Content</div>
<div class="va-no-animate">Content</div>
```

#### Staggered Animations

For lists or grids with staggered child animations:

```html
<div class="intersection-stagger-container" data-animate-stagger="80">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Available Animation Types

- `slide-up`: Element slides up from below
- `fade-in`: Element fades in with minimal movement
- `zoom`: Element scales up
- `draw`: SVG stroke drawing animation

### CSS Variables

The system uses CSS variables for customization:

- `--va-duration`: Animation duration (default: 600ms)
- `--va-delay`: Animation delay (default: 0ms)
- `--va-easing`: Animation easing (default: cubic-bezier(0.25, 0.46, 0.45, 0.94))
- `--va-translate`: Translate distance for slide animations
- `--va-scale`: Scale factor for zoom animations

### Manual Testing Checklist

1. **Single-fire default animations**
   - Navigate to the About page
   - Scroll down and verify elements animate once when entering viewport
   - Scroll up and verify animations don't repeat

2. **Repeat animations**
   - Find elements with `data-animate-once="false"` or `.intersection-repeat`
   - Verify these elements re-animate when scrolling back into view

3. **Reduced motion**
   - Enable "prefers-reduced-motion" in browser settings
   - Verify animations are disabled or minimal
   - Elements should appear instantly without transforms

4. **Dynamic content**
   - Add new elements to the page dynamically
   - Verify new elements are automatically detected and animated

5. **Route transitions**
   - Navigate between different pages
   - Verify animations work correctly on each page

6. **Performance considerations**
   - Check that animations use only transform and opacity properties
   - Verify `will-change` is applied appropriately
   - Ensure observers are disconnected for one-time animations

### API Reference

#### `initViewportAnimations(root, options)`

Initializes the viewport animation system.

**Parameters:**
- `root` (optional): Element, Document, or ShadowRoot to observe
- `options` (optional): Configuration object

**Returns:**
```typescript
{
  disconnect: () => void,  // Clean up all observers
  rescan: (root?) => void  // Manually rescan for new elements
}
```

#### Example Usage

```typescript
import { initViewportAnimations } from './utils/viewportAnimator';

// Initialize with custom options
const animations = initViewportAnimations(document, {
  rootMargin: "0px 0px -10% 0px",
  defaultDuration: 800,
  defaultStagger: 100
});

// Clean up when needed
animations.disconnect();
```

### Usage Examples

#### Heading Animation
```html
<h1 data-animate="slide-up">This heading will slide up</h1>
```

#### Image Animation
```html
<img src="profile.jpg" data-animate="zoom" data-animate-delay="300" alt="Profile">
```

#### Staggered List
```html
<ul class="intersection-stagger-container" data-animate-stagger="80">
  <li>First item</li>
  <li data-animate-delay="150">Second item with custom delay</li>
  <li>Third item</li>
  <li>Fourth item</li>
</ul>