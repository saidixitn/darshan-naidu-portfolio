import { gsap } from "../../vendor.js";
export default class Magnetic {
  constructor(t, i = {}) {
    ((this.el = document.querySelector(t)),
      (this.options = Object.assign({ y: 0.2, x: 0.2, s: 0.2, rs: 0.7 }, i)),
      (this.y = 0),
      (this.x = 0),
      (this.width = 0),
      (this.height = 0),
      this.el.getAttribute("data-magnetic-init") ||
        (this.el.setAttribute("data-magnetic-init", "true"), this.bind()));
  }
  bind() {
    (this.el.addEventListener("mouseenter", () => {
      const t = this.el.getBoundingClientRect();
      ((this.y = t.top + window.pageYOffset),
        (this.x = t.left + window.pageXOffset),
        (this.width = t.width),
        (this.height = t.height));
    }),
      this.el.addEventListener("mousemove", (t) => {
        const i = (t.clientY - this.y - this.height / 2) * this.options.y,
          e = (t.clientX - this.x - this.width / 2) * this.options.x;
        this.move(e, i, this.options.s, "power1.out");
      }),
      this.el.addEventListener("mouseleave", () => {
        this.move(0, 0, this.options.rs, "elastic.out(1.5,0.75)");
      }));
  }
  move(t, i, e, s) {
    gsap.to(this.el, {
      y: i,
      x: t,
      force3D: !0,
      overwrite: !0,
      duration: e,
      ease: s,
    });
  }
}
