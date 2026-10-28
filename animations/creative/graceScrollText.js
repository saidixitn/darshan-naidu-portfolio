import { gsap } from "../../vendor.js";

let triggers = [];
let originalContents = new Map();

/**
 * Grace Stage Switcher & Card Interactions
 * Ensures all text remains 100% visible and legible.
 */
export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  // Ensure all text elements are 100% visible
  const textElements = document.querySelectorAll(
    ".grace-deck-headline, .grace-feature-title, .grace-scroll-scrub, [data-grace-scrub]"
  );
  textElements.forEach((el) => {
    el.style.opacity = "1";
    el.style.filter = "none";
    el.style.transform = "none";
  });

  // Stage Switcher
  initStageSwitchers();
}

function initStageSwitchers() {
  const switchers = document.querySelectorAll("[data-grace-stage]");

  switchers.forEach((stage) => {
    const buttons = stage.querySelectorAll("[data-stage-btn]");
    const layers = stage.querySelectorAll("[data-stage-layer]");

    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = btn.dataset.stageBtn;

        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        layers.forEach((layer) => {
          if (layer.dataset.stageLayer === targetId) {
            layer.classList.add("is-active");
            gsap.fromTo(
              layer,
              { opacity: 0, scale: 1.02 },
              { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
            );
          } else {
            layer.classList.remove("is-active");
            gsap.to(layer, { opacity: 0, duration: 0.25, ease: "power2.in" });
          }
        });
      });
    });
  });
}

export function cleanup() {
  triggers.forEach((st) => st.kill());
  triggers = [];
}

export default { init, cleanup };
