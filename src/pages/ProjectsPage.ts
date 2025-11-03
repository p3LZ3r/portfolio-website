import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import type { ProjectData } from "../components/ProjectCard.js";

@customElement("projects-page")
export class ProjectsPage extends LitElement {
  private readonly projects: ProjectData[] = [
    {
      title: "Project A",
      description: "This was a super fun and enjoyable project.",
      techStack: ["SEO", "Design", "WordPress", "WooCommerce"],
      link: "#",
    },
    {
      title: "Project B",
      description: "Another amazing project with great results.",
      techStack: ["React", "Node.js", "MongoDB", "AWS"],
      link: "#",
    },
    {
      title: "Project C",
      description: "A challenging project that pushed boundaries.",
      techStack: ["Vue.js", "TypeScript", "GraphQL", "Docker"],
      link: "#",
    },
  ];

  render() {
    return html`
      <div class="absolute inset-0 -z-10 bg-gray-800 blur-md"></div>
      
      <div class="flex flex-col items-center min-h-screen p-8 gap-12 bg-white/25 backdrop-blur-[14.4px] rounded-2xl m-3">
        <div class="flex justify-center self-stretch gap-12 max-lg:flex-col max-lg:text-center">
          <h2 class="text-[clamp(1.5rem,3vw,2.8125rem)] font-light text-gray-100 m-0">Selected Projects</h2>
          <call-button></call-button>
        </div>
        
        <div class="flex flex-col self-stretch gap-12 overflow-y-auto max-h-[60vh] max-lg:max-h-none max-lg:overflow-visible">
          <div class="flex flex-col gap-12">
            ${this.projects.map(
              (project) => html`
              <project-card .project="${project}"></project-card>
            `
            )}
          </div>
        </div>
        
        <div class="flex justify-between items-end self-stretch gap-12 max-lg:flex-col max-lg:items-center max-lg:gap-8">
          <div class="flex flex-col gap-3">
            <a href="#about" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-400 no-underline transition-colors duration-200 hover:text-gray-300">— About Me</a>
            <a href="#projects" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-100 no-underline transition-colors duration-200 hover:text-gray-300">- Projects</a>
            <a href="#contact" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-400 no-underline transition-colors duration-200 hover:text-gray-300">- Contact</a>
          </div>
        </div>
      </div>
    `;
  }
}
