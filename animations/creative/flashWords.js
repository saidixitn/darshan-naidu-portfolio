import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];
let originalContents = new Map();

/**
 * Fourmula.ai (https://fourmula.ai/) Orange Flash Word Typography Reveal
 * Sequential word reveal that flashes in fiery electric orange before settling to crisp white.
 */
export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const selectors = [
    "[data-flash='true']",
    ".flash-text",
    ".hero_line_paragraph",
    ".grace-lookbook-title",
    ".whatwedo_information_headline",
    ".testimonial_headline",
  ];

  const elements = document.querySelectorAll(selectors.join(", "));

  elements.forEach((el) => {
    if (el.dataset.flashPrepared === "true") return;
    el.dataset.flashPrepared = "true";

    if (!originalContents.has(el)) {
      originalContents.set(el, el.innerHTML);
    }

    const text = el.textContent.trim();
    if (!text) return;

    const words = text.split(/\s+/);
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="flash-word" style="display:inline-block;opacity:0;transform:translateY(8px);will-change:opacity,transform,color;margin-right:0.25em;">${word}</span>`
      )
      .join("");

    const wordSpans = el.querySelectorAll(".flash-word");
    if (!wordSpans.length) return;

    const anim = gsap.to(wordSpans, {
      keyframes: [
        { opacity: 1, color: "#ff5500", y: 0, duration: 0.28, ease: "power2.out" },
        { color: "#ff9933", duration: 0.1 },
        { color: "inherit", duration: 0.25 },
      ],
      stagger: 0.06,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
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

  originalContents.forEach((html, el) => {
    if (el && el.isConnected) {
      el.innerHTML = html;
      delete el.dataset.flashPrepared;
    }
  });
  originalContents.clear();
}

export default { init, cleanup };
