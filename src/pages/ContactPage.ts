import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { shadowDomStyles } from "../styles/shadow-dom.css.js";

type ContactField = "name" | "company" | "email" | "project";

@customElement("contact-page")
export class ContactPage extends LitElement {
  static styles = [shadowDomStyles];
  @state() private formData: Record<ContactField, string> = {
    name: "",
    company: "",
    email: "",
    project: "",
  };
  @state() private errors: Partial<Record<ContactField, string>> = {};
  @state() private status: "idle" | "success" | "error" = "idle";
  @state() private statusMessage = "";

  private readonly contactEmail = "contact@torsten-linnecke.de";

  render() {
    return html`
      <div class="fixed inset-0 -z-10 bg-radial-[at_25%_25%] from-zinc-700 to-zinc-900 to-75% blur-md"></div>

      <div class="relative flex flex-col justify-between items-center m-4 w-[calc(100vw-2rem)] min-h-[calc(100vh-2em)] p-8 gap-12 bg-white/25 backdrop-blur-[14.4px] rounded-4xl border border-white/25 border-squircle" part="view-transition-target">
        <div class="flex justify-between self-stretch gap-12 max-lg:flex-col max-lg:text-center max-lg:items-center">
          <div class="flex flex-col gap-3 text-center">
            <h1 class="font-heading text-[4.6875rem] font-light text-zinc-100">Contact</h1>
            <p class="text-[1.4375rem] font-medium text-zinc-900 m-0 max-w-4xl leading-tight text-left max-lg:text-center">For everyone with tele-phobia.</p>
          </div>
          <call-button></call-button>
        </div>

        <form class="flex flex-col self-stretch gap-6 max-w-[37.0625rem]" @submit="${this._handleSubmit}" novalidate>
          <form-input
            class="w-full"
            placeholder="Your name"
            .value="${this.formData.name}"
            name="name"
            autocomplete="name"
            required
            .invalid=${Boolean(this.errors.name)}
            described-by="contact-name-error"
            @input-change="${this._handleNameChange}"
          ></form-input>
          ${this.errors.name
            ? html`<p id="contact-name-error" class="text-sm text-rose-200 m-0">${this.errors.name}</p>`
            : ""}
          <form-input
            class="w-full"
            placeholder="Your company"
            .value="${this.formData.company}"
            name="company"
            autocomplete="organization"
            .invalid=${Boolean(this.errors.company)}
            described-by="contact-company-error"
            @input-change="${this._handleCompanyChange}"
          ></form-input>
          ${this.errors.company
            ? html`<p id="contact-company-error" class="text-sm text-rose-200 m-0">${this.errors.company}</p>`
            : ""}
          <form-input
            class="w-full"
            placeholder="Your email"
            type="email"
            .value="${this.formData.email}"
            name="email"
            autocomplete="email"
            required
            .invalid=${Boolean(this.errors.email)}
            described-by="contact-email-error"
            @input-change="${this._handleEmailChange}"
          ></form-input>
          ${this.errors.email
            ? html`<p id="contact-email-error" class="text-sm text-rose-200 m-0">${this.errors.email}</p>`
            : ""}
          <form-input
            class="w-full"
            placeholder="Your project"
            .value="${this.formData.project}"
            name="project"
            autocomplete="off"
            required
            .invalid=${Boolean(this.errors.project)}
            described-by="contact-project-error"
            @input-change="${this._handleProjectChange}"
          ></form-input>
          ${this.errors.project
            ? html`<p id="contact-project-error" class="text-sm text-rose-200 m-0">${this.errors.project}</p>`
            : ""}
          <div class="flex flex-col gap-2">
            <button
              type="submit"
              class="self-end font-body font-medium text-[1.0625rem] leading-tight text-zinc-100 bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-zinc-300"
            >
              Send →
            </button>
            <p class="text-sm text-zinc-200 m-0" aria-live="polite" aria-atomic="true">${this.statusMessage}</p>
          </div>
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
    const errors = this._validate();
    if (Object.keys(errors).length > 0) {
      this.errors = errors;
      this.status = "error";
      this.statusMessage = "Please fix the highlighted fields and try again.";
      return;
    }

    this.errors = {};
    const mailtoLink = this._buildMailtoLink();
    window.open(mailtoLink, "_blank", "noopener");
    this.status = "success";
    this.statusMessage = "Thanks for the message! I'll get back to you shortly.";
    this.formData = {
      name: "",
      company: "",
      email: "",
      project: "",
    };
  }

  private _handleNameChange(e: CustomEvent) {
    this._updateField("name", e.detail.value);
  }

  private _handleCompanyChange(e: CustomEvent) {
    this._updateField("company", e.detail.value);
  }

  private _handleEmailChange(e: CustomEvent) {
    this._updateField("email", e.detail.value);
  }

  private _handleProjectChange(e: CustomEvent) {
    this._updateField("project", e.detail.value);
  }

  private _updateField(field: ContactField, value: string) {
    this.formData = { ...this.formData, [field]: value };
    if (this.errors[field]) {
      const { [field]: _removed, ...rest } = this.errors;
      this.errors = rest;
    }
    if (this.status !== "idle") {
      this.status = "idle";
      this.statusMessage = "";
    }
  }

  private _validate() {
    const errors: Partial<Record<ContactField, string>> = {};
    if (!this.formData.name.trim()) {
      errors.name = "Please let me know who I'm speaking with.";
    }
    if (!this.formData.email.trim()) {
      errors.email = "An email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email.trim())) {
      errors.email = "That doesn't look like a valid email address.";
    }
    if (!this.formData.project.trim()) {
      errors.project = "A short note about your project helps me prepare.";
    }
    if (this.formData.company && this.formData.company.length < 2) {
      errors.company = "Company names should be at least two characters.";
    }
    return errors;
  }

  private _buildMailtoLink() {
    const subject = encodeURIComponent("New project enquiry from portfolio site");
    const body = encodeURIComponent(`Name: ${this.formData.name}\nCompany: ${
      this.formData.company || "n/a"
    }\nEmail: ${this.formData.email}\n\nProject details:\n${this.formData.project}`);
    return `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;
  }
}
