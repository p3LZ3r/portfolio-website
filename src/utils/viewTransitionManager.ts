/**
 * View Transition Manager
 * 
 * Centralized manager for coordinating View Transitions API
 * with viewport animations and component opt-ins.
 */

import { isViewTransitionSupported } from './viewTransitionSupport.js';

type ViewTransitionCallback = () => void | Promise<void>;

// Constants for magic numbers
const FRAME_CHECK_INTERVAL = 16; // Check every frame (60fps)

type ViewTransitionManagerOptions = {
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
  onTransitionError?: (error: Error) => void;
};

class ViewTransitionManager {
  private isTransitionActive = false;
  private readonly options: ViewTransitionManagerOptions;
  private queuedAnimations: (() => void)[] = [];

  constructor(options: ViewTransitionManagerOptions = {}) {
    this.options = options;
  }

  /**
   * Start a page transition with View Transitions API if supported
   */
  async startPageTransition(callback: ViewTransitionCallback): Promise<void> {
    // If View Transitions are not supported, just run the callback
    if (!isViewTransitionSupported()) {
      await callback();
      return;
    }

    // If a transition is already active, wait for it to finish
    if (this.isTransitionActive) {
      await this.waitForCurrentTransition();
    }

    this.isTransitionActive = true;
    this.options.onTransitionStart?.();

    try {
      // Use View Transitions API
      const transition = document.startViewTransition(async () => {
        await callback();
      });

      // Wait for the transition to complete
      await transition.finished;

      // Process any queued animations
      this.processQueuedAnimations();

      this.options.onTransitionEnd?.();
    } catch (error) {
      this.options.onTransitionError?.(error as Error);
    } finally {
      this.isTransitionActive = false;
    }
  }

  /**
   * Check if a transition is currently active
   */
  isActive(): boolean {
    return this.isTransitionActive;
  }

  /**
   * Queue an animation to run after the current transition completes
   */
  queueAnimation(animation: () => void): void {
    if (this.isTransitionActive) {
      this.queuedAnimations.push(animation);
    } else {
      animation();
    }
  }

  /**
   * Process all queued animations
   */
  private processQueuedAnimations(): void {
    const animations = [...this.queuedAnimations];
    this.queuedAnimations = [];
    
    // Use requestAnimationFrame to ensure smooth execution
    requestAnimationFrame(() => {
      for (const animation of animations) {
        animation();
      }
    });
  }

  /**
   * Wait for the current transition to complete
   */
  private waitForCurrentTransition(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.isTransitionActive) {
          clearInterval(checkInterval);
          resolve();
        }
      }, FRAME_CHECK_INTERVAL); // Check every frame
    });
  }

  /**
   * Find and prepare elements with view transition attributes
   */
  prepareTransitionElements(): void {
    if (!isViewTransitionSupported()) {
      return;
    }

    // Find elements with data-view-transition attribute
    const elements = document.querySelectorAll('[data-view-transition]');
    
    for (const element of elements) {
      const transitionName = element.getAttribute('data-view-transition');
      if (transitionName) {
        // Apply view-transition-name CSS property
        (element as HTMLElement).style.viewTransitionName = transitionName;
      }
    }
  }

  /**
   * Clean up view transition styles
   */
  cleanupTransitionElements(): void {
    if (!isViewTransitionSupported()) {
      return;
    }

    // Remove view-transition-name from elements
    const elements = document.querySelectorAll('[data-view-transition]');
    
    for (const element of elements) {
      (element as HTMLElement).style.viewTransitionName = '';
    }
  }
}

// Create singleton instance
let viewTransitionManager: ViewTransitionManager | null = null;

/**
 * Get or create the View Transition Manager instance
 */
export function getViewTransitionManager(options?: ViewTransitionManagerOptions): ViewTransitionManager {
  if (!viewTransitionManager) {
    viewTransitionManager = new ViewTransitionManager(options);
  }
  return viewTransitionManager;
}

/**
 * Convenience function to start a page transition
 */
export function startPageTransition(callback: ViewTransitionCallback): Promise<void> {
  const manager = getViewTransitionManager();
  return manager.startPageTransition(callback);
}

/**
 * Check if a view transition is currently active
 */
export function isViewTransitionActive(): boolean {
  const manager = getViewTransitionManager();
  return manager.isActive();
}

/**
 * Queue an animation to run after current transition
 */
export function queueAnimationAfterTransition(animation: () => void): void {
  const manager = getViewTransitionManager();
  manager.queueAnimation(animation);
}

/**
 * Prepare elements for view transition
 */
export function prepareViewTransitionElements(): void {
  const manager = getViewTransitionManager();
  manager.prepareTransitionElements();
}

/**
 * Clean up view transition elements
 */
export function cleanupViewTransitionElements(): void {
  const manager = getViewTransitionManager();
  manager.cleanupTransitionElements();
}