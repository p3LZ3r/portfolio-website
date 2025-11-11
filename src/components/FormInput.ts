import { html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { shadowDomStyles } from "../styles/shadow-dom.css.js";

@customElement("form-input")
export class FormInput extends LitElement {
  static styles = shadowDomStyles;
  @property({ type: String }) placeholder = "Your name";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: String }) type = "text";
  @property({ type: String }) name = "";
  @property({ type: String }) autocomplete = "";
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) invalid = false;
  @property({ type: String, attribute: "described-by" }) describedBy = "";

  render() {
    return html`
      <div class="relative w-full p-8 bg-white/25 backdrop-blur-[14.4px] rounded-xl border border-transparent transition-all duration-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-100 focus-within:ring-offset-2 ${this.active ? "bg-zinc-800/25 border-zinc-400" : ""}">
        <input
          class="w-full bg-transparent border-none text-zinc-100 font-body font-medium text-[1.4375rem] leading-tight tracking-[-0.02em] outline-none placeholder:text-zinc-400 focus:outline-none"
          type="${this.type}"
          placeholder="${this.placeholder}"
          .value="${this.value}"
          name=${this.name || nothing}
          autocomplete=${this.autocomplete || nothing}
          ?required="${this.required}"
          aria-invalid="${this.invalid ? "true" : "false"}"
          aria-describedby=${this.describedBy || nothing}
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
    this.dispatchEvent(
      new CustomEvent("input-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFocus() {
    this.active = true;
    this.dispatchEvent(new CustomEvent("input-focus", { bubbles: true }));
  }

  private _handleBlur() {
    this.active = false;
    this.dispatchEvent(new CustomEvent("input-blur", { bubbles: true }));
  }
}
