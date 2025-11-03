import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import type { ProjectData } from '../components/ProjectCard.js';

@customElement('projects-page')
export class ProjectsPage extends LitElement {
  private projects: ProjectData[] = [
    {
      title: 'Project A',
      description: 'This was a super fun and enjoyable project.',
      techStack: ['SEO', 'Design', 'WordPress', 'WooCommerce'],
      link: '#'
    },
    {
      title: 'Project B',
      description: 'Another amazing project with great results.',
      techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
      link: '#'
    },
    {
      title: 'Project C',
      description: 'A challenging project that pushed boundaries.',
      techStack: ['Vue.js', 'TypeScript', 'GraphQL', 'Docker'],
      link: '#'
    }
  ];

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      width: 100vw;
      position: relative;
      container-type: inline-size;
    }

    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--color-bg-primary);
      filter: blur(6px);
      z-index: -1;
    }

    .main {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: var(--spacing-lg);
      gap: var(--spacing-xl);
      background: var(--color-bg-secondary);
      backdrop-filter: var(--shadow-backdrop);
      border-radius: var(--border-radius-lg);
      margin: var(--spacing-xs);
    }

    .top {
      display: flex;
      justify-content: center;
      align-self: stretch;
      gap: var(--spacing-xl);
    }

    .title {
      font-size: clamp(1.5rem, 3vw, 2.8125rem);
      font-weight: 200;
      color: var(--color-text-primary);
      margin: 0;
    }

    .middle {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      gap: var(--spacing-xl);
      overflow-y: auto;
      max-height: 60vh;
    }

    .projects-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      align-self: stretch;
      gap: var(--spacing-xl);
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .link {
      font-family: var(--font-family-secondary);
      font-weight: 450;
      font-size: 1.0625rem;
      line-height: 1.2;
      color: var(--color-text-primary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .link.active {
      color: var(--color-text-primary);
    }

    .link.inactive {
      color: var(--color-text-muted);
    }

    .link:hover,
    .link:focus {
      color: var(--color-text-muted);
    }

    /* Responsive adjustments */
    @container (max-width: 1024px) {
      .top {
        flex-direction: column;
        text-align: center;
      }

      .bottom {
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-lg);
      }

      .links {
        align-items: center;
      }
    }

    @container (max-width: 768px) {
      .main {
        padding: var(--spacing-md);
        margin: 0;
        border-radius: 0;
      }

      .middle {
        max-height: none;
        overflow-y: visible;
      }
    }
  `;

  render() {
    return html`
      <div class="background"></div>
      <div class="main">
        <div class="top">
          <h2 class="title">Selected Projects</h2>
          <call-button></call-button>
        </div>
        <div class="middle">
          <div class="projects-container">
            ${this.projects.map(project => html`
              <project-card .project="${project}"></project-card>
            `)}
          </div>
        </div>
        
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'projects-page': ProjectsPage;
  }
}