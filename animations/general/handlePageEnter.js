import {
  centerHorizontalClipPath,
  fullClipPath,
  isDesktop,
  isTablet,
  topClipPath,
} from "../../utilities/variables.js";
import { gsap, SplitType } from "../../vendor.js";

const mm = gsap.matchMedia();

export default function handlePageEnterAnimation(t) {
  const e = gsap.timeline({
      paused: !0,
      defaults: { duration: 1, ease: "power2.out" },
    }),
    a = t.querySelectorAll("[data-enter-page=title]"),
    o = t.querySelectorAll("[data-enter-page=text]"),
    i = t.querySelectorAll("[data-enter-page=text-image]"),
    l = t.querySelectorAll("[data-enter-page=visual]"),
    p = t.querySelectorAll("[data-enter-page=text-element]");

  if (a.length > 0) {
    let lines = t.querySelectorAll("[data-enter-page=title] .line");
    if (!lines || lines.length === 0) {
      const stTitle = new SplitType(a, { types: "lines" });
      lines = stTitle.lines;
    }
    mm.add(isTablet, () => {
      e.fromTo(
        lines,
        { opacity: 0 },
        { opacity: 1, ease: "power4.out", duration: 1.25 },
        "<+0.1",
      );
    });
    mm.add(isDesktop, () => {
      e.fromTo(
        lines,
        { y: "200%" },
        { y: 0, stagger: 0.2, ease: "power4.out", duration: 1.25 },
        "<+0.1",
      );
    });
  }

  if (o.length > 0) {
    let lines = t.querySelectorAll("[data-enter-page=text] .line");
    if (!lines || lines.length === 0) {
      const stText = new SplitType(o, { types: "lines" });
      lines = stText.lines;
    }
    mm.add(isDesktop, () => {
      e.fromTo(
        lines,
        { clipPath: topClipPath, y: "100%" },
        { clipPath: fullClipPath, y: 0, stagger: 0.05 },
        "<+0.25",
      );
    });
    mm.add(isTablet, () => {
      e.fromTo(o, { opacity: 0 }, { opacity: 1 }, "<+0.25");
    });
  }

  if (i.length > 0) {
    mm.add(isDesktop, () => {
      e.fromTo(
        i,
        { clipPath: centerHorizontalClipPath },
        {
          clipPath: fullClipPath,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
        },
        "<+0.25",
      );
    });
    mm.add(isTablet, () => {
      e.fromTo(i, { opacity: 0 }, { opacity: 1, stagger: 0.05 }, "<+0.25");
    });
  }

  if (l.length > 0) {
    e.fromTo(
      l,
      { y: "5rem", opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: { from: "random", amount: 0.1 },
      },
      "<+0.25",
    );
  }

  if (p.length > 0) {
    mm.add(isDesktop, () => {
      e.fromTo(
        p,
        { clipPath: topClipPath, y: "100%" },
        { clipPath: fullClipPath, y: 0, stagger: 0.1 },
        "<+0.5",
      );
    });
    mm.add(isTablet, () => {
      e.fromTo(p, { opacity: 0 }, { opacity: 1 }, "<+0.25");
    });
  }

  return e;
}
