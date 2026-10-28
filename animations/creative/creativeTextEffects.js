import { gsap, ScrollTrigger } from "../../vendor.js";

let triggers = [];

export function init() {
  if (typeof window === "undefined") return;

  cleanup();

  // 1. Headline Mask Reveal on Scroll
  const headlines = document.querySelectorAll(
    ".about_teaser_headline, .footer_headline, .g_headline_text_headline, .left_right_left_text, [data-text-reveal='true']"
  );

  headlines.forEach((heading) => {
    // Skip if already in viewport on boot
    const rect = heading.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) return;

    heading.style.willChange = "transform, opacity";

    const anim = gsap.fromTo(
      heading,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 88%",
          end: "top 50%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      }
    );

    if (anim.scrollTrigger) {
      triggers.push(anim.scrollTrigger);
    }
  });

  // 2. Section Dividers Drawing In On Scroll
  const dividers = document.querySelectorAll(
    ".divider_line, .footer_top_row, .left_right_left_text"
  );

  dividers.forEach((div) => {
    const anim = gsap.fromTo(
      div,
      {
        opacity: 0.4,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: div,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      }
    );

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
