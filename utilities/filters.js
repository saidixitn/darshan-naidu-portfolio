import { List, Flip, gsap } from "../vendor.js";
let ctx;
function init() {
  const t = new List("projects", { valueNames: ["name", "category"] }),
    e = document.querySelector('[data-filter-element="results-count"]');
  function o() {
    gsap.to(e, {
      textContent: t.visibleItems.length,
      duration: 1,
      ease: "power3.out",
      snap: { textContent: 1 },
    });
  }
  function r() {
    const t = {};
    (document.querySelectorAll("[data-project-teaser=teaser]").forEach((e) => {
      if ("none" !== e.style.display) {
        e.querySelector(".category")
          .textContent.split(",")
          .map((t) => t.trim())
          .forEach((e) => {
            t[e] = (t[e] || 0) + 1;
          });
      }
    }),
      document
        .querySelectorAll('[data-filter-element="filter-item"]')
        .forEach((e) => {
          const o = e.getAttribute("data-filter-type"),
            r = e.querySelector('[data-filter-element="category-count"]');
          if (r) {
            parseInt(r.textContent.replace("– ", ""));
            const e =
              "all" === o
                ? Object.values(t).reduce((t, e) => t + e, 0)
                : t[o] || 0;
            gsap.to(r, {
              duration: 1,
              ease: "power3.out",
              snap: { textContent: 1 },
              textContent: e,
              onUpdate: function () {
                r.textContent = ` – ${r.textContent}`;
              },
            });
          } else
            console.error("Category count element not found for filter:", o);
        }));
  }
  (o(), r());
  const n = document.querySelectorAll('[data-filter-element="filter-item"]');
  let a = null;
  n.forEach(function (e) {
    e.addEventListener("click", function () {
      const l = e.getAttribute("data-filter-type"),
        c = Flip.getState(
          document.querySelectorAll("[data-project-teaser=teaser]"),
        ),
        i = Array.from(
          document.querySelectorAll("[data-project-teaser=teaser]"),
        ).filter(
          (t) =>
            !t.querySelector(".category").textContent.trim().includes(l) &&
            "all" !== l,
        );
      gsap.to(i, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          (l === a
            ? (t.filter(), (a = null), e.classList.remove("is-active"))
            : (n.forEach((t) => t.classList.remove("is-active")),
              e.classList.add("is-active"),
              "all" === l
                ? t.filter()
                : t.filter(function (t) {
                    return t.values().category.includes(l);
                  }),
              (a = l)),
            o(),
            r(),
            gsap.to(document.querySelectorAll("[data-project-teaser=teaser]"), {
              opacity: 1,
              duration: 0.1,
            }),
            Flip.from(c, { duration: 0.5, ease: "power1.inOut" }));
        },
      });
    });
  });
}
function cleanup() {
  ctx && ctx.revert();
}
export default { init, cleanup };
