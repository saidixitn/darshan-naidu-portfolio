import { gsap, ScrollTrigger, SplitType } from "../../vendor.js";
import {
  centerHalfClipPath,
  centerHorizontalClipPath,
  fullClipPath,
  isDesktop,
  isTablet,
  topClipPath,
} from "../../utilities/variables.js";
import { unwrapAndPreserveClasses } from "../../utilities/helper.js";
let ctx;
gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();
function init() {
  ctx = gsap.context(() => {
    document.querySelectorAll("[data-scroll-text=section]").forEach((e) => {
      const t = e.dataset.scrollType,
        l = e.querySelectorAll("[data-scroll-text=headline]"),
        o = e.querySelectorAll("[data-scroll-text=text]"),
        r = e.querySelectorAll("[data-scroll-text=divider]"),
        a = e.querySelectorAll("[data-scroll-text=rich-text]"),
        i = e.querySelectorAll("[data-scroll-text=color]"),
        n = gsap.timeline();
      ("scrub" === t
        ? ScrollTrigger.create({
            trigger: e,
            animation: n,
            start: "top 75%",
            end: "bottom center",
            scrub: !0,
          })
        : ScrollTrigger.create({
            trigger: e,
            animation: n,
            start: "top bottom",
            end: "top 75%",
            toggleActions: "none play none none",
          }),
        l &&
          l.length > 0 &&
          l.forEach((e) => {
            unwrapAndPreserveClasses(e);
            const t = new SplitType(e, { types: "lines" }),
              l = e.dataset.delay || 0,
              o = e.dataset.duration || 1;
            mm.add(isDesktop, () => {
              n.fromTo(
                t.lines,
                { clipPath: topClipPath, y: 50 },
                {
                  clipPath: fullClipPath,
                  y: 0,
                  duration: o,
                  delay: l,
                  stagger: 0.1,
                  ease: "power3.out",
                },
                "<+0.05",
              );
            });
          }),
        o &&
          o.length > 0 &&
          o.forEach((e) => {
            const t = e.dataset.delay || 0,
              l = e.dataset.duration || 1;
            unwrapAndPreserveClasses(e);
            const o = new SplitType(e, { types: "lines" });
            mm.add(isDesktop, () => {
              n.fromTo(
                o.lines,
                { clipPath: topClipPath, y: 25 },
                {
                  clipPath: fullClipPath,
                  y: 0,
                  duration: l,
                  delay: t,
                  stagger: 0.05,
                  ease: "expo.out",
                },
                "<+0.05",
              );
            });
          }),
        a &&
          a.length > 0 &&
          a.forEach((e) => {
            const t = e.children,
              l = e.dataset.delay || 0,
              o = e.dataset.duration || 1,
              r = e.querySelectorAll("ol, ul");
            if (r.length > 0) {
              r.forEach((e) => {
                n.fromTo(
                  e,
                  { opacity: 0, y: 25 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: o,
                    delay: l,
                    ease: "expo.out",
                    onComplete: () => {
                      (e.querySelectorAll("li").forEach((e) => {
                        if (
                          ((e.style.display = "list-item"),
                          e.querySelector(".line"))
                        ) {
                          const t = e.querySelector(".line");
                          for (; t.firstChild;) e.appendChild(t.firstChild);
                          t.remove();
                        }
                      }),
                        ScrollTrigger.refresh());
                    },
                  },
                  "<+0.05",
                );
                const t = Array.from(e.querySelectorAll("li"));
                t.length > 0 &&
                  n.fromTo(
                    t,
                    { x: -10, opacity: 0.5 },
                    {
                      x: 0,
                      opacity: 1,
                      stagger: 0.05,
                      duration: 0.5 * o,
                      ease: "power2.out",
                      onStart: () => {
                        t.forEach((e) => {
                          e.style.display = "list-item";
                        });
                      },
                    },
                    "<+0.1",
                  );
              });
              const a = Array.from(t).filter(
                (e) => !e.matches("ol, ul") && !e.querySelector("ol, ul"),
              );
              if (a.length > 0) {
                (unwrapAndPreserveClasses(e),
                  e.querySelectorAll(".line").forEach((e) => {
                    const t = Array.from(e.childNodes);
                    for (let l = 0; l < t.length - 1; l++) {
                      const o = t[l],
                        r = t[l + 1];
                      o.nodeType !== Node.ELEMENT_NODE ||
                        r.nodeType !== Node.ELEMENT_NODE ||
                        (o.nextSibling &&
                          o.nextSibling.nodeType === Node.TEXT_NODE) ||
                        e.insertBefore(document.createTextNode(" "), r);
                    }
                  }));
                const t = new SplitType(a, { types: "lines" });
                mm.add(isDesktop, () => {
                  n.fromTo(
                    t.lines,
                    { clipPath: topClipPath, y: 25 },
                    {
                      clipPath: fullClipPath,
                      y: 0,
                      duration: o,
                      delay: l,
                      stagger: 0.05,
                      ease: "expo.out",
                      onComplete: () => {
                        (e.querySelectorAll(".line").forEach((e) => {
                          const t = e.querySelectorAll(
                            "strong, em, a, b, i, u, span",
                          );
                          for (let l = 0; l < t.length - 1; l++) {
                            const o = t[l],
                              r = t[l + 1];
                            (o.nextSibling !== r ||
                              (o.nextSibling === r &&
                                !Array.from(
                                  o.nextSibling.previousSibling.nodeType ===
                                    Node.TEXT_NODE,
                                ))) &&
                              e.insertBefore(document.createTextNode(" "), r);
                          }
                        }),
                          ScrollTrigger.refresh());
                      },
                    },
                    "<+0.05",
                  );
                });
              }
            } else {
              (unwrapAndPreserveClasses(e),
                e
                  .querySelectorAll("strong, em, a, b, i, u, span")
                  .forEach((e) => {
                    e.nextElementSibling &&
                      !e.nextSibling.nodeType === Node.TEXT_NODE &&
                      e.after(document.createTextNode(" "));
                  }));
              const r = new SplitType(t, { types: "lines" });
              mm.add(isDesktop, () => {
                n.fromTo(
                  r.lines,
                  { clipPath: topClipPath, y: 25 },
                  {
                    clipPath: fullClipPath,
                    y: 0,
                    duration: o,
                    delay: l,
                    stagger: 0.05,
                    ease: "expo.out",
                    onComplete: () => {
                      (e.querySelectorAll(".line").forEach((e) => {
                        const t = e.querySelectorAll(
                          "strong, em, a, b, i, u, span",
                        );
                        Array.from(t).forEach((e, l) => {
                          if (l < t.length - 1) {
                            const o = t[l + 1];
                            e.nextElementSibling !== o ||
                              Array.from(e.childNodes).some(
                                (e) =>
                                  e.nodeType === Node.TEXT_NODE &&
                                  "" === e.textContent.trim(),
                              ) ||
                              e.after(document.createTextNode(" "));
                          }
                        });
                      }),
                        ScrollTrigger.refresh());
                    },
                  },
                  "<+0.05",
                );
              });
            }
          }),
        r &&
          r.length > 0 &&
          r.forEach((e) => {
            const t = e.dataset.delay || 0,
              l = e.dataset.duration || 1;
            n.fromTo(
              e,
              { clipPath: centerHorizontalClipPath },
              {
                clipPath: fullClipPath,
                duration: l,
                delay: t,
                ease: "expo.out",
              },
              "<+0.05",
            );
          }),
        i &&
          i.length > 0 &&
          i.forEach((e) => {
            const t = e.dataset.delay || 0,
              l = e.dataset.duration || 1;
            unwrapAndPreserveClasses(e);
            const o = new SplitType(e, { types: "words" });
            n.fromTo(
              o.words,
              { opacity: 0.2 },
              { opacity: 1, duration: l, delay: t, stagger: 0.05 },
            );
          }));
    });
  });
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
