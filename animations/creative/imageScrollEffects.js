import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];

export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const isDesktopScreen = window.innerWidth >= 992;

  // Target primary visual containers
  const containers = document.querySelectorAll(
    ".g_project_visual_wrap, .g_image_card_visual_wrap, .intro_img_wrap, .g_img_wrap"
  );

  containers.forEach((container) => {
    const media = container.querySelector(
      "img, video, .g_image_card_visual_img, .g_visual_img, .hero_line_img"
    );
    if (!media) return;

    // Clean subtle parallax for desktop without altering image opacity or scale
    if (isDesktopScreen) {
      const parallaxAnim = gsap.fromTo(
        media,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );

      if (parallaxAnim.scrollTrigger) {
        triggers.push(parallaxAnim.scrollTrigger);
      }
    }
  });
}

export function cleanup() {
  triggers.forEach((st) => st.kill());
  triggers = [];
}

export default { init, cleanup };
