import { isDesktop } from "../../utilities/variables.js";
import { gsap, ScrollTrigger, SplitType } from "../../vendor.js";

let ctx,
  mm = gsap.matchMedia();

function init() {
  const t = document.querySelector("[data-footer=section]");
  if (t) {
    const e = t.querySelector("[data-footer=scroll-target]"),
      o = t.querySelector("[data-footer=paragraph]");
    if (o) {
      try {
        new SplitType(o, { types: "lines" });
      } catch (err) {}
    }
    ctx = gsap.context(() => {
      mm.add(isDesktop, () => {
        if (e) {
          const tl = gsap.timeline();
          ScrollTrigger.create({
            trigger: t,
            animation: tl,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          });
          tl.from(e, { yPercent: -12, ease: "power2.out", duration: 1 });
        }
      });
    });
  }
}

function cleanup() {
  ctx && ctx.revert();
}

export default { init, cleanup };
