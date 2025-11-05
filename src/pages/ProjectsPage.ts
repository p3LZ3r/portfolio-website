import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import type { ProjectData } from "../components/ProjectCard.js";
import { shadowDomStyles } from "../styles/shadow-dom.css";

@customElement("projects-page")
export class ProjectsPage extends LitElement {
  static styles = [shadowDomStyles];
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
      <div class="fixed inset-0 -z-10 bg-radial-[at_25%_25%] from-zinc-700 to-zinc-900 to-75% blur-md"></div>
      
      <div class="relative flex flex-col justify-between items-center m-4 w-[calc(100vw-2rem)] min-h-[calc(100vh-2rem)] p-8 gap-12 bg-white/25 backdrop-blur-[14.4px] rounded-4xl border border-white/25 border-squircle">
        <div class="flex justify-between self-stretch gap-12 max-lg:flex-col max-lg:text-center max-lg:items-center">
          <h1 class="text-[clamp(1.5rem,3vw,2.8125rem)] font-light text-zinc-100 m-0">Selected Projects</h1>
          <call-button></call-button>
        </div>
        
        <div class="relative flex flex-col self-stretch overflow-y-auto max-h-[60vh] max-lg:max-h-none max-lg:overflow-visible scrollbar scrollbar-thumb-zinc-100 scrollbar-track-transparent">
          <ul class="relative flex flex-col list-none p-0 m-0">
            <li class="list-none sticky top-0 pointer-events-none z-50">
              <div class="w-full pointer-events-none">
                <div class="shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                  <hr class="h-px border-t-0 bg-transparent bg-linear-to-r from-transparent via-gray-400 to-transparent opacity-50">
                </div>
              </div>
            </li>
            ${this.projects.map(
              (project) => html`
              <li class="list-none">
                <project-card .project="${project}"></project-card>
              </li>
            `
            )}
            <li class="list-none sticky bottom-0 pointer-events-none z-50">
              <div class="w-full pointer-events-none">
                <div class="shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                  <hr class="h-px border-t-0 bg-transparent bg-linear-to-r from-transparent via-gray-400 to-transparent opacity-50">
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <div class="flex justify-between items-end self-stretch gap-12 max-lg:flex-col max-lg:items-center max-lg:gap-8">
          <div class="flex flex-col gap-3 text-left max-lg:text-center max-lg:items-center">
            <a href="#about" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-400 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">- About Me</a>
            <a href="#projects" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-300 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">— Projects</a>
            <a href="#contact" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-400 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">- Contact</a>
          </div>
        </div>
      </div>
    `;
  }
}
