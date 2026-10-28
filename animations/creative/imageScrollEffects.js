import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];

export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const isDesktopScreen = window.innerWidth >= 992;

  // Target primary visual containers (avoid nested containers or absolute overlays)
  const containers = document.querySelectorAll(
    ".g_project_visual_wrap, .g_image_card_visual_wrap, .intro_img_wrap, .g_img_wrap"
  );

  containers.forEach((container) => {
    const media = container.querySelector(
      "img, video, .g_image_card_visual_img, .g_visual_img, .hero_line_img"
    );
    if (!media) return;

    // Ensure container has clean clipping
    container.style.overflow = "hidden";
    if (window.getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    // Check if container is already in the viewport on initial load
    const rect = container.getBoundingClientRect();
    const isAboveFold = rect.top < window.innerHeight * 0.75;

    if (!isAboveFold) {
      // 1. Cinematic Curtain / Zoom Reveal on Viewport Enter
      gsap.set(media, {
        scale: 1.15,
        filter: "brightness(0.92)",
        transformOrigin: "center center",
      });

      const revealAnim = gsap.to(media, {
        scale: 1.0,
        filter: "brightness(1)",
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 88%",
          end: "top 40%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });

      if (revealAnim.scrollTrigger) {
        triggers.push(revealAnim.scrollTrigger);
      }
    }

    // 2. Smooth Continuous Scroll Parallax on Desktop
    if (isDesktopScreen) {
      const parallaxAnim = gsap.fromTo(
        media,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.75,
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
