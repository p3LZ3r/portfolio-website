import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { shadowDomStyles } from "../styles/shadow-dom.css";

@customElement("about-page")
export class AboutPage extends LitElement {
  static styles = [shadowDomStyles];

  render() {
    return html`
      <div class="fixed inset-0 -z-10 bg-radial-[at_25%_25%] from-zinc-700 to-zinc-900 to-75% blur-md"></div>
      
      <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div class="bg-breathing bg-contain bg-center bg-no-repeat" style="width: min(85vw, 56rem); aspect-ratio: 4/3; background-image: url('/assets/background1.png');"></div>
      </div>

      <div class="relative flex flex-col justify-between items-center m-3 w-[calc(100vw-1.5rem)] min-h-[calc(100vh-1.5rem)] p-8 gap-12 bg-white/25 backdrop-blur-[14.4px] rounded-4xl border border-white/25 border-squircle">
        <div class="flex justify-between self-stretch gap-12 max-lg:flex-col max-lg:text-center max-lg:items-center">
          <div class="flex flex-col gap-3 w-fit max-lg:items-center">
            <!-- Default heading animation (no data-animate required) -->
            <h1 class="font-heading text-[4.6875rem] font-light text-zinc-100">Torsten Linnecke<br> Business Accelerator</h1>
            <!-- Default paragraph animation (no data-animate required) -->
            <p class="text-[1.4375rem] font-medium text-zinc-900 m-0 max-w-4xl leading-tight text-left max-lg:text-center">
              I am an industrial engineer with a passion for digital design, web development and business process automation. I have made it my mission to make business processes more efficient and increase sales.
            </p>
          </div>
          <!-- Call button with custom animation -->
          <call-button data-animate="slide-up" data-animate-delay="200"></call-button>
        </div>
        
        <!-- Animation Examples Section -->
        <div class="w-full max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
          <!-- Default heading animation (no data-animate required) -->
          <h2 class="text-2xl font-heading text-zinc-100 mb-6">Animation Examples</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Profile Image Example with fade-in+scale and custom delay -->
            <div class="flex flex-col items-center">
              <h3 class="text-lg font-medium text-zinc-200 mb-3">Profile Image (Fade + Scale)</h3>
              <div class="w-32 h-32 bg-black/20 bg-cover bg-center rounded-xl" 
                   role="img" 
                   aria-label="Profile example" 
                   style="background-image: url('../assets/about-image.png');" 
                   data-animate="zoom" 
                   data-animate-delay="300">
              </div>
            </div>
            
            <!-- Repeating Animation Example -->
            <div class="flex flex-col items-center">
              <h3 class="text-lg font-medium text-zinc-200 mb-3">Repeating Animation</h3>
              <div class="px-4 py-2 bg-blue-500/20 rounded-lg text-zinc-100"
                   data-animate="fade-in"
                   data-animate-once="false">
                This element re-animates on scroll
              </div>
            </div>
          </div>
          
          <!-- Staggered List Example -->
          <div class="mb-6">
            <h3 class="text-lg font-medium text-zinc-200 mb-3">Staggered List Animation</h3>
            <ul class="intersection-stagger-container" data-animate-stagger="80">
              <li class="p-3 bg-white/10 rounded-lg mb-2 text-zinc-100">First item (no delay)</li>
              <li class="p-3 bg-white/10 rounded-lg mb-2 text-zinc-100" data-animate-delay="150">Second item (custom delay)</li>
              <li class="p-3 bg-white/10 rounded-lg mb-2 text-zinc-100">Third item (staggered)</li>
              <li class="p-3 bg-white/10 rounded-lg text-zinc-100">Fourth item (staggered)</li>
            </ul>
          </div>
        </div>
        
        <div class="absolute bottom-8 left-8 right-8 flex items-end gap-12 justify-between w-[calc(100%-4rem)]">
          <div class="flex flex-col gap-3 text-left max-lg:text-center max-lg:items-center">
            <a href="#about" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-300 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">— About Me</a>
            <a href="#projects" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-400 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">- Projects</a>
            <a href="#contact" class="font-body font-medium text-[1.0625rem] leading-tight text-zinc-400 no-underline transition-colors duration-200 hover:text-zinc-300 whitespace-nowrap">- Contact</a>
          </div>
          
          <!-- Staggered logo animation -->
          <div class="flex items-center gap-4 px-12 justify-between w-full max-lg:justify-center intersection-stagger-container" data-animate-stagger="100">
            <img src="assets/Sparkasse_logo.svg" alt="Sparkasse logo" class="invert-50 object-cover h-14" />
            <img src="assets/Bauformat_logo.png" alt="Bauformat logo" class="invert-100 opacity-30 object-cover h-14" />
            <img src="assets/Burger_Keuchen_logo.png" alt="Burger Keuchen logo" class="invert-100 opacity-30 object-cover h-16" />
            <img src="assets/Bundesvereinigung_Lebenshilfe_logo.svg" alt="Bundesvereinigung Lebenshilfe logo" class="invert-50 object-cover h-14" />
            <img src="assets/Der_Paritaetische_Wohlfahrtsverband_logo.svg" alt="Der Paritätische Wohlfahrtsverband logo" class="invert-50 contrast-400 h-14" />
          </div>
          
          <!-- Profile image with zoom animation and custom delay -->
          <div class="w-60 h-80 bg-black/20 bg-cover bg-center rounded-2xl shrink-0" role="img" aria-label="Torsten Linnecke" style="background-image: url('../assets/about-image.png');" data-animate="zoom" data-animate-delay="400"></div>
        </div>
      </div>
    `;
  }
}