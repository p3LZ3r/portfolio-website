import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { shadowDomStyles } from "../styles/shadow-dom.css";
import { openCalModal } from "../utils/cal";

@customElement("contact-page")
export class ContactPage extends LitElement {
  static styles = [shadowDomStyles];
  @state() private readonly formData = {
    name: "",
    company: "",
    email: "",
    project: "",
  };

  render() {
    return html`
      <div class="fixed inset-0 -z-10 bg-radial-[at_25%_25%] from-zinc-700 to-zinc-900 to-75% blur-md"></div>
      
      <div class="relative flex flex-col justify-between items-center m-4 w-[calc(100vw-2rem)] min-h-[calc(100vh-2em)] p-8 gap-12 bg-white/25 backdrop-blur-[14.4px] rounded-4xl border border-white/25 border-squircle" part="view-transition-target">
        <div class="flex justify-between self-stretch gap-12 max-lg:flex-col max-lg:text-center max-lg:items-center">
          <div class="flex flex-col gap-3 text-center">
            <h1 class="font-heading text-[4.6875rem] font-light text-zinc-100">Contact</h1>
            <p class="text-[1.4375rem] font-medium text-zinc-900 m-0 max-w-4xl leading-tight text-left max-lg:text-center">For everyone with tele-phobia.</p>
          </div>
          <call-button 
            @click="${this._handleCallButtonClick}"
          ></call-button>
        </div>
        
        <form class="flex flex-col self-stretch gap-8 max-w-[37.0625rem]" @submit="${this._handleSubmit}" novalidate>
          <form-input
            class="w-full"
            placeholder="|Your name"
            .value="${this.formData.name}"
            active
            @input-change="${this._handleNameChange}"
          ></form-input>
          <form-input
            class="w-full"
            placeholder="Your company"
            .value="${this.formData.company}"
            @input-change="${this._handleCompanyChange}"
          ></form-input>
          <form-input
            class="w-full"
            placeholder="Your email"
            type="email"
            .value="${this.formData.email}"
            @input-change="${this._handleEmailChange}"
          ></form-input>
          <form-input
            class="w-full"
            placeholder="Your project"
            .value="${this.formData.project}"
            @input-change="${this._handleProjectChange}"
          ></form-input>
          <button type="submit" class="self-end font-body font-medium text-[1.0625rem] leading-tight text-zinc-100 bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-zinc-300">Send →</button>
        </form>
        
        <div class="flex justify-between items-end self-stretch gap-12 max-lg:flex-col max-lg:items-center max-lg:gap-8">
          <div class="flex flex-col gap-3 text-left max-lg:text-center max-lg:items-center">
            <a href="#about" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-400 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">- About Me</a>
            <a href="#projects" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-400 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">- Projects</a>
            <a href="#contact" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-300 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">— Contact</a>
          </div>
        </div>
      </div>
    `;
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    // Handle form submission
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

  private _handleCallButtonClick(e: Event) {
    e.preventDefault();
    
    // Open Cal.com modal with prefill data if available
    const prefill = {
      name: this.formData.name || undefined,
      email: this.formData.email || undefined,
    };
    
    openCalModal("tlinnecke/45min", {
      config: { layout: "month_view" },
      prefill
    }, "45min").catch(() => {
      // Silently handle errors to avoid breaking app
    });
  }
}