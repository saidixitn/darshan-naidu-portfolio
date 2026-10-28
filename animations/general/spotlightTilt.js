import { gsap } from "../../vendor.js";

let boundCards = [];

export function init() {
  if (typeof window === "undefined") return;
  // Only enable on desktop mouse/trackpad
  if (!window.matchMedia("(pointer: fine)").matches) return;

  cleanup();

  const selectors = [
    "[data-project-teaser='teaser']",
    ".g_project_teaser_card",
    ".g_clip_images_img_wrap",
    ".intro_img_wrap",
    ".g_img_wrap.is-square",
    ".contact_item_col",
  ];

  const cards = document.querySelectorAll(selectors.join(", "));

  cards.forEach((card) => {
    if (card._tiltBound) return;
    card._tiltBound = true;

    // Ensure styling allows 3D perspective and relative positioning
    card.classList.add("has-gsap-spotlight");

    const img = card.querySelector("img, video, .g_image_card_visual_img, .g_visual_img, .g_clip_images_img");

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS spotlight variables
      card.style.setProperty("--spot-x", `${x}px`);
      card.style.setProperty("--spot-y", `${y}px`);
      card.style.setProperty("--spot-opacity", "1");

      // 3D tilt calculation (-4.5 to +4.5 deg max)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        transformOrigin: "center center",
        duration: 0.35,
        ease: "power1.out",
        overwrite: "auto",
      });

      if (img) {
        gsap.to(img, {
          scale: 1.035,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      card.style.setProperty("--spot-opacity", "0");

      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (img) {
        gsap.to(img, {
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    card.addEventListener("mousemove", handleMouseMove, { passive: true });
    card.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    boundCards.push({ card, handleMouseMove, handleMouseLeave, img });
  });
}

export function cleanup() {
  boundCards.forEach(({ card, handleMouseMove, handleMouseLeave, img }) => {
    card.removeEventListener("mousemove", handleMouseMove);
    card.removeEventListener("mouseleave", handleMouseLeave);
    card._tiltBound = false;
    card.style.removeProperty("--spot-opacity");
    card.style.removeProperty("--spot-x");
    card.style.removeProperty("--spot-y");
    gsap.set(card, { rotateX: 0, rotateY: 0 });
    if (img) gsap.set(img, { scale: 1 });
  });
  boundCards = [];
}

export default { init, cleanup };
