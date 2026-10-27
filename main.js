import { gsap, ScrollTrigger } from "./vendor.js";
import barba from "./barba.js";
import menu from "./animations/general/menu.js";
import {
  handleResponsiveElements,
  updateCurrentNavLink,
  reinitWebflowFeatures,
  handleLazyLoad,
} from "./utilities/helper.js";
import createSplitTypes from "./utilities/createSplitTypes.js";
import {
  cursor,
  magneticCursor,
} from "./utilities/customCursor/customCursor.js";
import { isDesktop } from "./utilities/variables.js";
import { initThemeToggle } from "./utilities/theme.js";
import preloader from "./animations/general/preloader.js";

console.log("--> MAIN.JS START <--");
gsap.registerPlugin(ScrollTrigger);
menu.init();

const mm = gsap.matchMedia();
let currentAnimationModule = null;

function resetWebflow(e) {
  let o = new DOMParser().parseFromString(e.next.html, "text/html"),
    r = $(o).find("html").attr("data-wf-page");
  $("html").attr("data-wf-page", r);
  window.Webflow && window.Webflow.destroy();
  window.Webflow && window.Webflow.ready();
  window.Webflow && window.Webflow.require("ix2").init();
}

function cleanupCurrentModule() {
  currentAnimationModule &&
    currentAnimationModule.cleanup &&
    currentAnimationModule.cleanup();
  ScrollTrigger.getAll().forEach((e) => e.kill());
  currentAnimationModule = null;
}

function getBaseUrl() {
  const e = document.querySelector('script[src*="main.js"]'),
    o = e?.src || "";
  return o.substring(0, o.lastIndexOf("/") + 1);
}

function loadPageModule(e) {
  const o = getBaseUrl();
  import(`${o}pages/${e}.js`)
    .then((r) => {
      currentAnimationModule = r.default || {};
      if ("function" == typeof currentAnimationModule.init) {
        currentAnimationModule.init();
      }
    })
    .catch((o) => {
      console.error(`Failed to load module for page: ${e}`, o);
      currentAnimationModule = {};
    });
}

export function initNavbarScroll() {
  const nav = document.querySelector(".navigation_wrap");
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

let isBackToTopBound = false;
export function initBackToTop() {
  if (isBackToTopBound) return;
  isBackToTopBound = true;
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".footer_back_to_top, a[href='#navigation']");
    if (btn) {
      e.preventDefault();
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });
}

const initialPageName =
  document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace ||
  "home";

// Execute in Deztopia exact initial sequence
try {
  initThemeToggle();
  initNavbarScroll();
  initBackToTop();
  createSplitTypes.init(document);
  loadPageModule(initialPageName);
  handleResponsiveElements();
  reinitWebflowFeatures();
  preloader.init();
} catch (err) {
  console.error("Initialization error:", err);
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

barba.hooks.afterEnter((e) => {
  cleanupCurrentModule();
  resetWebflow(e);
  try {
    menu.close();
  } catch (err) {}
});

barba.hooks.after((e) => {
  const o = e.next.namespace;
  updateCurrentNavLink();
  loadPageModule(o);
  handleResponsiveElements();
  reinitWebflowFeatures();
  initThemeToggle();
  initNavbarScroll();
});
