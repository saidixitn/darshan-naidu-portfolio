import { gsap } from "../../vendor.js";

let cleanups = [];

/**
 * Fourmula.ai (https://fourmula.ai/) & CodeTV Interactive Canvas Halo
 * Tracks cursor proximity on the dot matrix canvas and projects a smooth luminescent halo.
 */
export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const isDesktop = window.innerWidth >= 992 && !window.matchMedia("(hover: none)").matches;
  if (!isDesktop) return;

  const canvasSections = document.querySelectorAll(".grace-dot-canvas, .hero_wrap");

  canvasSections.forEach((section) => {
    // Check or create luminescent halo
    let halo = section.querySelector(".canvas-interactive-halo");
    if (!halo) {
      halo = document.createElement("div");
      halo.className = "canvas-interactive-halo";
      halo.style.cssText = `
        position: absolute;
        width: 380px;
        height: 380px;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        z-index: 1;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(255, 85, 0, 0.12) 0%, rgba(255, 120, 0, 0.04) 40%, transparent 70%);
        filter: blur(20px);
        transition: opacity 0.4s ease;
      `;
      section.style.position = "relative";
      section.appendChild(halo);
    }

    const onMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      halo.style.opacity = "1";
      gsap.to(halo, {
        x,
        y,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onMouseLeave = () => {
      halo.style.opacity = "0";
    };

    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);

    cleanups.push(() => {
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
      if (halo && halo.parentNode) halo.remove();
    });
  });
}

export function cleanup() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}

export default { init, cleanup };
