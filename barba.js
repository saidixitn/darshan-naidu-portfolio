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
  preventRunning: true,
  transitions: [
    {
      name: "default-transition",
      sync: false,
      leave(e) {
        const done = this.async();
        closeMenu();
        const nav = document.querySelector("[data-navigation=wrap]");
        const overlay = document.querySelector("[data-overlay=transition]");
        const tl = gsap.timeline({
          defaults: { duration: 0.35, ease: "power2.inOut" },
          onComplete: () => {
            done();
          },
        });
        proxy.pageReady = false;
        if (overlay) {
          gsap.set(overlay, { display: "block" });
          tl.fromTo(overlay, { opacity: 0 }, { opacity: 0.8 }, 0);
        }
        tl.fromTo(
          e.current.container,
          { opacity: 1, scale: 1 },
          { opacity: 0, scale: 0.98 },
          0
        );
        if (nav) {
          tl.fromTo(nav, { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0);
        }
      },
      enter(e) {
        const done = this.async();
        const nav = document.querySelector("[data-navigation=wrap]");

        // Scroll to top instantly before revealing the new page
        window.scrollTo(0, 0);
        if (window.lenis && typeof window.lenis.scrollTo === "function") {
          try {
            window.lenis.scrollTo(0, { immediate: true, force: true });
          } catch (err) {}
        }

        const tl = gsap.timeline({
          defaults: { duration: 0.5, ease: "power3.out" },
          onComplete: () => {
            gsap.set(e.next.container, { clearProps: "all" });
            if (window.lenis && typeof window.lenis.resize === "function") {
              window.lenis.resize();
            }
            ScrollTrigger.refresh();
            done();
          },
        });

        tl.fromTo(
          e.next.container,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
          .call(
            () => {
              createSplitTypes.init(e.next.container);
            },
            [],
            "<"
          )
          .call(
            () => {
              handlePageEnterAnimation(e.next.container).play();
            },
            [],
            "<+0.1"
          );

        if (nav) {
          tl.fromTo(
            nav,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power1.inOut" },
            "<+0.1"
          );
        }
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
