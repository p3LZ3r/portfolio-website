import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { shadowDomStyles } from "../styles/shadow-dom.css.js";

export type ProjectData = {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
};

@customElement("project-card")
export class ProjectCard extends LitElement {
  static styles = shadowDomStyles;
  @property({ type: Object }) project: ProjectData = {
    title: "Project A",
    description: "This was a super fun and enjoyable project.",
    techStack: ["SEO", "Design", "WordPress", "WooCommerce"],
    link: "#",
  };

  render() {
    return html`
      <article class="flex flex-col gap-12 w-full mb-12">
        <div class="w-full h-0 border-b border-zinc-400"></div>
        
        <div class="flex gap-12 items-stretch max-lg:flex-col max-lg:gap-8">
          <div class="flex-1 flex flex-col justify-between gap-8">
            <div class="flex flex-col gap-3">
              <h3 class="text-[clamp(1.5rem,3vw,2.8125rem)] font-light text-zinc-100 m-0">${this.project.title}</h3>
              <p class="text-[clamp(0.875rem,2vw,1.4375rem)] text-zinc-300 m-0 leading-tight">${this.project.description}</p>
            </div>
            
            <div class="flex justify-between items-end gap-3 max-lg:flex-col max-lg:items-start max-lg:gap-6">
              <div class="flex flex-col gap-2">
                ${this.project.techStack.map((tech) => html`<p class="text-[clamp(0.875rem,2vw,1.4375rem)] text-zinc-300 m-0">${tech}</p>`)}
              </div>
              
              ${
                this.project.link
                  ? html`
                <a href="${this.project.link}" class="text-[clamp(0.875rem,2vw,1.4375rem)] text-zinc-100 no-underline transition-colors duration-200 hover:text-zinc-300" aria-label="View ${this.project.title} project">
                  Go To Website →
                </a>
              `
                  : ""
              }
            </div>
          </div>
          
          <div class="shrink-0 w-100 h-62.5 bg-black/20 rounded-xl flex items-center justify-center text-zinc-400 text-base max-lg:w-full max-lg:h-52" aria-hidden="true">
            Project Image
          </div>
        </div>
      </article>
    `;
  }
}
