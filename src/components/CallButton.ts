import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('call-button')
export class CallButton extends LitElement {
  @property({ type: String }) label = 'Call Me Maybe';
  @property({ type: String }) href = 'tel:+1234567890';

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #2C2C2C;
      background: linear-gradient(135deg, rgba(140, 140, 140, 0.25), rgba(140, 140, 140, 0.25));
      border-radius: 100px;
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1), 0px 0px 2px 0px rgba(0, 0, 0, 0.1), inset 0px 0px 8px 0px rgba(242, 242, 242, 1), inset 0px 0px 0px 1px rgba(166, 166, 166, 1), inset -2px -2px 0.5px -2px rgba(38, 38, 38, 1), inset 2px 2px 0.5px -2px rgba(38, 38, 38, 1), inset 3px 3px 0.5px -3.5px rgba(255, 255, 255, 1);
      backdrop-filter: blur(12px);
      text-decoration: none;
      color: #2C2C2C;
      font-family: 'heading-Regular';
      font-weight: 400;
      font-size: 17px;
      line-height: 1.28;
      letter-spacing: -0.588%;
      transition: all var(--transition-normal);
      cursor: pointer;
      border: none;
    }

    :host(:hover) {
      transform: translateY(-1px);
      box-shadow: var(--shadow-primary), var(--shadow-inset);
    }

    :host(:focus-visible) {
      outline: 2px solid var(--color-text-primary);
      outline-offset: 2px;
    }

    .dot {
      width: 16px;
      height: 16px;
      background: #CFF7D3;
      border-radius: 50%;
      flex-shrink: 0;
      position: relative;
    }

    .dot::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      width: 8px;
      height: 8px;
      background: #14AE5C;
      border-radius: 50%;
    }

    .label {
      white-space: nowrap;
    }
  `;

  render() {
    return html`
      <a href="${this.href}" aria-label="Call ${this.label}">
        <div class="dot"></div>
        <span class="label">${this.label}</span>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'call-button': CallButton;
  }
}