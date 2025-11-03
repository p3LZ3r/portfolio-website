import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("about-page")
export class AboutPage extends LitElement {
  render() {
    return html`
      <div class="fixed inset-0 -z-10 bg-gray-800 blur-md"></div>
      
      <div class="absolute top-56 left-[27rem] w-[36rem] h-[27rem] bg-cover bg-center -z-10" style="background-image: url('../assets/background1.png');"></div>

      <div class="relative flex flex-col justify-between items-center h-full w-[calc(100%-3rem)] p-8 m-3 gap-12 bg-white/25 backdrop-blur-[14.4px] rounded-2xl border border-white/25">
        <div class="flex justify-between self-stretch gap-12 max-lg:flex-col max-lg:text-center max-lg:items-center">
          <div class="flex flex-col gap-3 max-w-[54.5rem] max-lg:items-center intersection-fade-in">
            <h1 class="font-heading text-[4.6875rem] font-light text-gray-100">Torsten Linnecke Business Accelerator</h1>
            <p class="text-[1.4375rem] font-medium text-gray-900 m-0 leading-tight text-left max-lg:text-center">
              I am an industrial engineer with a passion for digital design, web development and business process automation. I have made it my mission to make business processes more efficient and increase sales.
            </p>
          </div>
          <call-button class="intersection-slide-up"></call-button>
        </div>
        
        <div class="absolute bottom-8 left-8 right-8 flex items-end gap-12 justify-between w-[calc(100%-4rem)]">
          <div class="flex flex-col gap-3 text-right max-lg:text-center max-lg:items-center">
            <a href="#about" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-400 no-underline transition-colors duration-200 text-right hover:text-gray-300">— About Me</a>
            <a href="#projects" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-400 no-underline transition-colors duration-200 text-right hover:text-gray-300">- Projects</a>
            <a href="#contact" class="font-body font-medium text-[1.0625rem] leading-tight text-gray-400 no-underline transition-colors duration-200 text-right hover:text-gray-300">- Contact</a>
          </div>
          
          <div class="flex items-center gap-10 opacity-50 px-12 justify-between w-full max-lg:justify-center">
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
            <img src="assets/logos.svg" alt="Company logos" />
          </div>
          
          <div class="w-60 h-80 bg-black/20 bg-cover bg-center rounded-2xl flex-shrink-0" role="img" aria-label="Torsten Linnecke" style="background-image: url('../assets/about-image.png');"></div>
        </div>
      </div>
    `;
  }
}

