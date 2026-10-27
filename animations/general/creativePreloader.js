import { gsap } from "../../vendor.js";
import handlePageEnterAnimation from "./handlePageEnter.js";

/**
 * Creative Minimal Typewriter & Kinetic Loading Screen for Darshan Naidu
 * Powered by GSAP 60fps Animation Engine
 */
export function initCreativePreloader() {
  console.log("--> initCreativePreloader starting...");
  const preloader = document.getElementById("portfolio-preloader");
  if (!preloader) {
    console.warn("--> portfolio-preloader element not found!");
    return;
  }
  console.log("--> portfolio-preloader element found! Starting timeline...");

  const typewriterEl = document.getElementById("typewriter-text");
  const counterEl = document.getElementById("preloader-counter");
  const progressLine = document.getElementById("preloader-progress-line");
  const subtitleEl = document.getElementById("preloader-subtitle");
  const curtainBg = preloader.querySelector(".preloader-curtain");

  const textToType = "darshan—naidu";
  const progressObj = { value: 0, charCount: 0 };

  // Lock scroll during intro
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      preloader.style.display = "none";
      try {
        handlePageEnterAnimation(document).play();
      } catch (e) {}
    },
  });

  // 1. Kinetic typewriter typing out darshan—naidu
  tl.to(
    progressObj,
    {
      charCount: textToType.length,
      duration: 0.75,
      ease: "none",
      onUpdate: () => {
        if (!typewriterEl) return;
        const count = Math.round(progressObj.charCount);
        const typed = textToType.slice(0, count);
        typewriterEl.innerHTML = typed.replace(
          "—",
          '<span style="opacity:0.4">—</span>'
        );
      },
    },
    0.2
  );

  // 2. Counter digits & progress line ticking 00% -> 100%
  tl.to(
    progressObj,
    {
      value: 100,
      duration: 1.1,
      ease: "power1.inOut",
      onUpdate: () => {
        const val = Math.round(progressObj.value);
        if (counterEl) counterEl.textContent = `${val < 10 ? "0" : ""}${val}%`;
        if (progressLine) progressLine.style.width = `${val}%`;
      },
    },
    0.1
  );

  // 3. Subtitle subtle pulse in
  if (subtitleEl) {
    tl.fromTo(
      subtitleEl,
      { opacity: 0.3, y: 10 },
      { opacity: 0.85, y: 0, duration: 0.6, ease: "power2.out" },
      0.3
    );
  }

  // 4. Brief hold at 100% then exit transition
  tl.to(
    [subtitleEl, counterEl, progressLine].filter(Boolean),
    {
      opacity: 0,
      y: -15,
      duration: 0.35,
      ease: "power2.in",
    },
    "+=0.2"
  );

  // 5. Morph upward and curtain slide
  if (typewriterEl) {
    tl.to(
      typewriterEl,
      {
        scale: 0.6,
        y: -70,
        opacity: 0,
        duration: 0.65,
        ease: "power3.inOut",
      },
      "<"
    );
  }

  if (curtainBg) {
    tl.to(
      curtainBg,
      {
        clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
        duration: 0.85,
        ease: "expo.inOut",
      },
      "<+0.1"
    );
  }

  tl.to(
    preloader,
    {
      opacity: 0,
      duration: 0.3,
      ease: "power1.out",
    },
    "-=0.2"
  );
}

export default { init: initCreativePreloader };
