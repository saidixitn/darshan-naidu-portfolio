import { gsap } from "../../vendor.js";
let ctx;
function init() {
  ctx = gsap.context(() => {
    document.querySelectorAll("[data-word-swap=wrap]").forEach((t) => {
      const e = t.querySelectorAll("[data-word-swap=word]");
      gsap.set(e, { y: (t) => (0 === t ? "0%" : "100%") });
      const o = gsap.timeline({
        defaults: { duration: 0.5, ease: "power2.out" },
        repeat: -1,
        repeatDelay: 0,
      });
      e.forEach((t, a) => {
        (0 !== a && o.to(t, { y: "0%" }, 0.5 * a),
          o.to(
            t,
            {
              y: "-100%",
              onComplete: () => {
                gsap.set(t, { y: "100%" });
              },
            },
            0.5 * (a + 1),
          ),
          a === e.length - 1 && o.to(e[0], { y: "0%" }, "<"));
      });
    });
  });
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
