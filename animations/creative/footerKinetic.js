import { gsap } from "../../vendor.js";

const IMAGES = {
  portrait: "/assets/images/darshan/darshan.jpeg",
  studio:   "/assets/images/darshan/IMG_E1906_Original.JPG",
  edit:     "/assets/images/darshan/IMG_8863-EDIT.jpg",
  shot1:    "/assets/images/darshan/IMG_1499.JPG",
  shot2:    "/assets/images/darshan/IMG_2461.JPG",
  shot3:    "/assets/images/darshan/IMG_3763.JPG",
  shot4:    "/assets/images/darshan/IMG_4192.JPG",
  shot5:    "/assets/images/darshan/IMG_4364.jpg",
  shot6:    "/assets/images/darshan/IMG_6965.jpg",
  shot7:    "/assets/images/darshan/IMG_7845.JPG",
  shot8:    "/assets/images/darshan/IMG_8213.jpg"
};

let observer = null;
let masterTimeline = null;
let isPreloaded = false;

function preloadAssets(urls, callback) {
  if (isPreloaded) {
    if (callback) callback();
    return;
  }
  let loaded = 0;
  const keys = Object.keys(urls);
  const total = keys.length;
  keys.forEach((k) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded++;
      if (loaded >= total) {
        isPreloaded = true;
        if (callback) callback();
      }
    };
    img.src = urls[k];
  });
}

function createWordmarkMarkup() {
  return `
    <div class="footer-kinetic-container" aria-label="Darshan Naidu">
      <span class="char-slot" data-index="0" data-char="D"><span class="char-glyph">D</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="1" data-char="a"><span class="char-glyph">a</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="2" data-char="r"><span class="char-glyph">r</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="3" data-char="s"><span class="char-glyph">s</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="4" data-char="h"><span class="char-glyph">h</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="5" data-char="a"><span class="char-glyph">a</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="6" data-char="n"><span class="char-glyph">n</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-space">&nbsp;</span>
      <span class="char-slot" data-index="7" data-char="N"><span class="char-glyph">N</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="8" data-char="a"><span class="char-glyph">a</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="9" data-char="i"><span class="char-glyph">i</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="10" data-char="d"><span class="char-glyph">d</span><div class="image-tile"><img src="" alt=""></div></span>
      <span class="char-slot" data-index="11" data-char="u"><span class="char-glyph">u</span><div class="image-tile"><img src="" alt=""></div></span>
    </div>
  `;
}

function setSlotState(tl, slots, naturalWidths, tileDimension, index, config, position) {
  const slot = slots[index];
  if (!slot) return;
  const glyph = slot.querySelector(".char-glyph");
  const tile = slot.querySelector(".image-tile");
  const img = tile ? tile.querySelector("img") : null;

  const naturalW = naturalWidths[index] || 20;
  const targetW = config.active ? tileDimension : naturalW;
  const duration = config.duration || 0.42;
  const ease = config.ease || "power2.out";
  const marginVal = window.innerWidth < 480 ? 2 : 4;

  if (config.active && config.image) {
    if (img) tl.set(img, { attr: { src: config.image } }, position);

    tl.to(
      slot,
      {
        width: targetW,
        marginRight: marginVal,
        marginLeft: marginVal,
        duration: duration,
        ease: ease,
      },
      position
    );

    if (glyph) {
      tl.to(
        glyph,
        {
          opacity: 0,
          scale: 0.15,
          duration: duration * 0.7,
          ease: "power2.in",
        },
        position
      );
    }

    if (tile) {
      tl.set(tile, { width: tileDimension, height: tileDimension }, position);
      tl.to(
        tile,
        {
          opacity: 1,
          scale: 1,
          duration: duration,
          ease: ease,
        },
        position
      );
    }
  } else {
    if (tile) {
      tl.to(
        tile,
        {
          opacity: 0,
          scale: 0.5,
          duration: duration * 0.75,
          ease: "power2.in",
        },
        position
      );
    }

    tl.to(
      slot,
      {
        width: targetW,
        marginRight: 0,
        marginLeft: 0,
        duration: duration,
        ease: ease,
      },
      position
    );

    if (glyph) {
      tl.to(
        glyph,
        {
          opacity: 1,
          scale: 1,
          duration: duration,
          ease: ease,
        },
        position + duration * 0.2
      );
    }
  }
}

function swapSlotImage(tl, slots, index, newImage, position, duration = 0.28) {
  const slot = slots[index];
  if (!slot) return;
  const tile = slot.querySelector(".image-tile");
  const img = tile ? tile.querySelector("img") : null;
  if (!tile || !img) return;

  tl.to(
    tile,
    {
      scale: 0.88,
      duration: duration * 0.5,
      ease: "power1.in",
    },
    position
  );

  tl.set(img, { attr: { src: newImage } }, position + duration * 0.5);

  tl.to(
    tile,
    {
      scale: 1,
      duration: duration * 0.5,
      ease: "back.out(1.4)",
    },
    position + duration * 0.5
  );
}

export function initFooterKinetic() {
  const wordmarks = document.querySelectorAll(".footer-wordmark");
  if (!wordmarks.length) return;

  wordmarks.forEach((el) => {
    // Only replace if not already initialized
    if (!el.classList.contains("is-kinetic-ready")) {
      el.classList.add("is-kinetic-ready", "footer-kinetic-wordmark");
      el.innerHTML = createWordmarkMarkup();
    }
  });

  const container = document.querySelector(".footer-kinetic-container");
  if (!container) return;

  const slots = container.querySelectorAll(".char-slot");
  if (!slots.length) return;

  let naturalWidths = [];
  let tileDimension = 0;

  function measure() {
    naturalWidths = [];
    slots.forEach((slot) => {
      const glyph = slot.querySelector(".char-glyph");
      slot.style.width = "auto";
      slot.style.margin = "0";
      if (glyph) {
        glyph.style.transform = "none";
        glyph.style.opacity = "1";
        const rect = glyph.getBoundingClientRect();
        const exactW = Math.ceil(rect.width * 10) / 10;
        naturalWidths.push(exactW);
        slot.style.width = `${exactW}px`;
      } else {
        naturalWidths.push(20);
      }
    });

    const sample = slots[0];
    const rect = sample.getBoundingClientRect();
    tileDimension = Math.round(rect.height);
  }

  function build() {
    if (masterTimeline) {
      masterTimeline.kill();
    }

    measure();

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.8,
      defaults: { ease: "power2.out" },
    });

    // Phase A: Clean Opening
    slots.forEach((slot, idx) => {
      const glyph = slot.querySelector(".char-glyph");
      const tile = slot.querySelector(".image-tile");
      tl.set(slot, { width: naturalWidths[idx] || 20, margin: 0 }, 0);
      if (glyph) tl.set(glyph, { opacity: 1, scale: 1 }, 0);
      if (tile) tl.set(tile, { opacity: 0, scale: 0.6 }, 0);
    });

    // Phase B: First Subtle Card Insertion (0.45s - 1.35s)
    setSlotState(tl, slots, naturalWidths, tileDimension, 9, { active: true, image: IMAGES.shot1, duration: 0.44 }, 0.45);
    swapSlotImage(tl, slots, 9, IMAGES.shot2, 0.90, 0.28);
    setSlotState(tl, slots, naturalWidths, tileDimension, 9, { active: false, duration: 0.40 }, 1.35);

    // Phase C: Leftward Flow to First Name (1.50s - 2.40s)
    setSlotState(tl, slots, naturalWidths, tileDimension, 2, { active: true, image: IMAGES.shot3, duration: 0.44 }, 1.50);
    swapSlotImage(tl, slots, 2, IMAGES.shot4, 1.95, 0.28);
    setSlotState(tl, slots, naturalWidths, tileDimension, 2, { active: false, duration: 0.40 }, 2.40);

    // Phase D: Balanced Dual Bloom (2.55s - 3.55s)
    setSlotState(tl, slots, naturalWidths, tileDimension, 4, { active: true, image: IMAGES.shot5, duration: 0.44 }, 2.55);
    setSlotState(tl, slots, naturalWidths, tileDimension, 10, { active: true, image: IMAGES.shot6, duration: 0.44 }, 2.65);
    swapSlotImage(tl, slots, 10, IMAGES.shot7, 3.05, 0.28);
    setSlotState(tl, slots, naturalWidths, tileDimension, 4, { active: false, duration: 0.40 }, 3.55);
    setSlotState(tl, slots, naturalWidths, tileDimension, 10, { active: false, duration: 0.40 }, 3.60);

    // Phase E: Collapse to Solo Hero Card (3.75s - 4.85s)
    setSlotState(tl, slots, naturalWidths, tileDimension, 1, { active: true, image: IMAGES.portrait, duration: 0.46 }, 3.75);

    // Phase F: Final Reset (4.85s - 5.35s)
    setSlotState(tl, slots, naturalWidths, tileDimension, 1, { active: false, duration: 0.44 }, 4.85);

    // Phase G: Resting Hold (5.35s - 7.15s)
    tl.to({}, { duration: 1.8 }, 5.35);

    masterTimeline = tl;
    return tl;
  }

  preloadAssets(IMAGES, () => {
    const run = () => {
      build();

      // Optimize CPU: only play when footer is scrolled into viewport
      if ("IntersectionObserver" in window) {
        if (observer) observer.disconnect();
        const footerEl = document.querySelector(".footer-kinetic-wordmark") || container;
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (masterTimeline && masterTimeline.paused()) {
                  masterTimeline.play();
                }
              } else {
                if (masterTimeline && !masterTimeline.paused()) {
                  masterTimeline.pause();
                }
              }
            });
          },
          { threshold: 0.1 }
        );
        if (footerEl) observer.observe(footerEl);
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run);
    } else {
      run();
    }
  });

  // Re-measure accurately on resize or mobile orientation change
  let rTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(rTimer);
    rTimer = setTimeout(() => {
      const prog = masterTimeline ? masterTimeline.progress() : 0;
      build();
      if (masterTimeline) masterTimeline.progress(prog);
    }, 150);
  });

  // Replay on click
  container.addEventListener("click", () => {
    if (masterTimeline) masterTimeline.restart();
  });
}

export default {
  init: initFooterKinetic,
};
