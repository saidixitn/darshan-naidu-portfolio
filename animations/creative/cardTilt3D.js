import { gsap } from "../../vendor.js";

let cleanups = [];

/**
 * Daksh Gajjar (https://dakshgajjar.com/) 3D Interactive Card Tilt & Specular Sheen
 * Adds physical 3D perspective rotation and dynamic spotlight glare to editorial cards.
 */
export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const isDesktop = window.innerWidth >= 992 && !window.matchMedia("(hover: none)").matches;
  if (!isDesktop) return;

  const cards = document.querySelectorAll(
    ".grace-card, .grace-feature-card, .grace-stage-card, .grace-lookbook-hero, .grace-craft-card"
  );

  cards.forEach((card) => {
    // Add 3D container styling if needed
    card.style.transformStyle = "preserve-3d";
    if (!card.style.perspective) {
      card.parentElement.style.perspective = "1200px";
    }

    // Create or find specular shine overlay
    let shine = card.querySelector(".card-specular-glare");
    if (!shine) {
      shine = document.createElement("div");
      shine.className = "card-specular-glare";
      shine.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        opacity: 0;
        z-index: 6;
        transition: opacity 0.3s ease;
        background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.14) 0%, transparent 65%);
      `;
      card.appendChild(shine);
    }

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1

      const rotateX = (y - 0.5) * -12; // tilt degrees
      const rotateY = (x - 0.5) * 12;

      gsap.to(card, {
        rotateX,
        rotateY,
        scale: 1.018,
        transformPerspective: 1000,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Update spotlight position on the card
      shine.style.opacity = "1";
      shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`;
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });
      shine.style.opacity = "0";
    };

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);

    cleanups.push(() => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
      if (shine && shine.parentNode) shine.remove();
    });
  });
}

export function cleanup() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}

export default { init, cleanup };
