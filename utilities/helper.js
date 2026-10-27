import { gsap, ScrollTrigger } from "../vendor.js";
import { isDesktop, isLandscape, isMobile, isTablet } from "./variables.js";
export function unwrapAndPreserveClasses(e) {
  const t = e.querySelectorAll("span, a, strong, b, em, i, u"),
    n = (e) => {
      const t = e.className,
        n = e.tagName.toLowerCase(),
        a = document.createDocumentFragment(),
        o = Array.from(e.attributes);
      e.childNodes.forEach((e) => {
        if (e.nodeType === Node.TEXT_NODE) {
          const r = e.textContent.split(/\s+/);
          r.forEach((e, s) => {
            if (0 === e.length) return;
            const i = document.createElement(n);
            ((i.textContent = e),
              o.forEach((e) => {
                "class" !== e.name && i.setAttribute(e.name, e.value);
              }),
              t && (i.className = t),
              a.appendChild(i),
              s < r.length - 1 && a.appendChild(document.createTextNode(" ")));
          });
        } else
          e.nodeType === Node.ELEMENT_NODE && "BR" === e.tagName
            ? a.appendChild(document.createTextNode("\n"))
            : e.nodeType === Node.ELEMENT_NODE &&
              a.appendChild(e.cloneNode(!0));
      });
      const r = e.nextSibling;
      (r &&
        ((r.nodeType === Node.ELEMENT_NODE && !r.textContent.startsWith(" ")) ||
          (r.nodeType === Node.TEXT_NODE &&
            !r.textContent.startsWith(" ") &&
            "" !== r.textContent.trim())) &&
        a.appendChild(document.createTextNode(" ")),
        e.replaceWith(a));
    };
  for (let e = 0; e < t.length; e++) n(t[e]);
  e.querySelectorAll(
    "strong:empty, span:empty, a:empty, b:empty, em:empty, i:empty, u:empty",
  ).forEach((e) => {
    e.remove();
  });
}
export function closeMenu() {
  const e = document.querySelector("[data-menu-mobile=menu-trigger]");
  e && e.classList.contains("is-active") && e.click();
}
export function getCurrentPage() {
  return document.querySelector('[data-barba="container"]').dataset
    .barbaNamespace;
}
let mm;
export function handleResponsiveElements() {
  (mm && mm.revert(), (mm = gsap.matchMedia()));
  const e = new Map();
  function t(t) {
    document.querySelectorAll("[data-remove]").forEach((n) => {
      const a = n.getAttribute("data-remove"),
        o = n.parentNode,
        r = n.nextElementSibling;
      a === t &&
        (e.has(n) ||
          (e.set(n, { parent: o, nextSibling: r }), o.removeChild(n)));
    });
  }
  (mm.add(isDesktop, () => {
    t("desktop");
  }),
    mm.add(isTablet, () => {
      t("tablet");
    }),
    mm.add(isLandscape, () => {
      t("landscape");
    }),
    mm.add(isMobile, () => {
      t("mobile");
    }),
    mm.add(isDesktop, () => () => {}));
}
export function updateCurrentNavLink() {
  const rawPath = window.location.pathname.replace(/\/$/, "") || "/";
  const normalizedPath =
    rawPath === "/about-darshan"
      ? "/about-me"
      : rawPath === "/contact-darshan"
      ? "/contact"
      : rawPath === "/darshan-design-portfolio"
      ? "/portfolio"
      : rawPath;

  document
    .querySelectorAll(
      ".navigation_menu_item, .navigation_flyout_layout a, .navigation_logo_link"
    )
    .forEach((t) => {
      const href = t.getAttribute("href");
      if (!href) return;
      const cleanHref =
        href.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

      if (cleanHref === normalizedPath || cleanHref === rawPath) {
        t.classList.add("w--current");
        t.setAttribute("aria-current", "page");
      } else {
        t.classList.remove("w--current");
        t.removeAttribute("aria-current");
      }
    });
}
export function reinitWebflowFeatures() {
  document.querySelectorAll(".w-tab-link").forEach((e) => {
    e.addEventListener("mouseenter", () => {
      e.click();
    });
  });
}
export function handleLazyLoad(e = {}) {
  let t = gsap.utils.toArray("img[loading='lazy']"),
    n = gsap
      .delayedCall(e.timeout || 1, () => {
        (ScrollTrigger.refresh(), window.dispatchEvent(new Event("resize")));
      })
      .pause(),
    a = !1 !== e.lazy,
    o = t.length,
    r = () =>
      a
        ? n.restart(!0)
        : --o ||
          (ScrollTrigger.refresh(), window.dispatchEvent(new Event("resize")));
  t.forEach((e, t) => {
    (a || (e.loading = "eager"),
      e.naturalWidth ? r() : e.addEventListener("load", r));
  });
}
