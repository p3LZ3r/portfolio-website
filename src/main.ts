import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./components/CallButton";
import "./components/ProjectCard";
import "./components/FormInput";
import "./pages/AboutPage";
import "./pages/ProjectsPage";
import "./pages/ContactPage";

type RouteType = "about" | "projects" | "contact";

@customElement("portfolio-app")
export class PortfolioApp extends LitElement {
  @state() private currentRoute: RouteType = "about";

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
    // Update route state directly without view transitions
    this._syncRouteFromLocation();
  }

  render() {
    return html`
      <main id="main-content" class="content-auto">
        ${this.currentRoute === "about" ? html`<about-page></about-page>` : ""}
        ${this.currentRoute === "projects" ? html`<projects-page></projects-page>` : ""}
        ${this.currentRoute === "contact" ? html`<contact-page></contact-page>` : ""}
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
