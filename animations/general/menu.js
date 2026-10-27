import { gsap } from "../../vendor.js";
import lenis from "../../utilities/smoothScroll.js";
import { isTablet } from "../../utilities/variables.js";
let ctx,
  mm = gsap.matchMedia();
function init() {
  const e = document.querySelector("[data-menu-mobile=section]");
  if (e) {
    const t = e.querySelectorAll("[data-menu-mobile=text]"),
      i = document.querySelector("[data-menu-mobile=menu-trigger]"),
      a = i.querySelector("[data-menu-mobile=text-trigger]"),
      r = e.querySelector("[data-menu-mobile=bg]");
    ctx = gsap.context(() => {
      mm.add(isTablet, () => {
        const n = gsap.timeline({
          paused: !0,
          defaults: { duration: 1, ease: "power3.inOut" },
        });
        (n.set(e, { display: "flex" }),
          n
            .to(
              a,
              { yPercent: -100, duration: 0.5, willChange: "transform" },
              0,
            )
            .from(
              r,
              { scaleY: 0, transformOrigin: "50% 0%", duration: 1 },
              "<+0.2",
            )
            .from(
              t,
              { yPercent: 125, stagger: 0.05, willChange: "transform" },
              "<",
            ),
          i.addEventListener("click", () => {
            (i.classList.toggle("is-active"),
              i.classList.contains("is-active")
                ? (n.timeScale(1).play(), lenis.stop())
                : (n.timeScale(1.5).reverse(), lenis.start()));
          }));
      });
    });
  }
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
