import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Type for the navigate event detail.
 */
export type NavigateDetail = { to: 'about' | 'projects' | 'contact' };

/**
 * Bottom navigation component for switching between pages.
 * Emits 'navigate' events with detail containing the target page.
 */
@customElement('bottom-nav')
export class BottomNav extends LitElement {
  /**
   * The current active page. Updates the visual state and aria-current attribute.
   */
  @property({ type: String })
  current = '';

  private _handleNavigate(to: NavigateDetail['to']) {
    this.dispatchEvent(
      new CustomEvent<NavigateDetail>('navigate', {
        detail: { to },
        bubbles: true,
        composed: true,
      })
    );
  }

  private readonly _handleHashChange = () => {
    const hash = window.location.hash.slice(1);
    this.current = hash || 'about';
  };

  connectedCallback() {
    super.connectedCallback();
    this.current = window.location.hash.slice(1) || 'about';
    window.addEventListener('hashchange', this._handleHashChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._handleHashChange);
  }

  render() {
    return html`
      <nav class="fixed bottom-4 left-4 flex flex-col gap-3 z-[1000] bg-white/25 backdrop-blur-xl rounded-2xl p-4 shadow-lg animate-in slide-in-from-left duration-500">
        <button
          type="button"
          @click=${() => this._handleNavigate('about')}
          aria-current=${this.current === 'about' ? 'true' : 'false'}
          class="w-11 h-11 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all duration-200 relative hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 ${this.current === 'about' ? 'scale-125 bg-blue-500 shadow-xl' : ''}"
          aria-label="Navigate to Home"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="w-5 h-5 fill-gray-100 transition-colors duration-200 ${this.current === 'about' ? 'fill-gray-200' : ''}">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </button>
        <button
          type="button"
          @click=${() => this._handleNavigate('projects')}
          aria-current=${this.current === 'projects' ? 'true' : 'false'}
          class="w-11 h-11 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all duration-200 relative hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 ${this.current === 'projects' ? 'scale-125 bg-blue-500 shadow-xl' : ''}"
          aria-label="Navigate to Projects"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="w-5 h-5 fill-gray-100 transition-colors duration-200 ${this.current === 'projects' ? 'fill-gray-200' : ''}">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </button>
        <button
          type="button"
          @click=${() => this._handleNavigate('contact')}
          aria-current=${this.current === 'contact' ? 'true' : 'false'}
          class="w-11 h-11 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center transition-all duration-200 relative hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 ${this.current === 'contact' ? 'scale-125 bg-blue-500 shadow-xl' : ''}"
          aria-label="Navigate to Contact"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="w-5 h-5 fill-gray-100 transition-colors duration-200 ${this.current === 'contact' ? 'fill-gray-200' : ''}">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </button>
      </nav>
    `;
  }
}