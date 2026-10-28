import { gsap } from "../../vendor.js";

let floatingTweens = [];

export function init() {
  if (typeof document === "undefined") return;

  cleanup();

  const tags = document.querySelectorAll(
    ".live-status-pill, .g_project_teaser_category_wrap, .category, .contact_link_category"
  );

  tags.forEach((tag, idx) => {
    // Staggered sine float
    const duration = 2.8 + (idx % 4) * 0.4;
    const distance = 4 + (idx % 3) * 1.5;

    const tween = gsap.to(tag, {
      y: `+=${distance}`,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: (idx * 0.2) % 1.5,
    });

    floatingTweens.push(tween);
  });
}

export function cleanup() {
  floatingTweens.forEach((t) => t.kill());
  floatingTweens = [];
}

export default { init, cleanup };
