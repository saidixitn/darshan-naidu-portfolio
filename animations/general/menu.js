import { gsap } from "../../vendor.js";
import lenis from "../../utilities/smoothScroll.js";
import { isTablet } from "../../utilities/variables.js";

let ctx,
  mm = gsap.matchMedia(),
  timeline = null;

function init() {
  const e = document.querySelector("[data-menu-mobile=section]");
  if (!e) return;

  const t = e.querySelectorAll("[data-menu-mobile=text]"),
    i = document.querySelector("[data-menu-mobile=menu-trigger]"),
    a = i ? i.querySelector("[data-menu-mobile=text-trigger]") : null,
    r = e.querySelector("[data-menu-mobile=bg]");

  if (!i) return;

  ctx = gsap.context(() => {
    mm.add(isTablet, () => {
      timeline = gsap.timeline({
        paused: true,
        defaults: { duration: 0.8, ease: "power3.inOut" },
      });

      timeline.set(e, { display: "flex" });
      if (a) {
        timeline.to(
          a,
          { yPercent: -100, duration: 0.4, willChange: "transform" },
          0
        );
      }
      if (r) {
        timeline.from(
          r,
          { scaleY: 0, transformOrigin: "50% 0%", duration: 0.8 },
          "<+0.1"
        );
      }
      if (t.length > 0) {
        timeline.from(
          t,
          { yPercent: 125, stagger: 0.05, willChange: "transform" },
          "<+0.1"
        );
      }

      const closeMenu = () => {
        if (i.classList.contains("is-active")) {
          i.classList.remove("is-active");
          timeline.timeScale(1.6).reverse();
          try {
            lenis.start();
          } catch (err) {}
        }
      };

      const openMenu = () => {
        i.classList.add("is-active");
        timeline.timeScale(1).play();
        try {
          lenis.stop();
        } catch (err) {}
      };

      i.onclick = (evt) => {
        evt.preventDefault();
        if (i.classList.contains("is-active")) {
          closeMenu();
        } else {
          openMenu();
        }
      };

      // Close menu when clicking on any navigation link inside flyout
      e.querySelectorAll("a").forEach((link) => {
        link.onclick = () => {
          closeMenu();
        };
      });
    });
  });
}

function close() {
  const i = document.querySelector("[data-menu-mobile=menu-trigger]");
  if (i && i.classList.contains("is-active") && timeline) {
    i.classList.remove("is-active");
    timeline.timeScale(2).reverse();
    try {
      lenis.start();
    } catch (err) {}
  }
}

function cleanup() {
  ctx && ctx.revert();
}

export default { init, close, cleanup };
