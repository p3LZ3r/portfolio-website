import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { shadowDomStyles } from "../styles/shadow-dom.css";

@customElement("call-button")
export class CallButton extends LitElement {
  static styles = shadowDomStyles;

  @property({ type: String }) label = "Call Me Maybe";

  render() {
    return html`
    <a 
      href="#" 
      aria-label="Call ${this.label}"  
      class="font-[heading] px-4 py-2 gap-2 bg-zinc-50/25 rounded-full shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.10)] shadow-[inset_0px_0px_8px_0px_rgba(242,242,242,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(166,166,166,1.00)] shadow-[inset_-2px_-2px_0.5px_-2px_rgba(38,38,38,1.00)] shadow-[inset_2px_2px_0.5px_-2px_rgba(38,38,38,1.00)] shadow-[inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,1.00)] backdrop-blur-[6px] inline-flex justify-between items-baseline overflow-hidden"
      data-cal-link="tlinnecke/45min"
      data-cal-namespace="45min"
      data-cal-config='{"layout":"month_view"}'
    >
      <div class="size-4 relative translate-y-0.5">
        <div class="size-4 left-0 top-0 absolute opacity-20 bg-[#cff7d3] rounded-full blur-[3px]"></div>
        <div class="size-2 left-1 top-1 absolute bg-[#14ae5c] rounded-full shadow-[inset_0px_0px_8px_0px_rgba(242,242,242,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(166,166,166,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(166,166,166,1.00)] shadow-[inset_-2px_-2px_0.5px_-2px_rgba(38,38,38,1.00)] shadow-[inset_2px_2px_0.5px_-2px_rgba(38,38,38,1.00)] shadow-[inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,1.00)]"></div>
      </div>
      <span class="justify-center text-[#2c2c2c] text-[17px] whitespace-nowrap ">${this.label}</span>
    </a>
    `;
  }
}
