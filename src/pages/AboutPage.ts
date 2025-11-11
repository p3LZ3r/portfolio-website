import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { shadowDomStyles } from "../styles/shadow-dom.css.js";

@customElement("about-page")
export class AboutPage extends LitElement {
  static styles = [shadowDomStyles];

  render() {
    return html`
      <div class="fixed inset-0 -z-10 bg-radial-[at_25%_25%] from-zinc-700 to-zinc-900 to-75% blur-md"></div>
      
      <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div class="bg-contain bg-center bg-no-repeat" style="width: min(85vw, 56rem); aspect-ratio: 4/3; background-image: url('/assets/background1.png');"></div>
      </div>

      <div class="relative flex flex-col justify-between items-center m-4 w-[calc(100vw-2rem)] min-h-[calc(100vh-2rem)] p-8 gap-24 bg-white/25 backdrop-blur-[14.4px] rounded-4xl border border-white/25 border-squircle" part="view-transition-target">
        <div class="flex justify-between self-stretch gap-12 max-lg:flex-col max-lg:text-center max-lg:items-center">
          <div class="flex flex-col gap-3 w-fit max-lg:items-center">

            <h1 class="font-heading text-[4.6875rem] text-zinc-100">Torsten Linnecke<br> Business Accelerator</h1>

            <p class="text-[1.4375rem] font-medium text-zinc-900 max-w-4xl leading-tight text-left max-lg:text-center">
              I am an industrial engineer with a passion for digital design, web development and business process automation. I have made it my mission to make business processes more efficient and increase sales.
            </p>
          </div>
          <!-- Call button-->
          <call-button></call-button>
        </div>
        
        <div class="absolute bottom-8 left-8 right-8 flex items-end gap-24 justify-between w-[calc(100%-4rem)]">
          <div class="flex flex-col gap-3 text-left max-lg:text-center max-lg:items-center">
            <a href="#about" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-300 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">— About Me</a>
            <a href="#projects" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-400 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">- Projects</a>
            <a href="#contact" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-400 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">- Contact</a>
          </div>
          
          <div class="flex items-center gap-4 justify-between w-full max-lg:justify-center">
            <img src="assets/Sparkasse_logo.svg" alt="Sparkasse Logo" class="invert-50 object-cover h-14" />
            <img src="assets/Bauformat_logo.png" alt="Bauformat Logo" class="invert-100 opacity-30 object-cover h-14" />
            <img src="assets/Burger_Keuchen_logo.png" alt="Burger Kuechen Logo" class="invert-150 object-cover w-16 h-16 opacity-30" />
            <img src="assets/Bundesvereinigung_Lebenshilfe_logo.svg" alt="Bundesvereinigung Lebenshilfe Logo" class="invert-50 object-cover h-14" />
            <img src="assets/Der_Paritaetische_Wohlfahrtsverband_logo.svg" alt="Der Paritaetische Wohlfahrtsverband Logo" class="invert-50 contrast-400 h-14" />
          </div>
          
          <div class="w-60 h-80 bg-black/20 bg-cover bg-center rounded-2xl shrink-0" role="img" aria-label="Torsten Linnecke" style="background-image: url('../assets/about-image.png');"></div>
        </div>
      </div>
    `;
  }
}
