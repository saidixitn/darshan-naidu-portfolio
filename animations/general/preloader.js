import { Flip, gsap, SplitType } from "../../vendor.js";
import lenis from "../../utilities/smoothScroll.js";
import handlePageEnterAnimation from "./handlePageEnter.js";
import {
  bottomClipPath,
  fullClipPath,
  topClipPath,
} from "../../utilities/variables.js";

let ctx;

function init() {
  const t = document.querySelector("[data-preloader=section]");
  if (!t) return;

  const e = t.querySelector("[data-preloader=logo]"),
    o = e ? e.querySelectorAll("[data-preloader=logo-char]") : [],
    a = t.querySelector("[data-preloader=text]"),
    l = t.querySelector("[data-preloader=bg]"),
    i = "coming-soon" === t.dataset.preloaderType;

  let r = null;
  if (a) {
    try {
      r = new SplitType(a, { types: "lines" });
    } catch (err) {
      console.warn("SplitType preloader error:", err);
    }
  }

  ctx = gsap.context(() => {
    const p = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.inOut",
        onStart: () => {
          try {
            lenis.stop();
          } catch (err) {}
        },
        onComplete: () => {
          try {
            lenis.start();
          } catch (err) {}
        },
      },
    });

    p.set(t, { clearProps: !0, display: "block" });

    const lines = r && r.lines && r.lines.length ? r.lines : a;

    if (i) {
      if (o.length) {
        p.fromTo(
          o,
          { yPercent: 100 },
          { yPercent: 0, delay: 0.5, stagger: 0.035, ease: "expo.out" },
          0
        );
      }
      if (lines) {
        p.fromTo(
          [lines, a],
          { clipPath: topClipPath, y: "100%" },
          { clipPath: fullClipPath, y: "0%", stagger: 0.1 },
          "<"
        );
      }
    } else {
      if (o.length) {
        p.fromTo(
          o,
          { yPercent: 100 },
          { yPercent: 0, delay: 0.5, stagger: 0.035, ease: "expo.out" },
          0
        );
      }
      if (lines) {
        p.fromTo(
          [lines, a],
          { clipPath: topClipPath, y: "100%" },
          { clipPath: fullClipPath, y: "0%", stagger: 0.1 },
          "<"
        ).fromTo(
          lines,
          { clipPath: fullClipPath, y: "0%" },
          { clipPath: bottomClipPath, y: "-100%", stagger: 0.1 }
        );
      }
      if (l) {
        p.to(
          l,
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: 1.5,
            ease: "expo.inOut",
          },
          "<+50%"
        );
      }
      if (e) {
        p.call(
          () => {
            const navLogo = document.querySelector("[data-navigation=logo]");
            if (!navLogo || !e) return;
            const state = Flip.getState(e, { props: "color, width, height" });
            navLogo.replaceWith(e);
            e.classList.toggle("is-preloader");
            Flip.from(state, {
              duration: 1.5,
              toggleClass: "is-flipping",
              ease: "expo.inOut",
            });
          },
          [],
          "<"
        );
      }
      p.call(
        () => {
          try {
            handlePageEnterAnimation(document).play();
          } catch (err) {
            console.error("Hero page enter animation error:", err);
          }
        },
        [],
        "<+1"
      );
      p.set(t, { display: "none" }, ">+0.5");
    }
  });
}

function cleanup() {
  ctx && ctx.revert();
}

export default { init, cleanup };
