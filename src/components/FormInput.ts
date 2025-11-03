import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('form-input')
export class FormInput extends LitElement {
  @property({ type: String }) placeholder = 'Your name';
  @property({ type: String }) value = '';
  @property({ type: Boolean }) active = false;
  @property({ type: String }) type = 'text';

  render() {
    return html`
      <div class="relative w-full p-8 bg-white/25 backdrop-blur-[14.4px] rounded-xl border border-transparent transition-all duration-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-100 focus-within:ring-offset-2 ${this.active ? 'bg-gray-800/25 border-gray-400' : ''}">
        <input
          class="w-full bg-transparent border-none text-gray-100 font-body font-medium text-[1.4375rem] leading-tight tracking-[-0.02em] outline-none placeholder:text-gray-400 focus:outline-none"
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