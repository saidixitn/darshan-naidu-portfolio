import {
  Swiper,
  Navigation,
  Pagination,
  gsap,
  FreeMode,
  Parallax,
} from "../../vendor.js";
let testimonialSwiper, carouselSwiper;
function init() {
  const e = document.querySelector("[data-testimonial=section]"),
    t = document.querySelector("[data-swiper=testimonial]"),
    i = document.querySelectorAll("[data-carousel=section]");
  if (t && e) {
    const i = e.querySelector("[data-testimonial=index-wrapper]"),
      r = e.querySelector("[data-testimonial=current-slide-wrapper]"),
      n = i.querySelector("[data-testimonial=slide-count]"),
      o = r.querySelector("[data-testimonial=current-slide-inner]"),
      a = i.querySelector("[data-testimonial=current-slide]"),
      l = e.querySelector("[data-testimonial=company-names]"),
      s = l.children,
      d = t.querySelectorAll(".swiper-slide");
    ((n.textContent = `0${d.length}`),
      (testimonialSwiper = new Swiper(t, {
        direction: "horizontal",
        slidesPerView: "auto",
        modules: [Navigation, Pagination, Parallax],
        draggable: !0,
        spaceBetween: 20,
        speed: 600,
        parallax: !0,
        breakpoints: {
          1024: {
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          },
        },
      })));
    const p = Array.from(testimonialSwiper.slides).map((e, t) => {
      const i = a.cloneNode(!0);
      return (
        (i.textContent = `0${t + 1}`),
        (i.style.position = "absolute"),
        (i.style.top = 100 * t + "%"),
        (i.style.left = "0"),
        a.parentNode.insertBefore(i, a),
        i
      );
    });
    for (let e = 1; e < s.length; e++)
      ((s[e].style.position = "absolute"),
        (s[e].style.top = 100 * e + "%"),
        (s[e].style.left = "0"));
    (p[0].remove(),
      testimonialSwiper.on("slideChange", () => {
        gsap
          .timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } })
          .to(l, { yPercent: -100 * testimonialSwiper.activeIndex }, "<")
          .to(o, { yPercent: -100 * testimonialSwiper.activeIndex }, "<");
      }));
  }
  function r() {
    i.forEach((e) => {
      const t = e.querySelector("[data-swiper=carousel]");
      if (t) {
        if (!t.swiper) {
          const swiperInstance = new Swiper(t, {
            slidesPerView: 1.15,
            spaceBetween: 16,
            grabCursor: true,
            simulateTouch: true,
            touchRatio: 1,
            resistance: true,
            resistanceRatio: 0.85,
            modules: [FreeMode],
            freeMode: {
              enabled: true,
              sticky: false,
              momentum: true,
              momentumRatio: 0.9,
              momentumVelocityRatio: 0.9,
              momentumBounce: true,
            },
            breakpoints: {
              480: {
                slidesPerView: 1.35,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 2.75,
                spaceBetween: 24,
              },
              1200: {
                slidesPerView: 3.15,
                spaceBetween: 28,
              },
              1440: {
                slidesPerView: 3.35,
                spaceBetween: 32,
              },
            },
          });
          t.swiper = swiperInstance;

          // Trackpad horizontal scroll and Shift + Wheel scroll support
          if (!t._wheelBound) {
            t._wheelBound = true;
            t.addEventListener(
              "wheel",
              (evt) => {
                const delta =
                  Math.abs(evt.deltaX) >= Math.abs(evt.deltaY)
                    ? evt.deltaX
                    : evt.shiftKey
                      ? evt.deltaY
                      : 0;
                if (delta !== 0 && t.swiper) {
                  evt.preventDefault();
                  const currentTranslate = t.swiper.translate;
                  const maxT = t.swiper.maxTranslate();
                  const minT = t.swiper.minTranslate();
                  const newTranslate = Math.min(minT, Math.max(maxT, currentTranslate - delta));
                  t.swiper.setTranslate(newTranslate);
                  t.swiper.updateProgress();
                }
              },
              { passive: false }
            );
          }
        } else {
          t.swiper.update();
        }
      }
    });
  }
  (r(),
    window.addEventListener(
      "resize",
      (function (e, t) {
        let i;
        return function (...r) {
          (clearTimeout(i), (i = setTimeout(() => e.apply(this, r), t)));
        };
      })(r, 200),
    ));
}
function cleanup() {
  (testimonialSwiper && testimonialSwiper.destroy(),
    carouselSwiper && carouselSwiper.destroy());
}
export default { init, cleanup };
