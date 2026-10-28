import { gsap } from "../../vendor.js";

let grainEl = null;

/**
 * Brandon Yasin (https://brandonyasin.com/) & Atmos Gallery Analog Film Grain & Status Telemetry
 * Injects 35mm subtle noise texture and live radar indicator for high-fashion editorial feel.
 */
export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  // 1. Analog 35mm Film Grain Texture Overlay
  if (!document.getElementById("editorial-film-grain")) {
    grainEl = document.createElement("div");
    grainEl.id = "editorial-film-grain";
    grainEl.setAttribute("aria-hidden", "true");
    grainEl.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
      opacity: 0.038;
      mix-blend-mode: overlay;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    `;
    document.body.appendChild(grainEl);
  }

  // 2. Telemetry Radar Pill in Hero or Navigation
  initRadarStatus();
}

function initRadarStatus() {
  const navContain = document.querySelector(".navigation_layout");
  if (!navContain || document.getElementById("studio-radar-pill")) return;

  const pill = document.createElement("div");
  pill.id = "studio-radar-pill";
  pill.className = "studio-radar-pill";
  pill.innerHTML = `
    <span class="radar-dot"></span>
    <span class="radar-label">AVAILABLE FOR Q1 PROJECTS • IST</span>
  `;

  // Insert before menu or in center of nav
  const menuWrap = navContain.querySelector(".navigation_menu_wrap");
  if (menuWrap) {
    navContain.insertBefore(pill, menuWrap);
  }
}

export function cleanup() {
  const el = document.getElementById("editorial-film-grain");
  if (el) el.remove();
  const pill = document.getElementById("studio-radar-pill");
  if (pill) pill.remove();
}

export default { init, cleanup };
