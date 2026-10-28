import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];
let originalContents = new Map();

export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const selectors = [
    "[data-kinetic-scrub='true']",
    ".hero_line_paragraph",
    ".about_teaser_paragraph",
    ".g_headline_paragraph_text",
    ".footer_subheadline",
    ".intro_right_text",
  ];

  const elements = document.querySelectorAll(selectors.join(", "));

  elements.forEach((el) => {
    // Save original innerHTML so we can cleanly revert on cleanup
    if (!originalContents.has(el)) {
      originalContents.set(el, el.innerHTML);
    }

    const text = el.textContent.trim();
    if (!text) return;

    // Split text into words
    const words = text.split(/\s+/);
    el.innerHTML = words
      .map((word) => `<span class="kinetic-word" style="display:inline-block;opacity:0.2;filter:blur(3px);transform:translateY(6px);transition:color 0.2s ease;">${word}&nbsp;</span>`)
      .join("");

    const wordSpans = el.querySelectorAll(".kinetic-word");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "bottom 55%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    tl.to(wordSpans, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      stagger: 0.08,
      ease: "power2.out",
    });

    if (tl.scrollTrigger) {
      triggers.push(tl.scrollTrigger);
    }
  });
}

export function cleanup() {
  triggers.forEach((st) => st.kill());
  triggers = [];

  originalContents.forEach((html, el) => {
    if (el && el.isConnected) {
      el.innerHTML = html;
    }
  });
  originalContents.clear();
}

export default { init, cleanup };
