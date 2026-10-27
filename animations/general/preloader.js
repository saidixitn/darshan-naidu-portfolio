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
  if (t) {
    const e = t.querySelector("[data-preloader=logo]"),
      o = e ? e.querySelectorAll("[data-preloader=logo-char]") : [],
      a = t.querySelector("[data-preloader=text]"),
      l = t.querySelector("[data-preloader=bg]"),
      i = "coming-soon" === t.dataset.preloaderType,
      r = a ? new SplitType(a, { types: "lines" }) : { lines: [] };

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

      if (i) {
        p.to(o, { y: 0, delay: 0.5, stagger: 0.035, ease: "expo.out" }, 0)
         .fromTo(
            [r.lines, a],
            { clipPath: topClipPath, y: "100%" },
            { clipPath: fullClipPath, y: "0%", stagger: 0.1 },
            "<"
          );
      } else {
        p.to(o, { y: 0, delay: 0.5, stagger: 0.035, ease: "expo.out" }, 0)
         .fromTo(
            [r.lines, a],
            { clipPath: topClipPath, y: "100%" },
            { clipPath: fullClipPath, y: "0%", stagger: 0.1 },
            "<"
          )
         .fromTo(
            r.lines,
            { clipPath: fullClipPath, y: "0" },
            { clipPath: bottomClipPath, y: "-100%", stagger: 0.1 }
          )
         .to(
            l,
            {
              scaleY: 0,
              transformOrigin: "top",
              duration: 1.5,
              ease: "expo.inOut",
            },
            "<+50%"
          )
         .call(
            () => {
              gsap.to(".navigation_menu_wrap", {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.3,
              });
              return (function (t) {
                const e = document.querySelector("[data-navigation=logo]");
                if (!e || !t) return;
                const o = Flip.getState(t, { props: "color, width, height" });
                e.replaceWith(t);
                t.setAttribute("data-navigation", "logo");
                t.classList.toggle("is-preloader");
                return Flip.from(o, {
                  duration: 1.5,
                  toggleClass: "is-flipping",
                  ease: "expo.inOut",
                  onUpdate: () => {},
                });
              })(e);
            },
            [],
            "<"
          )
         .call(() => {
            t.classList.add("is-done");
            document.body.classList.remove("preloader-active");
            handlePageEnterAnimation(document).play();
          }, [], "<+1")
         .set(t, { display: "none", pointerEvents: "none" }, ">+0.5");
      }
    });
  } else {
    try {
      handlePageEnterAnimation(document).play();
    } catch (err) {}
  }
}

function cleanup() {
  ctx && ctx.revert();
}

export default { init, cleanup };
