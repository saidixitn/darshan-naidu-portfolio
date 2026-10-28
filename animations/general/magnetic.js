import { gsap } from "../../vendor.js";

let boundElements = [];

export function init() {
  if (typeof window === "undefined") return;
  // Only enable on devices with fine pointer (mouse/trackpad), not touch screens
  if (!window.matchMedia("(pointer: fine)").matches) return;

  cleanup();

  const selectors = [
    ".btn_text_wrap",
    ".g_underline_button",
    "#theme-toggle",
    ".navigation_logo_link",
    ".footer_back_to_top",
    ".site_breadcrumb a",
    "[data-magnetic='true']",
    ".g_project_teaser_category_wrap",
  ];

  const elements = document.querySelectorAll(selectors.join(", "));

  elements.forEach((el) => {
    // Avoid double binding
    if (el._magneticBound) return;
    el._magneticBound = true;

    const inner = el.querySelector(".btn_text_text, .g_underline_button_text, span, a, svg") || el;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center (-1 to 1 normalized)
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Clamped magnetic movement (up to 14px for container, 7px for inner text)
      const pullFactor = 0.28;
      const moveX = Math.max(-16, Math.min(16, dx * pullFactor));
      const moveY = Math.max(-16, Math.min(16, dy * pullFactor));

      gsap.to(el, {
        x: moveX,
        y: moveY,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (inner && inner !== el) {
        gsap.to(inner, {
          x: moveX * 0.4,
          y: moveY * 0.4,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.75,
        ease: "elastic.out(1.1, 0.4)",
        overwrite: "auto",
      });

      if (inner && inner !== el) {
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      }
    };

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    boundElements.push({ el, handleMouseMove, handleMouseLeave });
  });
}

export function cleanup() {
  boundElements.forEach(({ el, handleMouseMove, handleMouseLeave }) => {
    el.removeEventListener("mousemove", handleMouseMove);
    el.removeEventListener("mouseleave", handleMouseLeave);
    el._magneticBound = false;
    gsap.set(el, { x: 0, y: 0 });
    const inner = el.querySelector(".btn_text_text, .g_underline_button_text, span, a, svg");
    if (inner) gsap.set(inner, { x: 0, y: 0 });
  });
  boundElements = [];
}

export default { init, cleanup };
