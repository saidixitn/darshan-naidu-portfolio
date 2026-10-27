import { gsap, ScrollTrigger } from "../../vendor.js";
let ctx;
function init() {
  const t = document.querySelector("[data-navigation=wrap]");
  t &&
    (ctx = gsap.context(() => {
      const e = gsap.timeline({});
      (e.to(t, {
        "--navigation--height": "5rem",
        duration: 0.5,
        ease: "power3.inOut",
      }),
        ScrollTrigger.create({
          animation: e,
          trigger: document.body,
          start: "150 top",
          toggleActions: "play none none reverse",
        }));
    }));
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
