import { gsap, ScrollTrigger } from "../../vendor.js";

let scrollTriggerInstance = null;
let proxy = { skew: 0 };

export function init() {
  if (typeof window === "undefined") return;
  // Only enable on desktop screens where smooth scrolling is active
  if (window.innerWidth < 992) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  cleanup();

  const targets = document.querySelectorAll(
    ".page_main, .g_project_teaser_card, .g_clip_images_wrap, .intro_layout"
  );
  if (!targets.length) return;

  const clamp = gsap.utils.clamp(-3, 3);

  scrollTriggerInstance = ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      // Calculate skew from scroll velocity
      const targetSkew = clamp(velocity / -350);

      // Only animate if velocity creates a meaningful skew
      if (Math.abs(targetSkew) > Math.abs(proxy.skew)) {
        proxy.skew = targetSkew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: () => {
            targets.forEach((el) => {
              gsap.set(el, {
                skewY: proxy.skew,
                transformOrigin: "center center",
                force3D: true,
              });
            });
          },
        });
      }
    },
  });
}

export function cleanup() {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
  const targets = document.querySelectorAll(
    ".page_main, .g_project_teaser_card, .g_clip_images_wrap, .intro_layout"
  );
  targets.forEach((el) => {
    gsap.set(el, { skewY: 0 });
  });
  proxy.skew = 0;
}

export default { init, cleanup };
