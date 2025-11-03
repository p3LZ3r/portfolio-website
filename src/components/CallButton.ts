import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('call-button')
export class CallButton extends LitElement {
  @property({ type: String }) label = 'Call Me Maybe';
  @property({ type: String }) href = 'tel:+1234567890';

  render() {
    return html`
      <a href="${this.href}" aria-label="Call ${this.label}" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/25 bg-gradient-to-br from-gray-400/25 to-gray-400/25 rounded-full shadow-[0px_1px_8px_0px_rgba(0,0,0,0.1),0px_0px_2px_0px_rgba(0,0,0,0.1),inset_0px_0px_8px_0px_rgba(242,242,242,1),inset_0px_0px_0px_1px_rgba(166,166,166,1),inset_-2px_-2px_0.5px_-2px_rgba(38,38,38,1),inset_2px_2px_0.5px_-2px_rgba(38,38,38,1),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,1)] backdrop-blur-xl no-underline text-gray-800 font-heading font-normal text-[1.0625rem] leading-[1.28] tracking-[-0.588%] transition-all duration-300 cursor-pointer border-none hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-100 focus-visible:ring-offset-2">
        <div class="w-4 h-4 bg-green-200 rounded-full flex-shrink-0 relative">
          <div class="absolute top-1 left-1 w-2 h-2 bg-green-600 rounded-full"></div>
        </div>
        <span class="whitespace-nowrap">${this.label}</span>
      </a>
    `;
  }
}