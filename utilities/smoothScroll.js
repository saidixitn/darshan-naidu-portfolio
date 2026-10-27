import { Lenis, ScrollTrigger, gsap } from "../vendor.js";
import { isDesktop, isTablet } from "./variables.js";
const mm = gsap.matchMedia();
let lerp, wheelMultiplier, touchMultiplier;
(mm.add(isTablet, () => {
  ((lerp = 0.95), (wheelMultiplier = 0), (touchMultiplier = 0));
}),
  mm.add(isDesktop, () => {
    ((lerp = 0.5), (wheelMultiplier = 0.7), (touchMultiplier = 0));
  }));
const lenis = new Lenis({ lerp, wheelMultiplier, touchMultiplier });
window.lenis = lenis;
mm.add(isDesktop, () => {
  (lenis.on("scroll", ScrollTrigger.update),
    gsap.ticker.add((e) => {
      lenis.raf(1e3 * e);
    }),
    gsap.ticker.lagSmoothing(0),
    document.querySelectorAll("[data-lenis-start]").forEach(function (e) {
      e.addEventListener("click", function () {
        lenis.start();
      });
    }),
    document.querySelectorAll("[data-lenis-stop]").forEach(function (e) {
      e.addEventListener("click", function () {
        lenis.stop();
      });
    }),
    document.querySelectorAll("[data-lenis-toggle]").forEach(function (e) {
      e.addEventListener("click", function () {
        (e.classList.toggle("stop-scroll"),
          e.classList.contains("stop-scroll") ? lenis.stop() : lenis.start());
      });
    }),
    (window.lenis = lenis));
});
export default lenis;
