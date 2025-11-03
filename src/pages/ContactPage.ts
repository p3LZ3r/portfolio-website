import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('contact-page')
export class ContactPage extends LitElement {
  @state() private formData = {
    name: '',
    company: '',
    email: '',
    project: ''
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      width: 100vw;
      position: relative;
      container-type: inline-size;
    }

    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--color-bg-primary);
      filter: blur(6px);
      z-index: -1;
    }

    .main {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: var(--spacing-lg);
      gap: var(--spacing-xl);
      background: var(--color-bg-secondary);
      backdrop-filter: var(--shadow-backdrop);
      border-radius: var(--border-radius-lg);
      margin: var(--spacing-xs);
    }

    .top {
      display: flex;
      justify-content: center;
      align-self: stretch;
      gap: var(--spacing-xl);
    }

    .header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      max-width: 872px;
      text-align: center;
    }

    .title {
      font-size: clamp(1.5rem, 3vw, 2.8125rem);
      font-weight: 200;
      color: var(--color-text-primary);
      margin: 0;
    }

    .subtitle {
      font-size: clamp(0.875rem, 2vw, 1.4375rem);
      color: var(--color-text-secondary);
      margin: 0;
      line-height: 1.2;
    }

    .middle {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      gap: var(--spacing-lg);
      max-width: 593px;
    }

    .form-input {
      width: 100%;
    }

    .send-button {
      align-self: flex-end;
      font-family: var(--font-family-secondary);
      font-weight: 375;
      font-size: 1.0625rem;
      line-height: 1.2;
      color: var(--color-text-primary);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color var(--transition-fast);
    }

    .send-button:hover,
    .send-button:focus {
      color: var(--color-text-muted);
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      align-self: stretch;
      gap: var(--spacing-xl);
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .link {
      font-family: var(--font-family-secondary);
      font-weight: 450;
      font-size: 1.0625rem;
      line-height: 1.2;
      color: var(--color-text-primary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .link.active {
      color: var(--color-text-primary);
    }

    .link.inactive {
      color: var(--color-text-muted);
    }

    .link:hover,
    .link:focus {
      color: var(--color-text-muted);
    }

    /* Responsive adjustments */
    @container (max-width: 1024px) {
      .top {
        flex-direction: column;
        text-align: center;
      }

      .bottom {
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-lg);
      }

      .links {
        align-items: center;
      }
    }

    @container (max-width: 768px) {
      .main {
        padding: var(--spacing-md);
        margin: 0;
        border-radius: 0;
      }

      .middle {
        gap: var(--spacing-md);
      }
    }
  `;

  render() {
    return html`
      <div class="background"></div>
      <div class="main">
        <div class="top">
          <div class="header">
            <h2 class="title">Contact</h2>
            <p class="subtitle">For everyone with tele-phobia.</p>
          </div>
          <call-button></call-button>
        </div>
        <form class="middle" @submit="${this._handleSubmit}" novalidate>
          <form-input
            class="form-input"
            placeholder="|Your name"
            .value="${this.formData.name}"
            active
            @input-change="${this._handleNameChange}"
          ></form-input>
          <form-input
            class="form-input"
            placeholder="Your company"
            .value="${this.formData.company}"
            @input-change="${this._handleCompanyChange}"
          ></form-input>
          <form-input
            class="form-input"
            placeholder="Your email"
            type="email"
            .value="${this.formData.email}"
            @input-change="${this._handleEmailChange}"
          ></form-input>
          <form-input
            class="form-input"
            placeholder="Your project"
            .value="${this.formData.project}"
            @input-change="${this._handleProjectChange}"
          ></form-input>
          <button type="submit" class="send-button">Send →</button>
        </form>
        
      </div>
    `;
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', this.formData);
    // In a real app, you'd send this to a backend
  }

  private _handleNameChange(e: CustomEvent) {
    this.formData.name = e.detail.value;
  }

  private _handleCompanyChange(e: CustomEvent) {
    this.formData.company = e.detail.value;
  }

  private _handleEmailChange(e: CustomEvent) {
    this.formData.email = e.detail.value;
  }

  private _handleProjectChange(e: CustomEvent) {
    this.formData.project = e.detail.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'contact-page': ContactPage;
  }
}