import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface ProjectData {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
}

@customElement('project-card')
export class ProjectCard extends LitElement {
  @property({ type: Object }) project: ProjectData = {
    title: 'Project A',
    description: 'This was a super fun and enjoyable project.',
    techStack: ['SEO', 'Design', 'WordPress', 'WooCommerce'],
    link: '#'
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      margin-bottom: var(--spacing-xl);
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
      width: 100%;
    }

    .section-line {
      width: 100%;
      height: 0;
      border-bottom: 1px solid var(--color-text-muted);
    }

    .content {
      display: flex;
      gap: var(--spacing-xl);
      align-items: stretch;
    }

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: var(--spacing-lg);
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .title {
      font-size: clamp(1.5rem, 3vw, 2.8125rem);
      font-weight: 200;
      color: var(--color-text-primary);
      margin: 0;
    }

    .description {
      font-size: clamp(0.875rem, 2vw, 1.4375rem);
      color: var(--color-text-secondary);
      margin: 0;
      line-height: 1.2;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: var(--spacing-sm);
    }

    .tech-stack {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .tech-item {
      font-size: clamp(0.875rem, 2vw, 1.4375rem);
      color: var(--color-text-secondary);
      margin: 0;
    }

    .link {
      font-size: clamp(0.875rem, 2vw, 1.4375rem);
      color: var(--color-text-primary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .link:hover,
    .link:focus {
      color: var(--color-text-muted);
    }

    .right {
      flex-shrink: 0;
      width: 400px;
      height: 250px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: var(--border-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      font-size: 1rem;
    }

    /* Responsive adjustments */
    @container (max-width: 768px) {
      .content {
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .right {
        width: 100%;
        height: 200px;
      }

      .bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
      }
    }
  `;

  render() {
    return html`
      <div class="card">
        <div class="section-line"></div>
        <div class="content">
          <div class="left">
            <div class="meta">
              <h3 class="title">${this.project.title}</h3>
              <p class="description">${this.project.description}</p>
            </div>
            <div class="bottom">
              <div class="tech-stack">
                ${this.project.techStack.map(tech => html`<p class="tech-item">${tech}</p>`)}
              </div>
              ${this.project.link ? html`
                <a href="${this.project.link}" class="link" aria-label="View ${this.project.title} project">
                  Go To Website →
                </a>
              ` : ''}
            </div>
          </div>
          <div class="right" aria-hidden="true">
            Project Image
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-card': ProjectCard;
  }
}