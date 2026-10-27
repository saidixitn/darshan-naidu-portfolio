import handlePageEnterAnimation from "./animations/general/handlePageEnter.js";
import createSplitTypes from "./utilities/createSplitTypes.js";
import {
  cursor,
  magneticCursor,
} from "./utilities/customCursor/customCursor.js";
import { closeMenu } from "./utilities/helper.js";
import { proxy } from "./utilities/pageReadyListener.js";
import lenis from "./utilities/smoothScroll.js";
import { isDesktop } from "./utilities/variables.js";
import { gsap, barba, ScrollTrigger, Flip } from "./vendor.js";
gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();
barba.init({
  preventRunning: !0,
  transitions: [
    {
      name: "default-transition",
      sync: !0,
      leave(e) {
        const t = this.async();
        closeMenu();
        const a = document.querySelector("[data-navigation=wrap]"),
          o = document.querySelector("[data-overlay=transition]"),
          r = gsap.timeline({
            onStart: () => {
              gsap.set(o, { display: "block" });
            },
            onComplete: () => {
              gsap.to(window, { scrollTo: 0, duration: 0 });
            },
            defaults: { duration: 1, ease: "power1.inOut" },
          });
        ((proxy.pageReady = !1),
          r
            .fromTo(
              e.current.container,
              { scaleX: 1 },
              { scaleX: 0.95, y: "-5%" },
            )
            .fromTo(
              a,
              { opacity: 1, y: 0, scale: 1 },
              { opacity: 0, y: "-7rem", scale: 0.9, ease: "power2.inOut" },
              "<-0.1",
            )
            .fromTo(o, { opacity: 0 }, { opacity: 0.75 }, "<")
            .call(() => t(), [], ">"));
      },
      enter(e) {
        const t = this.async(),
          a = document.querySelector("[data-navigation=wrap]"),
          o = gsap.timeline({
            defaults: { duration: 0.5, delay: 0.25, ease: "power3.out" },
            onStart: () => {
              gsap.to(window, { scrollTo: 0, duration: 0 });
            },
          }),
          r = window.innerHeight;
        o.fromTo(
          e.next.container,
          {
            clipPath: `polygon(0px ${r}px, 100% ${r}px, 100% ${r}px, 0px ${r}px)`,
          },
          {
            clipPath: `polygon(0px 0px, 100% 0px, 100% ${r}px, 0px ${r}px)`,
            ease: "expo.out",
            duration: 1,
            onComplete: () => {
              (gsap.set(e.next.container, { clearProps: !0 }), t());
            },
          },
        )
          .call(
            () => {
              createSplitTypes.init(e.next.container);
            },
            [],
            "<",
          )
          .call(
            () => {
              handlePageEnterAnimation(e.next.container).play();
            },
            [],
            "<+0.25",
          )
          .fromTo(
            a,
            { opacity: 0, y: "0rem", scale: 1 },
            {
              opacity: 1,
              y: "0rem",
              scale: 1,
              duration: 0.25,
              ease: "power1.inOut",
            },
            "<+0.5",
          );
      },
      before(e) {
        e.next.container.classList.add("is-animating");
      },
      after(e) {
        e.next.container.classList.remove("is-animating");
      },
    },
  ],
  views: [
    { namespace: "home", beforeEnter({ next: e }) {} },
    { namespace: "about", beforeEnter({ next: e }) {} },
    { namespace: "contact", beforeEnter({ next: e }) {} },
  ],
});
export default barba;
