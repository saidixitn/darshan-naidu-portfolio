import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];

/**
 * Daksh Gajjar (https://dakshgajjar.com/) & Grace Fashion AI Kinetic Stat Counters
 * Animates numerical metrics smoothly on scroll trigger with formatting preserved.
 */
export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  const selectors = [
    "[data-counter='true']",
    ".grace-metric-number",
    ".grace-card-metric",
    ".stat-number",
  ];

  const elements = document.querySelectorAll(selectors.join(", "));

  elements.forEach((el) => {
    const rawText = el.textContent.trim();
    // Match numbers like 80, 150, 99.4, 48
    const match = rawText.match(/(\d+(?:\.\d+)?)/);
    if (!match) return;

    const targetNum = parseFloat(match[1]);
    const prefix = rawText.slice(0, match.index);
    const suffix = rawText.slice(match.index + match[0].length);
    const isDecimal = match[1].includes(".");

    const counterObj = { val: 0 };

    const anim = gsap.to(counterObj, {
      val: targetNum,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        once: true,
      },
      onUpdate: () => {
        const formatted = isDecimal ? counterObj.val.toFixed(1) : Math.round(counterObj.val);
        el.textContent = `${prefix}${formatted}${suffix}`;
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
}

export default { init, cleanup };
