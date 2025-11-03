import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('form-input')
export class FormInput extends LitElement {
  @property({ type: String }) placeholder = 'Your name';
  @property({ type: String }) value = '';
  @property({ type: Boolean }) active = false;
  @property({ type: String }) type = 'text';

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .input-container {
      position: relative;
      width: 100%;
      padding: var(--spacing-lg) var(--spacing-xl);
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-sm);
      backdrop-filter: var(--shadow-backdrop);
      border: 1px solid transparent;
      transition: all var(--transition-normal);
    }

    :host([active]) .input-container {
      background: var(--color-bg-primary);
      border-color: var(--color-text-muted);
    }

    .input {
      width: 100%;
      background: transparent;
      border: none;
      color: var(--color-text-primary);
      font-family: var(--font-family-secondary);
      font-weight: 450;
      font-size: 1.4375rem;
      line-height: 1.2;
      letter-spacing: -0.02em;
      outline: none;
    }

    .input::placeholder {
      color: var(--color-text-muted);
    }

    :host(:not([active])) .input::placeholder {
      color: var(--color-text-secondary);
    }

    .input:focus {
      outline: none;
    }

    /* Focus styles */
    .input-container:focus-within {
      outline: 2px solid var(--color-text-primary);
      outline-offset: 2px;
    }
  `;

  render() {
    return html`
      <div class="input-container" ?active="${this.active}">
        <input
          class="input"
          type="${this.type}"
          placeholder="${this.placeholder}"
          .value="${this.value}"
          @input="${this._handleInput}"
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          aria-label="${this.placeholder}"
        />
      </div>
    `;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private _handleFocus() {
    this.dispatchEvent(new CustomEvent('input-focus', { bubbles: true }));
  }

  private _handleBlur() {
    this.dispatchEvent(new CustomEvent('input-blur', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-input': FormInput;
  }
}