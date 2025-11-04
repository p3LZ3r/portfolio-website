import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
//import "./styles/global.css";
import "./styles/animations.css";
import "./components/CallButton";
import "./components/ProjectCard";
import "./components/FormInput";
import "./pages/AboutPage";
import "./pages/ProjectsPage";
import "./pages/ContactPage";
import { initViewportAnimations } from "./utils/viewportAnimator";
import { startPageTransition, prepareViewTransitionElements, cleanupViewTransitionElements, isViewTransitionActive } from "./utils/viewTransitionManager";

// Constants for magic numbers
const THRESHOLD_ZERO = 0;
const THRESHOLD_LOW = 0.08;
const THRESHOLD_MEDIUM = 0.2;
const THRESHOLD_HIGH = 0.5;

type RouteType = "about" | "projects" | "contact";

@customElement("portfolio-app")
export class PortfolioApp extends LitElement {
  @state() private currentRoute: RouteType =
    (location.hash.replace("#", "") as RouteType) || "about";

  connectedCallback() {
    super.connectedCallback();
    this._syncRouteFromLocation();
    window.addEventListener("hashchange", this._onHashChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("hashchange", this._onHashChange);
  }

  private _syncRouteFromLocation() {
    const hash = location.hash.replace("#", "");
    if (hash === "about" || hash === "projects" || hash === "contact") {
      this.currentRoute = hash as RouteType;
    } else {
      this.currentRoute = "about";
    }
  }

  private readonly _onHashChange = () => {
    this._handleRouteChange();
  };

  private _handleRouteChange() {
    // Prepare view transition elements before route change
    prepareViewTransitionElements();
    
    // Use view transition if supported, otherwise just update route
    startPageTransition(() => {
      this._syncRouteFromLocation();
    }).finally(() => {
      // Clean up view transition elements after transition
      cleanupViewTransitionElements();
    });
  }

  firstUpdated() {
    // Initialize viewport animations after the component is rendered
    this.initializeAnimations();
  }

  private initializeAnimations() {
    // Only initialize on client-side, not during SSR
    if (typeof window !== 'undefined') {
      // Initialize the viewport animation system with document as root
      // This ensures we observe all elements in the page, including those in custom elements
      const viewportAnimations = initViewportAnimations(document, {
        rootMargin: "0px 0px -8% 0px",
        threshold: [THRESHOLD_ZERO, THRESHOLD_LOW, THRESHOLD_MEDIUM, THRESHOLD_HIGH],
        defaultDuration: 600,
        defaultStagger: 60,
        pauseOnViewTransition: true,
      });

      // Store the animation controller for potential cleanup
      (this as { _viewportAnimations?: { disconnect: () => void; pause: () => void; resume: () => void } })._viewportAnimations = viewportAnimations;
    }
  }

  render() {
    return html`
      <main>
        ${this.currentRoute === "about" ? html`<about-page data-view-transition="page-main"></about-page>` : ""}
        ${this.currentRoute === "projects" ? html`<projects-page data-view-transition="page-main"></projects-page>` : ""}
        ${this.currentRoute === "contact" ? html`<contact-page data-view-transition="page-main"></contact-page>` : ""}
      </main>
    `;
  }
}

declare global {
  // biome-ignore lint/suspicious/noExplicitAny: Required for LitElement custom elements
  const HTMLElementTagNameMap: any & {
    "portfolio-app": PortfolioApp;
  };
}