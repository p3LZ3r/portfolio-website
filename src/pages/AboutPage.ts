import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("about-page")
export class AboutPage extends LitElement {
  static styles = css`
    .background {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #2C2C2C;
      filter: blur(6px);
      z-index: -1;
    }

    .main {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      width: calc(100% - 48px);
      padding: 32px;
      margin: 12px;
      gap: 48px;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(14.4px);
      border-radius: 24px;
      border
      margin: 12px;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .background-image {
      position: absolute;
      top: 232px;
      left: 431px;
      width: 579px;
      height: 437px;
      background-image: url('../assets/background1.png');
      background-size: cover;
      background-position: center;
      z-index: 1;
    }

    .top {
      display: flex;
      justify-content: space-between;
      align-self: stretch;
      gap: var(--spacing-xl);
    }

    .header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      max-width: 872px;
    }

    .title {
      font-family: var(--font-family-primary);
      font-size: 75px;
      font-weight: 200;
      color: #F5F5F5;
    }

    .bio {
      font-size: 23px;
      font-weight: 375;
      color: #1E1E1E;
      margin: 0;
      line-height: 1.2;
      text-align: left;
    }

    .bottom {
      position: absolute;
      bottom: 32px;
      left: 32px;
      right: 32px;
      display: flex;
      align-items: flex-end;
      gap: 48px;
      justify-content: space-between;
      width: calc(100% - 64px);
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      text-align: right;
    }

    .link {
      font-family: 'body-Variable';
      font-weight: 450;
      font-size: 17px;
      line-height: 1.2;
      color: #B3B3B3;
      text-decoration: none;
      transition: color var(--transition-fast);
      text-align: right;
    }

    .link.active {
      color: #F3F3F3;
    }

    .link.inactive {
      color: #B3B3B3;
    }

    .link:hover,
    .link:focus {
      color: var(--color-text-muted);
    }

    .logos {
      display: flex;
      align-items: center;
      gap: 40px;
      opacity: 0.5;
      padding: 0 48px;
      justify-content: space-between;
      width: 100%;
    }

    .image {
      width: 240px;
      height: 320px;
      background: rgba(0, 0, 0, 0.2);
      background-image: url('../assets/about-image.png');
      background-size: cover;
      background-position: center;
      border-radius: 16px;
      flex-shrink: 0;
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .top {
        flex-direction: column;
        text-align: center;
      }

      .header {
        align-items: center;
      }

      .bottom {
        flex-direction: column;
        align-items: center;
        gap: 32px;
      }

      .links {
        align-items: center;
      }
    }

    @media (max-width: 768px) {
      .main {
        padding: var(--spacing-md);
        margin: 0;
  
        border-radius: 0;
      }

      .image {
        width: 200px;
        height: 267px;
      }
    }
  `;

  render() {
    return html`
      <div class="background">        </div>

      <div class="background-image">        </div>

      <div class="main">
        <div class="top">
          <div class="header intersection-fade-in">
            <h1 class="title">Torsten Linnecke Business Accelerator</h1>
            <p class="bio">
              I am an industrial engineer with a passion for digital design, web development and business process automation. I have made it my mission to make business processes more efficient and increase sales.
            </p>
          </div>
          <call-button class="intersection-slide-up"></call-button>
        </div>
        <div class="bottom">
          <div class="links">
            <a href="#about" class="link active">— About Me</a>
            <a href="#projects" class="link inactive">- Projects</a>
            <a href="#contact" class="link inactive">- Contact</a>
          </div>
          <div class="logos">
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
          </div>
          <div class="image" role="img" aria-label="Torsten Linnecke"></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "about-page": AboutPage;
  }
}
