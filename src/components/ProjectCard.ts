import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ProjectData = {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
};

@customElement('project-card')
export class ProjectCard extends LitElement {
  @property({ type: Object }) project: ProjectData = {
    title: 'Project A',
    description: 'This was a super fun and enjoyable project.',
    techStack: ['SEO', 'Design', 'WordPress', 'WooCommerce'],
    link: '#'
  };

  render() {
    return html`
      <div class="flex flex-col gap-12 w-full mb-12">
        <div class="w-full h-0 border-b border-gray-400"></div>
        
        <div class="flex gap-12 items-stretch max-lg:flex-col max-lg:gap-8">
          <div class="flex-1 flex flex-col justify-between gap-8">
            <div class="flex flex-col gap-3">
              <h3 class="text-[clamp(1.5rem,3vw,2.8125rem)] font-light text-gray-100 m-0">${this.project.title}</h3>
              <p class="text-[clamp(0.875rem,2vw,1.4375rem)] text-gray-300 m-0 leading-tight">${this.project.description}</p>
            </div>
            
            <div class="flex justify-between items-end gap-3 max-lg:flex-col max-lg:items-start max-lg:gap-6">
              <div class="flex flex-col gap-2">
                ${this.project.techStack.map(tech => html`<p class="text-[clamp(0.875rem,2vw,1.4375rem)] text-gray-300 m-0">${tech}</p>`)}
              </div>
              
              ${this.project.link ? html`
                <a href="${this.project.link}" class="text-[clamp(0.875rem,2vw,1.4375rem)] text-gray-100 no-underline transition-colors duration-200 hover:text-gray-300" aria-label="View ${this.project.title} project">
                  Go To Website →
                </a>
              ` : ''}
            </div>
          </div>
          
          <div class="flex-shrink-0 w-[25rem] h-[15.625rem] bg-black/20 rounded-xl flex items-center justify-center text-gray-400 text-base max-lg:w-full max-lg:h-52" aria-hidden="true">
            Project Image
          </div>
        </div>
      </div>
    `;
  }
}