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

console.log("--> MAIN.JS MODULE EXECUTION START <--");
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
      console.log(`${o}pages/${e}.js`);
      if ("function" == typeof currentAnimationModule.init) {
        currentAnimationModule.init();
      } else {
        console.warn(`Module for page ${e} does not have an init function.`);
      }
    })
    .catch((o) => {
      console.error(`Failed to load module for page: ${e}`, o);
      currentAnimationModule = {};
    });
}

const initialPageName =
  document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace ||
  "home";

function isSafari() {
  var e = navigator.userAgent.toLowerCase();
  return -1 !== e.indexOf("safari") && -1 === e.indexOf("chrome");
}

try {
  console.log("--> Calling createSplitTypes...");
  createSplitTypes.init(document);
  console.log("--> Calling loadPageModule...");
  loadPageModule(initialPageName);
  console.log("--> Calling handleResponsiveElements...");
  handleResponsiveElements();
  console.log("--> Calling reinitWebflowFeatures...");
  reinitWebflowFeatures();

  // Initialize Theme Toggle & Creative Loading Animation
  console.log("--> Calling initThemeToggle...");
  initThemeToggle();
  console.log("--> Calling preloader.init()...");
  preloader.init();
} catch (err) {
  console.error("FATAL ERROR IN MAIN INIT:", err);
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

barba.hooks.afterEnter((e) => {
  cleanupCurrentModule();
  resetWebflow(e);
});

barba.hooks.after((e) => {
  const o = e.next.namespace;
  updateCurrentNavLink();
  loadPageModule(o);
  handleResponsiveElements();
  reinitWebflowFeatures();
  initThemeToggle();
});
