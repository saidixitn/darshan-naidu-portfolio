import { isDesktop } from "../../utilities/variables.js";
import { gsap } from "../../vendor.js";
let ctx,
  mm = gsap.matchMedia();
function init() {
  const e = document.querySelectorAll("[data-project-teaser=teaser]");
  mm.add(isDesktop, () => {
    e.length > 0 &&
      (ctx = gsap.context((t) => {
        e.forEach((e) => {
          const t = e.querySelector("[data-project-teaser=gif]"),
            a =
              (e.querySelector("[data-project-teaser=visual]").children,
              gsap.timeline({
                defaults: { duration: 0.25, ease: "power4.inOut" },
                paused: !0,
              }));
          (a.to(t, { opacity: 1 }, 0),
            e.addEventListener("mouseenter", () => {
              a.play();
            }),
            e.addEventListener("mouseleave", () => {
              a.reverse();
            }));
        });
      }));
  });
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
