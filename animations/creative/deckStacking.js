import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];

/**
 * Made with GSAP (https://madewithgsap.com/) & Fourmula.ai Physical Card Stacking
 * Cards gently scale down and dim as subsequent cards scroll over them like physical editorial cards.
 */
export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const isDesktop = window.innerWidth >= 992;
  if (!isDesktop) return;

  const cards = document.querySelectorAll(
    ".grace-lookbook-duo .grace-card, .grace-craft-card, [data-stack-card='true']"
  );

  cards.forEach((card, index) => {
    const cardFrame = card.querySelector(".grace-card-frame") || card;

    const anim = gsap.to(cardFrame, {
      scale: 0.96,
      filter: "brightness(0.9)",
      ease: "power1.out",
      scrollTrigger: {
        trigger: card,
        start: "top 25%",
        end: "bottom top",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    if (anim.scrollTrigger) {
      triggers.push(anim.scrollTrigger);
    }
  });
}

export function cleanup() {
  triggers.forEach((st) => st.kill());
  triggers = [];
}

export default { init, cleanup };
