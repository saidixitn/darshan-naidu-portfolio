import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];
let originalContents = new Map();

/**
 * Grace Fashion AI Scrolling Text Animation & Interactive Stage Controller
 * Replicates the signature blur-to-sharp kinetic typography scrub and lookbook switcher
 * from https://gracefashion.ai/
 */
export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  // 1. Signature Grace Fashion AI Blur-to-Sharp Kinetic Typography Scrub
  const scrubSelectors = [
    "[data-grace-scrub='true']",
    ".grace-scroll-scrub",
    ".grace-deck-headline",
    ".grace-feature-title",
    ".cta_right_headline",
    ".cta_subheadline",
    ".grace-statement-scrub",
  ];

  const scrubElements = document.querySelectorAll(scrubSelectors.join(", "));

  scrubElements.forEach((el) => {
    // Avoid re-splitting if already prepared
    if (el.dataset.gracePrepared === "true") return;
    el.dataset.gracePrepared = "true";

    if (!originalContents.has(el)) {
      originalContents.set(el, el.innerHTML);
    }

    const text = el.textContent.trim();
    if (!text) return;

    // Split text into word spans with Grace Fashion AI's exact initial state:
    // opacity: 0.1, blur(14px), translateY(12px)
    const words = text.split(/\s+/);
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="grace-scrub-word" style="display:inline-block;opacity:0.12;filter:blur(14px);transform:translateY(12px);will-change:opacity,filter,transform;transition:color 0.2s ease;">${word}&nbsp;</span>`
      )
      .join("");

    const wordSpans = el.querySelectorAll(".grace-scrub-word");
    if (!wordSpans.length) return;

    const scrubTrigger = gsap.to(wordSpans, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "bottom 35%",
        scrub: 0.65,
        invalidateOnRefresh: true,
      },
    });

    if (scrubTrigger.scrollTrigger) {
      triggers.push(scrubTrigger.scrollTrigger);
    }
  });

  // 2. Interactive Stage Card Switcher (Grace Fashion AI Shot Switcher)
  initStageSwitchers();

  // 3. Grace Fashion AI Lookbook Card Parallax & Hover Accents
  initCardInteractions();
}

/**
 * Grace Fashion AI Interactive Shot Switcher
 * Switches between shots (Reel, Cinematic, Retention Cut, Grade) smoothly with GSAP crossfade
 */
function initStageSwitchers() {
  const switchers = document.querySelectorAll("[data-grace-stage]");

  switchers.forEach((stage) => {
    const buttons = stage.querySelectorAll("[data-stage-btn]");
    const layers = stage.querySelectorAll("[data-stage-layer]");

    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = btn.dataset.stageBtn;

        // Update active button styling
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        // Crossfade layers
        layers.forEach((layer) => {
          if (layer.dataset.stageLayer === targetId) {
            layer.classList.add("is-active");
            gsap.fromTo(
              layer,
              { opacity: 0, scale: 1.04 },
              { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
            );
          } else {
            layer.classList.remove("is-active");
            gsap.to(layer, { opacity: 0, duration: 0.3, ease: "power2.in" });
          }
        });
      });
    });
  });
}

/**
 * Subtle parallax for Grace Fashion card visuals
 */
function initCardInteractions() {
  const isDesktop = window.innerWidth >= 992;
  if (!isDesktop) return;

  const cards = document.querySelectorAll(".grace-card, .grace-lookbook-card, .grace-feature-card");

  cards.forEach((card) => {
    const img = card.querySelector(".grace-card-img, img");
    if (!img) return;

    const st = gsap.fromTo(
      img,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      }
    );

    if (st.scrollTrigger) {
      triggers.push(st.scrollTrigger);
    }
  });
}

export function cleanup() {
  triggers.forEach((st) => st.kill());
  triggers = [];

  originalContents.forEach((html, el) => {
    if (el && el.isConnected) {
      el.innerHTML = html;
      delete el.dataset.gracePrepared;
    }
  });
  originalContents.clear();
}

export default { init, cleanup };
