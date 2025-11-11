import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { shadowDomStyles } from "../styles/shadow-dom.css";
import { openCalModal, prerenderCal } from "../utils/cal";

@customElement("call-button")
export class CallButton extends LitElement {
  static styles = shadowDomStyles;

  @property({ type: String }) label = "Call Me Maybe";
  @property({ type: String }) calLink = "tlinnecke/45min";
  @property({ type: String }) namespace = "45min";
  @property({ type: String }) layout = "month_view";
  @property({ type: Boolean }) prerender = true;

  @state() private prerenderDone = false;

  connectedCallback() {
    super.connectedCallback();

    // Add analytics event listeners
    document.addEventListener("cal:open", this.handleCalOpen as EventListener);
    document.addEventListener(
      "cal:prerender",
      this.handleCalPrerender as EventListener
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Clean up analytics event listeners
    document.removeEventListener(
      "cal:open",
      this.handleCalOpen as EventListener
    );
    document.removeEventListener(
      "cal:prerender",
      this.handleCalPrerender as EventListener
    );
  }

  private handleCalOpen(event: Event): void {
    // Analytics: track when Cal modal is opened
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.namespace === this.namespace) {
      // In a real implementation, you might send this to an analytics service
      // For now, we'll just track event silently
      const detail = customEvent.detail as { calLink: string; method: string };
      // Analytics tracking placeholder - intentionally unused but kept for future implementation
      // We access the properties to indicate they're used for analytics
      if (detail.calLink && detail.method) {
        // Analytics would be implemented here
      }
    }
  }

  private handleCalPrerender(event: Event): void {
    // Analytics: track when Cal modal is prerendered
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.namespace === this.namespace) {
      // Track prerender completion
      const detail = customEvent.detail as { calLink: string };
      // Analytics tracking placeholder - intentionally unused but kept for future implementation
      if (detail.calLink) {
        // Analytics would be implemented here
      }
      this.prerenderDone = true;
      this.requestUpdate();
    }
  }

  private handleClick(event: Event): void {
    event.preventDefault();

    // Try to open modal programmatically as fallback
    openCalModal(
      this.calLink,
      {
        config: { layout: this.layout },
      },
      this.namespace
    ).catch(() => {
      // Silently handle errors to avoid breaking app
    });
  }

  private handlePointerEnter(): void {
    // Prerender on hover if enabled and not already done
    if (this.prerender && !this.prerenderDone) {
      prerenderCal(this.calLink, {}, this.namespace).catch(() => {
        // Silently handle errors to avoid breaking app
      });
    }
  }

  render() {
    return html`
      <a 
        href="" 
        aria-label="Schedule a call with ${this.label}"  
        class="font-[heading] px-4 py-2 gap-2 bg-zinc-50/25 rounded-full shadow-[0px_1px_8px_0px_rgba(0,0,0,0.10)] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.10)] shadow-[inset_0px_0px_8px_0px_rgba(242,242,242,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(166,166,166,1.00)] shadow-[inset_-2px_-2px_0.5px_-2px_rgba(38,38,38,1.00)] shadow-[inset_2px_2px_0.5px_-2px_rgba(38,38,38,1.00)] shadow-[inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,1.00)] backdrop-blur-[6px] inline-flex justify-between items-baseline overflow-hidden"
        data-cal-link="${this.calLink}"
        data-cal-namespace="${this.namespace}"
        data-cal-config='{"layout":"${this.layout}"}'
        @click="${this.handleClick}"
        @pointerenter="${this.handlePointerEnter}"
        tabindex="0"
        role="button"
      >
        <div class="size-4 relative translate-y-0.5">
          <div class="size-4 left-0 top-0 absolute opacity-20 bg-[#cff7d3] rounded-full blur-[3px]"></div>
          <div class="size-2 left-1 top-1 absolute bg-[#14ae5c] rounded-full shadow-[inset_0px_0px_8px_0px_rgba(242,242,242,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(166,166,166,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(166,166,166,1.00)] shadow-[inset_-2px_-2px_0.5px_-2px_rgba(38,38,38,1.00)] shadow-[inset_2px_2px_0.5px_-2px_rgba(38,38,38,1.00)] shadow-[inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,1.00)]"></div>
        </div>
        <span class="justify-center text-[#2c2c2c] text-[17px] whitespace-nowrap ">${this.label}</span>
        ${
          this.prerenderDone
            ? html`
          <span class="sr-only">Booking calendar preloaded</span>
        `
            : ""
        }
      </a>
    `;
  }
}
