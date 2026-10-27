import { gsap } from "../../vendor.js";
const pointerCollection =
  "a,input,textarea,button,.menu-trigger,[data-cursor=trigger]";
export default class Cursor {
  constructor(e) {
    ((this.options = Object.assign(
      { container: "body", speed: 0.7, ease: "expo.out", visibleTimeout: 300 },
      e,
    )),
      (this.body = document.querySelector(this.options.container)),
      (this.el = document.createElement("div")),
      (this.el.className = "cb-cursor"),
      (this.text = document.createElement("div")),
      (this.text.className = "cb-cursor-text"),
      this.init());
  }
  init() {
    (this.el.appendChild(this.text),
      this.body.appendChild(this.el),
      this.bind(),
      this.move(-window.innerWidth, -window.innerHeight, 0));
  }
  bind() {
    const e = this;
    (this.body.addEventListener("mouseleave", () => {
      e.hide();
    }),
      this.body.addEventListener("mouseenter", () => {
        e.show();
      }),
      this.body.addEventListener("mousemove", (e) => {
        ((this.pos = {
          x: this.stick
            ? this.stick.x - 0.15 * (this.stick.x - e.clientX)
            : e.clientX,
          y: this.stick
            ? this.stick.y - 0.15 * (this.stick.y - e.clientY)
            : e.clientY,
        }),
          this.update());
      }),
      this.body.addEventListener("mousedown", () => {
        e.setState("-active");
      }),
      this.body.addEventListener("mouseup", () => {
        e.removeState("-active");
      }),
      this.body.querySelectorAll("[data-cursor=arrow-right]").forEach((t) => {
        (t.addEventListener("mouseenter", () => {
          e.setState("-arrow-right");
        }),
          t.addEventListener("mouseleave", () => {
            e.removeState("-arrow-right");
          }));
      }),
      this.body.querySelectorAll("[data-cursor=arrow-left]").forEach((t) => {
        (t.addEventListener("mouseenter", () => {
          e.setState("-arrow-left");
        }),
          t.addEventListener("mouseleave", () => {
            e.removeState("-arrow-left");
          }));
      }),
      this.body.querySelectorAll("[data-cursor=white]").forEach((t) => {
        (t.addEventListener("mouseenter", () => {
          e.setState("-white");
        }),
          t.addEventListener("mouseleave", () => {
            e.removeState("-white");
          }));
      }),
      this.body.querySelectorAll(pointerCollection).forEach((t) => {
        (t.addEventListener("mouseenter", () => {
          e.setState("-pointer");
        }),
          t.addEventListener("mouseleave", () => {
            e.removeState("-pointer");
          }));
      }),
      this.body.querySelectorAll("iframe").forEach((t) => {
        (t.addEventListener("mouseenter", () => {
          e.hide();
        }),
          t.addEventListener("mouseleave", () => {
            e.show();
          }));
      }),
      this.body.querySelectorAll("[data-cursor]").forEach((t) => {
        (t.addEventListener("mouseenter", function () {
          e.setState(this.dataset.cursor);
        }),
          t.addEventListener("mouseleave", function () {
            e.removeState(this.dataset.cursor);
          }));
      }),
      this.body.querySelectorAll("[data-cursor-text]").forEach((t) => {
        (t.addEventListener("mouseenter", function () {
          e.setText(this.dataset.cursorText);
        }),
          t.addEventListener("mouseleave", function () {
            e.removeText();
          }));
      }),
      this.body.querySelectorAll("[data-cursor-stick]").forEach((t) => {
        (t.addEventListener("mouseenter", function () {
          e.setStick(this.dataset.cursorStick);
        }),
          t.addEventListener("mouseleave", function () {
            e.removeStick();
          }));
      }));
  }
  setState(e) {
    this.el.classList.add(e);
  }
  removeState(e) {
    this.el.classList.remove(e);
  }
  toggleState(e) {
    this.el.classList.toggle(e);
  }
  setText(e) {
    ((this.text.innerHTML = e), this.el.classList.add("-text"));
  }
  removeText() {
    this.el.classList.remove("-text");
  }
  setStick(e) {
    const t = document.querySelector(e),
      s = t.getBoundingClientRect();
    ((this.stick = {
      y: s.top + t.offsetHeight / 2,
      x: s.left + t.offsetWidth / 2,
    }),
      this.move(this.stick.x, this.stick.y, 5));
  }
  removeStick() {
    this.stick = !1;
  }
  update() {
    (this.move(), this.show());
  }
  move(e, t, s) {
    gsap.to(this.el, {
      x: e || this.pos.x,
      y: t || this.pos.y,
      force3D: !0,
      overwrite: !0,
      ease: this.options.ease,
      duration: this.visible ? s || this.options.speed : 0,
    });
  }
  show() {
    this.visible ||
      (clearTimeout(this.visibleInt),
      this.el.classList.add("-visible"),
      (this.visibleInt = setTimeout(() => (this.visible = !0), 0)));
  }
  hide() {
    (clearTimeout(this.visibleInt),
      this.el.classList.remove("-visible"),
      (this.visibleInt = setTimeout(
        () => (this.visible = !1),
        this.options.visibleTimeout,
      )));
  }
}
