/**
 * Viewport Animation System
 * 
 * A lightweight, SSR-safe animation system that uses IntersectionObserver
 * to trigger animations when elements enter the viewport.
 */

// Constants for magic numbers
const THRESHOLD_ZERO = 0;
const THRESHOLD_LOW = 0.08;
const THRESHOLD_MEDIUM = 0.2;
const THRESHOLD_HIGH = 0.5;
const DEFAULT_THRESHOLD = [THRESHOLD_ZERO, THRESHOLD_LOW, THRESHOLD_MEDIUM, THRESHOLD_HIGH];
const MUTATION_DEBOUNCE_DELAY = 100;
const DEFAULT_ROOT_MARGIN = "0px 0px -8% 0px";
const DEFAULT_DURATION = 600;
const DEFAULT_STAGGER = 60;

// Types for animation system
type ViewportAnimatorOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  defaultDuration?: number;
  defaultStagger?: number;
  pauseOnViewTransition?: boolean;
};

type ElementAnimationData = {
  element: Element;
  animationType: string;
  delay: number;
  duration: number;
  once: boolean;
  stagger?: number;
  isStaggerContainer?: boolean;
};

// Default configuration
const DEFAULT_OPTIONS: ViewportAnimatorOptions = {
  rootMargin: DEFAULT_ROOT_MARGIN,
  threshold: DEFAULT_THRESHOLD,
  defaultDuration: DEFAULT_DURATION,
  defaultStagger: DEFAULT_STAGGER,
};

// Main ViewportAnimator class
class ViewportAnimator {
  private readonly options: ViewportAnimatorOptions;
  private observer: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private readonly animatedElements = new WeakSet<Element>();
  private readonly staggerContainers = new WeakSet<Element>();
  private debounceTimer: number | null = null;
  private readonly isReducedMotion: boolean;
  private root: Element | Document | ShadowRoot;
  private isPaused = false;

  constructor(options: ViewportAnimatorOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } else {
      this.isReducedMotion = false;
    }

    // Initialize pause state
    this.isPaused = false;
  }

  /**
   * Initialize animation system
   */
  init(root?: Element | Document | ShadowRoot): void {
    if (typeof window === 'undefined') {
      // SSR safety check
      return;
    }
    
    this.root = root || document;
    
    // Create intersection observer
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold,
      }
    );

    // Set up mutation observer for dynamic content
    this.mutationObserver = new MutationObserver(
      this.handleMutations.bind(this)
    );

    // Start observing
    this.scanAndObserve(this.root);
    this.mutationObserver.observe(this.root, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Disconnect all observers
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Pause viewport animations (e.g., during view transitions)
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume viewport animations
   */
  resume(): void {
    this.isPaused = false;
  }

  /**
   * Check if animations are currently paused
   */
  isAnimationPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Manually rescan for new elements
   */
  rescan(root?: Element | Document | ShadowRoot): void {
    if (typeof window === 'undefined') {
      // SSR safety check
      return;
    }
    const scanRoot = root || this.root;
    this.scanAndObserve(scanRoot);
  }

  /**
   * Handle intersection observer callbacks
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.handleElementEnteringView(entry.target as Element);
      } else {
        this.handleElementExitingView(entry.target as Element);
      }
    }
  }

  /**
   * Handle element entering viewport
   */
  private handleElementEnteringView(element: Element): void {
    // Skip animation if paused (e.g., during view transition)
    if (this.isPaused) {
      return;
    }

    this.animateElement(element);
    
    // Get animation data to determine if we should stop observing
    const once = element.getAttribute('data-animate-once');
    const shouldRepeat = once === 'false' || element.classList.contains('intersection-repeat');
    
    if (!shouldRepeat) {
      this.observer?.unobserve(element);
    }
  }

  /**
   * Handle element exiting viewport
   */
  private handleElementExitingView(element: Element): void {
    if (!element.classList.contains('va-in-view')) {
      return;
    }
    
    // Handle repeatable animations - remove class when out of view
    const once = element.getAttribute('data-animate-once');
    const shouldRepeat = once === 'false' || element.classList.contains('intersection-repeat');
    
    if (shouldRepeat) {
      element.classList.remove('va-in-view');
      
      // Also remove from children if it's a stagger container
      if (this.staggerContainers.has(element)) {
        this.removeInViewClassFromChildren(element);
      }
    }
  }

  /**
   * Remove va-in-view class from all children of an element
   */
  private removeInViewClassFromChildren(element: Element): void {
    const children = element.children;
    for (const child of Array.from(children)) {
      child.classList.remove('va-in-view');
    }
  }

  /**
   * Handle DOM mutations with debouncing
   */
  private handleMutations(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = window.setTimeout(() => {
      this.rescan();
      this.debounceTimer = null;
    }, MUTATION_DEBOUNCE_DELAY);
  }

  /**
   * Scan for elements and set up observation
   */
  private scanAndObserve(root: Element | Document | ShadowRoot): void {
    // Find elements with animation classes
    const classElements = root.querySelectorAll('[class*="intersection-"]');
    
    // Find elements with data attributes
    const dataElements = root.querySelectorAll('[data-viewport-animate], [data-animate]');
    
    // Combine both sets
    const allElements = [
      ...Array.from(classElements),
      ...Array.from(dataElements),
    ];

    // Also scan for elements that should have default animations applied
    const defaultElements = this.findElementsForDefaultAnimation(root);
    allElements.push(...defaultElements);

    // Process each element
    for (const element of allElements) {
      if (!this.animatedElements.has(element)) {
        this.processElement(element);
        this.observer?.observe(element);
        this.animatedElements.add(element);
      }
    }
  }

  /**
   * Find elements that should have default animations applied
   */
  private findElementsForDefaultAnimation(root: Element | Document | ShadowRoot): Element[] {
    const elements: Element[] = [];
    
    // Find headings without explicit animation
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const heading of headings) {
      if (!this.hasExplicitAnimation(heading)) {
        elements.push(heading);
      }
    }
    
    // Find paragraphs without explicit animation
    const paragraphs = root.querySelectorAll('p');
    for (const paragraph of paragraphs) {
      if (!this.hasExplicitAnimation(paragraph)) {
        elements.push(paragraph);
      }
    }
    
    // Find images without explicit animation
    const images = root.querySelectorAll('img, picture');
    for (const image of images) {
      if (!this.hasExplicitAnimation(image)) {
        elements.push(image);
      }
    }
    
    // Find buttons without explicit animation
    const buttons = root.querySelectorAll('button, .btn, a[role="button"]');
    for (const button of buttons) {
      if (!this.hasExplicitAnimation(button)) {
        elements.push(button);
      }
    }
    
    return elements;
  }

  /**
   * Check if element has explicit animation attributes or classes
   */
  private hasExplicitAnimation(element: Element): boolean {
    return (
      element.getAttribute('data-animate') !== null ||
      element.getAttribute('data-viewport-animate') !== null ||
      element.className.includes('intersection-')
    );
  }

  /**
   * Process an element to determine its animation settings
   */
  private processElement(element: Element): void {
    // Skip if explicitly disabled
    if (
      element.getAttribute('data-animate') === 'none' ||
      element.classList.contains('va-no-animate')
    ) {
      return;
    }

    // Check if it's a stagger container
    if (
      element.classList.contains('intersection-stagger-container') ||
      element.getAttribute('data-animate-stagger') !== null
    ) {
      this.staggerContainers.add(element);
      this.setupStaggerContainer(element);
      return;
    }

    // Get animation type from data attribute or determine from element type
    let animationType = element.getAttribute('data-animate') || 
                      element.getAttribute('data-viewport-animate');
    
    if (!animationType) {
      animationType = this.getAnimationTypeFromElement(element);
    }

    // Set CSS variables for animation parameters
    const delay = Number.parseInt(element.getAttribute('data-animate-delay') || '0', 10);
    const duration = Number.parseInt(
      element.getAttribute('data-animate-duration') || 
      String(this.options.defaultDuration), 
      10
    );
    
    // Apply animation classes and CSS variables
    element.classList.add(`intersection-${animationType}`);
    element.style.setProperty('--va-delay', `${delay}ms`);
    element.style.setProperty('--va-duration', `${duration}ms`);
    
    // Store animation data for later use
    const animationData: ElementAnimationData = {
      element,
      animationType,
      delay,
      duration,
      once: element.getAttribute('data-animate-once') !== 'false',
    };
    
    // Store data for later retrieval
    (element as { __viewportAnimationData?: ElementAnimationData }).__viewportAnimationData = animationData;
  }

  /**
   * Determine animation type based on element semantics
   */
  private getAnimationTypeFromElement(element: Element): string {
    // Check for specific class names
    if (element.classList.contains('btn')) {
      return 'slide-up';
    }
    if (element.classList.contains('card')) {
      return 'fade-in';
    }
    if (element.classList.contains('project-card')) {
      return 'fade-in';
    }
    
    // Check for tag names and attributes
    const tagName = element.tagName.toLowerCase();
    
    // Buttons and button-like elements
    if (tagName === 'button' || 
        (tagName === 'a' && element.getAttribute('role') === 'button')) {
      return 'slide-up';
    }
    
    // Headings
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      return 'slide-up';
    }
    
    // Text elements
    if (tagName === 'p') {
      return 'fade-in';
    }
    
    // Media elements
    if (tagName === 'img' || tagName === 'picture') {
      return 'zoom';
    }
    
    // SVG elements
    if (tagName === 'svg') {
      // Check if SVG has stroke attributes for draw animation
      const hasStroke = element.hasAttribute('stroke') || 
                        element.querySelector('[stroke]');
      return hasStroke ? 'draw' : 'fade-in';
    }
    
    // Form elements
    if (['form', 'input', 'select', 'textarea'].includes(tagName)) {
      return 'fade-in';
    }
    
    // Default animation
    return 'fade-in';
  }

  /**
   * Set up stagger container for child elements
   */
  private setupStaggerContainer(container: Element): void {
    const children = container.children;
    const staggerDelay = Number.parseInt(
      container.getAttribute('data-animate-stagger') || 
      String(this.options.defaultStagger), 
      10
    );
    
    Array.from(children).forEach((child, index) => {
      // Skip if child has explicit opt-out
      if (
        child.getAttribute('data-animate') === 'none' ||
        child.classList.contains('va-no-animate')
      ) {
        return;
      }
      
      const delay = index * staggerDelay;
      child.style.setProperty('--va-delay', `${delay}ms`);
      
      // Add animation class based on child element type
      const animationType = child.getAttribute('data-animate') || 
                          this.getAnimationTypeFromElement(child);
      
      if (animationType !== 'none') {
        child.classList.add(`intersection-${animationType}`);
      }
    });
  }

  /**
   * Apply animation to an element
   */
  private animateElement(element: Element): void {
    // Add in-view class to trigger animation
    element.classList.add('va-in-view');
    
    // Handle stagger containers
    if (this.staggerContainers.has(element)) {
      const children = element.children;
      for (const child of Array.from(children)) {
        child.classList.add('va-in-view');
      }
    }
    
    // For reduced motion, just make elements visible without animation
    if (this.isReducedMotion) {
      element.style.setProperty('--va-translate', '0px');
      element.style.setProperty('--va-scale', '1');
    }
  }
}

// Create and export initialization function
let animatorInstance: ViewportAnimator | null = null;

export function initViewportAnimations(
  root?: Element | Document | ShadowRoot,
  options?: ViewportAnimatorOptions
): { 
    disconnect: () => void; 
    rescan: (root?: Element | Document | ShadowRoot) => void;
    pause: () => void;
    resume: () => void;
    isPaused: () => boolean;
  } {
  if (typeof window === 'undefined') {
    // Return a no-op API for SSR
    return {
      disconnect: () => {
        // No-op in SSR
      },
      rescan: () => {
        // No-op in SSR
      },
      pause: () => {
        // No-op in SSR
      },
      resume: () => {
        // No-op in SSR
      },
      isPaused: () => false,
    };
  }
  
  // Create or reuse animator instance
  if (!animatorInstance) {
    animatorInstance = new ViewportAnimator(options);
  }
  
  // Initialize animator
  animatorInstance.init(root);
  
  // Return API
  return {
    disconnect: () => animatorInstance?.disconnect(),
    rescan: (newRoot?: Element | Document | ShadowRoot) => animatorInstance?.rescan(newRoot),
    pause: () => animatorInstance?.pause(),
    resume: () => animatorInstance?.resume(),
    isPaused: () => animatorInstance?.isAnimationPaused() ?? false,
  };
}

// Export class for advanced usage
export { ViewportAnimator };