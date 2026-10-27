import { isDesktop } from "../../utilities/variables.js";
import { gsap, ScrollTrigger, SplitType } from "../../vendor.js";
let ctx,
  mm = gsap.matchMedia();
function init() {
  const t = document.querySelector("[data-footer=section]");
  if (t) {
    const e = t.querySelector("[data-footer=scroll-target]"),
      o =
        (t.querySelectorAll("[data-footer=element]"),
        t.querySelector("[data-footer=paragraph]"));
    new SplitType(o, { types: "lines" });
    ctx = gsap.context(() => {
      mm.add(isDesktop, () => {
        const o = gsap.timeline();
        gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });
        (ScrollTrigger.create({
          trigger: t,
          animation: o,
          start: "top bottom",
          end: "top 25%",
          scrub: !0,
        }),
          o.from(e, { yPercent: -35, ease: "power2.out", duration: 1 }));
      });
    });
  }
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
