// Intersection Observer utility for scroll animations
export class ScrollAnimationManager {
  private observer: IntersectionObserver;
  private observedElements = new WeakMap<Element, () => void>();

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = this.observedElements.get(entry.target);
          if (callback) {
            if (entry.isIntersecting) {
              callback();
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  observe(element: Element, callback: () => void) {
    this.observedElements.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    this.observedElements.delete(element);
    this.observer.unobserve(element);
  }

  disconnect() {
    this.observer.disconnect();
    this.observedElements = new WeakMap();
  }
}

// Singleton instance
export const scrollAnimationManager = new ScrollAnimationManager();