import { gsap, ScrollTrigger } from "../../vendor.js";

// Authentic Darshan Photography matching /darshan 1:1
const IMAGES = {
  portrait: "/assets/images/darshan/darshan.jpeg",
  shot1:    "/assets/images/darshan/IMG_1499.JPG",
  shot2:    "/assets/images/darshan/IMG_2461.JPG",
  shot3:    "/assets/images/darshan/IMG_3763.JPG",
  shot4:    "/assets/images/darshan/IMG_4192.JPG",
  shot5:    "/assets/images/darshan/IMG_4364.jpg",
  shot6:    "/assets/images/darshan/IMG_6965.jpg",
  shot7:    "/assets/images/darshan/IMG_7845.JPG"
};

let masterTimeline = null;
let scrollTriggerInstance = null;
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

// Figma Auto-Layout Wordmark Markup
export function createWordmarkMarkup() {
  return `
    <div class="footer-kinetic-container" aria-label="Darshan Naidu">
      <span class="char-slot" data-index="0" data-char="D"><span class="char-glyph">D</span><div class="image-tile"><img src="/assets/images/darshan/darshan.jpeg" alt=""></div></span>
      <span class="char-slot" data-index="1" data-char="a"><span class="char-glyph">a</span><div class="image-tile"><img src="/assets/images/darshan/darshan.jpeg" alt="Darshan Portrait"></div></span>
      <span class="char-slot" data-index="2" data-char="r"><span class="char-glyph">r</span><div class="image-tile"><img src="/assets/images/darshan/IMG_3763.JPG" alt="Work"></div></span>
      <span class="char-slot" data-index="3" data-char="s"><span class="char-glyph">s</span><div class="image-tile"><img src="/assets/images/darshan/IMG_4192.JPG" alt=""></div></span>
      <span class="char-slot" data-index="4" data-char="h"><span class="char-glyph">h</span><div class="image-tile"><img src="/assets/images/darshan/IMG_4364.jpg" alt="Work"></div></span>
      <span class="char-slot" data-index="5" data-char="a"><span class="char-glyph">a</span><div class="image-tile"><img src="/assets/images/darshan/IMG_6965.jpg" alt=""></div></span>
      <span class="char-slot" data-index="6" data-char="n"><span class="char-glyph">n</span><div class="image-tile"><img src="/assets/images/darshan/IMG_7845.JPG" alt=""></div></span>
      <span class="char-space">&nbsp;</span>
      <span class="char-slot" data-index="7" data-char="N"><span class="char-glyph">N</span><div class="image-tile"><img src="/assets/images/darshan/IMG_8863-EDIT.jpg" alt=""></div></span>
      <span class="char-slot" data-index="8" data-char="a"><span class="char-glyph">a</span><div class="image-tile"><img src="/assets/images/darshan/IMG_2461.JPG" alt=""></div></span>
      <span class="char-slot" data-index="9" data-char="i"><span class="char-glyph">i</span><div class="image-tile"><img src="/assets/images/darshan/IMG_1499.JPG" alt="Work"></div></span>
      <span class="char-slot" data-index="10" data-char="d"><span class="char-glyph">d</span><div class="image-tile"><img src="/assets/images/darshan/IMG_6965.jpg" alt="Work"></div></span>
      <span class="char-slot" data-index="11" data-char="u"><span class="char-glyph">u</span><div class="image-tile"><img src="/assets/images/darshan/IMG_8213.jpg" alt=""></div></span>
    </div>
  `;
}

function setSlotState(tl, slots, naturalWidths, tileDimension, index, config, position) {
  const slot = slots[index];
  if (!slot) return;
  const glyph = slot.querySelector(".char-glyph");
  const tile = slot.querySelector(".image-tile");
  const img = tile ? tile.querySelector("img") : null;

  const naturalW = naturalWidths[index] || 16;
  const targetW = config.active ? tileDimension : naturalW;
  const duration = config.duration || 0.42;
  const ease = config.ease || "power2.out";

  // Mobile-aware card margin: 2px on phones, 3px on desktop
  const marginVal = window.innerWidth < 480 ? 2 : 3;

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
  cleanup();

  const wordmarks = document.querySelectorAll(".footer-wordmark");
  if (!wordmarks.length) return;

  wordmarks.forEach((el) => {
    // Inject full kinetic markup if only static text is present
    if (!el.querySelector(".footer-kinetic-container")) {
      el.innerHTML = createWordmarkMarkup();
    }
    el.classList.add("is-kinetic-ready", "footer-kinetic-wordmark");
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
      slot.style.marginLeft = "0";
      slot.style.marginRight = "0";
      if (glyph) {
        glyph.style.transform = "none";
        glyph.style.opacity = "1";
        const rect = glyph.getBoundingClientRect();
        const exactW = Math.ceil(rect.width * 100) / 100;
        naturalWidths.push(exactW);
        slot.style.width = `${exactW}px`;
      } else {
        naturalWidths.push(16);
      }
    });

    const sample = slots[0];
    const rect = sample.getBoundingClientRect();
    tileDimension = Math.round(rect.height) || 32;
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

    // ----------------------------------------------------
    // PHASE A: Clean Opening (0.00s - 0.45s)
    // Complete word "Darshan Naidu" centered, stationary white on black
    // ----------------------------------------------------
    slots.forEach((slot, idx) => {
      const glyph = slot.querySelector(".char-glyph");
      const tile = slot.querySelector(".image-tile");
      tl.set(slot, { width: naturalWidths[idx] || 16, marginLeft: 0, marginRight: 0 }, 0);
      if (glyph) tl.set(glyph, { opacity: 1, scale: 1 }, 0);
      if (tile) tl.set(tile, { opacity: 0, scale: 0.5 }, 0);
    });

    // ----------------------------------------------------
    // PHASE B: First Subtle Card Insertion (0.45s - 1.35s)
    // Solo tile at i(9) in Naidu: "Darshan Na [photo] du"
    // ----------------------------------------------------
    setSlotState(tl, slots, naturalWidths, tileDimension, 9, { active: true, image: IMAGES.shot1, duration: 0.44 }, 0.45);
    swapSlotImage(tl, slots, 9, IMAGES.shot2, 0.90, 0.28);
    setSlotState(tl, slots, naturalWidths, tileDimension, 9, { active: false, duration: 0.40 }, 1.35);

    // ----------------------------------------------------
    // PHASE C: Leftward Flow to First Name (1.50s - 2.40s)
    // Solo tile at r(2) in Darshan: "Da [photo] shan Naidu"
    // ----------------------------------------------------
    setSlotState(tl, slots, naturalWidths, tileDimension, 2, { active: true, image: IMAGES.shot3, duration: 0.44 }, 1.50);
    swapSlotImage(tl, slots, 2, IMAGES.shot4, 1.95, 0.28);
    setSlotState(tl, slots, naturalWidths, tileDimension, 2, { active: false, duration: 0.40 }, 2.40);

    // ----------------------------------------------------
    // PHASE D: Balanced Dual Bloom (2.55s - 3.55s)
    // Exactly 1 tile in each word: h(4) in Darshan & d(10) in Naidu
    // "Dars [photo] an Nai [photo] u" — perfectly balanced
    // ----------------------------------------------------
    setSlotState(tl, slots, naturalWidths, tileDimension, 4, { active: true, image: IMAGES.shot5, duration: 0.44 }, 2.55);
    setSlotState(tl, slots, naturalWidths, tileDimension, 10, { active: true, image: IMAGES.shot6, duration: 0.44 }, 2.65);
    swapSlotImage(tl, slots, 10, IMAGES.shot7, 3.05, 0.28);
    setSlotState(tl, slots, naturalWidths, tileDimension, 4, { active: false, duration: 0.40 }, 3.55);
    setSlotState(tl, slots, naturalWidths, tileDimension, 10, { active: false, duration: 0.40 }, 3.60);

    // ----------------------------------------------------
    // PHASE E: Collapse to Solo Hero Card (3.75s - 4.85s)
    // Celebrations signature move: solo tile right after initial 'D'
    // "D [Portrait] rshan Naidu"
    // ----------------------------------------------------
    setSlotState(tl, slots, naturalWidths, tileDimension, 1, { active: true, image: IMAGES.portrait, duration: 0.46 }, 3.75);

    // ----------------------------------------------------
    // PHASE F: Final Reset (4.85s - 5.35s)
    // Clean transition revealing complete white word "Darshan Naidu"
    // ----------------------------------------------------
    setSlotState(tl, slots, naturalWidths, tileDimension, 1, { active: false, duration: 0.44 }, 4.85);

    // ----------------------------------------------------
    // PHASE G: Resting Hold (5.35s - 7.15s)
    // Clean stationary readable state before repeat
    // ----------------------------------------------------
    tl.to({}, { duration: 1.8 }, 5.35);

    masterTimeline = tl;

    // Use ScrollTrigger for robust mobile & desktop viewport detection
    if (typeof ScrollTrigger !== "undefined") {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top bottom+=150",
        end: "bottom top-=150",
        onEnter: () => masterTimeline && masterTimeline.play(),
        onLeave: () => masterTimeline && masterTimeline.pause(),
        onEnterBack: () => masterTimeline && masterTimeline.play(),
        onLeaveBack: () => masterTimeline && masterTimeline.pause(),
      });
    }

    return tl;
  }

  // Pre-measure immediately so text is never unstyled
  measure();

  // Preload authentic Darshan photography then start smooth timeline
  preloadAssets(IMAGES, () => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build);
    } else {
      build();
    }
  });

  // Re-measure accurately on resize or mobile orientation change
  let rTimer = null;
  const onResize = () => {
    clearTimeout(rTimer);
    rTimer = setTimeout(() => {
      const prog = masterTimeline ? masterTimeline.progress() : 0;
      build();
      if (masterTimeline) masterTimeline.progress(prog);
    }, 150);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);

  // Replay on click / tap
  container.addEventListener("click", () => {
    if (masterTimeline) masterTimeline.restart();
  });
}

export function cleanup() {
  if (masterTimeline) {
    masterTimeline.kill();
    masterTimeline = null;
  }
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
}

export default {
  init: initFooterKinetic,
  cleanup,
};
