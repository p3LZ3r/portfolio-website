import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("contact-page")
export class ContactPage extends LitElement {
  @state() private readonly formData = {
    name: "",
    company: "",
    email: "",
    project: "",
  };

  render() {
    return html`
      <div class="absolute inset-0 -z-10 bg-gray-800 blur-md"></div>
      
      <div class="flex flex-col items-center min-h-screen p-8 gap-12 bg-white/25 backdrop-blur-[14.4px] rounded-2xl m-3">
        <div class="flex justify-center self-stretch gap-12 max-lg:flex-col max-lg:text-center">
          <div class="flex flex-col gap-3 max-w-[54.5rem] text-center">
            <h2 class="text-[clamp(1.5rem,3vw,2.8125rem)] font-light text-gray-100 m-0">Contact</h2>
            <p class="text-[clamp(0.875rem,2vw,1.4375rem)] text-gray-300 m-0 leading-tight">For everyone with tele-phobia.</p>
          </div>
          <call-button></call-button>
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
          <button type="submit" class="self-end font-body font-medium text-[1.0625rem] leading-tight text-gray-100 bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-gray-300">Send →</button>
        </form>
        
        <div class="flex justify-between items-end self-stretch gap-12 max-lg:flex-col max-lg:items-center max-lg:gap-8">
          <div class="flex flex-col gap-3">
            <a href="#about" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-100 no-underline transition-colors duration-200 hover:text-gray-300">— About Me</a>
            <a href="#projects" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-400 no-underline transition-colors duration-200 hover:text-gray-300">- Projects</a>
            <a href="#contact" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-400 no-underline transition-colors duration-200 hover:text-gray-300">- Contact</a>
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
}
