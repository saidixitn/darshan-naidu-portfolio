import { gsap, JustValidate } from "../../vendor.js";
import {
  fullClipPath,
  isDesktop,
  isTablet,
  topClipPath,
} from "../../utilities/variables.js";
let ctx;
const mm = gsap.matchMedia();
let targetIdManager = (function () {
    let e = null;
    return {
      getTargetId: function () {
        return e;
      },
      setTargetId: function (t) {
        e = t;
      },
      resetTargetId: function () {
        e = null;
      },
    };
  })(),
  originalTriggerTexts = new Map(),
  eventListeners = [];
function init() {
  const e = document.querySelectorAll("[data-contact=trigger]"),
    t = document.querySelector("[data-contact=drawer-wrap]"),
    a = document.querySelector("[data-contact=cta][data-open=mail-wrap]"),
    r = document.querySelector("[data-contact=cta][data-close=mail-wrap]");
  if (!a || !r) return;
  ((a.disabled = !0),
    a.classList.add("is-disabled"),
    a.querySelectorAll("*").forEach((e) => {
      e.classList.add("is-disabled");
    }),
    e.forEach((e) => {
      (originalTriggerTexts.set(e, e.textContent),
        e.addEventListener("click", (a) => {
          a.stopPropagation();
          toggleDrawer(e.getAttribute("data-target"), t);
        }));
    }),
    a.addEventListener("click", () => {
      handleMailWrap("open");
    }),
    r.addEventListener("click", () => {
      handleMailWrap("close");
    }));
  const o = document.querySelector('[data-form="email-input"]'),
    n = document.querySelector('[data-form="email-asterisk"]');
  (o.addEventListener("input", function () {
    o.value.trim().length > 0
      ? (n.style.display = "none")
      : (n.style.display = "block");
  }),
    initEventListeners(),
    initValidation());
}
function handleMailWrap(e) {
  const t = document.querySelector("[data-contact=mail-wrap]"),
    a = document.querySelector("[data-contact=ctas-inner][data-type=initial]"),
    r = document.querySelector("[data-contact=ctas-inner][data-type=submit]"),
    o = a.querySelectorAll("[data-contact=cta]"),
    n = r.querySelectorAll("[data-contact=cta]"),
    s = t.querySelector("[data-contact=mail-inner]").children,
    c = gsap.timeline({
      defaults: { duration: 0.75, ease: "expo.out" },
      paused: !0,
    }),
    i = gsap.timeline({
      defaults: { duration: 1, ease: "expo.out" },
      paused: !0,
    });
  (mm
    .add(isDesktop, () => {
      (c
        .fromTo(
          o,
          { yPercent: 0 },
          { yPercent: -100, ease: "power2.out", duration: 0.5 },
        )
        .set(a, { display: "none" })
        .set(r, { display: "flex" })
        .set(t, { display: "flex" })
        .fromTo(t, { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom" }, "<")
        .fromTo(s, { yPercent: 125 }, { yPercent: 0 }, "<+25%")
        .fromTo(n, { yPercent: 100 }, { yPercent: 0 }, "<"),
        i
          .set(r, { display: "none" })
          .set(a, { display: "flex" })
          .fromTo(o, { yPercent: -100 }, { yPercent: 0 })
          .fromTo(t, { scaleY: 1 }, { scaleY: 0 }, "<+25%")
          .set(t, { display: "none" }));
    })
    .add(isTablet, () => {
      (c
        .fromTo(
          o,
          { autoAlpha: 1 },
          { autoAlpha: 0, ease: "power2.out", duration: 0.5 },
        )
        .set(a, { display: "none" })
        .set(r, { display: "flex" })
        .set(t, { display: "flex" })
        .fromTo(t, { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom" }, "<")
        .fromTo(s, { autoAlpha: 0 }, { autoAlpha: 1 }, "<+25%")
        .fromTo(n, { autoAlpha: 0 }, { autoAlpha: 1 }, "<"),
        i
          .set(r, { display: "none" })
          .set(a, { display: "flex" })
          .fromTo(o, { autoAlpha: 1 }, { autoAlpha: 0 })
          .fromTo(t, { scaleY: 1 }, { scaleY: 0 }, "<+25%")
          .set(t, { display: "none" }));
    }),
    "open" === e ? c.play() : "close" === e && i.play());
}
function initValidation() {
  const e = new JustValidate("[data-contact=form]", {
      errorFieldCssClass: "is-invalid",
      errorLabelCssClass: "is-invalid",
    }),
    t = document.querySelectorAll("[data-validate=required-group]"),
    a = document.querySelector("[data-contact=cta][type=submit]");
  0 !== t.length
    ? (t.forEach((t) => {
        e.addRequiredGroup(t, [
          { rule: "required", errorMessage: "This group is required" },
        ]);
      }),
      e.onSuccess(() => {
        const e = a.getAttribute("data-wait");
        if (e) {
          a.querySelector('[type="submit"]').value = e;
        }
      }))
    : console.warn("No required groups found for validation.");
}
function toggleDrawer(e, t) {
  const a = `is-open-${e}`,
    r = Array.from(t.classList).find((e) => e.startsWith("is-open-"));
  r
    ? r === a
      ? (t.classList.remove(r),
        animateDrawer(t, "out"),
        targetIdManager.resetTargetId())
      : (t.classList.remove(r),
        t.classList.add(a),
        handleItems(e, "in"),
        targetIdManager.setTargetId(e))
    : (animateDrawer(t, "in"),
      t.classList.add(a),
      targetIdManager.setTargetId(e));
}
function animateDrawer(e, t) {
  (gsap.killTweensOf(e),
    "in" === t
      ? gsap.fromTo(
          e,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.5,
            ease: "power2.out",
            transformOrigin: "bottom",
            onStart: () => {
              (gsap.set(e, { display: "flex" }), e.classList.add("animating"));
            },
            onComplete: () => {
              (handleItems(targetIdManager.getTargetId(), "in"),
                e.classList.remove("animating"));
            },
          },
        )
      : (handleItems(targetIdManager.getTargetId(), "out"),
        gsap.fromTo(
          e,
          { scaleY: 1 },
          {
            scaleY: 0,
            duration: 0.5,
            ease: "power2.out",
            transformOrigin: "bottom",
            delay: 0.25,
            onStart: () => e.classList.add("animating"),
            onComplete: () => {
              (gsap.set(e, { display: "none" }),
                e.classList.remove("animating"));
            },
          },
        )));
}
function handleItems(e, t) {
  const a = gsap.timeline({
      defaults: { duration: 0.25, ease: "power3.inOut" },
    }),
    r = document.querySelectorAll("[data-contact=drawer-item]"),
    o = document.querySelector(
      `[data-contact=drawer-item][data-drawer="${e}"]`,
    ),
    n = o.querySelectorAll("[data-contact=drawer-option]");
  return (
    "in" === t
      ? (gsap.set(r, { display: "none", opacity: 0 }),
        mm
          .add(isDesktop, () => {
            a.set(o, { display: "flex", opacity: 1 }).fromTo(
              n,
              { clipPath: topClipPath, yPercent: 100 },
              {
                clipPath: fullClipPath,
                yPercent: 0,
                stagger: 0.05,
                ease: "expo.out",
                duration: 1,
              },
            );
          })
          .add(isTablet, () => {
            a.set(o, { display: "flex", opacity: 1 }).fromTo(
              n,
              { autoAlpha: 0 },
              { autoAlpha: 1, ease: "expo.out", duration: 1 },
            );
          }))
      : a.to(o, { opacity: 0, yPercent: 5 }).set(o, { display: "none" }),
    a
  );
}
function checkSelectionStatus() {
  const e = document.querySelectorAll("[data-validate=required-group]"),
    t = document.querySelector("[data-contact=cta][data-open=mail-wrap]");
  Array.from(e).every((e) => {
    const t = e.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    return Array.from(t).some((e) => e.checked);
  })
    ? ((t.disabled = !1),
      t.classList.remove("is-disabled"),
      t.classList.add("is-active"),
      t.querySelectorAll("*").forEach((e) => {
        (e.classList.remove("is-disabled"), e.classList.add("is-active"));
      }))
    : ((t.disabled = !0),
      t.classList.add("is-disabled"),
      t.classList.remove("is-active"),
      t.querySelectorAll("*").forEach((e) => {
        (e.classList.add("is-disabled"), e.classList.remove("is-active"));
      }));
}
function initEventListeners() {
  const e = document.querySelector("[data-contact=drawer-wrap]"),
    t = document.querySelectorAll("[data-contact=drawer-option].w-radio"),
    a = document.querySelectorAll("[data-contact=drawer-option].w-checkbox"),
    r = document.querySelector(".checkbox-confirm");
  function o(e, t, a) {
    (e.addEventListener(t, a),
      eventListeners.push({ target: e, type: t, handler: a }));
  }
  (t.forEach((e) => {
    o(e.querySelector('input[type="radio"]'), "change", (t) => {
      (handleRadioChange(t.target, e), checkSelectionStatus());
    });
  }),
    a.forEach((e) => {
      o(e.querySelector('input[type="checkbox"]'), "change", (e) => {
        (handleCheckboxChange(a), checkSelectionStatus());
      });
    }),
    o(document, "click", (t) => {
      e.contains(t.target) || closeDrawerIfOpen();
    }),
    o(document, "keydown", (e) => {
      "Escape" === e.key && closeDrawerIfOpen();
    }),
    o(r, "click", () => {
      closeDrawerIfOpen();
    }));
}
function handleRadioChange(e, t) {
  const a = document.querySelector("[data-contact=drawer-wrap]"),
    r = document.querySelector(
      `[data-contact=trigger][data-target="${targetIdManager.getTargetId()}"]`,
    );
  if (e.checked) {
    (updateTriggerText(r, t.querySelector(".w-form-label").textContent),
      toggleDrawer(targetIdManager.getTargetId(), a),
      targetIdManager.resetTargetId());
  }
  document
    .querySelectorAll("[data-contact=drawer-option].w-radio")
    .forEach((e) => {
      const t = e.querySelector('input[type="radio"]').checked;
      e.classList.toggle("is-selected", t);
    });
}
function handleCheckboxChange(e) {
  const t = document.querySelector(
    `[data-contact=trigger][data-target="${targetIdManager.getTargetId()}"]`,
  );
  let a = Array.from(e)
    .filter((e) => e.querySelector('input[type="checkbox"]').checked)
    .map((e) => e.querySelector(".w-form-label").textContent);
  const r =
      a.length > 1
        ? `${a.slice(0, -1).join(", ")} and ${a.slice(-1)}`
        : a.join(""),
    o = originalTriggerTexts.get(t);
  (r !== o && updateTriggerText(t, r || o),
    e.forEach((e) => {
      const t = e.querySelector('input[type="checkbox"]').checked;
      e.classList.toggle("is-selected", t);
    }));
}
function updateTriggerText(e, t) {
  const a = originalTriggerTexts.get(e);
  gsap.to(e, {
    duration: 0.2,
    opacity: 0,
    onComplete: () => {
      ((e.textContent = t),
        t !== a
          ? e.classList.add("text-swapped")
          : e.classList.remove("text-swapped"),
        gsap.to(e, { duration: 0.2, opacity: 1 }));
    },
  });
}
function closeDrawerIfOpen() {
  const e = document.querySelector("[data-contact=drawer-wrap]");
  Array.from(e.classList).find((e) => e.startsWith("is-open-")) &&
    (toggleDrawer(targetIdManager.getTargetId(), e),
    targetIdManager.resetTargetId());
}
function cleanup() {
  (eventListeners.forEach(({ target: e, type: t, handler: a }) => {
    e.removeEventListener(t, a);
  }),
    (eventListeners = []),
    originalTriggerTexts.clear(),
    targetIdManager.resetTargetId());
  const e = document.querySelector("[data-contact=drawer-wrap]");
  (e.classList.remove(...e.classList), gsap.killTweensOf(e));
}
export default { init, cleanup };
