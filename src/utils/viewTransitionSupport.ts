/**
 * View Transitions API Support Detection
 * 
 * Utility functions to detect View Transitions API support
 * and user preferences for reduced motion.
 */

/**
 * Check if View Transitions API is supported and user prefers motion
 */
export function isViewTransitionSupported(): boolean {
  // Check for View Transitions API support
  if (!('startViewTransition' in document)) {
    return false;
  }

  // Check for reduced motion preference
  if (typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  return true;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && 
         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get View Transitions API feature information
 */
export function getViewTransitionInfo() {
  return {
    supported: isViewTransitionSupported(),
    reducedMotion: prefersReducedMotion(),
    apiAvailable: 'startViewTransition' in document,
  };
}