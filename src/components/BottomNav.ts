import { LitElement, html, css } from 'lit';
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

  private _handleHashChange = () => {
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
      <nav>
        <button
          type="button"
          @click=${() => this._handleNavigate('about')}
          aria-current=${this.current === 'about' ? 'true' : 'false'}
          class=${this.current === 'about' ? 'active' : ''}
          aria-label="Navigate to Home"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </button>
        <button
          type="button"
          @click=${() => this._handleNavigate('projects')}
          aria-current=${this.current === 'projects' ? 'true' : 'false'}
          class=${this.current === 'projects' ? 'active' : ''}
          aria-label="Navigate to Projects"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </button>
        <button
          type="button"
          @click=${() => this._handleNavigate('contact')}
          aria-current=${this.current === 'contact' ? 'true' : 'false'}
          class=${this.current === 'contact' ? 'active' : ''}
          aria-label="Navigate to Contact"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </button>
      </nav>
    `;
  }

  static styles = css`
    nav {
      position: fixed;
      bottom: var(--spacing-sm);
      left: var(--spacing-sm);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      z-index: 1000;
      background: var(--color-bg-secondary);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-sm);
      box-shadow: var(--shadow-primary);
      animation: slideIn 0.5s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    button {
      background: transparent;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--transition-fast), box-shadow var(--transition-fast);
      position: relative;
    }

    button svg {
      width: 20px;
      height: 20px;
      fill: var(--color-text-primary);
      transition: fill var(--transition-fast);
    }

    button:hover,
    button:focus-visible {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    button.active {
      transform: scale(1.2);
      background: var(--color-accent);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    button.active svg {
      fill: var(--color-text-secondary);
    }

    @media (max-width: 768px) {
      nav {
        gap: var(--spacing-xs);
        padding: var(--spacing-xs);
      }

      button {
        width: 40px;
        height: 40px;
      }

      button svg {
        width: 18px;
        height: 18px;
      }
    }
  `;
}