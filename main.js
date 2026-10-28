import { gsap, ScrollTrigger, ScrollToPlugin } from "./vendor.js";
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
import magnetic from "./animations/general/magnetic.js";
import velocitySkew from "./animations/creative/velocitySkew.js";
import wordScrub from "./animations/creative/wordScrub.js";
import ambientAurora from "./animations/creative/ambientAurora.js";
import floatingTags from "./animations/creative/floatingTags.js";
import cardEntrances from "./animations/creative/cardEntrances.js";
import imageScrollEffects from "./animations/creative/imageScrollEffects.js";
import creativeTextEffects from "./animations/creative/creativeTextEffects.js";
import studioClock from "./animations/creative/studioClock.js";
import velocityMarquee from "./animations/creative/velocityMarquee.js";
import graceAbout from "./animations/creative/graceAbout.js";
import graceScrollText from "./animations/creative/graceScrollText.js";
import cardTilt3D from "./animations/creative/cardTilt3D.js";
import flashWords from "./animations/creative/flashWords.js";
import interactiveDotMatrix from "./animations/creative/interactiveDotMatrix.js";
import statCounters from "./animations/creative/statCounters.js";
import filmGrainAndStatus from "./animations/creative/filmGrainAndStatus.js";
import deckStacking from "./animations/creative/deckStacking.js";

console.log("--> MAIN.JS START <--");
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
if (typeof window !== "undefined") {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}
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
  import(`/pages/${e}.js`)
    .then((r) => {
      currentAnimationModule = r.default || {};
      if ("function" == typeof currentAnimationModule.init) {
        currentAnimationModule.init();
      }
      const refreshScroll = () => {
        ScrollTrigger.refresh();
        if (window.lenis && typeof window.lenis.resize === "function") {
          window.lenis.resize();
        }
      };
      setTimeout(refreshScroll, 100);
      setTimeout(refreshScroll, 400);
      setTimeout(refreshScroll, 1000);
    })
    .catch((err) => {
      const o = getBaseUrl();
      import(`${o}pages/${e}.js`)
        .then((r) => {
          currentAnimationModule = r.default || {};
          if ("function" == typeof currentAnimationModule.init) {
            currentAnimationModule.init();
          }
        })
        .catch((fallbackErr) => {
          console.error(`Failed to load module for page: ${e}`, fallbackErr);
          currentAnimationModule = {};
        });
    });
}

export function initNavbarScroll() {
  const nav = document.querySelector(".navigation_wrap");
  if (!nav) return;

  const updateScrolled = (scrollY) => {
    const y = typeof scrollY === "number" ? scrollY : window.scrollY;
    if (y > 20) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };

  const handleNativeScroll = () => {
    updateScrolled(window.scrollY);
  };

  window.addEventListener("scroll", handleNativeScroll, { passive: true });

  if (window.lenis && typeof window.lenis.on === "function") {
    window.lenis.on("scroll", (e) => {
      const scrollY = e && typeof e.scroll === "number" ? e.scroll : window.scrollY;
      updateScrolled(scrollY);
    });
  }

  updateScrolled(window.scrollY);
}

// Global click feedback for brand logo
if (typeof document !== "undefined") {
  document.addEventListener("click", (e) => {
    const logoLink = e.target.closest(".navigation_logo_link");
    if (logoLink) {
      logoLink.classList.add("is-clicked");
      setTimeout(() => logoLink.classList.remove("is-clicked"), 500);
    }
  });
}

let isBackToTopBound = false;
export function scrollToTop(e) {
  if (e) {
    try {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    } catch (err) {}
  }

  const isDesktopWidth = window.innerWidth >= 992;
  let lenisSuccess = false;

  // 1. Desktop Lenis smooth scroll
  if (isDesktopWidth && window.lenis && typeof window.lenis.scrollTo === "function") {
    try {
      if (typeof window.lenis.start === "function") {
        window.lenis.start();
      }
      window.lenis.scrollTo(0, {
        duration: 1.0,
        force: true,
      });
      lenisSuccess = true;
      return;
    } catch (err) {
      console.warn("Lenis scrollTo error, falling back:", err);
      lenisSuccess = false;
    }
  }

  // 2. Mobile / tablet fallback (<992px) or if Lenis threw error
  if (!lenisSuccess) {
    try {
      if (typeof gsap !== "undefined" && gsap.to) {
        gsap.to(window, {
          scrollTo: { y: 0, autoKill: false },
          duration: 0.8,
          ease: "power2.out",
        });
      }
    } catch (err) {}

    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (err) {
      window.scrollTo(0, 0);
    }
    try {
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (e2) {}
    try {
      document.body.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (e3) {}
  }
}
window.scrollToTop = scrollToTop;

export function initBackToTop() {
  if (isBackToTopBound) return;
  isBackToTopBound = true;

  // Use capture phase so we intercept before Webflow, jQuery, or other listeners
  window.addEventListener(
    "click",
    (e) => {
      const btn = e.target?.closest?.(".footer_back_to_top, a[href='#navigation']");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        scrollToTop(e);
      }
    },
    { capture: true, passive: false }
  );
}

const initialPageName =
  document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace ||
  "home";

const safeRun = (fn, name) => {
  try {
    if (typeof fn === "function") fn();
  } catch (err) {
    console.warn(`[Init] ${name} error:`, err);
  }
};

safeRun(initThemeToggle, "initThemeToggle");
safeRun(initNavbarScroll, "initNavbarScroll");
safeRun(initBackToTop, "initBackToTop");
safeRun(() => createSplitTypes.init(document), "createSplitTypes");
safeRun(() => loadPageModule(initialPageName), "loadPageModule");
safeRun(handleResponsiveElements, "handleResponsiveElements");
safeRun(reinitWebflowFeatures, "reinitWebflowFeatures");
safeRun(updateCurrentNavLink, "updateCurrentNavLink");
safeRun(() => preloader.init(), "preloader");
safeRun(() => magnetic.init(), "magnetic");
safeRun(() => ambientAurora.init(), "ambientAurora");
safeRun(() => velocitySkew.init(), "velocitySkew");
safeRun(() => wordScrub.init(), "wordScrub");
safeRun(() => floatingTags.init(), "floatingTags");
safeRun(() => cardEntrances.init(), "cardEntrances");
safeRun(() => imageScrollEffects.init(), "imageScrollEffects");
safeRun(() => creativeTextEffects.init(), "creativeTextEffects");
safeRun(() => studioClock.init(), "studioClock");
safeRun(() => velocityMarquee.init(), "velocityMarquee");
safeRun(() => graceAbout.init(), "graceAbout");
safeRun(() => graceScrollText.init(), "graceScrollText");
safeRun(() => cardTilt3D.init(), "cardTilt3D");
safeRun(() => flashWords.init(), "flashWords");
safeRun(() => interactiveDotMatrix.init(), "interactiveDotMatrix");
safeRun(() => statCounters.init(), "statCounters");
safeRun(() => filmGrainAndStatus.init(), "filmGrainAndStatus");
safeRun(() => deckStacking.init(), "deckStacking");

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

barba.hooks.beforeEnter((e) => {
  // Update document title from incoming page HTML
  if (e.next && e.next.html) {
    const titleMatch = e.next.html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      const tempDiv = document.createElement("textarea");
      tempDiv.innerHTML = titleMatch[1];
      document.title = tempDiv.value;
    }
  }

  // Prune any duplicate containers from the DOM
  document.querySelectorAll('[data-barba="container"]').forEach((c) => {
    if (c !== e.next.container) {
      c.remove();
    }
  });
});

barba.hooks.afterEnter((e) => {
  cleanupCurrentModule();
  resetWebflow(e);
  try {
    menu.close();
  } catch (err) {}
  document.querySelectorAll('[data-barba="container"]').forEach((c) => {
    if (c !== e.next.container) {
      c.remove();
    }
  });
});

barba.hooks.after((e) => {
  document.querySelectorAll('[data-barba="container"]').forEach((c) => {
    if (c !== e.next.container) {
      c.remove();
    }
  });
  const o = e.next.namespace;
  updateCurrentNavLink();
  loadPageModule(o);
  handleResponsiveElements();
  reinitWebflowFeatures();
  initThemeToggle();
  initNavbarScroll();
  try {
    magnetic.init();
    ambientAurora.init();
    velocitySkew.init();
    wordScrub.init();
    floatingTags.init();
    cardEntrances.init();
    imageScrollEffects.init();
    creativeTextEffects.init();
    studioClock.init();
    velocityMarquee.init();
    graceAbout.init();
    graceScrollText.init();
    cardTilt3D.init();
    flashWords.init();
    interactiveDotMatrix.init();
    statCounters.init();
    filmGrainAndStatus.init();
    deckStacking.init();
  } catch (err) {}
  const refresh = () => {
    ScrollTrigger.refresh();
    if (window.lenis && typeof window.lenis.resize === "function") {
      window.lenis.resize();
    }
  };
  setTimeout(refresh, 100);
  setTimeout(refresh, 500);
});

// Continuously observe document height changes so Lenis can always scroll to bottom
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    if (window.lenis && typeof window.lenis.resize === "function") {
      window.lenis.resize();
    }
  });

  if (typeof ResizeObserver !== "undefined") {
    const pageObserver = new ResizeObserver(() => {
      if (window.lenis && typeof window.lenis.resize === "function") {
        window.lenis.resize();
      }
      ScrollTrigger.refresh();
    });
    const target = document.querySelector(".page_wrap") || document.body;
    if (target) pageObserver.observe(target);
  }
}
