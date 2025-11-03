import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./styles/global.css";
import "./components/CallButton";
import "./components/ProjectCard";
import "./components/FormInput";
import "./components/BottomNav";
import "./pages/AboutPage";
import "./pages/ProjectsPage";
import "./pages/ContactPage";

// Import Tailwind CSS for Shadow DOM compatibility
import "tailwindcss";

@customElement("portfolio-app")
export class PortfolioApp extends LitElement {
  @state() private currentRoute: "about" | "projects" | "contact" =
    (location.hash.replace("#", "") as any) || "about";

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
      this.currentRoute = hash;
    } else {
      this.currentRoute = "about";
    }
  }

  private _onHashChange = () => {
    this._syncRouteFromLocation();
  };

  private _withViewTransition(updateFn: () => void) {
    if ("startViewTransition" in document) {
      (document as any).startViewTransition(updateFn);
    } else {
      updateFn();
    }
  }

  private _navigate(to: "about" | "projects" | "contact") {
    this._withViewTransition(() => {
      this.currentRoute = to;
      history.pushState({ page: to }, "", "#" + to);
    });
    // After navigation completes, move focus to the newly-rendered page's main heading
    this.updateComplete.then(() => {
      const page = this.shadowRoot?.querySelector(`${this.currentRoute}-page`);
      const heading =
        page?.querySelector("h1") || page?.querySelector('[role="main"]');
      if (heading instanceof HTMLElement) {
        heading.focus();
      }
    });
  }

  render() {
    return html`
      <main>
        ${this.currentRoute === "about" ? html`<about-page></about-page>` : ""}
        ${this.currentRoute === "projects" ? html`<projects-page></projects-page>` : ""}
        ${this.currentRoute === "contact" ? html`<contact-page></contact-page>` : ""}
        <bottom-nav .current=${this.currentRoute} @navigate=${(e: any) => this._navigate(e.detail.to)}></bottom-nav>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "portfolio-app": PortfolioApp;
  }
}
