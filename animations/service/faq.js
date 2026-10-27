import { gsap, SplitType } from "../../vendor.js";
import { fullClipPath, topClipPath } from "../../utilities/variables.js";
let ctx;
function init() {
  const t = document.querySelectorAll("[data-faq=section]");
  t.length > 0 &&
    t.forEach((t) => {
      const e = t.querySelectorAll("[data-faq=item]");
      t.querySelectorAll("[data-faq=divider]");
      ctx = gsap.context(() => {
        e.forEach((t) => {
          const e = t.querySelector("[data-faq=toggle]"),
            a = t.querySelector("[data-faq=toggle-horizontal]"),
            l =
              (t.querySelector("[data-faq=toggle-vertical]"),
              t.querySelector("[data-faq=question]")),
            o = t.querySelector("[data-faq=answer]"),
            r = o.querySelectorAll("[data-faq=answer-text] *"),
            i = new SplitType(r, { types: "lines" }),
            n = gsap.timeline({
              defaults: { duration: 0.5, ease: "power2.inOut" },
              paused: !0,
            });
          (n
            .to(e, { rotate: -270 }, 0)
            .to(a, { rotate: 0, opacity: 0 }, "<")
            .to(o, { height: "auto", marginTop: "1rem" }, "<")
            .fromTo(
              i.lines,
              { clipPath: topClipPath, yPercent: 100 },
              {
                clipPath: fullClipPath,
                yPercent: 0,
                duration: 1,
                stagger: 0.025,
                ease: "power4.inOut",
              },
              "<",
            ),
            l.addEventListener("click", () => {
              (l.classList.toggle("is-open"),
                l.classList.contains("is-open") ? n.play() : n.reverse());
            }));
        });
      });
    });
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
