import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];

export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const cards = document.querySelectorAll(
    ".g_project_teaser_card, .g_project_teaser, .about_teaser_contain"
  );

  cards.forEach((card) => {
    // Check if card is already above viewport on initial load
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) return;

    const anim = gsap.fromTo(
      card,
      {
        y: 60,
        opacity: 0.15,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          end: "top 55%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      }
    );

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
