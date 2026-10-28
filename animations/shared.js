import footer from "./general/footer.js";
import projectTeaser from "./general/projectTeaser.js";
import swiper from "./general/swiper.js";
import scrollText from "./shared/scrollText.js";
import imageReveal from "./general/imageReveal.js";
import navScroll from "./shared/navScroll.js";
import magnetic from "./general/magnetic.js";
import spotlightTilt from "./general/spotlightTilt.js";
import scrollProgress from "./general/scrollProgress.js";
import scrollParallax from "./general/scrollParallax.js";
import clickPulse from "./general/clickPulse.js";

function init() {
  navScroll.init();
  scrollText.init();
  swiper.init();
  imageReveal.init();
  footer.init();

  // High-end GSAP interactions (inspired by GSAP.com, MadeWithGSAP, Brandon Yasin, Daksh Gajjar, Grace Fashion)
  try {
    magnetic.init();
    spotlightTilt.init();
    scrollProgress.init();
    scrollParallax.init();
    clickPulse.init();
  } catch (err) {
    console.warn("GSAP interactive effects init:", err);
  }
}

function cleanup() {
  navScroll.cleanup();
  scrollText.cleanup();
  swiper.cleanup();
  imageReveal.cleanup();
  footer.cleanup();

  try {
    magnetic.cleanup();
    spotlightTilt.cleanup();
    scrollProgress.cleanup();
    scrollParallax.cleanup();
    clickPulse.cleanup();
  } catch (err) {
    console.warn("GSAP interactive effects cleanup:", err);
  }
}

export default { init, cleanup };
