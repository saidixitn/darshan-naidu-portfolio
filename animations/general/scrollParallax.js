import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];

export function init() {
  if (typeof window === "undefined") return;
  // Parallax is best on desktop for buttery performance
  if (window.innerWidth < 992) return;

  cleanup();

  const containers = document.querySelectorAll(
    ".intro_img_wrap, [data-project-teaser='visual-wrap'], .g_image_card_visual_wrap, .project_hero_image_wrap"
  );

  containers.forEach((container) => {
    const media = container.querySelector("img, video, .g_image_card_visual_img, .g_visual_img");
    if (!media) return;

    // Ensure container hides overflow for clean parallax window
    container.style.overflow = "hidden";

    // Set initial scale so moving up/down doesn't show edges
    gsap.set(media, { scale: 1.08, transformOrigin: "center center" });

    const st = gsap.fromTo(
      media,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }
    );

    if (st.scrollTrigger) {
      triggers.push(st.scrollTrigger);
    }
  });
}

export function cleanup() {
  triggers.forEach((st) => st.kill());
  triggers = [];
}

export default { init, cleanup };
