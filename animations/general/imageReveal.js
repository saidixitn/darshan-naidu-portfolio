import { isDesktop } from "../../utilities/variables.js";
import { gsap, ScrollTrigger } from "../../vendor.js";
let ctx,
  mm = gsap.matchMedia();
function init() {
  const t = document.querySelectorAll("img"),
    e = document.querySelectorAll("[data-avoid-img=children]"),
    o = document.querySelectorAll("[data-avoid-img=image]");
  mm.add(isDesktop, () => {
    t.forEach((t) => {
      let i = !1;
      e.forEach((e) => {
        e.contains(t) && (i = !0);
      });
      let n = !1;
      if (
        (o.forEach((e) => {
          e === t && (n = !0);
        }),
        i || n)
      )
        return;
      t.getBoundingClientRect().top > window.innerHeight &&
        (ctx = gsap.context(() => {
          const e = gsap.timeline({
            defaults: { duration: 1, ease: "power2.out" },
          });
          (e.from(t, { y: "5rem", opacity: 0 }, "<"),
            ScrollTrigger.create({
              animation: e,
              trigger: t,
              start: "top 75%",
              end: "bottom top",
              toggleActions: "play none none none",
            }));
        }));
    });
  });
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
