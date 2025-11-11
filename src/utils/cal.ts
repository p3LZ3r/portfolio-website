/**
 * Cal.com embed wrapper
 * 
 * Provides a small, maintainable wrapper around Cal.com embed SDK
 * so CTAs (element clicks) open a booking modal quickly, safely, and accessibly.
 * 
 * Features:
 * - Deferred script loading until user interaction
 * - Namespaced initialization to avoid collisions
 * - Prerendering for improved perceived performance
 * - Prefill support for name/email
 * - Privacy-conscious defaults
 */

// Types for Cal.com embed API
type CalConfig = {
  layout?: string;
  theme?: string;
  [key: string]: unknown;
};

type CalModalOptions = {
  config?: CalConfig;
  prefill?: {
    name?: string;
    email?: string;
  };
};

type CalPrerenderOptions = {
  pageType?: string;
};

type CalInitOptions = {
  calOrigin?: string;
  forwardQueryParams?: boolean;
};

// Global state
let sdkLoaded = false;
let sdkReady: Promise<void> | null = null;
const initializedNamespaces = new Set<string>();
const GLOBAL_NAMESPACE_KEY = "__cal_global__";

// Default configuration
const DEFAULT_CAL_ORIGIN = "https://cal.com";
const SDK_SRC = "https://cal.com/embed.js";
const HOVER_DELAY_MS = 150; // Small delay to avoid accidental hover

// Type for global Cal object
type CalNamespaceHandler = ((action: string, ...args: unknown[]) => void) & {
  q?: unknown[][];
  instance?: unknown;
};

type CalGlobal = {
  config?: Record<string, unknown>;
  q?: unknown[][];
  ns: Record<string, CalNamespaceHandler>;
  __isStub?: boolean;
  (action: string, ...args: unknown[]): void;
};

type WindowWithCal = Window & {
  Cal?: CalGlobal;
};

/**
 * Ensure Cal.com stub exists before loading the SDK.
 *
 * Cal's embed bundle expects a global Cal function with queue + namespace stubs
 * already defined. Without this, the downloaded script throws during evaluation
 * and the modal never opens. We reproduce the lightweight bootstrap the official
 * snippet adds before loading the bundle.
 */
function ensureCalStub(): CalGlobal | null {
  if (typeof window === "undefined") {
    return null;
  }

  const w = window as WindowWithCal;

  if (w.Cal && typeof w.Cal === "function") {
    w.Cal.q = w.Cal.q || [];
    w.Cal.ns = w.Cal.ns || {};
    return w.Cal;
  }

  const CalStub = function (...args: unknown[]) {
    CalStub.q = CalStub.q || [];
    CalStub.q.push(args);
  } as CalGlobal;

  CalStub.q = [];
  CalStub.ns = {};
  CalStub.__isStub = true;

  w.Cal = CalStub;
  return CalStub;
}

function ensureNamespaceStub(cal: CalGlobal, namespace: string): CalNamespaceHandler {
  const ns = namespace || "default";
  if (!cal.ns[ns]) {
    const namespaceStub = function (...args: unknown[]) {
      namespaceStub.q = namespaceStub.q || [];
      namespaceStub.q.push(args);
    } as CalNamespaceHandler;
    namespaceStub.q = [];
    cal.ns[ns] = namespaceStub;
  }
  return cal.ns[ns];
}

function getCalInstance(): CalGlobal {
  if (typeof window === "undefined") {
    throw new Error("Cal.com is only available in the browser");
  }
  const w = window as WindowWithCal;
  if (!w.Cal || typeof w.Cal !== "function") {
    throw new Error("Cal.com SDK is not available on window");
  }
  return w.Cal;
}

/**
 * Load Cal.com embed script if not already loaded
 */
function loadSDK(): Promise<void> {
  if (sdkLoaded) {
    return Promise.resolve();
  }

  if (sdkReady) {
    return sdkReady;
  }

  sdkReady = new Promise((resolve, reject) => {
    // Check if already available
    if (typeof window !== "undefined") {
      const existingCal = (window as WindowWithCal).Cal;
      if (existingCal && typeof existingCal === "function" && !existingCal.__isStub) {
        sdkLoaded = true;
        resolve();
        return;
      }
    }

    const stub = ensureCalStub();
    if (!stub) {
      reject(new Error("Cal.com embed can only run in the browser"));
      return;
    }

    // Ensure default namespace queue exists ahead of the script executing
    ensureNamespaceStub(stub, "default");

    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.defer = true;
    script.crossOrigin = "anonymous";
    
    script.onload = () => {
      try {
        const Cal = getCalInstance();
        if (Cal.__isStub) {
          delete Cal.__isStub;
        }
      } catch {
        // Ignore - getCalInstance throws if Cal missing, which will surface elsewhere
      }
      sdkLoaded = true;
      resolve();
      return;
    };

    script.onerror = () => {
      reject(new Error("Failed to load Cal.com embed script"));
    };

    document.head.appendChild(script);
  });

  return sdkReady;
}

/**
 * Initialize Cal.com in a specific namespace
 */
export async function initCal(namespace: string, options: CalInitOptions = {}): Promise<void> {
  const targetNamespace = namespace || "default";

  if (initializedNamespaces.has(targetNamespace)) {
    return;
  }

  // Ensure namespace stub exists before the SDK loads so it can bootstrap the instance.
  const preLoadCal = ensureCalStub();
  if (preLoadCal) {
    ensureNamespaceStub(preLoadCal, targetNamespace);
  }

  await loadSDK();

  const Cal = getCalInstance();

  const calOrigin = options.calOrigin || DEFAULT_CAL_ORIGIN;

  // Apply global configuration once
  if (!initializedNamespaces.has(GLOBAL_NAMESPACE_KEY)) {
    Cal("init", {
      debug: import.meta.env.DEV,
      calOrigin,
    });

    if (options.forwardQueryParams) {
      Cal.config = Cal.config || {};
      Cal.config.forwardQueryParams = true;
    }

    initializedNamespaces.add(GLOBAL_NAMESPACE_KEY);
  } else if (options.forwardQueryParams) {
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;
  }

  const namespaceHandler = ensureNamespaceStub(Cal, targetNamespace);

  const namespaceInitOptions: Record<string, unknown> = {
    calOrigin,
    debug: import.meta.env.DEV,
  };

  if (options.forwardQueryParams) {
    namespaceInitOptions.forwardQueryParams = true;
  }

  namespaceHandler("init", targetNamespace, namespaceInitOptions);

  initializedNamespaces.add(targetNamespace);
}

/**
 * Open a Cal.com modal
 */
export async function openCalModal(
  calLink: string, 
  options: CalModalOptions = {},
  namespace = "default"
): Promise<void> {
  const targetNamespace = namespace || "default";

  await initCal(targetNamespace);

  const Cal = getCalInstance();

  ensureNamespaceStub(Cal, targetNamespace);

  // Emit analytics event
  document.dispatchEvent(new CustomEvent("cal:open", {
    detail: { calLink, namespace: targetNamespace, method: "openCalModal" }
  }));

  // Prepare config with prefill
  const config: CalConfig = {
    ...options.config,
  };

  if (options.prefill) {
    if (options.prefill.name) {
      config.name = options.prefill.name;
    }
    if (options.prefill.email) {
      config.email = options.prefill.email;
    }
    
    // Emit prefill analytics
    document.dispatchEvent(new CustomEvent("cal:prefill", {
      detail: { 
        namePresent: !!options.prefill.name, 
        emailPresent: !!options.prefill.email 
      }
    }));
  }

  // Open modal using namespace
  Cal.ns[targetNamespace]("modal", {
    calLink,
    config,
  });
}

/**
 * Prerender a Cal.com booking page for faster opening
 */
export async function prerenderCal(
  calLink: string,
  options: CalPrerenderOptions = {},
  namespace = "default"
): Promise<void> {
  const targetNamespace = namespace || "default";

  await initCal(targetNamespace);

  const Cal = getCalInstance();

  ensureNamespaceStub(Cal, targetNamespace);

  // Emit analytics event
  document.dispatchEvent(new CustomEvent("cal:prerender", {
    detail: { calLink, namespace: targetNamespace }
  }));

  // Prerender using namespace
  Cal.ns[targetNamespace]("prerender", {
    calLink,
    type: "modal",
    pageType: options.pageType,
  });
}

/**
 * Enable or disable query parameter forwarding
 */
export function setForwardQueryParams(flag: boolean): void {
  if (typeof window !== "undefined") {
    // Only set if Cal is available
    const Cal = (window as unknown as Record<string, CalGlobal>).Cal;
    if (Cal) {
      Cal.config = Cal.config || {};
      Cal.config.forwardQueryParams = flag;
    }
  }
}

/**
 * Setup automatic loading and initialization for elements with data-cal-link
 */
export function setupCalEmbeds(): void {
  if (typeof document === "undefined") {
    return;
  }

  let loadTimeout: number | null = null;

  const loadSDKOnIntent = () => {
    if (loadTimeout) {
      clearTimeout(loadTimeout);
    }
    loadTimeout = window.setTimeout(() => {
      loadSDK().catch(() => {
        // Silently handle errors to avoid breaking app
      });
    }, HOVER_DELAY_MS);
  };

  // Attach event listeners to any element that has data-cal-link
  document.addEventListener("pointerenter", function onPointer(e) {
    const target = e.target as Element;
    const el = target?.closest('[data-cal-link]');
    if (el) {
      loadSDKOnIntent();
    }
  }, { capture: true, passive: true });

  document.addEventListener("click", function onClick(e) {
    const target = e.target as Element;
    const el = target?.closest('[data-cal-link]');
    if (el) {
      loadSDK().catch(() => {
        // Silently handle errors to avoid breaking app
      });
    }
  }, { capture: true });
}

// Auto-setup when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupCalEmbeds);
  } else {
    setupCalEmbeds();
  }
}
