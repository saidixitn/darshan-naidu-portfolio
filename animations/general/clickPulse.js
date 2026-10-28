import { gsap } from "../../vendor.js";

let isListening = false;

function handleClick(e) {
  // Only trigger on interactive targets (buttons, links, cards, tabs)
  const target = e.target.closest("a, button, .g_project_teaser_card, .g_clip_images_img_wrap, #theme-toggle");
  if (!target) return;

  const ripple = document.createElement("span");
  ripple.className = "gsap-click-ripple";
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);

  gsap.fromTo(
    ripple,
    {
      scale: 0.2,
      opacity: 0.7,
      boxShadow: "0 0 10px rgba(255, 85, 0, 0.8)",
    },
    {
      scale: 2.2,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        ripple.remove();
      },
    }
  );
}

export function init() {
  if (typeof document === "undefined") return;
  if (isListening) return;
  isListening = true;
  document.addEventListener("pointerdown", handleClick, { passive: true });
}

export function cleanup() {
  if (!isListening) return;
  isListening = false;
  document.removeEventListener("pointerdown", handleClick);
}

export default { init, cleanup };
